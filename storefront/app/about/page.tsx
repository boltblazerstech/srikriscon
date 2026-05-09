"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Package, Layers, ShieldCheck, Gift, Palette,
  Award, PenTool, Factory, Clock, Users,
  ArrowRight, CheckCircle,
} from "lucide-react";
import { fadeUp, staggerContainer, staggerItem } from "@/src/lib/animations";
import GrainOverlay from "@/src/components/ui/GrainOverlay";


import { theme } from "@/src/config/theme";



// ─── Data ─────────────────────────────────────────────────────────────────────

const EXPERTISE = [
  {
    title: "Luxury Rigid Boxes",
    desc: "For premium product presentation",
    image: "/product_images/SKI_SWEET-BOXES (5).webp",
    icon: Package,
  },
  {
    title: "Premium Mono Cartons",
    desc: "With high-end printing finishes",
    image: "/categories_images/cake_boxes.webp",
    icon: Layers,
  },
  {
    title: "Corrugated Cartons",
    desc: "Durable and highly efficient",
    image: "/categories_images/pizza_boxes.webp",
    icon: ShieldCheck,
  },
  {
    title: "Sweet Shop Packaging",
    desc: "Specialized confectionery solutions",
    image: "/categories_images/sweet_boxes.webp",
    icon: Gift,
  },
  {
    title: "Customized Designs",
    desc: "Fully aligned with your brand identity",
    image: "/categories_images/paper_bags.webp",
    icon: Palette,
  },
];

const WHY = [
  {
    icon: Award,
    title: "High-Quality",
    desc: "Premium mono & corrugated cartons crafted with the finest materials for lasting durability and visual appeal.",
  },
  {
    icon: PenTool,
    title: "Custom Design",
    desc: "Precise printing solutions tailored exactly to your brand guidelines and unique packaging requirements.",
  },
  {
    icon: Factory,
    title: "Advanced Manufacturing",
    desc: "State-of-the-art machinery and production processes to ensure consistent quality at every run.",
  },
  {
    icon: Clock,
    title: "Timely Delivery",
    desc: "Reliable delivery schedules with competitive pricing — no compromises on your deadlines.",
  },
  {
    icon: Users,
    title: "Customer-Centric",
    desc: "Your needs always come first. We build lasting partnerships through trust, quality, and dedicated support.",
  },
];

