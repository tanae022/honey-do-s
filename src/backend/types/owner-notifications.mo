module {
  /// Errors returned by owner alert-email operations.
  public type OwnerAlertError = {
    #invalidEmail : Text;
    #sendFailed : Text;
  };

  /// Errors returned by owner alert-phone operations.
  public type OwnerAlertPhoneError = {
    #invalidPhone : Text;
    #sendFailed : Text;
  };

  /// Outcome of a single alert channel (email or SMS).
  public type ChannelResult = {
    #sent;
    #failed : Text;
  };

  /// Outcome of a test alert, reported separately for each channel.
  public type TestAlertResult = {
    email : ChannelResult;
    sms : ChannelResult;
  };

  /// Whether the Twilio messaging credential is configured.
  public type TwilioConfigStatus = {
    configured : Bool;
    fromNumber : Text;
  };

  /// Errors returned by frontend-origin operations.
  public type FrontendOriginError = {
    #invalidOrigin : Text;
  };
};
