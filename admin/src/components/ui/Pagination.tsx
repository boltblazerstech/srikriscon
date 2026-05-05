"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(page, totalPages);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <PageBtn
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        aria-label="Previous"
      >
        <ChevronLeft className="h-4 w-4" />
      </PageBtn>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`dots-${i}`} className="px-2 text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <PageBtn
            key={p}
            onClick={() => onPageChange(p as number)}
            active={p === page}
          >
            {(p as number) + 1}
          </PageBtn>
        )
      )}

      <PageBtn
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        aria-label="Next"
      >
        <ChevronRight className="h-4 w-4" />
      </PageBtn>
    </div>
  );
}

function PageBtn({
  children,
  onClick,
  disabled,
  active,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-8 min-w-8 px-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center",
        active
          ? "bg-primary text-primary-fg"
          : "bg-surface border border-border text-foreground hover:bg-muted",
        disabled && "opacity-40 cursor-not-allowed"
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

function buildPageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const pages: (number | "…")[] = [];
  const addPage = (p: number) => {
    if (!pages.includes(p)) pages.push(p);
  };
  addPage(0);
  if (current > 2) pages.push("…");
  for (let i = Math.max(1, current - 1); i <= Math.min(total - 2, current + 1); i++) {
    addPage(i);
  }
  if (current < total - 3) pages.push("…");
  addPage(total - 1);
  return pages;
}
