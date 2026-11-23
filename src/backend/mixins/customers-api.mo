import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Result "mo:core/Result";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Types "../types/customers";
import JobTypes "../types/jobs";
import NotificationTypes "../types/notifications";
import CustomersLib "../lib/customers";
import JobsLib "../lib/jobs";
import MessageLib "../lib/messages";

mixin (
  customers : Map.Map<Types.CustomerId, Types.Customer>,
  customerByEmail : Map.Map<Text, Types.CustomerId>,
  customerByPhone : Map.Map<Text, Types.CustomerId>,
  customerState : {
    var nextCustomerId : Nat;
    var nextNotificationId : Nat;
    var nextMessageId : Nat;
    var nextNoteId : Nat;
  },
  jobs : Map.Map<JobTypes.JobId, JobTypes.JobRequest>,
  bees : Map.Map<JobTypes.BeeId, JobTypes.Bee>,
  jobRecords : Map.Map<JobTypes.JobRecordId, JobTypes.JobRecord>,
  paymentHistory : Map.Map<JobTypes.PaymentId, JobTypes.PaymentHistory>,
  messages : Map.Map<NotificationTypes.MessageId, NotificationTypes.Message>,
  accessControlState : AccessControl.AccessControlState,
) {
  func requireAdminCustomers(caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) {};
      case (_) { Runtime.trap("Unauthorized: Only admins can perform this action") };
    };
  };

  /// Resolve the assigned bee's name for a job view.
  func beeNameOf(beeId : JobTypes.BeeId) : ?Text {
    switch (bees.get(beeId)) {
      case (?bee) { ?bee.name };
      case null { null };
    };
  };

  /// Count the jobs associated with a customer.
  func jobCountOf(customer : Types.Customer) : Nat {
    jobs.values().filter(func(job) = CustomersLib.jobBelongsToCustomer(job, customer)).size();
  };

  /// Index a customer under its normalized email and phone keys.
  func indexCustomer(customer : Types.Customer) : () {
    let emailKey = CustomersLib.normalizeEmail(customer.email);
    if (emailKey.size() > 0) { customerByEmail.add(emailKey, customer.id) };
    let phoneKey = CustomersLib.normalizePhone(customer.phone);
    if (phoneKey.size() > 0) { customerByPhone.add(phoneKey, customer.id) };
  };

  /// Resolve an existing customer by normalized email first, then phone, or
  /// create a new permanent record. Returns the customer id. Used by the job
  /// flow so a returning customer is matched and reused rather than duplicated.
  public func resolveOrCreateCustomer(
    fullName : Text,
    email : Text,
    phone : Text,
    serviceAddress : Text,
  ) : async Types.CustomerId {
    let (id, nextId) = CustomersLib.resolveOrCreate(
      customers,
      customerByEmail,
      customerByPhone,
      customerState.nextCustomerId,
      fullName,
      email,
      phone,
      serviceAddress,
      Time.now(),
    );
    customerState.nextCustomerId := nextId;
    id;
  };

  /// Admin: list customers, optionally including archived records.
  public query ({ caller }) func listCustomers(includeArchived : Bool) : async [Types.CustomerSummary] {
    requireAdminCustomers(caller);
    customers.values()
      .filter(func(customer) = includeArchived or customer.status != #archived)
      .map(func(customer) = CustomersLib.toSummary(customer, jobCountOf(customer)))
      .toArray();
  };

  /// Admin: search the customer directory by name, phone, email, customer id
  /// or service address.
  public query ({ caller }) func searchCustomers(term : Text) : async [Types.CustomerSummary] {
    requireAdminCustomers(caller);
    customers.values()
      .filter(func(customer) = CustomersLib.matchesSearch(customer, term))
      .map(func(customer) = CustomersLib.toSummary(customer, jobCountOf(customer)))
      .toArray();
  };

  /// Admin: fetch a single customer record.
  public query ({ caller }) func getCustomer(id : Types.CustomerId) : async ?Types.CustomerView {
    requireAdminCustomers(caller);
    switch (customers.get(id)) {
      case (?customer) { ?CustomersLib.toView(customer) };
      case null { null };
    };
  };

  /// Admin: fetch a customer's full profile with service history, deposits,
  /// appointments, notes and uploaded photo ids.
  public query ({ caller }) func getCustomerProfile(id : Types.CustomerId) : async ?Types.CustomerProfileView {
    requireAdminCustomers(caller);
    switch (customers.get(id)) {
      case (?customer) {
        ?CustomersLib.toProfileView(
          customer,
          jobs.values().toArray(),
          beeNameOf,
          jobRecords.values().map(func(record) = JobsLib.jobRecordToView(record)).toArray(),
          paymentHistory.values().toArray(),
          messages.values().map(func(message) = MessageLib.toView(message)).toArray(),
        );
      };
      case null { null };
    };
  };

  /// Admin: create a new customer record.
  public shared ({ caller }) func createCustomer(input : Types.CustomerInput) : async Result.Result<Types.CustomerView, Types.CustomerError> {
    requireAdminCustomers(caller);
    if (input.fullName.trim(#text " ").size() == 0) {
      return #err(#invalidInput("Customer name is required"));
    };
    let id = customerState.nextCustomerId;
    customerState.nextCustomerId := id + 1;
    let customer = CustomersLib.newCustomer(id, input, Time.now());
    customers.add(id, customer);
    indexCustomer(customer);
    #ok(CustomersLib.toView(customer));
  };

  /// Admin: update a customer's contact fields and preferred contact method.
  public shared ({ caller }) func updateCustomer(id : Types.CustomerId, input : Types.CustomerInput) : async Result.Result<Types.CustomerView, Types.CustomerError> {
    requireAdminCustomers(caller);
    switch (customers.get(id)) {
      case (?customer) {
        if (input.fullName.trim(#text " ").size() == 0) {
          return #err(#invalidInput("Customer name is required"));
        };
        let updated = CustomersLib.updateContact(customer, input);
        customers.add(id, updated);
        indexCustomer(updated);
        #ok(CustomersLib.toView(updated));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: append an internal note to a customer profile.
  public shared ({ caller }) func addCustomerNote(id : Types.CustomerId, body : Text) : async Result.Result<Types.CustomerView, Types.CustomerError> {
    requireAdminCustomers(caller);
    switch (customers.get(id)) {
      case (?customer) {
        if (body.trim(#text " ").size() == 0) {
          return #err(#invalidInput("Note body is required"));
        };
        let noteId = customerState.nextNoteId;
        customerState.nextNoteId := noteId + 1;
        ignore CustomersLib.addNote(customer, noteId, body, Time.now());
        #ok(CustomersLib.toView(customer));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: change a customer's lifecycle status.
  public shared ({ caller }) func setCustomerStatus(id : Types.CustomerId, status : Types.CustomerStatus) : async Result.Result<Types.CustomerView, Types.CustomerError> {
    requireAdminCustomers(caller);
    switch (customers.get(id)) {
      case (?customer) {
        CustomersLib.setStatus(customer, status);
        #ok(CustomersLib.toView(customer));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: archive a customer without deleting their record.
  public shared ({ caller }) func archiveCustomer(id : Types.CustomerId) : async Result.Result<Types.CustomerView, Types.CustomerError> {
    requireAdminCustomers(caller);
    switch (customers.get(id)) {
      case (?customer) {
        CustomersLib.archive(customer);
        #ok(CustomersLib.toView(customer));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: restore an archived customer to active.
  public shared ({ caller }) func restoreCustomer(id : Types.CustomerId) : async Result.Result<Types.CustomerView, Types.CustomerError> {
    requireAdminCustomers(caller);
    switch (customers.get(id)) {
      case (?customer) {
        CustomersLib.restore(customer);
        #ok(CustomersLib.toView(customer));
      };
      case null { #err(#notFound) };
    };
  };

  /// Admin: export all customer records as CSV text.
  public query ({ caller }) func exportCustomersCsv() : async Text {
    requireAdminCustomers(caller);
    CustomersLib.toCsv(customers.values().toArray());
  };
};
