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

  type OldActor = {
    accessControlState : AccessControl.AccessControlState;
    jobs : Map.Map<JobId, JobRequest>;
    bees : Map.Map<BeeId, Bee>;
    state : { var nextJobId : Nat; var nextBeeId : Nat };
    stripeConfiguration : { var config : ?StripeConfiguration };
    ownerEmail : { var address : Text };
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
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      jobs = old.jobs;
      bees = old.bees;
      state = old.state;
      stripeConfiguration = old.stripeConfiguration;
      // Preserve an already-configured owner address; seed the owner's real
      // address when the field is still empty so new-request alerts have a
      // recipient.
      ownerEmail = {
        var address = if (old.ownerEmail.address.size() == 0) {
          "tanae022@gmail.com";
        } else {
          old.ownerEmail.address;
        };
      };
      ownerPhone = { var number = "+14053124987" };
      twilioConfig = {
        var accountSid = "";
        var keySid = "";
        var keySecret = "";
        var fromNumber = "";
      };
    };
  };
};
