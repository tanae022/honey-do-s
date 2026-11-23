import { AdminButton } from "@/components/admin/AdminButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AdminConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Use the destructive treatment for irreversible actions. */
  destructive?: boolean;
  onConfirm: () => void;
  isPending?: boolean;
  children?: ReactNode;
}

/**
 * A confirmation dialog for irreversible admin actions. Focus is trapped by the
 * underlying Radix primitive, Escape and the cancel button both close it, and
 * the confirm action is a large, clearly labeled button.
 */
export function AdminConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  isPending = false,
  children,
}: AdminConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        data-ocid="admin.confirm_dialog"
        className={cn(
          "admin-shell border-[oklch(var(--admin-border))] bg-[oklch(var(--admin-surface))] text-[oklch(var(--admin-foreground))]",
        )}
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-[oklch(var(--admin-foreground))]">
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-base text-[oklch(var(--admin-muted-foreground))]">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel asChild>
            <AdminButton
              variant="secondary"
              data-ocid="admin.confirm_cancel_button"
              disabled={isPending}
            >
              {cancelLabel}
            </AdminButton>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <AdminButton
              variant={destructive ? "danger" : "primary"}
              data-ocid="admin.confirm_button"
              disabled={isPending}
              onClick={(event) => {
                event.preventDefault();
                onConfirm();
              }}
            >
              {isPending ? "Working…" : confirmLabel}
            </AdminButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
