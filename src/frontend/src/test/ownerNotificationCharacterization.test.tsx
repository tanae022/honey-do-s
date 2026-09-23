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

import { AppLayout } from "@/components/layout/AppLayout";
import { AdminPage } from "@/pages/Admin";
import { RequestPage } from "@/pages/Request";

/**
 * Characterization baseline for the owner-notification surface the current
 * request must not break.
 *
 * The request intentionally changes how the owner is notified by email, so the
 * email delivery itself is deliberately NOT asserted here. What is pinned is
 * the adjacent working behavior that must survive:
 *
 *  - a submitted request still returns its reference code and the success
 *    screen still confirms the request reached the owner;
 *  - the success screen still exposes the owner's phone as a tap-to-call link;
 *  - the site footer still exposes the owner's phone as a tap-to-call link;
 *  - the owner dashboard still shows each request's customer email and phone;
 *  - a submit that resolves (as the backend does even when email delivery
 *    fails) still reaches the success screen rather than an error state.
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

describe("request success screen", () => {
  it("confirms the request was sent to the owner and shows the reference code", async () => {
    const actor = setActor();
    actor.submitRequest.mockResolvedValue("HD-4F2A9C");
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(await screen.findByText("HD-4F2A9C")).toBeInTheDocument();
    expect(
      screen.getByText(/emailed it straight to the owner/i),
    ).toBeInTheDocument();
  });

  it("exposes the owner phone as a tap-to-call link on the success screen", async () => {
    const actor = setActor();
    actor.submitRequest.mockResolvedValue("HD-4F2A9C");
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    await screen.findByText("HD-4F2A9C");
    const callLink = document.querySelector(
      '[data-ocid="request.success_call_link"]',
    );
    expect(callLink).not.toBeNull();
    expect(callLink).toHaveAttribute("href", OWNER_PHONE_HREF);
    expect(callLink).toHaveTextContent("405-312-4987");
  });

  it("still reaches the success screen when the submit resolves despite a notification failure", async () => {
    // The backend creates the job and returns the reference code even when the
    // owner email fails; the frontend observes only the resolved code.
    const actor = setActor();
    actor.submitRequest.mockResolvedValue("HD-4F2A9C");
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(await screen.findByText("HD-4F2A9C")).toBeInTheDocument();
    expect(
      screen.queryByText(/couldn't send your request/i),
    ).not.toBeInTheDocument();
  });
});

describe("site footer owner phone", () => {
  it("exposes the owner phone as a tap-to-call link", () => {
    renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const footer = screen.getByRole("contentinfo");
    const callLink = within(footer).getByRole("link", {
      name: /405-312-4987/,
    });
    expect(callLink).toHaveAttribute("href", OWNER_PHONE_HREF);
  });
});

describe("owner dashboard customer contact details", () => {
  it("shows each request's customer email and phone", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 7n,
        customerName: "Jamie Rivera",
        email: "jamie@example.com",
        phone: "(555) 123-4567",
      }),
    ]);

    renderWithProviders(<AdminPage />);

    await screen.findByText("jamie@example.com");
    const card = document.querySelector('[data-ocid="admin.request_card.1"]');
    expect(card).not.toBeNull();
    const scope = within(card as HTMLElement);
    expect(scope.getByText("jamie@example.com")).toBeInTheDocument();
    expect(scope.getByText("(555) 123-4567")).toBeInTheDocument();
  });

  it("renders the customer email and phone as mailto:/tel: links", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 7n,
        email: "jamie@example.com",
        phone: "(555) 123-4567",
      }),
    ]);

    renderWithProviders(<AdminPage />);

    await screen.findByText("jamie@example.com");
    const emailLink = document.querySelector(
      '[data-ocid="admin.request_email_link.1"]',
    );
    const phoneLink = document.querySelector(
      '[data-ocid="admin.request_phone_link.1"]',
    );
    expect(emailLink).not.toBeNull();
    expect(phoneLink).not.toBeNull();
    expect(emailLink).toHaveAttribute("href", "mailto:jamie@example.com");
    // The card strips formatting from the stored phone before building the
    // dialer link, so "(555) 123-4567" becomes "tel:5551234567".
    expect(phoneLink).toHaveAttribute("href", "tel:5551234567");
  });

  it("keeps the customer contact details visible alongside the quote controls", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 7n,
        email: "jamie@example.com",
        phone: "(555) 123-4567",
      }),
    ]);

    renderWithProviders(<AdminPage />);

    await screen.findByText("jamie@example.com");
    const card = document.querySelector('[data-ocid="admin.request_card.1"]');
    expect(card).not.toBeNull();
    const scope = within(card as HTMLElement);
    await waitFor(() => {
      expect(scope.getByText("jamie@example.com")).toBeInTheDocument();
    });
    expect(scope.getByLabelText(/quote amount/i)).toBeInTheDocument();
  });
});
