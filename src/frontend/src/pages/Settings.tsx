import { AdminPageHeader, AdminShell } from "@/components/admin";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Settings } from "lucide-react";

/**
 * Admin Settings page.
 *
 * The shared admin foundation registers this route and renders the light admin
 * shell; the dedicated page task fills in the settings body.
 */
export function SettingsPage() {
  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Admin"
        title="Settings"
        description="Tax, deposits, quotes, business details and alert preferences."
      />
      <AdminEmptyState
        data-ocid="admin.settings.empty_state"
        icon={<Settings className="size-6" />}
        title="Settings"
        description="The settings workspace is being prepared."
      />
    </AdminShell>
  );
}
