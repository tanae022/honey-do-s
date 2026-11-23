import Common "common";
import Jobs "jobs";

module {
  public type Timestamp = Common.Timestamp;
  public type CustomerId = Common.CustomerId;
  public type JobId = Common.JobId;
  public type PhotoId = Common.PhotoId;

  /// Lifecycle status of a customer record.
  public type CustomerStatus = {
    #active;
    #inactive;
    #archived;
  };

  /// How a customer prefers to be contacted.
  public type PreferredContact = {
    #email;
    #phone;
    #sms;
  };

  /// An internal administrative note attached to a customer profile.
  public type CustomerNote = {
    id : Nat;
    body : Text;
    createdAt : Timestamp;
  };

  /// A permanent customer record. Created automatically for every service
  /// request and matched on normalized email/phone so returning customers are
  /// recognized instead of duplicated.
  public type Customer = {
    id : CustomerId;
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

  /// Input payload for creating or editing a customer record.
  public type CustomerInput = {
    fullName : Text;
    phone : Text;
    email : Text;
    serviceAddress : Text;
    preferredContact : PreferredContact;
  };

  /// Shared (immutable) view of a customer returned across the API boundary.
  public type CustomerView = {
    id : CustomerId;
    fullName : Text;
    phone : Text;
    email : Text;
    serviceAddress : Text;
    preferredContact : PreferredContact;
    createdAt : Timestamp;
    status : CustomerStatus;
    adminNotes : Text;
    notes : [CustomerNote];
  };

  /// A directory row for the searchable customer list.
  public type CustomerSummary = {
    id : CustomerId;
    fullName : Text;
    phone : Text;
    email : Text;
    serviceAddress : Text;
    status : CustomerStatus;
    jobCount : Nat;
  };

  /// A customer profile aggregating the customer with their service history,
  /// payments, appointments, notes and uploaded photos. The service-management
  /// upgrade adds the customer's quotes, job records, payment history and
  /// message thread so the profile is a complete CRM view.
  public type CustomerProfileView = {
    customer : CustomerView;
    jobs : [Jobs.JobRequestView];
    completedJobs : [Jobs.JobRequestView];
    pendingJobs : [Jobs.JobRequestView];
    cancelledJobs : [Jobs.JobRequestView];
    deposits : [Jobs.Deposit];
    appointments : [Jobs.Appointment];
    photoIds : [PhotoId];
    quotes : [Jobs.Quote];
    jobRecords : [Jobs.JobRecordView];
    payments : [Jobs.PaymentHistory];
    messages : [MessageView];
  };

  /// Shared (immutable) view of a customer/administrator message, re-exported
  /// from the notification domain so the customer profile can carry the
  /// customer's message thread without a cross-domain import cycle.
  public type MessageView = {
    id : Nat;
    customerId : CustomerId;
    jobId : ?JobId;
    fromAdmin : Bool;
    body : Text;
    createdAt : Timestamp;
  };

  /// Errors returned by customer management operations.
  public type CustomerError = {
    #notFound;
    #invalidInput : Text;
    #notAuthorized;
  };
};
