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
  import("@/pages/admin/Dashboard").then((module) => ({
    default: module.DashboardPage,
  })),
);
const RequestsPage = lazy(() =>
  import("@/pages/Requests").then((module) => ({
    default: module.RequestsPage,
  })),
);
const CalendarPage = lazy(() =>
  import("@/pages/Calendar").then((module) => ({
    default: module.CalendarPage,
  })),
);
const CustomersPage = lazy(() =>
  import("@/pages/Customers").then((module) => ({
    default: module.CustomersPage,
  })),
);
const CustomerProfilePage = lazy(() =>
  import("@/pages/CustomerProfile").then((module) => ({
    default: module.CustomerProfilePage,
  })),
);
const QuotesPage = lazy(() =>
  import("@/pages/Quotes").then((module) => ({ default: module.QuotesPage })),
);
const JobsPage = lazy(() =>
  import("@/pages/Jobs").then((module) => ({ default: module.JobsPage })),
);
const PaymentsPage = lazy(() =>
  import("@/pages/Payments").then((module) => ({
    default: module.PaymentsPage,
  })),
);
const MessagesPage = lazy(() =>
  import("@/pages/Messages").then((module) => ({
    default: module.MessagesPage,
  })),
);
const NotificationsPage = lazy(() =>
  import("@/pages/Notifications").then((module) => ({
    default: module.NotificationsPage,
  })),
);
const SettingsPage = lazy(() =>
  import("@/pages/admin/Settings").then((module) => ({
    default: module.SettingsPage,
  })),
);
const SchedulePage = lazy(() =>
  import("@/pages/Schedule").then((module) => ({
    default: module.SchedulePage,
  })),
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

/* ---- Admin routes ---- */

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const adminRequestsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/requests",
  component: RequestsPage,
});

const adminCalendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/calendar",
  component: CalendarPage,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/customers",
  component: CustomersPage,
});

const customerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/customers/$customerId",
  component: CustomerProfilePage,
});

const quotesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/quotes",
  component: QuotesPage,
});

const jobsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/jobs",
  component: JobsPage,
});

const paymentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/payments",
  component: PaymentsPage,
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/messages",
  component: MessagesPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/notifications",
  component: NotificationsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/settings",
  component: SettingsPage,
});

/* Legacy schedule route kept reachable for existing links. */
const scheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/schedule",
  component: SchedulePage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  requestRoute,
  trackRoute,
  adminRoute,
  adminRequestsRoute,
  adminCalendarRoute,
  customersRoute,
  customerProfileRoute,
  quotesRoute,
  jobsRoute,
  paymentsRoute,
  messagesRoute,
  notificationsRoute,
  settingsRoute,
  scheduleRoute,
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
