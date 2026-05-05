"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/src/hooks/useCategories";
import Spinner from "@/src/components/ui/Spinner";

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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-primary tracking-tight">Curated Collections</h2>
        <Link href="/categories" className="text-sm font-semibold text-accent hover:text-[#C2006A] transition-colors uppercase tracking-wider">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {active.map((cat) => (
          <Link
            key={cat.id}
            href={`/categories/${cat.slug}`}
            className="group relative flex flex-col items-center justify-end overflow-hidden rounded-2xl aspect-[4/5] bg-muted border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            {cat.imageUrl ? (
              <Image
                src={cat.imageUrl}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-highlight/20" />
            )}
            {/* Elegant gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <span className="block text-lg font-bold text-white text-center tracking-wide">
                {cat.name}
              </span>
              <span className="block text-xs font-medium text-highlight mt-1 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Explore &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
