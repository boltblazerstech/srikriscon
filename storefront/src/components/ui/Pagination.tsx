import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i;
    if (page <= 3) return i;
    if (page >= totalPages - 4) return totalPages - 7 + i;
    return page - 3 + i;
  });

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      <PagBtn onClick={() => onPageChange(page - 1)} disabled={page === 0} aria-label="Previous">
        <ChevronLeft className="h-4 w-4" />
      </PagBtn>

      {pages[0] > 0 && (
        <>
          <PagBtn onClick={() => onPageChange(0)}>1</PagBtn>
          {pages[0] > 1 && <span className="px-1 text-muted-foreground">…</span>}
        </>
      )}

      {pages.map((p) => (
        <PagBtn key={p} active={p === page} onClick={() => onPageChange(p)}>
          {p + 1}
        </PagBtn>
      ))}

      {pages[pages.length - 1] < totalPages - 1 && (
        <>
          {pages[pages.length - 1] < totalPages - 2 && (
            <span className="px-1 text-muted-foreground">…</span>
          )}
          <PagBtn onClick={() => onPageChange(totalPages - 1)}>{totalPages}</PagBtn>
        </>
      )}

      <PagBtn
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </PagBtn>
    </nav>
  );
}

function PagBtn({
  children,
  active,
  disabled,
  onClick,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  "aria-label"?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "flex h-9 min-w-[36px] items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-muted",
        disabled && "opacity-40 pointer-events-none"
      )}
    >
      {children}
    </button>
  );
}
