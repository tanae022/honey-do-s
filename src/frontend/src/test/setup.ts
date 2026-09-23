import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom does not implement `window.matchMedia`, which the reduced-motion-aware
// bee-swarm celebration reads. Provide a minimal, controllable stub so the
// component can mount; tests that care about reduced motion override it.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// React Testing Library does not auto-clean when Vitest globals are disabled.
afterEach(() => {
  cleanup();
});
