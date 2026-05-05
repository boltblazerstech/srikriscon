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
      {/* Category hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/5 h-48 sm:h-64">
        {category?.imageUrl && (
          <Image
            src={category.imageUrl}
            alt={category.name ?? ""}
            fill
            className="object-cover opacity-30"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          {catLoading ? (
            <Spinner />
          ) : (
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                {category?.name ?? "Category"}
              </h1>
              {category?.description && (
                <p className="mt-2 text-muted-foreground max-w-lg">{category.description}</p>
              )}
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

