import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Char "mo:core/Char";
import Time "mo:core/Time";
import Types "../types/jobs";
import PricingTypes "../types/pricing";
import PricingLib "pricing";

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
  public type QuoteInput = Types.QuoteInput;
  public type QuoteLineItem = Types.QuoteLineItem;
  public type QuoteStatus = Types.QuoteStatus;
  public type QuoteView = Types.QuoteView;
  public type QuoteEmailResult = Types.QuoteEmailResult;
  public type QuotePricing = Types.QuotePricing;
  public type DiscountRule = PricingTypes.DiscountRule;
  public type TaxSetting = PricingTypes.TaxSetting;
  public type DepositSetting = PricingTypes.DepositSetting;

  /// The default monthly package deal: a fixed monthly price covering a set
  /// number of visits per month.
  let defaultMonthlyPrice : Nat = 19900;
  let defaultIncludedVisits : Nat = 4;

  /// Convert an internal job record into its shared view.
  public func jobRecordToView(record : Types.JobRecord) : Types.JobRecordView {
    {
      id = record.id;
      jobRequestId = record.jobRequestId;
      referenceCode = record.referenceCode;
      customerId = record.customerId;
      customerName = record.customerName;
      serviceAddress = record.serviceAddress;
      category = record.category;
      scheduledAt = record.scheduledAt;
      quote = record.quote;
      pricing = record.pricing;
      deposit = record.deposit;
      remainingBalance = record.remainingBalance;
      status = record.status;
      createdAt = record.createdAt;
      completedAt = record.completedAt;
    };
  };

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

  /// The subtotal of a quote: the sum of every line item (quantity × unit
  /// price) plus the labor and materials/additional charges, before any
  /// discount. All amounts are in cents.
  public func quoteSubtotal(lineItems : [QuoteLineItem], laborCharge : Nat, materialsCharge : Nat) : Nat {
    var sum = 0;
    for (item in lineItems.values()) {
      sum += item.quantity * item.unitPrice;
    };
    sum + laborCharge + materialsCharge;
  };

  /// The total of a quote: the subtotal less the discount amount. Never
  /// negative, so a discount larger than the subtotal clamps to zero.
  public func quoteTotal(subtotal : Nat, discountAmount : Nat) : Nat {
    if (discountAmount >= subtotal) { 0 } else { subtotal - discountAmount };
  };

  /// Build a complete quote from admin input, computing the automatic pricing
  /// breakdown: the subtotal, the applicable discount (with the reason it was
  /// or was not applied), the adjusted subtotal, tax when configured, the final
  /// total, the deposit (exactly the configured percentage of the final total,
  /// 10% by default) and the remaining balance. The derived totals are computed
  /// here so runtime and migrated records agree.
  func buildQuote(
    job : JobRequest,
    input : QuoteInput,
    quoteNumber : Text,
    createdAt : Types.Timestamp,
    status : QuoteStatus,
    rules : [DiscountRule],
    tax : TaxSetting,
    deposit : DepositSetting,
    returningCustomer : Bool,
  ) : Quote {
    let subtotal = quoteSubtotal(input.lineItems, input.laborCharge, input.materialsCharge);
    let context : PricingTypes.DiscountContext = {
      subtotal;
      ownParts = job.ownParts;
      returningCustomer;
    };
    let pricing = PricingLib.computePricing(subtotal, rules, context, tax, deposit, createdAt);
    {
      amount = pricing.finalTotal;
      note = input.note;
      sentAt = createdAt;
      discountApplied = pricing.discount.applied;
      discountAmount = pricing.discountAmount;
      quoteNumber;
      createdAt;
      workDescription = input.workDescription;
      lineItems = input.lineItems;
      laborCharge = input.laborCharge;
      materialsCharge = input.materialsCharge;
      subtotal = pricing.originalSubtotal;
      total = pricing.finalTotal;
      depositRequired = pricing.depositAmount;
      remainingBalance = pricing.remainingBalance;
      expiresAt = input.expiresAt;
      status;
      pricing = ?pricing;
    };
  };

  /// Attach a quote to a job request, computing the automatic pricing breakdown
  /// from the saved discount rules and the tax and deposit settings. The quote
  /// starts in the `#sent` state and moves the job to `#quoted`.
  public func setQuote(
    job : JobRequest,
    input : QuoteInput,
    now : Types.Timestamp,
    rules : [DiscountRule],
    tax : TaxSetting,
    deposit : DepositSetting,
    returningCustomer : Bool,
  ) : () {
    let quote = buildQuote(job, input, "Q-" # job.referenceCode, now, #sent, rules, tax, deposit, returningCustomer);
    job.quote := ?quote;
    job.status := #quoted;
  };

  /// Edit an existing quote in place, recomputing the automatic pricing
  /// breakdown while preserving its quote number, creation date and current
  /// approval status. Returns false when the job has no quote to edit.
  public func editQuote(
    job : JobRequest,
    input : QuoteInput,
    now : Types.Timestamp,
    rules : [DiscountRule],
    tax : TaxSetting,
    deposit : DepositSetting,
    returningCustomer : Bool,
  ) : Bool {
    switch (job.quote) {
      case (?existing) {
        let quote = buildQuote(job, input, existing.quoteNumber, existing.createdAt, existing.status, rules, tax, deposit, returningCustomer);
        job.quote := ?quote;
        true;
      };
      case null { false };
    };
  };

  /// Mark a quote as sent to the customer. Returns false when the job has no
  /// quote.
  public func sendQuote(job : JobRequest, now : Types.Timestamp) : Bool {
    switch (job.quote) {
      case (?q) {
        job.quote := ?{ q with sentAt = now; status = #sent };
        job.status := #quoted;
        true;
      };
      case null { false };
    };
  };

  /// Whether a quote has expired at `now`. A quote with no expiration never
  /// expires. An expired quote cannot be accepted.
  public func isQuoteExpired(quote : Quote, now : Types.Timestamp) : Bool {
    switch (quote.expiresAt) {
      case (?expiresAt) { now > expiresAt };
      case null { false };
    };
  };

  /// Project a quote into the customer-facing view, deriving the `expired`
  /// flag from `expiresAt` against `now`.
  public func quoteToView(referenceCode : ReferenceCode, quote : Quote, now : Types.Timestamp) : QuoteView {
    {
      referenceCode;
      quoteNumber = quote.quoteNumber;
      workDescription = quote.workDescription;
      note = quote.note;
      lineItems = quote.lineItems;
      laborCharge = quote.laborCharge;
      materialsCharge = quote.materialsCharge;
      subtotal = quote.subtotal;
      discountApplied = quote.discountApplied;
      discountAmount = quote.discountAmount;
      total = quote.total;
      depositRequired = quote.depositRequired;
      remainingBalance = quote.remainingBalance;
      expiresAt = quote.expiresAt;
      status = quote.status;
      expired = isQuoteExpired(quote, now);
      pricing = quote.pricing;
    };
  };

  /// Render a timestamp as a UTC calendar date (`YYYY-MM-DD`). Used for the
  /// quote expiration date in the customer email.
  func formatDate(ts : Types.Timestamp) : Text {
    let seconds = ts / 1_000_000_000;
    let days = seconds / 86400;
    let (year, month, day) = civilFromDays(days);
    year.toText() # "-" # pad2(month) # "-" # pad2(day);
  };

  /// Zero-pad a positive number to two digits.
  func pad2(n : Int) : Text {
    if (n < 10) { "0" # n.toText() } else { n.toText() };
  };

  /// Convert a count of days since the Unix epoch into a civil (year, month,
  /// day) triple using Howard Hinnant's days-from-civil algorithm.
  func civilFromDays(days : Int) : (Int, Int, Int) {
    let z = days + 719468;
    let era = (if (z >= 0) { z } else { z - 146096 }) / 146097;
    let doe = z - era * 146097;
    let yoe = (doe - doe / 1460 + doe / 36524 - doe / 146096) / 365;
    let y = yoe + era * 400;
    let doy = doe - (365 * yoe + yoe / 4 - yoe / 100);
    let mp = (5 * doy + 2) / 153;
    let d = doy - (153 * mp + 2) / 5 + 1;
    let m = if (mp < 10) { mp + 3 } else { mp - 9 };
    let year = if (m <= 2) { y + 1 } else { y };
    (year, m, d);
  };

  /// Format a cents amount as a US dollar string (`$1,234.56`).
  func formatMoney(cents : Nat) : Text {
    let dollars = cents / 100;
    let remainder = cents % 100;
    "$" # groupThousands(dollars) # "." # pad2(remainder);
  };

  /// Insert thousands separators into a non-negative integer.
  func groupThousands(n : Nat) : Text {
    let digits = n.toText();
    let length = digits.size();
    if (length <= 3) { return digits };
    var result = "";
    var index = 0;
    for (char in digits.toIter()) {
      let remaining = length - index;
      if (index > 0 and remaining % 3 == 0) { result #= "," };
      result #= char.toText();
      index += 1;
    };
    result;
  };

  /// Build the itemized transactional email body for a quote: quote number,
  /// work description, each line item with quantity and unit price, labor,
  /// materials, subtotal, own-parts discount, total, deposit required,
  /// remaining balance, expiration date, the owner's note, and the accept and
  /// decline links.
  public func quoteEmailBody(job : JobRequest, quote : Quote, acceptUrl : Text, declineUrl : Text) : Text {
    var body = "Hello " # job.customerName # ",\n\n" #
      "Here is your quote " # quote.quoteNumber # " for request " # job.referenceCode # ".\n\n";
    if (quote.workDescription.size() > 0) {
      body #= "Work: " # quote.workDescription # "\n\n";
    };
    body #= "Line items:\n";
    for (item in quote.lineItems.values()) {
      body #= "- " # item.description # " x" # item.quantity.toText() #
        " @ " # formatMoney(item.unitPrice) # " = " #
        formatMoney(item.quantity * item.unitPrice) # "\n";
    };
    body #= "\n";
    if (quote.laborCharge > 0) {
      body #= "Labor: " # formatMoney(quote.laborCharge) # "\n";
    };
    if (quote.materialsCharge > 0) {
      body #= "Materials: " # formatMoney(quote.materialsCharge) # "\n";
    };
    body #= "Subtotal: " # formatMoney(quote.subtotal) # "\n";
    if (quote.discountApplied) {
      body #= "Discount: -" # formatMoney(quote.discountAmount) # "\n";
    };
    switch (quote.pricing) {
      case (?pricing) {
        if (pricing.taxAmount > 0) {
          body #= "Tax: " # formatMoney(pricing.taxAmount) # "\n";
        };
      };
      case null {};
    };
    body #= "Total: " # formatMoney(quote.total) # "\n" #
      "Deposit required: " # formatMoney(quote.depositRequired) # "\n" #
      "Remaining balance: " # formatMoney(quote.remainingBalance) # "\n";
    switch (quote.expiresAt) {
      case (?expiresAt) { body #= "Expires: " # formatDate(expiresAt) # "\n" };
      case null {};
    };
    if (quote.note.size() > 0) {
      body #= "\nNote from Honey Do's:\n" # quote.note # "\n";
    };
    body #= "\nAccept your quote:\n" # acceptUrl # "\n\n" #
      "Decline your quote:\n" # declineUrl # "\n\n" #
      "Thank you,\nHoney Do's";
    body;
  };

  /// Mark a quote as approved by the customer. Returns false when the job has
  /// no quote.
  public func approveQuote(job : JobRequest) : Bool {
    switch (job.quote) {
      case (?q) {
        job.quote := ?{ q with status = #approved };
        true;
      };
      case null { false };
    };
  };

  /// Mark a quote as declined by the customer. Returns false when the job has
  /// no quote.
  public func declineQuote(job : JobRequest) : Bool {
    switch (job.quote) {
      case (?q) {
        job.quote := ?{ q with status = #declined };
        true;
      };
      case null { false };
    };
  };

  /// Convert an approved quote into a scheduled job. The quote must exist and
  /// be approved; the job is scheduled at `scheduledAt` and its status moves to
  /// `#scheduled`. Returns false when the job has no approved quote.
  public func convertQuoteToJob(job : JobRequest, scheduledAt : Types.Timestamp) : Bool {
    switch (job.quote) {
      case (?q) {
        if (q.status != #approved) { return false };
        job.appointment := ?{ scheduledAt; confirmed = false };
        job.status := #scheduled;
        true;
      };
      case null { false };
    };
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

  /// The deposit owed on a job request: exactly the configured percentage of
  /// the final approved quote total after discounts and adjustments (10% by
  /// default). A quote carrying a pricing breakdown uses its computed deposit;
  /// a legacy quote without pricing falls back to its stored deposit
  /// requirement.
  public func depositAmount(job : JobRequest) : Nat {
    switch (job.quote) {
      case (?q) {
        switch (q.pricing) {
          case (?pricing) { pricing.depositAmount };
          case null { q.depositRequired };
        };
      };
      case null { 0 };
    };
  };

  /// Record a deposit payment against a job request. The deposit is recorded as
  /// verified immediately, since this path represents an already-confirmed
  /// payment.
  public func recordDeposit(job : JobRequest, method : Types.PaymentMethod, now : Types.Timestamp) : () {
    job.deposit := ?{
      amount = depositAmount(job);
      paid = true;
      method;
      paidAt = ?now;
      stripeSessionId = null;
      status = #verified;
      submittedAt = ?now;
      verifiedAt = ?now;
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
          status = #pending;
          submittedAt = null;
          verifiedAt = null;
        };
      };
    };
    job.deposit := ?{
      amount = existing.amount;
      paid = existing.paid;
      method = existing.method;
      paidAt = existing.paidAt;
      stripeSessionId = ?sessionId;
      status = existing.status;
      submittedAt = existing.submittedAt;
      verifiedAt = existing.verifiedAt;
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
          status = #verified;
          submittedAt = d.submittedAt;
          verifiedAt = ?now;
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

  /// Advance a job request to the next lifecycle status. A cancelled job is
  /// terminal and is left unchanged.
  public func advanceStatus(job : JobRequest) : () {
    switch (job.status) {
      case (#requested) { job.status := #quoted };
      case (#quoted) { job.status := #scheduled };
      case (#scheduled) { job.status := #inProgress };
      case (#inProgress) { job.status := #completed };
      case (#completed) {};
      case (#cancelled) {};
    };
  };

  /// Cancel a job request. Cancellation is terminal: a completed job cannot be
  /// cancelled, and cancelling an already-cancelled job is a no-op. Returns
  /// whether the job moved to the cancelled status.
  public func cancelJob(job : JobRequest) : Bool {
    switch (job.status) {
      case (#completed) { false };
      case (#cancelled) { false };
      case (_) {
        job.status := #cancelled;
        true;
      };
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
        case (#cancelled) {};
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

  /// Build a job record from a confirmed request or quote. The record captures
  /// the customer, service, address, scheduled date/time, quote, pricing
  /// breakdown, deposit, remaining balance and initial job status. The quote and
  /// deposit are copied from the request so the job keeps a permanent snapshot.
  public func newJobRecord(
    id : Types.JobRecordId,
    job : JobRequest,
    customerId : Types.CustomerId,
    customerName : Text,
    serviceAddress : Text,
    scheduledAt : Types.Timestamp,
    now : Types.Timestamp,
  ) : Types.JobRecord {
    let pricing = switch (job.quote) {
      case (?q) { q.pricing };
      case null { null };
    };
    let remaining = switch (pricing) {
      case (?p) { p.remainingBalance };
      case null {
        switch (job.quote) {
          case (?q) { q.remainingBalance };
          case null { 0 };
        };
      };
    };
    {
      id;
      jobRequestId = job.id;
      referenceCode = job.referenceCode;
      customerId;
      customerName;
      serviceAddress;
      category = job.category;
      scheduledAt;
      quote = job.quote;
      pricing;
      deposit = job.deposit;
      remainingBalance = remaining;
      var status = #scheduled;
      createdAt = now;
      var completedAt = null;
    };
  };

  /// Rebuild a job record with a new deposit snapshot, preserving its status and
  /// completion time. Used when a deposit is submitted or verified after the job
  /// was created.
  public func withDeposit(record : Types.JobRecord, deposit : ?Types.Deposit) : Types.JobRecord {
    {
      id = record.id;
      jobRequestId = record.jobRequestId;
      referenceCode = record.referenceCode;
      customerId = record.customerId;
      customerName = record.customerName;
      serviceAddress = record.serviceAddress;
      category = record.category;
      scheduledAt = record.scheduledAt;
      quote = record.quote;
      pricing = record.pricing;
      deposit;
      remainingBalance = record.remainingBalance;
      var status = record.status;
      createdAt = record.createdAt;
      var completedAt = record.completedAt;
    };
  };

  /// Advance a job record to its next lifecycle status. A completed or cancelled
  /// job is terminal and is left unchanged.
  public func advanceJobRecordStatus(record : Types.JobRecord) : () {
    switch (record.status) {
      case (#scheduled) { record.status := #inProgress };
      case (#inProgress) { record.status := #completed };
      case (#completed) {};
      case (#cancelled) {};
    };
  };

  /// Mark a job record completed and stamp its completion time.
  public func completeJobRecord(record : Types.JobRecord, now : Types.Timestamp) : () {
    record.status := #completed;
    record.completedAt := ?now;
  };

  /// Cancel a job record. Cancellation is terminal: a completed or already
  /// cancelled job is left unchanged. Returns whether the job moved to
  /// cancelled.
  public func cancelJobRecord(record : Types.JobRecord) : Bool {
    switch (record.status) {
      case (#completed) { false };
      case (#cancelled) { false };
      case (_) {
        record.status := #cancelled;
        true;
      };
    };
  };
};
