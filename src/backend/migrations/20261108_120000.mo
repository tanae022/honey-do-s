import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type JobId = Nat;
  type BeeId = Nat;
  type Timestamp = Int;
  type ReferenceCode = Text;
  type PhotoId = Text;
  type CustomerId = Nat;
  type DiscountId = Nat;
  type JobRecordId = Nat;
  type PaymentId = Nat;

  type ServiceCategory = {
    #house;
    #yardPlants;
    #fixIt;
    #cleanOrganize;
    #moveLift;
    #errands;
    #mowing;
    #showMe;
  };

  type JobStatus = {
    #requested;
    #quoted;
    #scheduled;
    #inProgress;
    #completed;
    #cancelled;
  };

  type PaymentMethod = {
    #stripe;
    #cashApp;
    #payPal;
    #venmo;
    #chime;
  };

  /// The payment-method shape before this upgrade: only Stripe and Cash App.
  type OldPaymentMethod = {
    #stripe;
    #cashApp;
  };

  type QuoteStatus = {
    #draft;
    #sent;
    #approved;
    #declined;
  };

  type QuoteLineItem = {
    description : Text;
    quantity : Nat;
    unitPrice : Nat;
  };

  /// The quote shape before this upgrade: no automatic pricing breakdown.
  type OldQuote = {
    amount : Nat;
    note : Text;
    sentAt : Timestamp;
    discountApplied : Bool;
    discountAmount : Nat;
    quoteNumber : Text;
    createdAt : Timestamp;
    workDescription : Text;
    lineItems : [QuoteLineItem];
    laborCharge : Nat;
    materialsCharge : Nat;
    subtotal : Nat;
    total : Nat;
    depositRequired : Nat;
    remainingBalance : Nat;
    expiresAt : ?Timestamp;
    status : QuoteStatus;
  };

  /// The quote shape after this upgrade: carries the automatic pricing
  /// breakdown. Legacy quotes migrate with `pricing = null`.
  type Quote = {
    amount : Nat;
    note : Text;
    sentAt : Timestamp;
    discountApplied : Bool;
    discountAmount : Nat;
    quoteNumber : Text;
    createdAt : Timestamp;
    workDescription : Text;
    lineItems : [QuoteLineItem];
    laborCharge : Nat;
    materialsCharge : Nat;
    subtotal : Nat;
    total : Nat;
    depositRequired : Nat;
    remainingBalance : Nat;
    expiresAt : ?Timestamp;
    status : QuoteStatus;
    pricing : ?QuotePricing;
  };

  type DepositStatus = {
    #pending;
    #submitted;
    #verified;
    #rejected;
  };

  /// The deposit shape before this upgrade: no status/submittedAt/verifiedAt,
  /// and only the original two payment methods.
  type OldDeposit = {
    amount : Nat;
    paid : Bool;
    method : OldPaymentMethod;
    paidAt : ?Timestamp;
    stripeSessionId : ?Text;
  };

  type Deposit = {
    amount : Nat;
    paid : Bool;
    method : PaymentMethod;
    paidAt : ?Timestamp;
    stripeSessionId : ?Text;
    status : DepositStatus;
    submittedAt : ?Timestamp;
    verifiedAt : ?Timestamp;
  };

  type StripeConfiguration = {
    secretKey : Text;
    allowedCountries : [Text];
  };

  type Appointment = {
    scheduledAt : Timestamp;
    confirmed : Bool;
  };

  type Review = {
    rating : Nat;
    comment : Text;
    createdAt : Timestamp;
  };

  type PackageEnrollment = {
    active : Bool;
    monthlyPrice : Nat;
    includedVisits : Nat;
    startedAt : Timestamp;
  };

  type Bee = {
    id : BeeId;
    name : Text;
    specialty : Text;
    createdAt : Timestamp;
  };

  type JobRequest = {
    id : JobId;
    referenceCode : ReferenceCode;
    customerName : Text;
    email : Text;
    phone : Text;
    category : ServiceCategory;
    description : Text;
    preferredTiming : Text;
    photoIds : [PhotoId];
    createdAt : Timestamp;
    ownParts : Bool;
    var status : JobStatus;
    var quote : ?Quote;
    var deposit : ?Deposit;
    var appointment : ?Appointment;
    var review : ?Review;
    var assignedBeeId : ?BeeId;
    var packageEnrollment : ?PackageEnrollment;
    var completedAt : ?Timestamp;
  };

  /// The job-request shape before this upgrade: its deposit uses OldDeposit
  /// and its quote uses OldQuote (no pricing breakdown).
  type OldJobRequest = {
    id : JobId;
    referenceCode : ReferenceCode;
    customerName : Text;
    email : Text;
    phone : Text;
    category : ServiceCategory;
    description : Text;
    preferredTiming : Text;
    photoIds : [PhotoId];
    createdAt : Timestamp;
    ownParts : Bool;
    var status : JobStatus;
    var quote : ?OldQuote;
    var deposit : ?OldDeposit;
    var appointment : ?Appointment;
    var review : ?Review;
    var assignedBeeId : ?BeeId;
    var packageEnrollment : ?PackageEnrollment;
    var completedAt : ?Timestamp;
  };

  type CustomerStatus = {
    #active;
    #inactive;
    #archived;
  };

  type PreferredContact = {
    #email;
    #phone;
    #sms;
  };

  type CustomerNote = {
    id : Nat;
    body : Text;
    createdAt : Timestamp;
  };

  type Customer = {
    id : Nat;
    fullName : Text;
    phone : Text;
    email : Text;
    serviceAddress : Text;
    preferredContact : PreferredContact;
    createdAt : Timestamp;
    var status : CustomerStatus;
    var adminNotes : Text;
    var notes : [CustomerNote];
  };

  /// The notification-kind shape before this upgrade: the original nine kinds.
  type OldNotificationKind = {
    #newCustomer;
    #returningCustomerRequest;
    #customerMessage;
    #bookingApproval;
    #depositReceived;
    #quoteApproved;
    #quoteDeclined;
    #appointmentConfirmed;
    #appointmentChanged;
  };

  type NotificationKind = {
    #newCustomer;
    #returningCustomerRequest;
    #customerMessage;
    #bookingApproval;
    #depositReceived;
    #quoteApproved;
    #quoteDeclined;
    #appointmentConfirmed;
    #appointmentChanged;
    #newRequest;
    #newMessage;
    #depositSubmitted;
    #depositVerified;
    #appointmentReminder;
    #paymentReceived;
  };

  type OldNotification = {
    id : Nat;
    kind : OldNotificationKind;
    title : Text;
    body : Text;
    createdAt : Timestamp;
    var read : Bool;
    relatedJobId : ?JobId;
    relatedCustomerId : ?Nat;
  };

  type Notification = {
    id : Nat;
    kind : NotificationKind;
    title : Text;
    body : Text;
    createdAt : Timestamp;
    var read : Bool;
    relatedJobId : ?JobId;
    relatedCustomerId : ?Nat;
  };

  type Message = {
    id : Nat;
    customerId : Nat;
    jobId : ?JobId;
    fromAdmin : Bool;
    body : Text;
    createdAt : Timestamp;
  };

  type DiscountKind = {
    #percentage;
    #fixed;
  };

  type DiscountEligibility = {
    #all;
    #ownParts;
    #returningCustomer;
  };

  type DiscountRule = {
    id : DiscountId;
    name : Text;
    kind : DiscountKind;
    value : Nat;
    active : Bool;
    startAt : ?Timestamp;
    endAt : ?Timestamp;
    eligibility : DiscountEligibility;
    minPurchase : Nat;
    maxDiscount : Nat;
    createdAt : Timestamp;
  };

  type DiscountApplication = {
    applied : Bool;
    ruleId : ?DiscountId;
    ruleName : Text;
    reason : Text;
  };

  type QuotePricing = {
    originalSubtotal : Nat;
    discountAmount : Nat;
    adjustedSubtotal : Nat;
    taxAmount : Nat;
    finalTotal : Nat;
    depositAmount : Nat;
    remainingBalance : Nat;
    discount : DiscountApplication;
  };

  type TaxSetting = {
    enabled : Bool;
    ratePercent : Nat;
  };

  type DepositSetting = {
    percent : Nat;
  };

  type PaymentSettings = {
    acceptedMethods : [PaymentMethod];
    payPalHandle : Text;
    cashAppHandle : Text;
    venmoHandle : Text;
    chimeHandle : Text;
  };

  type QuoteSettings = {
    validityDays : Nat;
    terms : Text;
  };

  type BusinessSettings = {
    businessName : Text;
    businessEmail : Text;
    businessPhone : Text;
    businessAddress : Text;
  };

  type AdminSettings = {
    customerRequestAlerts : Bool;
    notificationSound : Bool;
    pushNotifications : Bool;
    appointmentReminders : Bool;
    messageAlerts : Bool;
  };

  type JobRecordStatus = {
    #scheduled;
    #inProgress;
    #completed;
    #cancelled;
  };

  type JobRecord = {
    id : JobRecordId;
    jobRequestId : JobId;
    referenceCode : ReferenceCode;
    customerId : CustomerId;
    customerName : Text;
    serviceAddress : Text;
    category : ServiceCategory;
    scheduledAt : Timestamp;
    quote : ?Quote;
    pricing : ?QuotePricing;
    deposit : ?Deposit;
    remainingBalance : Nat;
    var status : JobRecordStatus;
    createdAt : Timestamp;
    var completedAt : ?Timestamp;
  };

  type PaymentHistory = {
    id : PaymentId;
    jobRequestId : JobId;
    referenceCode : ReferenceCode;
    customerId : CustomerId;
    originalQuote : Nat;
    discountAmount : Nat;
    finalQuote : Nat;
    depositAmount : Nat;
    paymentMethod : PaymentMethod;
    depositStatus : DepositStatus;
    remainingBalance : Nat;
    finalPayment : Nat;
    totalPaid : Nat;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    jobs : Map.Map<JobId, OldJobRequest>;
    bees : Map.Map<BeeId, Bee>;
    state : { var nextJobId : Nat; var nextBeeId : Nat };
    stripeConfiguration : { var config : ?StripeConfiguration };
    ownerEmail : { var address : Text };
    ownerPhone : { var number : Text };
    twilioConfig : {
      var accountSid : Text;
      var keySid : Text;
      var keySecret : Text;
      var fromNumber : Text;
    };
    customers : Map.Map<Nat, Customer>;
    customerByEmail : Map.Map<Text, Nat>;
    customerByPhone : Map.Map<Text, Nat>;
    notifications : Map.Map<Nat, OldNotification>;
    messages : Map.Map<Nat, Message>;
    customerState : {
      var nextCustomerId : Nat;
      var nextNotificationId : Nat;
      var nextMessageId : Nat;
      var nextNoteId : Nat;
    };
    frontendOrigin : { var origin : Text };
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    jobs : Map.Map<JobId, JobRequest>;
    bees : Map.Map<BeeId, Bee>;
    state : { var nextJobId : Nat; var nextBeeId : Nat };
    stripeConfiguration : { var config : ?StripeConfiguration };
    ownerEmail : { var address : Text };
    ownerPhone : { var number : Text };
    twilioConfig : {
      var accountSid : Text;
      var keySid : Text;
      var keySecret : Text;
      var fromNumber : Text;
    };
    customers : Map.Map<Nat, Customer>;
    customerByEmail : Map.Map<Text, Nat>;
    customerByPhone : Map.Map<Text, Nat>;
    notifications : Map.Map<Nat, Notification>;
    messages : Map.Map<Nat, Message>;
    customerState : {
      var nextCustomerId : Nat;
      var nextNotificationId : Nat;
      var nextMessageId : Nat;
      var nextNoteId : Nat;
    };
    frontendOrigin : { var origin : Text };
    /// Saved admin-managed discount rules.
    discounts : Map.Map<DiscountId, DiscountRule>;
    /// Jobs created from confirmed requests or quotes.
    jobRecords : Map.Map<JobRecordId, JobRecord>;
    /// Permanent payment-history entries.
    paymentHistory : Map.Map<PaymentId, PaymentHistory>;
    /// Admin notification and workflow toggles.
    adminSettings : { var settings : AdminSettings };
    /// Tax configuration.
    taxSetting : { var setting : TaxSetting };
    /// Deposit configuration.
    depositSetting : { var setting : DepositSetting };
    /// Accepted payment methods and the owner's payment handles.
    paymentSettings : { var settings : PaymentSettings };
    /// Quote defaults.
    quoteSetting : { var setting : QuoteSettings };
    /// Business identity.
    businessSetting : { var setting : BusinessSettings };
    /// Counters for the new domains.
    settingsState : {
      var nextDiscountId : Nat;
      var nextJobRecordId : Nat;
      var nextPaymentId : Nat;
    };
  };

  /// Widen an old two-method payment method into the new five-method type.
  func migratePaymentMethod(method : OldPaymentMethod) : PaymentMethod {
    switch (method) {
      case (#stripe) { #stripe };
      case (#cashApp) { #cashApp };
    };
  };

  /// Add the new deposit lifecycle fields to a deposit, preserving the
  /// original amount/method/session. A deposit that was already paid before
  /// this upgrade is treated as verified.
  func migrateDeposit(deposit : OldDeposit) : Deposit {
    {
      amount = deposit.amount;
      paid = deposit.paid;
      method = migratePaymentMethod(deposit.method);
      paidAt = deposit.paidAt;
      stripeSessionId = deposit.stripeSessionId;
      status = if (deposit.paid) { #verified } else { #pending };
      submittedAt = deposit.paidAt;
      verifiedAt = deposit.paidAt;
    };
  };

  /// Widen an old notification kind into the new kind set. Every original kind
  /// is preserved unchanged.
  func migrateNotificationKind(kind : OldNotificationKind) : NotificationKind {
    switch (kind) {
      case (#newCustomer) { #newCustomer };
      case (#returningCustomerRequest) { #returningCustomerRequest };
      case (#customerMessage) { #customerMessage };
      case (#bookingApproval) { #bookingApproval };
      case (#depositReceived) { #depositReceived };
      case (#quoteApproved) { #quoteApproved };
      case (#quoteDeclined) { #quoteDeclined };
      case (#appointmentConfirmed) { #appointmentConfirmed };
      case (#appointmentChanged) { #appointmentChanged };
    };
  };

  /// Carry an old notification through unchanged apart from its widened kind.
  func migrateNotification(notification : OldNotification) : Notification {
    {
      id = notification.id;
      kind = migrateNotificationKind(notification.kind);
      title = notification.title;
      body = notification.body;
      createdAt = notification.createdAt;
      var read = notification.read;
      relatedJobId = notification.relatedJobId;
      relatedCustomerId = notification.relatedCustomerId;
    };
  };

  /// Add the automatic pricing breakdown to a quote. A quote created before
  /// automatic pricing existed has no breakdown, so `pricing` is null.
  func migrateQuote(quote : OldQuote) : Quote {
    {
      amount = quote.amount;
      note = quote.note;
      sentAt = quote.sentAt;
      discountApplied = quote.discountApplied;
      discountAmount = quote.discountAmount;
      quoteNumber = quote.quoteNumber;
      createdAt = quote.createdAt;
      workDescription = quote.workDescription;
      lineItems = quote.lineItems;
      laborCharge = quote.laborCharge;
      materialsCharge = quote.materialsCharge;
      subtotal = quote.subtotal;
      total = quote.total;
      depositRequired = quote.depositRequired;
      remainingBalance = quote.remainingBalance;
      expiresAt = quote.expiresAt;
      status = quote.status;
      pricing = null;
    };
  };

  /// Add the new deposit lifecycle fields to every job request's deposit.
  func migrateJobRequest(job : OldJobRequest) : JobRequest {
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
      var status = job.status;
      var quote = switch (job.quote) {
        case (?q) { ?migrateQuote(q) };
        case null { null };
      };
      var deposit = switch (job.deposit) {
        case (?d) { ?migrateDeposit(d) };
        case null { null };
      };
      var appointment = job.appointment;
      var review = job.review;
      var assignedBeeId = job.assignedBeeId;
      var packageEnrollment = job.packageEnrollment;
      var completedAt = job.completedAt;
    };
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      jobs = old.jobs.map(func(_, job) = migrateJobRequest(job));
      bees = old.bees;
      state = old.state;
      stripeConfiguration = old.stripeConfiguration;
      ownerEmail = old.ownerEmail;
      ownerPhone = old.ownerPhone;
      twilioConfig = old.twilioConfig;
      customers = old.customers;
      customerByEmail = old.customerByEmail;
      customerByPhone = old.customerByPhone;
      notifications = old.notifications.map(func(_, notification) = migrateNotification(notification));
      messages = old.messages;
      customerState = old.customerState;
      frontendOrigin = old.frontendOrigin;
      discounts = Map.empty();
      jobRecords = Map.empty();
      paymentHistory = Map.empty();
      adminSettings = {
        var settings = {
          customerRequestAlerts = true;
          notificationSound = true;
          pushNotifications = false;
          appointmentReminders = true;
          messageAlerts = true;
        };
      };
      taxSetting = { var setting = { enabled = false; ratePercent = 0 } };
      depositSetting = { var setting = { percent = 10 } };
      paymentSettings = {
        var settings = {
          acceptedMethods = [#payPal, #cashApp, #venmo, #chime];
          payPalHandle = "";
          cashAppHandle = "";
          venmoHandle = "";
          chimeHandle = "";
        };
      };
      quoteSetting = { var setting = { validityDays = 30; terms = "" } };
      businessSetting = {
        var setting = {
          businessName = "Honey Do's";
          businessEmail = "";
          businessPhone = "";
          businessAddress = "";
        };
      };
      settingsState = {
        var nextDiscountId = 0;
        var nextJobRecordId = 0;
        var nextPaymentId = 0;
      };
    };
  };
};
