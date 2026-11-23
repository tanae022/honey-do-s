import Types "../types/payments";
import JobsLib "jobs";

module {
  public type JobRequest = Types.JobRequest;
  public type Deposit = Types.Deposit;
  public type DepositStatus = Types.DepositStatus;
  public type PaymentMethod = Types.PaymentMethod;
  public type PaymentHistory = Types.PaymentHistory;
  public type PaymentSettings = Types.PaymentSettings;
  public type PaymentSummaryView = Types.PaymentSummaryView;
  public type Timestamp = Types.Timestamp;
  public type PaymentId = Types.PaymentId;
  public type CustomerId = Types.CustomerId;

  /// The deposit owed on a job request: exactly the configured percentage of
  /// the final approved quote total after discounts and adjustments (10% by
  /// default). Delegates to the job domain so the runtime and migrated records
  /// agree.
  public func depositAmount(job : JobRequest) : Nat {
    JobsLib.depositAmount(job);
  };

  /// The current deposit status of a job, defaulting to `#pending` when no
  /// deposit has been recorded.
  public func depositStatusOf(job : JobRequest) : DepositStatus {
    switch (job.deposit) {
      case (?d) { d.status };
      case null { #pending };
    };
  };

  /// Whether a deposit has been submitted and is awaiting admin verification.
  public func isAwaitingVerification(job : JobRequest) : Bool {
    depositStatusOf(job) == #submitted;
  };

  /// Whether the deposit has been verified (paid).
  public func isDepositVerified(job : JobRequest) : Bool {
    depositStatusOf(job) == #verified;
  };

  /// Whether the appointment is a confirmed calendar booking. A requested date
  /// and time is never a confirmed booking until the required deposit has been
  /// submitted and verified.
  public func isAppointmentBooked(job : JobRequest) : Bool {
    switch (job.appointment) {
      case (?a) { a.confirmed and isDepositVerified(job) };
      case null { false };
    };
  };

  /// Customer submits a deposit for a quote with the chosen payment method. The
  /// deposit becomes `#submitted` and awaits admin verification; it is not paid
  /// until the owner confirms it. Returns false when no deposit is owed.
  public func submitDeposit(job : JobRequest, method : PaymentMethod, now : Timestamp) : Bool {
    let amount = depositAmount(job);
    if (amount == 0) { return false };
    job.deposit := ?{
      amount;
      paid = false;
      method;
      paidAt = null;
      stripeSessionId = null;
      status = #submitted;
      submittedAt = ?now;
      verifiedAt = null;
    };
    true;
  };

  /// Owner confirms the deposit: the deposit becomes paid and verified, the
  /// request is confirmed (moved to `#scheduled`) and the calendar appointment
  /// is booked. Returns false when no deposit has been submitted.
  public func verifyDeposit(job : JobRequest, now : Timestamp) : Bool {
    switch (job.deposit) {
      case (?d) {
        job.deposit := ?{
          amount = d.amount;
          paid = true;
          method = d.method;
          paidAt = ?now;
          stripeSessionId = d.stripeSessionId;
          status = #verified;
          submittedAt = switch (d.submittedAt) { case (?s) { ?s }; case null { ?now } };
          verifiedAt = ?now;
        };
        switch (job.appointment) {
          case (?a) { job.appointment := ?{ scheduledAt = a.scheduledAt; confirmed = true } };
          case null {};
        };
        job.status := #scheduled;
        true;
      };
      case null { false };
    };
  };

  /// Owner marks the deposit not received: the deposit returns to `#rejected`
  /// and is no longer paid, so the customer can resubmit it. Returns false when
  /// no deposit has been submitted.
  public func rejectDeposit(job : JobRequest) : Bool {
    switch (job.deposit) {
      case (?d) {
        job.deposit := ?{
          amount = d.amount;
          paid = false;
          method = d.method;
          paidAt = null;
          stripeSessionId = d.stripeSessionId;
          status = #rejected;
          submittedAt = d.submittedAt;
          verifiedAt = null;
        };
        true;
      };
      case null { false };
    };
  };

  /// The original subtotal, discount, final total and remaining balance of a
  /// job's quote, preferring the automatic pricing breakdown and falling back
  /// to the legacy quote fields.
  func quoteBreakdown(job : JobRequest) : (Nat, Nat, Nat, Nat) {
    switch (job.quote) {
      case (?q) {
        switch (q.pricing) {
          case (?p) { (p.originalSubtotal, p.discountAmount, p.finalTotal, p.remainingBalance) };
          case null { (q.subtotal, q.discountAmount, q.total, q.remainingBalance) };
        };
      };
      case null { (0, 0, 0, 0) };
    };
  };

  /// The reason the discount was or was not applied, from the pricing
  /// breakdown. Empty for a legacy quote without pricing.
  func discountReasonOf(job : JobRequest) : Text {
    switch (job.quote) {
      case (?q) {
        switch (q.pricing) {
          case (?p) { p.discount.reason };
          case null { "" };
        };
      };
      case null { "" };
    };
  };

  /// The tax amount from the pricing breakdown, or zero for a legacy quote.
  func taxAmountOf(job : JobRequest) : Nat {
    switch (job.quote) {
      case (?q) {
        switch (q.pricing) {
          case (?p) { p.taxAmount };
          case null { 0 };
        };
      };
      case null { 0 };
    };
  };

  /// Build a permanent payment-history entry for a job from its quote, deposit
  /// and chosen payment method. `totalPaid` counts the deposit only once it is
  /// verified.
  public func newPaymentHistory(
    id : PaymentId,
    job : JobRequest,
    customerId : CustomerId,
    method : PaymentMethod,
    now : Timestamp,
  ) : PaymentHistory {
    let (originalQuote, discountAmount, finalQuote, remainingBalance) = quoteBreakdown(job);
    let deposit = depositAmount(job);
    let status = depositStatusOf(job);
    let totalPaid = if (status == #verified) { deposit } else { 0 };
    {
      id;
      jobRequestId = job.id;
      referenceCode = job.referenceCode;
      customerId;
      originalQuote;
      discountAmount;
      finalQuote;
      depositAmount = deposit;
      paymentMethod = method;
      depositStatus = status;
      remainingBalance;
      finalPayment = 0;
      totalPaid;
      createdAt = now;
      updatedAt = now;
    };
  };

  /// Update a payment-history entry's deposit status and final payment. The
  /// total paid is the verified deposit plus the final payment; the original
  /// quote, discount, final quote and remaining balance are preserved.
  public func updatePaymentHistory(
    history : PaymentHistory,
    depositStatus : DepositStatus,
    finalPayment : Nat,
    now : Timestamp,
  ) : PaymentHistory {
    let paidDeposit = if (depositStatus == #verified) { history.depositAmount } else { 0 };
    {
      id = history.id;
      jobRequestId = history.jobRequestId;
      referenceCode = history.referenceCode;
      customerId = history.customerId;
      originalQuote = history.originalQuote;
      discountAmount = history.discountAmount;
      finalQuote = history.finalQuote;
      depositAmount = history.depositAmount;
      paymentMethod = history.paymentMethod;
      depositStatus;
      remainingBalance = history.remainingBalance;
      finalPayment;
      totalPaid = paidDeposit + finalPayment;
      createdAt = history.createdAt;
      updatedAt = now;
    };
  };

  /// Build the customer-facing payment summary: the original amount, discount,
  /// final quote, 10% deposit required, remaining balance, accepted payment
  /// methods with the owner's handles, and the current deposit and appointment
  /// state.
  public func paymentSummary(job : JobRequest, settings : PaymentSettings) : PaymentSummaryView {
    let (originalSubtotal, discountAmount, finalTotal, remainingBalance) = quoteBreakdown(job);
    let adjustedSubtotal = if (discountAmount >= originalSubtotal) { 0 } else { originalSubtotal - discountAmount };
    let (depositStatus, depositMethod) = switch (job.deposit) {
      case (?d) { (d.status, ?d.method) };
      case null { (#pending : DepositStatus, null) };
    };
    let (appointmentAt, appointmentConfirmed) = switch (job.appointment) {
      case (?a) { (?a.scheduledAt, a.confirmed) };
      case null { (null, false) };
    };
    {
      referenceCode = job.referenceCode;
      customerName = job.customerName;
      serviceDescription = job.description;
      originalSubtotal;
      discountAmount;
      discountReason = discountReasonOf(job);
      adjustedSubtotal;
      taxAmount = taxAmountOf(job);
      finalTotal;
      depositAmount = depositAmount(job);
      remainingBalance;
      depositStatus;
      depositMethod;
      acceptedMethods = settings.acceptedMethods;
      payPalHandle = settings.payPalHandle;
      cashAppHandle = settings.cashAppHandle;
      venmoHandle = settings.venmoHandle;
      chimeHandle = settings.chimeHandle;
      appointmentAt;
      appointmentConfirmed;
    };
  };
};
