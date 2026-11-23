import AccessControl "mo:caffeineai-authorization/access-control";
import EmailClient "mo:caffeineai-email/emailClient";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import Stripe "mo:caffeineai-stripe/stripe";
import MessageApi "mo:twilio-client/Apis/Api20100401MessageApi";
import TwilioConfig "mo:twilio-client/Config";
import Map "mo:core/Map";
import Result "mo:core/Result";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Debug "mo:core/Debug";
import Types "../types/jobs";
import PricingTypes "../types/pricing";
import OwnerTypes "../types/owner-notifications";
import CustomerTypes "../types/customers";
import NotificationTypes "../types/notifications";
import JobsLib "../lib/jobs";
import CustomersLib "../lib/customers";
import NotificationLib "../lib/notifications";

mixin (
  jobs : Map.Map<Types.JobId, Types.JobRequest>,
  bees : Map.Map<Types.BeeId, Types.Bee>,
  state : { var nextJobId : Nat; var nextBeeId : Nat },
  accessControlState : AccessControl.AccessControlState,
  stripeConfiguration : { var config : ?Stripe.StripeConfiguration },
  ownerEmail : { var address : Text },
  ownerPhone : { var number : Text },
  twilioConfig : {
    var accountSid : Text;
    var keySid : Text;
    var keySecret : Text;
    var fromNumber : Text;
  },
  frontendOrigin : { var origin : Text },
  customers : Map.Map<CustomerTypes.CustomerId, CustomerTypes.Customer>,
  customerByEmail : Map.Map<Text, CustomerTypes.CustomerId>,
  customerByPhone : Map.Map<Text, CustomerTypes.CustomerId>,
  customerState : {
    var nextCustomerId : Nat;
    var nextNotificationId : Nat;
    var nextMessageId : Nat;
    var nextNoteId : Nat;
  },
  notifications : Map.Map<NotificationTypes.NotificationId, NotificationTypes.Notification>,
  discounts : Map.Map<PricingTypes.DiscountId, PricingTypes.DiscountRule>,
  taxSetting : { var setting : PricingTypes.TaxSetting },
  depositSetting : { var setting : PricingTypes.DepositSetting },
  transform : OutCall.Transform,
) {
  func requireAdminJobs(caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) {};
      case (_) { Runtime.trap("Unauthorized: Only admins can perform this action") };
    };
  };

  func findJobByReference(referenceCode : Types.ReferenceCode) : ?Types.JobRequest {
    jobs.values().find(func(job) = job.referenceCode == referenceCode);
  };

  /// Resolve the permanent customer for a submitted request, creating a record
  /// when the person is new. Returns the customer id together with whether the
  /// customer already existed, so the caller can raise the right notification.
  func resolveCustomer(
    fullName : Text,
    email : Text,
    phone : Text,
    serviceAddress : Text,
  ) : (CustomerTypes.CustomerId, Bool) {
    let existing = CustomersLib.findExisting(
      func(key) = customerByEmail.get(key),
      func(key) = customerByPhone.get(key),
      email,
      phone,
    );
    let (id, nextId) = CustomersLib.resolveOrCreate(
      customers,
      customerByEmail,
      customerByPhone,
      customerState.nextCustomerId,
      fullName,
      email,
      phone,
      serviceAddress,
      Time.now(),
    );
    customerState.nextCustomerId := nextId;
    (id, existing != null);
  };

  /// Raise an admin dashboard notification for a new or returning customer
  /// request. Best-effort: a notification never blocks the request itself.
  func notifyCustomerRequest(job : Types.JobRequest, customerId : CustomerTypes.CustomerId, returning : Bool) : () {
    let kind : NotificationTypes.NotificationKind = if (returning) { #returningCustomerRequest } else { #newCustomer };
    let title = if (returning) {
      "Returning customer request " # job.referenceCode;
    } else {
      "New customer request " # job.referenceCode;
    };
    ignore NotificationLib.raise(
      notifications,
      customerState,
      kind,
      title,
      job.customerName # " requested " # categoryLabel(job.category) # " (" # job.referenceCode # ")",
      ?job.id,
      ?customerId,
      Time.now(),
    );
  };

  /// Raise a deposit-received notification for a job.
  func notifyDepositReceived(job : Types.JobRequest, customerId : ?CustomerTypes.CustomerId) : () {
    ignore NotificationLib.raise(
      notifications,
      customerState,
      #depositReceived,
      "Deposit received for " # job.referenceCode,
      job.customerName # " paid the deposit for " # job.referenceCode,
      ?job.id,
      customerId,
      Time.now(),
    );
  };

  /// Raise a booking-approval notification for a job whose appointment is
  /// scheduled but not yet confirmed.
  func notifyBookingApproval(job : Types.JobRequest, customerId : ?CustomerTypes.CustomerId) : () {
    ignore NotificationLib.raise(
      notifications,
      customerState,
      #bookingApproval,
      "Booking needs approval for " # job.referenceCode,
      job.customerName # " has an appointment awaiting confirmation for " # job.referenceCode,
      ?job.id,
      customerId,
      Time.now(),
    );
  };

  /// Raise a quote-approval notification for a job whose quote was approved.
  func notifyQuoteApproved(job : Types.JobRequest, customerId : ?CustomerTypes.CustomerId) : () {
    ignore NotificationLib.raiseQuoteApproved(
      notifications,
      customerState,
      job.id,
      job.referenceCode,
      job.customerName,
      customerId,
      Time.now(),
    );
  };

  /// Raise a quote-decline notification for a job whose quote was declined.
  func notifyQuoteDeclined(job : Types.JobRequest, customerId : ?CustomerTypes.CustomerId) : () {
    ignore NotificationLib.raiseQuoteDeclined(
      notifications,
      customerState,
      job.id,
      job.referenceCode,
      job.customerName,
      customerId,
      Time.now(),
    );
  };

  /// Raise an appointment-confirmation notification for a job whose scheduled
  /// appointment the customer confirmed.
  func notifyAppointmentConfirmed(job : Types.JobRequest, customerId : ?CustomerTypes.CustomerId) : () {
    ignore NotificationLib.raiseAppointmentConfirmed(
      notifications,
      customerState,
      job.id,
      job.referenceCode,
      job.customerName,
      customerId,
      Time.now(),
    );
  };

  /// Raise an appointment-change notification for a job whose appointment was
  /// rescheduled.
  func notifyAppointmentChanged(job : Types.JobRequest, customerId : ?CustomerTypes.CustomerId) : () {
    ignore NotificationLib.raiseAppointmentChanged(
      notifications,
      customerState,
      job.id,
      job.referenceCode,
      job.customerName,
      customerId,
      Time.now(),
    );
  };

  /// Resolve the permanent customer id for a job, matching on normalized email
  /// first and then normalized phone.
  func customerIdForJob(job : Types.JobRequest) : ?CustomerTypes.CustomerId {
    CustomersLib.findExisting(
      func(key) = customerByEmail.get(key),
      func(key) = customerByPhone.get(key),
      job.email,
      job.phone,
    );
  };

  /// Whether a job's customer is returning: they have a permanent customer
  /// record and at least one other job request. Used to evaluate the
  /// returning-customer discount eligibility.
  func isReturningCustomer(job : Types.JobRequest) : Bool {
    switch (customerIdForJob(job)) {
      case (null) { false };
      case (?_) {
        jobs.values().any(func(other) = other.id != job.id and other.email == job.email);
      };
    };
  };

  /// The saved discount rules as an array, for automatic quote pricing.
  func discountRules() : [PricingTypes.DiscountRule] {
    discounts.values().toArray();
  };

  /// Send a notification email and report the outcome. Email delivery must
  /// never block or abort a state change, so a failure or trap from the email
  /// integration is caught, logged, and returned as `#err` rather than
  /// swallowed silently.
  func notifyByEmail(recipient : Text, subject : Text, body : Text) : async EmailClient.SendResult {
    try {
      await EmailClient.sendServiceEmail("Honey Do's", [recipient], subject, body);
    } catch (error) {
      let message = "Failed to send email: " # error.message();
      Debug.print(message);
      #err(message);
    };
  };

  /// Send an owner SMS alert through the Twilio messaging connector and report
  /// the outcome. A failure or trap must never block or abort a state change.
  func notifyBySms(recipient : Text, body : Text) : async OwnerTypes.ChannelResult {
    if (twilioConfig.accountSid.size() == 0 or twilioConfig.keySid.size() == 0 or twilioConfig.keySecret.size() == 0 or twilioConfig.fromNumber.size() == 0) {
      return #failed("Twilio messaging is not configured");
    };
    let config = {
      TwilioConfig.defaultConfig with
      auth = ?#basicAuth({ user = twilioConfig.keySid; password = twilioConfig.keySecret });
    };
    try {
      let api = MessageApi.Api20100401MessageApi(config);
      ignore await api.createMessage(
        twilioConfig.accountSid,
        recipient,
        "",
        "",
        0.0,
        false,
        0,
        0,
        false,
        null,
        null,
        false,
        [],
        null,
        false,
        null,
        "",
        false,
        "",
        null,
        twilioConfig.fromNumber,
        "",
        "",
        body,
        [],
        "",
      );
      #sent;
    } catch (error) {
      let message = "Failed to send SMS: " # error.message();
      Debug.print(message);
      #failed(message);
    };
  };

  /// Render a service category as human-readable text for notifications.
  func categoryLabel(category : Types.ServiceCategory) : Text {
    switch category {
      case (#house) "House";
      case (#yardPlants) "Yard & Plants";
      case (#fixIt) "Fix It";
      case (#cleanOrganize) "Clean & Organize";
      case (#moveLift) "Move & Lift";
      case (#errands) "Errands";
      case (#mowing) "Mowing";
      case (#showMe) "Show Me";
    };
  };

  /// Build the owner notification body for a newly submitted request. Carries
  /// every detail the owner needs to act on the job.
  func newRequestNotificationBody(job : Types.JobRequest) : Text {
    "New job request " # job.referenceCode # "\n\n" #
    "Customer: " # job.customerName # "\n" #
    "Email: " # job.email # "\n" #
    "Phone: " # job.phone # "\n" #
    "Service: " # categoryLabel(job.category) # "\n" #
    "Preferred timing: " # job.preferredTiming # "\n" #
    "Own parts/supplies: " # (if (job.ownParts) { "yes" } else { "no" }) # "\n" #
    "Photos attached: " # job.photoIds.size().toText() # "\n\n" #
    "Description:\n" # job.description;
  };

  /// Build the owner SMS body for a newly submitted request: reference code,
  /// customer name, service category and preferred timing.
  func newRequestSmsBody(job : Types.JobRequest) : Text {
    "New Honey Do's request " # job.referenceCode # " from " # job.customerName #
    " - " # categoryLabel(job.category) # " - " # job.preferredTiming;
  };

  func stripeConfigOrTrap() : Stripe.StripeConfiguration {
    stripeConfiguration.config ?? Runtime.trap("Stripe needs to be first configured");
  };

  /// The public base URL used to build absolute links in customer emails. When
  /// the owner has configured a frontend origin it is used as-is (trailing
  /// slashes trimmed); otherwise the backend falls back to the app's default
  /// production origin so an emailed link is still clickable.
  func frontendBaseUrl() : Text {
    let configured = frontendOrigin.origin.trim(#char '/');
    if (configured.size() > 0) {
      configured;
    } else {
      "https://honey-dos.icp0.io";
    };
  };

  /// Build an absolute Track-page URL for a job's quote action. The link opens
  /// the app's Track page with the reference code and action pre-filled, so the
  /// customer never has to find or type the code.
  func trackActionUrl(referenceCode : Types.ReferenceCode, action : Text) : Text {
    frontendBaseUrl() # "/track?reference=" # referenceCode # "&action=" # action;
  };

  /// Build the shared view for a job, resolving the assigned bee's name.
  func viewOf(job : Types.JobRequest) : Types.JobRequestView {
    let view = JobsLib.toView(job);
    let beeName = switch (job.assignedBeeId) {
      case (?id) {
        switch (bees.get(id)) {
          case (?bee) { ?bee.name };
          case null { null };
        };
      };
      case null { null };
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
    // Resolve or create the permanent customer record and link the job to it,
    // then raise the admin dashboard notification for a new or returning
    // customer request.
    let (customerId, returning) = resolveCustomer(
      input.customerName,
      input.email,
      input.phone,
      "",
    );
    notifyCustomerRequest(job, customerId, returning);
    // Notify the owner by email and SMS. Both sends are best-effort: a failure
    // or trap is caught inside the helpers and never aborts the request, so the
    // customer always receives the reference code.
    ignore await notifyByEmail(
      ownerEmail.address,
      "New job request " # referenceCode,
      newRequestNotificationBody(job),
    );
    ignore await notifyBySms(ownerPhone.number, newRequestSmsBody(job));
    referenceCode;
  };

  /// Guest: fetch a job request by its public reference code.
  public query func getRequestByReference(referenceCode : Types.ReferenceCode) : async ?Types.JobRequestView {
    switch (findJobByReference(referenceCode)) {
      case (?job) { ?viewOf(job) };
      case null { null };
    };
  };

  /// Guest: accept the quote attached to a job request. Marks the quote
  /// approved and moves the job to `#scheduled`, keeping the existing
  /// accept-to-scheduled transition working. An expired quote cannot be
  /// accepted and returns `#invalidState`.
  public shared ({ caller }) func acceptQuote(referenceCode : Types.ReferenceCode) : async Result.Result<Types.JobRequestView, Types.JobError> {
    ignore caller;
    switch (findJobByReference(referenceCode)) {
      case (?job) {
        switch (job.quote) {
          case (null) { return #err(#invalidState("No quote has been sent for this request")) };
          case (?quote) {
            if (JobsLib.isQuoteExpired(quote, Time.now())) {
              return #err(#invalidState("This quote has expired and can no longer be accepted"));
            };
          };
        };
        ignore JobsLib.approveQuote(job);
        JobsLib.acceptQuote(job);
        notifyQuoteApproved(job, customerIdForJob(job));
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Guest: create a Stripe checkout session for the 50% deposit on an accepted quote.
  public shared ({ caller }) func createDepositCheckoutSession(referenceCode : Types.ReferenceCode, successUrl : Text, cancelUrl : Text) : async Result.Result<Text, Types.JobError> {
    switch (findJobByReference(referenceCode)) {
      case (?job) {
        switch (job.quote) {
          case (null) { return #err(#invalidState("No quote has been sent for this request")) };
          case (?_) {};
        };
        let amount = JobsLib.depositAmount(job);
        if (amount == 0) { return #err(#invalidState("No deposit is owed for this request")) };
        let items : [Stripe.ShoppingItem] = [{
          currency = "usd";
          productName = "Honey Do's deposit " # referenceCode;
          productDescription = "50% deposit for job request " # referenceCode;
          priceInCents = amount;
          quantity = 1;
        }];
        try {
          let sessionId = await Stripe.createCheckoutSession(
            stripeConfigOrTrap(),
            caller,
            items,
            successUrl,
            cancelUrl,
            transform,
          );
          JobsLib.setDepositSession(job, sessionId);
          #ok(sessionId);
        } catch (error) {
          #err(#paymentError(error.message()));
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
        let sessionId = switch (job.deposit) {
          case (?d) {
            switch (d.stripeSessionId) {
              case (?id) { id };
              case null { return #err(#invalidState("No Stripe checkout session is attached to this request")) };
            };
          };
          case null { return #err(#invalidState("No deposit has been started for this request")) };
        };
        try {
          let status = await Stripe.getSessionStatus(stripeConfigOrTrap(), sessionId, transform);
          switch (status) {
            case (#completed(_)) {
              JobsLib.markDepositPaid(job, Time.now());
              notifyDepositReceived(job, customerIdForJob(job));
              #ok(viewOf(job));
            };
            case (#failed(_)) {
              #err(#paymentError("Payment is not complete"));
            };
          };
        } catch (error) {
          #err(#paymentError(error.message()));
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
          case (null) { return #err(#invalidState("No quote has been sent for this request")) };
          case (?_) {};
        };
        JobsLib.recordDeposit(job, method, Time.now());
        notifyDepositReceived(job, customerIdForJob(job));
        #ok(viewOf(job));
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
          case (null) { return #err(#invalidState("No appointment has been scheduled for this request")) };
          case (?_) {};
        };
        JobsLib.confirmAppointment(job);
        notifyAppointmentConfirmed(job, customerIdForJob(job));
        #ok(viewOf(job));
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
          return #err(#invalidState("Reviews can only be left for completed jobs"));
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
    requireAdminJobs(caller);
    jobs.values().map(func(job) = viewOf(job)).toArray();
  };

  /// Admin: fetch a single job request by id.
  public query ({ caller }) func getRequest(id : Types.JobId) : async ?Types.JobRequestView {
    requireAdminJobs(caller);
    switch (jobs.get(id)) {
      case (?job) { ?viewOf(job) };
      case null { null };
    };
  };

  /// Admin: set the quote amount and note for a job request. The amount becomes
  /// a single line item and the automatic pricing breakdown (discount, tax,
  /// final total, 10% deposit and remaining balance) is computed from the saved
  /// discount rules and settings.
  public shared ({ caller }) func setQuote(id : Types.JobId, amount : Nat, note : Text) : async Result.Result<Types.JobRequestView, Types.JobError> {
    requireAdminJobs(caller);
    switch (jobs.get(id)) {
      case (?job) {
        let input : Types.QuoteInput = {
          workDescription = note;
          note;
          lineItems = [{ description = note; quantity = 1; unitPrice = amount }];
          laborCharge = 0;
          materialsCharge = 0;
          depositRequired = 0;
          expiresAt = null;
        };
        JobsLib.setQuote(job, input, Time.now(), discountRules(), taxSetting.setting, depositSetting.setting, isReturningCustomer(job));
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: create or replace a quote from a full professional quote payload,
  /// including line items, labor and materials charges and optional expiration.
  /// The subtotal, applicable discount, tax, final total, 10% deposit and
  /// remaining balance are computed automatically by the pricing engine.
  public shared ({ caller }) func editQuote(id : Types.JobId, input : Types.QuoteInput) : async Result.Result<Types.JobRequestView, Types.JobError> {
    requireAdminJobs(caller);
    switch (jobs.get(id)) {
      case (?job) {
        if (not JobsLib.editQuote(job, input, Time.now(), discountRules(), taxSetting.setting, depositSetting.setting, isReturningCustomer(job))) {
          return #err(#invalidState("No quote exists for this request"));
        };
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: mark a quote as sent to the customer and email the itemized quote
  /// to the customer's address on the request. The email carries the quote
  /// number, work description, line items, labor, materials, subtotal,
  /// own-parts discount, total, deposit required, remaining balance, expiration
  /// date, the owner's note, and absolute accept/decline links that open the
  /// customer's quote from any email client. The result reports the email
  /// delivery outcome per channel so the
  /// owner can be told whether the email was sent; a delivery failure is
  /// surfaced rather than swallowed. Saving or editing a quote never emails.
  public shared ({ caller }) func sendQuote(id : Types.JobId) : async Result.Result<Types.QuoteSendResult, Types.JobError> {
    requireAdminJobs(caller);
    switch (jobs.get(id)) {
      case (?job) {
        if (not JobsLib.sendQuote(job, Time.now())) {
          return #err(#invalidState("No quote exists for this request"));
        };
        let quote = switch (job.quote) {
          case (?q) { q };
          case null { return #err(#invalidState("No quote exists for this request")) };
        };
        let acceptUrl = trackActionUrl(job.referenceCode, "accept");
        let declineUrl = trackActionUrl(job.referenceCode, "decline");
        let body = JobsLib.quoteEmailBody(job, quote, acceptUrl, declineUrl);
        let email = switch (await notifyByEmail(job.email, "Your Honey Do's quote " # quote.quoteNumber, body)) {
          case (#ok) { #sent : Types.QuoteEmailResult };
          case (#err(message)) { #failed(message) : Types.QuoteEmailResult };
        };
        #ok({ email; view = viewOf(job) });
      };
      case null { #err(#notFound) };
    };
  };

  /// Guest: read the customer-facing quote for a job by its public reference
  /// code. This is the view the emailed quote link opens; it shows the same
  /// itemized quote the Track page shows and marks an expired quote as expired.
  public query func getQuoteByReference(referenceCode : Types.ReferenceCode) : async ?Types.QuoteView {
    switch (findJobByReference(referenceCode)) {
      case (?job) {
        switch (job.quote) {
          case (?quote) { ?JobsLib.quoteToView(referenceCode, quote, Time.now()) };
          case null { null };
        };
      };
      case null { null };
    };
  };

  /// Guest: decline the quote attached to a job request from the emailed quote
  /// link. Marks the quote declined, matching the existing decline flow.
  public shared ({ caller }) func declineQuoteByReference(referenceCode : Types.ReferenceCode) : async Result.Result<Types.JobRequestView, Types.JobError> {
    ignore caller;
    switch (findJobByReference(referenceCode)) {
      case (?job) {
        if (not JobsLib.declineQuote(job)) {
          return #err(#invalidState("No quote exists for this request"));
        };
        notifyQuoteDeclined(job, customerIdForJob(job));
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: mark a quote as approved by the customer.
  public shared ({ caller }) func approveQuote(id : Types.JobId) : async Result.Result<Types.JobRequestView, Types.JobError> {
    requireAdminJobs(caller);
    switch (jobs.get(id)) {
      case (?job) {
        if (not JobsLib.approveQuote(job)) {
          return #err(#invalidState("No quote exists for this request"));
        };
        notifyQuoteApproved(job, customerIdForJob(job));
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: mark a quote as declined by the customer.
  public shared ({ caller }) func declineQuote(id : Types.JobId) : async Result.Result<Types.JobRequestView, Types.JobError> {
    requireAdminJobs(caller);
    switch (jobs.get(id)) {
      case (?job) {
        if (not JobsLib.declineQuote(job)) {
          return #err(#invalidState("No quote exists for this request"));
        };
        notifyQuoteDeclined(job, customerIdForJob(job));
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: convert an approved quote into a scheduled job at the given time.
  /// The quote must be approved; the job moves to `#scheduled` with a pending
  /// appointment.
  public shared ({ caller }) func convertQuoteToJob(id : Types.JobId, scheduledAt : Types.Timestamp) : async Result.Result<Types.JobRequestView, Types.JobError> {
    requireAdminJobs(caller);
    switch (jobs.get(id)) {
      case (?job) {
        if (not JobsLib.convertQuoteToJob(job, scheduledAt)) {
          return #err(#invalidState("Only an approved quote can be converted into a job"));
        };
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: schedule an appointment for a job request. Notifies BOTH the
  /// customer and the owner.
  public shared ({ caller }) func scheduleAppointment(id : Types.JobId, scheduledAt : Types.Timestamp) : async Result.Result<Types.JobRequestView, Types.JobError> {
    requireAdminJobs(caller);
    switch (jobs.get(id)) {
      case (?job) {
        // An appointment that already existed means this call reschedules it,
        // which raises an appointment-change notification; a first-time
        // schedule raises the booking-approval notification instead.
        let rescheduled = job.appointment != null;
        JobsLib.scheduleAppointment(job, scheduledAt);
        if (rescheduled) {
          notifyAppointmentChanged(job, customerIdForJob(job));
        } else {
          notifyBookingApproval(job, customerIdForJob(job));
        };
        let body = "Your Honey Do's appointment for request " # job.referenceCode #
          " has been scheduled. We will confirm the exact time with you shortly.";
        ignore await notifyByEmail(job.email, "Appointment scheduled for " # job.referenceCode, body);
        ignore await notifyByEmail(ownerEmail.address, "Appointment scheduled for " # job.referenceCode, body);
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: advance a job request to its next lifecycle status.
  public shared ({ caller }) func advanceStatus(id : Types.JobId) : async Result.Result<Types.JobRequestView, Types.JobError> {
    requireAdminJobs(caller);
    switch (jobs.get(id)) {
      case (?job) {
        JobsLib.advanceStatus(job);
        if (job.status == #completed) {
          job.completedAt := ?Time.now();
        };
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: read dashboard statistics.
  public query ({ caller }) func getDashboardStats() : async Types.DashboardStats {
    requireAdminJobs(caller);
    JobsLib.computeStats(jobs.values().toArray());
  };

  /// Admin: cancel a job request. Cancellation is terminal and moves the job
  /// into the customer profile's cancelled group. A completed job cannot be
  /// cancelled, and cancelling an already-cancelled job is a no-op.
  public shared ({ caller }) func cancelJob(id : Types.JobId) : async Result.Result<Types.JobRequestView, Types.JobError> {
    requireAdminJobs(caller);
    switch (jobs.get(id)) {
      case (?job) {
        if (not JobsLib.cancelJob(job)) {
          return #err(#invalidState("Only an active job can be cancelled"));
        };
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: create a bee (employee) with a name and specialty.
  public shared ({ caller }) func createBee(input : Types.BeeInput) : async Result.Result<Types.BeeView, Types.BeeError> {
    requireAdminJobs(caller);
    let id = state.nextBeeId;
    state.nextBeeId := id + 1;
    let bee = JobsLib.newBee(id, input, Time.now());
    bees.add(id, bee);
    #ok(JobsLib.beeToView(bee));
  };

  /// Admin: update a bee's name and specialty.
  public shared ({ caller }) func updateBee(id : Types.BeeId, input : Types.BeeInput) : async Result.Result<Types.BeeView, Types.BeeError> {
    requireAdminJobs(caller);
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
    requireAdminJobs(caller);
    bees.values().map(func(bee) = JobsLib.beeToView(bee)).toArray();
  };

  /// Admin: assign a bee to a job request.
  public shared ({ caller }) func assignBeeToJob(id : Types.JobId, beeId : Types.BeeId) : async Result.Result<Types.JobRequestView, Types.BeeError> {
    requireAdminJobs(caller);
    switch (jobs.get(id)) {
      case (?job) {
        switch (bees.get(beeId)) {
          case (null) { return #err(#notFound) };
          case (?_) {};
        };
        JobsLib.assignBee(job, beeId);
        #ok(viewOf(job));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: mark a job request's customer as being on the monthly package.
  public shared ({ caller }) func setPackageEnrollment(id : Types.JobId, active : Bool) : async Result.Result<Types.JobRequestView, Types.BeeError> {
    requireAdminJobs(caller);
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
    requireAdminJobs(caller);
    switch (jobs.get(id)) {
      case (?job) {
        let customerJobs = jobs.values().filter(func(other) = other.email == job.email).toArray();
        JobsLib.visitHistory(customerJobs, bees.values().toArray());
      };
      case null { [] };
    };
  };

  /// Admin: create a new service request for an existing customer, reusing the
  /// customer's stored contact information. The job enters the same
  /// service/quote/deposit/appointment/status lifecycle as a customer-submitted
  /// request and is linked to the customer's permanent profile.
  public shared ({ caller }) func createJobForCustomer(
    customerId : CustomerTypes.CustomerId,
    input : Types.JobRequestInput,
  ) : async Result.Result<Types.JobRequestView, Types.JobError> {
    requireAdminJobs(caller);
    switch (customers.get(customerId)) {
      case (null) { #err(#notFound) };
      case (?customer) {
        let id = state.nextJobId;
        state.nextJobId := id + 1;
        let referenceCode = JobsLib.generateReferenceCode();
        let jobInput : Types.JobRequestInput = {
          input with
          customerName = customer.fullName;
          email = customer.email;
          phone = customer.phone;
        };
        let job = JobsLib.newRequest(id, referenceCode, jobInput, Time.now());
        jobs.add(id, job);
        #ok(viewOf(job));
      };
    };
  };
};
