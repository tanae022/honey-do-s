import { ServiceCategory } from "@/backend";
import { HoneyLoader } from "@/components/honey/HoneyLoader";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";

const HomePage = lazy(() =>
  import("@/pages/Home").then((module) => ({ default: module.HomePage })),
);
const RequestPage = lazy(() =>
  import("@/pages/Request").then((module) => ({ default: module.RequestPage })),
);
const TrackPage = lazy(() =>
  import("@/pages/Track").then((module) => ({ default: module.TrackPage })),
);
const AdminPage = lazy(() =>
  import("@/pages/Admin").then((module) => ({ default: module.AdminPage })),
);

function PageFallback() {
  return <HoneyLoader label="Warming the hive" />;
}

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const requestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/request",
  validateSearch: (
    search: Record<string, unknown>,
  ): { service?: ServiceCategory } => {
    const value = search.service;
    if (
      typeof value === "string" &&
      (Object.values(ServiceCategory) as string[]).includes(value)
    ) {
      return { service: value as ServiceCategory };
    }
    return {};
  },
  component: RequestPage,
});

const trackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track",
  component: TrackPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  requestRoute,
  trackRoute,
  adminRoute,
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
