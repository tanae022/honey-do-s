import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Result "mo:core/Result";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/notifications";
import NotificationLib "../lib/notifications";

mixin (
  notifications : Map.Map<Types.NotificationId, Types.Notification>,
  customerState : {
    var nextCustomerId : Nat;
    var nextNotificationId : Nat;
    var nextMessageId : Nat;
    var nextNoteId : Nat;
  },
  accessControlState : AccessControl.AccessControlState,
) {
  func requireAdminNotifications(caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) {};
      case (_) { Runtime.trap("Unauthorized: Only admins can perform this action") };
    };
  };

  /// Raise an admin dashboard notification for one of the tracked triggers.
  /// The job and deposit flows call this helper directly.
  public func raiseNotification(
    kind : Types.NotificationKind,
    title : Text,
    body : Text,
    relatedJobId : ?Types.JobId,
    relatedCustomerId : ?Types.CustomerId,
  ) : async Types.NotificationId {
    NotificationLib.raise(
      notifications,
      customerState,
      kind,
      title,
      body,
      relatedJobId,
      relatedCustomerId,
      Time.now(),
    );
  };

  /// Admin: list every notification newest first.
  public query ({ caller }) func listNotifications() : async [Types.NotificationView] {
    requireAdminNotifications(caller);
    NotificationLib.list(notifications.values().toArray());
  };

  /// Admin: count the notifications that have not been reviewed yet.
  public query ({ caller }) func getUnreadNotificationCount() : async Nat {
    requireAdminNotifications(caller);
    NotificationLib.unreadCount(notifications.values().toArray());
  };

  /// Admin: mark a single notification read.
  public shared ({ caller }) func markNotificationRead(id : Types.NotificationId) : async Result.Result<(), Types.NotificationError> {
    requireAdminNotifications(caller);
    if (NotificationLib.markRead(notifications.values().toArray(), id)) {
      #ok(());
    } else {
      #err(#notFound);
    };
  };

  /// Admin: mark every notification read.
  public shared ({ caller }) func markAllNotificationsRead() : async () {
    requireAdminNotifications(caller);
    NotificationLib.markAllRead(notifications.values().toArray());
  };
};
