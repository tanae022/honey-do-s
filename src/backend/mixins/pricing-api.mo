import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Result "mo:core/Result";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/pricing";
import PricingLib "../lib/pricing";

mixin (
  discounts : Map.Map<Types.DiscountId, Types.DiscountRule>,
  settingsState : { var nextDiscountId : Nat; var nextJobRecordId : Nat; var nextPaymentId : Nat },
  taxSetting : { var setting : Types.TaxSetting },
  depositSetting : { var setting : Types.DepositSetting },
  paymentSettings : { var settings : Types.PaymentSettings },
  quoteSetting : { var setting : Types.QuoteSettings },
  businessSetting : { var setting : Types.BusinessSettings },
  adminSettings : { var settings : Types.AdminSettings },
  accessControlState : AccessControl.AccessControlState,
) {
  func requireAdminPricing(caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) {};
      case (_) { Runtime.trap("Unauthorized: Only admins can perform this action") };
    };
  };

  /// Validate a discount rule input, returning a human-readable message when it
  /// is invalid. A percentage must be 1..100; a fixed amount must be positive;
  /// a validity window must not end before it starts.
  func validateDiscountInput(input : Types.DiscountRuleInput) : ?Text {
    if (input.name.trim(#text " ").size() == 0) {
      return ?"A discount name is required";
    };
    switch (input.kind) {
      case (#percentage) {
        if (input.value == 0 or input.value > 100) {
          return ?"A percentage discount must be between 1 and 100";
        };
      };
      case (#fixed) {
        if (input.value == 0) {
          return ?"A fixed discount must be greater than zero";
        };
      };
    };
    switch (input.startAt, input.endAt) {
      case (?start, ?end) {
        if (end < start) {
          return ?"The discount end date cannot be before its start date";
        };
      };
      case (_, _) {};
    };
    null;
  };

  /// Admin: list every saved discount rule, newest first.
  public query ({ caller }) func listDiscounts() : async [Types.DiscountRule] {
    requireAdminPricing(caller);
    PricingLib.list(discounts.values().toArray());
  };

  /// Admin: create a new discount rule. The rule is stored inactive-safe: an
  /// invalid window (end before start) or a zero-value percentage is rejected.
  public shared ({ caller }) func createDiscount(input : Types.DiscountRuleInput) : async Result.Result<Types.DiscountRule, Types.SettingsError> {
    requireAdminPricing(caller);
    switch (validateDiscountInput(input)) {
      case (?message) { return #err(#invalidInput(message)) };
      case null {};
    };
    let id = settingsState.nextDiscountId;
    settingsState.nextDiscountId := id + 1;
    let rule = PricingLib.newRule(id, input, Time.now());
    discounts.add(id, rule);
    #ok(rule);
  };

  /// Admin: update an existing discount rule.
  public shared ({ caller }) func updateDiscount(id : Types.DiscountId, input : Types.DiscountRuleInput) : async Result.Result<Types.DiscountRule, Types.SettingsError> {
    requireAdminPricing(caller);
    switch (validateDiscountInput(input)) {
      case (?message) { return #err(#invalidInput(message)) };
      case null {};
    };
    switch (discounts.get(id)) {
      case (?rule) {
        let updated = PricingLib.updateRule(rule, input);
        discounts.add(id, updated);
        #ok(updated);
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: turn a discount rule on or off.
  public shared ({ caller }) func setDiscountActive(id : Types.DiscountId, active : Bool) : async Result.Result<Types.DiscountRule, Types.SettingsError> {
    requireAdminPricing(caller);
    switch (discounts.get(id)) {
      case (?rule) {
        let updated = PricingLib.setActive(rule, active);
        discounts.add(id, updated);
        #ok(updated);
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: delete a discount rule.
  public shared ({ caller }) func deleteDiscount(id : Types.DiscountId) : async Result.Result<(), Types.SettingsError> {
    requireAdminPricing(caller);
    switch (discounts.get(id)) {
      case (?_) {
        discounts.remove(id);
        #ok(());
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: read the complete settings bundle.
  public query ({ caller }) func getSettings() : async Types.SettingsBundle {
    requireAdminPricing(caller);
    {
      tax = taxSetting.setting;
      deposit = depositSetting.setting;
      payment = paymentSettings.settings;
      quote = quoteSetting.setting;
      business = businessSetting.setting;
      admin = adminSettings.settings;
    };
  };

  /// Admin: update the tax setting.
  public shared ({ caller }) func setTaxSetting(setting : Types.TaxSetting) : async Result.Result<Types.TaxSetting, Types.SettingsError> {
    requireAdminPricing(caller);
    if (setting.ratePercent > 100) {
      return #err(#invalidInput("The tax rate cannot exceed 100 percent"));
    };
    taxSetting.setting := setting;
    #ok(setting);
  };

  /// Admin: update the deposit setting. The deposit percentage must be between
  /// 1 and 100.
  public shared ({ caller }) func setDepositSetting(setting : Types.DepositSetting) : async Result.Result<Types.DepositSetting, Types.SettingsError> {
    requireAdminPricing(caller);
    if (setting.percent == 0 or setting.percent > 100) {
      return #err(#invalidInput("The deposit percentage must be between 1 and 100"));
    };
    depositSetting.setting := setting;
    #ok(setting);
  };

  /// Admin: update the accepted payment methods and the owner's payment handles.
  public shared ({ caller }) func setPaymentSettings(settings : Types.PaymentSettings) : async Result.Result<Types.PaymentSettings, Types.SettingsError> {
    requireAdminPricing(caller);
    paymentSettings.settings := settings;
    #ok(settings);
  };

  /// Admin: update the quote defaults.
  public shared ({ caller }) func setQuoteSettings(setting : Types.QuoteSettings) : async Result.Result<Types.QuoteSettings, Types.SettingsError> {
    requireAdminPricing(caller);
    quoteSetting.setting := setting;
    #ok(setting);
  };

  /// Admin: update the business identity.
  public shared ({ caller }) func setBusinessSettings(setting : Types.BusinessSettings) : async Result.Result<Types.BusinessSettings, Types.SettingsError> {
    requireAdminPricing(caller);
    businessSetting.setting := setting;
    #ok(setting);
  };

  /// Admin: update the notification and workflow toggles.
  public shared ({ caller }) func setAdminSettings(settings : Types.AdminSettings) : async Result.Result<Types.AdminSettings, Types.SettingsError> {
    requireAdminPricing(caller);
    adminSettings.settings := settings;
    #ok(settings);
  };
};
