import { JobStatus } from "@/backend";
import { PACKAGE_BILLING_NOTE } from "@/lib/jobs";
import { makeJob, makePackage } from "@/test/fixtures";
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
import { HomePage } from "@/pages/Home";
import { RequestPage } from "@/pages/Request";
import { TrackPage } from "@/pages/Track";

/**
 * Cover for the accepted request: the fixed monthly package price is gone from
 * every surface, the package is described as priced per customer, every word
 * carries a black outline, and the header logo is enlarged without crowding the
 * nav or sign-in controls.
 *
 * The backend is mocked, so these are component/integration assertions about
 * what the frontend renders and which actor calls it makes — not proof of
 * deployed behavior.
 */

/** Any rendered dollar amount, e.g. "$199.00" or "$199". */
const DOLLAR_AMOUNT = /\$\s?\d/;

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

describe("no monthly package dollar amount is displayed", () => {
  it("shows no dollar amount on the Home package section", () => {
    renderWithProviders(<HomePage />);

    const section = document.querySelector(
      '[data-ocid="home.package_section"]',
    );
    expect(section).not.toBeNull();
    const scope = within(section as HTMLElement);

    // The package still exists and is priced per customer.
    expect(
      scope.getByRole("heading", { name: /monthly package/i }),
    ).toBeInTheDocument();
    expect(
      scope.getByText(/priced for your home, set up with the owner/i),
    ).toBeInTheDocument();
    // Included visits and the CTA with the owner phone remain.
    expect(scope.getByText(/visits included each month/i)).toBeInTheDocument();
    expect(
      scope.getByRole("link", { name: /ask about the package/i }),
    ).toHaveAttribute("href", "/request");
    expect(scope.getByRole("link", { name: /405-312-4987/ })).toHaveAttribute(
      "href",
      "tel:+14053124987",
    );
    // No dollar amount anywhere in the section.
    expect(scope.queryByText(DOLLAR_AMOUNT)).not.toBeInTheDocument();
  });

  it("shows no dollar amount on the Request package interest copy", () => {
    renderWithProviders(<RequestPage />);

    expect(
      screen.getByText(/ask about the monthly package/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(DOLLAR_AMOUNT)).not.toBeInTheDocument();
  });

  it("shows no monthly price row on the Track package card", async () => {
    const actor = setActor();
    actor.getRequestByReference.mockResolvedValue(
      makeJob({
        status: JobStatus.scheduled,
        packageEnrollment: makePackage({ active: true, includedVisits: 4n }),
      }),
    );

    await lookupJob();

    const card = await waitFor(() => {
      const node = document.querySelector('[data-ocid="track.package_card"]');
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    const scope = within(card);

    // Status, included visits and member-since date are shown.
    expect(scope.getByText("Active")).toBeInTheDocument();
    expect(
      scope.getByText(/4 visits included each month/i),
    ).toBeInTheDocument();
    expect(scope.getByText(/member since/i)).toBeInTheDocument();
    // The per-customer rate note is present, but no dollar amount is.
    expect(
      scope.getByText(/your monthly rate is set with the owner/i),
    ).toBeInTheDocument();
    expect(scope.queryByText(DOLLAR_AMOUNT)).not.toBeInTheDocument();
  });

  it("shows no monthly price value on the Admin package panel", async () => {
    const actor = setActor();
    actor.isCallerAdmin.mockResolvedValue(true);
    actor.listRequests.mockResolvedValue([
      makeJob({
        id: 7n,
        packageEnrollment: makePackage({ active: true, includedVisits: 4n }),
      }),
    ]);
    actor.listBees.mockResolvedValue([]);

    renderWithProviders(<AdminPage />);

    const panel = await waitFor(() => {
      const node = document.querySelector(
        '[data-ocid="admin.package_panel.1"]',
      );
      expect(node).not.toBeNull();
      return node as HTMLElement;
    });
    const scope = within(panel);

    expect(scope.getByText("Monthly package")).toBeInTheDocument();
    expect(
      scope.getByText(/4 visits included each month/i),
    ).toBeInTheDocument();
    expect(
      scope.getByRole("button", { name: /cancel package/i }),
    ).toBeInTheDocument();
    expect(scope.queryByText(DOLLAR_AMOUNT)).not.toBeInTheDocument();
  });
});

describe("app-wide black text outline", () => {
  it("applies the outline utility to the shell and its text surfaces", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    // The shell root carries the app-wide outline class.
    expect(container.querySelector(".text-outline-black")).not.toBeNull();
    // The brand wordmark uses the heavier outline variant.
    expect(
      container.querySelector(".text-outline-black-strong"),
    ).not.toBeNull();
  });

  it("renders headings, body copy, buttons and footer inside the outlined shell", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <HomePage />
      </AppLayout>,
    );

    // The shell root carries the app-wide outline class, so every descendant
    // text node inherits the stroke through the base `body, body *` rule.
    const shell = container.querySelector(".text-outline-black");
    expect(shell).not.toBeNull();

    // Headings, body copy, buttons and the footer all render inside that shell.
    expect(
      screen.getByRole("heading", { name: /need a hand\?/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /request a honey do/i }).length,
    ).toBeGreaterThanOrEqual(1);
    expect(container.querySelector("footer")).not.toBeNull();
    expect(shell?.contains(container.querySelector("footer"))).toBe(true);
  });

  it("applies the strong outline to the footer brand wordmark", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();
    // The footer brand wordmark carries the strong outline.
    expect(footer?.querySelector(".text-outline-black-strong")).not.toBeNull();
  });
});

