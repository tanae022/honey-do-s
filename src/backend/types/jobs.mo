import Common "common";

module {
  public type Timestamp = Common.Timestamp;
  public type ReferenceCode = Common.ReferenceCode;
  public type JobId = Common.JobId;
  public type PhotoId = Common.PhotoId;
  public type BeeId = Common.BeeId;

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
  };

  /// Payment method used for a deposit.
  public type PaymentMethod = {
    #stripe;
    #cashApp;
  };

  /// A quote sent by the admin for a job request.
  ///
  /// `amount` is the final amount the customer owes after any discount.
  /// `discountApplied` records whether the customer's own-parts/supplies
  /// discount was applied, and `discountAmount` is the amount subtracted
  /// (0 when no discount applies). Both are visible to the owner and the
  /// customer.
  public type Quote = {
    amount : Nat;
    note : Text;
    sentAt : Timestamp;
    discountApplied : Bool;
    discountAmount : Nat;
  };

  /// The own-parts/supplies discount rate applied to a quote: 10%.
  public let ownPartsDiscountPercent : Nat = 10;

  /// A deposit recorded against an accepted quote.
  public type Deposit = {
    amount : Nat;
    paid : Bool;
    method : PaymentMethod;
    paidAt : ?Timestamp;
    stripeSessionId : ?Text;
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

  /// Errors returned by owner-facing bee and package operations.
  public type BeeError = {
    #notFound;
    #invalidState : Text;
    #notAuthorized;
  };
};
