import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface Cell {
    value: Value;
    name: string;
}
export interface DashboardStats {
    reviewsCount: bigint;
    depositsCollected: bigint;
    newRequests: bigint;
    upcomingAppointments: bigint;
    activeJobs: bigint;
}
export interface Deposit {
    method: PaymentMethod;
    paid: boolean;
    stripeSessionId?: string;
    amount: bigint;
    paidAt?: Timestamp;
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
export interface PackageEnrollment {
    startedAt: Timestamp;
    active: boolean;
    monthlyPrice: bigint;
    includedVisits: bigint;
}
export type PhotoId = string;
export interface Quote {
    discountApplied: boolean;
    discountAmount: bigint;
    note: string;
    sentAt: Timestamp;
    amount: bigint;
}
export type ReferenceCode = string;
export type Result = {
    __kind__: "ok";
    ok: BeeView;
} | {
    __kind__: "err";
    err: BeeError;
};
export type Result_1 = {
    __kind__: "ok";
    ok: JobRequestView;
} | {
    __kind__: "err";
    err: JobError;
};
export type Result_2 = {
    __kind__: "ok";
    ok: JobRequestView;
} | {
    __kind__: "err";
    err: BeeError;
};
export type Result_3 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: JobError;
};
export type Result_4 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
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
export enum JobStatus {
    scheduled = "scheduled",
    requested = "requested",
    completed = "completed",
    quoted = "quoted",
    inProgress = "inProgress"
}
export enum PaymentMethod {
    stripe = "stripe",
    cashApp = "cashApp"
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
     * / Guest: accept the quote attached to a job request.
     */
    acceptQuote(referenceCode: ReferenceCode): Promise<Result_1>;
    /**
     * / Admin: advance a job request to its next lifecycle status.
     */
    advanceStatus(id: JobId): Promise<Result_1>;
    /**
     * / Admin: assign a bee to a job request.
     */
    assignBeeToJob(id: JobId, beeId: BeeId): Promise<Result_2>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Guest: confirm the scheduled appointment.
     */
    confirmAppointment(referenceCode: ReferenceCode): Promise<Result_1>;
    /**
     * / Guest: confirm a Stripe deposit payment and mark the deposit paid.
     */
    confirmDepositPayment(referenceCode: ReferenceCode): Promise<Result_1>;
    /**
     * / Admin: create a bee (employee) with a name and specialty.
     */
    createBee(input: BeeInput): Promise<Result>;
    /**
     * / Guest: create a Stripe checkout session for a set of shopping items.
     */
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    /**
     * / Guest: create a Stripe checkout session for the 50% deposit on an accepted quote.
     */
    createDepositCheckoutSession(referenceCode: ReferenceCode, successUrl: string, cancelUrl: string): Promise<Result_3>;
    execute(qJson: string): Promise<Result__1>;
    /**
     * / Return the backend's behavioral API documentation as Markdown.
     */
    getApiDoc(): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    /**
     * / Admin: read the newest-first visit history for a job request's customer.
     */
    getCustomerVisitHistory(id: JobId): Promise<Array<VisitRecord>>;
    /**
     * / Admin: read dashboard statistics.
     */
    getDashboardStats(): Promise<DashboardStats>;
    /**
     * / Admin: fetch a single job request by id.
     */
    getRequest(id: JobId): Promise<JobRequestView | null>;
    /**
     * / Guest: fetch a job request by its public reference code.
     */
    getRequestByReference(referenceCode: ReferenceCode): Promise<JobRequestView | null>;
    /**
     * / Guest: read the status of a Stripe checkout session.
     */
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
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
     * / Admin: list all job requests.
     */
    listRequests(): Promise<Array<JobRequestView>>;
    /**
     * / Guest: record a deposit payment for an accepted quote.
     */
    recordDeposit(referenceCode: ReferenceCode, method: PaymentMethod): Promise<Result_1>;
    /**
     * / Admin: schedule an appointment for a job request. Notifies BOTH the
     * / customer and the owner.
     */
    scheduleAppointment(id: JobId, scheduledAt: Timestamp): Promise<Result_1>;
    schema(): Promise<string>;
    /**
     * / Admin: mark a job request's customer as being on the monthly package.
     */
    setPackageEnrollment(id: JobId, active: boolean): Promise<Result_2>;
    /**
     * / Admin: set the quote amount and note for a job request. When the customer
     * / indicated they supply their own parts, a 10% discount is applied and
     * / recorded on the quote.
     */
    setQuote(id: JobId, amount: bigint, note: string): Promise<Result_1>;
    /**
     * / Admin: store the Stripe secret key and allowed countries.
     */
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    /**
     * / Guest: submit a new job request and receive its public reference code.
     */
    submitRequest(input: JobRequestInput): Promise<ReferenceCode>;
    /**
     * / Guest: submit a review for a completed job.
     */
    submitReview(referenceCode: ReferenceCode, rating: bigint, comment: string): Promise<Result_1>;
    /**
     * / HTTP outcall transform required by the Stripe client.
     */
    transform(input: TransformationInput): Promise<TransformationOutput>;
    /**
     * / Admin: update a bee's name and specialty.
     */
    updateBee(id: BeeId, input: BeeInput): Promise<Result>;
}
