import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Debug "mo:core/Debug";
import Types "../types/jobs";

module {
  public type JobRequest = Types.JobRequest;
  public type JobRequestView = Types.JobRequestView;
  public type JobRequestInput = Types.JobRequestInput;
  public type JobStatus = Types.JobStatus;
  public type Quote = Types.Quote;
  public type Deposit = Types.Deposit;
  public type Appointment = Types.Appointment;
  public type Review = Types.Review;
  public type DashboardStats = Types.DashboardStats;
  public type ReferenceCode = Types.ReferenceCode;
  public type JobId = Types.JobId;
  public type Bee = Types.Bee;
  public type BeeView = Types.BeeView;
  public type BeeInput = Types.BeeInput;
  public type BeeId = Types.BeeId;
  public type PackagePlan = Types.PackagePlan;
  public type PackageEnrollment = Types.PackageEnrollment;
  public type VisitRecord = Types.VisitRecord;

  /// The default monthly package deal: a fixed monthly price covering a set
  /// number of visits per month.
  let defaultMonthlyPrice : Nat = 19900;
  let defaultIncludedVisits : Nat = 4;

  /// Convert an internal job request into its shared view.
  public func toView(job : JobRequest) : JobRequestView {
    {
      id = job.id;
      referenceCode = job.referenceCode;
      customerName = job.customerName;
      email = job.email;
      phone = job.phone;
      category = job.category;
      description = job.description;
      preferredTiming = job.preferredTiming;
      photoIds = job.photoIds;
      createdAt = job.createdAt;
      ownParts = job.ownParts;
      status = job.status;
      quote = job.quote;
      deposit = job.deposit;
      appointment = job.appointment;
      review = job.review;
      assignedBeeId = job.assignedBeeId;
      assignedBeeName = null;
      packageEnrollment = job.packageEnrollment;
      completedAt = job.completedAt;
    };
  };

  /// Generate a unique public reference code for a new job request.
  public func generateReferenceCode() : ReferenceCode {
    let now = Time.now();
    let suffix = (now % 1000000).toNat();
    "HD-" # suffix.toText();
  };

  /// Create a new job request record from guest input.
  public func newRequest(id : JobId, referenceCode : ReferenceCode, input : JobRequestInput, now : Types.Timestamp) : JobRequest {
    {
      id;
      referenceCode;
      customerName = input.customerName;
      email = input.email;
      phone = input.phone;
      category = input.category;
      description = input.description;
      preferredTiming = input.preferredTiming;
      photoIds = input.photoIds;
      createdAt = now;
      ownParts = input.ownParts;
      var status = #requested;
      var quote = null;
      var deposit = null;
      var appointment = null;
      var review = null;
      var assignedBeeId = null;
      var packageEnrollment = null;
      var completedAt = null;
    };
  };

  /// Attach a quote to a job request, applying the own-parts/supplies discount
  /// when the customer indicated they supply their own parts.
  public func setQuote(job : JobRequest, amount : Nat, note : Text, now : Types.Timestamp) : () {
    let discountAmount = if (job.ownParts) { amount / Types.ownPartsDiscountPercent } else { 0 };
    let finalAmount = Nat.sub(amount, discountAmount);
    job.quote := ?{
      amount = finalAmount;
      note;
      sentAt = now;
      discountApplied = job.ownParts;
      discountAmount;
    };
    job.status := #quoted;
  };

  /// Mark a quoted job request as accepted, making the deposit step reachable.
  public func acceptQuote(job : JobRequest) : () {
    job.status := #scheduled;
  };

  /// Extract the Stripe checkout session id from the client's JSON response.
  public func parseCheckoutSessionId(response : Text) : ?Text {
    let parts = response.split(#text "\"id\"").toArray();
    if (parts.size() < 2) { return null };
    let after = parts[1];
    let colonParts = after.split(#text ":").toArray();
    if (colonParts.size() < 2) { return null };
    let value = colonParts[1].trim(#text " ").trim(#text "\"").trim(#text ",");
    if (value.size() == 0) { null } else { ?value };
  };

  /// The deposit owed on a job request: 50% of the accepted quote total.
  public func depositAmount(job : JobRequest) : Nat {
    switch (job.quote) {
      case (?q) { q.amount / 2 };
      case null { 0 };
    };
  };

  /// Record a deposit payment against a job request.
  public func recordDeposit(job : JobRequest, method : Types.PaymentMethod, now : Types.Timestamp) : () {
    job.deposit := ?{
      amount = depositAmount(job);
      paid = true;
      method;
      paidAt = ?now;
      stripeSessionId = null;
    };
  };

  /// Attach a pending Stripe checkout session to a job request's deposit.
  public func setDepositSession(job : JobRequest, sessionId : Text) : () {
    let existing = switch (job.deposit) {
      case (?d) { d };
      case null {
        {
          amount = depositAmount(job);
          paid = false;
          method = #stripe;
          paidAt = null;
          stripeSessionId = null;
        };
      };
    };
    job.deposit := ?{
      amount = existing.amount;
      paid = existing.paid;
      method = existing.method;
      paidAt = existing.paidAt;
      stripeSessionId = ?sessionId;
    };
  };

  /// Mark the deposit paid once Stripe reports its checkout session completed.
  public func markDepositPaid(job : JobRequest, now : Types.Timestamp) : () {
    switch (job.deposit) {
      case (?d) {
        job.deposit := ?{
          amount = d.amount;
          paid = true;
          method = d.method;
          paidAt = ?now;
          stripeSessionId = d.stripeSessionId;
        };
      };
      case null {};
    };
  };

  /// Schedule an appointment for a job request.
  public func scheduleAppointment(job : JobRequest, scheduledAt : Types.Timestamp) : () {
    job.appointment := ?{ scheduledAt; confirmed = false };
    job.status := #scheduled;
  };

  /// Confirm the scheduled appointment for a job request.
  public func confirmAppointment(job : JobRequest) : () {
    switch (job.appointment) {
      case (?a) { job.appointment := ?{ scheduledAt = a.scheduledAt; confirmed = true } };
      case null {};
    };
  };

  /// Advance a job request to the next lifecycle status.
  public func advanceStatus(job : JobRequest) : () {
    switch (job.status) {
      case (#requested) { job.status := #quoted };
      case (#quoted) { job.status := #scheduled };
      case (#scheduled) { job.status := #inProgress };
      case (#inProgress) { job.status := #completed };
      case (#completed) {};
    };
  };

  /// Attach a review to a completed job request.
  public func addReview(job : JobRequest, rating : Nat, comment : Text, now : Types.Timestamp) : () {
    job.review := ?{ rating; comment; createdAt = now };
  };

  /// Compute admin dashboard statistics from all job requests.
  public func computeStats(jobs : [JobRequest]) : DashboardStats {
    var newRequests = 0;
    var upcomingAppointments = 0;
    var depositsCollected = 0;
    var activeJobs = 0;
    var reviewsCount = 0;
    for (job in jobs.values()) {
      switch (job.status) {
        case (#requested) { newRequests += 1 };
        case (#quoted) { newRequests += 1 };
        case (#scheduled) { activeJobs += 1 };
        case (#inProgress) { activeJobs += 1 };
        case (#completed) {};
      };
      switch (job.appointment) {
        case (?a) { if (not a.confirmed) { upcomingAppointments += 1 } };
        case null {};
      };
      switch (job.deposit) {
        case (?d) { if (d.paid) { depositsCollected += d.amount } };
        case null {};
      };
      switch (job.review) {
        case (?_) { reviewsCount += 1 };
        case null {};
      };
    };
    { newRequests; upcomingAppointments; depositsCollected; activeJobs; reviewsCount };
  };

  /// Create a new bee record from owner input.
  public func newBee(id : BeeId, input : BeeInput, now : Types.Timestamp) : Bee {
    { id; name = input.name; specialty = input.specialty; createdAt = now };
  };

  /// Convert an internal bee into its shared view.
  public func beeToView(bee : Bee) : BeeView {
    { id = bee.id; name = bee.name; specialty = bee.specialty; createdAt = bee.createdAt };
  };

  /// Update a bee's name and specialty, returning the rebuilt record.
  public func updateBee(bee : Bee, input : BeeInput) : Bee {
    { id = bee.id; name = input.name; specialty = input.specialty; createdAt = bee.createdAt };
  };

  /// Assign a bee to a job request.
  public func assignBee(job : JobRequest, beeId : BeeId) : () {
    job.assignedBeeId := ?beeId;
  };

  /// The default monthly package plan offered to customers.
  public func defaultPackagePlan() : PackagePlan {
    { monthlyPrice = defaultMonthlyPrice; includedVisits = defaultIncludedVisits };
  };

  /// Enroll a job request's customer in the monthly package.
  public func enrollPackage(job : JobRequest, plan : PackagePlan, now : Types.Timestamp) : () {
    job.packageEnrollment := ?{
      active = true;
      monthlyPrice = plan.monthlyPrice;
      includedVisits = plan.includedVisits;
      startedAt = now;
    };
  };

  /// Remove a job request's customer from the monthly package.
  public func cancelPackage(job : JobRequest) : () {
    switch (job.packageEnrollment) {
      case (?p) {
        job.packageEnrollment := ?{
          active = false;
          monthlyPrice = p.monthlyPrice;
          includedVisits = p.includedVisits;
          startedAt = p.startedAt;
        };
      };
      case null {};
    };
  };

  /// Record a completed visit for a job, capturing date, service, and assigned bee.
  public func recordVisit(job : JobRequest, bee : ?Bee, now : Types.Timestamp) : VisitRecord {
    {
      jobId = job.id;
      referenceCode = job.referenceCode;
      service = job.category;
      beeId = switch (bee) { case (?b) ?b.id; case null null };
      beeName = switch (bee) { case (?b) ?b.name; case null null };
      completedAt = now;
    };
  };

  /// Build the newest-first visit history for a set of job requests.
  public func visitHistory(jobs : [JobRequest], bees : [Bee]) : [VisitRecord] {
    let records = jobs.filter(func job = job.status == #completed).map(
      func job = visitRecordOf(job, bees)
    );
    records.sort(func (a, b) = Int.compare(b.completedAt, a.completedAt));
  };

  /// Build a single visit record for a completed job, resolving the assigned bee.
  func visitRecordOf(job : JobRequest, bees : [Bee]) : VisitRecord {
    let bee = switch (job.assignedBeeId) {
      case (?id) { bees.find(func b = b.id == id) };
      case null { null };
    };
    {
      jobId = job.id;
      referenceCode = job.referenceCode;
      service = job.category;
      beeId = switch (bee) { case (?b) ?b.id; case null null };
      beeName = switch (bee) { case (?b) ?b.name; case null null };
      completedAt = job.completedAt ?? job.createdAt;
    };
  };
};
