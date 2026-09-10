"use client";

import Spinner from "@/src/components/ui/Spinner";
import { useCmsPage } from "@/src/hooks/useCmsPage";
import { Shield, Mail, Phone, MapPin, ChevronRight, Lock, FileText, CheckCircle2, ShieldCheck, Eye, Database, RefreshCw } from "lucide-react";
import Link from "next/link";
import { theme } from "@/src/config/theme";

export default function PrivacyPolicyPage() {
  const { data: page, isLoading } = useCmsPage("privacy-policy");

  if (isLoading)
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-zinc-800 pb-20">

      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-zinc-400" />
            <span className="text-zinc-900 font-semibold">Privacy Policy</span>
          </nav>
        </div>
      </div>

      {/* ── Colorful Hero Header ───────────────────────────────────────── */}
      <header className="bg-[#072429] text-white py-14 sm:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#B5A57A]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#E6007E]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B5A57A]/20 text-[#B5A57A] text-xs font-bold tracking-wider uppercase mb-4 border border-[#B5A57A]/30">
            <Shield className="h-3.5 w-3.5" />
            Data Protection & Security
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-300 mt-3 max-w-2xl leading-relaxed">
            How Sri Kriscon Industries protects, processes, and respects your personal and business information.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-white/10 text-xs text-zinc-300">
            <span>Effective Date: <strong>September 2026</strong></span>
            <span>•</span>
            <span>GSTIN: <strong className="font-mono text-[#B5A57A]">23DZAPS6347N1ZU</strong></span>
            <span>•</span>
            <span>Official Contact: <a href="mailto:info@srikriscon.com" className="text-white underline">info@srikriscon.com</a></span>
          </div>
        </div>
      </header>

      {/* ── Colorful Highlights Row ────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-md flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-semibold">256-Bit SSL</p>
              <p className="text-sm font-bold text-zinc-900">Encrypted Transactions</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-md flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-semibold">Zero Data Selling</p>
              <p className="text-sm font-bold text-zinc-900">100% Privacy Respected</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-md flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-semibold">Full Tax Compliance</p>
              <p className="text-sm font-bold text-zinc-900">Valid GST Invoicing</p>
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
            <h2 className="text-xl font-bold text-zinc-900">Introduction & Scope</h2>
          </div>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed pl-10">
            Sri Kriscon Industries (&ldquo;Sri Kriscon&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) respects your privacy and is dedicated to securing the personal details of all users, businesses, and procurement officers who interact with our digital platform, request product quotations, or purchase our packaging goods.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-7 w-7 rounded-lg bg-[#B5A57A] text-white text-xs font-bold flex items-center justify-center font-mono">
              02
            </span>
            <h2 className="text-xl font-bold text-zinc-900">Information We Collect</h2>
          </div>
          <div className="pl-10 space-y-3 text-sm text-zinc-600">
            <p>We collect only information required to fulfill orders and provide packaging engineering services:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <p className="font-bold text-xs text-zinc-900 mb-1">Contact & Shipping Details</p>
                <p className="text-xs text-zinc-600">Name, delivery address, phone number, and official correspondence email (<code className="bg-white px-1 py-0.5 rounded border text-[11px]">info@srikriscon.com</code>).</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <p className="font-bold text-xs text-zinc-900 mb-1">Business & GSTIN Information</p>
                <p className="text-xs text-zinc-600">Enterprise name, billing addresses, and registered GST number for input tax credit invoices.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <p className="font-bold text-xs text-zinc-900 mb-1">Product & Order Details</p>
                <p className="text-xs text-zinc-600">Product specifications, custom box dimensions, and order quantities.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
                <p className="font-bold text-xs text-zinc-900 mb-1">Payment Information</p>
                <p className="text-xs text-zinc-600">Payment transaction details securely processed via Razorpay.</p>
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
            <h2 className="text-xl font-bold text-zinc-900">How We Use Your Information</h2>
          </div>
          <ul className="pl-10 space-y-2 text-sm text-zinc-600 list-disc">
            <li>Processing, die-cutting, printing, and shipping your product packaging orders.</li>
            <li>Issuing legitimate GST tax invoices and complying with Indian taxation statutes under <strong>GSTIN: 23DZAPS6347N1ZU</strong>.</li>
            <li>Transmitting shipment tracking updates via SMS, email, and WhatsApp notifications.</li>
            <li>Providing direct customer support for custom box dimensions and quotes.</li>
            <li>Never selling your data to third-party marketing companies.</li>
          </ul>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-7 w-7 rounded-lg bg-[#E6007E] text-white text-xs font-bold flex items-center justify-center font-mono">
              04
            </span>
            <h2 className="text-xl font-bold text-zinc-900">Security & Third-Party Disclosure</h2>
          </div>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed pl-10">
            We never sell or distribute your data to marketing aggregators. Information is shared exclusively with certified PCI-DSS payment gateways (Razorpay) and trusted freight carriers (Shiprocket, Bluedart, Delhivery) strictly for delivery completion.
          </p>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-7 w-7 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center font-mono">
              05
            </span>
            <h2 className="text-xl font-bold text-zinc-900">Your Data Rights</h2>
          </div>
          <div className="pl-10 space-y-2 text-sm text-zinc-600">
            <p>You have the right to access, update, or request removal of your personal information at any time. To exercise your rights, contact us at <a href="mailto:info@srikriscon.com" className="text-primary font-bold hover:underline">info@srikriscon.com</a>.</p>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-gradient-to-br from-primary/5 via-white to-[#B5A57A]/10 rounded-2xl border-2 border-primary/20 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Have Questions About Your Privacy?</h3>
          <p className="text-xs sm:text-sm text-zinc-600 mb-4">
            Contact our compliance desk directly for data updates, account inquiries, or invoice queries:
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
              <span>Dewas, Madhya Pradesh (GSTIN: 23DZAPS6347N1ZU)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}