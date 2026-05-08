"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCategories } from "@/src/hooks/useCategories";
import Spinner from "@/src/components/ui/Spinner";
import { fadeUp, staggerContainer, staggerItem } from "@/src/lib/animations";

export default function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();
  const active = categories?.filter((c) => c.active).slice(0, 8) ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }
  if (active.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="flex items-center justify-between mb-8"
      >
        <h2 className="text-3xl font-extrabold text-primary tracking-tight">
          Curated Collections
        </h2>
        <Link
          href="/categories"
          className="text-sm font-semibold text-accent hover:text-[#C2006A] transition-colors uppercase tracking-wider"
        >
          View All
        </Link>
      </motion.div>

      {/* Staggered grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {active.map((cat) => (
          <motion.div key={cat.id} variants={staggerItem}>
            <Link
              href={`/categories/${cat.slug}`}
              className="group relative block overflow-hidden rounded-2xl aspect-[4/5] bg-muted shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* Image */}
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-highlight/40" />
              )}

              {/* Cinematic vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

              {/* Shine sweep on hover */}
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out pointer-events-none z-10"
              />

              {/* ── Frosted glass text panel ── */}
              <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-white/10 backdrop-blur-md border-t border-white/15 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                <span className="block text-base font-bold text-white tracking-wide truncate">
                  {cat.name}
                </span>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-white/55 mt-0.5 max-h-0 overflow-hidden group-hover:max-h-5 transition-[max-height] duration-300 ease-out">
                  Explore Collection
                  <span className="text-accent text-xs">→</span>
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
