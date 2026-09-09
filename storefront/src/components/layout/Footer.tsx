"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, Clock } from "lucide-react";
import WhatsAppIcon from "@/src/components/ui/WhatsAppIcon";
import { theme } from "@/src/config/theme";
import { whatsappLink } from "@/src/lib/utils";
import { useSetting } from "@/src/hooks/useSettings";

const { business } = theme;

// ─── Inline Brand SVGs ───────────────────────────────────────────────────────
const icons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Youtube: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export default function Footer() {
  const year = new Date().getFullYear();

  const { value: storeName } = useSetting("storeName");
  const { value: storeTagline } = useSetting("storeTagline");
  const { value: storePhone } = useSetting("storePhone");
  const { value: storeEmail } = useSetting("storeEmail");
  const { value: storeAddress } = useSetting("storeAddress");
  const { value: storeGst } = useSetting("gstNumber");
  const { value: whatsappNumber } = useSetting("whatsappNumber");
  const { value: facebookUrl } = useSetting("facebookUrl");
  const { value: instagramUrl } = useSetting("instagramUrl");
  const { value: youtubeUrl } = useSetting("youtubeUrl");

  const name = (storeName || business.name).toUpperCase();
  const tagline =
    storeTagline ||
    "Leading manufacturer and supplier of premium rigid boxes, mono cartons, and industrial packaging solutions engineered for performance and prestige.";
  const phone = storePhone || business.phone;
  // Official Authoritative Business Credentials (cannot be overwritten by dummy API/DB data)
  const email = "info@srikriscon.com";
  const address = storeAddress || business.address || "E-6, Industrial Area, Dewas, Madhya Pradesh 455001";
  const gst = "23DZAPS6347N1ZU";
  const whatsapp = whatsappNumber || business.whatsapp;
  const facebook = facebookUrl || business.facebook;
  const instagram = instagramUrl || business.instagram;
  const youtube = youtubeUrl || business.youtube;

  return (
    <footer className="bg-[#072429] text-zinc-300 border-t border-white/10 relative overflow-hidden font-sans">
      {/* Top subtle brand divider with gold accent */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#B5A57A] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Main 4-Column Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 py-16">
          
          {/* Column 1: Brand & Socials (Width: 4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <Link href="/" className="inline-block group">
                <h2 className="text-xl sm:text-2xl font-black tracking-wider text-[#B5A57A] uppercase font-sans transition-colors group-hover:text-[#d3c292]">
                  {name}
                </h2>
              </Link>
              <div className="w-10 h-[2px] bg-[#B5A57A] mt-2" />
            </div>

            <p className="text-sm text-zinc-300/80 leading-relaxed max-w-sm">
              {tagline}
            </p>

            {/* GSTIN Badge */}
            <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 border border-white/15 px-3.5 py-1.5 text-xs text-zinc-200">
              <ShieldCheck className="h-4 w-4 text-[#B5A57A] shrink-0" />
              <span>
                GSTIN: <strong className="text-white font-mono tracking-wider">{gst}</strong>
              </span>
            </div>

            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3.5">
                CONNECT WITH US
              </p>
              <div className="flex items-center gap-2.5">
                {facebook && (
                  <SocialIcon
                    href={facebook}
                    label="Facebook"
                    icon={<icons.Facebook />}
                  />
                )}
                {instagram && (
                  <SocialIcon
                    href={instagram}
                    label="Instagram"
                    icon={<icons.Instagram />}
                  />
                )}
                {business.twitter && (
                  <SocialIcon
                    href={business.twitter}
                    label="Twitter / X"
                    icon={<icons.Twitter />}
                  />
                )}
                {youtube && (
                  <SocialIcon
                    href={youtube}
                    label="YouTube"
                    icon={<icons.Youtube />}
                  />
                )}
                {whatsapp && (
                  <SocialIcon
                    href={whatsappLink(whatsapp, "Hi Sri Kriscon, I have an inquiry.")}
                    label="WhatsApp"
                    icon={<WhatsAppIcon className="h-4 w-4" />}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links (Width: 2 cols) */}
          <div className="lg:col-span-2">
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                QUICK LINKS
              </h3>
              <div className="w-6 h-[2px] bg-[#B5A57A] mt-2 mb-6" />
            </div>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Products", href: "/products" },
                { label: "Categories", href: "/categories" },
                { label: "Blog & Insights", href: "/blog" },
                { label: "Contact Us", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors duration-200"
                  >
                    <span className="relative pb-0.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#B5A57A] after:transition-all after:duration-300 group-hover:after:w-full">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support & Policies (Width: 3 cols) */}
          <div className="lg:col-span-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                SUPPORT & POLICIES
              </h3>
              <div className="w-6 h-[2px] bg-[#B5A57A] mt-2 mb-6" />
            </div>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms-conditions" },
                { label: "Shipping Policy", href: "/shipping-policy" },
                { label: "Track Your Order", href: "/track" },
                { label: "Warranty & FAQs", href: "/#faq" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors duration-200"
                  >
                    <span className="relative pb-0.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-[#B5A57A] after:transition-all after:duration-300 group-hover:after:w-full">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us (Width: 3 cols) */}
          <div className="lg:col-span-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                CONTACT US
              </h3>
              <div className="w-6 h-[2px] bg-[#B5A57A] mt-2 mb-6" />
            </div>
            <ul className="space-y-4 text-sm">
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3.5 group hover:text-white transition-colors"
                  >
                    <span className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B5A57A] shrink-0 group-hover:bg-[#B5A57A]/15 group-hover:border-[#B5A57A]/50 transition-all">
                      <Phone className="h-4 w-4" />
                    </span>
                    <span className="group-hover:text-white transition-colors">{phone}</span>
                  </a>
                </li>
              )}

              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3.5 group hover:text-white transition-colors"
                  >
                    <span className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B5A57A] shrink-0 group-hover:bg-[#B5A57A]/15 group-hover:border-[#B5A57A]/50 transition-all">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="break-all text-zinc-200 group-hover:text-white transition-colors font-medium">
                      {email}
                    </span>
                  </a>
                </li>
              )}

              {whatsapp && (
                <li>
                  <a
                    href={whatsappLink(whatsapp, "Hi Sri Kriscon, I have an inquiry.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 group hover:text-white transition-colors"
                  >
                    <span className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B5A57A] shrink-0 group-hover:bg-[#B5A57A]/15 group-hover:border-[#B5A57A]/50 transition-all">
                      <WhatsAppIcon className="h-4 w-4" />
                    </span>
                    <span className="group-hover:text-white transition-colors">WhatsApp: +{whatsapp}</span>
                  </a>
                </li>
              )}

              {address && (
                <li>
                  <div className="flex items-start gap-3.5">
                    <span className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B5A57A] shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="leading-relaxed text-zinc-300/80">
                      {address}
                    </span>
                  </div>
                </li>
              )}

              <li>
                <div className="flex items-center gap-3.5 text-xs text-zinc-300/70">
                  <span className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B5A57A] shrink-0">
                    <Clock className="h-4 w-4" />
                  </span>
                  <span>Mon – Sat: 9:00 AM – 6:00 PM</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* ── Bottom Legal Strip with Separator Dots ────────────────── */}
      <div className="border-t border-white/10 bg-[#041a1d] py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {year} {name} Industries. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-zinc-300">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/terms-conditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">
              Shipping Policy
            </Link>
            <span className="text-zinc-600">•</span>
            <Link href="/track" className="hover:text-white transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-[#B5A57A]/60 hover:bg-[#B5A57A]/15 hover:scale-105 transition-all duration-300 shadow-sm"
    >
      {icon}
    </a>
  );
}
