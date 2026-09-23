import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";

module {
  type JobId = Nat;
  type BeeId = Nat;
  type Timestamp = Int;
  type ReferenceCode = Text;
  type PhotoId = Text;

  type ServiceCategory = {
    #house;
    #yardPlants;
    #fixIt;
    #cleanOrganize;
    #moveLift;
    #driving;
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
  };

  type PaymentMethod = {
    #stripe;
    #cashApp;
  };

  type Quote = {
    amount : Nat;
    note : Text;
    sentAt : Timestamp;
  };

  type Deposit = {
    amount : Nat;
    paid : Bool;
    method : PaymentMethod;
    paidAt : ?Timestamp;
    stripeSessionId : ?Text;
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
    var status : JobStatus;
    var quote : ?Quote;
    var deposit : ?Deposit;
    var appointment : ?Appointment;
    var review : ?Review;
  };

  type NewJobRequest = {
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
    var status : JobStatus;
    var quote : ?Quote;
    var deposit : ?Deposit;
    var appointment : ?Appointment;
    var review : ?Review;
    var assignedBeeId : ?BeeId;
    var packageEnrollment : ?PackageEnrollment;
    var completedAt : ?Timestamp;
  };

  type Bee = {
    id : BeeId;
    name : Text;
    specialty : Text;
    createdAt : Timestamp;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    jobs : Map.Map<JobId, OldJobRequest>;
    state : { var nextJobId : Nat };
    stripeConfiguration : { var config : ?StripeConfiguration };
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    jobs : Map.Map<JobId, NewJobRequest>;
    bees : Map.Map<BeeId, Bee>;
    state : { var nextJobId : Nat; var nextBeeId : Nat };
    stripeConfiguration : { var config : ?StripeConfiguration };
  };

  public func migration(old : OldActor) : NewActor {
    let jobs = old.jobs.map<JobId, OldJobRequest, NewJobRequest>(
      func(_, job) {
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
          var status = job.status;
          var quote = job.quote;
          var deposit = job.deposit;
          var appointment = job.appointment;
          var review = job.review;
          var assignedBeeId = null : ?BeeId;
          var packageEnrollment = null : ?PackageEnrollment;
          var completedAt = null : ?Timestamp;
        };
      }
    );
    {
      accessControlState = old.accessControlState;
      jobs;
      bees = Map.empty();
      state = { var nextJobId = old.state.nextJobId; var nextBeeId = 0 };
      stripeConfiguration = old.stripeConfiguration;
    };
  };
};
