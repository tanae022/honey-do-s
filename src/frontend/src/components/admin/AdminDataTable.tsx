import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface AdminColumn<T> {
  /** Stable identity for the column. */
  key: string;
  /** Column header label. */
  header: string;
  /** Cell renderer for a row. */
  cell: (row: T, index: number) => ReactNode;
  /** Right-align numeric values. */
  align?: "left" | "right";
  /** Hide this column on phone widths (still shown in the mobile card). */
  hideOnMobile?: boolean;
  /** Optional className applied to both header and cell. */
  className?: string;
}

interface AdminDataTableProps<T> {
  columns: AdminColumn<T>[];
  rows: T[];
  /** Stable identity for a row, used as the React key. */
  rowKey: (row: T, index: number) => string;
  /** Accessible caption for the table. */
  caption?: string;
  /** Rendered when there are no rows. */
  empty?: ReactNode;
  /** Optional per-row click handler. */
  onRowClick?: (row: T) => void;
  className?: string;
  "data-ocid"?: string;
}

/**
 * A simple, readable admin table.
 *
 * On desktop it renders a real `<table>` with generous row height and clear
 * dividers. On phone widths it collapses to a stacked card list so nothing ever
 * requires horizontal scrolling. Numeric columns are right-aligned.
 */
export function AdminDataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  empty,
  onRowClick,
  className,
  ...rest
}: AdminDataTableProps<T>) {
  if (rows.length === 0) {
    return <>{empty ?? null}</>;
  }

  return (
    <div className={cn("w-full", className)} {...rest}>
      {/* Desktop / tablet: a real table. */}
      <div className="hidden overflow-hidden rounded-xl border border-[oklch(var(--admin-border))] md:block">
        <table className="admin-table">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    column.align === "right" && "text-right",
                    column.className,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={rowKey(row, index)}
                data-ocid={`admin.table.row.${index + 1}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          onRowClick(row);
                        }
                      }
                    : undefined
                }
                tabIndex={onRowClick ? 0 : undefined}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      column.align === "right" && "text-right",
                      column.className,
                    )}
                  >
                    {column.cell(row, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phone: a stacked card list, no horizontal scroll. */}
      <ul className="flex flex-col gap-3 md:hidden">
        {rows.map((row, index) => (
          <li
            key={rowKey(row, index)}
            data-ocid={`admin.table.card.${index + 1}`}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            onKeyDown={
              onRowClick
                ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onRowClick(row);
                    }
                  }
                : undefined
            }
            tabIndex={onRowClick ? 0 : undefined}
            className={cn("admin-card p-4", onRowClick && "cursor-pointer")}
          >
            <dl className="grid gap-2">
              {columns
                .filter((column) => !column.hideOnMobile)
                .map((column) => (
                  <div
                    key={column.key}
                    className="flex items-start justify-between gap-3"
                  >
                    <dt className="admin-label shrink-0">{column.header}</dt>
                    <dd className="min-w-0 text-right text-base font-medium text-[oklch(var(--admin-foreground))]">
                      {column.cell(row, index)}
                    </dd>
                  </div>
                ))}
            </dl>
          </li>
        ))}
      </ul>
    </div>
  );
}
