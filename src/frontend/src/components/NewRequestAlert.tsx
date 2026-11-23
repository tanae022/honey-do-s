import {
  NEW_REQUEST_ALERT_MS,
  useIsAdmin,
  useNewRequestAlert,
} from "@/hooks/useJobs";
import { getService } from "@/lib/services";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BellRing, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/* Ding — a short, warm two-note chime played through the Web Audio    */
/* API. The context is created lazily and reused; when the browser     */
/* blocks playback until the owner interacts, the ding is queued and   */
/* played the moment playback is permitted.                            */
/* ------------------------------------------------------------------ */

type AudioContextCtor = typeof AudioContext;

function resolveAudioContextCtor(): AudioContextCtor | null {
  if (typeof window === "undefined") return null;
  const scoped = globalThis as typeof globalThis & {
    webkitAudioContext?: AudioContextCtor;
  };
  return scoped.AudioContext ?? scoped.webkitAudioContext ?? null;
}

let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (sharedContext) return sharedContext;
  const Ctor = resolveAudioContextCtor();
  if (!Ctor) return null;
  try {
    sharedContext = new Ctor();
  } catch {
    sharedContext = null;
  }
  return sharedContext;
}

/** Emit the two-note chime on an already-running context. */
function emitDing(ctx: AudioContext): void {
  const start = ctx.currentTime;
  const notes = [
    { at: 0, freq: 880 },
    { at: 0.14, freq: 1318.5 },
  ];
  for (const note of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(note.freq, start + note.at);
    gain.gain.setValueAtTime(0.0001, start + note.at);
    gain.gain.exponentialRampToValueAtTime(0.16, start + note.at + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.at + 0.32);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start + note.at);
    osc.stop(start + note.at + 0.36);
  }
}

/**
 * In-app alert for a genuinely new service request.
 *
 * Mounted once in the app shell. It only watches and dings while the owner is
 * signed in with admin access, names the new request (customer and service),
 * links to the dashboard, and clears itself after a short time. The visual
 * entrance is gated behind `motion-safe:` so it honors reduced motion.
 */
export function NewRequestAlert() {
  const { data: isAdmin } = useIsAdmin();
  const { isAuthenticated } = useInternetIdentity();
  const enabled = isAdmin === true && isAuthenticated;
  const { request, dismiss } = useNewRequestAlert(enabled);

  const pendingDingRef = useRef(false);

  const playDing = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "running") {
      emitDing(ctx);
      return;
    }
    // Autoplay is blocked until the owner interacts: queue the ding and play
    // it as soon as playback is permitted.
    pendingDingRef.current = true;
    void ctx
      .resume()
      .then(() => {
        if (pendingDingRef.current && ctx.state === "running") {
          pendingDingRef.current = false;
          emitDing(ctx);
        }
      })
      .catch(() => {
        /* Still blocked — the interaction listener below retries. */
      });
  }, []);

  // Play the ding whenever a new request is announced.
  useEffect(() => {
    if (!request) return;
    playDing();
  }, [request, playDing]);

  // If a ding is queued behind the autoplay gate, release it on the owner's
  // first interaction with the page.
  useEffect(() => {
    const unlock = () => {
      if (!pendingDingRef.current) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      void ctx.resume().then(() => {
        if (pendingDingRef.current && ctx.state === "running") {
          pendingDingRef.current = false;
          emitDing(ctx);
        }
      });
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // Clear the alert on its own after a short time.
  useEffect(() => {
    if (!request) return;
    const timer = window.setTimeout(dismiss, NEW_REQUEST_ALERT_MS);
    return () => window.clearTimeout(timer);
  }, [request, dismiss]);

  if (!request) return null;

  const serviceLabel = getService(request.category).label;

  return (
    <div
      role="alert"
      data-ocid="new_request_alert"
      className="fixed right-4 top-20 z-[60] w-[min(22rem,calc(100vw-2rem))] motion-safe:animate-honey-drop"
    >
      <div className="notification-panel relative overflow-hidden rounded-2xl border border-accent/50 p-4 shadow-honey-lg">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="hex-clip-flat flex size-10 shrink-0 items-center justify-center bg-primary/20 text-primary"
          >
            <BellRing className="size-5" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="text-outline-black-strong font-display text-base font-bold text-gold-gradient">
              New request
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-foreground">
              {request.customerName}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {serviceLabel}
              <span className="mx-1.5 text-border">·</span>
              <span className="font-mono text-xs">{request.referenceCode}</span>
            </p>
          </div>

          <button
            type="button"
            data-ocid="new_request_alert.dismiss_button"
            aria-label="Dismiss new request alert"
            onClick={dismiss}
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/60 text-muted-foreground transition-smooth hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </button>
        </div>

        <Link
          to="/admin"
          data-ocid="new_request_alert.dashboard_link"
          onClick={dismiss}
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-full border border-accent/40 honey-surface px-4 text-sm font-semibold text-primary-foreground transition-smooth hover:-translate-y-0.5 hover:shadow-honey focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          View on the dashboard
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
