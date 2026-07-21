"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useCategories } from "@/src/hooks/useCategories";
import Spinner from "@/src/components/ui/Spinner";
import { fadeUp } from "@/src/lib/animations";

const CIRCLE_PALETTES = [
  "bg-indigo-50/80",
  "bg-rose-50/80",
  "bg-amber-50/80",
  "bg-emerald-50/80",
  "bg-sky-50/80",
  "bg-purple-50/80",
  "bg-teal-50/80",
  "bg-cyan-50/80",
];

export default function CategoryGrid() {
  const { data: categories, isLoading } = useCategories();
  const active = categories?.filter((c) => c.active) ?? [];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  function scrollBy(dir: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -340 : 340,
      behavior: "smooth",
    });
  }

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
    <section className="py-16 bg-gradient-to-b from-white via-zinc-50/50 to-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-xs font-black uppercase tracking-[0.25em] text-accent block mb-1">
              Curated Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight font-display">
              Shop by Category
            </h2>
            <p className="mt-1.5 text-sm text-zinc-500 font-medium">
              Explore our wide variety of premium industrial & food packaging solutions
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Navigation buttons */}
            <button
              onClick={() => scrollBy("left")}
              className="h-10 w-10 rounded-full border border-zinc-200 bg-white shadow-xs flex items-center justify-center text-zinc-600 hover:border-primary hover:text-primary hover:bg-primary/5 hover:scale-105 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scrollBy("right")}
              className="h-10 w-10 rounded-full border border-zinc-200 bg-white shadow-xs flex items-center justify-center text-zinc-600 hover:border-primary hover:text-primary hover:bg-primary/5 hover:scale-105 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <Link
              href="/categories"
              className="ml-2 inline-flex items-center gap-1.5 text-xs font-black text-accent hover:text-accent/80 transition-colors uppercase tracking-wider bg-accent/10 px-4 py-2.5 rounded-full border border-accent/20 hover:border-accent/40"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scrollable Row */}
      <div className="relative">
        {/* Gradients to fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-20 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-20 z-10 bg-gradient-to-l from-white to-transparent" />

        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          className="flex gap-6 sm:gap-8 overflow-x-auto scroll-smooth select-none cursor-grab px-6 sm:px-16 pt-4 pb-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {active.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group flex flex-col items-center gap-4 flex-shrink-0 w-40 sm:w-44"
              onClick={(e) => isDragging && e.preventDefault()}
            >
              {/* Category Circle Card */}
              <div className="relative w-40 h-40 sm:w-44 sm:h-44 rounded-full p-2 bg-white border-2 border-primary/20 shadow-md transition-all duration-300 ease-out group-hover:border-primary group-hover:shadow-[0_10px_25px_-5px_rgba(11,58,66,0.3)] group-hover:scale-105 group-hover:-translate-y-2">
                <div
                  className={`relative w-full h-full rounded-full overflow-hidden ${
                    CIRCLE_PALETTES[idx % CIRCLE_PALETTES.length]
                  }`}
                >
                  {cat.imageUrl ? (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="176px"
                      draggable={false}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                      <span className="text-5xl font-black text-primary/30">
                        {cat.name[0]}
                      </span>
                    </div>
                  )}

                  {/* Dark subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                </div>
              </div>

              {/* Category Label Pill — Highly Visible & Appealing */}
              <div className="w-full text-center px-2 py-1.5 rounded-full bg-white/90 border border-zinc-200/80 shadow-xs group-hover:bg-primary group-hover:border-primary group-hover:shadow-md transition-all duration-300">
                <span className="block text-xs sm:text-sm font-extrabold text-zinc-900 group-hover:text-white transition-colors duration-200 truncate tracking-tight">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
