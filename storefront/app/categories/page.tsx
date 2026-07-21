"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCategories } from "@/src/hooks/useCategories";
import Spinner from "@/src/components/ui/Spinner";
import EmptyState from "@/src/components/ui/EmptyState";
import { ArrowRight } from "lucide-react";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const active = categories?.filter((c) => c.active) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-accent block mb-2">
          Complete Range
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-primary tracking-tight font-display">
          Product Categories
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-2 font-medium">
          Explore our wide range of premium packaging solutions tailored for every industry.
        </p>
        <div className="h-1 w-16 bg-accent mx-auto mt-4 rounded-full" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : active.length === 0 ? (
        <EmptyState title="No categories available" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {active.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group relative flex flex-col justify-end overflow-hidden rounded-3xl aspect-[4/3] sm:aspect-square bg-zinc-900 shadow-md hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1.5 border border-zinc-200/60"
              >
                {/* Background Image */}
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-zinc-800 to-accent/30 flex items-center justify-center">
                    <span className="text-6xl font-black text-white/20">{cat.name[0]}</span>
                  </div>
                )}

                {/* Ultra High Contrast Multi-Layer Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 group-hover:from-black/90 group-hover:via-black/40 transition-colors duration-300" />

                {/* Text Content Overlay — Ultra Legible & Appealing */}
                <div className="relative z-10 p-6 flex flex-col justify-end">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-accent group-hover:scale-125 transition-transform duration-300" />
                    <span className="text-[11px] font-black uppercase tracking-widest text-accent drop-shadow-sm">
                      Category
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] group-hover:text-amber-300 transition-colors duration-300">
                    {cat.name}
                  </h3>

                  {cat.description ? (
                    <p className="text-xs text-zinc-300/90 mt-1.5 line-clamp-2 leading-relaxed drop-shadow-sm">
                      {cat.description}
                    </p>
                  ) : null}

                  {/* Explore Link Pill */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/20 pt-3 text-xs font-bold text-white group-hover:text-accent transition-colors">
                    <span>Explore Products</span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
