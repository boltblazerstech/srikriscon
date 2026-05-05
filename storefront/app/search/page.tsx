"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/src/hooks/useProducts";
import ProductGrid from "@/src/components/product/ProductGrid";
import Pagination from "@/src/components/ui/Pagination";
import Spinner from "@/src/components/ui/Spinner";
import EmptyState from "@/src/components/ui/EmptyState";
import { Search } from "lucide-react";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const [page, setPage] = useState(0);
  const { data: results, isLoading } = useProducts({ search: q, page, size: 12 });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Search className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-xl font-bold text-foreground">
          {q ? `Results for "${q}"` : "Search Products"}
        </h1>
        {results && (
          <span className="text-sm text-muted-foreground">({results.totalElements})</span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !results || results.content.length === 0 ? (
        <EmptyState
          title={q ? `No results for "${q}"` : "Enter a search term"}
          description={q ? "Try a different keyword or browse all products." : undefined}
          action={{ label: "Browse All", onClick: () => (window.location.href = "/products") }}
        />
      ) : (
        <>
          <ProductGrid products={results.content} />
          <div className="mt-8">
            <Pagination page={page} totalPages={results.totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}
