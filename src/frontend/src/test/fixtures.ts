import type {
  Appointment,
  BeeView,
  DashboardStats,
  Deposit,
  JobRequestView,
  PackageEnrollment,
  Quote,
  Review,
  VisitRecord,
} from "@/backend";
import { JobStatus, PaymentMethod, ServiceCategory } from "@/backend";

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
    ...overrides,
  };
}

export function makeDeposit(overrides: Partial<Deposit> = {}): Deposit {
  return {
    amount: 10_000n,
    method: PaymentMethod.stripe,
    paid: true,
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
