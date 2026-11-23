import type {
  Appointment,
  BeeView,
  CustomerNote,
  CustomerProfileView,
  CustomerSummary,
  CustomerView,
  DashboardStats,
  Deposit,
  JobRequestView,
  MessageView,
  NotificationView,
  PackageEnrollment,
  Quote,
  Review,
  VisitRecord,
} from "@/backend";
import {
  CustomerStatus,
  DepositStatus,
  JobStatus,
  NotificationKind,
  PaymentMethod,
  PreferredContact,
  QuoteStatus,
  ServiceCategory,
} from "@/backend";

/**
 * A fully-populated `JobRequestView` fixture. Every field is explicit so a test
 * that overrides one field still sees the rest of the shape the UI expects.
 */
export function makeJob(
  overrides: Partial<JobRequestView> = {},
): JobRequestView {
  return {
    id: 1n,
    customerName: "Jamie Rivera",
    status: JobStatus.requested,
    preferredTiming: "Weekday mornings",
    createdAt: 1_700_000_000_000_000_000n,
    description: "The kitchen faucet drips constantly.",
    photoIds: [],
    email: "jamie@example.com",
    referenceCode: "HD-4F2A9C",
    category: ServiceCategory.fixIt,
    phone: "(555) 123-4567",
    ownParts: false,
    ...overrides,
  };
}

export function makeQuote(overrides: Partial<Quote> = {}): Quote {
  return {
    amount: 20_000n,
    note: "Includes parts and a two-hour visit.",
    sentAt: 1_700_000_100_000_000_000n,
    discountApplied: false,
    discountAmount: 0n,
    status: QuoteStatus.draft,
    lineItems: [],
    total: 20_000n,
    laborCharge: 0n,
    createdAt: 1_700_000_100_000_000_000n,
    quoteNumber: "Q-1001",
    workDescription: "Replace the kitchen faucet.",
    remainingBalance: 10_000n,
    materialsCharge: 0n,
    depositRequired: 10_000n,
    subtotal: 20_000n,
    ...overrides,
  };
}

export function makeDeposit(overrides: Partial<Deposit> = {}): Deposit {
  return {
    amount: 10_000n,
    method: PaymentMethod.stripe,
    paid: true,
    status: DepositStatus.verified,
    paidAt: 1_700_000_200_000_000_000n,
    ...overrides,
  };
}

export function makeAppointment(
  overrides: Partial<Appointment> = {},
): Appointment {
  return {
    confirmed: false,
    scheduledAt: 1_700_000_300_000_000_000n,
    ...overrides,
  };
}

export function makeReview(overrides: Partial<Review> = {}): Review {
  return {
    rating: 5n,
    comment: "They fixed the faucet and tightened the cabinet door.",
    createdAt: 1_700_000_400_000_000_000n,
    ...overrides,
  };
}

export function makeStats(
  overrides: Partial<DashboardStats> = {},
): DashboardStats {
  return {
    newRequests: 3n,
    upcomingAppointments: 2n,
    depositsCollected: 15_000n,
    activeJobs: 4n,
    reviewsCount: 1n,
    ...overrides,
  };
}

export function makeBee(overrides: Partial<BeeView> = {}): BeeView {
  return {
    id: 1n,
    name: "Beatrice",
    specialty: "Deep cleaning & organizing",
    createdAt: 1_700_000_000_000_000_000n,
    ...overrides,
  };
}

export function makeVisit(overrides: Partial<VisitRecord> = {}): VisitRecord {
  return {
    jobId: 1n,
    referenceCode: "HD-4F2A9C",
    service: ServiceCategory.fixIt,
    beeId: 1n,
    beeName: "Beatrice",
    completedAt: 1_700_000_400_000_000_000n,
    ...overrides,
  };
}

export function makePackage(
  overrides: Partial<PackageEnrollment> = {},
): PackageEnrollment {
  return {
    active: true,
    monthlyPrice: 19_900n,
    includedVisits: 4n,
    startedAt: 1_700_000_000_000_000_000n,
    ...overrides,
  };
}

/* ------------------------------------------------------------------ */
/* Customer management fixtures                                        */
/* ------------------------------------------------------------------ */

export function makeCustomerSummary(
  overrides: Partial<CustomerSummary> = {},
): CustomerSummary {
  return {
    id: 1n,
    status: CustomerStatus.active,
    serviceAddress: "123 Honeycomb Lane",
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    phone: "(555) 123-4567",
    jobCount: 1n,
    ...overrides,
  };
}

export function makeCustomerNote(
  overrides: Partial<CustomerNote> = {},
): CustomerNote {
  return {
    id: 1n,
    body: "Gate code is 4821.",
    createdAt: 1_700_000_000_000_000_000n,
    ...overrides,
  };
}

export function makeCustomerView(
  overrides: Partial<CustomerView> = {},
): CustomerView {
  return {
    id: 1n,
    status: CustomerStatus.active,
    serviceAddress: "123 Honeycomb Lane",
    createdAt: 1_700_000_000_000_000_000n,
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    preferredContact: PreferredContact.phone,
    notes: [],
    phone: "(555) 123-4567",
    adminNotes: "",
    ...overrides,
  };
}

export function makeCustomerProfile(
  overrides: Partial<CustomerProfileView> = {},
): CustomerProfileView {
  return {
    completedJobs: [],
    customer: makeCustomerView(),
    jobs: [],
    photoIds: [],
    appointments: [],
    cancelledJobs: [],
    deposits: [],
    pendingJobs: [],
    payments: [],
    messages: [],
    quotes: [],
    jobRecords: [],
    ...overrides,
  };
}

export function makeNotification(
  overrides: Partial<NotificationView> = {},
): NotificationView {
  return {
    id: 1n,
    title: "New request",
    body: "Ada Lovelace submitted a new request.",
    kind: NotificationKind.newCustomer,
    createdAt: 1_700_000_000_000_000_000n,
    read: false,
    ...overrides,
  };
}

export function makeMessage(overrides: Partial<MessageView> = {}): MessageView {
  return {
    id: 1n,
    body: "Could you come by Thursday morning instead?",
    createdAt: 1_700_000_000_000_000_000n,
    customerId: 1n,
    fromAdmin: false,
    ...overrides,
  };
}
