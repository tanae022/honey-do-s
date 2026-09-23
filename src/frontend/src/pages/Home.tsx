import type { PackageEnrollment } from "@/backend";
import { BeeAccent, HexBullet, HexDivider } from "@/components/honey/BeeAccent";
import { HexTile } from "@/components/honey/HexTile";
import { HoneyButton } from "@/components/honey/HoneyButton";
import { HoneyCard } from "@/components/honey/HoneyCard";
import {
  PACKAGE_BILLING_NOTE,
  packagePriceLabel,
  packageVisitsLabel,
} from "@/lib/jobs";

import { SERVICES } from "@/lib/services";
import { Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  ClipboardList,
  Flower2,
  HandHeart,
  HeartHandshake,
  Lightbulb,
  Package,
  PaintRoller,
  Phone,
  ShoppingBag,
  Sparkles,
  Sprout,
  Users,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";

const LOGO_SRC = "/assets/generated/honey-dos-logo.dim_1024x1024.png";

/** Owner's direct line, shown alongside the package offer. */
const OWNER_PHONE_DISPLAY = "405-312-4987";
const OWNER_PHONE_HREF = "tel:+14053124987";

/**
 * The advertised monthly package offer. The package is priced per individual
 * customer, so no dollar amount is advertised — the shared display helpers
 * describe what the package includes and that the rate is set with the owner.
 */
const PACKAGE_OFFER: PackageEnrollment = {
  startedAt: 0n,
  active: true,
  monthlyPrice: 0n,
  includedVisits: 4n,
};

const PACKAGE_PERKS = [
  "A set number of visits every month",
  "Priority scheduling for package members",
  "One simple monthly price — no surprises",
];

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Wrench,
  PaintRoller,
  Sprout,
  Flower2,
  Sparkles,
  Package,
  ShoppingBag,
  Lightbulb,
};

const STEPS = [
  {
    id: "step-request",
    title: "Tell us the job",
    body: "Pick a service, describe what needs doing, and add a photo or two.",
    icon: ClipboardList,
  },
  {
    id: "step-quote",
    title: "Get your quote",
    body: "We review the details and send a clear price with a friendly note.",
    icon: Sparkles,
  },
  {
    id: "step-schedule",
    title: "Book the visit",
    body: "Choose a time that suits you and confirm your appointment.",
    icon: CalendarCheck,
  },
];

const PROMISES = [
  "Friendly, local, and easy to reach",
  "Photos help us quote accurately",
  "Clear prices before any work begins",
];

const COMMUNITY_VALUES = [
  {
    id: "community-affordable",
    title: "Affordable for every family",
    body: "We work with low-income families and keep our prices honest, so a helping hand never has to wait for a good month.",
    icon: HandHeart,
  },
  {
    id: "community-grandparents",
    title: "Send me to your grandparents",
    body: "If someone you love needs a hand around the house, send me to your grandparents. I'll treat their home like my own.",
    icon: Users,
  },
  {
    id: "community-women",
    title: "Women supporting women",
    body: "A woman-owned business, built on women supporting women — you'll always know exactly who is coming to your door.",
    icon: HeartHandshake,
  },
];

