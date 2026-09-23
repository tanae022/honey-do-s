import { JobStatus } from "@/backend";
import { makeJob, makeQuote } from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

installCoreInfrastructureMocks();

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    ...props
  }: {
    to: string;
    children: React.ReactNode;
  }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
  useSearch: () => ({}),
  useRouterState: () => ({ location: { pathname: "/" } }),
}));

import { BeeAccent } from "@/components/honey/BeeAccent";
import { AppLayout } from "@/components/layout/AppLayout";
import { TrackPage } from "@/pages/Track";

/**
 * The logo-matched bee artwork and honeycomb background are the visual identity
 * the current request must not regress: every bee is the realistic 3D honeybee
 * from the logo (banded fuzzy body, veined translucent wings, six legs,
 * antennae) and never a cartoon, flat, or emoji bee. These assertions pin the
 * observable anatomy of the shared `BeeAccent` component rather than any single
 * page's layout.
 */
describe("logo-matched bee artwork", () => {
  it("renders the bee as an SVG with the logo's banded body, wings, legs and antennae", () => {
    const { container } = render(<BeeAccent label="A honeybee" />);

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    // The realistic bee is drawn, not typed: no emoji bee character anywhere.
    expect(container.textContent ?? "").not.toMatch(/[\u{1F41D}\u{1F41D}]/u);

    // Banded fuzzy abdomen: the amber band gradient is applied to the body.
    expect(container.querySelector("#bee-abdomen")).not.toBeNull();
    expect(container.querySelector("#bee-band")).not.toBeNull();
    // Two pairs of translucent veined wings.
    expect(container.querySelector("#bee-wing")).not.toBeNull();
    expect(container.querySelector("#bee-wing-rim")).not.toBeNull();
    // Six dark jointed legs.
    const legs = svg?.querySelectorAll("g[stroke='oklch(0.18 0.02 52)'] path");
    expect(legs?.length).toBe(6);
    // Thin dark segmented antennae.
    const antennae = svg?.querySelectorAll(
      "g[stroke='oklch(0.16 0.02 52)'] path",
    );
    expect(antennae?.length).toBe(2);
  });

  it("exposes an accessible image role only when a label is provided", () => {
    const { rerender } = render(<BeeAccent label="Beatrice the bee" />);
    expect(
      screen.getByRole("img", { name: /beatrice the bee/i }),
    ).toBeInTheDocument();

    rerender(<BeeAccent />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

describe("honeycomb-and-honey background on every page", () => {
  it("renders the fixed honeycomb background layer behind the app shell", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const background = container.querySelector(".honeycomb-bg");
    expect(background).not.toBeNull();
    expect(background).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the honeycomb background mounted while a page renders inside it", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <div data-testid="page-body">page content</div>
      </AppLayout>,
    );

    expect(screen.getByTestId("page-body")).toBeInTheDocument();
    expect(container.querySelector(".honeycomb-bg")).not.toBeNull();
  });
});

describe("bee swarm celebration honours reduced motion", () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: originalMatchMedia,
    });
  });

  function setReducedMotion(reduce: boolean) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: reduce && query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  async function acceptQuote() {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.quoted, quote: makeQuote() }),
    );
    const user = userEvent.setup();
    renderWithProviders(<TrackPage />);
    await user.type(screen.getByLabelText(/reference code/i), "HD-4F2A9C");
    await user.click(screen.getByRole("button", { name: /find my job/i }));
    await user.click(
      await screen.findByRole("button", { name: /accept quote/i }),
    );
    await waitFor(() => {
      expect(actor.acceptQuote).toHaveBeenCalledWith("HD-4F2A9C");
    });
    return user;
  }

  beforeEach(() => {
    setActor();
    window.history.replaceState({}, "", "/track");
  });

  it("shows a static honey glow and no flying bees when reduced motion is requested", async () => {
    setReducedMotion(true);
    await acceptQuote();

    const celebration = await waitFor(() => {
      const node = document.querySelector(
        '[data-ocid="track.bee_celebration"]',
      );
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });

    // The reduced-motion branch is a single static glow, not a swarm.
    expect(celebration.querySelectorAll(".animate-bee-swarm")).toHaveLength(0);
    expect(celebration.querySelectorAll("svg")).toHaveLength(0);
  });

  it("flies a swarm of logo-style bees when motion is allowed", async () => {
    setReducedMotion(false);
    await acceptQuote();

    const celebration = await waitFor(() => {
      const node = document.querySelector(
        '[data-ocid="track.bee_celebration"]',
      );
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });

    const flying = celebration.querySelectorAll(".animate-bee-swarm");
    expect(flying.length).toBeGreaterThan(0);
    // Every flying bee is the shared logo-style SVG, never an emoji.
    expect(celebration.querySelectorAll("svg").length).toBe(flying.length);
    expect(celebration.textContent ?? "").not.toMatch(/[\u{1F41D}]/u);
  });
});
