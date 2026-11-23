import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Result "mo:core/Result";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/notifications";
import JobTypes "../types/jobs";
import MessageLib "../lib/messages";
import NotificationLib "../lib/notifications";

mixin (
  messages : Map.Map<Types.MessageId, Types.Message>,
  notifications : Map.Map<Types.NotificationId, Types.Notification>,
  jobs : Map.Map<JobTypes.JobId, JobTypes.JobRequest>,
  customerByEmail : Map.Map<Text, Types.CustomerId>,
  customerByPhone : Map.Map<Text, Types.CustomerId>,
  customerState : {
    var nextCustomerId : Nat;
    var nextNotificationId : Nat;
    var nextMessageId : Nat;
    var nextNoteId : Nat;
  },
  accessControlState : AccessControl.AccessControlState,
) {
  func requireAdminMessages(caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) {};
      case (_) { Runtime.trap("Unauthorized: Only admins can perform this action") };
    };
  };

  /// Normalize an email for customer matching: trim and lowercase.
  func normalizeEmail(email : Text) : Text {
    email.trim(#text " ").toLower();
  };

  /// Normalize a phone number for customer matching: keep digits only.
  func normalizePhone(phone : Text) : Text {
    let digits = phone.toArray().filter(func c = c.isDigit());
    Text.fromIter(digits.values());
  };

  /// Resolve the permanent customer id for a job request, matching on
  /// normalized email first and then normalized phone.
  func customerIdForJobMessage(job : JobTypes.JobRequest) : ?Types.CustomerId {
    let emailKey = normalizeEmail(job.email);
    switch (customerByEmail.get(emailKey)) {
      case (?id) { return ?id };
      case null {};
    };
    let phoneKey = normalizePhone(job.phone);
    if (phoneKey.size() == 0) { return null };
    customerByPhone.get(phoneKey);
  };

  func findJobByReferenceMessage(referenceCode : Text) : ?JobTypes.JobRequest {
    jobs.values().find(func(job) = job.referenceCode == referenceCode);
  };

  /// Admin: list a customer's message thread newest first.
  public query ({ caller }) func listCustomerMessages(customerId : Types.CustomerId) : async [Types.MessageView] {
    requireAdminMessages(caller);
    MessageLib.thread(messages.values().toArray(), customerId);
  };

  /// Admin: post a reply into a customer's thread.
  public shared ({ caller }) func postAdminMessage(customerId : Types.CustomerId, jobId : ?Types.JobId, body : Text) : async Result.Result<Types.MessageView, Types.MessageError> {
    requireAdminMessages(caller);
    if (body.size() == 0) {
      return #err(#invalidInput("Message body cannot be empty"));
    };
    let id = customerState.nextMessageId;
    customerState.nextMessageId := id + 1;
    let message = MessageLib.create(id, customerId, jobId, true, body, Time.now());
    messages.add(id, message);
    #ok(MessageLib.toView(message));
  };

  /// Customer: post a message using their job reference code. The customer is
  /// resolved from the job, so a caller can only ever write to their own thread.
  public shared ({ caller }) func postCustomerMessage(referenceCode : Text, body : Text) : async Result.Result<Types.MessageView, Types.MessageError> {
    ignore caller;
    if (body.size() == 0) {
      return #err(#invalidInput("Message body cannot be empty"));
    };
    switch (findJobByReferenceMessage(referenceCode)) {
      case (?job) {
        let customerId = switch (customerIdForJobMessage(job)) {
          case (?id) { id };
          case null { return #err(#notFound) };
        };
        let id = customerState.nextMessageId;
        customerState.nextMessageId := id + 1;
        let message = MessageLib.create(id, customerId, ?job.id, false, body, Time.now());
        messages.add(id, message);
        ignore NotificationLib.raise(
          notifications,
          customerState,
          #customerMessage,
          "New message from " # job.customerName,
          body,
          ?job.id,
          ?customerId,
          Time.now(),
        );
        #ok(MessageLib.toView(message));
      };
      case null { #err(#notFound) };
    };
  };

  /// Customer: read their own thread using their job reference code. Only
  /// messages belonging to the resolved customer are returned.
  public query func getCustomerMessages(referenceCode : Text) : async [Types.MessageView] {
    switch (findJobByReferenceMessage(referenceCode)) {
      case (?job) {
        switch (customerIdForJobMessage(job)) {
          case (?customerId) { MessageLib.thread(messages.values().toArray(), customerId) };
          case null { [] };
        };
      };
      case null { [] };
    };
  };
};
