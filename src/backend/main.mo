import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Expose "mo:caffeineai-oql/Expose";
import OQL "mo:caffeineai-oql";
import Entity "mo:caffeineai-oql/Entity";
import TextValue "mo:caffeineai-oql/TextValue";
import NatValue "mo:caffeineai-oql/NatValue";
import IntValue "mo:caffeineai-oql/IntValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import Runtime "mo:core/Runtime";
import Types "types/jobs";
import CustomerTypes "types/customers";
import NotificationTypes "types/notifications";
import JobsApi "mixins/jobs-api";
import PricingApi "mixins/pricing-api";
import PaymentsApi "mixins/payments-api";
import OwnerNotificationsApi "mixins/owner-notifications-api";
import CustomersApi "mixins/customers-api";
import NotificationsApi "mixins/notifications-api";
import MessagesApi "mixins/messages-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);
  include MixinObjectStorage();

  let jobs : Map.Map<Types.JobId, Types.JobRequest>;
  let bees : Map.Map<Types.BeeId, Types.Bee>;
  let state : { var nextJobId : Nat; var nextBeeId : Nat };
  let stripeConfiguration : { var config : ?Stripe.StripeConfiguration };
  /// Owner inbox that receives every new job request alert. Persisted so it
  /// survives upgrades and can be changed without a code change.
  let ownerEmail : { var address : Text };
  /// Owner phone that receives every new job request alert by SMS. Persisted
  /// so it survives upgrades and can be changed without a code change.
  let ownerPhone : { var number : Text };
  /// Twilio messaging credential used to text the owner. Held by the canister
  /// only and never returned to the frontend.
  let twilioConfig : {
    var accountSid : Text;
    var keySid : Text;
    var keySecret : Text;
    var fromNumber : Text;
  };
  /// Public base URL of the app's frontend. Used to build absolute links in
  /// customer emails so a link opens the app's Track page from an email client.
  /// Empty means "not configured"; the backend then falls back to a default.
  let frontendOrigin : { var origin : Text };

  /// Permanent customer records, keyed by customer id.
  let customers : Map.Map<CustomerTypes.CustomerId, CustomerTypes.Customer>;
  /// Normalized-email index into `customers` for returning-customer matching.
  let customerByEmail : Map.Map<Text, CustomerTypes.CustomerId>;
  /// Normalized-phone index into `customers` for returning-customer matching.
  let customerByPhone : Map.Map<Text, CustomerTypes.CustomerId>;
  /// Admin dashboard notifications, keyed by notification id.
  let notifications : Map.Map<NotificationTypes.NotificationId, NotificationTypes.Notification>;
  /// Customer/administrator messages, keyed by message id.
  let messages : Map.Map<NotificationTypes.MessageId, NotificationTypes.Message>;
  /// Counters for the new domains.
  let customerState : {
    var nextCustomerId : Nat;
    var nextNotificationId : Nat;
    var nextMessageId : Nat;
    var nextNoteId : Nat;
  };

  /// Saved admin-managed discount rules.
  let discounts : Map.Map<Types.DiscountId, Types.DiscountRule>;
  /// Jobs created from confirmed requests or quotes.
  let jobRecords : Map.Map<Types.JobRecordId, Types.JobRecord>;
  /// Permanent payment-history entries.
  let paymentHistory : Map.Map<Types.PaymentId, Types.PaymentHistory>;
  /// Admin notification and workflow toggles.
  let adminSettings : { var settings : Types.AdminSettings };
  /// Tax configuration.
  let taxSetting : { var setting : Types.TaxSetting };
  /// Deposit configuration.
  let depositSetting : { var setting : Types.DepositSetting };
  /// Accepted payment methods and the owner's payment handles.
  let paymentSettings : { var settings : Types.PaymentSettings };
  /// Quote defaults.
  let quoteSetting : { var setting : Types.QuoteSettings };
  /// Business identity.
  let businessSetting : { var setting : Types.BusinessSettings };
  /// Counters for the new domains.
  let settingsState : {
    var nextDiscountId : Nat;
    var nextJobRecordId : Nat;
    var nextPaymentId : Nat;
  };

  /// HTTP outcall transform required by the Stripe client.
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func requireAdmin(caller : Principal) : () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (accessControlState.userRoles.get(caller)) {
      case (?#admin) {};
      case (_) { Runtime.trap("Unauthorized: Only admins can perform this action") };
    };
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    stripeConfiguration.config ?? Runtime.trap("Stripe needs to be first configured");
  };

  /// Admin: store the Stripe secret key and allowed countries.
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    requireAdmin(caller);
    stripeConfiguration.config := ?config;
  };

  /// Whether Stripe checkout is configured for deposit payments.
  public query func isStripeConfigured() : async Bool {
    stripeConfiguration.config != null;
  };

  /// Guest: create a Stripe checkout session for a set of shopping items.
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  /// Guest: read the status of a Stripe checkout session.
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  include JobsApi(jobs, bees, state, accessControlState, stripeConfiguration, ownerEmail, ownerPhone, twilioConfig, frontendOrigin, customers, customerByEmail, customerByPhone, customerState, notifications, discounts, taxSetting, depositSetting, transform);
  include PricingApi(discounts, settingsState, taxSetting, depositSetting, paymentSettings, quoteSetting, businessSetting, adminSettings, accessControlState);
  include PaymentsApi(jobs, jobRecords, paymentHistory, settingsState, paymentSettings, adminSettings, customers, customerByEmail, customerByPhone, notifications, customerState, accessControlState);
  include OwnerNotificationsApi(accessControlState, ownerEmail, ownerPhone, twilioConfig, frontendOrigin);
  include CustomersApi(customers, customerByEmail, customerByPhone, customerState, jobs, bees, jobRecords, paymentHistory, messages, accessControlState);
  include NotificationsApi(notifications, customerState, accessControlState);
  include MessagesApi(messages, notifications, jobs, customerByEmail, customerByPhone, customerState, accessControlState);
  include ApiDocMixin();

  func categoryText(category : Types.ServiceCategory) : Text =
    switch category {
      case (#house) "house";
      case (#yardPlants) "yardPlants";
      case (#fixIt) "fixIt";
      case (#cleanOrganize) "cleanOrganize";
      case (#moveLift) "moveLift";
      case (#errands) "errands";
      case (#mowing) "mowing";
      case (#showMe) "showMe";
    };

  func statusText(status : Types.JobStatus) : Text =
    switch status {
      case (#requested) "requested";
      case (#quoted) "quoted";
      case (#scheduled) "scheduled";
      case (#inProgress) "inProgress";
      case (#completed) "completed";
      case (#cancelled) "cancelled";
    };

  func quoteAmount(quote : ?Types.Quote) : Nat =
    switch quote { case (?q) q.amount; case null 0 };

  func quoteDiscountApplied(quote : ?Types.Quote) : Bool =
    switch quote { case (?q) q.discountApplied; case null false };

  func quoteDiscountAmount(quote : ?Types.Quote) : Nat =
    switch quote { case (?q) q.discountAmount; case null 0 };

  func depositPaid(deposit : ?Types.Deposit) : Bool =
    switch deposit { case (?d) d.paid; case null false };

  func appointmentAt(appointment : ?Types.Appointment) : Int =
    switch appointment { case (?a) a.scheduledAt; case null 0 };

  func reviewRating(review : ?Types.Review) : Nat =
    switch review { case (?r) r.rating; case null 0 };

  func assignedBeeName(beeId : ?Types.BeeId) : Text =
    switch beeId {
      case (?id) {
        switch (bees.get(id)) {
          case (?bee) bee.name;
          case null "";
        };
      };
      case null "";
    };

  func packageEnrollmentText(enrollment : ?Types.PackageEnrollment) : Text =
    switch enrollment {
      case (?p) {
        if (p.active) { "active" } else { "cancelled" };
      };
      case null "none";
    };

  func customerStatusText(status : CustomerTypes.CustomerStatus) : Text =
    switch status {
      case (#active) "active";
      case (#inactive) "inactive";
      case (#archived) "archived";
    };

  func preferredContactText(preferred : CustomerTypes.PreferredContact) : Text =
    switch preferred {
      case (#email) "email";
      case (#phone) "phone";
      case (#sms) "sms";
    };

  func notificationKindText(kind : NotificationTypes.NotificationKind) : Text =
    switch kind {
      case (#newCustomer) "newCustomer";
      case (#returningCustomerRequest) "returningCustomerRequest";
      case (#customerMessage) "customerMessage";
      case (#bookingApproval) "bookingApproval";
      case (#depositReceived) "depositReceived";
      case (#quoteApproved) "quoteApproved";
      case (#quoteDeclined) "quoteDeclined";
      case (#appointmentConfirmed) "appointmentConfirmed";
      case (#appointmentChanged) "appointmentChanged";
      case (#newRequest) "newRequest";
      case (#newMessage) "newMessage";
      case (#depositSubmitted) "depositSubmitted";
      case (#depositVerified) "depositVerified";
      case (#appointmentReminder) "appointmentReminder";
      case (#paymentReceived) "paymentReceived";
    };

  func quoteStatusText(status : Types.QuoteStatus) : Text =
    switch status {
      case (#draft) "draft";
      case (#sent) "sent";
      case (#approved) "approved";
      case (#declined) "declined";
    };

  func quoteNumber(quote : ?Types.Quote) : Text =
    switch quote { case (?q) q.quoteNumber; case null "" };

  func quoteStatus(quote : ?Types.Quote) : Text =
    switch quote { case (?q) quoteStatusText(q.status); case null "none" };

  func quoteSubtotal(quote : ?Types.Quote) : Nat =
    switch quote { case (?q) q.subtotal; case null 0 };

  func quoteTotal(quote : ?Types.Quote) : Nat =
    switch quote { case (?q) q.total; case null 0 };

  func quoteLaborCharge(quote : ?Types.Quote) : Nat =
    switch quote { case (?q) q.laborCharge; case null 0 };

  func quoteMaterialsCharge(quote : ?Types.Quote) : Nat =
    switch quote { case (?q) q.materialsCharge; case null 0 };

  func quoteDepositRequired(quote : ?Types.Quote) : Nat =
    switch quote { case (?q) q.depositRequired; case null 0 };

  func quoteRemainingBalance(quote : ?Types.Quote) : Nat =
    switch quote { case (?q) q.remainingBalance; case null 0 };

  func quoteCreatedAt(quote : ?Types.Quote) : Int =
    switch quote { case (?q) q.createdAt; case null 0 };

  func quoteExpiresAt(quote : ?Types.Quote) : Int =
    switch quote { case (?q) q.expiresAt ?? 0; case null 0 };

  func quoteWorkDescription(quote : ?Types.Quote) : Text =
    switch quote { case (?q) q.workDescription; case null "" };

  func quoteLineItemCount(quote : ?Types.Quote) : Nat =
    switch quote { case (?q) q.lineItems.size(); case null 0 };

  func discountKindText(kind : Types.DiscountKind) : Text =
    switch kind {
      case (#percentage) "percentage";
      case (#fixed) "fixed";
    };

  func discountEligibilityText(eligibility : Types.DiscountEligibility) : Text =
    switch eligibility {
      case (#all) "all";
      case (#ownParts) "ownParts";
      case (#returningCustomer) "returningCustomer";
    };

  func paymentMethodText(method : Types.PaymentMethod) : Text =
    switch method {
      case (#stripe) "stripe";
      case (#cashApp) "cashApp";
      case (#payPal) "payPal";
      case (#venmo) "venmo";
      case (#chime) "chime";
    };

  func depositStatusText(status : Types.DepositStatus) : Text =
    switch status {
      case (#pending) "pending";
      case (#submitted) "submitted";
      case (#verified) "verified";
      case (#rejected) "rejected";
    };

  func jobRecordStatusText(status : Types.JobRecordStatus) : Text =
    switch status {
      case (#scheduled) "scheduled";
      case (#inProgress) "inProgress";
      case (#completed) "completed";
      case (#cancelled) "cancelled";
    };

  include Expose({
    entities = [
      OQL.Entity.manual<Types.JobRequest>("jobRequest", func () = jobs.values(), "JobRequest", "id")
        .sample({
          id = 0;
          referenceCode = "";
          customerName = "";
          email = "";
          phone = "";
          category = #house : Types.ServiceCategory;
          description = "";
          preferredTiming = "";
          photoIds = [] : [Types.PhotoId];
          createdAt = 0;
          ownParts = false;
          var status = #requested : Types.JobStatus;
          var quote = null : ?Types.Quote;
          var deposit = null : ?Types.Deposit;
          var appointment = null : ?Types.Appointment;
          var review = null : ?Types.Review;
          var assignedBeeId = null : ?Types.BeeId;
          var packageEnrollment = null : ?Types.PackageEnrollment;
          var completedAt = null : ?Types.Timestamp;
        })
        .payload("assignedBeeId", func (j) = switch (j.assignedBeeId) { case (?id) id; case null 0 })
        .payload("assignedBeeName", func (j) = assignedBeeName(j.assignedBeeId))
        .payload("packageEnrollment", func (j) = packageEnrollmentText(j.packageEnrollment))
        .payload("packageActive", func (j) = switch (j.packageEnrollment) { case (?p) p.active; case null false })
        .payload("completedAt", func (j) = j.completedAt ?? 0)
        .payload("referenceCode", func (j) = j.referenceCode)
        .payload("customerName", func (j) = j.customerName)
        .payload("email", func (j) = j.email)
        .payload("phone", func (j) = j.phone)
        .payload("category", func (j) = categoryText(j.category))
        .payload("description", func (j) = j.description)
        .payload("preferredTiming", func (j) = j.preferredTiming)
        .payload("photoCount", func (j) = j.photoIds.size())
        .payload("createdAt", func (j) = j.createdAt)
        .payload("status", func (j) = statusText(j.status))
        .payload("quoteAmount", func (j) = quoteAmount(j.quote))
        .payload("quoteDiscountApplied", func (j) = quoteDiscountApplied(j.quote))
        .payload("quoteDiscountAmount", func (j) = quoteDiscountAmount(j.quote))
        .payload("quoteNumber", func (j) = quoteNumber(j.quote))
        .payload("quoteStatus", func (j) = quoteStatus(j.quote))
        .payload("quoteSubtotal", func (j) = quoteSubtotal(j.quote))
        .payload("quoteTotal", func (j) = quoteTotal(j.quote))
        .payload("quoteLaborCharge", func (j) = quoteLaborCharge(j.quote))
        .payload("quoteMaterialsCharge", func (j) = quoteMaterialsCharge(j.quote))
        .payload("quoteDepositRequired", func (j) = quoteDepositRequired(j.quote))
        .payload("quoteRemainingBalance", func (j) = quoteRemainingBalance(j.quote))
        .payload("quoteCreatedAt", func (j) = quoteCreatedAt(j.quote))
        .payload("quoteExpiresAt", func (j) = quoteExpiresAt(j.quote))
        .payload("quoteWorkDescription", func (j) = quoteWorkDescription(j.quote))
        .payload("quoteLineItemCount", func (j) = quoteLineItemCount(j.quote))
        .payload("ownParts", func (j) = j.ownParts)
        .payload("depositPaid", func (j) = depositPaid(j.deposit))
        .payload("appointmentAt", func (j) = appointmentAt(j.appointment))
        .payload("reviewRating", func (j) = reviewRating(j.review))
        .controllerOnly()
        .build(),
      OQL.Entity.manual<Types.Bee>("bee", func () = bees.values(), "Bee", "id")
        .sample({
          id = 0;
          name = "";
          specialty = "";
          createdAt = 0;
        })
        .payload("id", func (b) = b.id)
        .payload("name", func (b) = b.name)
        .payload("specialty", func (b) = b.specialty)
        .payload("createdAt", func (b) = b.createdAt)
        .controllerOnly()
        .build(),
      // The owner alert inbox is a single persisted value, not a collection.
      // It is projected as a one-row table so the Data Intelligence agent can
      // answer "which address and phone receive new-request alerts?".
      OQL.Entity.manual<{ id : Text; address : Text; phone : Text }>(
        "ownerAlert",
        func () = [{ id = "owner"; address = ownerEmail.address; phone = ownerPhone.number }].values(),
        "OwnerAlert",
        "id",
      )
        .sample({ id = "owner"; address = ""; phone = "" })
        .payload("id", func (r) = r.id)
        .payload("address", func (r) = r.address)
        .payload("phone", func (r) = r.phone)
        .controllerOnly()
        .build(),
      OQL.Entity.manual<CustomerTypes.Customer>("customer", func () = customers.values(), "Customer", "id")
        .sample({
          id = 0;
          fullName = "";
          phone = "";
          email = "";
          serviceAddress = "";
          preferredContact = #email : CustomerTypes.PreferredContact;
          createdAt = 0;
          var status = #active : CustomerTypes.CustomerStatus;
          var adminNotes = "";
          var notes = [] : [CustomerTypes.CustomerNote];
        })
        .payload("id", func (c) = c.id)
        .payload("fullName", func (c) = c.fullName)
        .payload("phone", func (c) = c.phone)
        .payload("email", func (c) = c.email)
        .payload("serviceAddress", func (c) = c.serviceAddress)
        .payload("preferredContact", func (c) = preferredContactText(c.preferredContact))
        .payload("createdAt", func (c) = c.createdAt)
        .payload("status", func (c) = customerStatusText(c.status))
        .payload("adminNotes", func (c) = c.adminNotes)
        .payload("noteCount", func (c) = c.notes.size())
        .controllerOnly()
        .build(),
      OQL.Entity.manual<NotificationTypes.Notification>("notification", func () = notifications.values(), "Notification", "id")
        .sample({
          id = 0;
          kind = #newCustomer : NotificationTypes.NotificationKind;
          title = "";
          body = "";
          createdAt = 0;
          var read = false;
          relatedJobId = null : ?Types.JobId;
          relatedCustomerId = null : ?CustomerTypes.CustomerId;
        })
        .payload("id", func (n) = n.id)
        .payload("kind", func (n) = notificationKindText(n.kind))
        .payload("title", func (n) = n.title)
        .payload("body", func (n) = n.body)
        .payload("createdAt", func (n) = n.createdAt)
        .payload("read", func (n) = n.read)
        .payload("relatedJobId", func (n) = n.relatedJobId ?? 0)
        .payload("relatedCustomerId", func (n) = n.relatedCustomerId ?? 0)
        .controllerOnly()
        .build(),
      OQL.Entity.manual<NotificationTypes.Message>("message", func () = messages.values(), "Message", "id")
        .sample({
          id = 0;
          customerId = 0;
          jobId = null : ?Types.JobId;
          fromAdmin = false;
          body = "";
          createdAt = 0;
        })
        .payload("id", func (m) = m.id)
        .payload("customerId", func (m) = m.customerId)
        .payload("jobId", func (m) = m.jobId ?? 0)
        .payload("fromAdmin", func (m) = m.fromAdmin)
        .payload("body", func (m) = m.body)
        .payload("createdAt", func (m) = m.createdAt)
        .controllerOnly()
        .build(),
      OQL.Entity.manual<Types.DiscountRule>("discount", func () = discounts.values(), "DiscountRule", "id")
        .sample({
          id = 0;
          name = "";
          kind = #percentage : Types.DiscountKind;
          value = 0;
          active = false;
          startAt = null : ?Types.Timestamp;
          endAt = null : ?Types.Timestamp;
          eligibility = #all : Types.DiscountEligibility;
          minPurchase = 0;
          maxDiscount = 0;
          createdAt = 0;
        })
        .payload("id", func (d) = d.id)
        .payload("name", func (d) = d.name)
        .payload("kind", func (d) = discountKindText(d.kind))
        .payload("value", func (d) = d.value)
        .payload("active", func (d) = d.active)
        .payload("startAt", func (d) = d.startAt ?? 0)
        .payload("endAt", func (d) = d.endAt ?? 0)
        .payload("eligibility", func (d) = discountEligibilityText(d.eligibility))
        .payload("minPurchase", func (d) = d.minPurchase)
        .payload("maxDiscount", func (d) = d.maxDiscount)
        .payload("createdAt", func (d) = d.createdAt)
        .controllerOnly()
        .build(),
      OQL.Entity.manual<Types.JobRecord>("jobRecord", func () = jobRecords.values(), "JobRecord", "id")
        .sample({
          id = 0;
          jobRequestId = 0;
          referenceCode = "";
          customerId = 0;
          customerName = "";
          serviceAddress = "";
          category = #house : Types.ServiceCategory;
          scheduledAt = 0;
          quote = null : ?Types.Quote;
          pricing = null : ?Types.QuotePricing;
          deposit = null : ?Types.Deposit;
          remainingBalance = 0;
          var status = #scheduled : Types.JobRecordStatus;
          createdAt = 0;
          var completedAt = null : ?Types.Timestamp;
        })
        .payload("id", func (r) = r.id)
        .payload("jobRequestId", func (r) = r.jobRequestId)
        .payload("referenceCode", func (r) = r.referenceCode)
        .payload("customerId", func (r) = r.customerId)
        .payload("customerName", func (r) = r.customerName)
        .payload("serviceAddress", func (r) = r.serviceAddress)
        .payload("category", func (r) = categoryText(r.category))
        .payload("scheduledAt", func (r) = r.scheduledAt)
        .payload("quoteTotal", func (r) = switch (r.quote) { case (?q) q.total; case null 0 })
        .payload("discountAmount", func (r) = switch (r.pricing) { case (?p) p.discountAmount; case null 0 })
        .payload("finalTotal", func (r) = switch (r.pricing) { case (?p) p.finalTotal; case null 0 })
        .payload("depositAmount", func (r) = switch (r.pricing) { case (?p) p.depositAmount; case null 0 })
        .payload("depositStatus", func (r) = switch (r.deposit) { case (?d) depositStatusText(d.status); case null "pending" })
        .payload("remainingBalance", func (r) = r.remainingBalance)
        .payload("status", func (r) = jobRecordStatusText(r.status))
        .payload("createdAt", func (r) = r.createdAt)
        .payload("completedAt", func (r) = r.completedAt ?? 0)
        .controllerOnly()
        .build(),
      OQL.Entity.manual<Types.PaymentHistory>("paymentHistory", func () = paymentHistory.values(), "PaymentHistory", "id")
        .sample({
          id = 0;
          jobRequestId = 0;
          referenceCode = "";
          customerId = 0;
          originalQuote = 0;
          discountAmount = 0;
          finalQuote = 0;
          depositAmount = 0;
          paymentMethod = #payPal : Types.PaymentMethod;
          depositStatus = #pending : Types.DepositStatus;
          remainingBalance = 0;
          finalPayment = 0;
          totalPaid = 0;
          createdAt = 0;
          updatedAt = 0;
        })
        .payload("id", func (h) = h.id)
        .payload("jobRequestId", func (h) = h.jobRequestId)
        .payload("referenceCode", func (h) = h.referenceCode)
        .payload("customerId", func (h) = h.customerId)
        .payload("originalQuote", func (h) = h.originalQuote)
        .payload("discountAmount", func (h) = h.discountAmount)
        .payload("finalQuote", func (h) = h.finalQuote)
        .payload("depositAmount", func (h) = h.depositAmount)
        .payload("paymentMethod", func (h) = paymentMethodText(h.paymentMethod))
        .payload("depositStatus", func (h) = depositStatusText(h.depositStatus))
        .payload("remainingBalance", func (h) = h.remainingBalance)
        .payload("finalPayment", func (h) = h.finalPayment)
        .payload("totalPaid", func (h) = h.totalPaid)
        .payload("createdAt", func (h) = h.createdAt)
        .payload("updatedAt", func (h) = h.updatedAt)
        .controllerOnly()
        .build(),
    ];
  });
};
