import { JobStatus } from "@/backend";
import {
  makeCustomerProfile,
  makeCustomerView,
  makeJob,
} from "@/test/fixtures";
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
  useParams: () => ({ customerId: "1" }),
  useRouterState: () => ({ location: { pathname: "/" } }),
}));

import { AdminPage } from "@/pages/Admin";
import { CustomerProfilePage } from "@/pages/CustomerProfile";
import { RequestPage } from "@/pages/Request";

/**
 * Cover for the accepted form-field readability rework.
 *
 * Every text-entry surface now carries the shared `form-field` treatment: the
 * bright outlined text and the lightened placeholder are owned by that class in
 * `index.css`, so the observable frontend contract is that each field opts into
 * it. The exact colors are intentionally not pinned (they are the accepted
 * change); what is pinned is that the treatment reaches every form surface and
 * that focus and invalid states still have their hooks.
 *
 * The backend is mocked, so these are component/integration assertions about
 * what the frontend renders — not proof of deployed behavior.
 */
beforeEach(() => {
  setActor();
  window.localStorage.clear();
});

describe("request form fields carry the shared readable treatment", () => {
  it("applies the form-field class to every text field", () => {
    renderWithProviders(<RequestPage />);

    for (const label of [
      /your name/i,
      /^email$/i,
      /^phone$/i,
      /when works best/i,
      /what needs doing/i,
    ]) {
      const field = screen.getByLabelText(label);
      expect(field.className).toMatch(/\bform-field\b/);
    }
  });

  it("keeps the focus-visible ring and invalid hooks on the fields", async () => {
    const actor = setActor();
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    const nameField = screen.getByLabelText(/your name/i);
    expect(nameField.className).toMatch(/focus-visible:ring/);

    await user.click(screen.getByRole("button", { name: /send my request/i }));

    await waitFor(() => {
      expect(nameField).toHaveAttribute("aria-invalid", "true");
    });
    expect(await screen.findByText(/tell us your name/i)).toBeInTheDocument();
    expect(actor.submitRequest).not.toHaveBeenCalled();
  });
});

describe("admin quote fields carry the shared readable treatment", () => {
  it("applies the form-field class to the quote amount and note fields", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({ id: 7n, status: JobStatus.requested }),
    ]);
    actor.listBees.mockResolvedValue([]);

    renderWithProviders(<AdminPage />);

    const card = await waitFor(() => {
      const node = document.querySelector('[data-ocid="admin.request_card.1"]');
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    const scope = within(card);

    expect(scope.getByLabelText(/quote amount/i).className).toMatch(
      /\bform-field\b/,
    );
    expect(scope.getByLabelText(/what's included/i).className).toMatch(
      /\bform-field\b/,
    );
  });
});

describe("owner alert fields carry the shared readable treatment", () => {
  it("applies the form-field class to the owner alert email and phone fields", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getOwnerAlertEmail.mockResolvedValue("owner@honeydo.com");
    actor.getOwnerAlertPhone.mockResolvedValue("+14053124987");

    renderWithProviders(<AdminPage />);

    const email = await screen.findByLabelText(/owner alert email/i);
    expect(email.className).toMatch(/\bform-field\b/);

    const phone = await screen.findByLabelText(/owner alert phone/i);
    expect(phone.className).toMatch(/\bform-field\b/);
  });
});

describe("customer profile fields carry the shared readable treatment", () => {
  it("applies the form-field class to the edit, note and request fields", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.getCustomerProfile.mockResolvedValue(
      makeCustomerProfile({
        customer: makeCustomerView({ fullName: "Ada Lovelace" }),
      }),
    );

    const user = userEvent.setup();
    renderWithProviders(<CustomerProfilePage />);

    await screen.findByText("Ada Lovelace");

    await user.click(screen.getByRole("button", { name: /edit contact/i }));
    expect(screen.getByLabelText(/full name/i).className).toMatch(
      /\bform-field\b/,
    );
    expect(
      screen.getByLabelText(/preferred contact method/i).className,
    ).toMatch(/\bform-field\b/);

    await user.click(
      document.querySelector(
        '[data-ocid="customer_profile.add_note_button"]',
      ) as HTMLElement,
    );
    expect(screen.getByLabelText(/internal note/i).className).toMatch(
      /\bform-field\b/,
    );

    await user.click(
      screen.getByRole("button", { name: /new service request/i }),
    );
    expect(screen.getByLabelText(/when works best/i).className).toMatch(
      /\bform-field\b/,
    );
    expect(screen.getByLabelText(/what needs doing/i).className).toMatch(
      /\bform-field\b/,
    );
  });
});
