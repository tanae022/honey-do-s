import Char "mo:core/Char";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Types "../types/customers";
import JobTypes "../types/jobs";
import JobsLib "jobs";

module {
  public type Customer = Types.Customer;
  public type CustomerView = Types.CustomerView;
  public type CustomerSummary = Types.CustomerSummary;
  public type CustomerProfileView = Types.CustomerProfileView;
  public type CustomerInput = Types.CustomerInput;
  public type CustomerNote = Types.CustomerNote;
  public type MessageView = Types.MessageView;
  public type CustomerStatus = Types.CustomerStatus;
  public type PreferredContact = Types.PreferredContact;
  public type CustomerId = Types.CustomerId;
  public type Timestamp = Types.Timestamp;

  /// Normalize an email for returning-customer matching: trim and lowercase.
  public func normalizeEmail(email : Text) : Text {
    email.trim(#text " ").toLower();
  };

  /// Normalize a phone number for returning-customer matching: keep digits only.
  public func normalizePhone(phone : Text) : Text {
    let digits = phone.toArray().filter(func(c) = c.isDigit());
    Text.fromIter(digits.values());
  };

  /// Create a new customer record from admin/guest input.
  public func newCustomer(id : CustomerId, input : CustomerInput, now : Timestamp) : Customer {
    {
      id;
      fullName = input.fullName;
      phone = input.phone;
      email = input.email;
      serviceAddress = input.serviceAddress;
      preferredContact = input.preferredContact;
      createdAt = now;
      var status = #active;
      var adminNotes = "";
      var notes = [];
    };
  };

  /// Find an existing customer by normalized email first, then normalized phone.
  /// Returns the matched customer id, or null when neither key matches.
  public func findExisting(
    byEmail : (Text) -> ?CustomerId,
    byPhone : (Text) -> ?CustomerId,
    email : Text,
    phone : Text,
  ) : ?CustomerId {
    let emailKey = normalizeEmail(email);
    switch (byEmail(emailKey)) {
      case (?id) { return ?id };
      case null {};
    };
    let phoneKey = normalizePhone(phone);
    if (phoneKey.size() == 0) { return null };
    byPhone(phoneKey);
  };

  /// Resolve an existing customer by normalized email first, then phone, or
  /// create a new permanent record. Returns the customer id together with the
  /// next free customer id, so the caller can persist the advanced counter.
  /// Shared by the customer API and the job flow so a returning customer is
  /// matched and reused rather than duplicated.
  public func resolveOrCreate(
    customers : Map.Map<CustomerId, Customer>,
    byEmail : Map.Map<Text, CustomerId>,
    byPhone : Map.Map<Text, CustomerId>,
    nextCustomerId : Nat,
    fullName : Text,
    email : Text,
    phone : Text,
    serviceAddress : Text,
    now : Timestamp,
  ) : (CustomerId, Nat) {
    let existing = findExisting(
      func(key) = byEmail.get(key),
      func(key) = byPhone.get(key),
      email,
      phone,
    );
    switch (existing) {
      case (?id) { (id, nextCustomerId) };
      case null {
        let id = nextCustomerId;
        let input : CustomerInput = {
          fullName;
          phone;
          email;
          serviceAddress;
          preferredContact = #email;
        };
        let customer = newCustomer(id, input, now);
        customers.add(id, customer);
        let emailKey = normalizeEmail(email);
        if (emailKey.size() > 0) { byEmail.add(emailKey, id) };
        let phoneKey = normalizePhone(phone);
        if (phoneKey.size() > 0) { byPhone.add(phoneKey, id) };
        (id, id + 1);
      };
    };
  };

  /// Convert an internal customer into its shared view.
  public func toView(customer : Customer) : CustomerView {
    {
      id = customer.id;
      fullName = customer.fullName;
      phone = customer.phone;
      email = customer.email;
      serviceAddress = customer.serviceAddress;
      preferredContact = customer.preferredContact;
      createdAt = customer.createdAt;
      status = customer.status;
      adminNotes = customer.adminNotes;
      notes = customer.notes;
    };
  };

  /// Build a directory row for the searchable customer list.
  public func toSummary(customer : Customer, jobCount : Nat) : CustomerSummary {
    {
      id = customer.id;
      fullName = customer.fullName;
      phone = customer.phone;
      email = customer.email;
      serviceAddress = customer.serviceAddress;
      status = customer.status;
      jobCount;
    };
  };

  /// Append an administrative note to a customer, returning the new note id.
  public func addNote(customer : Customer, noteId : Nat, body : Text, now : Timestamp) : Nat {
    let note : CustomerNote = { id = noteId; body; createdAt = now };
    customer.notes := customer.notes.concat([note]);
    noteId;
  };

  /// Update a customer's contact fields and preferred contact method. The
  /// record's `var` fields are preserved by rebuilding the record explicitly.
  public func updateContact(customer : Customer, input : CustomerInput) : Customer {
    {
      id = customer.id;
      fullName = input.fullName;
      phone = input.phone;
      email = input.email;
      serviceAddress = input.serviceAddress;
      preferredContact = input.preferredContact;
      createdAt = customer.createdAt;
      var status = customer.status;
      var adminNotes = customer.adminNotes;
      var notes = customer.notes;
    };
  };

  /// Replace a customer's administrative notes text.
  public func setAdminNotes(customer : Customer, adminNotes : Text) : () {
    customer.adminNotes := adminNotes;
  };

  /// Change a customer's lifecycle status.
  public func setStatus(customer : Customer, status : CustomerStatus) : () {
    customer.status := status;
  };

  /// Archive a customer without deleting their record.
  public func archive(customer : Customer) : () {
    customer.status := #archived;
  };

  /// Restore an archived customer to active.
  public func restore(customer : Customer) : () {
    customer.status := #active;
  };

  /// Whether a customer matches a free-text search term across name, phone,
  /// email, customer id and service address.
  public func matchesSearch(customer : Customer, term : Text) : Bool {
    let needle = term.trim(#text " ").toLower();
    if (needle.size() == 0) { return true };
    let idText = customer.id.toText();
    customer.fullName.toLower().contains(#text needle)
      or customer.phone.toLower().contains(#text needle)
      or customer.email.toLower().contains(#text needle)
      or customer.serviceAddress.toLower().contains(#text needle)
      or idText.contains(#text needle);
  };

  /// Whether a job request belongs to a customer, matched on normalized email
  /// first and then normalized phone.
  public func jobBelongsToCustomer(job : JobTypes.JobRequest, customer : Customer) : Bool {
    let jobEmail = normalizeEmail(job.email);
    let customerEmail = normalizeEmail(customer.email);
    if (jobEmail.size() > 0 and jobEmail == customerEmail) { return true };
    let jobPhone = normalizePhone(job.phone);
    let customerPhone = normalizePhone(customer.phone);
    jobPhone.size() > 0 and jobPhone == customerPhone;
  };

  /// Build the full customer profile view, aggregating the customer's jobs
  /// grouped into completed/pending/cancelled, deposits, appointments, notes,
  /// uploaded photo ids, quotes, job records, payment history and message
  /// thread.
  public func toProfileView(
    customer : Customer,
    allJobs : [JobTypes.JobRequest],
    beeNameOf : (JobTypes.BeeId) -> ?Text,
    allJobRecords : [JobTypes.JobRecordView],
    allPayments : [JobTypes.PaymentHistory],
    allMessages : [MessageView],
  ) : CustomerProfileView {
    let jobs = allJobs.filter(func(job) = jobBelongsToCustomer(job, customer));
    let views = jobs.map(func(job) = viewOfJob(job, beeNameOf));
    let completed = views.filter(func(job) = job.status == #completed);
    let cancelled = views.filter(func(job) = job.status == #cancelled);
    let pending = views.filter(func(job) = job.status != #completed and job.status != #cancelled);
    let deposits = jobs.map(func(job) = job.deposit).filterMap(func(deposit) = deposit);
    let appointments = jobs.map(func(job) = job.appointment).filterMap(func(appointment) = appointment);
    let photoIds = jobs.flatMap(func(job) = job.photoIds.values());
    let quotes = jobs.map(func(job) = job.quote).filterMap(func(quote) = quote);
    let jobRecords = allJobRecords.filter(func(record) = record.customerId == customer.id);
    let payments = allPayments.filter(func(payment) = payment.customerId == customer.id);
    let messages = allMessages.filter(func(message) = message.customerId == customer.id);
    {
      customer = toView(customer);
      jobs = views;
      completedJobs = completed;
      pendingJobs = pending;
      cancelledJobs = cancelled;
      deposits;
      appointments;
      photoIds;
      quotes;
      jobRecords;
      payments;
      messages;
    };
  };

  /// Build a job view, resolving the assigned bee's name.
  func viewOfJob(job : JobTypes.JobRequest, beeNameOf : (JobTypes.BeeId) -> ?Text) : JobTypes.JobRequestView {
    let view = JobsLib.toView(job);
    let beeName = switch (job.assignedBeeId) {
      case (?id) { beeNameOf(id) };
      case null { null };
    };
    { view with assignedBeeName = beeName };
  };

  /// Render a customer status as text for CSV export.
  func statusText(status : CustomerStatus) : Text {
    switch status {
      case (#active) "active";
      case (#inactive) "inactive";
      case (#archived) "archived";
    };
  };

  /// Render a preferred contact method as text for CSV export.
  func preferredContactText(preferred : PreferredContact) : Text {
    switch (preferred) {
      case (#email) "email";
      case (#phone) "phone";
      case (#sms) "sms";
    };
  };

  /// Escape a CSV field: wrap in quotes and double any embedded quote.
  func csvField(value : Text) : Text {
    "\"" # value.replace(#text "\"", "\"\"") # "\"";
  };

  /// Build a CSV export of the customer records, one row per customer.
  public func toCsv(customers : [Customer]) : Text {
    let header = "Customer ID,Full Name,Phone,Email,Service Address,Preferred Contact,Created At,Status,Admin Notes,Note Count";
    let rows = customers.map(func(customer) {
      csvField(customer.id.toText()) # "," #
      csvField(customer.fullName) # "," #
      csvField(customer.phone) # "," #
      csvField(customer.email) # "," #
      csvField(customer.serviceAddress) # "," #
      csvField(preferredContactText(customer.preferredContact)) # "," #
      csvField(customer.createdAt.toText()) # "," #
      csvField(statusText(customer.status)) # "," #
      csvField(customer.adminNotes) # "," #
      csvField(customer.notes.size().toText());
    });
    let lines = [header].concat(rows);
    lines.values().join("\n");
  };
};
