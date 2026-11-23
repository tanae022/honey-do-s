import AccessControl "mo:caffeineai-authorization/access-control";
import EmailClient "mo:caffeineai-email/emailClient";
import MessageApi "mo:twilio-client/Apis/Api20100401MessageApi";
import TwilioConfig "mo:twilio-client/Config";
import Result "mo:core/Result";
import Runtime "mo:core/Runtime";
import Types "../types/owner-notifications";
import OwnerNotificationsLib "../lib/owner-notifications";

mixin (
  accessControlState : AccessControl.AccessControlState,
  ownerEmail : { var address : Text },
  ownerPhone : { var number : Text },
  twilioConfig : {
    var accountSid : Text;
    var keySid : Text;
    var keySecret : Text;
    var fromNumber : Text;
  },
  frontendOrigin : { var origin : Text },
) {
  func requireOwnerNotificationsAdmin(caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) {};
      case (_) { Runtime.trap("Unauthorized: Only admins can perform this action") };
    };
  };

  /// Send an email and report the outcome. A failure or trap from the email
  /// integration is caught and returned as `#err` rather than aborting the call.
  func sendAlert(recipient : Text, subject : Text, body : Text) : async EmailClient.SendResult {
    try {
      await EmailClient.sendServiceEmail("Honey Do's", [recipient], subject, body);
    } catch (error) {
      #err("Failed to send email: " # error.message());
    };
  };

  /// Send an SMS through the Twilio messaging connector and report the
  /// outcome. A failure or trap is caught and returned as `#err` rather than
  /// aborting the caller.
  func sendSmsAlert(recipient : Text, body : Text) : async Types.ChannelResult {
    if (twilioConfig.accountSid.size() == 0 or twilioConfig.keySid.size() == 0 or twilioConfig.keySecret.size() == 0 or twilioConfig.fromNumber.size() == 0) {
      return #failed("Twilio messaging is not configured");
    };
    let config = {
      TwilioConfig.defaultConfig with
      auth = ?#basicAuth({ user = twilioConfig.keySid; password = twilioConfig.keySecret });
    };
    try {
      let api = MessageApi.Api20100401MessageApi(config);
      ignore await api.createMessage(
        twilioConfig.accountSid,
        recipient,
        "",
        "",
        0.0,
        false,
        0,
        0,
        false,
        null,
        null,
        false,
        [],
        null,
        false,
        null,
        "",
        false,
        "",
        null,
        twilioConfig.fromNumber,
        "",
        "",
        body,
        [],
        "",
      );
      #sent;
    } catch (error) {
      #failed("Failed to send SMS: " # error.message());
    };
  };

  /// Admin: read the current owner alert email address.
  public query ({ caller }) func getOwnerAlertEmail() : async Text {
    requireOwnerNotificationsAdmin(caller);
    ownerEmail.address;
  };

  /// Admin: validate and persist a new owner alert email address.
  public shared ({ caller }) func setOwnerAlertEmail(address : Text) : async Result.Result<Text, Types.OwnerAlertError> {
    requireOwnerNotificationsAdmin(caller);
    let normalized = OwnerNotificationsLib.normalizeEmail(address);
    if (not OwnerNotificationsLib.isValidEmail(normalized)) {
      return #err(#invalidEmail("Enter a valid email address"));
    };
    ownerEmail.address := normalized;
    #ok(normalized);
  };

  /// Admin: read the current owner alert phone number.
  public query ({ caller }) func getOwnerAlertPhone() : async Text {
    requireOwnerNotificationsAdmin(caller);
    ownerPhone.number;
  };

  /// Admin: validate and persist a new owner alert phone number, normalized
  /// to E.164.
  public shared ({ caller }) func setOwnerAlertPhone(number : Text) : async Result.Result<Text, Types.OwnerAlertPhoneError> {
    requireOwnerNotificationsAdmin(caller);
    let normalized = OwnerNotificationsLib.normalizePhone(number);
    if (not OwnerNotificationsLib.isValidPhone(normalized)) {
      return #err(#invalidPhone("Enter a valid phone number in E.164 format, e.g. +14053124987"));
    };
    ownerPhone.number := normalized;
    #ok(normalized);
  };

  /// Admin: read whether the Twilio messaging credential is configured and
  /// which sending number it uses.
  public query ({ caller }) func getTwilioConfigStatus() : async Types.TwilioConfigStatus {
    requireOwnerNotificationsAdmin(caller);
    {
      configured = twilioConfig.accountSid.size() > 0 and twilioConfig.keySid.size() > 0 and twilioConfig.keySecret.size() > 0 and twilioConfig.fromNumber.size() > 0;
      fromNumber = twilioConfig.fromNumber;
    };
  };

  /// Admin: store the Twilio messaging credential. The secret is held by the
  /// canister only and never returned to the frontend.
  public shared ({ caller }) func setTwilioCredentials(accountSid : Text, keySid : Text, keySecret : Text, fromNumber : Text) : async () {
    requireOwnerNotificationsAdmin(caller);
    twilioConfig.accountSid := accountSid;
    twilioConfig.keySid := keySid;
    twilioConfig.keySecret := keySecret;
    twilioConfig.fromNumber := fromNumber;
  };

  /// Admin: send a sample alert to both the saved email and the saved phone,
  /// reporting the outcome of each channel separately.
  public shared ({ caller }) func sendTestAlert() : async Types.TestAlertResult {
    requireOwnerNotificationsAdmin(caller);
    let emailResult = await sendAlert(
      ownerEmail.address,
      "Honey Do's test alert",
      "This is a test alert from your Honey Do's admin dashboard. If you received it, new-request email alerts are working.",
    );
    let emailChannel : Types.ChannelResult = switch (emailResult) {
      case (#ok) { #sent };
      case (#err(message)) { #failed(message) };
    };
    let smsResult = await sendSmsAlert(
      ownerPhone.number,
      "Honey Do's test alert: new-request SMS alerts are working.",
    );
    { email = emailChannel; sms = smsResult };
  };

  /// Admin: read the configured public frontend origin used to build absolute
  /// links in customer emails. An empty string means "not configured".
  public query ({ caller }) func getFrontendOrigin() : async Text {
    requireOwnerNotificationsAdmin(caller);
    frontendOrigin.origin;
  };

  /// Admin: validate and persist the public frontend origin used to build
  /// absolute links in customer emails. The value must be an absolute http(s)
  /// URL with no trailing slash; an empty string clears it and restores the
  /// backend's default origin.
  public shared ({ caller }) func setFrontendOrigin(origin : Text) : async Result.Result<Text, Types.FrontendOriginError> {
    requireOwnerNotificationsAdmin(caller);
    let trimmed = origin.trim(#char '/');
    if (trimmed.size() > 0 and not (trimmed.startsWith(#text "https://") or trimmed.startsWith(#text "http://"))) {
      return #err(#invalidOrigin("Enter an absolute URL starting with https:// or http://"));
    };
    frontendOrigin.origin := trimmed;
    #ok(trimmed);
  };
};
