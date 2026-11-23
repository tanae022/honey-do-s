import { JobStatus, QuoteStatus } from "@/backend";
import {
  CASHAPP_HANDLE,
  CHIME_HANDLE,
  DEPOSIT_OPTIONS,
  PAYPAL_ACCOUNT,
  STATUS_ORDER,
  VENMO_HANDLE,
  balanceDue,
  cashAppDepositUrl,
  depositAmount,
  formatMoney,
  formatReference,
  getQuoteStatusMeta,
  getStatusMeta,
  lineItemTotal,
  lineItemsSubtotal,
  nextStatus,
  quoteRemainingBalance,
  quoteTotal,
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
    expect(CASHAPP_HANDLE).toBe("$thebirdhouse2");
  });
});

/**
 * Characterization baseline for the quote arithmetic the auto-pricing rework
 * must not break.
 *
 * The request intentionally changes how a quote's final total, deposit and
 * remaining balance are derived (automatic discount/tax, a 10% deposit), so the
 * current 50% deposit split is deliberately NOT asserted here. What is pinned
 * is the adjacent arithmetic that must stay correct underneath the new
 * computation: line-item extended prices, the line-item subtotal, the stored
 * total with its legacy fallback, and the remaining-balance fallback.
 */
describe("quote arithmetic helpers survive the auto-pricing rework", () => {
  it("multiplies quantity by unit price for a line item", () => {
    expect(lineItemTotal({ quantity: 3n, unitPrice: 2_500n })).toBe(7_500n);
    expect(lineItemTotal({ quantity: 0n, unitPrice: 2_500n })).toBe(0n);
  });

  it("sums every line item's extended price into the subtotal", () => {
    expect(
      lineItemsSubtotal([
        { quantity: 2n, unitPrice: 5_000n },
        { quantity: 1n, unitPrice: 2_500n },
      ]),
    ).toBe(12_500n);
    expect(lineItemsSubtotal([])).toBe(0n);
  });

  it("reads the stored total and falls back to the legacy amount field", () => {
    expect(quoteTotal({ total: 25_000n, amount: 20_000n } as never)).toBe(
      25_000n,
    );
    // A legacy quote with no stored total still reports its amount.
    expect(quoteTotal({ total: 0n, amount: 20_000n } as never)).toBe(20_000n);
    expect(quoteTotal(null)).toBe(0n);
  });

  it("reads the stored remaining balance and falls back to total minus deposit", () => {
    expect(
      quoteRemainingBalance({
        total: 25_000n,
        amount: 25_000n,
        remainingBalance: 22_500n,
        depositRequired: 2_500n,
      } as never),
    ).toBe(22_500n);
    // With no stored balance, the helper derives total minus deposit.
    expect(
      quoteRemainingBalance({
        total: 25_000n,
        amount: 25_000n,
        remainingBalance: 0n,
        depositRequired: 2_500n,
      } as never),
    ).toBe(22_500n);
    expect(quoteRemainingBalance(null)).toBe(0n);
  });

  it("gives every quote approval status a human label", () => {
    for (const status of [
      QuoteStatus.draft,
      QuoteStatus.sent,
      QuoteStatus.approved,
      QuoteStatus.declined,
    ]) {
      expect(getQuoteStatusMeta(status).label.length).toBeGreaterThan(0);
    }
  });
});

/**
 * Characterization baseline for the owner-supplied payment handles.
 *
 * The owner is replacing the Cash App tag with a new business tag, so the
 * literal value of `CASHAPP_HANDLE` is intentionally changing and is NOT
 * asserted here. What must not drift is the surrounding contract: the deposit
 * deep link is built from the handle, the Cash App option's hardcoded deep link
 * stays consistent with the handle constant, and the other three owner-supplied
 * handles are untouched.
 */
describe("owner-supplied payment handles", () => {
  it("builds the Cash App deposit deep link from the handle and the dollar amount", () => {
    expect(cashAppDepositUrl(2_500n)).toBe(
      `https://cash.app/${CASHAPP_HANDLE}/25.00`,
    );
    expect(cashAppDepositUrl(10_000n)).toBe(
      `https://cash.app/${CASHAPP_HANDLE}/100.00`,
    );
    // A whole-dollar amount still renders two decimal places.
    expect(cashAppDepositUrl(5_000n)).toBe(
      `https://cash.app/${CASHAPP_HANDLE}/50.00`,
    );
  });

  it("keeps the Cash App option's deep link consistent with the handle constant", () => {
    const cashApp = DEPOSIT_OPTIONS.find((option) => option.id === "cashapp");
    expect(cashApp).toBeDefined();
    expect(cashApp?.handle).toBe(CASHAPP_HANDLE);
    // The hardcoded deep link must point at the same handle the card shows.
    expect(cashApp?.url).toBe(`https://cash.app/${CASHAPP_HANDLE}`);
  });

  it("leaves the Venmo, PayPal and Chime handles unchanged", () => {
    expect(VENMO_HANDLE).toBe("@Lavona-Wright");
    expect(PAYPAL_ACCOUNT).toBe("tanae Wright");
    expect(CHIME_HANDLE).toBe("$Tanae-Wright-2");
  });

  it("offers all four manual deposit options in display order", () => {
    expect(DEPOSIT_OPTIONS.map((option) => option.id)).toEqual([
      "cashapp",
      "venmo",
      "paypal",
      "chime",
    ]);
  });
});
