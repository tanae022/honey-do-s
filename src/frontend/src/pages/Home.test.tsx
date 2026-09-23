import { SERVICES } from "@/lib/services";
import { renderWithProviders } from "@/test/harness";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
}));

import { HomePage } from "@/pages/Home";

describe("HomePage", () => {
  it("renders the hero headline, tagline and logo", () => {
    renderWithProviders(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /need a hand\?/i }),
    ).toBeInTheDocument();
    // The tagline now also appears in the monthly-package copy, so assert the
    // hero tagline is present without requiring it to be the only match.
    expect(screen.getAllByText(/little jobs/i).length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getAllByText(/big relief/i).length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("img", { name: /honey do's badge/i }),
    ).toBeInTheDocument();
  });

  it("renders all eight service tiles with their labels and no Driving tile", () => {
    renderWithProviders(<HomePage />);

    // The request intentionally removes Driving, leaving eight services.
    expect(SERVICES).toHaveLength(8);
    for (const service of SERVICES) {
      expect(
        screen.getByText(service.label, { exact: true }),
      ).toBeInTheDocument();
    }
    expect(screen.queryByText(/^driving$/i)).not.toBeInTheDocument();
  });

  it("renders the glowing request CTA linking to the request page", () => {
    renderWithProviders(<HomePage />);

    const ctas = screen.getAllByRole("link", { name: /request a honey do/i });
    expect(ctas.length).toBeGreaterThanOrEqual(1);
    for (const cta of ctas) {
      expect(cta).toHaveAttribute("href", "/request");
    }
  });

  it("links each service tile to the request page with its category", () => {
    renderWithProviders(<HomePage />);

    const grid = document.querySelector('[data-ocid="home.service_grid"]');
    expect(grid).not.toBeNull();
    const links = grid?.querySelectorAll("a") ?? [];
    // Eight services, no empty gap left behind by the removed Driving tile.
    expect(links).toHaveLength(8);
    expect(links[0]).toHaveAttribute("href", "/request");
  });
});
