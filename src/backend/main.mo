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
import JobsApi "mixins/jobs-api";
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

  include JobsApi(jobs, bees, state, accessControlState, stripeConfiguration, ownerEmail, transform);
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
    ];
  });
};