export function HomePage() {
  return (
    <div className="animate-page-enter">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-12 pt-10 sm:px-8 md:pb-16 md:pt-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 honeycomb-texture opacity-60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
        />
        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          {/* Hero logo badge with honey drip + subtle bees */}
          <div className="relative animate-float-soft">
            <span
              aria-hidden="true"
              className="hex-clip absolute -inset-1.5 bg-gradient-to-b from-accent via-primary to-primary/40 shadow-honey-lg"
            />
            <span
              aria-hidden="true"
              className="hex-clip absolute inset-0 bg-background"
            />
            <img
              src={LOGO_SRC}
              alt="Honey Do's badge"
              className="hex-clip relative size-56 object-cover sm:size-64 md:size-80"
            />
            {/* glossy honey drip along the bottom edge */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-2 left-1/2 h-5 w-40 -translate-x-1/2 rounded-b-full bg-gradient-to-b from-primary to-primary/0 blur-[1px]"
            />
            <BeeAccent className="absolute -right-7 top-3 h-9 w-12" />
            <BeeAccent
              motion="drift"
              className="absolute -left-8 bottom-8 h-8 w-11"
            />
          </div>

          <h1 className="mt-8 font-display text-4xl font-bold uppercase tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Need a hand?
          </h1>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.28em] text-primary md:text-base">
            Little jobs <span aria-hidden="true">•</span> Big relief
          </p>
          <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
            Honey Do&apos;s takes the small tasks off your list — the ones that
            quietly eat up a whole weekend — so you can spend it on what
            matters.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link to="/request" data-ocid="home.request_button">
              <HoneyButton size="lg" className="w-full sm:w-auto">
                <span aria-hidden="true">🍯</span>
                Request a Honey Do
              </HoneyButton>
            </Link>
            <Link to="/track" data-ocid="home.track_button">
              <HoneyButton
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Track my job
              </HoneyButton>
            </Link>
          </div>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {PROMISES.map((promise) => (
              <li
                key={promise}
                className="flex items-center gap-2 text-xs text-muted-foreground md:text-sm"
              >
                <HexBullet />
                {promise}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <section className="border-t border-border bg-muted/30 px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              What we do
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Pick your Honey Do
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground md:text-base">
              Eight ways we can lend a hand around the home and yard. Tap a
              honeycomb to start your request.
            </p>
          </div>

          <div
            data-ocid="home.service_grid"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5"
          >
            {SERVICES.map((service, index) => {
              const Icon = ICONS[service.icon] ?? Wrench;
              return (
                <Link
                  key={service.category}
                  to="/request"
                  search={{ service: service.category }}
                  data-ocid={`home.service_tile.${index + 1}`}
                  className="animate-hex-pop"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <HexTile
                    label={service.label}
                    blurb={service.blurb}
                    icon={<Icon className="size-5 md:size-6" />}
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Warm community */}
      <section
        data-ocid="home.community_section"
        className="relative overflow-hidden border-t border-border px-5 py-14 sm:px-8 md:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 honeycomb-texture opacity-50"
        />
        <div className="relative mx-auto w-full max-w-5xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Our neighborhood
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              A hand for the whole hive
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              Honey Do&apos;s is built around the people nearby — the families,
              the grandparents, and the women who keep everyone else going.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {COMMUNITY_VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <HoneyCard key={value.id} interactive>
                  <span className="relative flex size-12 items-center justify-center">
                    <span
                      aria-hidden="true"
                      className="hex-clip absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10"
                    />
                    <Icon className="relative z-10 size-5 text-primary" />
                  </span>
                  <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.body}
                  </p>
                </HoneyCard>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              to="/request"
              data-ocid="home.community_request_button"
              className="inline-block"
            >
              <HoneyButton size="lg">
                <span aria-hidden="true">🍯</span>
                Send us a job
              </HoneyButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Monthly package */}
      <section
        data-ocid="home.package_section"
        className="relative overflow-hidden border-t border-border bg-muted/30 px-5 py-14 sm:px-8 md:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 honeycomb-texture opacity-50"
        />
        <div className="relative mx-auto w-full max-w-5xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              Save every month
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Honey Do&apos;s Monthly Package
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground md:text-base">
              Keep the little jobs from piling up. One flat monthly rate covers
              a set number of visits, so help is always on the calendar — priced
              for your home, set up with the owner.
            </p>
          </div>

          <HoneyCard className="mx-auto max-w-3xl">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-stretch md:gap-8">
              <div className="flex flex-col items-center justify-center text-center md:w-56 md:shrink-0">
                <span className="relative flex size-14 items-center justify-center">
                  <span
                    aria-hidden="true"
                    className="hex-clip absolute inset-0 bg-gradient-to-b from-primary/60 to-primary/10"
                  />
                  <Package className="relative z-10 size-6 text-primary" />
                </span>
                <p
                  data-ocid="home.package_price"
                  className="mt-4 font-display text-2xl font-bold text-gold-gradient md:text-3xl"
                >
                  {packagePriceLabel(PACKAGE_OFFER)}
                </p>
                <p
                  data-ocid="home.package_visits"
                  className="mt-2 text-sm font-semibold text-foreground"
                >
                  {packageVisitsLabel(PACKAGE_OFFER)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Your monthly rate is set with the owner.
                </p>
              </div>

              <div className="hidden w-px shrink-0 bg-gradient-to-b from-transparent via-primary/40 to-transparent md:block" />

              <div className="flex flex-1 flex-col">
                <ul className="flex flex-col gap-3">
                  {PACKAGE_PERKS.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-3 text-sm text-muted-foreground md:text-base"
                    >
                      <HexBullet className="mt-1.5" />
                      {perk}
                    </li>
                  ))}
                </ul>

                <p
                  data-ocid="home.package_billing_note"
                  className="mt-5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs font-medium text-foreground md:text-sm"
                >
                  {PACKAGE_BILLING_NOTE}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    to="/request"
                    data-ocid="home.package_request_button"
                    className="inline-block"
                  >
                    <HoneyButton size="lg" className="w-full sm:w-auto">
                      <span aria-hidden="true">🍯</span>
                      Ask about the package
                    </HoneyButton>
                  </Link>
                  <a
                    href={OWNER_PHONE_HREF}
                    data-ocid="home.package_phone_link"
                    className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-primary transition-smooth hover:text-accent"
                  >
                    <Phone className="size-4" />
                    {OWNER_PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>
          </HoneyCard>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto w-full max-w-5xl">
          <div className="mb-8 text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
              How it works
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Three easy steps
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <HoneyCard key={step.id} interactive>
                  <div className="flex items-center gap-3">
                    <span className="relative flex size-12 shrink-0 items-center justify-center">
                      <span
                        aria-hidden="true"
                        className="hex-clip absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/10"
                      />
                      <Icon className="relative z-10 size-5 text-primary" />
                    </span>
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.body}
                  </p>
                </HoneyCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border bg-muted/30 px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto w-full max-w-3xl">
          <HoneyCard className="text-center">
            <BeeAccent className="mx-auto h-8 w-11" />
            <h2 className="mt-4 font-display text-2xl font-bold text-foreground md:text-3xl">
              Ready to hand it over?
            </h2>
            <HexDivider className="mx-auto mt-5 max-w-xs" />
            <p className="mx-auto mt-5 max-w-md text-sm text-muted-foreground md:text-base">
              Send us the details and we&apos;ll take it from here — you can
              even sign in later to follow along.
            </p>
            <Link
              to="/request"
              data-ocid="home.closing_request_button"
              className="mt-6 inline-block"
            >
              <HoneyButton size="lg">
                <span aria-hidden="true">🍯</span>
                Request a Honey Do
              </HoneyButton>
            </Link>
          </HoneyCard>
        </div>
      </section>
    </div>
  );
}
