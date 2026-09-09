"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp } from "@/src/lib/animations";

export default function FeaturedBanner() {
  return (
    <section className="relative w-full h-[450px] sm:h-[550px] lg:h-[600px] overflow-hidden flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/banner1.webp')" }}
      />
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/85 via-zinc-950/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <motion.div
          className="max-w-xl text-left"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Tag */}
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-orange-500 mb-3">
            Premium Gift Packaging
          </span>
          
          {/* Heading */}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Make Every Gift <br className="hidden sm:inline" />
            <span className="italic text-orange-500">Unforgettable</span>
          </h2>
          
          {/* Paragraph */}
          <p className="mt-4 text-sm sm:text-base text-zinc-200 font-light leading-relaxed max-w-md">
            Discover our collection of custom luxury gift boxes and premium wrapping designs crafted to elevate your presentation and create memorable unboxing experiences.
          </p>
          
          {/* CTA Button */}
          <div className="mt-8">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-orange-600 px-8 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-orange-700 hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
