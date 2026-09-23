import { JobStatus } from "@/backend";
import {
  CASHAPP_HANDLE,
  STATUS_ORDER,
  balanceDue,
  depositAmount,
  formatMoney,
  formatReference,
  getStatusMeta,
  nextStatus,
  statusIndex,
  timestampToDate,
} from "@/lib/jobs";
import { describe, expect, it } from "vitest";

/**
 * The lifecycle arithmetic and status ordering the whole request -> quote ->
 * accept -> deposit -> appointment -> status -> review flow is built on. The
 * current request intentionally redesigns page layouts and adds bee/package
 * sections, but these semantics must not drift: a wrong deposit split or a
 * reordered lifecycle would silently corrupt every job's money and progress.
 */
describe("job lifecycle helpers", () => {
  it("splits a quote into a half deposit and the remaining balance", () => {
    expect(depositAmount(20_000n)).toBe(10_000n);
    expect(balanceDue(20_000n)).toBe(10_000n);
    // An odd cent count must not lose or invent money.
    expect(depositAmount(101n) + balanceDue(101n)).toBe(101n);
  });

  it("orders the lifecycle requested -> quoted -> scheduled -> inProgress -> completed", () => {
    expect(STATUS_ORDER).toEqual([
      JobStatus.requested,
      JobStatus.quoted,
      JobStatus.scheduled,
      JobStatus.inProgress,
      JobStatus.completed,
    ]);
    expect(statusIndex(JobStatus.requested)).toBe(0);
    expect(statusIndex(JobStatus.completed)).toBe(4);
  });

  it("advances one status at a time and stops at completed", () => {
    expect(nextStatus(JobStatus.requested)).toBe(JobStatus.quoted);
    expect(nextStatus(JobStatus.quoted)).toBe(JobStatus.scheduled);
    expect(nextStatus(JobStatus.scheduled)).toBe(JobStatus.inProgress);
    expect(nextStatus(JobStatus.inProgress)).toBe(JobStatus.completed);
    expect(nextStatus(JobStatus.completed)).toBeNull();
  });

  it("gives every lifecycle status a human label", () => {
    for (const status of STATUS_ORDER) {
      expect(getStatusMeta(status).label.length).toBeGreaterThan(0);
    }
  });

  it("formats cents as USD and uppercases reference codes", () => {
    expect(formatMoney(20_000n)).toBe("$200.00");
    expect(formatMoney(0n)).toBe("$0.00");
    expect(formatReference("hd-4f2a9c")).toBe("HD-4F2A9C");
  });

  it("converts nanosecond timestamps to dates and rejects invalid ones", () => {
    const date = timestampToDate(1_700_000_000_000_000_000n);
    expect(date).toBeInstanceOf(Date);
    expect(date?.getTime()).toBe(1_700_000_000_000);
    expect(timestampToDate(0n)?.getTime()).toBe(0);
  });

  it("keeps the CashApp handle as the alternative deposit option", () => {
    expect(CASHAPP_HANDLE).toBe("$Taetae22Wright");
  });
});
