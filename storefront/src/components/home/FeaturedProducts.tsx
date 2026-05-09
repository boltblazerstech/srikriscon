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

  return (
    <section className="bg-background py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4"
        >
          <div>
            <span className="text-sm font-bold tracking-widest text-accent uppercase mb-1 block">
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

        {/* Clean uniform grid — 3 cols desktop/tablet, 2 mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 lg:gap-8">
          {products.slice(0, 9).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* View All CTA — below the grid */}
        {products.length >= 6 && (
          <div className="flex justify-center mt-10">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-white text-sm font-bold tracking-wider uppercase hover:bg-primary/90 transition-all shadow-md hover:shadow-lg hover:gap-3"
            >
              View All Products
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
