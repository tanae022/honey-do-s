import type { backendInterface } from "@/backend";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderResult, render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { vi } from "vitest";
import { type MockActor, createMockActor } from "./mockActor";

/**
 * The actor and identity seams the app reads through `@caffeineai/core-infrastructure`.
 * Tests install these with `vi.mock` before importing the component under test.
 */
export interface ActorHarness {
  actor: MockActor;
  isFetching: boolean;
}

let currentHarness: ActorHarness | null = null;

/** Mutable identity state the hoisted `vi.mock` factory reads at call time. */
export const identityState = {
  isAuthenticated: false,
  loginStatus: "idle" as string,
};

/** Point the mocked `useActor` at a specific actor for the next render. */
export function setActor(
  actor: MockActor = createMockActor(),
  isFetching = false,
): MockActor {
  currentHarness = { actor, isFetching };
  return actor;
}

export function getActor(): MockActor {
  if (!currentHarness) {
    currentHarness = { actor: createMockActor(), isFetching: false };
  }
  return currentHarness.actor;
}

/**
 * Install the module mocks for `@caffeineai/core-infrastructure`. Call this at
 * the top of a test file, before importing any component that uses the hooks.
 */
export function installCoreInfrastructureMocks(options?: {
  isAuthenticated?: boolean;
  loginStatus?: string;
}) {
  identityState.isAuthenticated = options?.isAuthenticated ?? false;
  identityState.loginStatus = options?.loginStatus ?? "idle";

  vi.mock("@caffeineai/core-infrastructure", () => ({
    useActor: () => {
      const harness = currentHarness ?? {
        actor: createMockActor(),
        isFetching: false,
      };
      return { actor: harness.actor, isFetching: harness.isFetching };
    },
    useInternetIdentity: () => ({
      identity: undefined,
      login: vi.fn(),
      clear: vi.fn(),
      loginStatus: identityState.loginStatus,
      isInitializing: false,
      isLoginIdle: identityState.loginStatus === "idle",
      isLoggingIn: identityState.loginStatus === "logging-in",
      isLoginSuccess: identityState.loginStatus === "success",
      isLoginError: identityState.loginStatus === "loginError",
      isAuthenticated: identityState.isAuthenticated,
    }),
    InternetIdentityProvider: ({ children }: { children: ReactNode }) =>
      children,
    loadConfig: vi.fn().mockResolvedValue({
      backend_host: "http://localhost:4943",
      bucket_name: "test-bucket",
      storage_gateway_url: "http://localhost:4943",
      backend_canister_id: "aaaaa-aa",
      project_id: "test-project",
    }),
    createActorWithConfig: vi.fn(),
    loadMockBackendFromModules: vi.fn(),
  }));
}

/** A fresh QueryClient per render so cached queries never leak between tests. */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0, staleTime: 0 },
      mutations: { retry: false },
    },
  });
}

export function renderWithProviders(
  ui: ReactElement,
  queryClient: QueryClient = makeQueryClient(),
): RenderResult & { queryClient: QueryClient } {
  const result = render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
  return { ...result, queryClient };
}

export type { MockActor };
export type { backendInterface };
