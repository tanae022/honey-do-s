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
};
