import { JobStatus, ServiceCategory } from "@/backend";
import { CASHAPP_HANDLE } from "@/lib/jobs";
import { SERVICES } from "@/lib/services";
import { makeJob, makeQuote } from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor } from "@testing-library/react";
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
}));

import { RequestPage } from "@/pages/Request";
import { TrackPage } from "@/pages/Track";

/**
 * Characterization baseline for adjacent working behavior the current request
 * must not break.
 *
 * The request intentionally changes the Home hero line, the promise list, the
 * nine-service list (Driving is being removed), the logo sizes, and the deposit
 * card's option set. Those are deliberately NOT asserted here. What is pinned:
 *
 *  - the Cash App deposit card's copy affordance still copies the handle, and a
 *    failed copy leaves the card usable (the handle text and "I've sent it"
 *    action are already covered elsewhere);
 *  - the request form's service picker still renders one selectable tile per
 *    service and submits whichever category the guest picks.
 *
 * The picker assertions are written against the `SERVICES` list rather than a
 * hard-coded nine, so removing Driving from that list does not fail them.
 */
beforeEach(() => {
  setActor();
  window.history.replaceState({}, "", "/track");
});

afterEach(() => {
  window.history.replaceState({}, "", "/track");
});

describe("Cash App deposit card copy affordance", () => {
  it("copies the Cash App handle to the clipboard when the copy button is pressed", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    // `userEvent.setup()` installs its own clipboard stub, so spy on the stub
    // it actually installs rather than replacing `navigator.clipboard` first.
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");

    renderWithProviders(<TrackPage />);
    await user.type(screen.getByLabelText(/reference code/i), "HD-4F2A9C");
    await user.click(screen.getByRole("button", { name: /find my job/i }));

    const copyButton = await screen.findByRole("button", {
      name: /copy cash app handle/i,
    });
    await user.click(copyButton);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(CASHAPP_HANDLE);
    });
  });

  it("keeps the deposit card usable when the clipboard write fails", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        quote: makeQuote({ amount: 20_000n }),
      }),
    );

    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("denied"),
    );

    renderWithProviders(<TrackPage />);
    await user.type(screen.getByLabelText(/reference code/i), "HD-4F2A9C");
    await user.click(screen.getByRole("button", { name: /find my job/i }));

    await user.click(
      await screen.findByRole("button", { name: /copy cash app handle/i }),
    );

    // A failed copy must not remove the handle or the "I've sent it" action.
    expect(screen.getByText(CASHAPP_HANDLE)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /i've sent it/i }),
    ).toBeInTheDocument();
  });
});

describe("request form service picker", () => {
  it("renders one selectable tile per service in the shared list", () => {
    renderWithProviders(<RequestPage />);

    const grid = document.querySelector('[data-ocid="request.service_grid"]');
    expect(grid).not.toBeNull();
    const tiles = grid?.querySelectorAll("button") ?? [];
    expect(tiles).toHaveLength(SERVICES.length);
    for (const service of SERVICES) {
      expect(
        screen.getByRole("button", { name: service.label }),
      ).toBeInTheDocument();
    }
  });

  it("submits the category of whichever service tile the guest selects", async () => {
    const actor = setActor();
    actor.submitRequest.mockResolvedValue("HD-4F2A9C");
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    // Pick a non-default service from the shared list so the assertion proves
    // the tile click drives the submitted category.
    const target = SERVICES.find(
      (service) => service.category !== ServiceCategory.fixIt,
    );
    expect(target).toBeDefined();
    await user.click(
      screen.getByRole("button", { name: target?.label as string }),
    );

    await user.type(screen.getByLabelText(/your name/i), "Jamie Rivera");
    await user.type(screen.getByLabelText(/^email$/i), "jamie@example.com");
    await user.type(screen.getByLabelText(/^phone$/i), "(555) 123-4567");
    await user.type(
      screen.getByLabelText(/when works best/i),
      "Weekday mornings",
    );
    await user.type(
      screen.getByLabelText(/what needs doing/i),
      "The kitchen faucet drips constantly.",
    );
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    await waitFor(() => {
      expect(actor.submitRequest).toHaveBeenCalledTimes(1);
    });
    expect(actor.submitRequest.mock.calls[0][0]).toMatchObject({
      category: target?.category,
    });
  });
});
