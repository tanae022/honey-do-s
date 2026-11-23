import { AdminPageHeader, AdminShell } from "@/components/admin";
import { AlertSettingsSection } from "@/pages/admin/settings/AlertSettingsSection";
import { BusinessSettingsSection } from "@/pages/admin/settings/BusinessSettingsSection";
import { DepositSettingsSection } from "@/pages/admin/settings/DepositSettingsSection";
import { DiscountSettingsSection } from "@/pages/admin/settings/DiscountSettingsSection";
import { PaymentSettingsSection } from "@/pages/admin/settings/PaymentSettingsSection";
import { QuoteSettingsSection } from "@/pages/admin/settings/QuoteSettingsSection";
import { TaxSettingsSection } from "@/pages/admin/settings/TaxSettingsSection";

/**
 * Admin Settings page.
 *
 * The owner's control room: alert preferences, discount rules, deposit, tax,
 * payment, quote and business settings. Every section is a white card on the
 * light admin ground with large readable text and large tap targets, and the
 * whole page stacks cleanly on phone widths without horizontal scrolling.
 */
export function SettingsPage() {
  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Admin"
        title="Settings"
        description="Alerts, discounts, deposits, tax, payments, quotes and business details."
      />

      <div className="flex flex-col gap-6">
        <AlertSettingsSection />
        <DiscountSettingsSection />
        <DepositSettingsSection />
        <TaxSettingsSection />
        <PaymentSettingsSection />
        <QuoteSettingsSection />
        <BusinessSettingsSection />
      </div>
    </AdminShell>
  );
}
