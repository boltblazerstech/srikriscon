"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, X, Tag } from "lucide-react";
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

  const urlCategoryParam = searchParams.get("category") ?? searchParams.get("categoryId") ?? "";
  const urlSearchParam = searchParams.get("search") ?? searchParams.get("q") ?? "";

  const [search, setSearch] = useState(urlSearchParam);
  const [category, setCategory] = useState(urlCategoryParam);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setCategory(urlCategoryParam);
    setSearch(urlSearchParam);
  }, [urlCategoryParam, urlSearchParam]);

  const { data: categories } = useCategories();
  const activeCategories = categories?.filter((c) => c.active) ?? [];

  // Find selected category object (matches slug or numeric ID)
  const selectedCatObj = activeCategories.find(
    (c) => c.slug === category || String(c.id) === category
  );

  const { data: productsPage, isLoading } = useProducts({
    page,
    size: 12,
    search: search || undefined,
    categoryId: selectedCatObj ? selectedCatObj.id : (Number(category) || undefined),
    categorySlug: selectedCatObj ? selectedCatObj.slug : (category || undefined),
  });

  function updateCategoryFilter(newCategorySlug: string) {
    setCategory(newCategorySlug);
    setPage(0);
    const params = new URLSearchParams();
    if (newCategorySlug) params.set("category", newCategorySlug);
    if (search) params.set("search", search);
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(0);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    router.push(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function clearFilters() {
    setSearch("");
    setCategory("");
    setPage(0);
    router.push("/products");
  }

  const hasFilters = Boolean(search || category);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {selectedCatObj ? selectedCatObj.name : "All Products"}
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
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
              showFilters || hasFilters
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-foreground hover:bg-muted"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasFilters && (
              <span className="h-2 w-2 rounded-full bg-accent" />
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

      {/* Active Category Chip */}
      {selectedCatObj && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filtered by:</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
            <Tag className="h-3 w-3 text-accent" />
            {selectedCatObj.name}
            <button onClick={() => updateCategoryFilter("")} className="hover:text-destructive ml-1">
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      )}

      {/* Filters panel */}
      {showFilters && (
        <div className="mb-6 p-4 rounded-xl border border-border bg-white shadow-sm flex flex-col sm:flex-row gap-4">
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
            onChange={(e) => updateCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ring font-medium"
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
          description={hasFilters ? "Try selecting a different category or clearing your search filter." : undefined}
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