const INDUSTRIES = [
  "FMCG", "Food & Beverages", "Pharmaceuticals",
  "Confectionery", "Electronics", "Apparel & Lifestyle",
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative bg-zinc-950 pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden">
        {/* Animated blobs */}
        <motion.div
          aria-hidden
          className="absolute -top-40 -left-20 w-[480px] h-[480px] rounded-full bg-primary/30 blur-[120px] pointer-events-none"
          animate={{ x: [0, 60, -30, 0], y: [0, -40, 60, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-40 -right-20 w-[540px] h-[540px] rounded-full bg-accent/15 blur-[140px] pointer-events-none"
          animate={{ x: [0, -80, 40, 0], y: [0, 70, -50, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <GrainOverlay />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
          {/* Label */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible"
            className="flex items-center justify-center gap-3 mb-8"
          >
            <span className="h-px w-8 bg-white/15" />
            <span className="text-[10px] font-extrabold tracking-[0.32em] text-white/40 uppercase">
              About Us
            </span>
            <span className="h-px w-8 bg-white/15" />
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible"
            transition={{ delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight"
          >
            Packaging That Tells<br />
            <em className="not-italic text-accent">Your Brand&apos;s</em> Story
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible"
            transition={{ delay: 0.2 }}
            className="mt-8 text-base sm:text-lg text-white/45 font-light max-w-xl mx-auto leading-relaxed"
          >
            {theme.business.name} — a trusted name in premium packaging, combining structural strength with visual excellence.
          </motion.p>
        </div>
      </section>

      {/* ── 2. MISSION / STORY ─────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — image stack */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="relative"
            >
              {/* Main image */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-[0_20px_60px_-12px_rgba(11,58,66,0.25)]">
                <Image
                  src="/product_images/SKI_SWEET-BOXES (8).webp"
                  alt="Sri Kriscon packaging showcase"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              {/* Floating accent card */}
              <div className="absolute -bottom-5 -right-5 bg-primary rounded-2xl p-5 shadow-xl hidden sm:block">
                <p className="text-3xl font-bold text-white leading-none">500<span className="text-accent">+</span></p>
                <p className="text-xs text-white/60 mt-1 font-medium tracking-wide uppercase">Products</p>
              </div>
              {/* Decorative badge */}
              <div className="absolute -top-4 -left-4 bg-accent rounded-full p-3 shadow-lg hidden sm:flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            </motion.div>

            {/* Right — text */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.15 }}
            >
              <span className="text-sm font-bold tracking-widest text-accent uppercase mb-4 block">
                Our Story
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary leading-tight tracking-tight">
                Built on Trust,<br />Driven by Excellence
              </h2>
              <div className="mt-6 space-y-4 text-base text-muted-foreground leading-relaxed">
                <p>
                  At <strong className="text-foreground font-semibold">Sri Kriscon Industries</strong>, we take pride in being a trusted name in packaging — specializing in Rigid Boxes, Mono Cartons, and Corrugated Cartons. With a strong commitment to excellence, innovation, and customer satisfaction, we deliver solutions that protect products while enhancing their market appeal.
                </p>
                <p>
                  Driven by precision and backed by modern manufacturing, we serve FMCG, pharmaceuticals, food & beverages, confectionery, and more. Our team understands each client&apos;s unique requirements and crafts packaging that aligns perfectly with their brand identity.
                </p>
              </div>

              {/* Quote */}
              <blockquote className="mt-8 border-l-[3px] border-accent pl-5 py-1">
                <p className="font-display italic text-foreground/80 text-base leading-relaxed">
                  &ldquo;We believe packaging is a statement of prestige. Our mission is to empower brands with packaging that captivates, differentiates, and leaves a lasting impression.&rdquo;
                </p>
              </blockquote>

              {/* Industries served */}
              <div className="mt-8">
                <p className="text-xs font-extrabold tracking-widest text-muted-foreground uppercase mb-3">Industries We Serve</p>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => (
                    <span key={ind} className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 3. OUR EXPERTISE ───────────────────────────────────────────── */}
      <section className="bg-muted/40 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-14"
          >
            <span className="text-sm font-bold tracking-widest text-accent uppercase mb-3 block">
              What We Make
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              Our Expertise
            </h2>
            <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
              From luxury presentation boxes to durable shipping cartons — every product built to elevate your brand.
            </p>
          </motion.div>

          {/* Editorial grid — hero card + 4 small cards */}
          <div className="hidden lg:grid grid-cols-[1.4fr_1fr_1fr] gap-4 items-start">
            {/* Hero card (row-span-2) */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="row-span-2"
            >
              <ExpertiseCard {...EXPERTISE[0]} hero />
            </motion.div>
            {EXPERTISE.slice(1).map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i + 1) * 0.08 }}
              >
                <ExpertiseCard {...item} />
              </motion.div>
            ))}
          </div>

          {/* Mobile: 2-col grid */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {EXPERTISE.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07 }}
              >
                <ExpertiseCard {...item} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHY CHOOSE US ───────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center mb-14"
          >
            <span className="text-sm font-bold tracking-widest text-accent uppercase mb-3 block">
              Our Advantage
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              Why Choose Us?
            </h2>
            <p className="mt-4 text-muted-foreground text-base max-w-xl mx-auto">
              Five pillars that set Sri Kriscon apart from the competition.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {WHY.map((item, i) => (
              <motion.div
                key={item.title}
                variants={staggerItem}
                className={`group relative p-7 rounded-2xl border border-border bg-white
                  hover:border-primary/25 hover:shadow-[0_8px_40px_-8px_rgba(11,58,66,0.15)]
                  transition-all duration-300 overflow-hidden
                  ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}
                `}
              >
                {/* Large ordinal watermark */}
                <span
                  aria-hidden
                  className="absolute top-3 right-5 text-8xl font-black text-foreground/[0.04] leading-none select-none pointer-events-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div className="relative z-10 h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <item.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>

                {/* Text */}
                <h3 className="relative z-10 text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>

                {/* Hover accent line */}
                <span
                  aria-hidden
                  className="absolute bottom-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── 5. CTA ─────────────────────────────────────────────────────── */}
      <section className="relative bg-primary py-20 sm:py-24 overflow-hidden">
        <GrainOverlay />

        {/* Blobs */}
        <motion.div
          aria-hidden
          className="absolute -top-32 -left-16 w-[400px] h-[400px] rounded-full bg-white/[0.06] blur-[100px] pointer-events-none"
          animate={{ x: [0, 50, -30, 0], y: [0, -40, 50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-32 -right-16 w-[440px] h-[440px] rounded-full bg-accent/20 blur-[110px] pointer-events-none"
          animate={{ x: [0, -60, 30, 0], y: [0, 60, -40, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <span className="text-[10px] font-extrabold tracking-[0.32em] text-white/35 uppercase block mb-8">
              Ready to Elevate Your Brand?
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              Let&apos;s Create Packaging<br />
              <em className="not-italic text-accent">Worth Remembering</em>
            </h2>
            <p className="mt-6 text-white/45 text-base max-w-md mx-auto leading-relaxed">
              Talk to our packaging experts and discover what&apos;s possible for your brand.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent px-9 py-4 text-sm font-bold text-white hover:bg-[#C2006A] hover:scale-105 hover:shadow-[0_0_36px_rgba(230,0,126,0.45)] transition-all duration-300"
              >
                Shop Collection
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-9 py-4 text-sm font-bold text-white hover:bg-white/[0.08] hover:border-white/40 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

// ─── Expertise card ────────────────────────────────────────────────────────────

function ExpertiseCard({
  title,
  desc,
  image,
  icon: Icon,
  hero = false,
}: {
  title: string;
  desc: string;
  image: string;
  icon: LucideIcon;
  hero?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl ${
        hero ? "aspect-[3/4]" : "aspect-[4/3]"
      } cursor-default`}
    >
      {/* Background image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

      {/* Icon badge — top left */}
      <div className="absolute top-4 left-4 h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-accent group-hover:border-accent">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
      </div>

      {/* Bottom text */}
      <div className="absolute bottom-0 inset-x-0 p-5">
        <h3 className={`font-bold text-white leading-tight ${hero ? "text-2xl" : "text-base"}`}>
          {title}
        </h3>
        <p className={`text-white/65 mt-1 leading-snug ${hero ? "text-sm" : "text-xs"}`}>
          {desc}
        </p>
      </div>

      {/* Shine sweep on hover */}
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-in-out pointer-events-none"
      />
    </div>
  );
}
