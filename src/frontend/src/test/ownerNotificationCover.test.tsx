import { makeJob } from "@/test/fixtures";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor, within } from "@testing-library/react";
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

import { AdminPage } from "@/pages/Admin";
import { RequestPage } from "@/pages/Request";

/**
 * Cover for the accepted owner-notification behavior.
 *
 * The backend sends the owner an email on every submitted request and swallows
 * any email failure, so the request is still created and its reference code is
 * still returned. The frontend cannot observe email delivery, so this file
 * pins the observable contract around it:
 *
 *  - a submit that resolves (as it does even when the email fails) reaches the
 *    success screen and returns the reference code;
 *  - the request that was created is visible to the owner in the dashboard,
 *    with the customer's email and phone for follow-up;
 *  - the request page exposes the owner's phone as a tap-to-call link.
 */
beforeEach(() => {
  setActor();
});

const OWNER_PHONE_HREF = "tel:+14053124987";

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
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
}

describe("owner notification does not block the request", () => {
  it("returns the reference code and shows the created request in the owner dashboard", async () => {
    // The backend creates the job and returns the reference code even when the
    // owner email fails; the frontend observes only the resolved code. The job
    // it created must then be visible to the owner for follow-up.
    const actor = setActor();
    actor.submitRequest.mockResolvedValue("HD-4F2A9C");
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 7n,
        customerName: "Jamie Rivera",
        email: "jamie@example.com",
        phone: "(555) 123-4567",
        referenceCode: "HD-4F2A9C",
      }),
    ]);

    const user = userEvent.setup();
    const { unmount } = renderWithProviders(<RequestPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    // The request succeeded despite the (unobservable) email outcome.
    expect(await screen.findByText("HD-4F2A9C")).toBeInTheDocument();
    expect(
      screen.getByText(/emailed it straight to the owner/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/couldn't send your request/i),
    ).not.toBeInTheDocument();

    // The created request is listed for the owner with contact details.
    unmount();
    renderWithProviders(<AdminPage />);

    await screen.findByText("jamie@example.com");
    const card = document.querySelector('[data-ocid="admin.request_card.1"]');
    expect(card).not.toBeNull();
    const scope = within(card as HTMLElement);
    expect(scope.getByText("jamie@example.com")).toBeInTheDocument();
    expect(scope.getByText("(555) 123-4567")).toBeInTheDocument();
  });

  it("submits the customer's contact details the owner notification carries", async () => {
    const actor = setActor();
    actor.submitRequest.mockResolvedValue("HD-4F2A9C");
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    await waitFor(() => {
      expect(actor.submitRequest).toHaveBeenCalledTimes(1);
    });
    // The notification body is built from this input, so the fields the owner
    // needs (name, email, phone, timing, description) must all be present.
    expect(actor.submitRequest.mock.calls[0][0]).toMatchObject({
      customerName: "Jamie Rivera",
      email: "jamie@example.com",
      phone: "(555) 123-4567",
      preferredTiming: "Weekday mornings",
      description: "The kitchen faucet drips constantly.",
    });
  });
});

describe("request page owner phone", () => {
  it("exposes the owner phone as a tap-to-call link on the request form", () => {
    renderWithProviders(<RequestPage />);

    const callLink = screen.getByRole("link", {
      name: /call 405-312-4987/i,
    });
    expect(callLink).toHaveAttribute("href", OWNER_PHONE_HREF);
  });
});
