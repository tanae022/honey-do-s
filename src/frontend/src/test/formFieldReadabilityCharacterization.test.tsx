import { JobStatus } from "@/backend";
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
 * Characterization baseline for the form-field readability rework.
 *
 * The accepted request intentionally changes the text and placeholder styling
 * of the shared Input/Textarea/select surfaces, so the exact text color,
 * placeholder color and outline classes are deliberately NOT pinned here. What
 * is pinned is the adjacent working behavior that must survive the restyle:
 *
 *  - the request form's name, email, phone, timing and description fields still
 *    accept typed text and still submit, returning the reference code;
 *  - an invalid field still carries `aria-invalid` and its inline error, so the
 *    invalid-field treatment has a hook to render against;
 *  - the shared fields still carry a focus-visible ring class, so the focus
 *    treatment has a hook to render against;
 *  - the admin quote amount and quote note fields still accept typed text and
 *    still send the parsed amount and note to the backend;
 *  - the owner alert email and phone fields still accept typed text;
 *  - a non-admin visitor still never reaches the admin dashboard.
 *
 * The backend is mocked, so these are component/integration assertions about
 * what the frontend renders and which actor calls it makes — not proof of
 * deployed behavior.
 */
beforeEach(() => {
  setActor();
  window.localStorage.clear();
});

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

describe("request form fields still accept text and submit", () => {
  it("keeps typed text in every field and returns the reference code", async () => {
    const actor = setActor();
    actor.submitRequest.mockResolvedValue("HD-4F2A9C");
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    await fillValidForm(user);

    // The typed wording is retained in each field after the restyle.
    expect(screen.getByLabelText(/your name/i)).toHaveValue("Jamie Rivera");
    expect(screen.getByLabelText(/^email$/i)).toHaveValue("jamie@example.com");
    expect(screen.getByLabelText(/^phone$/i)).toHaveValue("(555) 123-4567");
    expect(screen.getByLabelText(/when works best/i)).toHaveValue(
      "Weekday mornings",
    );
    expect(screen.getByLabelText(/what needs doing/i)).toHaveValue(
      "The kitchen faucet drips constantly.",
    );

    await user.click(screen.getByRole("button", { name: /send my request/i }));

    await waitFor(() => {
      expect(actor.submitRequest).toHaveBeenCalledTimes(1);
    });
    expect(await screen.findByText("HD-4F2A9C")).toBeInTheDocument();
  });

  it("still marks an invalid field with aria-invalid and an inline error", async () => {
    const actor = setActor();
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    await user.click(screen.getByRole("button", { name: /send my request/i }));

    const nameField = screen.getByLabelText(/your name/i);
    await waitFor(() => {
      expect(nameField).toHaveAttribute("aria-invalid", "true");
    });
    expect(await screen.findByText(/tell us your name/i)).toBeInTheDocument();
    expect(actor.submitRequest).not.toHaveBeenCalled();
  });

  it("keeps a focus-visible ring class on the shared request fields", () => {
    renderWithProviders(<RequestPage />);

    for (const label of [
      /your name/i,
      /^email$/i,
      /^phone$/i,
      /when works best/i,
      /what needs doing/i,
    ]) {
      const field = screen.getByLabelText(label);
      expect(field.className).toMatch(/focus-visible:ring/);
    }
  });
});

describe("admin quote fields still accept text and send the quote", () => {
  it("sends the parsed amount and note to the backend", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 7n, status: JobStatus.requested }),
    ]);
    actor.listBees.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const card = await waitFor(() => {
      const node = document.querySelector('[data-ocid="admin.request_card.1"]');
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    const scope = within(card);

    const amount = scope.getByLabelText(/quote amount/i);
    const note = scope.getByLabelText(/what's included/i);
    await user.type(amount, "120.00");
    await user.type(note, "Includes parts and a two-hour visit.");

    expect(amount).toHaveValue("120.00");
    expect(note).toHaveValue("Includes parts and a two-hour visit.");

    await user.click(scope.getByRole("button", { name: /send quote/i }));

    await waitFor(() => {
      expect(actor.setQuote).toHaveBeenCalledWith(
        7n,
        12_000n,
        "Includes parts and a two-hour visit.",
      );
    });
  });
});

describe("owner alert fields still accept text", () => {
  it("keeps typed text in the owner alert email and phone fields", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getOwnerAlertEmail.mockResolvedValue("owner@honeydo.com");
    actor.getOwnerAlertPhone.mockResolvedValue("+14053124987");

    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const email = await screen.findByLabelText(/owner alert email/i);
    await waitFor(() => expect(email).toHaveValue("owner@honeydo.com"));
    await user.clear(email);
    await user.type(email, "new@honeydo.com");
    expect(email).toHaveValue("new@honeydo.com");

    const phone = await screen.findByLabelText(/owner alert phone/i);
    await waitFor(() => expect(phone).toHaveValue("+14053124987"));
    await user.clear(phone);
    await user.type(phone, "(405) 312-4987");
    expect(phone).toHaveValue("(405) 312-4987");
  });
});

describe("guest never reaches the admin dashboard", () => {
  it("shows the access-required state instead of the dashboard", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(false);

    renderWithProviders(<AdminPage />);

    expect(
      await screen.findByText(/admin access required/i),
    ).toBeInTheDocument();
    expect(screen.queryByText("Owner alerts")).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-ocid="admin.stats_section"]'),
    ).toBeNull();
  });
});
