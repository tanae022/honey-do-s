import { JobStatus } from "@/backend";
import { makeJob, makeQuote } from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

import { HexStatus } from "@/components/honey/HexStatus";
import { HexTile } from "@/components/honey/HexTile";
import { HoneyButton } from "@/components/honey/HoneyButton";
import { HoneyCardHeader } from "@/components/honey/HoneyCard";
import { HoneyDropSuccess } from "@/components/honey/HoneyDropSuccess";
import { HoneyLoader } from "@/components/honey/HoneyLoader";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminPage } from "@/pages/Admin";
import { HomePage } from "@/pages/Home";
import { RequestPage } from "@/pages/Request";
import { TrackPage } from "@/pages/Track";

/**
 * Characterization baseline for the two accepted requirements of this build:
 * light/white text stays outlined in black for legibility over imagery and
 * gradients, and the honeycomb background stays a realistic, dimensional,
 * subtly animated scene.
 *
 * Both requirements intentionally change their own surface, so neither the
 * exact stroke CSS nor the background's current static rendering is pinned
 * here. What is pinned is the adjacent contract that must survive the rework:
 *
 *  - the shared honey components that render light/cream text keep the
 *    app-wide black outline utility, so a background rework cannot strip it;
 *  - the fixed background layer stays mounted on every page, stays decorative
 *    (`aria-hidden`), never intercepts pointer events, and stays behind the
 *    content it sits under.
 *
 * The backend is mocked, so these are component/integration assertions about
 * what the frontend renders — not proof of deployed behavior.
 */

beforeEach(() => {
  setActor();
  window.history.replaceState({}, "", "/track");
});

describe("light text keeps its black outline on the shared honey surfaces", () => {
  it("renders the primary button label inside the outlined shell", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <HoneyButton>Request a Honey Do</HoneyButton>
      </AppLayout>,
    );

    const buttons = screen.getAllByRole("button", {
      name: /request a honey do/i,
    });
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    // The button's own utility class may be merged away by tailwind-merge, but
    // the app-wide `body, body *` stroke still reaches it through the shell.
    const shell = container.querySelector(".text-outline-black");
    expect(shell).not.toBeNull();
    for (const button of buttons) {
      expect(shell?.contains(button)).toBe(true);
    }
  });

  it("outlines a card heading and its body copy", () => {
    render(
      <HoneyCardHeader
        title="Monthly package"
        description="Priced for your home, set up with the owner."
      />,
    );

    expect(
      screen.getByRole("heading", { name: /monthly package/i }).className,
    ).toContain("text-outline-black-strong");
    expect(screen.getByText(/priced for your home/i).className).toContain(
      "text-outline-black",
    );
  });

  it("renders a status chip inside the outlined shell", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <HexStatus label="Awaiting quote" />
      </AppLayout>,
    );

    const chip = screen.getByText("Awaiting quote");
    const shell = container.querySelector(".text-outline-black");
    expect(shell).not.toBeNull();
    expect(shell?.contains(chip)).toBe(true);
  });

  it("outlines a service tile label and blurb", () => {
    render(<HexTile label="Fix It" blurb="Small repairs" icon={<span />} />);

    expect(screen.getByText("Fix It").className).toContain(
      "text-outline-black",
    );
    expect(screen.getByText("Small repairs").className).toContain(
      "text-outline-black",
    );
  });

  it("outlines the loader label and the success heading and message", () => {
    const { unmount } = render(<HoneyLoader label="Loading your job" />);
    expect(screen.getByText("Loading your job").className).toContain(
      "text-outline-black",
    );
    unmount();

    render(
      <HoneyDropSuccess
        title="Request received"
        message="We will be in touch shortly."
      />,
    );
    expect(
      screen.getByRole("heading", { name: /request received/i }).className,
    ).toContain("text-outline-black-strong");
    expect(
      screen.getByText(/we will be in touch shortly/i).className,
    ).toContain("text-outline-black");
  });

  it("wraps every page's content in the outlined shell", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <HomePage />
      </AppLayout>,
    );

    const shell = container.querySelector(".text-outline-black");
    expect(shell).not.toBeNull();
    // The hero heading and the footer both render inside the outlined shell,
    // so the stroke reaches every light text node on the page.
    expect(
      shell?.contains(screen.getByRole("heading", { name: /need a hand\?/i })),
    ).toBe(true);
    expect(shell?.contains(container.querySelector("footer"))).toBe(true);
  });
});

describe("the fixed honeycomb background layer stays decorative and behind content", () => {
  it("mounts a pointer-transparent, aria-hidden layer behind the shell", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const background = container.querySelector(".honeycomb-bg");
    expect(background).not.toBeNull();
    // Decorative: hidden from assistive tech.
    expect(background).toHaveAttribute("aria-hidden", "true");
    // Never intercepts clicks, so the animated scene cannot swallow input.
    expect(background?.className).toContain("pointer-events-none");
    // Sits behind the content it backs.
    expect(background?.className).toContain("-z-10");
    // Fixed to the viewport so it does not scroll away from the content.
    expect(background?.className).toContain("fixed");
  });

  it("keeps the background layer mounted on Home, Request, Track and Admin", async () => {
    const home = renderWithProviders(
      <AppLayout>
        <HomePage />
      </AppLayout>,
    );
    expect(home.container.querySelector(".honeycomb-bg")).not.toBeNull();
    home.unmount();

    const request = renderWithProviders(
      <AppLayout>
        <RequestPage />
      </AppLayout>,
    );
    expect(request.container.querySelector(".honeycomb-bg")).not.toBeNull();
    request.unmount();

    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.scheduled, quote: makeQuote() }),
    );
    const track = renderWithProviders(
      <AppLayout>
        <TrackPage />
      </AppLayout>,
    );
    expect(track.container.querySelector(".honeycomb-bg")).not.toBeNull();
    track.unmount();

    const adminActor = setActor();
    adminActor.isCallerAdmin.mockResolvedValue(true);
    adminActor.listRequests.mockResolvedValue([]);
    const admin = renderWithProviders(
      <AppLayout>
        <AdminPage />
      </AppLayout>,
    );
    await waitFor(() => {
      expect(admin.container.querySelector(".honeycomb-bg")).not.toBeNull();
    });
  });

  it("keeps the background layer out of the interactive content flow", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.quoted, quote: makeQuote() }),
    );

    const user = userEvent.setup();
    const { container } = renderWithProviders(
      <AppLayout>
        <TrackPage />
      </AppLayout>,
    );
    await user.type(screen.getByLabelText(/reference code/i), "HD-4F2A9C");
    await user.click(screen.getByRole("button", { name: /find my job/i }));

    // The decorative layer is present but the page's own controls still work,
    // proving the fixed overlay does not sit over the interactive content.
    expect(container.querySelector(".honeycomb-bg")).not.toBeNull();
    await user.click(
      await screen.findByRole("button", { name: /accept quote/i }),
    );
    await waitFor(() => {
      expect(actor.acceptQuote).toHaveBeenCalledWith("HD-4F2A9C");
    });
  });

  it("keeps the honey-drip edge strips decorative and behind content", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const drips = container.querySelectorAll(".honey-drip");
    expect(drips.length).toBeGreaterThanOrEqual(2);
    for (const drip of Array.from(drips)) {
      expect(drip).toHaveAttribute("aria-hidden", "true");
      expect(drip.className).toContain("pointer-events-none");
      expect(drip.className).toContain("-z-10");
    }
  });
});