describe("enlarged header logo", () => {
  it("renders a larger logo that keeps nav and sign-in controls present", () => {
    renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const logo = screen.getByRole("img", { name: /honey do's/i });
    // The logo is enlarged beyond the previous 56px (size-14) baseline and
    // scales down on small screens. The accepted request raised it to
    // size-20/24/28.
    expect(logo.className).toContain("size-20");
    expect(logo.className).toMatch(/sm:size-24/);
    expect(logo.className).toMatch(/md:size-28/);
    // It is not left at the old baseline size.
    expect(logo.className).not.toContain("size-14");
    expect(logo.className).not.toMatch(/sm:size-16/);
    expect(logo.className).not.toMatch(/md:size-20/);

    // Nav and sign-in controls still render alongside the larger logo.
    expect(
      screen.getByRole("navigation", { name: /primary/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open menu/i }),
    ).toBeInTheDocument();
  });

  it("scales the wordmark and bee accent together with the enlarged logo", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const header = container.querySelector("header");
    expect(header).not.toBeNull();

    // The wordmark carries the enlarged responsive steps.
    const wordmark = within(header as HTMLElement).getByText("Honey Do's");
    expect(wordmark.className).toMatch(/text-2xl/);
    expect(wordmark.className).toMatch(/sm:text-3xl/);
    expect(wordmark.className).toMatch(/md:text-4xl/);

    // The bee accent on the logo carries the matching enlarged steps, so the
    // wordmark and bee stay visually balanced at the larger size.
    const bee = header?.querySelector(".animate-bee-hover");
    expect(bee).not.toBeNull();
    expect(bee?.className).toMatch(/h-7/);
    expect(bee?.className).toMatch(/w-10/);
    expect(bee?.className).toMatch(/sm:h-8/);
    expect(bee?.className).toMatch(/sm:w-11/);
    expect(bee?.className).toMatch(/md:h-9/);
    expect(bee?.className).toMatch(/md:w-12/);
  });

  it("keeps the footer brand mark at its existing smaller size", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();

    // The footer bee keeps its fixed h-5 w-7 size, with no header enlargement.
    const footerBee = footer?.querySelector(".animate-bee-hover");
    expect(footerBee).not.toBeNull();
    expect(footerBee?.className).toContain("h-5");
    expect(footerBee?.className).toContain("w-7");
    expect(footerBee?.className).not.toMatch(/sm:h-8/);
    expect(footerBee?.className).not.toMatch(/sm:w-11/);

    // The footer wordmark stays at text-lg, smaller than the header wordmark.
    const footerWordmark = within(footer as HTMLElement).getByText(
      "Honey Do's",
    );
    expect(footerWordmark.className).toContain("text-lg");
    expect(footerWordmark.className).not.toMatch(/md:text-4xl/);
  });

  it("keeps the mobile menu usable with the enlarged logo", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AppLayout>
        <div>page content</div>
      </AppLayout>,
    );

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const mobileNav = screen.getByRole("navigation", { name: /mobile/i });
    expect(
      within(mobileNav).getByRole("link", { name: /new request/i }),
    ).toBeInTheDocument();
  });
});
