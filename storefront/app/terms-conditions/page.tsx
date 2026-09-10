"use client";

import Spinner from "@/src/components/ui/Spinner";
import { useCmsPage } from "@/src/hooks/useCmsPage";
import { FileCheck, Shield, Clock, Mail, Phone, MapPin, ChevronRight, Scale } from "lucide-react";
import Link from "next/link";
import { theme } from "@/src/config/theme";

export default function TermsConditionsPage() {
  const { data: page, isLoading } = useCmsPage("terms-conditions");

  if (isLoading)
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );

  const cmsContent = page?.content && page.content.trim().length > 100 ? page.content : null;

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-zinc-800 pb-20">
      
      {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-zinc-400" />
            <span className="text-zinc-900 font-semibold">Terms & Conditions</span>
          </nav>
        </div>
      </div>

      {/* ── Colorful Hero Header ───────────────────────────────────────── */}
      <header className="bg-[#072429] text-white py-14 sm:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#B5A57A]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#E6007E]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B5A57A]/20 text-[#B5A57A] text-xs font-bold tracking-wider uppercase mb-4 border border-[#B5A57A]/30">
            <Scale className="h-3.5 w-3.5" />
            Terms of Service
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {page?.title || "Terms & Conditions"}
          </h1>
          <p className="text-sm text-zinc-300 mt-3 max-w-2xl leading-relaxed">
            Legal terms governing product ordering, custom manufacturing, and use of Sri Kriscon services.
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-white/10 text-xs text-zinc-300">
            <span>Effective Date: <strong>September 2026</strong></span>
            <span>•</span>
            <span>GSTIN: <strong className="font-mono text-[#B5A57A]">23DZAPS6347N1ZU</strong></span>
            <span>•</span>
            <span>Official Email: <a href="mailto:info@srikriscon.com" className="text-white underline">info@srikriscon.com</a></span>
          </div>
        </div>
      </header>

      {/* ── Colorful Highlights Row ────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-md flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-semibold">Clear Pricing</p>
              <p className="text-sm font-bold text-zinc-900">Direct Factory Rates</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-md flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-semibold">Verified GSTIN</p>
              <p className="text-sm font-bold text-zinc-900">Valid B2B Invoices</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-md flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-zinc-500 font-semibold">Rapid Dispatch</p>
              <p className="text-sm font-bold text-zinc-900">On-Time Schedules</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Structured Policy Sections / CMS Content ────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
        
        {cmsContent ? (
          <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-10 shadow-xs">
            <div
              className="prose prose-sm sm:prose-base max-w-none text-zinc-700 leading-relaxed
                         prose-headings:font-bold prose-headings:text-primary
                         prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-8 prose-h2:mb-4
                         prose-h3:text-lg prose-h3:font-semibold prose-h3:text-[#B5A57A]
                         prose-p:mb-4 prose-ul:list-disc prose-ul:pl-5 prose-li:mb-2
                         prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-zinc-50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic"
              dangerouslySetInnerHTML={{ __html: cmsContent }}
            />
          </div>
        ) : (
          <>
            {/* Section 1 */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-lg bg-primary text-white text-xs font-bold flex items-center justify-center font-mono">
                  01
                </span>
                <h2 className="text-xl font-bold text-zinc-900">Agreement to Terms</h2>
              </div>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed pl-10">
                These Terms & Conditions constitute a legally binding contract between you and <strong>Sri Kriscon Industries</strong>, governing your purchases, catalog orders, and manufacturing inquiries. By accessing our platform or confirming an order, you accept these terms in full.
              </p>
            </div>

            {/* Section 2 */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-lg bg-[#B5A57A] text-white text-xs font-bold flex items-center justify-center font-mono">
                  02
                </span>
                <h2 className="text-xl font-bold text-zinc-900">Products, Samples & Custom Printing</h2>
              </div>
              <ul className="pl-10 space-y-2 text-sm text-zinc-600 list-disc">
                <li>Sri Kriscon manufactures rigid boxes, mono cartons, sweet boxes, and heavy-duty corrugated cartons.</li>
                <li>Custom printed orders enter production strictly after customer digital proof or sample approval.</li>
                <li>Due to printing substrate variations and display color profiles, slight color shifts within accepted industrial tolerances may occur.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center font-mono">
                  03
                </span>
                <h2 className="text-xl font-bold text-zinc-900">Pricing, Tax Invoices & GST</h2>
              </div>
              <p className="text-zinc-600 text-sm sm:text-base leading-relaxed pl-10">
                All prices are stated in Indian Rupees (₹). Official GST tax invoices are generated for all orders under <strong>GSTIN: 23DZAPS6347N1ZU</strong>. Corporate customers must provide a valid GST number during order placement to receive input tax credit.
              </p>
            </div>

            {/* Section 4 */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <span className="h-7 w-7 rounded-lg bg-[#E6007E] text-white text-xs font-bold flex items-center justify-center font-mono">
                  04
                </span>
                <h2 className="text-xl font-bold text-zinc-900">Payment Terms & Cancellations</h2>
              </div>
              <div className="pl-10 space-y-2.5 text-sm text-zinc-600">
                <p>We accept Razorpay UPI, Net Banking, Credit/Debit cards, and direct Bank RTGS/NEFT transfers.</p>
                <p>Standard in-stock catalog orders can be cancelled within 12 hours of order placement prior to carrier dispatch. Custom manufactured orders cannot be cancelled once board slitting or printing has commenced.</p>
              </div>
            </div>
          </>
        )}

        {/* Contact Card */}
        <div className="bg-gradient-to-br from-primary/5 via-white to-[#B5A57A]/10 rounded-2xl border-2 border-primary/20 p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-bold text-zinc-900 mb-2">Need Contract or Custom Wholesale Terms?</h3>
          <p className="text-xs sm:text-sm text-zinc-600 mb-4">
            For long-term annual supply agreements, bulk rate contracts, and distributor inquiries, get in touch:
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
              <span>Industrial Area, Dewas, MP (GSTIN: 23DZAPS6347N1ZU)</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
