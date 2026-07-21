"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Package, Layers, ShieldCheck, Gift, Palette,
  Award, PenTool, Factory, Clock, Users,
  ArrowRight, CheckCircle, Sparkles, Check, Edit3,
} from "lucide-react";
import { fadeUp, staggerContainer, staggerItem } from "@/src/lib/animations";
import GrainOverlay from "@/src/components/ui/GrainOverlay";
import { theme } from "@/src/config/theme";
import { useSetting } from "@/src/hooks/useSettings";
import { useCmsPage } from "@/src/hooks/useCmsPage";
import Spinner from "@/src/components/ui/Spinner";

// ─── Data ─────────────────────────────────────────────────────────────────────

const WHAT_WE_DO_OFFERINGS = [
  {
    title: "Custom Paper & Corrugated Packaging",
    subtitle: "Custom paper and corrugated packaging solutions",
    desc: "Tailored paper cartons, mono cartons, corrugated boxes, and rigid packaging crafted to deliver maximum product protection, shelf appeal, and structural strength.",
    icon: Package,
    badge: "Core Solution",
  },
  {
    title: "Brand-Centric Customized Support",
    subtitle: "Brand-centric customized packaging support",
    desc: "End-to-end design and printing support aligned with your brand guidelines, incorporating luxury finishes, custom colors, and distinctive brand aesthetics.",
    icon: Palette,
    badge: "Brand Identity",
  },
  {
    title: "Bulk & Customized Production",
    subtitle: "Bulk and customized production",
    desc: "High-precision manufacturing equipped to efficiently handle large-volume industrial bulk orders as well as specialized, small-batch custom requests.",
    icon: Factory,
    badge: "Scalable Manufacturing",
  },
];

const BROCHURE_CATEGORIES = [
  {
    title: "Bakery Packaging",
    desc: "Cake boxes, pastry boxes, pizza boxes, and takeaway packaging.",
    image: "/categories_images/cake_boxes.webp",
  },
  {
    title: "Moulding Boxes",
    desc: "Food-grade plastic containers with secure locking systems.",
    image: "/categories_images/lids.webp",
  },
  {
    title: "Luxury Sweet Boxes",
    desc: "Paper and rigid gift boxes with premium aesthetic finishing.",
    image: "/categories_images/sweet_boxes.webp",
  },
  {
    title: "Wrapping Papers",
    desc: "Customized wrapping sheets for gift and retail packaging.",
    image: "/categories_images/restaurant_boxes.webp",
  },
  {
    title: "Premium Paper Bags",
    desc: "Sustainable, high-strength retail and gifting paper bags.",
    image: "/categories_images/paper_bags.webp",
  },
  {
    title: "Wedding (Bhaji) Boxes",
    desc: "Beautifully crafted Indian wedding and festive gifting boxes.",
    image: "/categories_images/modak.webp",
  },
  {
    title: "Ice Cream Packaging",
    desc: "Food-grade ice cream cups, takeaway tubs, and cone sleeves.",
    image: "/categories_images/paper_cups.webp",
  },
];

const INDUSTRIES = [
  "Food & Beverages", "Bakery & Confectionery", "Dairy & Ice Cream",
  "Indian Weddings & Gifting", "Retail & Apparel", "Industrial Packaging",
];

// ─── Page Component ────────────────────────────────────────────────────────────

