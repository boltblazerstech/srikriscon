"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCategories } from "@/src/hooks/useCategories";
import Spinner from "@/src/components/ui/Spinner";
import EmptyState from "@/src/components/ui/EmptyState";


export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const active = categories?.filter((c) => c.active) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-foreground mb-2">Categories</h1>
      <p className="text-muted-foreground mb-8">Browse our full range of product categories.</p>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : active.length === 0 ? (
        <EmptyState title="No categories yet" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {active.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group relative flex flex-col items-center justify-end overflow-hidden rounded-2xl aspect-square bg-muted shadow-sm hover:shadow-lg transition-shadow"
              >
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="relative z-10 mb-4 px-3 text-center">
                  <span className="text-base font-bold text-white">{cat.name}</span>
                  {cat.description && (
                    <p className="text-xs text-white/70 mt-0.5 line-clamp-1">{cat.description}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
