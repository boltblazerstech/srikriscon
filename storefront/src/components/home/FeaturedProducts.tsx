"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useFeaturedProducts } from "@/src/hooks/useProducts";
import ProductCard from "@/src/components/product/ProductCard";
import Spinner from "@/src/components/ui/Spinner";
import { fadeUp } from "@/src/lib/animations";

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

  const hasBottom = products.length >= 6;

  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4"
        >
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
        </motion.div>

        {/* ── Desktop: asymmetric editorial grid ── */}
        {/* Top block: 1 large hero (2fr) + 2×2 small cards (1fr + 1fr) */}
        <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr] gap-4 items-start">
          {products[0] && (
            <div className="row-span-2">
              <ProductCard product={products[0]} hero />
            </div>
          )}
          {products.slice(1, 5).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Bottom row: 3 regular cards + "View All" CTA */}
        {hasBottom && (
          <div className="hidden lg:grid grid-cols-4 gap-4 mt-4">
            {products.slice(5, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {/* CTA card */}
            <Link
              href="/products"
              className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary/25 hover:border-primary/50 bg-primary/[0.03] hover:bg-primary/[0.07] p-8 text-center transition-all duration-300 min-h-[180px]"
            >
              <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <ArrowRight className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
              </div>
              <span className="text-sm font-bold text-primary leading-tight">
                View All<br />Products
              </span>
              <span className="text-xs text-muted-foreground mt-1.5">
                Explore full catalogue
              </span>
            </Link>
          </div>
        )}

        {/* ── Mobile: regular 2-col grid ── */}
        <div className="lg:hidden grid grid-cols-2 gap-4">
          {products.slice(0, 8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
