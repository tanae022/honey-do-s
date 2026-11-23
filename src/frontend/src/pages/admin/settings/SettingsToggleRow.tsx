import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SettingsToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  "data-ocid"?: string;
}

/**
 * One large, readable settings toggle: a clear label, a supporting line and a
 * comfortable switch. The whole row is a label so the tap target is generous on
 * phone and the switch stays keyboard reachable.
 */
export function SettingsToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled = false,
  ...rest
}: SettingsToggleRowProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl border border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] p-4",
        disabled && "opacity-60",
      )}
      {...rest}
    >
      <label htmlFor={id} className="min-w-0 cursor-pointer">
        <span className="block text-base font-semibold text-[oklch(var(--admin-foreground))]">
          {label}
        </span>
        <span className="mt-0.5 block text-sm text-[oklch(var(--admin-muted-foreground))]">
          {description}
        </span>
      </label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={label}
        className="mt-1 h-7 w-12 shrink-0 data-[state=checked]:bg-[oklch(var(--admin-primary))] data-[state=unchecked]:bg-[oklch(var(--admin-border-strong))] [&_[data-slot=switch-thumb]]:size-5"
      />
    </div>
  );
}
