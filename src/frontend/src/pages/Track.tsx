import {
  type DepositStatus,
  type JobRequestView,
  PaymentMethod,
  type Quote,
  type QuoteView,
} from "@/backend";
import { BeeAccent } from "@/components/honey/BeeAccent";
import { HexStatus, HexStatusTimeline } from "@/components/honey/HexStatus";
import { HoneyButton } from "@/components/honey/HoneyButton";
import { HoneyCard, HoneyCardHeader } from "@/components/honey/HoneyCard";
import { HoneyLoader } from "@/components/honey/HoneyLoader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePaymentSummary, useSubmitDeposit } from "@/hooks/useAdminSettings";
import {
  useAcceptQuote,
  useConfirmAppointment,
  useCustomerMessages,
  useDeclineQuoteByReference,
  useJobByReference,
  usePostCustomerMessage,
  useQuoteByReference,
  useRecordDeposit,
  useSubmitReview,
  useVisitHistory,
} from "@/hooks/useJobs";
import {
  DEPOSIT_OPTIONS,
  type DepositOption,
  PACKAGE_BILLING_NOTE,
  balanceDue,
  depositAmount,
  depositMethodLabel,
  formatDateTime,
  formatMoney,
  formatReference,
  formatVisitDate,
  getDepositStatusMeta,
  getQuoteStatusMeta,
  getStatusMeta,
  hasQuoteDiscount,
  isDepositRejected,
  isDepositSubmitted,
  isDepositVerified,
  isPackageActive,
  isQuoteExpired,
  isQuoteViewExpired,
  lineItemTotal,
  packageStartedLabel,
  packageVisitsLabel,
  quoteExpiresLabel,
  quoteRemainingBalance,
  quoteTotal,
  quoteViewToQuote,
  sortVisitsNewestFirst,
  statusIndex,
  visitBeeName,
  visitServiceLabel,
} from "@/lib/jobs";
import { getService } from "@/lib/services";
import { cn } from "@/lib/utils";
import {
  CalendarCheck,
  Check,
  Copy,
  ExternalLink,
  History,
  MessageSquare,
  Send,
  Star,
  ThumbsDown,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

/** The action an emailed quote link can request. */
type QuoteAction = "accept" | "decline";

/**
 * Read the emailed link's `reference` and `action` from the URL query string.
 *
 * Read straight from `window.location.search` rather than the router's search
 * state so the emailed link works on the plain `/track` route without a
 * `validateSearch` contract, and so the reference-code entry keeps working
 * exactly as before.
 */
function readQuoteLink(): {
  reference: string;
  action: QuoteAction | null;
} {
  if (typeof window === "undefined") return { reference: "", action: null };
  const params = new URLSearchParams(window.location.search);
  const reference = (params.get("reference") ?? "").trim();
  const rawAction = params.get("action") ?? "";
  const action: QuoteAction | null =
    rawAction === "accept" || rawAction === "decline" ? rawAction : null;
  return { reference, action };
}

export function TrackPage() {
  const link = useMemo(() => readQuoteLink(), []);

  const [reference, setReference] = useState(link.reference);
  const [submitted, setSubmitted] = useState(link.reference);

  // An emailed link opens the quote directly: seed the lookup from the URL and
  // keep the manual reference-code entry working exactly as before.
  useEffect(() => {
    if (link.reference.length === 0) return;
    setReference(link.reference);
    setSubmitted(link.reference);
  }, [link.reference]);

  const jobQuery = useJobByReference(submitted);
  const quoteQuery = useQuoteByReference(submitted);

  return (
    <div className="animate-page-enter px-5 py-10 sm:px-8 md:py-14">
      <div className="mx-auto w-full max-w-3xl">
        <header className="mb-8 text-center">
          <BeeAccent className="mx-auto h-8 w-11" />
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Track your Honey Do
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground md:text-base">
            Enter the reference code from your request to see its progress.
          </p>
        </header>

        <HoneyCard>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSubmitted(reference.trim());
            }}
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <Label htmlFor="reference">Reference code</Label>
              <Input
                id="reference"
                data-ocid="track.reference_input"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
                placeholder="HD-4F2A9C"
                className="mt-2 min-h-12 font-mono uppercase tracking-[0.14em]"
              />
            </div>
            <HoneyButton
              type="submit"
              data-ocid="track.lookup_button"
              disabled={reference.trim().length === 0}
              className="w-full sm:w-auto"
            >
              Find my job
            </HoneyButton>
          </form>
        </HoneyCard>

        <div className="mt-6">
          {submitted.length === 0 && (
            <HoneyCard className="text-center">
              <p className="text-sm text-muted-foreground">
                Your reference code looks like{" "}
                <span className="font-mono font-semibold text-primary">
                  HD-4F2A9C
                </span>
                . It was shown when you submitted your request.
              </p>
            </HoneyCard>
          )}

          {submitted.length > 0 && jobQuery.isLoading && (
            <HoneyCard>
              <HoneyLoader
                data-ocid="track.loading_state"
                label="Finding your job"
              />
            </HoneyCard>
          )}

          {submitted.length > 0 && jobQuery.isError && (
            <HoneyCard>
              <p
                data-ocid="track.error_state"
                className="text-center text-sm text-destructive"
              >
                Something went wrong looking up that code. Please try again.
              </p>
            </HoneyCard>
          )}

          {submitted.length > 0 &&
            !jobQuery.isLoading &&
            !jobQuery.isError &&
            !jobQuery.data && (
              <HoneyCard className="text-center">
                <p
                  data-ocid="track.empty_state"
                  className="text-sm text-muted-foreground"
                >
                  We couldn&apos;t find a job with that code. Double-check the
                  letters and numbers, then try again.
                </p>
              </HoneyCard>
            )}

          {jobQuery.data && (
            <JobDetail
              job={jobQuery.data}
              requestedAction={link.action}
              emailedQuote={quoteQuery.data ?? null}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function JobDetail({
  job,
  requestedAction,
  emailedQuote,
}: {
  job: JobRequestView;
  requestedAction: QuoteAction | null;
  emailedQuote: QuoteView | null;
}) {
  const service = getService(job.category);
  const status = getStatusMeta(job.status);
  const acceptQuote = useAcceptQuote();
  const declineQuote = useDeclineQuoteByReference();
  const confirmAppointment = useConfirmAppointment();
  const recordDeposit = useRecordDeposit();
  const submitDeposit = useSubmitDeposit();
  const submitReview = useSubmitReview();
  const visitsQuery = useVisitHistory(job.referenceCode);
  const paymentQuery = usePaymentSummary(job.referenceCode);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    DEPOSIT_OPTIONS[0].id,
  );
  const [celebrating, setCelebrating] = useState(false);
  const [linkActionError, setLinkActionError] = useState<string | null>(null);
  const [linkActionDone, setLinkActionDone] = useState<QuoteAction | null>(
    null,
  );

  /**
   * The quote to render. The job view embeds the quote record; the emailed
   * link's `getQuoteByReference` reads the same record, so it is used as a
   * fallback to guarantee the emailed quote always renders even if the job
   * view's embedded quote is momentarily absent.
   */
  const quote: Quote | null =
    job.quote ?? (emailedQuote ? quoteViewToQuote(emailedQuote) : null);
  /**
   * The emailed link's `getQuoteByReference` carries the backend's own
   * `expired` flag, so honor it when present; otherwise fall back to the
   * client-side expiration check on the quote's `expiresAt`.
   */
  const quoteExpired = emailedQuote
    ? isQuoteViewExpired(emailedQuote)
    : quote
      ? isQuoteExpired(quote)
      : false;

  const quoteAccepted = job.status !== "quoted";
  const canAcceptQuote = !!quote && job.status === "quoted" && !quoteExpired;
  const canReview = job.status === "completed" && !job.review;
  const isCompleted = job.status === "completed";

  /**
   * The customer-facing payment summary is the authoritative payment page: it
   * carries the original amount, discount, final total, the 10% deposit and the
   * remaining balance computed by the backend pricing engine, plus the accepted
   * payment methods and the current deposit state. The job view's embedded
   * quote is the fallback while the summary loads.
   */
  const summary = paymentQuery.data ?? null;
  const depositStatus = summary?.depositStatus ?? job.deposit?.status;
  const depositVerified = isDepositVerified(depositStatus);
  const depositSubmitted = isDepositSubmitted(depositStatus);
  const depositRejected = isDepositRejected(depositStatus);

  const deposit = summary
    ? summary.depositAmount
    : quote
      ? depositAmount(quoteTotal(quote))
      : 0n;
  const balance = summary
    ? summary.remainingBalance
    : quote
      ? balanceDue(quoteTotal(quote))
      : 0n;

  /**
   * The deposit percentage actually charged, derived from the backend's own
   * deposit and final total so the label always matches the amount shown. The
   * backend configures the percentage (10% by default); the customer never
   * calculates it.
   */
  const finalTotal = summary?.finalTotal ?? (quote ? quoteTotal(quote) : 0n);
  const depositPercentLabel =
    finalTotal > 0n
      ? `${Math.round((Number(deposit) * 100) / Number(finalTotal))}%`
      : "10%";

  /**
   * The customer can submit a deposit once the quote is accepted and the
   * deposit is not already verified or awaiting verification. A rejected
   * deposit returns to this state so the customer can resubmit it.
   */
  const canPayDeposit =
    !!quote &&
    job.status !== "quoted" &&
    !depositVerified &&
    !depositSubmitted &&
    !job.deposit?.paid;

  const packageActive = isPackageActive(job.packageEnrollment);
  const packageVisits = packageVisitsLabel(job.packageEnrollment);
  const packageStarted = packageStartedLabel(job.packageEnrollment);

  const visits = sortVisitsNewestFirst(visitsQuery.data ?? []);

  const selectedOption =
    DEPOSIT_OPTIONS.find((option) => option.id === selectedOptionId) ??
    DEPOSIT_OPTIONS[0];

  /**
   * Every manual option records through the same backend `recordDeposit` path
   * with the `cashApp` variant — the deposit is a single manual payment the
   * owner verifies, and the provider only changes where the customer sends the
   * money, never the amount. The UI names the selected provider so the
   * customer's choice is reflected accurately.
   */
  const selectedMethod = PaymentMethod.cashApp;

  /**
   * Perform the action an emailed link requested, exactly once.
   *
   * The link carries `action=accept|decline`; the customer should not have to
   * tap again. An expired quote can never be accepted, so the accept action is
   * refused with a clear message instead of calling the backend.
   */
  useEffect(() => {
    if (!requestedAction || linkActionDone || linkActionError) return;
    if (!quote) return;
    if (requestedAction === "accept") {
      if (job.status !== "quoted") {
        setLinkActionDone("accept");
        return;
      }
      if (quoteExpired) {
        setLinkActionError(
          "This quote has expired and can no longer be accepted.",
        );
        return;
      }
      acceptQuote.mutate(job.referenceCode, {
        onSuccess: (result) => {
          if (result.__kind__ === "err") {
            setLinkActionError(describeQuoteError(result.err));
            return;
          }
          setLinkActionDone("accept");
          setCelebrating(true);
        },
        onError: () =>
          setLinkActionError(
            "We couldn't accept this quote. Please try again.",
          ),
      });
      return;
    }
    if (quote.status === "declined") {
      setLinkActionDone("decline");
      return;
    }
    declineQuote.mutate(job.referenceCode, {
      onSuccess: (result) => {
        if (result.__kind__ === "err") {
          setLinkActionError(describeQuoteError(result.err));
          return;
        }
        setLinkActionDone("decline");
      },
      onError: () =>
        setLinkActionError("We couldn't decline this quote. Please try again."),
    });
  }, [
    requestedAction,
    linkActionDone,
    linkActionError,
    quote,
    quoteExpired,
    job.status,
    job.referenceCode,
    acceptQuote,
    declineQuote,
  ]);

  const copyHandle = async (option: DepositOption) => {
    try {
      await navigator.clipboard.writeText(option.handle);
      setCopiedId(option.id);
      window.setTimeout(
        () =>
          setCopiedId((current) => (current === option.id ? null : current)),
        2000,
      );
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <div className="space-y-5">
      {celebrating && <BeeSwarmCelebration />}

      {requestedAction && (
        <HoneyCard data-ocid="track.link_action_banner">
          {linkActionError ? (
            <p
              data-ocid="track.link_action_error"
              className="text-sm font-semibold text-destructive"
            >
              {linkActionError}
            </p>
          ) : linkActionDone === "accept" ? (
            <p
              data-ocid="track.link_action_success"
              className="inline-flex items-center gap-2 text-sm font-semibold text-success"
            >
              <Check className="size-4" />
              Quote accepted — thank you. We&apos;ll be in touch to schedule.
            </p>
          ) : linkActionDone === "decline" ? (
            <p
              data-ocid="track.link_action_success"
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"
            >
              <ThumbsDown className="size-4" />
              Quote declined. Thanks for letting us know.
            </p>
          ) : (
            <HoneyLoader
              data-ocid="track.link_action_loading"
              label={
                requestedAction === "accept"
                  ? "Accepting your quote"
                  : "Declining your quote"
              }
            />
          )}
        </HoneyCard>
      )}

      <HoneyCard data-ocid="track.job_card">
        <HoneyCardHeader
          title={service.label}
          description={`Reference ${formatReference(job.referenceCode)}`}
          action={
            <HexStatus
              data-ocid="track.status_chip"
              label={status.label}
              toneClass={status.chipClass}
            />
          }
        />
        <p className="text-sm text-muted-foreground">{status.description}</p>

        <div className="mt-6">
          <HexStatusTimeline
            data-ocid="track.status_timeline"
            steps={[
              "Requested",
              "Quoted",
              "Scheduled",
              "In Progress",
              "Completed",
            ]}
            currentIndex={Math.max(statusIndex(job.status), 0)}
          />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Detail label="Requested" value={formatDateTime(job.createdAt)} />
          <Detail label="Preferred timing" value={job.preferredTiming} />
          <Detail
            label="Contact"
            value={`${job.customerName} · ${job.phone}`}
          />
          <Detail label="Email" value={job.email} />
        </dl>

        <div className="mt-5 rounded-xl border border-border/70 bg-muted/30 p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Your description
          </span>
          <p className="mt-2 text-sm text-foreground">{job.description}</p>
        </div>
      </HoneyCard>

      {job.assignedBeeName && (
        <HoneyCard data-ocid="track.assigned_bee_card">
          <HoneyCardHeader
            title="Your bee"
            description="The Honey Do's bee handling this visit."
          />
          <div className="flex items-center gap-4">
            <span className="relative flex size-16 shrink-0 items-center justify-center">
              <span
                aria-hidden="true"
                className="hex-clip absolute inset-0 bg-gradient-to-b from-primary/45 to-primary/10"
              />
              <BeeAccent
                className="relative z-10 h-9 w-12"
                motion="hover"
                label={`${job.assignedBeeName}, your assigned bee`}
              />
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold text-foreground">
                {job.assignedBeeName}
              </p>
              <p className="text-sm text-muted-foreground">
                Assigned to your {service.label.toLowerCase()} visit.
              </p>
            </div>
          </div>
        </HoneyCard>
      )}

      {job.packageEnrollment && (
        <HoneyCard data-ocid="track.package_card">
          <HoneyCardHeader
            title="Monthly package"
            description={
              packageActive
                ? "Your hive membership is active."
                : "Your hive membership is paused."
            }
            action={
              <HexStatus
                data-ocid="track.package_status_chip"
                label={packageActive ? "Active" : "Paused"}
                toneClass={
                  packageActive
                    ? "border-success/60 bg-success/15 text-success"
                    : "border-warning/60 bg-warning/15 text-warning"
                }
              />
            }
          />
          <dl className="grid gap-4 sm:grid-cols-2">
            {packageVisits && <Detail label="Included" value={packageVisits} />}
            {packageStarted && (
              <Detail label="Started" value={packageStarted} />
            )}
          </dl>
          <p className="mt-4 text-xs text-muted-foreground">
            Your monthly rate is set with the owner. {PACKAGE_BILLING_NOTE}
          </p>
        </HoneyCard>
      )}

      {quote && (
        <QuotePanel
          quote={quote}
          canAccept={canAcceptQuote}
          accepted={quoteAccepted && !canAcceptQuote}
          expired={quoteExpired}
          accepting={acceptQuote.isPending}
          declining={declineQuote.isPending}
          onAccept={() =>
            acceptQuote.mutate(job.referenceCode, {
              onSuccess: () => setCelebrating(true),
            })
          }
          onDecline={() => declineQuote.mutate(job.referenceCode)}
        />
      )}

      {quote && (
        <HoneyCard data-ocid="track.payment_breakdown_card">
          <HoneyCardHeader
            title="Deposit & balance"
            description="Your final quote, the deposit to secure your spot, and the balance due on completion."
          />
          <dl className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted-foreground">Original amount</dt>
              <dd className="font-mono text-sm font-semibold text-foreground">
                {formatMoney(summary?.originalSubtotal ?? quote.subtotal)}
              </dd>
            </div>
            {hasQuoteDiscount(quote) && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-muted-foreground">
                  Discount
                  {summary?.discountReason
                    ? ` — ${summary.discountReason}`
                    : ""}
                </dt>
                <dd className="font-mono text-sm font-semibold text-success">
                  −
                  {formatMoney(summary?.discountAmount ?? quote.discountAmount)}
                </dd>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-3">
              <dt className="text-sm font-semibold text-foreground">
                Final quote
              </dt>
              <dd className="font-mono text-2xl font-bold text-gold-gradient">
                {formatMoney(summary?.finalTotal ?? quoteTotal(quote))}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted-foreground">
                Deposit ({depositPercentLabel})
              </dt>
              <dd className="font-mono text-sm font-semibold text-foreground">
                {formatMoney(deposit)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted-foreground">Balance due</dt>
              <dd className="font-mono text-sm font-semibold text-foreground">
                {formatMoney(balance)}
              </dd>
            </div>
          </dl>
          <div className="mt-4">
            <DepositStatusLine
              status={depositStatus}
              amount={deposit}
              method={summary?.depositMethod ?? job.deposit?.method}
            />
          </div>
        </HoneyCard>
      )}

      {job.appointment && (
        <HoneyCard data-ocid="track.appointment_card">
          <HoneyCardHeader
            title="Appointment"
            description={formatDateTime(job.appointment.scheduledAt)}
            action={
              <span className="relative flex size-11 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="hex-clip absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10"
                />
                <CalendarCheck className="relative z-10 size-5 text-primary" />
              </span>
            }
          />
          <div className="mb-4 flex items-center gap-3">
            <BeeAccent className="h-6 w-8" motion="drift" />
            <p className="text-sm text-muted-foreground">
              Your slot is reserved on the hive calendar.
            </p>
          </div>
          {job.appointment.confirmed ? (
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-success">
              <Check className="size-4" />
              Appointment confirmed
            </p>
          ) : (
            <HoneyButton
              data-ocid="track.confirm_appointment_button"
              disabled={confirmAppointment.isPending}
              onClick={() => confirmAppointment.mutate(job.referenceCode)}
              className="w-full sm:w-auto"
            >
              {confirmAppointment.isPending ? (
                "Confirming…"
              ) : (
                <>
                  <BeeAccent className="h-4 w-6" />
                  CONFIRM APPOINTMENT
                </>
              )}
            </HoneyButton>
          )}
        </HoneyCard>
      )}

      {canPayDeposit && quote && (
        <HoneyCard data-ocid="track.deposit_card">
          <HoneyCardHeader
            title="Pay your deposit"
            description="Send the deposit to secure your spot, then tell us you've paid."
          />

          <div className="rounded-xl border border-primary/50 bg-primary/10 p-4 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Exact amount to pay
            </span>
            <p className="mt-1 font-mono text-3xl font-bold text-gold-gradient">
              {formatMoney(deposit)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {depositPercentLabel} deposit of your {formatMoney(finalTotal)}{" "}
              final quote
            </p>
          </div>

          {depositRejected && (
            <p
              data-ocid="track.deposit_rejected_notice"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-destructive/50 bg-destructive/15 px-4 py-3 text-sm font-semibold text-destructive"
            >
              <ThumbsDown className="size-4 shrink-0" />
              We couldn&apos;t find your last deposit. Please resubmit it with
              the correct details below.
            </p>
          )}

          <p className="mt-4 text-sm text-muted-foreground">
            Pick where you&apos;d like to send it, copy the handle, then tap
            &ldquo;I&apos;ve sent it&rdquo; so we can verify it.
          </p>

          <div
            data-ocid="track.deposit_options"
            className="mt-4 grid gap-3 sm:grid-cols-2"
          >
            {DEPOSIT_OPTIONS.map((option) => {
              const selected = option.id === selectedOption.id;
              return (
                <div
                  key={option.id}
                  data-ocid={`track.deposit_option.${option.id}`}
                  className={`flex flex-col gap-2 rounded-xl border p-4 transition-smooth ${
                    selected
                      ? "border-primary/60 bg-primary/15 shadow-honey"
                      : "border-border/70 bg-muted/30 hover:border-primary/40"
                  }`}
                >
                  <button
                    type="button"
                    data-ocid={`track.deposit_select_button.${option.id}`}
                    aria-pressed={selected}
                    onClick={() => setSelectedOptionId(option.id)}
                    className="flex min-h-8 w-full items-center justify-between gap-2 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="font-display text-base font-semibold text-foreground">
                      {option.label}
                    </span>
                    {selected && (
                      <Check className="size-4 shrink-0 text-primary" />
                    )}
                  </button>
                  <span className="inline-flex items-center gap-2">
                    <span className="min-w-0 truncate font-mono text-sm font-semibold text-primary">
                      {option.handle}
                    </span>
                    <button
                      type="button"
                      data-ocid={`track.deposit_copy_button.${option.id}`}
                      aria-label={`Copy ${option.label} handle`}
                      onClick={() => void copyHandle(option)}
                      className="shrink-0 rounded-full p-1.5 transition-smooth hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {copiedId === option.id ? (
                        <Check className="size-4" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </button>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-primary/40 bg-primary/10 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Pay by {selectedOption.label}
            </span>
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedOption.hint} Send {formatMoney(deposit)}, then tap
              &ldquo;I&apos;ve sent it&rdquo;.
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              {selectedOption.url && (
                <a
                  href={selectedOption.url}
                  target="_blank"
                  rel="noreferrer"
                  data-ocid={`track.deposit_open_link.${selectedOption.id}`}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/45 bg-secondary/60 px-6 text-base font-semibold text-foreground transition-smooth hover:border-primary/70 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ExternalLink className="size-4" />
                  Open {selectedOption.label}
                </a>
              )}
              <HoneyButton
                data-ocid="track.deposit_sent_button"
                disabled={recordDeposit.isPending || submitDeposit.isPending}
                onClick={() =>
                  recordDeposit.mutate({
                    referenceCode: job.referenceCode,
                    method: selectedMethod,
                  })
                }
                className="w-full sm:w-auto"
              >
                {recordDeposit.isPending ? "Submitting…" : "I've sent it"}
              </HoneyButton>
              <HoneyButton
                variant="secondary"
                data-ocid="track.deposit_paid_button"
                disabled={recordDeposit.isPending || submitDeposit.isPending}
                onClick={() =>
                  submitDeposit.mutate({
                    referenceCode: job.referenceCode,
                    method: selectedMethod,
                  })
                }
                className="w-full sm:w-auto"
              >
                {submitDeposit.isPending
                  ? "Submitting…"
                  : "I've paid my deposit"}
              </HoneyButton>
            </div>
            {(recordDeposit.isError || submitDeposit.isError) && (
              <p
                data-ocid="track.deposit_error"
                className="mt-3 text-sm font-semibold text-destructive"
              >
                We couldn&apos;t submit your deposit. Please try again.
              </p>
            )}
            {(recordDeposit.isSuccess || submitDeposit.isSuccess) && (
              <p
                data-ocid="track.deposit_recorded"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-success"
              >
                <Check className="size-4" />
                We&apos;ll confirm your {selectedOption.label} deposit shortly.
              </p>
            )}
          </div>
        </HoneyCard>
      )}

      {depositSubmitted && (
        <HoneyCard data-ocid="track.deposit_verifying_card">
          <HoneyCardHeader
            title="Deposit submitted — verifying"
            description="We have your deposit and are checking it now."
            action={
              <HexStatus
                data-ocid="track.deposit_verifying_chip"
                label="Verifying"
                toneClass="border-accent/60 bg-accent/15 text-accent"
              />
            }
          />
          <p className="text-sm text-muted-foreground">
            We&apos;ll confirm your {formatMoney(deposit)} deposit
            {depositMethodLabel(summary?.depositMethod ?? job.deposit?.method)
              ? ` sent via ${depositMethodLabel(
                  summary?.depositMethod ?? job.deposit?.method,
                )}`
              : ""}{" "}
            shortly. You&apos;ll be notified as soon as it clears.
          </p>
        </HoneyCard>
      )}

      <CustomerMessageThread referenceCode={job.referenceCode} />

      <HoneyCard data-ocid="track.visit_history_card">
        <HoneyCardHeader
          title="Past visits"
          description="Every Honey Do's visit to your home, newest first."
          action={
            <span className="relative flex size-11 items-center justify-center">
              <span
                aria-hidden="true"
                className="hex-clip absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10"
              />
              <History className="relative z-10 size-5 text-primary" />
            </span>
          }
        />

        {visitsQuery.isLoading && (
          <HoneyLoader
            data-ocid="track.visit_history_loading"
            label="Loading your visits"
          />
        )}

        {!visitsQuery.isLoading && visitsQuery.isError && (
          <p
            data-ocid="track.visit_history_error"
            className="text-sm text-destructive"
          >
            We couldn&apos;t load your visit history. Please try again.
          </p>
        )}

        {!visitsQuery.isLoading &&
          !visitsQuery.isError &&
          visits.length === 0 && (
            <p
              data-ocid="track.visit_history_empty"
              className="text-sm text-muted-foreground"
            >
              No completed visits yet. Once your first Honey Do is finished, it
              will show up here.
            </p>
          )}

        {visits.length > 0 && (
          <ul data-ocid="track.visit_history_list" className="space-y-3">
            {visits.map((visit, index) => (
              <li
                key={`${visit.jobId.toString()}-${visit.completedAt.toString()}`}
                data-ocid={`track.visit_history_item.${index + 1}`}
                className="flex items-center gap-4 rounded-xl border border-border/70 bg-muted/30 p-4"
              >
                <span className="relative flex size-12 shrink-0 items-center justify-center">
                  <span
                    aria-hidden="true"
                    className="hex-clip absolute inset-0 bg-gradient-to-b from-primary/40 to-primary/10"
                  />
                  <BeeAccent className="relative z-10 h-7 w-9" motion="hover" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base font-semibold text-foreground">
                    {visitServiceLabel(visit)}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {visitBeeName(visit)}
                  </p>
                </div>
                <span className="shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {formatVisitDate(visit)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </HoneyCard>

      {job.review && (
        <HoneyCard data-ocid="track.review_card">
          <HoneyCardHeader title="Your review" />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={
                  value <= Number(job.review?.rating)
                    ? "size-5 fill-primary text-primary"
                    : "size-5 text-muted-foreground"
                }
              />
            ))}
          </div>
          {job.review.comment && (
            <p className="mt-3 text-sm text-muted-foreground">
              {job.review.comment}
            </p>
          )}
        </HoneyCard>
      )}

      {isCompleted && (
        <HoneyCard
          data-ocid="track.completed_accent"
          className="flex items-center gap-4"
        >
          <span className="relative flex size-14 shrink-0 items-center justify-center">
            <span
              aria-hidden="true"
              className="hex-clip absolute inset-0 bg-gradient-to-b from-success/40 to-success/10"
            />
            <BeeAccent className="relative z-10 h-8 w-11" motion="hover" />
            <span
              aria-hidden="true"
              className="hex-clip absolute -bottom-1 right-0 size-3 bg-gradient-to-b from-accent to-primary shadow-honey"
            />
          </span>
          <div className="min-w-0">
            <p className="font-display text-base font-semibold text-foreground">
              Job complete
            </p>
            <p className="text-sm text-muted-foreground">
              Your Honey Do is finished — thank you for letting us help.
            </p>
          </div>
        </HoneyCard>
      )}

      {canReview && (
        <HoneyCard data-ocid="track.review_form">
          <HoneyCardHeader
            title="How did we do?"
            description="Your feedback helps us keep the hive buzzing."
          />
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                data-ocid={`track.rating_button.${value}`}
                aria-label={`Rate ${value} out of 5`}
                aria-pressed={rating === value}
                onClick={() => setRating(value)}
                className="rounded-full p-1 transition-smooth hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Star
                  className={
                    value <= rating
                      ? "size-7 fill-primary text-primary"
                      : "size-7 text-muted-foreground"
                  }
                />
              </button>
            ))}
          </div>
          <div className="mt-4">
            <Label htmlFor="review-comment">Leave a comment</Label>
            <Textarea
              id="review-comment"
              data-ocid="track.review_input"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="They fixed the faucet and even tightened the cabinet door."
              className="mt-2 min-h-24"
            />
          </div>
          <HoneyButton
            data-ocid="track.submit_review_button"
            disabled={submitReview.isPending}
            onClick={() =>
              submitReview.mutate(
                {
                  referenceCode: job.referenceCode,
                  rating: BigInt(rating),
                  comment: comment.trim(),
                },
                { onSuccess: () => setComment("") },
              )
            }
            className="mt-4 w-full sm:w-auto"
          >
            {submitReview.isPending ? "Sending…" : "Submit review"}
          </HoneyButton>
        </HoneyCard>
      )}
    </div>
  );
}

/**
 * The customer-facing itemized quote.
 *
 * Presents the full quote the way a professional estimate reads: a header with
 * the quote number, status and sent date; the work description; an itemized
 * line-item breakdown; labor and materials; the subtotal, any own-parts
 * discount and the final total; the deposit and remaining balance; and the
 * expiration. Built phone-first — every row stacks and wraps so nothing
 * overflows a narrow viewport, and numeric values stay right-aligned.
 */
function QuotePanel({
  quote,
  canAccept,
  accepted,
  expired,
  accepting,
  declining,
  onAccept,
  onDecline,
}: {
  quote: Quote;
  canAccept: boolean;
  accepted: boolean;
  expired: boolean;
  accepting: boolean;
  declining: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const status = getQuoteStatusMeta(quote.status);
  const total = quoteTotal(quote);
  const remaining = quoteRemainingBalance(quote);
  const discount = hasQuoteDiscount(quote);
  const expiresLabel = quoteExpiresLabel(quote);
  const hasLineItems = quote.lineItems.length > 0;

  return (
    <HoneyCard data-ocid="track.quote_card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-outline-black-strong font-display text-xl font-bold text-foreground">
            Your quote
          </h3>
          <p className="text-outline-black mt-1 text-sm text-muted-foreground">
            {quote.quoteNumber
              ? quote.sentAt > 0n
                ? `Quote ${quote.quoteNumber} · Sent ${formatDateTime(quote.sentAt)}`
                : `Quote ${quote.quoteNumber}`
              : quote.sentAt > 0n
                ? `Sent ${formatDateTime(quote.sentAt)}`
                : "Your itemized quote"}
          </p>
        </div>
        <HexStatus
          data-ocid="track.quote_status_chip"
          label={status.label}
          toneClass={status.chipClass}
        />
      </div>

      {quote.workDescription && (
        <div className="mt-5 rounded-xl border border-border/70 bg-muted/30 p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Work description
          </span>
          <p className="mt-2 text-sm text-foreground">
            {quote.workDescription}
          </p>
        </div>
      )}

      {hasLineItems && (
        <div className="mt-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Line items
          </span>
          <ul
            data-ocid="track.quote_line_items"
            className="mt-3 divide-y divide-border/60 overflow-hidden rounded-xl border border-border/70"
          >
            {quote.lineItems.map((item, index) => (
              <li
                key={`${item.description}-${index}`}
                data-ocid={`track.quote_line_item.${index + 1}`}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 bg-muted/20 px-4 py-3"
              >
                <span className="min-w-0 flex-1 break-words text-sm font-medium text-foreground">
                  {item.description}
                </span>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {item.quantity.toString()} × {formatMoney(item.unitPrice)}
                </span>
                <span className="shrink-0 font-mono text-sm font-semibold text-foreground">
                  {formatMoney(lineItemTotal(item))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <dl className="mt-5 space-y-3">
        {quote.laborCharge > 0n && (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-muted-foreground">Labor</dt>
            <dd className="font-mono text-sm font-semibold text-foreground">
              {formatMoney(quote.laborCharge)}
            </dd>
          </div>
        )}
        {quote.materialsCharge > 0n && (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-muted-foreground">Materials</dt>
            <dd className="font-mono text-sm font-semibold text-foreground">
              {formatMoney(quote.materialsCharge)}
            </dd>
          </div>
        )}
        <div className="flex items-center justify-between gap-4">
          <dt className="text-sm text-muted-foreground">Subtotal</dt>
          <dd className="font-mono text-sm font-semibold text-foreground">
            {formatMoney(quote.subtotal)}
          </dd>
        </div>
        {discount && (
          <div className="flex items-center justify-between gap-4">
            <dt className="text-sm text-muted-foreground">
              Own parts/supplies discount (10%)
            </dt>
            <dd className="font-mono text-sm font-semibold text-success">
              −{formatMoney(quote.discountAmount)}
            </dd>
          </div>
        )}
        <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-3">
          <dt className="text-sm font-semibold text-foreground">Total</dt>
          <dd className="font-mono text-2xl font-bold text-gold-gradient">
            {formatMoney(total)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-primary/40 bg-primary/10 p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Deposit required
          </span>
          <p className="mt-1 font-mono text-lg font-bold text-foreground">
            {formatMoney(quote.depositRequired)}
          </p>
        </div>
        <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Remaining balance
          </span>
          <p className="mt-1 font-mono text-lg font-bold text-foreground">
            {formatMoney(remaining)}
          </p>
        </div>
      </div>

      {expiresLabel && (
        <p
          data-ocid="track.quote_expiration"
          className={cn(
            "mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
            expired
              ? "border-destructive/50 bg-destructive/15 text-destructive"
              : "border-border/70 bg-muted/40 text-muted-foreground",
          )}
        >
          <CalendarCheck className="size-3.5" aria-hidden="true" />
          {expired ? "Expired" : expiresLabel}
        </p>
      )}

      {quote.note && (
        <p className="mt-4 text-sm text-muted-foreground">{quote.note}</p>
      )}

      {canAccept && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <HoneyButton
            data-ocid="track.accept_quote_button"
            disabled={accepting || declining}
            onClick={onAccept}
            className="w-full sm:w-auto"
          >
            {accepting ? "Accepting…" : "🍯 ACCEPT QUOTE"}
          </HoneyButton>
          <HoneyButton
            variant="secondary"
            data-ocid="track.decline_quote_button"
            disabled={accepting || declining}
            onClick={onDecline}
            className="w-full sm:w-auto"
          >
            <ThumbsDown className="size-4" />
            {declining ? "Declining…" : "Decline quote"}
          </HoneyButton>
        </div>
      )}
      {expired && !accepted && (
        <p
          data-ocid="track.quote_expired_notice"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-destructive"
        >
          <CalendarCheck className="size-4" aria-hidden="true" />
          This quote has expired and can no longer be accepted.
        </p>
      )}
      {accepted && (
        <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-success">
          <Check className="size-4" />
          Quote accepted
        </p>
      )}
      {quote.status === "declined" && (
        <p
          data-ocid="track.quote_declined_notice"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"
        >
          <ThumbsDown className="size-4" />
          Quote declined
        </p>
      )}
    </HoneyCard>
  );
}

/**
 * The customer's own message thread for the tracked job.
 *
 * Loads the exchange tied to this reference code and lets the customer post a
 * new message. The backend scopes the thread to the reference code, so a
 * customer only ever sees their own conversation with the administrator.
 */
function CustomerMessageThread({ referenceCode }: { referenceCode: string }) {
  const messagesQuery = useCustomerMessages(referenceCode);
  const postMessage = usePostCustomerMessage();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  const messages = useMemo(() => {
    const list = messagesQuery.data ?? [];
    return [...list].sort((a, b) =>
      a.createdAt === b.createdAt ? 0 : a.createdAt > b.createdAt ? 1 : -1,
    );
  }, [messagesQuery.data]);

  const handleSend = () => {
    const next = body.trim();
    if (next.length === 0) {
      setError("Write a message before sending.");
      return;
    }
    setError(null);
    setBody("");
    postMessage.mutate(
      { referenceCode, body: next },
      {
        onSuccess: (result) => {
          if (result.__kind__ === "err") {
            setError(
              result.err.__kind__ === "notAuthorized"
                ? "We couldn't verify this job. Re-enter your reference code and try again."
                : "We couldn't find that job. Double-check your reference code.",
            );
            setBody((current) => (current === "" ? next : current));
          }
        },
        onError: () => {
          setError("We couldn't send that message. Please try again.");
          setBody((current) => (current === "" ? next : current));
        },
      },
    );
  };

  return (
    <HoneyCard data-ocid="track.messages_card">
      <HoneyCardHeader
        title="Messages"
        description="Chat with the administrator about this job."
        action={
          <span
            aria-hidden="true"
            className="hex-clip flex size-11 items-center justify-center bg-primary/15 text-primary"
          >
            <MessageSquare className="size-5" />
          </span>
        }
      />

      {messagesQuery.isLoading ? (
        <HoneyLoader
          data-ocid="track.messages_loading_state"
          label="Loading your messages"
        />
      ) : messagesQuery.isError ? (
        <p
          data-ocid="track.messages_error_state"
          className="text-sm text-destructive"
        >
          We couldn&apos;t load your messages. Please try again.
        </p>
      ) : messages.length === 0 ? (
        <p
          data-ocid="track.messages_empty_state"
          className="text-sm text-muted-foreground"
        >
          No messages yet. Ask a question about your job below and we&apos;ll
          reply here.
        </p>
      ) : (
        <ul
          data-ocid="track.messages_list"
          className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1 scrollbar-honey"
        >
          {messages.map((message, index) => (
            <li
              key={message.id.toString()}
              data-ocid={`track.message_item.${index + 1}`}
              className={cn(
                "max-w-[85%] rounded-2xl border px-4 py-2.5",
                message.fromAdmin
                  ? "mr-auto border-primary/40 bg-primary/15"
                  : "ml-auto border-border/70 bg-muted/30",
              )}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {message.fromAdmin ? "Honey Do's" : "You"}
              </p>
              <p className="mt-1 text-sm text-foreground">{message.body}</p>
              <p className="mt-1 text-[0.65rem] text-muted-foreground">
                {formatDateTime(message.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 border-t border-border/70 pt-4">
        <Label htmlFor="track-message-input">Send a message</Label>
        <Textarea
          id="track-message-input"
          data-ocid="track.message_input"
          value={body}
          onChange={(event) => {
            setBody(event.target.value);
            setError(null);
          }}
          placeholder="Could you come by Thursday morning instead?"
          className="mt-2 min-h-20"
        />
        {error && (
          <p
            data-ocid="track.message_error_state"
            className="mt-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}
        <HoneyButton
          data-ocid="track.message_send_button"
          disabled={postMessage.isPending || body.trim().length === 0}
          onClick={handleSend}
          className="mt-3 w-full sm:w-auto"
        >
          <Send className="size-4" />
          {postMessage.isPending ? "Sending…" : "Send message"}
        </HoneyButton>
      </div>
    </HoneyCard>
  );
}

/** One bee in the acceptance swarm: a flight path plus a stagger delay. */
interface SwarmBee {
  id: string;
  /** Vertical start position as a viewport percentage. */
  top: number;
  /** Horizontal start offset in viewport-width units. */
  left: number;
  /** Flight duration in seconds. */
  duration: number;
  /** Delay before this bee enters, in seconds. */
  delay: number;
  /** Rendered size in pixels. */
  size: number;
}

const SWARM_BEES: SwarmBee[] = [
  { id: "swarm-1", top: 14, left: -12, duration: 2.6, delay: 0, size: 44 },
  { id: "swarm-2", top: 30, left: -18, duration: 3.1, delay: 0.18, size: 34 },
  { id: "swarm-3", top: 48, left: -10, duration: 2.9, delay: 0.36, size: 40 },
  { id: "swarm-4", top: 64, left: -16, duration: 3.3, delay: 0.54, size: 30 },
  { id: "swarm-5", top: 22, left: -22, duration: 3.5, delay: 0.72, size: 38 },
  { id: "swarm-6", top: 76, left: -14, duration: 2.8, delay: 0.9, size: 32 },
  { id: "swarm-7", top: 40, left: -20, duration: 3.2, delay: 1.08, size: 36 },
  { id: "swarm-8", top: 56, left: -12, duration: 3.0, delay: 1.26, size: 28 },
];

/**
 * A brief swarm of logo-matched bees buzzing across the viewport with a
 * honey-gold wash when a customer accepts their quote. Purely decorative and
 * non-blocking: it sits behind the page content, ignores pointer events, and
 * unmounts itself once the last bee has flown. Reduced-motion users get a
 * single static honey-gold glow instead of the flight.
 */
function BeeSwarmCelebration() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (reducedMotion) {
    return (
      <div
        data-ocid="track.bee_celebration"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-40 animate-honey-glow bg-gradient-to-b from-accent/25 via-primary/10 to-transparent"
      />
    );
  }

  return (
    <div
      data-ocid="track.bee_celebration"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 overflow-hidden"
    >
      <span className="absolute inset-0 animate-honey-glow bg-gradient-to-b from-accent/30 via-primary/10 to-transparent" />
      {SWARM_BEES.map((bee) => (
        <span
          key={bee.id}
          className="absolute animate-bee-swarm"
          style={{
            top: `${bee.top}%`,
            left: `${bee.left}vw`,
            animationDuration: `${bee.duration}s`,
            animationDelay: `${bee.delay}s`,
          }}
        >
          <BeeAccent
            className="h-auto"
            motion="hover"
            {...{ style: { width: `${bee.size}px` } }}
          />
        </span>
      ))}
    </div>
  );
}

/**
 * Human copy for a `JobError` returned by the emailed-link accept/decline
 * calls, so a failed action is explained rather than silently swallowed.
 */
function describeQuoteError(error: unknown): string {
  if (error && typeof error === "object" && "__kind__" in error) {
    const kind = (error as { __kind__: string }).__kind__;
    switch (kind) {
      case "notAuthorized":
        return "We couldn't verify this job. Re-enter your reference code and try again.";
      case "notFound":
        return "We couldn't find that job. Double-check your reference code.";
      case "invalidState":
        return "This quote can no longer be changed in its current state.";
      case "paymentError":
        return "The payment step failed. Please try again.";
      default:
        return "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}

/**
 * The current deposit state line on the payment breakdown.
 *
 * Names the exact state the customer is in — due, submitted and awaiting
 * verification, verified, or not received — and the amount and provider when
 * one is known, so the customer never has to guess where their deposit stands.
 */
function DepositStatusLine({
  status,
  amount,
  method,
}: {
  status: DepositStatus | undefined;
  amount: bigint;
  method: PaymentMethod | undefined;
}) {
  const meta = getDepositStatusMeta(status);
  const provider = depositMethodLabel(method);
  const verified = isDepositVerified(status);
  const submitted = isDepositSubmitted(status);
  const rejected = isDepositRejected(status);

  const tone = verified
    ? "text-success"
    : submitted
      ? "text-accent"
      : rejected
        ? "text-destructive"
        : "text-warning";

  /**
   * The verified state reads as "Deposit paid" with the amount received, so the
   * customer sees at a glance that their deposit cleared. Every other state
   * uses the shared deposit-status copy.
   */
  const label = verified ? "Deposit paid" : meta.label;
  const description = verified
    ? `We received your ${formatMoney(amount)} deposit — your spot is secured.`
    : meta.description;

  return (
    <div data-ocid="track.deposit_status" className="space-y-1">
      <p
        className={cn(
          "inline-flex items-center gap-2 text-sm font-semibold",
          tone,
        )}
      >
        {verified ? (
          <Check className="size-4 shrink-0" />
        ) : (
          <span aria-hidden="true" className="hex-clip size-2.5 bg-current" />
        )}
        {label}
        {provider ? ` · ${provider}` : ""}
        {verified || submitted ? ` · ${formatMoney(amount)}` : ""}
      </p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
