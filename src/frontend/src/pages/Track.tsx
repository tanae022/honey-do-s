import type { JobRequestView } from "@/backend";
import { BeeAccent } from "@/components/honey/BeeAccent";
import { HexStatus, HexStatusTimeline } from "@/components/honey/HexStatus";
import { HoneyButton } from "@/components/honey/HoneyButton";
import { HoneyCard, HoneyCardHeader } from "@/components/honey/HoneyCard";
import { HoneyLoader } from "@/components/honey/HoneyLoader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useAcceptQuote,
  useConfirmAppointment,
  useJobByReference,
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
  formatDateTime,
  formatMoney,
  formatReference,
  formatVisitDate,
  getStatusMeta,
  isPackageActive,
  packageStartedLabel,
  packageVisitsLabel,
  sortVisitsNewestFirst,
  statusIndex,
  visitBeeName,
  visitServiceLabel,
} from "@/lib/jobs";
import { getService } from "@/lib/services";
import {
  CalendarCheck,
  Check,
  Copy,
  ExternalLink,
  History,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";

export function TrackPage() {
  const [reference, setReference] = useState("");
  const [submitted, setSubmitted] = useState("");

  const jobQuery = useJobByReference(submitted);

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

          {jobQuery.data && <JobDetail job={jobQuery.data} />}
        </div>
      </div>
    </div>
  );
}

