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

  type OldQuote = {
    amount : Nat;
    note : Text;
    sentAt : Timestamp;
  };

  type NewQuote = {
    amount : Nat;
    note : Text;
    sentAt : Timestamp;
    discountApplied : Bool;
    discountAmount : Nat;
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

  type Bee = {
    id : BeeId;
    name : Text;
    specialty : Text;
    createdAt : Timestamp;
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
    var quote : ?OldQuote;
    var deposit : ?Deposit;
    var appointment : ?Appointment;
    var review : ?Review;
    var assignedBeeId : ?BeeId;
    var packageEnrollment : ?PackageEnrollment;
    var completedAt : ?Timestamp;
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
    ownParts : Bool;
    var status : JobStatus;
    var quote : ?NewQuote;
    var deposit : ?Deposit;
    var appointment : ?Appointment;
    var review : ?Review;
    var assignedBeeId : ?BeeId;
    var packageEnrollment : ?PackageEnrollment;
    var completedAt : ?Timestamp;
  };

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    jobs : Map.Map<JobId, OldJobRequest>;
    bees : Map.Map<BeeId, Bee>;
    state : { var nextJobId : Nat; var nextBeeId : Nat };
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
        let quote = switch (job.quote) {
          case (?q) {
            ?{
              amount = q.amount;
              note = q.note;
              sentAt = q.sentAt;
              discountApplied = false;
              discountAmount = 0;
            };
          };
          case null { null };
        };
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
          ownParts = false;
          var status = job.status;
          var quote = quote;
          var deposit = job.deposit;
          var appointment = job.appointment;
          var review = job.review;
          var assignedBeeId = job.assignedBeeId;
          var packageEnrollment = job.packageEnrollment;
          var completedAt = job.completedAt;
        };
      }
    );
    {
      accessControlState = old.accessControlState;
      jobs;
      bees = old.bees;
      state = old.state;
      stripeConfiguration = old.stripeConfiguration;
    };
  };
};
