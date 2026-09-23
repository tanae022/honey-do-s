import { JobStatus, ServiceCategory } from "@/backend";
import {
  makeBee,
  makeJob,
  makePackage,
  makeQuote,
  makeVisit,
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
}));

import { AdminPage } from "@/pages/Admin";
import { HomePage } from "@/pages/Home";
import { RequestPage } from "@/pages/Request";
import { TrackPage } from "@/pages/Track";

beforeEach(() => {
  setActor();
  window.history.replaceState({}, "", "/track");
});

async function lookupJob(reference = "HD-4F2A9C") {
  const user = userEvent.setup();
  renderWithProviders(<TrackPage />);
  await user.type(screen.getByLabelText(/reference code/i), reference);
  await user.click(screen.getByRole("button", { name: /find my job/i }));
  return user;
}

describe("customer visit history", () => {
  it("shows past visits newest first with date, service and bee", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.completed }),
    );
    actor.getVisitHistory.mockResolvedValue([
      makeVisit({
        jobId: 1n,
        service: ServiceCategory.fixIt,
        beeName: "Beatrice",
        completedAt: 1_700_000_100_000_000_000n,
      }),
      makeVisit({
        jobId: 2n,
        service: ServiceCategory.mowing,
        beeName: "Buzz",
        completedAt: 1_700_000_900_000_000_000n,
      }),
    ]);

    await lookupJob();

    await screen.findByText("Mowing");
    const list = document.querySelector(
      '[data-ocid="track.visit_history_list"]',
    );
    expect(list).not.toBeNull();
    const items = within(list as HTMLElement).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    // Newest (mowing / Buzz) must render before the older fix-it visit.
    expect(items[0]).toHaveTextContent("Mowing");
    expect(items[0]).toHaveTextContent("Buzz");
    expect(items[1]).toHaveTextContent("Fix It");
    expect(items[1]).toHaveTextContent("Beatrice");
    expect(actor.getVisitHistory).toHaveBeenCalledWith("HD-4F2A9C");
  });

  it("shows an empty state when there are no completed visits", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.completed }),
    );
    actor.getVisitHistory.mockResolvedValue([]);

    await lookupJob();

    expect(
      await screen.findByText(/no completed visits yet/i),
    ).toBeInTheDocument();
  });
});

describe("assigned bee and package status for the customer", () => {
  it("shows the assigned bee on the customer's job", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.scheduled, assignedBeeName: "Beatrice" }),
    );

    await lookupJob();

    expect(await screen.findByText("Your bee")).toBeInTheDocument();
    expect(screen.getByText("Beatrice")).toBeInTheDocument();
  });

  it("shows the monthly package status for the customer", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        packageEnrollment: makePackage({ active: true }),
      }),
    );

    await lookupJob();

    expect(await screen.findByText("Monthly package")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    // The package is priced per customer, so the card shows what is included
    // and never a dollar amount.
    expect(
      screen.getByText(/4 visits included each month/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
  });
});

describe("bee swarm celebration on quote acceptance", () => {
  it("renders the bee swarm after the customer accepts a quote", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({ status: JobStatus.quoted, quote: makeQuote() }),
    );

    const user = await lookupJob();
    await user.click(
      await screen.findByRole("button", { name: /accept quote/i }),
    );

    await waitFor(() => {
      expect(actor.acceptQuote).toHaveBeenCalledWith("HD-4F2A9C");
    });
    await waitFor(() => {
      expect(
        document.querySelector('[data-ocid="track.bee_celebration"]'),
      ).not.toBeNull();
    });
  });
});

describe("owner bee crew and package controls", () => {
  it("adds a bee with a name and specialty through the actor", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([]);
    actor.listBees.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.type(await screen.findByLabelText(/bee name/i), "Beatrice");
    await user.type(
      screen.getByLabelText(/specialty/i),
      "Deep cleaning & organizing",
    );
    await user.click(screen.getByRole("button", { name: /add bee/i }));

    await waitFor(() => {
      expect(actor.createBee).toHaveBeenCalledWith({
        name: "Beatrice",
        specialty: "Deep cleaning & organizing",
      });
    });
  });

  it("assigns a bee to a job through the actor", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([makeJob({ id: 7n })]);
    actor.listBees.mockResolvedValue([makeBee({ id: 3n, name: "Beatrice" })]);

    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    const select = await screen.findByLabelText(/assigned bee/i);
    await user.selectOptions(select, "3");
    await user.click(screen.getByRole("button", { name: /assign bee/i }));

    await waitFor(() => {
      expect(actor.assignBeeToJob).toHaveBeenCalledWith(7n, 3n);
    });
  });

  it("marks a customer as on the monthly package through the actor", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([makeJob({ id: 7n })]);
    actor.listBees.mockResolvedValue([]);

    const user = userEvent.setup();
    renderWithProviders(<AdminPage />);

    await user.click(
      await screen.findByRole("button", {
        name: /mark on monthly package/i,
      }),
    );

    await waitFor(() => {
      expect(actor.setPackageEnrollment).toHaveBeenCalledWith(7n, true);
    });
  });

  it("shows the owner the same visit history for a customer", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([makeJob({ id: 7n })]);
    actor.listBees.mockResolvedValue([]);
    actor.getCustomerVisitHistory.mockResolvedValue([
      makeVisit({
        jobId: 7n,
        service: ServiceCategory.fixIt,
        beeName: "Beatrice",
      }),
    ]);

    renderWithProviders(<AdminPage />);

    expect(
      await screen.findByText(/visit history for jamie rivera/i),
    ).toBeInTheDocument();
    expect(await screen.findByText("Fix It")).toBeInTheDocument();
    expect(screen.getByText("Beatrice")).toBeInTheDocument();
    expect(actor.getCustomerVisitHistory).toHaveBeenCalledWith(7n);
  });
});

describe("owner phone and monthly package presentation", () => {
  it("shows the owner phone number on the home page", () => {
    renderWithProviders(<HomePage />);

    const phone = screen.getByRole("link", { name: /405-312-4987/ });
    expect(phone).toHaveAttribute("href", "tel:+14053124987");
  });

  it("presents the monthly package on the home page", () => {
    renderWithProviders(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /monthly package/i }),
    ).toBeInTheDocument();
    // The package is priced per customer: the section says a monthly rate
    // exists and is set with the owner, but shows no dollar amount.
    expect(
      screen.getByText(/priced for your home, set up with the owner/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(
      screen.getByText(/no automatic recurring charges/i),
    ).toBeInTheDocument();
  });

  it("shows the owner phone number on the request page", () => {
    renderWithProviders(<RequestPage />);

    expect(
      screen.getByRole("link", { name: /call 405-312-4987/i }),
    ).toBeInTheDocument();
  });
});
