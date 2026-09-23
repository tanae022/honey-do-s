import { ServiceCategory } from "@/backend";
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
}));

import { RequestPage } from "@/pages/Request";

beforeEach(() => {
  setActor();
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

describe("RequestPage", () => {
  it("renders the guest request form with all required fields", () => {
    renderWithProviders(<RequestPage />);

    expect(
      screen.getByRole("heading", { name: /request a honey do/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^phone$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/when works best/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/what needs doing/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send my request/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors instead of submitting an empty form", async () => {
    const actor = setActor();
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(await screen.findByText(/tell us your name/i)).toBeInTheDocument();
    expect(screen.getByText(/valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/phone number we can reach/i)).toBeInTheDocument();
    expect(actor.submitRequest).not.toHaveBeenCalled();
  });

  it("submits a valid guest request and shows the reference code", async () => {
    const actor = setActor();
    actor.submitRequest.mockResolvedValue("HD-4F2A9C");
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    await waitFor(() => {
      expect(actor.submitRequest).toHaveBeenCalledTimes(1);
    });
    const input = actor.submitRequest.mock.calls[0][0];
    expect(input).toMatchObject({
      customerName: "Jamie Rivera",
      email: "jamie@example.com",
      phone: "(555) 123-4567",
      preferredTiming: "Weekday mornings",
      description: "The kitchen faucet drips constantly.",
      category: ServiceCategory.fixIt,
    });

    expect(await screen.findByText("HD-4F2A9C")).toBeInTheDocument();
    expect(screen.getByText(/your request is in/i)).toBeInTheDocument();
  });

  it("lets the guest pick a different service category", async () => {
    const actor = setActor();
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    await user.click(screen.getByRole("button", { name: /mowing/i }));
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    await waitFor(() => {
      expect(actor.submitRequest).toHaveBeenCalledTimes(1);
    });
    expect(actor.submitRequest.mock.calls[0][0]).toMatchObject({
      category: ServiceCategory.mowing,
    });
  });

  it("shows a submit error when the backend rejects the request", async () => {
    const actor = setActor();
    actor.submitRequest.mockRejectedValue(new Error("boom"));
    const user = userEvent.setup();
    renderWithProviders(<RequestPage />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /send my request/i }));

    expect(
      await screen.findByText(/couldn't send your request/i),
    ).toBeInTheDocument();
  });
});
