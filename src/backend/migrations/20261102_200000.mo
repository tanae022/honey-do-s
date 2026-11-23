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
    #cancelled;
  };

  type PaymentMethod = {
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

  type OldActor = {
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
    /// Public base URL of the app's frontend, used to build absolute links in
    /// customer emails. Empty means "not configured"; the backend then falls
    /// back to a sensible default origin.
    frontendOrigin : { var origin : Text };
  };

  public func migration(old : OldActor) : NewActor {
    {
      accessControlState = old.accessControlState;
      jobs = old.jobs;
      bees = old.bees;
      state = old.state;
      stripeConfiguration = old.stripeConfiguration;
      ownerEmail = old.ownerEmail;
      ownerPhone = old.ownerPhone;
      twilioConfig = old.twilioConfig;
      customers = old.customers;
      customerByEmail = old.customerByEmail;
      customerByPhone = old.customerByPhone;
      notifications = old.notifications;
      messages = old.messages;
      customerState = old.customerState;
      frontendOrigin = { var origin = "" };
    };
  };
};
