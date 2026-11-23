import Common "common";

module {
  public type Timestamp = Common.Timestamp;
  public type ReferenceCode = Common.ReferenceCode;
  public type JobId = Common.JobId;
  public type PhotoId = Common.PhotoId;
  public type BeeId = Common.BeeId;
  public type CustomerId = Common.CustomerId;
  public type DiscountId = Common.DiscountId;
  public type JobRecordId = Common.JobRecordId;
  public type PaymentId = Common.PaymentId;

  /// Service category offered by Honey Do's.
  public type ServiceCategory = {
    #house;
    #yardPlants;
    #fixIt;
    #cleanOrganize;
    #moveLift;
    #errands;
    #mowing;
    #showMe;
  };

  /// Lifecycle status of a job request.
  public type JobStatus = {
    #requested;
    #quoted;
    #scheduled;
    #inProgress;
    #completed;
    #cancelled;
  };

  /// Payment method used for a deposit or final payment. The original
  /// `#stripe` and `#cashApp` methods are preserved; the owner's additional
  /// manual methods are added so a customer can pay by any of them.
  public type PaymentMethod = {
    #stripe;
    #cashApp;
    #payPal;
    #venmo;
    #chime;
  };

  /// Whether a discount rule reduces a quote by a percentage or a fixed amount.
  public type DiscountKind = {
    #percentage;
    #fixed;
  };

  /// Who a discount rule is eligible for. `#all` applies to every quote;
  /// `#ownParts` applies only when the customer supplies their own parts;
  /// `#returningCustomer` applies only to a customer with prior jobs.
  public type DiscountEligibility = {
    #all;
    #ownParts;
    #returningCustomer;
  };

  /// A saved, admin-managed discount rule. `value` is a percentage (whole
  /// percent) when `kind` is `#percentage`, or a fixed amount in cents when
  /// `kind` is `#fixed`. `minPurchase` and `maxDiscount` are in cents; a zero
  /// bound means "no bound". `startAt`/`endAt` are optional validity windows.
  public type DiscountRule = {
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

  /// Input payload for creating or editing a discount rule.
  public type DiscountRuleInput = {
    name : Text;
    kind : DiscountKind;
    value : Nat;
    active : Bool;
    startAt : ?Timestamp;
    endAt : ?Timestamp;
    eligibility : DiscountEligibility;
    minPurchase : Nat;
    maxDiscount : Nat;
  };

  /// Why a discount was or was not applied to a quote. `applied` is true only
  /// when a rule reduced the total; `ruleId` names the rule that was applied
  /// (null when none applied); `reason` is the human-readable explanation the
  /// admin sees.
  public type DiscountApplication = {
    applied : Bool;
    ruleId : ?DiscountId;
    ruleName : Text;
    reason : Text;
  };

  /// The full pricing breakdown of a quote. Every amount is in cents.
  /// `originalSubtotal` is the sum of line items plus labor and materials
  /// before any discount; `discountAmount` is the amount subtracted;
  /// `adjustedSubtotal` is `originalSubtotal - discountAmount`; `taxAmount` is
  /// the configured tax on the adjusted subtotal; `finalTotal` is the amount
  /// owed after discount and tax; `depositAmount` is exactly 10% of
  /// `finalTotal`; `remainingBalance` is `finalTotal - depositAmount`.
  public type QuotePricing = {
    originalSubtotal : Nat;
    discountAmount : Nat;
    adjustedSubtotal : Nat;
    taxAmount : Nat;
    finalTotal : Nat;
    depositAmount : Nat;
    remainingBalance : Nat;
    discount : DiscountApplication;
  };

  /// Lifecycle of a deposit payment. `#pending` means no payment submitted;
  /// `#submitted` means the customer reported paying and the admin must verify;
  /// `#verified` means the admin confirmed receipt; `#rejected` means the admin
  /// did not receive the payment.
  public type DepositStatus = {
    #pending;
    #submitted;
    #verified;
    #rejected;
  };

  /// A tax setting: whether tax is charged and at what whole-percent rate.
  public type TaxSetting = {
    enabled : Bool;
    ratePercent : Nat;
  };

  /// A deposit setting: the deposit percentage of the final quote total.
  public type DepositSetting = {
    percent : Nat;
  };

  /// The payment methods the owner accepts, plus the owner's payment handles.
  /// The handles are the owner's own supplied payment information and are
  /// never invented or changed by the app.
  public type PaymentSettings = {
    acceptedMethods : [PaymentMethod];
    payPalHandle : Text;
    cashAppHandle : Text;
    venmoHandle : Text;
    chimeHandle : Text;
  };

  /// Quote defaults: how long a quote stays valid and the default terms text.
  public type QuoteSettings = {
    validityDays : Nat;
    terms : Text;
  };

  /// Business identity shown on quotes and emails.
  public type BusinessSettings = {
    businessName : Text;
    businessEmail : Text;
    businessPhone : Text;
    businessAddress : Text;
  };

  /// Admin notification and workflow toggles.
  public type AdminSettings = {
    customerRequestAlerts : Bool;
    notificationSound : Bool;
    pushNotifications : Bool;
    appointmentReminders : Bool;
    messageAlerts : Bool;
  };

  /// Lifecycle status of a job created from a confirmed request or quote.
  public type JobRecordStatus = {
    #scheduled;
    #inProgress;
    #completed;
    #cancelled;
  };

  /// A job created from a confirmed request or quote. Carries the customer,
  /// service, address, scheduled date/time, quote, discount, deposit, remaining
  /// balance and job status.
  public type JobRecord = {
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

  /// Shared (immutable) view of a job record.
  public type JobRecordView = {
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
    status : JobRecordStatus;
    createdAt : Timestamp;
    completedAt : ?Timestamp;
  };

  /// A permanent payment-history entry. Stores the original quote, discount,
  /// final quote, deposit, payment method, deposit status, remaining balance,
  /// final payment and total paid for one job.
  public type PaymentHistory = {
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

  /// Errors returned by discount and settings operations.
  public type SettingsError = {
    #notFound;
    #invalidInput : Text;
    #notAuthorized;
  };

  /// Approval lifecycle of a quote. A quote starts as `#draft` while the admin
  /// builds it, becomes `#sent` when presented to the customer, and ends as
  /// either `#approved` or `#declined`. `#approved` is the state that makes the
  /// quote convertible into a scheduled job.
  public type QuoteStatus = {
    #draft;
    #sent;
    #approved;
    #declined;
  };

  /// A single billable line on a quote: a described service with a quantity and
  /// a unit price. `unitPrice` is in cents.
  public type QuoteLineItem = {
    description : Text;
    quantity : Nat;
    unitPrice : Nat;
  };

  /// A quote sent by the admin for a job request.
  ///
  /// `amount` is the final amount the customer owes after any discount.
  /// `discountApplied` records whether the customer's own-parts/supplies
  /// discount was applied, and `discountAmount` is the amount subtracted
  /// (0 when no discount applies). Both are visible to the owner and the
  /// customer.
  ///
  /// The professional quote fields are additive and preserve the original
  /// `amount`/`note`/`sentAt`/`discountApplied`/`discountAmount` contract:
  /// - `quoteNumber` is the human-readable quote identifier.
  /// - `createdAt` is when the quote was first created.
  /// - `workDescription` describes the requested work in prose.
  /// - `lineItems` are the individual service line items.
  /// - `laborCharge` and `materialsCharge` are the labor and materials/additional
  ///   charges in cents.
  /// - `subtotal` is the sum of line items plus labor and materials before the
  ///   own-parts discount; `total` is the amount owed after the discount.
  /// - `depositRequired` is the deposit owed up front; `remainingBalance` is
  ///   `total - depositRequired`.
  /// - `expiresAt` is the quote expiration date (null when no expiry is set).
  /// - `status` is the customer approval status.
  /// - `pricing` is the full automatic pricing breakdown (original subtotal,
  ///   discount, adjusted subtotal, tax, final total, 10% deposit and remaining
  ///   balance) with the reason the discount was or was not applied. It is null
  ///   only for legacy quotes created before automatic pricing existed.
  public type Quote = {
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

  /// Input payload for creating or editing a quote. The admin supplies the
  /// requested work, line items, labor and materials charges, deposit
  /// requirement and optional expiration; the derived totals are computed by
  /// the quote domain logic.
  public type QuoteInput = {
    workDescription : Text;
    note : Text;
    lineItems : [QuoteLineItem];
    laborCharge : Nat;
    materialsCharge : Nat;
    depositRequired : Nat;
    expiresAt : ?Timestamp;
  };

  /// The own-parts/supplies discount rate applied to a quote: 10%.
  public let ownPartsDiscountPercent : Nat = 10;

  /// A deposit recorded against an accepted quote. The original
  /// `amount`/`paid`/`method`/`paidAt`/`stripeSessionId` contract is preserved;
  /// `status`, `submittedAt` and `verifiedAt` add the manual submission and
  /// admin-verification lifecycle. `paid` remains true only once the deposit is
  /// verified.
  public type Deposit = {
    amount : Nat;
    paid : Bool;
    method : PaymentMethod;
    paidAt : ?Timestamp;
    stripeSessionId : ?Text;
    status : DepositStatus;
    submittedAt : ?Timestamp;
    verifiedAt : ?Timestamp;
  };

  /// A scheduled appointment for a job.
  public type Appointment = {
    scheduledAt : Timestamp;
    confirmed : Bool;
  };

  /// A guest review left after a completed job.
  public type Review = {
    rating : Nat;
    comment : Text;
    createdAt : Timestamp;
  };

  /// A bee (employee) managed by the owner.
  public type Bee = {
    id : BeeId;
    name : Text;
    specialty : Text;
    createdAt : Timestamp;
  };

  /// Shared (immutable) view of a bee returned across the API boundary.
  public type BeeView = {
    id : BeeId;
    name : Text;
    specialty : Text;
    createdAt : Timestamp;
  };

  /// Input payload for creating or updating a bee.
  public type BeeInput = {
    name : Text;
    specialty : Text;
  };

  /// The monthly package deal: a fixed monthly price covering a set number of visits.
  public type PackagePlan = {
    monthlyPrice : Nat;
    includedVisits : Nat;
  };

  /// A customer's enrollment in the monthly package.
  public type PackageEnrollment = {
    active : Bool;
    monthlyPrice : Nat;
    includedVisits : Nat;
    startedAt : Timestamp;
  };

  /// A recorded visit for a job: date, service performed, and the assigned bee.
  public type VisitRecord = {
    jobId : JobId;
    referenceCode : ReferenceCode;
    service : ServiceCategory;
    beeId : ?BeeId;
    beeName : ?Text;
    completedAt : Timestamp;
  };

  /// A job request submitted by a guest.
  public type JobRequest = {
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

  /// Shared (immutable) view of a job request returned across the API boundary.
  public type JobRequestView = {
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
    status : JobStatus;
    quote : ?Quote;
    deposit : ?Deposit;
    appointment : ?Appointment;
    review : ?Review;
    assignedBeeId : ?BeeId;
    assignedBeeName : ?Text;
    packageEnrollment : ?PackageEnrollment;
    completedAt : ?Timestamp;
  };

  /// Admin dashboard statistics.
  public type DashboardStats = {
    newRequests : Nat;
    upcomingAppointments : Nat;
    depositsCollected : Nat;
    activeJobs : Nat;
    reviewsCount : Nat;
  };

  /// Input payload for submitting a new job request.
  public type JobRequestInput = {
    customerName : Text;
    email : Text;
    phone : Text;
    category : ServiceCategory;
    description : Text;
    preferredTiming : Text;
    photoIds : [PhotoId];
    packageInterest : Bool;
    ownParts : Bool;
  };

  /// Errors returned by guest-facing job operations.
  public type JobError = {
    #notFound;
    #invalidState : Text;
    #notAuthorized;
    #paymentError : Text;
  };

  /// Outcome of a single delivery channel for a quote email.
  public type QuoteEmailResult = {
    #sent;
    #failed : Text;
  };

  /// Result of sending a quote to the customer. `email` reports whether the
  /// transactional email was delivered, and `view` is the updated job view so
  /// the owner's Quotes workspace can refresh from the same response.
  public type QuoteSendResult = {
    email : QuoteEmailResult;
    view : JobRequestView;
  };

  /// Customer-facing view of a quote, carrying every field the emailed quote
  /// needs. `expired` is derived from `expiresAt` against the current time so
  /// the customer sees an expired quote as expired and cannot accept it.
  public type QuoteView = {
    referenceCode : ReferenceCode;
    quoteNumber : Text;
    workDescription : Text;
    note : Text;
    lineItems : [QuoteLineItem];
    laborCharge : Nat;
    materialsCharge : Nat;
    subtotal : Nat;
    discountApplied : Bool;
    discountAmount : Nat;
    total : Nat;
    depositRequired : Nat;
    remainingBalance : Nat;
    expiresAt : ?Timestamp;
    status : QuoteStatus;
    expired : Bool;
    pricing : ?QuotePricing;
  };

  /// Errors returned by guest-facing quote operations reached from an emailed
  /// quote link.
  public type QuoteError = {
    #notFound;
    #invalidState : Text;
    #expired;
  };

  /// Errors returned by owner-facing bee and package operations.
  public type BeeError = {
    #notFound;
    #invalidState : Text;
    #notAuthorized;
  };
};
