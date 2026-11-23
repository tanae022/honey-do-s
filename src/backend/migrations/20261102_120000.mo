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

  type OldJobStatus = {
    #requested;
    #quoted;
    #scheduled;
    #inProgress;
    #completed;
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
    var status : OldJobStatus;
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

  /// Normalize an email for returning-customer matching: trim and lowercase.
  func normalizeEmail(email : Text) : Text {
    email.trim(#text " ").toLower();
  };

  /// Normalize a phone number for returning-customer matching: keep digits only.
  func normalizePhone(phone : Text) : Text {
    let digits = phone.toArray().filter(func (c : Char) : Bool = c.isDigit());
    Text.fromIter(digits.values());
  };

  public func migration(old : OldActor) : NewActor {
    // Widen each job's status variant to the new JobStatus, which adds the
    // terminal `#cancelled` constructor. Existing statuses are preserved.
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
          var status = job.status : JobStatus;
          var quote = job.quote;
          var deposit = job.deposit;
          var appointment = job.appointment;
          var review = job.review;
          var assignedBeeId = job.assignedBeeId;
          var packageEnrollment = job.packageEnrollment;
          var completedAt = job.completedAt;
        };
      },
    );

    let customers = Map.empty<Nat, Customer>();
    let customerByEmail = Map.empty<Text, Nat>();
    let customerByPhone = Map.empty<Text, Nat>();
    var nextCustomerId = 0;

    // Backfill one customer per distinct person from existing job requests,
    // matching on normalized email first, then normalized phone, so returning
    // customers are not duplicated.
    for (job in jobs.values()) {
      let emailKey = normalizeEmail(job.email);
      let phoneKey = normalizePhone(job.phone);
      let existing = switch (customerByEmail.get(emailKey)) {
        case (?id) { ?id };
        case null {
          if (phoneKey.size() == 0) { null } else { customerByPhone.get(phoneKey) };
        };
      };
      switch (existing) {
        case (?_) {};
        case null {
          let id = nextCustomerId;
          nextCustomerId += 1;
          let customer : Customer = {
            id;
            fullName = job.customerName;
            phone = job.phone;
            email = job.email;
            serviceAddress = "";
            preferredContact = #email;
            createdAt = job.createdAt;
            var status = #active;
            var adminNotes = "";
            var notes = [];
          };
          customers.add(id, customer);
          if (emailKey.size() > 0) { customerByEmail.add(emailKey, id) };
          if (phoneKey.size() > 0) { customerByPhone.add(phoneKey, id) };
        };
      };
    };

    {
      accessControlState = old.accessControlState;
      jobs;
      bees = old.bees;
      state = old.state;
      stripeConfiguration = old.stripeConfiguration;
      ownerEmail = old.ownerEmail;
      ownerPhone = old.ownerPhone;
      twilioConfig = old.twilioConfig;
      customers;
      customerByEmail;
      customerByPhone;
      notifications = Map.empty();
      messages = Map.empty();
      customerState = {
        var nextCustomerId;
        var nextNotificationId = 0;
        var nextMessageId = 0;
        var nextNoteId = 0;
      };
    };
  };
};
