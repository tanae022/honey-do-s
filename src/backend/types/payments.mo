import Common "common";
import Jobs "jobs";

module {
  public type Timestamp = Common.Timestamp;
  public type ReferenceCode = Common.ReferenceCode;
  public type JobId = Common.JobId;
  public type CustomerId = Common.CustomerId;
  public type JobRecordId = Common.JobRecordId;
  public type PaymentId = Common.PaymentId;

  /// Payment method used for a deposit or final payment.
  public type PaymentMethod = Jobs.PaymentMethod;
  /// Lifecycle of a deposit payment.
  public type DepositStatus = Jobs.DepositStatus;
  /// A deposit recorded against an accepted quote.
  public type Deposit = Jobs.Deposit;
  /// A permanent payment-history entry.
  public type PaymentHistory = Jobs.PaymentHistory;
  /// The payment methods the owner accepts, plus the owner's payment handles.
  public type PaymentSettings = Jobs.PaymentSettings;
  /// Admin notification and workflow toggles.
  public type AdminSettings = Jobs.AdminSettings;
  /// A job created from a confirmed request or quote.
  public type JobRecord = Jobs.JobRecord;
  /// Shared (immutable) view of a job record.
  public type JobRecordView = Jobs.JobRecordView;
  /// Lifecycle status of a job created from a confirmed request or quote.
  public type JobRecordStatus = Jobs.JobRecordStatus;
  /// A quote sent by the admin for a job request.
  public type Quote = Jobs.Quote;
  /// The full pricing breakdown of a quote.
  public type QuotePricing = Jobs.QuotePricing;
  /// A job request submitted by a guest.
  public type JobRequest = Jobs.JobRequest;
  /// Shared (immutable) view of a job request.
  public type JobRequestView = Jobs.JobRequestView;
  /// Errors returned by guest-facing job operations.
  public type JobError = Jobs.JobError;

  /// The customer-facing payment summary shown on the payment page. It carries
  /// the original amount, the discount, the final quote, the 10% deposit
  /// required, the remaining balance, the accepted payment methods with the
  /// owner's handles, and the current deposit and appointment state.
  public type PaymentSummaryView = {
    referenceCode : ReferenceCode;
    customerName : Text;
    serviceDescription : Text;
    originalSubtotal : Nat;
    discountAmount : Nat;
    discountReason : Text;
    adjustedSubtotal : Nat;
    taxAmount : Nat;
    finalTotal : Nat;
    depositAmount : Nat;
    remainingBalance : Nat;
    depositStatus : DepositStatus;
    depositMethod : ?PaymentMethod;
    acceptedMethods : [PaymentMethod];
    payPalHandle : Text;
    cashAppHandle : Text;
    venmoHandle : Text;
    chimeHandle : Text;
    appointmentAt : ?Timestamp;
    appointmentConfirmed : Bool;
  };

  /// Errors returned by payment and job operations.
  public type PaymentError = {
    #notFound;
    #invalidState : Text;
    #notAuthorized;
  };
};
