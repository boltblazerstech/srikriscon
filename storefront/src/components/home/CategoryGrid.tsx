"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCategories } from "@/src/hooks/useCategories";
import Spinner from "@/src/components/ui/Spinner";
import { fadeUp } from "@/src/lib/animations";

const CIRCLE_PALETTES = [
  "bg-red-50",
  "bg-orange-50",
  "bg-amber-50",
  "bg-teal-50",
  "bg-sky-50",
  "bg-pink-50",
  "bg-purple-50",
  "bg-emerald-50",
  "bg-rose-50",
  "bg-cyan-50",
  "bg-lime-50",
  "bg-indigo-50",
];

export default function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();
  const active = categories?.filter((c) => c.active) ?? [];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  // ── Arrow scroll ─────────────────────────────────────────────────────────
  function scrollBy(dir: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });
  }

  // ── Mouse drag to scroll ──────────────────────────────────────────────────
  function onMouseDown(e: React.MouseEvent) {
    setIsDragging(false);
    dragStart.current = {
      x: e.pageX - (scrollRef.current?.offsetLeft ?? 0),
      scrollLeft: scrollRef.current?.scrollLeft ?? 0,
    };
    scrollRef.current?.classList.add("cursor-grabbing");

    const onMove = (ev: MouseEvent) => {
      const x = ev.pageX - (scrollRef.current?.offsetLeft ?? 0);
      const dist = x - dragStart.current.x;
      if (Math.abs(dist) > 4) setIsDragging(true);
      if (scrollRef.current)
        scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dist;
    };
    const onUp = () => {
      scrollRef.current?.classList.remove("cursor-grabbing");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }
  if (active.length === 0) return null;

  return (
    <section className="py-14 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-extrabold text-primary tracking-tight">
              Shop by Category
            </h2>
            <p className="mt-1 text-sm text-zinc-400 font-medium">
              Browse our curated product collections
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Arrow buttons */}
            <button
              onClick={() => scrollBy("left")}
              className="h-9 w-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollBy("right")}
              className="h-9 w-9 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <Link
              href="/categories"
              className="ml-1 text-sm font-bold text-accent hover:text-[#C2006A] transition-colors uppercase tracking-wider"
            >
              View All →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scrollable Row — full-bleed so items peek at edges */}
      <div className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent" />

        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          className="flex gap-6 overflow-x-auto scroll-smooth select-none cursor-grab px-8 sm:px-16 pt-3 pb-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {active.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-3 flex-shrink-0 w-36 sm:w-40"
              onClick={(e) => isDragging && e.preventDefault()}
            >
              {/* Circle Container with Border */}
              <div
                className={[
                  "relative w-36 h-36 sm:w-40 sm:h-40 rounded-full flex-shrink-0 flex items-center justify-center",
                  "border-2 border-primary p-1.5 bg-white",
                  "shadow-md transition-all duration-300 ease-out",
                  "group-hover:shadow-[0_0_15px_rgba(11,58,66,0.35)] group-hover:scale-105 group-hover:-translate-y-1.5",
                ].join(" ")}
              >
                <div
                  className={[
                    "relative w-full h-full rounded-full overflow-hidden flex-shrink-0",
                    CIRCLE_PALETTES[idx % CIRCLE_PALETTES.length],
                  ].join(" ")}
                >
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="160px"
                      draggable={false}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl font-black text-primary/20">
                        {cat.name[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Label */}
              <span className="text-center text-xs sm:text-[13px] font-bold text-zinc-700 group-hover:text-accent transition-colors duration-200 leading-snug line-clamp-2 w-full">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
