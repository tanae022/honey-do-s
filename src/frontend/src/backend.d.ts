import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AdminSettings {
    appointmentReminders: boolean;
    notificationSound: boolean;
    messageAlerts: boolean;
    pushNotifications: boolean;
    customerRequestAlerts: boolean;
}
export interface Appointment {
    confirmed: boolean;
    scheduledAt: Timestamp;
}
export type BeeError = {
    __kind__: "invalidState";
    invalidState: string;
} | {
    __kind__: "notAuthorized";
    notAuthorized: null;
} | {
    __kind__: "notFound";
    notFound: null;
};
export type BeeId = bigint;
export interface BeeInput {
    name: string;
    specialty: string;
}
export interface BeeView {
    id: BeeId;
    name: string;
    createdAt: Timestamp;
    specialty: string;
}
export interface BusinessSettings {
    businessName: string;
    businessEmail: string;
    businessAddress: string;
    businessPhone: string;
}
export interface Cell {
    value: Value;
    name: string;
}
export type ChannelResult = {
    __kind__: "sent";
    sent: null;
} | {
    __kind__: "failed";
    failed: string;
};
export type CustomerError = {
    __kind__: "notAuthorized";
    notAuthorized: null;
} | {
    __kind__: "invalidInput";
    invalidInput: string;
} | {
    __kind__: "notFound";
    notFound: null;
};
export type CustomerId = bigint;
export interface CustomerInput {
    serviceAddress: string;
    fullName: string;
    email: string;
    preferredContact: PreferredContact;
    phone: string;
}
export interface CustomerNote {
    id: bigint;
    body: string;
    createdAt: Timestamp;
}
export interface CustomerProfileView {
    completedJobs: Array<JobRequestView>;
    payments: Array<PaymentHistory>;
    customer: CustomerView;
    messages: Array<MessageView__1>;
    jobs: Array<JobRequestView>;
    photoIds: Array<PhotoId>;
    appointments: Array<Appointment>;
    cancelledJobs: Array<JobRequestView>;
    deposits: Array<Deposit>;
    pendingJobs: Array<JobRequestView>;
    quotes: Array<Quote>;
    jobRecords: Array<JobRecordView>;
}
export interface CustomerSummary {
    id: CustomerId;
    status: CustomerStatus;
    serviceAddress: string;
    fullName: string;
    email: string;
    phone: string;
    jobCount: bigint;
}
export interface CustomerView {
    id: CustomerId;
    status: CustomerStatus;
    serviceAddress: string;
    createdAt: Timestamp;
    fullName: string;
    email: string;
    preferredContact: PreferredContact;
    notes: Array<CustomerNote>;
    phone: string;
    adminNotes: string;
}
export interface DashboardStats {
    reviewsCount: bigint;
    depositsCollected: bigint;
    newRequests: bigint;
    upcomingAppointments: bigint;
    activeJobs: bigint;
}
export interface Deposit {
    status: DepositStatus;
    method: PaymentMethod;
    paid: boolean;
    submittedAt?: Timestamp;
    stripeSessionId?: string;
    amount: bigint;
    verifiedAt?: Timestamp;
    paidAt?: Timestamp;
}
export interface DepositSetting {
    percent: bigint;
}
export interface DiscountApplication {
    ruleName: string;
    ruleId?: DiscountId;
    applied: boolean;
    reason: string;
}
export type DiscountId = bigint;
export interface DiscountRule {
    id: DiscountId;
    active: boolean;
    minPurchase: bigint;
    maxDiscount: bigint;
    value: bigint;
    startAt?: Timestamp;
    kind: DiscountKind;
    name: string;
    createdAt: Timestamp;
    endAt?: Timestamp;
    eligibility: DiscountEligibility;
}
export interface DiscountRuleInput {
    active: boolean;
    minPurchase: bigint;
    maxDiscount: bigint;
    value: bigint;
    startAt?: Timestamp;
    kind: DiscountKind;
    name: string;
    endAt?: Timestamp;
    eligibility: DiscountEligibility;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export type FrontendOriginError = {
    __kind__: "invalidOrigin";
    invalidOrigin: string;
};
export interface HttpHeader {
    value: string;
    name: string;
}
export interface HttpRequestResult {
    status: bigint;
    body: Uint8Array;
    headers: Array<HttpHeader>;
}
export type JobError = {
    __kind__: "paymentError";
    paymentError: string;
} | {
    __kind__: "invalidState";
    invalidState: string;
} | {
    __kind__: "notAuthorized";
    notAuthorized: null;
} | {
    __kind__: "notFound";
    notFound: null;
};
export type JobId = bigint;
export type JobRecordId = bigint;
export interface JobRecordView {
    id: JobRecordId;
    customerName: string;
    status: JobRecordStatus;
    completedAt?: Timestamp;
    serviceAddress: string;
    createdAt: Timestamp;
    quote?: Quote;
    deposit?: Deposit;
    jobRequestId: JobId;
    pricing?: QuotePricing;
    referenceCode: ReferenceCode;
    remainingBalance: bigint;
    category: ServiceCategory;
    customerId: CustomerId;
    scheduledAt: Timestamp;
}
export interface JobRequestInput {
    customerName: string;
    preferredTiming: string;
    description: string;
    photoIds: Array<PhotoId>;
    ownParts: boolean;
    email: string;
    category: ServiceCategory;
    phone: string;
    packageInterest: boolean;
}
export interface JobRequestView {
    id: JobId;
    customerName: string;
    status: JobStatus;
    completedAt?: Timestamp;
    review?: Review;
    packageEnrollment?: PackageEnrollment;
    preferredTiming: string;
    appointment?: Appointment;
    createdAt: Timestamp;
    quote?: Quote;
    description: string;
    photoIds: Array<PhotoId>;
    deposit?: Deposit;
    ownParts: boolean;
    email: string;
    referenceCode: ReferenceCode;
    category: ServiceCategory;
    assignedBeeName?: string;
    phone: string;
    assignedBeeId?: BeeId;
}
export type MessageError = {
    __kind__: "notAuthorized";
    notAuthorized: null;
} | {
    __kind__: "invalidInput";
    invalidInput: string;
} | {
    __kind__: "notFound";
    notFound: null;
};
export type MessageId = bigint;
export interface MessageView {
    id: MessageId;
    body: string;
    createdAt: Timestamp;
    jobId?: JobId;
    customerId: CustomerId;
    fromAdmin: boolean;
}
export interface MessageView__1 {
    id: bigint;
    body: string;
    createdAt: Timestamp;
    jobId?: JobId;
    customerId: CustomerId;
    fromAdmin: boolean;
}
export type NotificationId = bigint;
export interface NotificationView {
    id: NotificationId;
    title: string;
    relatedCustomerId?: CustomerId;
    body: string;
    kind: NotificationKind;
    createdAt: Timestamp;
    read: boolean;
    relatedJobId?: JobId;
}
export type OwnerAlertError = {
    __kind__: "invalidEmail";
    invalidEmail: string;
} | {
    __kind__: "sendFailed";
    sendFailed: string;
};
export type OwnerAlertPhoneError = {
    __kind__: "invalidPhone";
    invalidPhone: string;
} | {
    __kind__: "sendFailed";
    sendFailed: string;
};
export interface PackageEnrollment {
    startedAt: Timestamp;
    active: boolean;
    monthlyPrice: bigint;
    includedVisits: bigint;
}
export interface PaymentHistory {
    id: PaymentId;
    depositAmount: bigint;
    paymentMethod: PaymentMethod;
    depositStatus: DepositStatus;
    discountAmount: bigint;
    createdAt: Timestamp;
    totalPaid: bigint;
    jobRequestId: JobId;
    finalPayment: bigint;
    referenceCode: ReferenceCode;
    updatedAt: Timestamp;
    finalQuote: bigint;
    remainingBalance: bigint;
    customerId: CustomerId;
    originalQuote: bigint;
}
export type PaymentId = bigint;
export interface PaymentSettings {
    chimeHandle: string;
    venmoHandle: string;
    payPalHandle: string;
    cashAppHandle: string;
    acceptedMethods: Array<PaymentMethod>;
}
export interface PaymentSummaryView {
    customerName: string;
    depositAmount: bigint;
    chimeHandle: string;
    adjustedSubtotal: bigint;
    venmoHandle: string;
    depositStatus: DepositStatus;
    depositMethod?: PaymentMethod;
    discountAmount: bigint;
    finalTotal: bigint;
    appointmentConfirmed: boolean;
    serviceDescription: string;
    discountReason: string;
    referenceCode: ReferenceCode;
    payPalHandle: string;
    cashAppHandle: string;
    remainingBalance: bigint;
    originalSubtotal: bigint;
    acceptedMethods: Array<PaymentMethod>;
    taxAmount: bigint;
    appointmentAt?: Timestamp;
}
export type PhotoId = string;
export interface Quote {
    status: QuoteStatus;
    lineItems: Array<QuoteLineItem>;
    total: bigint;
    expiresAt?: Timestamp;
    laborCharge: bigint;
    discountApplied: boolean;
    discountAmount: bigint;
    note: string;
    createdAt: Timestamp;
    quoteNumber: string;
    sentAt: Timestamp;
    workDescription: string;
    pricing?: QuotePricing;
    remainingBalance: bigint;
    materialsCharge: bigint;
    amount: bigint;
    depositRequired: bigint;
    subtotal: bigint;
}
export type QuoteEmailResult = {
    __kind__: "sent";
    sent: null;
} | {
    __kind__: "failed";
    failed: string;
};
export interface QuoteInput {
    lineItems: Array<QuoteLineItem>;
    expiresAt?: Timestamp;
    laborCharge: bigint;
    note: string;
    workDescription: string;
    materialsCharge: bigint;
    depositRequired: bigint;
}
export interface QuoteLineItem {
    description: string;
    quantity: bigint;
    unitPrice: bigint;
}
export interface QuotePricing {
    depositAmount: bigint;
    adjustedSubtotal: bigint;
    discountAmount: bigint;
    finalTotal: bigint;
    remainingBalance: bigint;
    originalSubtotal: bigint;
    discount: DiscountApplication;
    taxAmount: bigint;
}
export interface QuoteSendResult {
    view: JobRequestView;
    email: QuoteEmailResult;
}
export interface QuoteSettings {
    terms: string;
    validityDays: bigint;
}
export interface QuoteView {
    status: QuoteStatus;
    lineItems: Array<QuoteLineItem>;
    total: bigint;
    expiresAt?: Timestamp;
    expired: boolean;
    laborCharge: bigint;
    discountApplied: boolean;
    discountAmount: bigint;
    note: string;
    quoteNumber: string;
    workDescription: string;
    pricing?: QuotePricing;
    referenceCode: ReferenceCode;
    remainingBalance: bigint;
    materialsCharge: bigint;
    depositRequired: bigint;
    subtotal: bigint;
}
export type ReferenceCode = string;
export type Result = {
    __kind__: "ok";
    ok: JobRequestView;
} | {
    __kind__: "err";
    err: JobError;
};
export type Result_1 = {
    __kind__: "ok";
    ok: DiscountRule;
} | {
    __kind__: "err";
    err: SettingsError;
};
export type Result_10 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: FrontendOriginError;
};
export type Result_11 = {
    __kind__: "ok";
    ok: DepositSetting;
} | {
    __kind__: "err";
    err: SettingsError;
};
export type Result_12 = {
    __kind__: "ok";
    ok: BusinessSettings;
} | {
    __kind__: "err";
    err: SettingsError;
};
export type Result_13 = {
    __kind__: "ok";
    ok: AdminSettings;
} | {
    __kind__: "err";
    err: SettingsError;
};
export type Result_14 = {
    __kind__: "ok";
    ok: QuoteSendResult;
} | {
    __kind__: "err";
    err: JobError;
};
export type Result_15 = {
    __kind__: "ok";
    ok: PaymentHistory;
} | {
    __kind__: "err";
    err: JobError;
};
export type Result_16 = {
    __kind__: "ok";
    ok: MessageView;
} | {
    __kind__: "err";
    err: MessageError;
};
export type Result_17 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: NotificationError;
};
export type Result_18 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: SettingsError;
};
export type Result_19 = {
    __kind__: "ok";
    ok: JobRecordView;
} | {
    __kind__: "err";
    err: JobError;
};
export type Result_2 = {
    __kind__: "ok";
    ok: CustomerView;
} | {
    __kind__: "err";
    err: CustomerError;
};
export type Result_20 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: JobError;
};
export type Result_21 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export type Result_3 = {
    __kind__: "ok";
    ok: BeeView;
} | {
    __kind__: "err";
    err: BeeError;
};
export type Result_4 = {
    __kind__: "ok";
    ok: TaxSetting;
} | {
    __kind__: "err";
    err: SettingsError;
};
export type Result_5 = {
    __kind__: "ok";
    ok: QuoteSettings;
} | {
    __kind__: "err";
    err: SettingsError;
};
export type Result_6 = {
    __kind__: "ok";
    ok: PaymentSettings;
} | {
    __kind__: "err";
    err: SettingsError;
};
export type Result_7 = {
    __kind__: "ok";
    ok: JobRequestView;
} | {
    __kind__: "err";
    err: BeeError;
};
export type Result_8 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: OwnerAlertPhoneError;
};
export type Result_9 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: OwnerAlertError;
};
export interface Result__1 {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface Review {
    createdAt: Timestamp;
    comment: string;
    rating: bigint;
}
export interface SettingsBundle {
    tax: TaxSetting;
    admin: AdminSettings;
    quote: QuoteSettings;
    deposit: DepositSetting;
    business: BusinessSettings;
    payment: PaymentSettings;
}
export type SettingsError = {
    __kind__: "notAuthorized";
    notAuthorized: null;
} | {
    __kind__: "invalidInput";
    invalidInput: string;
} | {
    __kind__: "notFound";
    notFound: null;
};
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface TaxSetting {
    enabled: boolean;
    ratePercent: bigint;
}
export interface TestAlertResult {
    sms: ChannelResult;
    email: ChannelResult;
}
export type Timestamp = bigint;
export interface TransformationInput {
    context: Uint8Array;
    response: HttpRequestResult;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<HttpHeader>;
}
export interface TwilioConfigStatus {
    configured: boolean;
    fromNumber: string;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export interface VisitRecord {
    service: ServiceCategory;
    completedAt: Timestamp;
    jobId: JobId;
    referenceCode: ReferenceCode;
    beeName?: string;
    beeId?: BeeId;
}
export enum CustomerStatus {
    active = "active",
    inactive = "inactive",
    archived = "archived"
}
export enum DepositStatus {
    verified = "verified",
    submitted = "submitted",
    pending = "pending",
    rejected = "rejected"
}
export enum DiscountEligibility {
    all = "all",
    returningCustomer = "returningCustomer",
    ownParts = "ownParts"
}
export enum DiscountKind {
    fixed = "fixed",
    percentage = "percentage"
}
export enum JobRecordStatus {
    scheduled = "scheduled",
    cancelled = "cancelled",
    completed = "completed",
    inProgress = "inProgress"
}
export enum JobStatus {
    scheduled = "scheduled",
    requested = "requested",
    cancelled = "cancelled",
    completed = "completed",
    quoted = "quoted",
    inProgress = "inProgress"
}
export enum NotificationError {
    notAuthorized = "notAuthorized",
    notFound = "notFound"
}
export enum NotificationKind {
    appointmentReminder = "appointmentReminder",
    depositReceived = "depositReceived",
    returningCustomerRequest = "returningCustomerRequest",
    depositVerified = "depositVerified",
    depositSubmitted = "depositSubmitted",
    appointmentConfirmed = "appointmentConfirmed",
    newCustomer = "newCustomer",
    quoteApproved = "quoteApproved",
    newRequest = "newRequest",
    appointmentChanged = "appointmentChanged",
    customerMessage = "customerMessage",
    paymentReceived = "paymentReceived",
    quoteDeclined = "quoteDeclined",
    newMessage = "newMessage",
    bookingApproval = "bookingApproval"
}
export enum PaymentMethod {
    stripe = "stripe",
    venmo = "venmo",
    chime = "chime",
    cashApp = "cashApp",
    payPal = "payPal"
}
export enum PreferredContact {
    sms = "sms",
    email = "email",
    phone = "phone"
}
export enum QuoteStatus {
    sent = "sent",
    approved = "approved",
    declined = "declined",
    draft = "draft"
}
export enum ServiceCategory {
    fixIt = "fixIt",
    showMe = "showMe",
    house = "house",
    cleanOrganize = "cleanOrganize",
    mowing = "mowing",
    errands = "errands",
    moveLift = "moveLift",
    yardPlants = "yardPlants"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    /**
     * / Guest: accept the quote attached to a job request. Marks the quote
     * / approved and moves the job to `#scheduled`, keeping the existing
     * / accept-to-scheduled transition working. An expired quote cannot be
     * / accepted and returns `#invalidState`.
     */
    acceptQuote(referenceCode: ReferenceCode): Promise<Result>;
    /**
     * / Admin: append an internal note to a customer profile.
     */
    addCustomerNote(id: CustomerId, body: string): Promise<Result_2>;
    /**
     * / Admin: advance a job to its next lifecycle status.
     */
    advanceJobRecord(id: JobRecordId): Promise<Result_19>;
    /**
     * / Admin: advance a job request to its next lifecycle status.
     */
    advanceStatus(id: JobId): Promise<Result>;
    /**
     * / Admin: mark a quote as approved by the customer.
     */
    approveQuote(id: JobId): Promise<Result>;
    /**
     * / Admin: archive a customer without deleting their record.
     */
    archiveCustomer(id: CustomerId): Promise<Result_2>;
    /**
     * / Admin: assign a bee to a job request.
     */
    assignBeeToJob(id: JobId, beeId: BeeId): Promise<Result_7>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Admin: cancel a job request. Cancellation is terminal and moves the job
     * / into the customer profile's cancelled group. A completed job cannot be
     * / cancelled, and cancelling an already-cancelled job is a no-op.
     */
    cancelJob(id: JobId): Promise<Result>;
    /**
     * / Admin: cancel a job. Cancellation is terminal.
     */
    cancelJobRecord(id: JobRecordId): Promise<Result_19>;
    /**
     * / Admin: mark a job completed.
     */
    completeJobRecord(id: JobRecordId): Promise<Result_19>;
    /**
     * / Guest: confirm the scheduled appointment.
     */
    confirmAppointment(referenceCode: ReferenceCode): Promise<Result>;
    /**
     * / Guest: confirm a Stripe deposit payment and mark the deposit paid.
     */
    confirmDepositPayment(referenceCode: ReferenceCode): Promise<Result>;
    /**
     * / Admin: convert an approved quote into a scheduled job at the given time.
     * / The quote must be approved; the job moves to `#scheduled` with a pending
     * / appointment.
     */
    convertQuoteToJob(id: JobId, scheduledAt: Timestamp): Promise<Result>;
    /**
     * / Admin: create a bee (employee) with a name and specialty.
     */
    createBee(input: BeeInput): Promise<Result_3>;
    /**
     * / Guest: create a Stripe checkout session for a set of shopping items.
     */
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    /**
     * / Admin: create a new customer record.
     */
    createCustomer(input: CustomerInput): Promise<Result_2>;
    /**
     * / Guest: create a Stripe checkout session for the 50% deposit on an accepted quote.
     */
    createDepositCheckoutSession(referenceCode: ReferenceCode, successUrl: string, cancelUrl: string): Promise<Result_20>;
    /**
     * / Admin: create a new discount rule. The rule is stored inactive-safe: an
     * / invalid window (end before start) or a zero-value percentage is rejected.
     */
    createDiscount(input: DiscountRuleInput): Promise<Result_1>;
    /**
     * / Admin: create a new service request for an existing customer, reusing the
     * / customer's stored contact information. The job enters the same
     * / service/quote/deposit/appointment/status lifecycle as a customer-submitted
     * / request and is linked to the customer's permanent profile.
     */
    createJobForCustomer(customerId: CustomerId, input: JobRequestInput): Promise<Result>;
    /**
     * / Admin: create a job from a confirmed request or quote. The job captures the
     * / customer, service, address, scheduled date/time, quote, pricing, deposit,
     * / remaining balance and initial status. Creating a job for a request that
     * / already has one returns the existing job.
     */
    createJobRecord(jobId: JobId, scheduledAt: Timestamp): Promise<Result_19>;
    /**
     * / Admin: mark a quote as declined by the customer.
     */
    declineQuote(id: JobId): Promise<Result>;
    /**
     * / Guest: decline the quote attached to a job request from the emailed quote
     * / link. Marks the quote declined, matching the existing decline flow.
     */
    declineQuoteByReference(referenceCode: ReferenceCode): Promise<Result>;
    /**
     * / Admin: delete a discount rule.
     */
    deleteDiscount(id: DiscountId): Promise<Result_18>;
    /**
     * / Admin: create or replace a quote from a full professional quote payload,
     * / including line items, labor and materials charges and optional expiration.
     * / The subtotal, applicable discount, tax, final total, 10% deposit and
     * / remaining balance are computed automatically by the pricing engine.
     */
    editQuote(id: JobId, input: QuoteInput): Promise<Result>;
    execute(qJson: string): Promise<Result__1>;
    /**
     * / Admin: export all customer records as CSV text.
     */
    exportCustomersCsv(): Promise<string>;
    /**
     * / Return the backend's behavioral API documentation as Markdown.
     */
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Admin: fetch a single customer record.
     */
    getCustomer(id: CustomerId): Promise<CustomerView | null>;
    /**
     * / Customer: read their own thread using their job reference code. Only
     * / messages belonging to the resolved customer are returned.
     */
    getCustomerMessages(referenceCode: string): Promise<Array<MessageView>>;
    /**
     * / Admin: fetch a customer's full profile with service history, deposits,
     * / appointments, notes and uploaded photo ids.
     */
    getCustomerProfile(id: CustomerId): Promise<CustomerProfileView | null>;
    /**
     * / Admin: read the newest-first visit history for a job request's customer.
     */
    getCustomerVisitHistory(id: JobId): Promise<Array<VisitRecord>>;
    /**
     * / Admin: read dashboard statistics.
     */
    getDashboardStats(): Promise<DashboardStats>;
    /**
     * / Admin: read the configured public frontend origin used to build absolute
     * / links in customer emails. An empty string means "not configured".
     */
    getFrontendOrigin(): Promise<string>;
    /**
     * / Admin: read a single job record.
     */
    getJobRecord(id: JobRecordId): Promise<JobRecordView | null>;
    /**
     * / Admin: read the current owner alert email address.
     */
    getOwnerAlertEmail(): Promise<string>;
    /**
     * / Admin: read the current owner alert phone number.
     */
    getOwnerAlertPhone(): Promise<string>;
    /**
     * / Admin: read the payment history for a job request.
     */
    getPaymentHistoryForJob(jobId: JobId): Promise<PaymentHistory | null>;
    /**
     * / Guest: read the customer-facing payment summary for a reference code. This
     * / is the payment page: original amount, discount, final quote, 10% deposit
     * / required, remaining balance, accepted payment methods and the current
     * / deposit and appointment state.
     */
    getPaymentSummary(referenceCode: ReferenceCode): Promise<PaymentSummaryView | null>;
    /**
     * / Guest: read the customer-facing quote for a job by its public reference
     * / code. This is the view the emailed quote link opens; it shows the same
     * / itemized quote the Track page shows and marks an expired quote as expired.
     */
    getQuoteByReference(referenceCode: ReferenceCode): Promise<QuoteView | null>;
    /**
     * / Admin: fetch a single job request by id.
     */
    getRequest(id: JobId): Promise<JobRequestView | null>;
    /**
     * / Guest: fetch a job request by its public reference code.
     */
    getRequestByReference(referenceCode: ReferenceCode): Promise<JobRequestView | null>;
    /**
     * / Admin: read the complete settings bundle.
     */
    getSettings(): Promise<SettingsBundle>;
    /**
     * / Guest: read the status of a Stripe checkout session.
     */
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    /**
     * / Admin: read whether the Twilio messaging credential is configured and
     * / which sending number it uses.
     */
    getTwilioConfigStatus(): Promise<TwilioConfigStatus>;
    /**
     * / Admin: count the notifications that have not been reviewed yet.
     */
    getUnreadNotificationCount(): Promise<bigint>;
    /**
     * / Guest: read the newest-first visit history for a reference code.
     */
    getVisitHistory(referenceCode: ReferenceCode): Promise<Array<VisitRecord>>;
    isCallerAdmin(): Promise<boolean>;
    /**
     * / Whether Stripe checkout is configured for deposit payments.
     */
    isStripeConfigured(): Promise<boolean>;
    /**
     * / Admin: list all bees.
     */
    listBees(): Promise<Array<BeeView>>;
    /**
     * / Admin: list a customer's message thread newest first.
     */
    listCustomerMessages(customerId: CustomerId): Promise<Array<MessageView>>;
    /**
     * / Admin: list customers, optionally including archived records.
     */
    listCustomers(includeArchived: boolean): Promise<Array<CustomerSummary>>;
    /**
     * / Admin: list every saved discount rule, newest first.
     */
    listDiscounts(): Promise<Array<DiscountRule>>;
    /**
     * / Admin: list every job created from a confirmed request or quote, newest
     * / first.
     */
    listJobRecords(): Promise<Array<JobRecordView>>;
    /**
     * / Admin: list every notification newest first.
     */
    listNotifications(): Promise<Array<NotificationView>>;
    /**
     * / Admin: list every permanent payment-history entry, newest first.
     */
    listPaymentHistory(): Promise<Array<PaymentHistory>>;
    /**
     * / Admin: list all job requests.
     */
    listRequests(): Promise<Array<JobRequestView>>;
    /**
     * / Admin: mark every notification read.
     */
    markAllNotificationsRead(): Promise<void>;
    /**
     * / Admin: mark a single notification read.
     */
    markNotificationRead(id: NotificationId): Promise<Result_17>;
    /**
     * / Admin: post a reply into a customer's thread.
     */
    postAdminMessage(customerId: CustomerId, jobId: JobId | null, body: string): Promise<Result_16>;
    /**
     * / Customer: post a message using their job reference code. The customer is
     * / resolved from the job, so a caller can only ever write to their own thread.
     */
    postCustomerMessage(referenceCode: string, body: string): Promise<Result_16>;
    /**
     * / Raise an admin dashboard notification for one of the tracked triggers.
     * / The job and deposit flows call this helper directly.
     */
    raiseNotification(kind: NotificationKind, title: string, body: string, relatedJobId: JobId | null, relatedCustomerId: CustomerId | null): Promise<NotificationId>;
    /**
     * / Guest: record a deposit payment for an accepted quote.
     */
    recordDeposit(referenceCode: ReferenceCode, method: PaymentMethod): Promise<Result>;
    /**
     * / Admin: record the final payment for a job and update its permanent payment
     * / history. The total paid becomes the verified deposit plus the final
     * / payment.
     */
    recordFinalPayment(jobId: JobId, amount: bigint, method: PaymentMethod): Promise<Result_15>;
    /**
     * / Admin: mark a submitted deposit not received. The deposit returns to
     * / rejected so the customer can resubmit it.
     */
    rejectDeposit(referenceCode: ReferenceCode): Promise<Result>;
    /**
     * / Resolve an existing customer by normalized email first, then phone, or
     * / create a new permanent record. Returns the customer id. Used by the job
     * / flow so a returning customer is matched and reused rather than duplicated.
     */
    resolveOrCreateCustomer(fullName: string, email: string, phone: string, serviceAddress: string): Promise<CustomerId>;
    /**
     * / Admin: restore an archived customer to active.
     */
    restoreCustomer(id: CustomerId): Promise<Result_2>;
    /**
     * / Admin: schedule an appointment for a job request. Notifies BOTH the
     * / customer and the owner.
     */
    scheduleAppointment(id: JobId, scheduledAt: Timestamp): Promise<Result>;
    schema(): Promise<string>;
    /**
     * / Admin: search the customer directory by name, phone, email, customer id
     * / or service address.
     */
    searchCustomers(term: string): Promise<Array<CustomerSummary>>;
    /**
     * / Admin: raise an appointment-reminder notification for a scheduled job.
     * / Respects the appointment-reminders setting.
     */
    sendAppointmentReminder(jobId: JobId): Promise<Result>;
    /**
     * / Admin: mark a quote as sent to the customer and email the itemized quote
     * / to the customer's address on the request. The email carries the quote
     * / number, work description, line items, labor, materials, subtotal,
     * / own-parts discount, total, deposit required, remaining balance, expiration
     * / date, the owner's note, and absolute accept/decline links that open the
     * / customer's quote from any email client. The result reports the email
     * / delivery outcome per channel so the
     * / owner can be told whether the email was sent; a delivery failure is
     * / surfaced rather than swallowed. Saving or editing a quote never emails.
     */
    sendQuote(id: JobId): Promise<Result_14>;
    /**
     * / Admin: send a sample alert to both the saved email and the saved phone,
     * / reporting the outcome of each channel separately.
     */
    sendTestAlert(): Promise<TestAlertResult>;
    /**
     * / Admin: update the notification and workflow toggles.
     */
    setAdminSettings(settings: AdminSettings): Promise<Result_13>;
    /**
     * / Admin: update the business identity.
     */
    setBusinessSettings(setting: BusinessSettings): Promise<Result_12>;
    /**
     * / Admin: change a customer's lifecycle status.
     */
    setCustomerStatus(id: CustomerId, status: CustomerStatus): Promise<Result_2>;
    /**
     * / Admin: update the deposit setting. The deposit percentage must be between
     * / 1 and 100.
     */
    setDepositSetting(setting: DepositSetting): Promise<Result_11>;
    /**
     * / Admin: turn a discount rule on or off.
     */
    setDiscountActive(id: DiscountId, active: boolean): Promise<Result_1>;
    /**
     * / Admin: validate and persist the public frontend origin used to build
     * / absolute links in customer emails. The value must be an absolute http(s)
     * / URL with no trailing slash; an empty string clears it and restores the
     * / backend's default origin.
     */
    setFrontendOrigin(origin: string): Promise<Result_10>;
    /**
     * / Admin: validate and persist a new owner alert email address.
     */
    setOwnerAlertEmail(address: string): Promise<Result_9>;
    /**
     * / Admin: validate and persist a new owner alert phone number, normalized
     * / to E.164.
     */
    setOwnerAlertPhone(number_: string): Promise<Result_8>;
    /**
     * / Admin: mark a job request's customer as being on the monthly package.
     */
    setPackageEnrollment(id: JobId, active: boolean): Promise<Result_7>;
    /**
     * / Admin: update the accepted payment methods and the owner's payment handles.
     */
    setPaymentSettings(settings: PaymentSettings): Promise<Result_6>;
    /**
     * / Admin: set the quote amount and note for a job request. The amount becomes
     * / a single line item and the automatic pricing breakdown (discount, tax,
     * / final total, 10% deposit and remaining balance) is computed from the saved
     * / discount rules and settings.
     */
    setQuote(id: JobId, amount: bigint, note: string): Promise<Result>;
    /**
     * / Admin: update the quote defaults.
     */
    setQuoteSettings(setting: QuoteSettings): Promise<Result_5>;
    /**
     * / Admin: store the Stripe secret key and allowed countries.
     */
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    /**
     * / Admin: update the tax setting.
     */
    setTaxSetting(setting: TaxSetting): Promise<Result_4>;
    /**
     * / Admin: store the Twilio messaging credential. The secret is held by the
     * / canister only and never returned to the frontend.
     */
    setTwilioCredentials(accountSid: string, keySid: string, keySecret: string, fromNumber: string): Promise<void>;
    /**
     * / Guest: submit a deposit for a quote with the chosen payment method. The
     * / deposit becomes submitted and awaits owner verification; it is not paid
     * / until the owner confirms it.
     */
    submitDeposit(referenceCode: ReferenceCode, method: PaymentMethod): Promise<Result>;
    /**
     * / Guest: submit a new job request and receive its public reference code.
     */
    submitRequest(input: JobRequestInput): Promise<ReferenceCode>;
    /**
     * / Guest: submit a review for a completed job.
     */
    submitReview(referenceCode: ReferenceCode, rating: bigint, comment: string): Promise<Result>;
    /**
     * / HTTP outcall transform required by the Stripe client.
     */
    transform(input: TransformationInput): Promise<TransformationOutput>;
    /**
     * / Admin: update a bee's name and specialty.
     */
    updateBee(id: BeeId, input: BeeInput): Promise<Result_3>;
    /**
     * / Admin: update a customer's contact fields and preferred contact method.
     */
    updateCustomer(id: CustomerId, input: CustomerInput): Promise<Result_2>;
    /**
     * / Admin: update an existing discount rule.
     */
    updateDiscount(id: DiscountId, input: DiscountRuleInput): Promise<Result_1>;
    /**
     * / Admin: confirm a submitted deposit. The deposit becomes paid and verified,
     * / the request is confirmed and the calendar appointment is booked.
     */
    verifyDeposit(referenceCode: ReferenceCode): Promise<Result>;
}
