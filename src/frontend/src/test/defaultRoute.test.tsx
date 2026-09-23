import {
  installCoreInfrastructureMocks,
  renderWithProviders,
} from "@/test/harness";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

installCoreInfrastructureMocks();

/**
 * The default route must render real content rather than a blank screen. This
 * file deliberately does NOT mock `@tanstack/react-router`, so importing `App`
 * wires the actual route tree and the real `AppLayout` shell. jsdom starts at
 * "/", which is the default route.
 *
 * The request reworks the bee artwork and the honeycomb background, so this
 * pins only the observable outcome: the shell mounts, the fixed honeycomb
 * background layer is present, and the home page hero resolves.
 */
describe("default route", () => {
  it("mounts the app shell with the honeycomb background and home content", async () => {
    const { default: App } = await import("@/App");
    const { container } = renderWithProviders(<App />);

    // The default route resolves to the home page's hero, not an empty shell.
    expect(
      await screen.findByRole("heading", { name: /need a hand\?/i }),
    ).toBeInTheDocument();

    // The fixed honeycomb-and-honey background layer is present behind the app.
    expect(container.querySelector(".honeycomb-bg")).not.toBeNull();
  });
});
