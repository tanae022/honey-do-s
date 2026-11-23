import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Types "../types/pricing";

module {
  public type DiscountRule = Types.DiscountRule;
  public type DiscountRuleInput = Types.DiscountRuleInput;
  public type DiscountKind = Types.DiscountKind;
  public type DiscountEligibility = Types.DiscountEligibility;
  public type DiscountApplication = Types.DiscountApplication;
  public type QuotePricing = Types.QuotePricing;
  public type DiscountContext = Types.DiscountContext;
  public type DiscountId = Types.DiscountId;
  public type Timestamp = Types.Timestamp;
  public type TaxSetting = Types.TaxSetting;
  public type DepositSetting = Types.DepositSetting;
  public type QuoteValidationError = Types.QuoteValidationError;

  /// The default deposit percentage when no deposit setting is configured.
  public let defaultDepositPercent : Nat = 10;

  /// Create a new discount rule from admin input.
  public func newRule(id : DiscountId, input : DiscountRuleInput, now : Timestamp) : DiscountRule {
    {
      id;
      name = input.name;
      kind = input.kind;
      value = input.value;
      active = input.active;
      startAt = input.startAt;
      endAt = input.endAt;
      eligibility = input.eligibility;
      minPurchase = input.minPurchase;
      maxDiscount = input.maxDiscount;
      createdAt = now;
    };
  };

  /// Rebuild a discount rule from edited input, preserving its id and creation
  /// date.
  public func updateRule(rule : DiscountRule, input : DiscountRuleInput) : DiscountRule {
    {
      id = rule.id;
      name = input.name;
      kind = input.kind;
      value = input.value;
      active = input.active;
      startAt = input.startAt;
      endAt = input.endAt;
      eligibility = input.eligibility;
      minPurchase = input.minPurchase;
      maxDiscount = input.maxDiscount;
      createdAt = rule.createdAt;
    };
  };

  /// Turn a discount rule on or off without changing its other fields.
  public func setActive(rule : DiscountRule, active : Bool) : DiscountRule {
    {
      id = rule.id;
      name = rule.name;
      kind = rule.kind;
      value = rule.value;
      active;
      startAt = rule.startAt;
      endAt = rule.endAt;
      eligibility = rule.eligibility;
      minPurchase = rule.minPurchase;
      maxDiscount = rule.maxDiscount;
      createdAt = rule.createdAt;
    };
  };

  /// Whether a rule's validity window covers `now`. A null bound is open-ended.
  func withinWindow(rule : DiscountRule, now : Timestamp) : Bool {
    let afterStart = switch (rule.startAt) {
      case (?start) { now >= start };
      case null { true };
    };
    let beforeEnd = switch (rule.endAt) {
      case (?end) { now <= end };
      case null { true };
    };
    afterStart and beforeEnd;
  };

  /// Whether a rule's eligibility matches the quote context.
  func eligible(rule : DiscountRule, context : DiscountContext) : Bool {
    switch (rule.eligibility) {
      case (#all) { true };
      case (#ownParts) { context.ownParts };
      case (#returningCustomer) { context.returningCustomer };
    };
  };

  /// The raw discount amount a rule would subtract from a subtotal, before the
  /// maximum-discount cap. A percentage rule rounds down to whole cents; a
  /// fixed rule subtracts its fixed amount.
  func rawDiscount(rule : DiscountRule, subtotal : Nat) : Nat {
    switch (rule.kind) {
      case (#percentage) { subtotal * rule.value / 100 };
      case (#fixed) { rule.value };
    };
  };

  /// The discount amount a rule produces for a subtotal, capped by the rule's
  /// maximum discount (when set) and never larger than the subtotal itself.
  func cappedDiscount(rule : DiscountRule, subtotal : Nat) : Nat {
    let raw = rawDiscount(rule, subtotal);
    let capped = if (rule.maxDiscount > 0 and raw > rule.maxDiscount) { rule.maxDiscount } else { raw };
    if (capped > subtotal) { subtotal } else { capped };
  };

  /// Select the single best discount rule for a quote and explain the decision.
  ///
  /// The rules are evaluated in order and the first eligible, active, in-window
  /// rule that produces a positive discount wins. When no rule applies, the
  /// returned application carries the specific reason: an inactive rule, an
  /// expired rule, an ineligible rule, a subtotal below the minimum purchase,
  /// or no rule at all. A rule whose discount is capped by its maximum is
  /// reported as applied with the capped amount.
  public func selectDiscount(
    rules : [DiscountRule],
    context : DiscountContext,
    now : Timestamp,
  ) : DiscountApplication {
    var sawInactive = false;
    var sawExpired = false;
    var sawIneligible = false;
    var sawBelowMinimum = false;
    for (rule in rules.values()) {
      if (not rule.active) {
        sawInactive := true;
      } else if (not withinWindow(rule, now)) {
        sawExpired := true;
      } else if (not eligible(rule, context)) {
        sawIneligible := true;
      } else if (rule.minPurchase > 0 and context.subtotal < rule.minPurchase) {
        sawBelowMinimum := true;
      } else {
        let amount = cappedDiscount(rule, context.subtotal);
        if (amount > 0) {
          let capped = rule.maxDiscount > 0 and rawDiscount(rule, context.subtotal) > rule.maxDiscount;
          let reason = if (capped) {
            "Applied " # rule.name # " (capped at the maximum discount)";
          } else {
            "Applied " # rule.name;
          };
          return { applied = true; ruleId = ?rule.id; ruleName = rule.name; reason };
        };
      };
    };
    if (sawInactive) {
      return { applied = false; ruleId = null; ruleName = ""; reason = "No discount applied: the matching rule is inactive" };
    };
    if (sawExpired) {
      return { applied = false; ruleId = null; ruleName = ""; reason = "No discount applied: the matching rule is expired or not yet active" };
    };
    if (sawIneligible) {
      return { applied = false; ruleId = null; ruleName = ""; reason = "No discount applied: no rule is eligible for this customer" };
    };
    if (sawBelowMinimum) {
      return { applied = false; ruleId = null; ruleName = ""; reason = "No discount applied: the subtotal is below the minimum purchase" };
    };
    { applied = false; ruleId = null; ruleName = ""; reason = "No discount applied: no discount rule is configured" };
  };

  /// Compute the full pricing breakdown for a quote.
  ///
  /// `originalSubtotal` is the sum of line items plus labor and materials;
  /// `discountAmount` is the selected discount; `adjustedSubtotal` is the
  /// subtotal after the discount; `taxAmount` is the configured tax on the
  /// adjusted subtotal; `finalTotal` is the amount owed; `depositAmount` is the
  /// configured deposit percentage of `finalTotal` (exactly 10% by default);
  /// `remainingBalance` is `finalTotal - depositAmount`. No amount is ever
  /// negative and the discount never exceeds the subtotal.
  public func computePricing(
    originalSubtotal : Nat,
    rules : [DiscountRule],
    context : DiscountContext,
    tax : TaxSetting,
    deposit : DepositSetting,
    now : Timestamp,
  ) : QuotePricing {
    let discount = selectDiscount(rules, context, now);
    let discountAmount = if (discount.applied) {
      switch (discount.ruleId) {
        case (?id) {
          switch (rules.find(func(rule) = rule.id == id)) {
            case (?rule) { cappedDiscount(rule, originalSubtotal) };
            case null { 0 };
          };
        };
        case null { 0 };
      };
    } else { 0 };
    let adjustedSubtotal = if (discountAmount >= originalSubtotal) { 0 } else { originalSubtotal - discountAmount };
    let taxAmount = if (tax.enabled) { adjustedSubtotal * tax.ratePercent / 100 } else { 0 };
    let finalTotal = adjustedSubtotal + taxAmount;
    let depositPercent = if (deposit.percent == 0) { defaultDepositPercent } else { deposit.percent };
    let depositAmount = finalTotal * depositPercent / 100;
    let remainingBalance = if (depositAmount >= finalTotal) { 0 } else { finalTotal - depositAmount };
    {
      originalSubtotal;
      discountAmount;
      adjustedSubtotal;
      taxAmount;
      finalTotal;
      depositAmount;
      remainingBalance;
      discount;
    };
  };

  /// Validate a quote before it is finalized. Returns the first blocking
  /// problem, or null when the quote is valid. Checks required customer and
  /// service information, that pricing is present and non-negative, that the
  /// deposit is a correct percentage of the final total, and that the requested
  /// date/time is set for a booking.
  public func validateQuote(
    customerName : Text,
    customerEmail : Text,
    serviceDescription : Text,
    pricing : QuotePricing,
    requestedAt : ?Timestamp,
    requireBooking : Bool,
  ) : ?QuoteValidationError {
    if (customerName.trim(#text " ").size() == 0) {
      return ?#missingCustomerInfo("A customer name is required");
    };
    if (customerEmail.trim(#text " ").size() == 0) {
      return ?#missingCustomerInfo("A customer email is required");
    };
    if (serviceDescription.trim(#text " ").size() == 0) {
      return ?#missingServiceInfo("A service description is required");
    };
    if (pricing.originalSubtotal == 0) {
      return ?#missingPricing("The quote has no priced line items");
    };
    if (pricing.discountAmount > pricing.originalSubtotal) {
      return ?#invalidDiscount("The discount cannot exceed the subtotal");
    };
    if (pricing.finalTotal == 0) {
      return ?#negativeTotal("The final total must be greater than zero");
    };
    if (pricing.depositAmount > pricing.finalTotal) {
      return ?#invalidDeposit("The deposit cannot exceed the final total");
    };
    if (pricing.depositAmount + pricing.remainingBalance != pricing.finalTotal) {
      return ?#invalidDeposit("The deposit and remaining balance must add up to the final total");
    };
    if (requireBooking) {
      switch (requestedAt) {
        case (null) { return ?#incompleteBooking("A requested date and time is required to book this job") };
        case (?_) {};
      };
    };
    null;
  };

  /// List discount rules newest first.
  public func list(rules : [DiscountRule]) : [DiscountRule] {
    rules.sort(func (a, b) = Nat.compare(b.id, a.id));
  };

  /// The default tax setting: tax disabled at zero percent.
  public func defaultTaxSetting() : TaxSetting {
    { enabled = false; ratePercent = 0 };
  };

  /// The default deposit setting: exactly 10%.
  public func defaultDepositSetting() : DepositSetting {
    { percent = defaultDepositPercent };
  };

  /// The current time in nanoseconds, exposed so callers share one clock source.
  public func now() : Timestamp {
    Time.now();
  };
};
