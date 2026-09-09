"use client";

import Spinner from "@/src/components/ui/Spinner";
import { useCmsPage } from "@/src/hooks/useCmsPage";
import { Truck, Clock, ShieldCheck, MapPin, Mail, Phone, CheckCircle, ChevronRight, PackageCheck } from "lucide-react";
import Link from "next/link";
import { theme } from "@/src/config/theme";

export default function ShippingPolicyPage() {
  const { data: page, isLoading } = useCmsPage("shipping-policy");

  if (isLoading)
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );

  if (page?.content && page.content.trim().length > 100) {
    return (
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14 font-sans">
        <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-3">{page.title}</h1>
        <p className="text-xs text-muted-foreground mb-8">Last updated: September 2026</p>
        <div
          className="prose prose-sm sm:prose max-w-none text-foreground leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-zinc-800 pb-20">
      
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-zinc-400" />
            <span className="text-zinc-900 font-semibold">Shipping Policy</span>
          </nav>
        </div>
      </div>

      {/* ── Colorful Hero Header ───────────────────────────────────────── */}
      <header className="bg-[#072429] text-white py-14 sm:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#B5A57A]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#E6007E]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B5A57A]/20 text-[#B5A57A] text-xs font-bold tracking-wider uppercase mb-4 border border-[#B5A57A]/30">
            <Truck className="h-3.5 w-3.5" />
            Pan-India Logistics & Dispatch
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm text-zinc-300 mt-3 max-w-2xl leading-relaxed">
            Reliable manufacturing turnarounds, secured multi-layer freight packaging, and nationwide tracking.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-white/10 text-xs text-zinc-300">
            <span>Effective Date: <strong>September 2026</strong></span>
            <span>•</span>
            <span>Central Plant: <strong>Dewas, Madhya Pradesh</strong></span>
            <span>•</span>
            <span>GSTIN: <strong className="font-mono text-[#B5A57A]">23DZAPS6347N1ZU</strong></span>
          </div>
        </div>
      </header>

      {/* ── Colorful Highlights Row ────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-md flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-semibold">Standard Dispatch</p>
              <p className="text-sm font-bold text-zinc-900">2 – 4 Business Days</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-md flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <PackageCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-semibold">Heavy Duty Packing</p>
              <p className="text-sm font-bold text-zinc-900">Zero Damage Guarantee</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-md flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-semibold">Pan-India Freight</p>
              <p className="text-sm font-bold text-zinc-900">Direct Door Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Structured Policy Sections ─────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
        
        {/* Section 1 */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-7 w-7 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center font-mono">
              01
            </span>
            <h2 className="text-xl font-bold text-zinc-900">Manufacturing & Dispatch Schedules</h2>
          </div>
          <div className="pl-10 space-y-2.5 text-sm sm:text-base text-zinc-600 leading-relaxed">
            <p>
              At <strong>Sri Kriscon Industries</strong>, every consignment is securely strapped, palletized (for bulk), and packaged in moisture-resistant master cartons to ensure intact delivery:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm">
              <li><strong>Catalog In-Stock Items:</strong> Dispatched within 24 to 72 hours of payment confirmation.</li>
              <li><strong>Custom Printed & Fabricated Boxes:</strong> 7 to 14 working days from design proof approval, depending on tooling and print finishes.</li>
            </ul>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-7 w-7 rounded-lg bg-[#B5A57A] text-white text-xs font-bold flex items-center justify-center font-mono">
              02
            </span>
            <h2 className="text-xl font-bold text-zinc-900">Transit Timelines Across India</h2>
          </div>
          <div className="pl-10 space-y-2 text-sm text-zinc-600">
            <p>Average transit time following dispatch from our Dewas facility:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <p className="font-bold text-xs text-zinc-900 mb-1">Central & West India</p>
                <p className="text-xs text-zinc-600">2 – 4 working days (MP, Maharashtra, Gujarat, Rajasthan)</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <p className="font-bold text-xs text-zinc-900 mb-1">North & South Metros</p>
                <p className="text-xs text-zinc-600">3 – 5 working days (Delhi NCR, Bengaluru, Hyderabad, Chennai)</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <p className="font-bold text-xs text-zinc-900 mb-1">East & Remote Regions</p>
                <p className="text-xs text-zinc-600">5 – 8 working days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-7 w-7 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center font-mono">
              03
            </span>
            <h2 className="text-xl font-bold text-zinc-900">Freight Partners & Live Tracking</h2>
          </div>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed pl-10">
            Consignments are transported via trusted courier aggregators (Shiprocket, Blue Dart, Delhivery) and dedicated logistics carriers (V-Trans, ARC, TCI) for full truckload freight. You receive live SMS and email updates with your Docket/AWB tracking number upon dispatch.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-7 w-7 rounded-lg bg-[#E6007E] text-white text-xs font-bold flex items-center justify-center font-mono">
              04
            </span>
            <h2 className="text-xl font-bold text-zinc-900">Transit Inspection & Damage Policy</h2>
          </div>
          <div className="pl-10 space-y-2 text-sm text-zinc-600">
            <p>Please inspect the outer carton upon receiving your shipment. In the event of external carton damage or tampering:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Record short unboxing video footage and capture clear photographs.</li>
              <li>Report the incident to <a href="mailto:info@srikriscon.com" className="text-primary font-bold hover:underline">info@srikriscon.com</a> or WhatsApp within 48 hours for immediate replacement or freight claims.</li>
            </ul>
          </div>
        </div>

        {/* Section 5: Contact Card */}
        <div className="bg-gradient-to-br from-primary/5 via-white to-[#B5A57A]/10 rounded-2xl border-2 border-primary/20 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Need Shipment Tracking Assistance?</h3>
          <p className="text-xs sm:text-sm text-zinc-600 mb-4">
            Our dispatch coordinators are available Monday to Saturday to assist with tracking and delivery schedules:
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-zinc-700">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <a href="mailto:info@srikriscon.com" className="text-primary hover:underline">info@srikriscon.com</a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a href="tel:917999921111" className="text-primary hover:underline">+91 79999 21111</a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Plant: E-6, Industrial Area, Dewas, MP</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
