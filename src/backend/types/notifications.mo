import Common "common";

module {
  public type Timestamp = Common.Timestamp;
  public type NotificationId = Common.NotificationId;
  public type MessageId = Common.MessageId;
  public type CustomerId = Common.CustomerId;
  public type JobId = Common.JobId;

  /// Why a notification was raised.
  ///
  /// The original kinds are preserved. The management area additionally
  /// distinguishes quote approvals and declines, appointment confirmations and
  /// appointment changes so each trigger can be surfaced with its own
  /// indicator. The service-management triggers add a new request, a new
  /// message, a submitted deposit, a verified deposit, an appointment reminder
  /// and a received payment.
  public type NotificationKind = {
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

  /// An admin dashboard notification. Unread notifications are retained until
  /// the administrator reviews them.
  public type Notification = {
    id : NotificationId;
    kind : NotificationKind;
    title : Text;
    body : Text;
    createdAt : Timestamp;
    var read : Bool;
    relatedJobId : ?JobId;
    relatedCustomerId : ?CustomerId;
  };

  /// Shared (immutable) view of a notification.
  public type NotificationView = {
    id : NotificationId;
    kind : NotificationKind;
    title : Text;
    body : Text;
    createdAt : Timestamp;
    read : Bool;
    relatedJobId : ?JobId;
    relatedCustomerId : ?CustomerId;
  };

  /// Errors returned by notification operations.
  public type NotificationError = {
    #notFound;
    #notAuthorized;
  };

  /// A message exchanged between a customer and the administrator about a job.
  public type Message = {
    id : MessageId;
    customerId : CustomerId;
    jobId : ?JobId;
    fromAdmin : Bool;
    body : Text;
    createdAt : Timestamp;
  };

  /// Shared (immutable) view of a message.
  public type MessageView = {
    id : MessageId;
    customerId : CustomerId;
    jobId : ?JobId;
    fromAdmin : Bool;
    body : Text;
    createdAt : Timestamp;
  };

  /// Errors returned by messaging operations.
  public type MessageError = {
    #notFound;
    #invalidInput : Text;
    #notAuthorized;
  };
};
