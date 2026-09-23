import AccessControl "mo:caffeineai-authorization/access-control";
import EmailClient "mo:caffeineai-email/emailClient";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Stripe "mo:caffeineai-stripe/stripe";
import Map "mo:core/Map";
import Result "mo:core/Result";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Debug "mo:core/Debug";
import Types "../types/jobs";
import JobsLib "../lib/jobs";

mixin (
  jobs : Map.Map<Types.JobId, Types.JobRequest>,
  bees : Map.Map<Types.BeeId, Types.Bee>,
  state : { var nextJobId : Nat; var nextBeeId : Nat },
  accessControlState : AccessControl.AccessControlState,
  stripeConfiguration : { var config : ?Stripe.StripeConfiguration },
  ownerEmail : { var address : Text },
  transform : OutCall.Transform,
) {
  func requireAdminCaller(caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) {};
      case (_) { Runtime.trap("Unauthorized: Only admins can perform this action") };
    };
  };

  func findJobByReference(referenceCode : Types.ReferenceCode) : ?Types.JobRequest {
    jobs.values().find(func job = job.referenceCode == referenceCode);
  };

  /// Send a notification email and report the outcome. Email delivery must
  /// never block or abort a state change, so a failure or trap from the email
  /// integration is caught, logged, and returned as `#err` rather than
  /// swallowed silently.
  func notifyByEmail(recipient : Text, subject : Text, body : Text) : async EmailClient.SendResult {
    try {
      let result = await EmailClient.sendServiceEmail("Honey Do's", [recipient], subject, body);
      switch (result) {
        case (#ok) {};
        case (#err(error)) {
          Debug.print("Email notification to " # recipient # " failed: " # error);
        };
      };
      result;
    } catch (error) {
      let message = "Email notification to " # recipient # " trapped: " # error.message();
      Debug.print(message);
      #err(message);
    };
  };

  /// Render a service category as human-readable text for notifications.
  func categoryLabel(category : Types.ServiceCategory) : Text {
    switch (category) {
      case (#house) { "House" };
      case (#yardPlants) { "Yard & Plants" };
      case (#fixIt) { "Fix-It" };
      case (#cleanOrganize) { "Clean & Organize" };
      case (#moveLift) { "Move & Lift" };
      case (#errands) { "Errands" };
      case (#mowing) { "Mowing" };
      case (#showMe) { "Show Me" };
    };
  };

  /// Build the owner notification body for a newly submitted request. Carries
  /// every detail the owner needs to act on the job.
  func newRequestNotificationBody(job : Types.JobRequest) : Text {
    "New job request " # job.referenceCode # "\n\n"
    # "Customer: " # job.customerName # "\n"
    # "Email: " # job.email # "\n"
    # "Phone: " # job.phone # "\n"
    # "Service: " # categoryLabel(job.category) # "\n"
    # "Preferred timing: " # job.preferredTiming # "\n"
    # "Description: " # job.description # "\n";
  };

  func stripeConfigOrTrap() : Stripe.StripeConfiguration {
    stripeConfiguration.config ?? Runtime.trap("Stripe needs to be first configured");
  };

  /// Build the shared view for a job, resolving the assigned bee's name.
  func viewOf(job : Types.JobRequest) : Types.JobRequestView {
    let view = JobsLib.toView(job);
    let beeName = switch (job.assignedBeeId) {
      case (?id) {
        switch (bees.get(id)) {
          case (?bee) ?bee.name;
          case null null;
        };
      };
      case null null;
    };
    { view with assignedBeeName = beeName };
  };

  /// Guest: submit a new job request and receive its public reference code.
  public shared ({ caller }) func submitRequest(input : Types.JobRequestInput) : async Types.ReferenceCode {
    ignore caller;
    let id = state.nextJobId;
    state.nextJobId := id + 1;
    let referenceCode = JobsLib.generateReferenceCode();
    let job = JobsLib.newRequest(id, referenceCode, input, Time.now());
    jobs.add(id, job);
    // The alert is attempted before the request is acknowledged, but a failed
    // or trapped email must never prevent the job from being created and
    // returned to the customer.
    ignore await notifyByEmail(
      ownerEmail.address,
      "New Honey Do's request " # referenceCode,
      newRequestNotificationBody(job),
    );
    referenceCode;
  };

  /// Guest: fetch a job request by its public reference code.
  public query func getRequestByReference(referenceCode : Types.ReferenceCode) : async ?Types.JobRequestView {
    switch (findJobByReference(referenceCode)) {
      case (?job) { ?viewOf(job) };
      case null { null };
    };
  };

  /// Guest: accept the quote attached to a job request.
  public shared ({ caller }) func acceptQuote(referenceCode : Types.ReferenceCode) : async Result.Result<Types.JobRequestView, Types.JobError> {
    ignore caller;
    switch (findJobByReference(referenceCode)) {
      case (?job) {
        switch (job.quote) {
          case (?_) {
            JobsLib.acceptQuote(job);
            #ok(viewOf(job));
          };
          case null { #err(#invalidState("No quote to accept")) };
        };
      };
      case null { #err(#notFound) };
    };
  };

  /// Guest: create a Stripe checkout session for the 50% deposit on an accepted quote.
  public shared ({ caller }) func createDepositCheckoutSession(referenceCode : Types.ReferenceCode, successUrl : Text, cancelUrl : Text) : async Result.Result<Text, Types.JobError> {
    switch (findJobByReference(referenceCode)) {
      case (?job) {
        switch (job.quote) {
          case (?_) {
            let amount = JobsLib.depositAmount(job);
            let items : [Stripe.ShoppingItem] = [{
              currency = "usd";
              productName = "Honey Do's deposit " # referenceCode;
              productDescription = "50% deposit";
              priceInCents = amount;
              quantity = 1;
            }];
            let response = await Stripe.createCheckoutSession(
              stripeConfigOrTrap(),
              caller,
              items,
              successUrl,
              cancelUrl,
              transform,
            );
            switch (JobsLib.parseCheckoutSessionId(response)) {
              case (?sessionId) {
                JobsLib.setDepositSession(job, sessionId);
                #ok(sessionId);
              };
              case null { #err(#paymentError("Could not create checkout session")) };
            };
          };
          case null { #err(#invalidState("No quote to deposit against")) };
        };
      };
      case null { #err(#notFound) };
    };
  };

  /// Guest: confirm a Stripe deposit payment and mark the deposit paid.
  public shared ({ caller }) func confirmDepositPayment(referenceCode : Types.ReferenceCode) : async Result.Result<Types.JobRequestView, Types.JobError> {
    ignore caller;
    switch (findJobByReference(referenceCode)) {
      case (?job) {
        switch (job.deposit) {
          case (?d) {
            switch (d.stripeSessionId) {
              case (?sessionId) {
                let status = await Stripe.getSessionStatus(stripeConfigOrTrap(), sessionId, transform);
                switch (status) {
                  case (#completed(_)) {
                    JobsLib.markDepositPaid(job, Time.now());
                    #ok(viewOf(job));
                  };
                  case (#failed(_)) {
                    #err(#paymentError("Deposit payment is not complete"));
                  };
                };
              };
              case null { #err(#invalidState("No checkout session for this deposit")) };
            };
          };
          case null { #err(#invalidState("No deposit to confirm")) };
        };
      };
      case null { #err(#notFound) };
    };
  };

  /// Guest: record a deposit payment for an accepted quote.
  public shared ({ caller }) func recordDeposit(referenceCode : Types.ReferenceCode, method : Types.PaymentMethod) : async Result.Result<Types.JobRequestView, Types.JobError> {
    ignore caller;
    switch (findJobByReference(referenceCode)) {
      case (?job) {
        switch (job.quote) {
          case (?_) {
            JobsLib.recordDeposit(job, method, Time.now());
            #ok(viewOf(job));
          };
          case null { #err(#invalidState("No quote to deposit against")) };
        };
      };
      case null { #err(#notFound) };
    };
  };

  /// Guest: confirm the scheduled appointment.
  public shared ({ caller }) func confirmAppointment(referenceCode : Types.ReferenceCode) : async Result.Result<Types.JobRequestView, Types.JobError> {
    ignore caller;
    switch (findJobByReference(referenceCode)) {
      case (?job) {
        switch (job.appointment) {
          case (?_) {
            JobsLib.confirmAppointment(job);
            #ok(viewOf(job));
          };
          case null { #err(#invalidState("No appointment to confirm")) };
        };
      };
      case null { #err(#notFound) };
    };
  };

  /// Guest: submit a review for a completed job.
  public shared ({ caller }) func submitReview(referenceCode : Types.ReferenceCode, rating : Nat, comment : Text) : async Result.Result<Types.JobRequestView, Types.JobError> {
    ignore caller;
    switch (findJobByReference(referenceCode)) {
      case (?job) {
        if (job.status != #completed) {
          return #err(#invalidState("Job is not completed"));
        };
        JobsLib.addReview(job, rating, comment, Time.now());
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Guest: read the newest-first visit history for a reference code.
  public query func getVisitHistory(referenceCode : Types.ReferenceCode) : async [Types.VisitRecord] {
    switch (findJobByReference(referenceCode)) {
      case (?job) { JobsLib.visitHistory([job], bees.values().toArray()) };
      case null { [] };
    };
  };

  /// Admin: list all job requests.
  public query ({ caller }) func listRequests() : async [Types.JobRequestView] {
    requireAdminCaller(caller);
    jobs.values().map(func job = viewOf(job)).toArray();
  };

  /// Admin: fetch a single job request by id.
  public query ({ caller }) func getRequest(id : Types.JobId) : async ?Types.JobRequestView {
    requireAdminCaller(caller);
    switch (jobs.get(id)) {
      case (?job) { ?viewOf(job) };
      case null { null };
    };
  };

  /// Admin: set the quote amount and note for a job request. When the customer
  /// indicated they supply their own parts, a 10% discount is applied and
  /// recorded on the quote.
  public shared ({ caller }) func setQuote(id : Types.JobId, amount : Nat, note : Text) : async Result.Result<Types.JobRequestView, Types.JobError> {
    requireAdminCaller(caller);
    switch (jobs.get(id)) {
      case (?job) {
        JobsLib.setQuote(job, amount, note, Time.now());
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: schedule an appointment for a job request. Notifies BOTH the
  /// customer and the owner.
  public shared ({ caller }) func scheduleAppointment(id : Types.JobId, scheduledAt : Types.Timestamp) : async Result.Result<Types.JobRequestView, Types.JobError> {
    requireAdminCaller(caller);
    switch (jobs.get(id)) {
      case (?job) {
        JobsLib.scheduleAppointment(job, scheduledAt);
        let view = viewOf(job);
        ignore await notifyByEmail(
          job.email,
          "Your Honey Do's appointment is set",
          "Your appointment for request " # job.referenceCode # " has been scheduled.",
        );
        ignore await notifyByEmail(
          ownerEmail.address,
          "Appointment set for " # job.referenceCode,
          "An appointment was scheduled for " # job.customerName # " (" # job.email # ").",
        );
        #ok(view);
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: advance a job request to its next lifecycle status.
  public shared ({ caller }) func advanceStatus(id : Types.JobId) : async Result.Result<Types.JobRequestView, Types.JobError> {
    requireAdminCaller(caller);
    switch (jobs.get(id)) {
      case (?job) {
        JobsLib.advanceStatus(job);
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: read dashboard statistics.
  public query ({ caller }) func getDashboardStats() : async Types.DashboardStats {
    requireAdminCaller(caller);
    JobsLib.computeStats(jobs.values().toArray());
  };

  /// Admin: create a bee (employee) with a name and specialty.
  public shared ({ caller }) func createBee(input : Types.BeeInput) : async Result.Result<Types.BeeView, Types.BeeError> {
    requireAdminCaller(caller);
    let id = state.nextBeeId;
    state.nextBeeId := id + 1;
    let bee = JobsLib.newBee(id, input, Time.now());
    bees.add(id, bee);
    #ok(JobsLib.beeToView(bee));
  };

  /// Admin: update a bee's name and specialty.
  public shared ({ caller }) func updateBee(id : Types.BeeId, input : Types.BeeInput) : async Result.Result<Types.BeeView, Types.BeeError> {
    requireAdminCaller(caller);
    switch (bees.get(id)) {
      case (?bee) {
        let updated = JobsLib.updateBee(bee, input);
        bees.add(id, updated);
        #ok(JobsLib.beeToView(updated));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: list all bees.
  public query ({ caller }) func listBees() : async [Types.BeeView] {
    requireAdminCaller(caller);
    bees.values().map(func bee = JobsLib.beeToView(bee)).toArray();
  };

  /// Admin: assign a bee to a job request.
  public shared ({ caller }) func assignBeeToJob(id : Types.JobId, beeId : Types.BeeId) : async Result.Result<Types.JobRequestView, Types.BeeError> {
    requireAdminCaller(caller);
    switch (jobs.get(id)) {
      case (?job) {
        switch (bees.get(beeId)) {
          case (?_) {
            JobsLib.assignBee(job, beeId);
            #ok(viewOf(job));
          };
          case null { #err(#notFound) };
        };
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: mark a job request's customer as being on the monthly package.
  public shared ({ caller }) func setPackageEnrollment(id : Types.JobId, active : Bool) : async Result.Result<Types.JobRequestView, Types.BeeError> {
    requireAdminCaller(caller);
    switch (jobs.get(id)) {
      case (?job) {
        if (active) {
          JobsLib.enrollPackage(job, JobsLib.defaultPackagePlan(), Time.now());
        } else {
          JobsLib.cancelPackage(job);
        };
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: read the newest-first visit history for a job request's customer.
  public query ({ caller }) func getCustomerVisitHistory(id : Types.JobId) : async [Types.VisitRecord] {
    requireAdminCaller(caller);
    switch (jobs.get(id)) {
      case (?job) {
        let customerJobs = jobs.values().filter(func j = j.email == job.email).toArray();
        JobsLib.visitHistory(customerJobs, bees.values().toArray());
      };
      case null { [] };
    };
  };
};
