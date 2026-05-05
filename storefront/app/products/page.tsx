"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useProducts } from "@/src/hooks/useProducts";
import { useCategories } from "@/src/hooks/useCategories";
import ProductGrid from "@/src/components/product/ProductGrid";
import Pagination from "@/src/components/ui/Pagination";
import Spinner from "@/src/components/ui/Spinner";
import EmptyState from "@/src/components/ui/EmptyState";
import { cn } from "@/src/lib/utils";

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { data: productsPage, isLoading } = useProducts({
    page,
    size: 12,
    search: search || undefined,
    categorySlug: category || undefined,
  });

  const { data: categories } = useCategories();
  const activeCategories = categories?.filter((c) => c.active) ?? [];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setPage(0);
  }

  const hasFilters = Boolean(search || category);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {category
              ? activeCategories.find((c) => c.slug === category)?.name ?? "Products"
              : "All Products"}
          </h1>
          {productsPage && (
            <p className="text-sm text-muted-foreground mt-0.5">
              {productsPage.totalElements} products
            </p>
          )}
        </div>
        <div className="sm:ml-auto flex gap-2">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasFilters && (
              <span className="h-2 w-2 rounded-full bg-primary" />
            )}
          </button>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-6 p-4 rounded-xl border border-border bg-white flex flex-col sm:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </form>

          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(0); }}
            className="h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">All Categories</option>
            {activeCategories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Products */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : !productsPage || productsPage.content.length === 0 ? (
        <EmptyState
          title="No products found"
          description={hasFilters ? "Try different search terms or clear filters." : undefined}
          action={hasFilters ? { label: "Clear filters", onClick: clearFilters } : undefined}
        />
      ) : (
        <>
          <ProductGrid products={productsPage.content} />
          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={productsPage.totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
