"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck, ArrowRight, CheckCircle, Target, Eye, Sparkles,
  Mail, Shield, MapPin, Phone,
  Package, Layers, Palette, Factory,
} from "lucide-react";
import { theme } from "@/src/config/theme";
import { useSetting } from "@/src/hooks/useSettings";
import { useCmsPage } from "@/src/hooks/useCmsPage";
import Spinner from "@/src/components/ui/Spinner";

const { business } = theme;

const INDUSTRIES = [
  "FMCG", "Food & Beverages", "Pharmaceuticals",
  "Confectionery & Sweets", "Electronics", "Luxury Lifestyle", "E-Commerce",
  "Bakery & Confectionery", "Dairy & Ice Cream", "Indian Weddings & Gifting",
  "Retail & Apparel", "Industrial Packaging",
];

// Hard-coded authoritative values
const OFFICIAL_EMAIL = "info@srikriscon.com";
const OFFICIAL_GST   = "23DZAPS6347N1ZU";

export default function AboutPage() {
  const { value: storeName } = useSetting("storeName");

  // Dynamically fetch the CMS Page managed by Admin Panel (slug: about-us or about)
  const { data: cmsPageAboutUs, isLoading: loadingAboutUs } = useCmsPage("about-us");
  const { data: cmsPageAbout,   isLoading: loadingAbout }   = useCmsPage("about");

  const cmsPage   = cmsPageAboutUs ?? cmsPageAbout;
  const isLoading = loadingAboutUs && loadingAbout;

  // Active dynamic HTML content from Admin Panel
  const cmsContent = cmsPage?.content;
  const pageTitle  = cmsPage?.title ?? "Packaging That Tells Your Brand's Story";

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-800">

      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative bg-[#072429] pt-20 pb-20 sm:pt-28 sm:pb-28 overflow-hidden text-white">
        {/* Decorative background gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#B5A57A]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#E6007E]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-[#B5A57A]/40" />
            <span className="text-xs font-bold tracking-[0.25em] text-[#B5A57A] uppercase">
              About Sri Kriscon Industries
            </span>
            <span className="h-px w-8 bg-[#B5A57A]/40" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
            {pageTitle.includes("Packaging") ? (
              <>
                Packaging That Tells<br />
                <span className="text-[#B5A57A]">Your Brand&apos;s</span> Story
              </>
            ) : (
              pageTitle
            )}
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {storeName || business.name} — established in 2017, a premier name in high-durability packaging, luxury rigid boxes, and modern carton engineering.
          </p>
        </div>
      </section>

      {/* ── 2. STORY / CMS SECTION ──────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg border border-zinc-200">
                <Image
                  src="/product_images/SKI_SWEET-BOXES (8).webp"
                  alt="Sri Kriscon Industries packaging showcase"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-4 -right-4 bg-primary rounded-2xl p-4 shadow-xl hidden sm:block border border-white/10 text-white">
                <p className="text-2xl sm:text-3xl font-bold leading-none">500<span className="text-[#B5A57A]">+</span></p>
                <p className="text-xs text-white/80 mt-1 font-medium tracking-wide uppercase">Packaging Designs</p>
              </div>

              <div className="absolute -top-3 -left-3 bg-[#E6007E] rounded-full p-2.5 shadow-lg hidden sm:flex items-center justify-center text-white">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>

            {/* Right — CMS managed or static fallback */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary uppercase tracking-widest mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                {cmsPage?.title ?? "About Us"}
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary leading-tight tracking-tight mb-4">
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
                             prose-headings:font-bold prose-headings:text-primary
                             prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mt-8 prose-h2:mb-4
                             prose-h3:text-xl prose-h3:font-semibold prose-h3:text-[#E6007E]
                             prose-p:mb-4 prose-ul:list-disc prose-ul:pl-5 prose-li:mb-2
                             prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-zinc-50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic"
                  dangerouslySetInnerHTML={{ __html: cmsContent }}
                />
              ) : (
                /* Default fallback content if backend is offline or CMS page is unpopulated */
                <div className="space-y-4 text-base text-zinc-600 leading-relaxed">
                  <p>
                    At <strong className="text-zinc-900 font-semibold">Sri Kriscon Industries</strong>, we take pride in being a premier manufacturer and supplier of specialized packaging solutions — including Luxury Rigid Boxes, Mono Cartons, Sweet Boxes, and Heavy-Duty Corrugated Cartons.
                  </p>
                  <p>
                    Equipped with high-precision die-cutting machinery and modern finishing technologies, we partner with enterprises across FMCG, confectioneries, food and beverage, pharmaceuticals, and lifestyle sectors.
                  </p>
                  <blockquote className="mt-6 border-l-4 border-primary pl-4 py-1">
                    <p className="italic text-zinc-800 text-sm sm:text-base leading-relaxed">
                      &ldquo;Packaging is your brand&apos;s first physical impression. We craft every box to captivate, protect, and leave an unforgettable mark.&rdquo;
                    </p>
                  </blockquote>
                </div>
              )}

              {/* Industries Badges */}
              <div className="mt-8 pt-6 border-t border-zinc-200">
                <p className="text-xs font-extrabold tracking-widest text-zinc-500 uppercase mb-2.5">Industries We Serve</p>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRIES.map((ind) => (
                    <span key={ind} className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. MISSION & VISION ──────────────────────────────────────────── */}
      <section className="bg-zinc-50 py-16 sm:py-20 border-y border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold tracking-widest text-primary uppercase mb-1.5 block">
              OUR PURPOSE & DIRECTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
              Mission & Vision
            </h2>
            <p className="mt-2 text-zinc-600 text-sm sm:text-base">
              Driving sustainable progress and superior craftsmanship across India&apos;s packaging landscape.
            </p>
          </div>

          {/* Structure: (Image | Mission/Vision) side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

            {/* Left Column: Premium Visual Showcase (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-xl border-4 border-white bg-zinc-200">
                <Image
                  src="/product_images/SKI_SWEET-BOXES (12).webp"
                  alt="Sri Kriscon Manufacturing Excellence"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                <div className="absolute bottom-6 inset-x-6 text-white space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-white border border-white/20">
                    <Sparkles className="h-3 w-3 text-[#B5A57A]" />
                    Precision Manufacturing
                  </span>
                  <p className="text-lg font-bold">Sri Kriscon Packaging Standards</p>
                  <p className="text-xs text-white/80 leading-relaxed">
                    Dewas, Madhya Pradesh • Serving nationwide businesses with unmatched reliability.
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 sm:-right-5 bg-white p-3.5 rounded-2xl shadow-lg border border-zinc-100 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">Certified Quality</p>
                  <p className="text-[10px] text-zinc-500 font-mono">GSTIN: {OFFICIAL_GST}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Mission & Vision Cards (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Mission Card */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Target className="h-5 w-5" />
                  </div>
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-900">Our Mission</h3>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded">
                        Purpose
                      </span>
                    </div>
                    <p className="text-zinc-600 text-sm leading-relaxed">
                      To engineer exceptional, structurally superior packaging solutions that protect products, captivate consumers, and empower businesses to scale with confidence, while relentlessly upholding environmental responsibility and operational integrity.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-zinc-700 font-medium">
                      {["Flawless die-cutting & finish", "Eco-conscious recyclable stock", "Consistent delivery timelines", "Competitive industrial pricing"].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vision Card */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-[#E6007E]/10 text-[#E6007E] flex items-center justify-center shrink-0">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg sm:text-xl font-bold text-zinc-900">Our Vision</h3>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#E6007E] bg-[#E6007E]/10 px-2.5 py-0.5 rounded">
                        Aspiration
                      </span>
                    </div>
                    <p className="text-zinc-600 text-sm leading-relaxed">
                      To be acknowledged as India&apos;s premier benchmark in rigid packaging and bespoke box manufacturing — leading the transition toward intelligent, zero-defect, and sustainable packaging infrastructure that enriches brand equity globally.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs text-zinc-700 font-medium">
                      {["Next-gen automated production", "Nationwide distribution network", "Continuous aesthetic innovation", "Long-term customer partnerships"].map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. COMPANY CREDENTIALS STRIP ────────────────────────────────── */}
      <section className="bg-white py-12 border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">GST Registered</p>
                <p className="text-xs sm:text-sm font-bold text-zinc-900 font-mono">{OFFICIAL_GST}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Official Inquiries</p>
                <a href={`mailto:${OFFICIAL_EMAIL}`} className="text-xs sm:text-sm font-bold text-primary hover:underline">
                  {OFFICIAL_EMAIL}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Direct Line</p>
                <a href={`tel:${business.phone}`} className="text-xs sm:text-sm font-bold text-zinc-900 hover:text-primary">
                  {business.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Plant Location</p>
                <p className="text-xs sm:text-sm font-bold text-zinc-900">Dewas, Madhya Pradesh</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 5. CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-[#072429] py-16 sm:py-20 text-white text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <span className="text-xs font-bold tracking-widest text-[#B5A57A] uppercase block mb-3">
            Partner With Us
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight">
            Let&apos;s Create Packaging<br />
            <span className="text-[#B5A57A]">Worth Remembering</span>
          </h2>
          <p className="mt-4 text-zinc-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Connect with our packaging engineers to discuss custom box sizes, finishes, and sample prototypes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B5A57A] px-8 py-3 text-sm font-bold text-white hover:bg-[#B5A57A]/90 transition-colors shadow-md"
            >
              Explore Products
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
