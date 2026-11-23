import AccessControl "mo:caffeineai-authorization/access-control";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Result "mo:core/Result";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/payments";
import JobTypes "../types/jobs";
import CustomerTypes "../types/customers";
import NotificationTypes "../types/notifications";
import PaymentsLib "../lib/payments";
import JobsLib "../lib/jobs";
import CustomersLib "../lib/customers";
import NotificationLib "../lib/notifications";

mixin (
  jobs : Map.Map<JobTypes.JobId, JobTypes.JobRequest>,
  jobRecords : Map.Map<JobTypes.JobRecordId, JobTypes.JobRecord>,
  paymentHistory : Map.Map<JobTypes.PaymentId, JobTypes.PaymentHistory>,
  settingsState : { var nextDiscountId : Nat; var nextJobRecordId : Nat; var nextPaymentId : Nat },
  paymentSettings : { var settings : JobTypes.PaymentSettings },
  adminSettings : { var settings : JobTypes.AdminSettings },
  customers : Map.Map<CustomerTypes.CustomerId, CustomerTypes.Customer>,
  customerByEmail : Map.Map<Text, CustomerTypes.CustomerId>,
  customerByPhone : Map.Map<Text, CustomerTypes.CustomerId>,
  notifications : Map.Map<NotificationTypes.NotificationId, NotificationTypes.Notification>,
  customerState : { var nextNotificationId : Nat },
  accessControlState : AccessControl.AccessControlState,
) {
  func requireAdminPayments(caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) {};
      case (_) { Runtime.trap("Unauthorized: Only admins can perform this action") };
    };
  };

  func findPaymentJobByReference(referenceCode : JobTypes.ReferenceCode) : ?JobTypes.JobRequest {
    jobs.values().find(func(job) = job.referenceCode == referenceCode);
  };

  func customerIdForPaymentJob(job : JobTypes.JobRequest) : ?CustomerTypes.CustomerId {
    CustomersLib.findExisting(
      func(key) = customerByEmail.get(key),
      func(key) = customerByPhone.get(key),
      job.email,
      job.phone,
    );
  };

  func paymentHistoryForJob(jobId : JobTypes.JobId) : ?JobTypes.PaymentHistory {
    paymentHistory.values().find(func(history) = history.jobRequestId == jobId);
  };

  func jobRecordForJob(jobId : JobTypes.JobId) : ?JobTypes.JobRecord {
    jobRecords.values().find(func(record) = record.jobRequestId == jobId);
  };

  func paymentViewOf(job : JobTypes.JobRequest) : JobTypes.JobRequestView {
    JobsLib.toView(job);
  };

  /// Create or refresh the permanent payment-history entry for a job.
  func ensurePaymentHistory(job : JobTypes.JobRequest, method : JobTypes.PaymentMethod) : () {
    let customerId = switch (customerIdForPaymentJob(job)) { case (?id) { id }; case null { 0 } };
    switch (paymentHistoryForJob(job.id)) {
      case (?history) {
        let updated = PaymentsLib.updatePaymentHistory(history, PaymentsLib.depositStatusOf(job), history.finalPayment, Time.now());
        paymentHistory.add(updated.id, updated);
      };
      case null {
        let id = settingsState.nextPaymentId;
        settingsState.nextPaymentId := id + 1;
        let history = PaymentsLib.newPaymentHistory(id, job, customerId, method, Time.now());
        paymentHistory.add(id, history);
      };
    };
  };

  /// Refresh the payment-history deposit status for a job.
  func refreshPaymentHistoryStatus(job : JobTypes.JobRequest) : () {
    switch (paymentHistoryForJob(job.id)) {
      case (?history) {
        let updated = PaymentsLib.updatePaymentHistory(history, PaymentsLib.depositStatusOf(job), history.finalPayment, Time.now());
        paymentHistory.add(updated.id, updated);
      };
      case null {};
    };
  };

  /// Keep a job record's deposit snapshot in step with the request.
  func syncJobRecordDeposit(job : JobTypes.JobRequest) : () {
    switch (jobRecordForJob(job.id)) {
      case (?record) {
        jobRecords.add(record.id, JobsLib.withDeposit(record, job.deposit));
      };
      case null {};
    };
  };

  func notifyDepositSubmitted(job : JobTypes.JobRequest, customerId : ?CustomerTypes.CustomerId) : () {
    ignore NotificationLib.raise(
      notifications,
      customerState,
      #depositSubmitted,
      "Deposit submitted for " # job.referenceCode,
      job.customerName # " submitted the deposit for " # job.referenceCode,
      ?job.id,
      customerId,
      Time.now(),
    );
  };

  func notifyDepositVerified(job : JobTypes.JobRequest, customerId : ?CustomerTypes.CustomerId) : () {
    ignore NotificationLib.raise(
      notifications,
      customerState,
      #depositVerified,
      "Deposit verified for " # job.referenceCode,
      "The deposit for " # job.referenceCode # " was verified and the appointment is booked",
      ?job.id,
      customerId,
      Time.now(),
    );
  };

  func notifyPaymentReceived(job : JobTypes.JobRequest, customerId : ?CustomerTypes.CustomerId) : () {
    ignore NotificationLib.raise(
      notifications,
      customerState,
      #paymentReceived,
      "Payment received for " # job.referenceCode,
      "A final payment was recorded for " # job.referenceCode,
      ?job.id,
      customerId,
      Time.now(),
    );
  };

  /// Whether a request is ready to become a job: its deposit is verified or its
  /// quote is approved.
  func isJobReady(job : JobTypes.JobRequest) : Bool {
    if (PaymentsLib.isDepositVerified(job)) { return true };
    switch (job.quote) {
      case (?q) { q.status == #approved };
      case null { false };
    };
  };

  /// Guest: submit a deposit for a quote with the chosen payment method. The
  /// deposit becomes submitted and awaits owner verification; it is not paid
  /// until the owner confirms it.
  public shared ({ caller }) func submitDeposit(referenceCode : JobTypes.ReferenceCode, method : JobTypes.PaymentMethod) : async Result.Result<JobTypes.JobRequestView, JobTypes.JobError> {
    ignore caller;
    switch (findPaymentJobByReference(referenceCode)) {
      case (null) { #err(#notFound) };
      case (?job) {
        switch (job.quote) {
          case (null) { return #err(#invalidState("No quote has been sent for this request")) };
          case (?_) {};
        };
        if (not PaymentsLib.submitDeposit(job, method, Time.now())) {
          return #err(#invalidState("No deposit is owed for this request"));
        };
        ensurePaymentHistory(job, method);
        notifyDepositSubmitted(job, customerIdForPaymentJob(job));
        #ok(paymentViewOf(job));
      };
    };
  };

  /// Guest: read the customer-facing payment summary for a reference code. This
  /// is the payment page: original amount, discount, final quote, 10% deposit
  /// required, remaining balance, accepted payment methods and the current
  /// deposit and appointment state.
  public query func getPaymentSummary(referenceCode : JobTypes.ReferenceCode) : async ?Types.PaymentSummaryView {
    switch (findPaymentJobByReference(referenceCode)) {
      case (?job) { ?PaymentsLib.paymentSummary(job, paymentSettings.settings) };
      case null { null };
    };
  };

  /// Admin: confirm a submitted deposit. The deposit becomes paid and verified,
  /// the request is confirmed and the calendar appointment is booked.
  public shared ({ caller }) func verifyDeposit(referenceCode : JobTypes.ReferenceCode) : async Result.Result<JobTypes.JobRequestView, JobTypes.JobError> {
    requireAdminPayments(caller);
    switch (findPaymentJobByReference(referenceCode)) {
      case (null) { #err(#notFound) };
      case (?job) {
        if (not PaymentsLib.verifyDeposit(job, Time.now())) {
          return #err(#invalidState("No deposit has been submitted for this request"));
        };
        refreshPaymentHistoryStatus(job);
        syncJobRecordDeposit(job);
        notifyDepositVerified(job, customerIdForPaymentJob(job));
        #ok(paymentViewOf(job));
      };
    };
  };

  /// Admin: mark a submitted deposit not received. The deposit returns to
  /// rejected so the customer can resubmit it.
  public shared ({ caller }) func rejectDeposit(referenceCode : JobTypes.ReferenceCode) : async Result.Result<JobTypes.JobRequestView, JobTypes.JobError> {
    requireAdminPayments(caller);
    switch (findPaymentJobByReference(referenceCode)) {
      case (null) { #err(#notFound) };
      case (?job) {
        if (not PaymentsLib.rejectDeposit(job)) {
          return #err(#invalidState("No deposit has been submitted for this request"));
        };
        refreshPaymentHistoryStatus(job);
        #ok(paymentViewOf(job));
      };
    };
  };

  /// Admin: list every permanent payment-history entry, newest first.
  public query ({ caller }) func listPaymentHistory() : async [JobTypes.PaymentHistory] {
    requireAdminPayments(caller);
    let all = paymentHistory.values().toArray();
    all.sort(func (a, b) = Int.compare(b.createdAt, a.createdAt));
  };

  /// Admin: read the payment history for a job request.
  public query ({ caller }) func getPaymentHistoryForJob(jobId : JobTypes.JobId) : async ?JobTypes.PaymentHistory {
    requireAdminPayments(caller);
    paymentHistoryForJob(jobId);
  };

  /// Admin: list every job created from a confirmed request or quote, newest
  /// first.
  public query ({ caller }) func listJobRecords() : async [JobTypes.JobRecordView] {
    requireAdminPayments(caller);
    let views = jobRecords.values().map(func(record) = JobsLib.jobRecordToView(record)).toArray();
    views.sort(func (a, b) = Int.compare(b.createdAt, a.createdAt));
  };

  /// Admin: read a single job record.
  public query ({ caller }) func getJobRecord(id : JobTypes.JobRecordId) : async ?JobTypes.JobRecordView {
    requireAdminPayments(caller);
    switch (jobRecords.get(id)) {
      case (?record) { ?JobsLib.jobRecordToView(record) };
      case null { null };
    };
  };

  /// Admin: create a job from a confirmed request or quote. The job captures the
  /// customer, service, address, scheduled date/time, quote, pricing, deposit,
  /// remaining balance and initial status. Creating a job for a request that
  /// already has one returns the existing job.
  public shared ({ caller }) func createJobRecord(jobId : JobTypes.JobId, scheduledAt : JobTypes.Timestamp) : async Result.Result<JobTypes.JobRecordView, JobTypes.JobError> {
    requireAdminPayments(caller);
    switch (jobs.get(jobId)) {
      case (null) { #err(#notFound) };
      case (?job) {
        switch (jobRecordForJob(job.id)) {
          case (?existing) { return #ok(JobsLib.jobRecordToView(existing)) };
          case null {};
        };
        if (not isJobReady(job)) {
          return #err(#invalidState("The request must be confirmed before a job can be created"));
        };
        let (customerId, serviceAddress) = switch (customerIdForPaymentJob(job)) {
          case (?id) {
            switch (customers.get(id)) {
              case (?customer) { (id, customer.serviceAddress) };
              case null { (id, "") };
            };
          };
          case null { (0, "") };
        };
        let id = settingsState.nextJobRecordId;
        settingsState.nextJobRecordId := id + 1;
        let record = JobsLib.newJobRecord(id, job, customerId, job.customerName, serviceAddress, scheduledAt, Time.now());
        jobRecords.add(id, record);
        #ok(JobsLib.jobRecordToView(record));
      };
    };
  };

  /// Admin: advance a job to its next lifecycle status.
  public shared ({ caller }) func advanceJobRecord(id : JobTypes.JobRecordId) : async Result.Result<JobTypes.JobRecordView, JobTypes.JobError> {
    requireAdminPayments(caller);
    switch (jobRecords.get(id)) {
      case (null) { #err(#notFound) };
      case (?record) {
        JobsLib.advanceJobRecordStatus(record);
        if (record.status == #completed and record.completedAt == null) {
          record.completedAt := ?Time.now();
        };
        #ok(JobsLib.jobRecordToView(record));
      };
    };
  };

  /// Admin: mark a job completed.
  public shared ({ caller }) func completeJobRecord(id : JobTypes.JobRecordId) : async Result.Result<JobTypes.JobRecordView, JobTypes.JobError> {
    requireAdminPayments(caller);
    switch (jobRecords.get(id)) {
      case (null) { #err(#notFound) };
      case (?record) {
        JobsLib.completeJobRecord(record, Time.now());
        #ok(JobsLib.jobRecordToView(record));
      };
    };
  };

  /// Admin: cancel a job. Cancellation is terminal.
  public shared ({ caller }) func cancelJobRecord(id : JobTypes.JobRecordId) : async Result.Result<JobTypes.JobRecordView, JobTypes.JobError> {
    requireAdminPayments(caller);
    switch (jobRecords.get(id)) {
      case (null) { #err(#notFound) };
      case (?record) {
        if (not JobsLib.cancelJobRecord(record)) {
          return #err(#invalidState("Only an active job can be cancelled"));
        };
        #ok(JobsLib.jobRecordToView(record));
      };
    };
  };

  /// Admin: record the final payment for a job and update its permanent payment
  /// history. The total paid becomes the verified deposit plus the final
  /// payment.
  public shared ({ caller }) func recordFinalPayment(jobId : JobTypes.JobId, amount : Nat, method : JobTypes.PaymentMethod) : async Result.Result<JobTypes.PaymentHistory, JobTypes.JobError> {
    requireAdminPayments(caller);
    switch (jobs.get(jobId)) {
      case (null) { #err(#notFound) };
      case (?job) {
        let customerId = switch (customerIdForPaymentJob(job)) { case (?id) { id }; case null { 0 } };
        let base = switch (paymentHistoryForJob(job.id)) {
          case (?history) { history };
          case null {
            let id = settingsState.nextPaymentId;
            settingsState.nextPaymentId := id + 1;
            PaymentsLib.newPaymentHistory(id, job, customerId, method, Time.now());
          };
        };
        let updated = PaymentsLib.updatePaymentHistory(base, PaymentsLib.depositStatusOf(job), amount, Time.now());
        paymentHistory.add(updated.id, updated);
        notifyPaymentReceived(job, customerIdForPaymentJob(job));
        #ok(updated);
      };
    };
  };

  /// Admin: raise an appointment-reminder notification for a scheduled job.
  /// Respects the appointment-reminders setting.
  public shared ({ caller }) func sendAppointmentReminder(jobId : JobTypes.JobId) : async Result.Result<JobTypes.JobRequestView, JobTypes.JobError> {
    requireAdminPayments(caller);
    if (not adminSettings.settings.appointmentReminders) {
      return #err(#invalidState("Appointment reminders are turned off in settings"));
    };
    switch (jobs.get(jobId)) {
      case (null) { #err(#notFound) };
      case (?job) {
        switch (job.appointment) {
          case (null) { return #err(#invalidState("No appointment has been scheduled for this request")) };
          case (?_) {};
        };
        ignore NotificationLib.raise(
          notifications,
          customerState,
          #appointmentReminder,
          "Appointment reminder for " # job.referenceCode,
          "Reminder: the appointment for " # job.referenceCode # " is coming up",
          ?job.id,
          customerIdForPaymentJob(job),
          Time.now(),
        );
        #ok(paymentViewOf(job));
      };
    };
  };
};
