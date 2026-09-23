import { JobStatus } from "@/backend";
import { SERVICES } from "@/lib/services";
import { makeJob, makeQuote } from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

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

import { AppLayout } from "@/components/layout/AppLayout";
import { AdminPage } from "@/pages/Admin";
import { HomePage } from "@/pages/Home";
import { RequestPage } from "@/pages/Request";
import { TrackPage } from "@/pages/Track";

/**
 * The current request reworks the Home copy, removes the Driving service, and
 * makes the honeycomb-and-honey background more prominent with visible honey
 * drips on every page. It also bans three phrases and any in-app notification
 * banner, toast or pop-up.
 *
 * These assertions pin the accepted observable outcome: the warm community
 * copy is present, the banned strings are gone, Driving is absent from both
 * service surfaces, the fixed honeycomb background and honey-drip bars are
 * mounted on every page, and no toast/banner region is rendered.
 */

/** The three phrases the request removes from the app entirely. */
const BANNED_PHRASES = [
  "from leaky faucets to lawn care",
  "fully insured",
  "No accounts or passwords to remember",
];

/** Render a page inside the real app shell so the background contract applies. */
function renderPage(page: React.ReactNode) {
  return renderWithProviders(<AppLayout>{page}</AppLayout>);
}

beforeEach(() => {
  setActor();
  window.history.replaceState({}, "", "/track");
});

describe("Home warm community copy", () => {
  it("shows the low-income families, grandparents and women-supporting-women messages", () => {
    renderWithProviders(<HomePage />);

    // Each message appears as both a card heading and its body copy.
    expect(
      screen.getAllByText(/we work with low-income families/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText(/send me to your grandparents/i).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText(/women supporting women/i).length,
    ).toBeGreaterThanOrEqual(1);
  });

  it("does not show any of the three banned phrases", () => {
    renderWithProviders(<HomePage />);

    for (const phrase of BANNED_PHRASES) {
      expect(
        screen.queryByText(phrase, { exact: false }),
      ).not.toBeInTheDocument();
    }
  });
});

describe("Driving is removed from the service surfaces", () => {
  it("does not list Driving in the shared service list", () => {
    expect(SERVICES).toHaveLength(8);
    expect(SERVICES.some((service) => /driving/i.test(service.label))).toBe(
      false,
    );
  });

  it("renders eight Home service tiles with no Driving tile and no empty gap", () => {
    renderWithProviders(<HomePage />);

    const grid = document.querySelector('[data-ocid="home.service_grid"]');
    expect(grid).not.toBeNull();
    const links = grid?.querySelectorAll("a") ?? [];
    expect(links).toHaveLength(8);
    expect(screen.queryByText(/^driving$/i)).not.toBeInTheDocument();
  });

  it("renders eight Request service tiles with no Driving tile", () => {
    renderWithProviders(<RequestPage />);

    const grid = document.querySelector('[data-ocid="request.service_grid"]');
    expect(grid).not.toBeNull();
    const tiles = grid?.querySelectorAll("button") ?? [];
    expect(tiles).toHaveLength(8);
    expect(screen.queryByText(/^driving$/i)).not.toBeInTheDocument();
  });
});

describe("honeycomb-and-honey background with visible drips on every page", () => {
  it("mounts the fixed honeycomb layer and both honey-drip bars on Home", () => {
    const { container } = renderPage(<HomePage />);

    expect(container.querySelector(".honeycomb-bg")).not.toBeNull();
    expect(
      container.querySelectorAll(".honey-drip").length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("mounts the fixed honeycomb layer and honey-drip bars on Request", () => {
    const { container } = renderPage(<RequestPage />);

    expect(container.querySelector(".honeycomb-bg")).not.toBeNull();
    expect(
      container.querySelectorAll(".honey-drip").length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("mounts the fixed honeycomb layer and honey-drip bars on Track", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.scheduled, quote: makeQuote() }),
    );

    const { container } = renderPage(<TrackPage />);

    expect(container.querySelector(".honeycomb-bg")).not.toBeNull();
    expect(
      container.querySelectorAll(".honey-drip").length,
    ).toBeGreaterThanOrEqual(2);
  });

  it("mounts the fixed honeycomb layer and honey-drip bars on Admin", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);

    const { container } = renderPage(<AdminPage />);

    await waitFor(() => {
      expect(container.querySelector(".honeycomb-bg")).not.toBeNull();
    });
    expect(
      container.querySelectorAll(".honey-drip").length,
    ).toBeGreaterThanOrEqual(2);
  });
});

describe("no in-app notification banners, toasts or pop-ups", () => {
  it("renders no toast or notification region on the customer pages", () => {
    const { container } = renderPage(<HomePage />);

    // No sonner/radix toast viewport, no live-region banner, no dialog.
    expect(container.querySelector("[data-sonner-toaster]")).toBeNull();
    expect(container.querySelector("[data-sonner-toast]")).toBeNull();
    expect(container.querySelector("[role='alertdialog']")).toBeNull();
    expect(container.querySelector("[role='dialog']")).toBeNull();
    expect(container.querySelector("[data-radix-toast-viewport]")).toBeNull();
  });

  it("renders no toast or notification region on the owner dashboard", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);

    const { container } = renderPage(<AdminPage />);

    await waitFor(() => {
      expect(container.querySelector(".honeycomb-bg")).not.toBeNull();
    });
    expect(container.querySelector("[data-sonner-toaster]")).toBeNull();
    expect(container.querySelector("[data-sonner-toast]")).toBeNull();
    expect(container.querySelector("[role='alertdialog']")).toBeNull();
    expect(container.querySelector("[role='dialog']")).toBeNull();
  });
});
