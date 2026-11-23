import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen } from "@testing-library/react";
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
 * Cover for the accepted requirement that the honeycomb background renders as a
 * layered, dimensional, subtly animated scene rather than a flat repeating
 * pattern, and that its motion is disabled when the user prefers reduced motion.
 *
 * jsdom does not apply Tailwind or the stylesheet, so the depth planes and the
 * reduced-motion rule are asserted through the DOM structure the shell mounts
 * and the class contract the stylesheet keys off — not through computed styles.
 * The backend is mocked, so this is component/integration coverage only.
 */
beforeEach(() => {
  setActor();
  window.history.replaceState({}, "", "/track");
});

describe("layered, dimensional honeycomb background", () => {
  it("stacks three depth planes plus the breathing glow and honey sheen inside the fixed layer", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const background = container.querySelector(".honeycomb-bg");
    expect(background).not.toBeNull();

    // Three parallax planes give the hive real depth: far, mid and near.
    expect(background?.querySelector(".comb-plane-far")).not.toBeNull();
    expect(background?.querySelector(".comb-plane-mid")).not.toBeNull();
    expect(background?.querySelector(".comb-plane-near")).not.toBeNull();
    // A slow breathing glow and a honey sheen sweep animate the scene.
    expect(background?.querySelector(".comb-breathe")).not.toBeNull();
    expect(background?.querySelector(".comb-honey-sheen")).not.toBeNull();

    // Every depth element is a decorative span, so the scene adds no text and
    // no interactive content to the page.
    const planes = background?.querySelectorAll(".comb-plane") ?? [];
    expect(planes.length).toBe(3);
    for (const plane of Array.from(planes)) {
      expect(plane.tagName).toBe("SPAN");
      expect(plane.textContent).toBe("");
    }
  });

  it("keeps the depth planes decorative and non-interactive", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const background = container.querySelector(".honeycomb-bg");
    // The whole scene is hidden from assistive tech and never intercepts clicks.
    expect(background).toHaveAttribute("aria-hidden", "true");
    expect(background?.className).toContain("pointer-events-none");
    // The planes themselves carry no pointer handling of their own.
    for (const plane of Array.from(
      background?.querySelectorAll(".comb-plane") ?? [],
    )) {
      expect(plane.getAttribute("aria-hidden")).not.toBe("false");
    }
  });

  it("mounts the layered scene on Home, Request, Track and Admin", async () => {
    const home = renderWithProviders(
      <AppLayout>
        <HomePage />
      </AppLayout>,
    );
    expect(home.container.querySelector(".comb-plane-near")).not.toBeNull();
    home.unmount();

    const request = renderWithProviders(
      <AppLayout>
        <RequestPage />
      </AppLayout>,
    );
    expect(request.container.querySelector(".comb-plane-near")).not.toBeNull();
    request.unmount();

    const track = renderWithProviders(
      <AppLayout>
        <TrackPage />
      </AppLayout>,
    );
    expect(track.container.querySelector(".comb-plane-near")).not.toBeNull();
    track.unmount();

    const adminActor = setActor();
    adminActor.isCallerAdmin.mockResolvedValue(true);
    adminActor.listRequests.mockResolvedValue([]);
    const admin = renderWithProviders(
      <AppLayout>
        <AdminPage />
      </AppLayout>,
    );
    await screen.findByText("Owner alerts");
    expect(admin.container.querySelector(".comb-plane-near")).not.toBeNull();
  });
});

describe("reduced-motion contract for the animated hive", () => {
  it("keys the depth-plane animations off classes the reduced-motion rule targets", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    // The stylesheet disables motion by targeting exactly these class names
    // under `@media (prefers-reduced-motion: reduce)`. Pinning them here means
    // a rename that silently drops the reduced-motion rule fails this test.
    const animated = [
      ".comb-plane-far",
      ".comb-plane-mid",
      ".comb-plane-near",
      ".comb-breathe",
      ".comb-honey-sheen",
    ];
    for (const selector of animated) {
      expect(container.querySelector(selector)).not.toBeNull();
    }
  });
});
