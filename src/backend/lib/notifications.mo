import Int "mo:core/Int";
import Map "mo:core/Map";
import Types "../types/notifications";

module {
  public type Notification = Types.Notification;
  public type NotificationView = Types.NotificationView;
  public type NotificationKind = Types.NotificationKind;
  public type NotificationId = Types.NotificationId;
  public type CustomerId = Types.CustomerId;
  public type JobId = Types.JobId;
  public type Timestamp = Types.Timestamp;

  /// Convert an internal notification into its shared view.
  public func toView(notification : Notification) : NotificationView {
    {
      id = notification.id;
      kind = notification.kind;
      title = notification.title;
      body = notification.body;
      createdAt = notification.createdAt;
      read = notification.read;
      relatedJobId = notification.relatedJobId;
      relatedCustomerId = notification.relatedCustomerId;
    };
  };

  /// Create a new notification record. `relatedJobId` and `relatedCustomerId`
  /// are optional so a notification can point at a job, a customer, both, or
  /// neither.
  public func create(
    id : NotificationId,
    kind : NotificationKind,
    title : Text,
    body : Text,
    relatedJobId : ?JobId,
    relatedCustomerId : ?CustomerId,
    now : Timestamp,
  ) : Notification {
    {
      id;
      kind;
      title;
      body;
      createdAt = now;
      var read = false;
      relatedJobId;
      relatedCustomerId;
    };
  };

  /// Create and store a notification, advancing the shared notification
  /// counter. This is the single entry point every trigger flow calls, so the
  /// job, deposit and message domains raise notifications the same way.
  public func raise(
    notifications : Map.Map<NotificationId, Notification>,
    customerState : { var nextNotificationId : Nat },
    kind : NotificationKind,
    title : Text,
    body : Text,
    relatedJobId : ?JobId,
    relatedCustomerId : ?CustomerId,
    now : Timestamp,
  ) : NotificationId {
    let id = customerState.nextNotificationId;
    customerState.nextNotificationId := id + 1;
    notifications.add(id, create(id, kind, title, body, relatedJobId, relatedCustomerId, now));
    id;
  };

  /// Raise a quote-approval notification for a job whose quote the customer
  /// accepted.
  public func raiseQuoteApproved(
    notifications : Map.Map<NotificationId, Notification>,
    customerState : { var nextNotificationId : Nat },
    jobId : JobId,
    referenceCode : Text,
    customerName : Text,
    customerId : ?CustomerId,
    now : Timestamp,
  ) : NotificationId {
    raise(
      notifications,
      customerState,
      #quoteApproved,
      "Quote approved for " # referenceCode,
      customerName # " approved the quote for " # referenceCode,
      ?jobId,
      customerId,
      now,
    );
  };

  /// Raise a quote-decline notification for a job whose quote was declined.
  public func raiseQuoteDeclined(
    notifications : Map.Map<NotificationId, Notification>,
    customerState : { var nextNotificationId : Nat },
    jobId : JobId,
    referenceCode : Text,
    customerName : Text,
    customerId : ?CustomerId,
    now : Timestamp,
  ) : NotificationId {
    raise(
      notifications,
      customerState,
      #quoteDeclined,
      "Quote declined for " # referenceCode,
      customerName # " declined the quote for " # referenceCode,
      ?jobId,
      customerId,
      now,
    );
  };

  /// Raise an appointment-confirmation notification for a job whose scheduled
  /// appointment the customer confirmed.
  public func raiseAppointmentConfirmed(
    notifications : Map.Map<NotificationId, Notification>,
    customerState : { var nextNotificationId : Nat },
    jobId : JobId,
    referenceCode : Text,
    customerName : Text,
    customerId : ?CustomerId,
    now : Timestamp,
  ) : NotificationId {
    raise(
      notifications,
      customerState,
      #appointmentConfirmed,
      "Appointment confirmed for " # referenceCode,
      customerName # " confirmed the appointment for " # referenceCode,
      ?jobId,
      customerId,
      now,
    );
  };

  /// Raise an appointment-change notification for a job whose appointment was
  /// rescheduled.
  public func raiseAppointmentChanged(
    notifications : Map.Map<NotificationId, Notification>,
    customerState : { var nextNotificationId : Nat },
    jobId : JobId,
    referenceCode : Text,
    customerName : Text,
    customerId : ?CustomerId,
    now : Timestamp,
  ) : NotificationId {
    raise(
      notifications,
      customerState,
      #appointmentChanged,
      "Appointment changed for " # referenceCode,
      customerName # "'s appointment for " # referenceCode # " was rescheduled",
      ?jobId,
      customerId,
      now,
    );
  };

  /// List notifications newest first.
  public func list(notifications : [Notification]) : [NotificationView] {
    let views = notifications.map(func(notification) = toView(notification));
    views.sort(func (a, b) = Int.compare(b.createdAt, a.createdAt));
  };

  /// Count the notifications that have not been reviewed yet.
  public func unreadCount(notifications : [Notification]) : Nat {
    notifications.foldLeft(0, func(acc, notification) = if (notification.read) { acc } else { acc + 1 });
  };

  /// Mark a single notification read. Returns false when the id is unknown.
  public func markRead(notifications : [Notification], id : NotificationId) : Bool {
    switch (notifications.find(func(notification) = notification.id == id)) {
      case (?notification) {
        notification.read := true;
        true;
      };
      case null { false };
    };
  };

  /// Mark every notification read.
  public func markAllRead(notifications : [Notification]) : () {
    for (notification in notifications.values()) {
      notification.read := true;
    };
  };
};
