module {
  /// Nanosecond timestamp (Time.now()).
  public type Timestamp = Int;

  /// Public reference code a guest uses to track their job.
  public type ReferenceCode = Text;

  /// Identifier of a job request.
  public type JobId = Nat;

  /// Identifier of a stored photo object.
  public type PhotoId = Text;

  /// Identifier of a bee (employee).
  public type BeeId = Nat;

  /// Identifier of a permanent customer record.
  public type CustomerId = Nat;

  /// Identifier of an admin dashboard notification.
  public type NotificationId = Nat;

  /// Identifier of a customer/administrator message.
  public type MessageId = Nat;

  /// Identifier of a saved discount rule.
  public type DiscountId = Nat;

  /// Identifier of a job created from a confirmed request or quote.
  public type JobRecordId = Nat;

  /// Identifier of a permanent payment-history entry.
  public type PaymentId = Nat;
};
