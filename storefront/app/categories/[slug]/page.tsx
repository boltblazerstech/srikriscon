"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCategory } from "@/src/hooks/useCategories";
import { useProducts } from "@/src/hooks/useProducts";
import ProductGrid from "@/src/components/product/ProductGrid";
import Pagination from "@/src/components/ui/Pagination";
import Spinner from "@/src/components/ui/Spinner";
import EmptyState from "@/src/components/ui/EmptyState";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(0);
  const { data: category, isLoading: catLoading } = useCategory(slug);
  const { data: productsPage, isLoading: prodsLoading } = useProducts({
    categoryId: category?.id,
    page,
    size: 12,
  });

  return (
    <div>
      {/* Category header */}
      <div className="bg-[#F5F7F7] border-b border-border py-12 sm:py-16 text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {catLoading ? (
            <Spinner />
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-accent mb-2">
                Category Collection
              </span>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
                {category?.name ?? "Category"}
              </h1>
              <div className="h-[2px] w-12 bg-accent mt-4" />
            </div>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {prodsLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : !productsPage || productsPage.content.length === 0 ? (
          <EmptyState title="No products in this category yet" />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {productsPage.totalElements} products
              </p>
            </div>
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
    </div>
  );
}

