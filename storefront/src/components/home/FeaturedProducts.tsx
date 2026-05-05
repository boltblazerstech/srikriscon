"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useFeaturedProducts } from "@/src/hooks/useProducts";
import ProductGrid from "@/src/components/product/ProductGrid";
import Spinner from "@/src/components/ui/Spinner";

export default function FeaturedProducts() {
  const { data: products, isLoading } = useFeaturedProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-background py-16 sm:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-sm font-bold tracking-widest text-accent uppercase mb-2 block">
              Handpicked
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
              Featured Products
            </h2>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-2 text-sm font-semibold text-accent hover:text-[#C2006A] transition-colors"
          >
            <span className="border-b border-transparent group-hover:border-current pb-0.5 transition-all">
              Discover All
            </span>
            <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <ProductGrid products={products.slice(0, 8)} />
      </div>
    </section>
  );
}
