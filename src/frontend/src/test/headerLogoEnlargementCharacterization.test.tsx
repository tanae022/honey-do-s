import { PACKAGE_BILLING_NOTE } from "@/lib/jobs";
import {
  installCoreInfrastructureMocks,
  renderWithProviders,
  setActor,
} from "@/test/harness";
import { screen, within } from "@testing-library/react";
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
import { HomePage } from "@/pages/Home";

/**
 * Characterization baseline for the header-logo enlargement request.
 *
 * The header logo's own pixel size is the behavior being intentionally changed,
 * so it is deliberately NOT pinned here. What is pinned is the adjacent working
 * behavior that must survive the enlargement:
 *
 *  - the header wordmark and bee accent keep their responsive scale steps, so
 *    they grow together with the logo rather than one outrunning the other;
 *  - the header's non-overflow layout contract (shrink-0 image, min-w-0 link,
 *    truncating wordmark, justify-between row) is intact;
 *  - the footer brand mark keeps its existing, smaller size — it must not be
 *    enlarged along with the header;
 *  - the monthly package section still states the package exists with no
 *    dollar amount;
 *  - the app-wide black outline still wraps the shell and its text surfaces.
 */

beforeEach(() => {
  setActor();
});

function renderShell() {
  return renderWithProviders(
    <AppLayout>
      <div>page content</div>
    </AppLayout>,
  );
}

describe("header wordmark and bee accent scale together", () => {
  it("keeps the responsive wordmark scale steps on the header brand", () => {
    const { container } = renderShell();

    const header = container.querySelector("header");
    expect(header).not.toBeNull();
    const wordmark = within(header as HTMLElement).getByText("Honey Do's");
    // The wordmark grows across the same breakpoints as the logo so the two
    // stay visually balanced at the enlarged size. These steps were raised
    // together with the logo by the accepted enlargement request.
    expect(wordmark.className).toMatch(/text-2xl/);
    expect(wordmark.className).toMatch(/sm:text-3xl/);
    expect(wordmark.className).toMatch(/md:text-4xl/);
    // The wordmark is the strong-outline display treatment.
    expect(wordmark.className).toContain("text-outline-black-strong");
    expect(wordmark.className).toContain("font-display");

    // The bee accent sits on the logo and keeps its own responsive scale,
    // raised in step with the logo so the pair stays balanced.
    const bee = container.querySelector("header .animate-bee-hover");
    expect(bee).not.toBeNull();
    expect(bee?.className).toMatch(/h-7/);
    expect(bee?.className).toMatch(/w-10/);
    expect(bee?.className).toMatch(/sm:h-8/);
    expect(bee?.className).toMatch(/sm:w-11/);
    expect(bee?.className).toMatch(/md:h-9/);
    expect(bee?.className).toMatch(/md:w-12/);
  });
});

describe("header layout stays non-overflowing", () => {
  it("keeps the shrink/truncate contract that prevents overlap with nav controls", () => {
    const { container } = renderShell();

    const logoLink = container.querySelector('[data-ocid="nav.logo_link"]');
    expect(logoLink).not.toBeNull();
    // The logo link may shrink and its wordmark truncates, so a wide logo
    // cannot push the nav or sign-in controls out of the row.
    expect(logoLink?.className).toContain("min-w-0");
    expect(logoLink?.className).toContain("items-center");

    const logo = screen.getByRole("img", { name: /honey do's/i });
    // The image is wrapped in a shrink-0 holder, so it never shrinks and stays
    // crisp and undistorted; object-cover keeps its aspect ratio.
    expect(logo.parentElement?.className).toContain("shrink-0");
    expect(logo.className).toContain("object-cover");

    const header = container.querySelector("header");
    const wordmark = within(header as HTMLElement).getByText("Honey Do's");
    expect(wordmark.className).toContain("truncate");

    // The header row keeps its space-between layout with a gap.
    const row = logoLink?.parentElement;
    expect(row?.className).toContain("justify-between");
    expect(row?.className).toMatch(/gap-3/);
  });

  it("keeps the primary nav, sign-in control and mobile toggle present", () => {
    renderShell();

    const nav = screen.getByRole("navigation", { name: /primary/i });
    expect(
      within(nav).getByRole("link", { name: /home/i }),
    ).toBeInTheDocument();
    expect(
      within(nav).getByRole("link", { name: /new request/i }),
    ).toBeInTheDocument();
    expect(
      within(nav).getByRole("link", { name: /track job/i }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open menu/i }),
    ).toBeInTheDocument();
  });

  it("keeps the mobile menu usable alongside the enlarged logo", async () => {
    const user = userEvent.setup();
    renderShell();

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const mobileNav = screen.getByRole("navigation", { name: /mobile/i });
    expect(
      within(mobileNav).getByRole("link", { name: /new request/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(
      screen.queryByRole("navigation", { name: /mobile/i }),
    ).not.toBeInTheDocument();
  });
});

describe("footer brand mark is not enlarged with the header", () => {
  it("keeps the footer bee and wordmark at their existing smaller size", () => {
    const { container } = renderShell();

    const footer = container.querySelector("footer");
    expect(footer).not.toBeNull();

    // The footer bee keeps its fixed h-5 w-7 size and carries no responsive
    // enlargement steps.
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
});

describe("monthly package still exists without a dollar amount", () => {
  it("shows the package label and billing note with no dollar amount", () => {
    renderWithProviders(<HomePage />);

    const section = document.querySelector(
      '[data-ocid="home.package_section"]',
    );
    expect(section).not.toBeNull();
    const scope = within(section as HTMLElement);

    expect(
      scope.getByRole("heading", { name: /monthly package/i }),
    ).toBeInTheDocument();
    // The price slot states the package is priced per home, not a number.
    const priceLabel = document.querySelector(
      '[data-ocid="home.package_price"]',
    );
    expect(priceLabel).not.toBeNull();
    expect(priceLabel?.textContent ?? "").not.toMatch(/\$\s?\d/);
    expect(priceLabel?.textContent ?? "").toMatch(/priced for your home/i);
    expect(scope.getByText(PACKAGE_BILLING_NOTE)).toBeInTheDocument();
  });
});

describe("app-wide black outline remains applied", () => {
  it("wraps the shell and its text surfaces in the outline treatment", () => {
    const { container } = renderWithProviders(
      <AppLayout>
        <HomePage />
      </AppLayout>,
    );

    // The shell root carries the app-wide outline class, so every descendant
    // text node inherits the stroke through the base `body, body *` rule.
    const shell = container.querySelector(".text-outline-black");
    expect(shell).not.toBeNull();

    // Headings and body copy render inside that outlined shell.
    expect(
      screen.getByRole("heading", { name: /need a hand\?/i }),
    ).toBeInTheDocument();
    expect(shell?.contains(container.querySelector("footer"))).toBe(true);
  });
});
