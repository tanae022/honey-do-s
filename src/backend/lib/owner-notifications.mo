import Char "mo:core/Char";
import Text "mo:core/Text";
import Types "../types/owner-notifications";

module {
  public type OwnerAlertError = Types.OwnerAlertError;
  public type OwnerAlertPhoneError = Types.OwnerAlertPhoneError;
  public type ChannelResult = Types.ChannelResult;
  public type TestAlertResult = Types.TestAlertResult;
  public type TwilioConfigStatus = Types.TwilioConfigStatus;

  /// Whether a text is a plausible email address: a non-empty local part, a
  /// single `@`, and a dotted domain with no whitespace.
  public func isValidEmail(address : Text) : Bool {
    let trimmed = normalizeEmail(address);
    if (trimmed.size() == 0) { return false };
    if (trimmed.contains(#predicate(Char.isWhitespace))) { return false };
    let parts = trimmed.split(#text "@").toArray();
    if (parts.size() != 2) { return false };
    let local = parts[0];
    let domain = parts[1];
    if (local.size() == 0 or domain.size() == 0) { return false };
    // The domain must contain a dot with non-empty labels on both sides.
    let labels = domain.split(#text ".").toArray();
    if (labels.size() < 2) { return false };
    labels.all(func(part) = part.size() > 0);
  };

  /// Normalize a submitted address for storage (trim surrounding whitespace).
  public func normalizeEmail(address : Text) : Text {
    address.trim(#predicate(Char.isWhitespace));
  };

  /// Whether a text is a plausible E.164 phone number: a leading `+`, a
  /// non-zero country code, and 8 to 15 digits total with no separators.
  public func isValidPhone(number : Text) : Bool {
    let normalized = normalizePhone(number);
    if (normalized.size() < 8 or normalized.size() > 16) { return false };
    let chars = normalized.chars().toArray();
    if (chars.size() == 0 or chars[0] != '+') { return false };
    // The first digit after `+` is the country code and must not be zero.
    if (chars.size() < 2 or chars[1] == '0') { return false };
    var digits = 0;
    for (c in chars.values()) {
      if (c == '+') {
        // Only the leading `+` is allowed.
        if (digits != 0) { return false };
      } else if (c >= '0' and c <= '9') {
        digits += 1;
      } else {
        return false;
      };
    };
    digits >= 8 and digits <= 15;
  };

  /// Normalize a submitted phone number to E.164 (`+` followed by digits),
  /// stripping spaces, dashes, parentheses and dots.
  public func normalizePhone(number : Text) : Text {
    Text.fromIter(
      number.chars().filter(
        func(c) {
          c == '+' or (c >= '0' and c <= '9');
        }
      )
    );
  };
};