function JobDetail({ job }: { job: JobRequestView }) {
  const service = getService(job.category);
  const status = getStatusMeta(job.status);
  const acceptQuote = useAcceptQuote();
  const confirmAppointment = useConfirmAppointment();
  const recordDeposit = useRecordDeposit();
  const submitReview = useSubmitReview();
  const visitsQuery = useVisitHistory(job.referenceCode);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    DEPOSIT_OPTIONS[0].id,
  );
  const [celebrating, setCelebrating] = useState(false);

  const quoteAccepted = job.status !== "quoted";
  const canAcceptQuote = !!job.quote && job.status === "quoted";
  const canPayDeposit =
    !!job.quote && job.status !== "quoted" && !job.deposit?.paid;
  const canReview = job.status === "completed" && !job.review;
  const isCompleted = job.status === "completed";

  const deposit = job.quote ? depositAmount(job.quote.amount) : 0n;
  const balance = job.quote ? balanceDue(job.quote.amount) : 0n;

  const packageActive = isPackageActive(job.packageEnrollment);
  const packageVisits = packageVisitsLabel(job.packageEnrollment);
  const packageStarted = packageStartedLabel(job.packageEnrollment);

  const visits = sortVisitsNewestFirst(visitsQuery.data ?? []);

  const selectedOption =
    DEPOSIT_OPTIONS.find((option) => option.id === selectedOptionId) ??
    DEPOSIT_OPTIONS[0];

  /**
   * The backend `PaymentMethod` enum only has `stripe` and `cashApp`, and the
   * `Deposit` record has no provider field. Every manual option (Cash App,
   * Venmo, PayPal, Chime) is an off-platform payment, so they all record
   * through the existing `cashApp` variant — the manual-payment method — while
   * the UI names the provider the customer actually chose.
   */
  const selectedMethod = selectedOption.method;

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

      {job.quote && (
        <HoneyCard data-ocid="track.quote_card">
          <HoneyCardHeader
            title="Your quote"
            description={`Sent ${formatDateTime(job.quote.sentAt)}`}
          />
          <p className="font-mono text-3xl font-bold text-gold-gradient">
            {formatMoney(job.quote.amount)}
          </p>
          {job.quote.discountApplied && (
            <p
              data-ocid="track.quote_discount"
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-success/50 bg-success/15 px-3 py-1 text-xs font-semibold text-success"
            >
              <Check className="size-3.5" />
              Own parts/supplies discount applied — 10% off (
              {formatMoney(job.quote.discountAmount)})
            </p>
          )}
          {job.quote.note && (
            <p className="mt-3 text-sm text-muted-foreground">
              {job.quote.note}
            </p>
          )}
          {canAcceptQuote && (
            <HoneyButton
              data-ocid="track.accept_quote_button"
              disabled={acceptQuote.isPending}
              onClick={() =>
                acceptQuote.mutate(job.referenceCode, {
                  onSuccess: () => setCelebrating(true),
                })
              }
              className="mt-5 w-full sm:w-auto"
            >
              {acceptQuote.isPending ? "Accepting…" : "🍯 ACCEPT QUOTE"}
            </HoneyButton>
          )}
          {quoteAccepted && !canAcceptQuote && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-success">
              <Check className="size-4" />
              Quote accepted
            </p>
          )}
        </HoneyCard>
      )}

      {job.quote && (
        <HoneyCard data-ocid="track.payment_breakdown_card">
          <HoneyCardHeader
            title="Deposit & balance"
            description="Half now secures your spot; the rest is due on completion."
          />
          <dl className="space-y-3">
            {job.quote.discountApplied && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-sm text-muted-foreground">
                  Own parts/supplies discount (10%)
                </dt>
                <dd className="font-mono text-sm font-semibold text-success">
                  −{formatMoney(job.quote.discountAmount)}
                </dd>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted-foreground">Quote total</dt>
              <dd className="font-mono text-sm font-semibold text-foreground">
                {formatMoney(job.quote.amount)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-sm text-muted-foreground">Deposit (50%)</dt>
              <dd className="font-mono text-sm font-semibold text-foreground">
                {formatMoney(deposit)}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-border/70 pt-3">
              <dt className="text-sm font-semibold text-foreground">
                Balance due
              </dt>
              <dd className="font-mono text-base font-bold text-gold-gradient">
                {formatMoney(balance)}
              </dd>
            </div>
          </dl>
          <div className="mt-4">
            {job.deposit?.paid ? (
              <p
                data-ocid="track.deposit_status"
                className="inline-flex items-center gap-2 text-sm font-semibold text-success"
              >
                <Check className="size-4" />
                Deposit paid — {formatMoney(job.deposit.amount)} received
              </p>
            ) : (
              <p
                data-ocid="track.deposit_status"
                className="inline-flex items-center gap-2 text-sm font-semibold text-warning"
              >
                <span
                  aria-hidden="true"
                  className="hex-clip size-2.5 bg-current"
                />
                Deposit due — {formatMoney(deposit)}
              </p>
            )}
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

      {canPayDeposit && job.quote && (
        <HoneyCard data-ocid="track.deposit_card">
          <HoneyCardHeader
            title="Secure your spot"
            description={`Send the ${formatMoney(deposit)} deposit to confirm your booking.`}
          />
          <p className="text-sm text-muted-foreground">
            Pick where you&apos;d like to send it, copy the handle, then tap
            &ldquo;I&apos;ve sent it&rdquo; so we can mark your deposit
            received.
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
                disabled={recordDeposit.isPending}
                onClick={() =>
                  recordDeposit.mutate({
                    referenceCode: job.referenceCode,
                    method: selectedMethod,
                  })
                }
                className="w-full sm:w-auto"
              >
                {recordDeposit.isPending
                  ? "Marking…"
                  : `I've sent it via ${selectedOption.label}`}
              </HoneyButton>
            </div>
            {recordDeposit.isError && (
              <p
                data-ocid="track.deposit_error"
                className="mt-3 text-sm font-semibold text-destructive"
              >
                We couldn&apos;t record your deposit. Please try again.
              </p>
            )}
            {recordDeposit.isSuccess && (
              <p
                data-ocid="track.deposit_recorded"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-success"
              >
                <Check className="size-4" />
                Thanks — we&apos;ll confirm your {selectedOption.label} deposit
                shortly.
              </p>
            )}
          </div>
        </HoneyCard>
      )}

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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm text-foreground">{value}</dd>
    </div>
  );
}