export default function AboutPage() {
  const { value: storeName } = useSetting("storeName");

  // Dynamically fetch the CMS Page managed by Admin Panel (slug: about-us or about)
  const { data: cmsPageAboutUs, isLoading: loadingAboutUs } = useCmsPage("about-us");
  const { data: cmsPageAbout, isLoading: loadingAbout } = useCmsPage("about");

  const cmsPage = cmsPageAboutUs ?? cmsPageAbout;
  const isLoading = loadingAboutUs && loadingAbout;

  // Active dynamic HTML content from Admin Panel
  const cmsContent = cmsPage?.content;
  const pageTitle = cmsPage?.title ?? "Packaging That Speaks For Your Brand";

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-accent selection:text-white">

      {/* ── 1. HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative bg-zinc-950 pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Animated Background Blobs */}
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

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center">
          {/* Tag */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible"
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-8 bg-white/20" />
            <span className="text-[11px] font-extrabold tracking-[0.35em] text-accent uppercase">
              Established 2017
            </span>
            <span className="h-px w-8 bg-white/20" />
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible"
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] tracking-tight"
          >
            {pageTitle}
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="visible"
            transition={{ delay: 0.2 }}
            className="mt-6 text-base sm:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {storeName || theme.business.name} was established in 2017 with a clear vision to serve the packaging industry across various markets, providing innovative and reliable packaging solutions.
          </motion.p>
        </div>
      </section>


      {/* ── 2. ABOUT US SECTION (Linked to Admin CMS) ────────────────── */}
      <section className="relative bg-white text-zinc-900 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left Image Column */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              className="lg:col-span-5 relative lg:sticky lg:top-28"
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-[0_25px_60px_-15px_rgba(11,58,66,0.3)] border border-zinc-200">
                <Image
                  src="/product_images/SKI_SWEET-BOXES (8).webp"
                  alt="Sri Kriscon Industries packaging showcase"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
               
              </div>

              {/* Accent Floating Badge Top Left */}
              <div className="absolute -top-4 -left-4 bg-accent text-white rounded-2xl p-4 shadow-xl hidden sm:flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-white" />
                <span className="text-xs font-bold tracking-wide uppercase">Admin Managed CMS</span>
              </div>
            </motion.div>

            {/* Right Text Content Column (Fetches live from CMS Admin Panel) */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.15 }}
              className="lg:col-span-7"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent uppercase tracking-widest mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                {cmsPage?.title ?? "About Us"}
              </div>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-tight tracking-tight mb-6">
                Sri Kriscon Industries
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : cmsContent ? (
                /* Dynamic HTML content saved from Admin Panel (/pages/about-us) */
                <div
                  className="prose prose-lg prose-zinc max-w-none text-zinc-600 leading-relaxed font-normal
                             prose-headings:font-display prose-headings:font-bold prose-headings:text-primary
                             prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:text-primary
                             prose-h3:text-xl prose-h3:font-semibold prose-h3:text-accent prose-h3:mt-6 prose-h3:mb-2
                             prose-p:mb-4 prose-ul:list-disc prose-ul:pl-5 prose-li:mb-2
                             prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-zinc-50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic"
                  dangerouslySetInnerHTML={{ __html: cmsContent }}
                />
              ) : (
                /* Default fallback content if backend is offline or CMS page is unpopulated */
                <div className="space-y-4 text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
                  <p>
                    <strong className="text-zinc-900 font-semibold">Sri Kriscon Industries</strong> was established in 2017 with a clear vision to serve the packaging industry across various markets, providing innovative and reliable packaging solutions.
                  </p>
                  <p>
                    We specialize in catering to diverse packaging demands of our clients, ensuring quality, safety, and a strong brand presence for their products.
                  </p>
                  <p>
                    Equipped with advanced printing technology and high-precision manufacturing, we maintain consistent product quality, enabling us to handle bulk orders as well as customized requirements efficiently.
                  </p>
                  <p>
                    At Sri Kriscon Industries, we believe packaging is not just protection—it is a powerful brand asset. Our focus is on delivering solutions that combine structural integrity, visual appeal, and environmental responsibility, helping our clients stand out in competitive markets worldwide.
                  </p>

                  <blockquote className="mt-8 rounded-2xl bg-zinc-50 border-l-4 border-accent p-6 shadow-sm">
                    <p className="font-display italic text-zinc-900 text-lg font-medium leading-relaxed">
                      &ldquo;We are a trusted partner for food and industrial packaging solutions.&rdquo;
                    </p>
                  </blockquote>
                </div>
              )}

              {/* Industries Badges */}
              <div className="mt-10 pt-8 border-t border-zinc-200">
                <p className="text-xs font-extrabold tracking-widest text-zinc-400 uppercase mb-3">
                  Industries We Serve
                </p>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => (
                    <span key={ind} className="inline-flex items-center rounded-full bg-zinc-100 border border-zinc-200 px-3.5 py-1.5 text-xs font-medium text-zinc-700">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>


      {/* ── 3. WHAT WE DO SECTION ───────────────────────────────────────── */}
      <section className="relative bg-zinc-900 py-24 sm:py-32 overflow-hidden border-t border-zinc-800">
        <GrainOverlay />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-[11px] font-extrabold tracking-[0.35em] text-accent uppercase block mb-3">
              What We Do
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              Custom Packaging Built for Your Brand
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/60 font-light leading-relaxed">
              We specialize in manufacturing custom packaging solutions designed to protect the product, enhance shelf presence, and strengthen brand identity.
            </p>
          </motion.div>

          {/* Offerings Cards Grid */}
          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            {WHAT_WE_DO_OFFERINGS.map((item) => (
              <motion.div
                key={item.title}
                variants={staggerItem}
                className="group relative rounded-3xl bg-zinc-950/80 border border-white/10 p-8 hover:border-accent/50 hover:bg-zinc-950 transition-all duration-500 shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Top Icon & Badge */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300">
                      <item.icon className="h-7 w-7" strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-extrabold tracking-widest text-white/40 uppercase bg-white/5 border border-white/10 rounded-full px-3 py-1">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="mt-4 text-sm text-white/55 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center text-xs font-semibold text-accent gap-2">
                  <Check className="h-4 w-4 text-accent" />
                  <span>{item.subtitle}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Highlight Banner */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="mt-16 rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-accent p-8 sm:p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h3 className="font-display text-2xl font-bold">More Than a Box — It&apos;s an Experience</h3>
              <p className="text-white/80 text-sm mt-1 max-w-xl">
                From luxury rigid boxes to high-capacity corrugated cartons, we engineer packaging that reinforces quality and craftsmanship at every touchpoint.
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white text-zinc-900 px-8 py-3.5 text-sm font-bold hover:bg-zinc-100 hover:scale-105 transition-all duration-300 shrink-0 shadow-lg"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

        </div>
      </section>


      {/* ── 4. CATEGORIES OVERVIEW SECTION ─────────────────────────────── */}
      {/* <section className="bg-white text-zinc-900 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-extrabold tracking-[0.35em] text-accent uppercase block mb-3">
              Comprehensive Range
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold text-primary leading-tight tracking-tight">
              Our Core Product Categories
            </h2>
            <p className="mt-4 text-base text-zinc-600">
              Designed &amp; manufactured for food safety, luxury presentation, and heavy-duty industrial reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BROCHURE_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="group relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-50 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-200">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 text-white font-bold text-base">
                    {cat.title}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-zinc-600 leading-relaxed">
                    {cat.desc}
                  </p>
                  <Link
                    href="/categories"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-primary transition-colors"
                  >
                    View Category <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}


      {/* ── 5. CTA SECTION ─────────────────────────────────────────────── */}
      <section className="relative bg-primary py-20 sm:py-28 overflow-hidden">
        <GrainOverlay />

        {/* Animated Blobs */}
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
            <span className="text-[10px] font-extrabold tracking-[0.32em] text-white/40 uppercase block mb-6">
              Partner With Us
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
              Ready to Elevate Your Brand?<br />
              <em className="not-italic text-accent">Let&apos;s Work Together</em>
            </h2>
            <p className="mt-6 text-white/60 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              Talk to our packaging experts and get custom packaging solutions tailored to your products.
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
