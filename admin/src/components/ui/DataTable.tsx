"use client";

import { cn } from "@/src/lib/utils";
import EmptyState from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  cell?: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  skeletonRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
  rowKey?: (row: T, i: number) => React.Key;
  onRowClick?: (row: T) => void;
  className?: string;
}

export default function DataTable<T>({
  columns,
  data = [],
  isLoading = false,
  skeletonRows = 6,
  emptyTitle = "No data found",
  emptyDescription,
  emptyAction,
  rowKey,
  onRowClick,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("rounded-xl border border-border overflow-hidden bg-surface", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap",
                    col.headerClassName
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {!isLoading && (
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <EmptyState
                      title={emptyTitle}
                      description={emptyDescription}
                      action={emptyAction}
                    />
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={rowKey ? rowKey(row, i) : i}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      "border-b border-border last:border-0 transition-colors",
                      onRowClick && "cursor-pointer hover:bg-muted/40"
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn("px-4 py-3 text-foreground", col.className)}
                      >
                        {col.cell
                          ? col.cell(row, i)
                          : String((row as Record<string, unknown>)[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          )}
        </table>
      </div>

      {/* Skeleton */}
      {isLoading && (
        <div className="divide-y divide-border">
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div key={i} className="flex gap-4 px-4 py-3">
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="h-4 rounded bg-muted animate-pulse flex-1"
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
