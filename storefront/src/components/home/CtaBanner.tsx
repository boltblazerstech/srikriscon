"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { theme } from "@/src/config/theme";
import { useSetting } from "@/src/hooks/useSettings";
import { fadeUp } from "@/src/lib/animations";
import GrainOverlay from "@/src/components/ui/GrainOverlay";

export default function CtaBanner() {
  const { value: storeName } = useSetting("storeName");
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-28 sm:py-36">

      {/* ── Animated gradient blobs ── */}
      <motion.div
        aria-hidden
        className="absolute -top-48 -left-24 w-[500px] h-[500px] rounded-full bg-primary/35 blur-[130px] pointer-events-none"
        animate={{ x: [0, 70, -30, 0], y: [0, -50, 70, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-48 -right-24 w-[580px] h-[580px] rounded-full bg-accent/20 blur-[150px] pointer-events-none"
        animate={{ x: [0, -90, 50, 0], y: [0, 80, -60, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full bg-primary/15 blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.35, 0.85, 1], x: [0, 50, -50, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <GrainOverlay />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* Decorative label */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <span className="h-px w-8 bg-white/15" />
            <span className="text-[10px] font-extrabold tracking-[0.32em] text-white/35 uppercase">
              Exclusive Packaging Solutions
            </span>
            <span className="h-px w-8 bg-white/15" />
          </div>

          {/* Headline — italic accent word in Playfair */}
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight">
            Elevate Your<br />
            <em className="not-italic text-accent">Brand</em>{" "}Today.
          </h2>

          {/* Subtext */}
          <p className="mt-8 text-base sm:text-lg text-white/40 font-light max-w-lg mx-auto leading-relaxed">
            {storeName || theme.business.name}&apos;s full range of premium packaging —
            designed for excellence, built for lasting impact.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary — accent glow */}
            <Link
              href="/products"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-10 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-[#C2006A] hover:scale-105 hover:shadow-[0_0_40px_rgba(230,0,126,0.5)] w-full sm:w-auto"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Secondary — white outline */}
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-10 py-4 text-sm font-bold text-white hover:bg-white/[0.08] hover:border-white/40 transition-all duration-300 w-full sm:w-auto"
            >
              View Categories
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
