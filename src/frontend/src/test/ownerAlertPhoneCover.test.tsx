import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, waitFor } from "@testing-library/react";
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

/**
 * Cover for the accepted owner-alert-phone and combined test-action behavior.
 *
 * The backend validates and persists the number and sends the SMS through the
 * Twilio connector; the frontend cannot observe delivery, so this file pins the
 * observable contract:
 *
 *  - the panel shows the saved alert phone and the seeded email;
 *  - saving a valid number normalizes it to E.164 and calls the backend;
 *  - an invalid number shows an inline error and never calls the backend;
 *  - a backend `invalidPhone` rejection is surfaced inline;
 *  - the combined test action reports the email and SMS outcomes separately.
 */
beforeEach(() => {
  setActor();
  window.localStorage.clear();
});

async function renderAdmin(actor = setActor()) {
  actor.isCallerAdmin.mockResolvedValue(true);
  renderWithProviders(<AdminPage />);
  await screen.findByText("Owner alerts");
  return actor;
}

describe("owner alert phone panel", () => {
  it("shows the seeded alert email and phone as the saved destinations", async () => {
    const actor = setActor();
    actor.getOwnerAlertEmail.mockResolvedValue("tanae022@gmail.com");
    actor.getOwnerAlertPhone.mockResolvedValue("+14053124987");

    await renderAdmin(actor);

    const emailInput = await screen.findByLabelText(/owner alert email/i);
    const phoneInput = await screen.findByLabelText(/owner alert phone/i);
    await waitFor(() => {
      expect(emailInput).toHaveValue("tanae022@gmail.com");
      expect(phoneInput).toHaveValue("+14053124987");
    });
  });

  it("normalizes a valid US number to E.164 and saves it", async () => {
    const actor = setActor();
    actor.getOwnerAlertPhone.mockResolvedValue("");
    actor.setOwnerAlertPhone.mockResolvedValue({
      __kind__: "ok",
      ok: "+14053124987",
    });

    await renderAdmin(actor);

    const input = await screen.findByLabelText(/owner alert phone/i);
    const user = userEvent.setup();
    await user.type(input, "(405) 312-4987");
    await user.click(screen.getByRole("button", { name: /save alert phone/i }));

    await waitFor(() => {
      expect(actor.setOwnerAlertPhone).toHaveBeenCalledWith("+14053124987");
    });
    expect(await screen.findByText(/alert phone saved/i)).toBeInTheDocument();
  });

  it("shows an inline error and does not save an invalid number", async () => {
    const actor = setActor();
    actor.getOwnerAlertPhone.mockResolvedValue("+14053124987");

    await renderAdmin(actor);

    const input = await screen.findByLabelText(/owner alert phone/i);
    await waitFor(() => expect(input).toHaveValue("+14053124987"));

    const user = userEvent.setup();
    await user.clear(input);
    await user.type(input, "12");
    await user.click(screen.getByRole("button", { name: /save alert phone/i }));

    expect(await screen.findByText(/valid phone number/i)).toBeInTheDocument();
    expect(actor.setOwnerAlertPhone).not.toHaveBeenCalled();
  });

  it("surfaces a backend invalidPhone rejection inline", async () => {
    const actor = setActor();
    actor.getOwnerAlertPhone.mockResolvedValue("+14053124987");
    actor.setOwnerAlertPhone.mockResolvedValue({
      __kind__: "err",
      err: { __kind__: "invalidPhone", invalidPhone: "Enter a valid number" },
    });

    await renderAdmin(actor);

    const input = await screen.findByLabelText(/owner alert phone/i);
    await waitFor(() => expect(input).toHaveValue("+14053124987"));

    const user = userEvent.setup();
    await user.clear(input);
    await user.type(input, "4053124987");
    await user.click(screen.getByRole("button", { name: /save alert phone/i }));

    expect(
      await screen.findByText(/enter a valid number/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/alert phone saved/i)).not.toBeInTheDocument();
  });
});

describe("combined test action reports each channel separately", () => {
  it("reports email success and SMS failure independently", async () => {
    const actor = setActor();
    actor.getOwnerAlertEmail.mockResolvedValue("tanae022@gmail.com");
    actor.getOwnerAlertPhone.mockResolvedValue("+14053124987");
    actor.sendTestAlert.mockResolvedValue({
      email: { __kind__: "sent", sent: null },
      sms: { __kind__: "failed", failed: "Twilio not configured" },
    });

    await renderAdmin(actor);

    const user = userEvent.setup();
    const testButton = await screen.findByRole("button", {
      name: /send test alert/i,
    });
    await waitFor(() => expect(testButton).toBeEnabled());
    await user.click(testButton);

    await waitFor(() => {
      expect(actor.sendTestAlert).toHaveBeenCalledTimes(1);
    });

    const emailResult = document.querySelector(
      '[data-ocid="admin.owner_alert_test_email_result"]',
    );
    const smsResult = document.querySelector(
      '[data-ocid="admin.owner_alert_test_sms_result"]',
    );
    expect(emailResult).not.toBeNull();
    expect(smsResult).not.toBeNull();
    expect(emailResult).toHaveTextContent(/sent to tanae022@gmail.com/i);
    expect(smsResult).toHaveTextContent(/twilio not configured/i);
  });

  it("reports both channels as sent when the backend succeeds", async () => {
    const actor = setActor();
    actor.getOwnerAlertEmail.mockResolvedValue("tanae022@gmail.com");
    actor.getOwnerAlertPhone.mockResolvedValue("+14053124987");
    actor.sendTestAlert.mockResolvedValue({
      email: { __kind__: "sent", sent: null },
      sms: { __kind__: "sent", sent: null },
    });

    await renderAdmin(actor);

    const user = userEvent.setup();
    const testButton = await screen.findByRole("button", {
      name: /send test alert/i,
    });
    await waitFor(() => expect(testButton).toBeEnabled());
    await user.click(testButton);

    const emailResult = await waitFor(() => {
      const node = document.querySelector(
        '[data-ocid="admin.owner_alert_test_email_result"]',
      );
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    const smsResult = document.querySelector(
      '[data-ocid="admin.owner_alert_test_sms_result"]',
    );
    expect(emailResult).toHaveTextContent(/sent to tanae022@gmail.com/i);
    expect(smsResult).toHaveTextContent(/sent to 405-312-4987/i);
  });
});
