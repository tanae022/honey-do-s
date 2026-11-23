# Project Guidance

## User Preferences

- Honey-themed dark design system with amber/gold accents; preserve the existing visual language
- Light text must read clearly over imagery, gradients and the honeycomb background
- The honeycomb background should look realistic and dimensional and feel alive
- Form-field text and placeholders must stay clearly readable against the dark honeycomb background
- Customer information panels use solid dark chocolate/charcoal surfaces with subtle gold borders and warm ivory text, with the honeycomb pattern kept away from behind customer information
- Customer forms use clearly labeled, light-backed fields with dark text, sized for comfortable mobile entry
- Honey-themed dark design system with amber/gold accents; preserve the existing visual language on the customer-facing side
- The private admin side must be light, clean, high-contrast with white cards, large readable text, clear labels, simple tables and large buttons
- No tiny text, no overlapping panels and no decorative background behind important admin information
- Use the payment information already supplied by the owner; do not invent or change payment information
- Admin must be optimized for quick use on both phone and computer

## Accepted Requirements

- Form-field text and placeholders are given a clear outline/high-contrast treatment so typed wording is easy to read against the dark honeycomb background
- An in-app alert with a ding sound fires when a new service request comes in while the owner has the app open
- Improve the customer profile interface with solid dark panels, gold borders, ivory text and clearly visible EDIT CUSTOMER and SAVE CHANGES controls
- Make customer entry and editing quick with labeled, light-backed, mobile-sized fields, grouped inputs and dropdowns
- Auto-populate saved customer information when creating new requests or quotes and update existing customers without duplicates
- Build professional quote management with line items, labor, materials, subtotal, total, deposit, remaining balance, expiration and approval status, with save/edit/send/approve/decline/convert-to-job actions and a customer-facing layout
- Improve scheduling with a calendar view and status lists for upcoming, pending, approved, in-progress, completed and cancelled jobs, linked to the correct customer
- Improve customer notifications with visible indicators for new requests, messages, quote approvals/declines, deposits and appointment confirmations/changes
- Fix mobile responsiveness so the fixed Request a Honey Do button does not obstruct customer profile information or administrative controls
- Preserve all existing customer records, appointment data, quotes, service requests, branding, authentication and working functionality
- Sending a quote from the admin Quotes workspace emails the quote directly to the customer's email with the itemized details and a clear way to accept or decline
- The existing Track page and reference-code flow keep working

## Verified Commands

- **typecheck**: `pnpm --dir app typecheck`
- **fix**: `pnpm --dir app fix`
- **build**: `pnpm --dir app build`

## Learnings

- lib/jobs.ts STATUS_META must include the cancelled status so the UI renders it.
- Verified commands: backend mops check --fix, mops build, pnpm bindgen; frontend pnpm typecheck, pnpm fix, pnpm build; full suite pnpm --dir app test.
- The .form-field utility in src/frontend/src/index.css is the single contract for readable form text: bright --foreground text, black outline, and a lightened ::placeholder; shared Input/Textarea apply it and the raw preferred-contact select in CustomerProfile.tsx must add it manually.
- useNewRequestAlert in src/frontend/src/hooks/useJobs.ts seeds a known-id baseline on the first list load and only surfaces genuinely-new requests on later polls, so opening the dashboard never dings; NewRequestAlert.tsx is self-gated to admin and authenticated users and uses a shared Web Audio context that queues the ding until the first user interaction when autoplay is blocked.
- The quote record now carries quoteNumber, createdAt, workDescription, lineItems, laborCharge, materialsCharge, subtotal, total, depositRequired, remainingBalance, expiresAt and status; derive new quote fields identically in lib/jobs.mo and the pending migration so runtime and migrated records agree.
- NotificationKind now includes quoteApproved, quoteDeclined, appointmentConfirmed and appointmentChanged; jobs-api.mo raises them via thin wrappers over lib/notifications.mo raise helpers, and scheduleAppointment distinguishes a reschedule from a first schedule.
- Customer information panels use .honey-panel/.honey-panel-raised/.honey-panel-accent (opaque chocolate surfaces with gold hairlines) so the honeycomb never shows behind customer data.
- Light-backed customer form fields use raw inputs with an OKLCH arbitrary-value className instead of the shared Input, whose .form-field forces bright-on-dark text.
- JobRequestView carries customerName/email/phone but no customerId or service address; resolve the address by matching the job email against useCustomers() summaries, and prefer createJobForCustomer for the authoritative customer link.
- A sticky bottom submit bar overlays form content on phone widths; a static full-width action block keeps the primary action reachable without covering fields.
- The admin notification bell (unread badge, per-item and mark-all read) is mounted in Admin.tsx and backed by listNotifications/getUnreadNotificationCount/markNotificationRead/markAllNotificationsRead.
- sendQuote in src/backend/mixins/jobs-api.mo emails the itemized quote to the job's customer email and returns a per-channel outcome plus the updated job view; getQuoteByReference and declineQuoteByReference serve the emailed link; acceptQuote rejects an expired quote.
- Emailed quote accept/decline links are absolute, built by trackActionUrl from a persisted frontendOrigin (admin getFrontendOrigin/setFrontendOrigin) with a default fallback; sendQuote is the only emailing endpoint.
- The Track page reads reference/action from window.location.search so the emailed link works on the plain /track route without a router validateSearch contract.
- A new stable field needs a new migration file when the newest migration is already applied; OldActor must equal the prior migration's NewActor.
- The admin Quotes workspace surfaces the per-channel email outcome from sendQuote and guards result.ok?.email before reading it.
- The /admin route in src/frontend/src/App.tsx must resolve pages/admin/Dashboard.tsx (DashboardPage); it previously lazy-loaded the dark pages/Admin.tsx and rendered the honeycomb background behind admin information.
- Admin destination pages read window.location.search (not useSearch) so dashboard quick-action and count links work without a route validateSearch contract.
- Dashboard quick-action hrefs are pinned by adminConsoleCover.test.tsx, so create flows must be honored on the destination pages, not by changing the links.
- The admin Customers page (src/frontend/src/pages/admin/Customers.tsx) still renders a dark honeycomb background behind the Customer directory card with light text; it must use the light AdminShell/AdminCard surface like the other admin pages.
- Admin light tokens are declared once in :root in src/frontend/src/index.css and .admin-shell disables the app-wide -webkit-text-stroke; .form-field is the readable form text contract.
- AppLayout must call useRouterState() WITHOUT a selector; a selector caused a nav/dashboard crash regression.
- The deposit is exactly 10% of the final approved quote total after discounts; payment handles live in src/frontend/src/lib/jobs.ts and are owner-supplied.
- CASHAPP_HANDLE in src/frontend/src/lib/jobs.ts is the single source of truth for the Cash App tag; DEPOSIT_OPTIONS[0].url is a separate hardcoded literal that must be updated alongside it, and the admin PaymentSettingsSection placeholder carries a third copy.
- The owner-supplied Cash App business tag is $thebirdhouse2 (https://cash.app/$thebirdhouse2).
