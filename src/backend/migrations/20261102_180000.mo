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

  /// The pre-upgrade quote shape: the original five fields only.
  type OldQuote = {
    amount : Nat;
    note : Text;
    sentAt : Timestamp;
    discountApplied : Bool;
    discountAmount : Nat;
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

  /// The extended quote shape carrying the professional quote fields.
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
    var deposit : ?Deposit;
    var appointment : ?Appointment;
    var review : ?Review;
    var assignedBeeId : ?BeeId;
    var packageEnrollment : ?PackageEnrollment;
    var completedAt : ?Timestamp;
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

  type OldNotificationKind = {
    #newCustomer;
    #returningCustomerRequest;
    #customerMessage;
    #bookingApproval;
    #depositReceived;
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
  };

  /// Widen an old quote to the extended shape. The original amount, note,
  /// sentAt and discount fields are preserved; the new professional fields are
  /// derived from the old amount so an existing quote keeps its meaning:
  /// the old amount becomes the total, the subtotal and the single line item,
  /// and the deposit requirement is half the total (the existing deposit rule).
  func widenQuote(old : OldQuote) : Quote {
    let depositRequired = old.amount / 2;
    let remainingBalance = old.amount - depositRequired;
    {
      amount = old.amount;
      note = old.note;
      sentAt = old.sentAt;
      discountApplied = old.discountApplied;
      discountAmount = old.discountAmount;
      quoteNumber = "";
      createdAt = old.sentAt;
      workDescription = old.note;
      lineItems = [{
        description = old.note;
        quantity = 1;
        unitPrice = old.amount;
      }];
      laborCharge = 0;
      materialsCharge = 0;
      subtotal = old.amount;
      total = old.amount;
      depositRequired;
      remainingBalance;
      expiresAt = null;
      status = #sent;
    };
  };

  public func migration(old : OldActor) : NewActor {
    // Widen each job's quote to the extended shape, preserving every existing
    // quote record and its original amount/note/sentAt/discount fields.
    let jobs = old.jobs.map<JobId, OldJobRequest, JobRequest>(
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
          ownParts = job.ownParts;
          var status = job.status;
          var quote = switch (job.quote) {
            case (?q) { ?widenQuote(q) };
            case null { null };
          };
          var deposit = job.deposit;
          var appointment = job.appointment;
          var review = job.review;
          var assignedBeeId = job.assignedBeeId;
          var packageEnrollment = job.packageEnrollment;
          var completedAt = job.completedAt;
        };
      },
    );

    // Widen each notification's kind to the extended variant, preserving every
    // existing notification and its original kind.
    let notifications = old.notifications.map<Nat, OldNotification, Notification>(
      func(_, notification) {
        {
          id = notification.id;
          kind = notification.kind : NotificationKind;
          title = notification.title;
          body = notification.body;
          createdAt = notification.createdAt;
          var read = notification.read;
          relatedJobId = notification.relatedJobId;
          relatedCustomerId = notification.relatedCustomerId;
        };
      },
    );

    {
      accessControlState = old.accessControlState;
      jobs;
      bees = old.bees;
      state = old.state;
      stripeConfiguration = old.stripeConfiguration;
      ownerEmail = old.ownerEmail;
      ownerPhone = old.ownerPhone;
      twilioConfig = old.twilioConfig;
      customers = old.customers;
      customerByEmail = old.customerByEmail;
      customerByPhone = old.customerByPhone;
      notifications;
      messages = old.messages;
      customerState = old.customerState;
    };
  };
};
