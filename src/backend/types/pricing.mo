import Common "common";
import Jobs "jobs";

module {
  public type Timestamp = Common.Timestamp;
  public type DiscountId = Common.DiscountId;
  public type CustomerId = Common.CustomerId;

  /// A saved, admin-managed discount rule.
  public type DiscountRule = Jobs.DiscountRule;
  /// Input payload for creating or editing a discount rule.
  public type DiscountRuleInput = Jobs.DiscountRuleInput;
  /// Whether a discount rule reduces a quote by a percentage or a fixed amount.
  public type DiscountKind = Jobs.DiscountKind;
  /// Who a discount rule is eligible for.
  public type DiscountEligibility = Jobs.DiscountEligibility;
  /// Why a discount was or was not applied to a quote.
  public type DiscountApplication = Jobs.DiscountApplication;
  /// The full pricing breakdown of a quote.
  public type QuotePricing = Jobs.QuotePricing;
  /// A tax setting: whether tax is charged and at what whole-percent rate.
  public type TaxSetting = Jobs.TaxSetting;
  /// A deposit setting: the deposit percentage of the final quote total.
  public type DepositSetting = Jobs.DepositSetting;
  /// The payment methods the owner accepts, plus the owner's payment handles.
  public type PaymentSettings = Jobs.PaymentSettings;
  /// Quote defaults: how long a quote stays valid and the default terms text.
  public type QuoteSettings = Jobs.QuoteSettings;
  /// Business identity shown on quotes and emails.
  public type BusinessSettings = Jobs.BusinessSettings;
  /// Admin notification and workflow toggles.
  public type AdminSettings = Jobs.AdminSettings;
  /// Errors returned by discount and settings operations.
  public type SettingsError = Jobs.SettingsError;

  /// The context a discount rule is evaluated against: the quote subtotal
  /// before any discount, whether the customer supplies their own parts, and
  /// whether the customer is returning.
  public type DiscountContext = {
    subtotal : Nat;
    ownParts : Bool;
    returningCustomer : Bool;
  };

  /// The complete admin-facing settings bundle returned by `getSettings`.
  public type SettingsBundle = {
    tax : TaxSetting;
    deposit : DepositSetting;
    payment : PaymentSettings;
    quote : QuoteSettings;
    business : BusinessSettings;
    admin : AdminSettings;
  };

  /// A validation failure for a quote that is about to be finalized. Each tag
  /// names the specific missing or invalid piece so the admin sees a clear,
  /// actionable message rather than a generic rejection.
  public type QuoteValidationError = {
    #missingCustomerInfo : Text;
    #missingServiceInfo : Text;
    #missingPricing : Text;
    #invalidDiscount : Text;
    #negativeTotal : Text;
    #invalidDeposit : Text;
    #expiredDiscount : Text;
    #incompleteBooking : Text;
  };
};
