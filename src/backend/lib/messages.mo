import Int "mo:core/Int";
import Types "../types/notifications";

module {
  public type Message = Types.Message;
  public type MessageView = Types.MessageView;
  public type MessageId = Types.MessageId;
  public type CustomerId = Types.CustomerId;
  public type JobId = Types.JobId;
  public type Timestamp = Types.Timestamp;

  /// Convert an internal message into its shared view.
  public func toView(message : Message) : MessageView {
    {
      id = message.id;
      customerId = message.customerId;
      jobId = message.jobId;
      fromAdmin = message.fromAdmin;
      body = message.body;
      createdAt = message.createdAt;
    };
  };

  /// Create a new message in a customer's thread. `fromAdmin` distinguishes an
  /// administrator reply from a customer message.
  public func create(
    id : MessageId,
    customerId : CustomerId,
    jobId : ?JobId,
    fromAdmin : Bool,
    body : Text,
    now : Timestamp,
  ) : Message {
    { id; customerId; jobId; fromAdmin; body; createdAt = now };
  };

  /// List a single customer's thread newest first. Only messages belonging to
  /// `customerId` are returned, so a customer can never see another customer's
  /// thread.
  public func thread(messages : [Message], customerId : CustomerId) : [MessageView] {
    let views = messages.filter(func(message) = message.customerId == customerId).map(
      func(message) = toView(message)
    );
    views.sort(func (a, b) = Int.compare(b.createdAt, a.createdAt));
  };
};
