"use client";

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { theme } from "@/src/config/theme";
import { whatsappLink } from "@/src/lib/utils";
import { useSetting } from "@/src/hooks/useSettings";

const { business } = theme;

// ─── Inline brand SVGs ─────────────────────────────────────────────
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
  const { value: storeEmail } = useSetting("storeEmail");
  const { value: storePhone } = useSetting("storePhone");
  const { value: storeAddress } = useSetting("storeAddress");
  const { value: whatsappNumber } = useSetting("whatsappNumber");
  const { value: facebookUrl } = useSetting("facebookUrl");
  const { value: instagramUrl } = useSetting("instagramUrl");
  const { value: youtubeUrl } = useSetting("youtubeUrl");
  const { value: gstNumber } = useSetting("gstNumber");
  const { value: logoUrlSetting } = useSetting("logoUrl");

  const name = storeName || business.name;
  const tagline = storeTagline || business.tagline;
  const email = storeEmail || business.email;
  const phone = storePhone || business.phone;
  const address = storeAddress || business.address;
  const whatsapp = whatsappNumber || business.whatsapp;
  const facebook = facebookUrl || business.facebook;
  const instagram = instagramUrl || business.instagram;
  const youtube = youtubeUrl || business.youtube;
  const gst = gstNumber || business.gst;
  const logoUrl = logoUrlSetting || "/sri-kriscon-logo.webp";

  return (
    <footer>
      {/* ── Main Footer Block — primary theme teal ────────────────────────── */}
      <div className="relative bg-[#0B3A42] overflow-hidden text-zinc-300">
        
        {/* Subtle decorative background text */}
        <span
          aria-hidden
          className="pointer-events-none select-none absolute inset-x-0 bottom-0 flex justify-center text-[13vw] font-black text-white/[0.015] leading-none whitespace-nowrap overflow-hidden"
        >
          {name}
        </span>

        <div className="relative z-10 mx-auto max-w-[83rem] px-4 sm:px-6 lg:px-8 pt-16 pb-14">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14 pb-14 border-b border-white/[0.08]">
            
            {/* Column 1: Brand & Logo */}
            <div className="flex flex-col items-start">
              <Link href="/" className="flex items-center gap-3 mb-4 group">
                <div className="relative h-11 w-11 bg-[#0D4A50] rounded-full flex-shrink-0 transition-transform group-hover:scale-105">
                  <Image
                    src={logoUrl || "/sri-kriscon-logo.webp"}
                    alt={name}
                    fill
                    className="object-contain p-1.5"
                  />
                </div>
                <div>
                  <p className="font-display text-lg font-bold text-white tracking-tight leading-none uppercase">
                    {name}
                  </p>
                  <p className="text-[8px] text-zinc-400 font-bold tracking-[0.25em] mt-1.5 uppercase">
                    {(tagline.split("•")[0] || "INDUSTRIES").toUpperCase()}
                  </p>
                </div>
              </Link>
              <div className="w-8 h-[2px] bg-accent mb-4" />
              <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                Premium industrial packaging solutions. Built for performance, designed for durability.
              </p>

              {/* Social icons */}
              <h4 className="text-[10px] font-extrabold tracking-[0.2em] text-white/90 uppercase mb-3">
                FOLLOW US
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {whatsapp && (
                  <SocialIcon
                    href={whatsappLink(whatsapp)}
                    label="WhatsApp"
                    icon={<MessageCircle className="h-4 w-4" />}
                    hoverBg="hover:bg-[#25D366]"
                  />
                )}
                {instagram && (
                  <SocialIcon
                    href={instagram}
                    label="Instagram"
                    icon={<icons.Instagram />}
                    hoverBg="hover:bg-[#E1306C]"
                  />
                )}
                {facebook && (
                  <SocialIcon
                    href={facebook}
                    label="Facebook"
                    icon={<icons.Facebook />}
                    hoverBg="hover:bg-[#1877F2]"
                  />
                )}
                {business.twitter && (
                  <SocialIcon
                    href={business.twitter}
                    label="Twitter / X"
                    icon={<icons.Twitter />}
                    hoverBg="hover:bg-white/20"
                  />
                )}
                {youtube && (
                  <SocialIcon
                    href={youtube}
                    label="YouTube"
                    icon={<icons.Youtube />}
                    hoverBg="hover:bg-[#FF0000]"
                  />
                )}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-[11px] font-extrabold tracking-[0.25em] text-white uppercase">
                QUICK LINKS
              </h3>
              <div className="w-8 h-[2px] bg-accent mt-2 mb-6" />
              <ul className="space-y-3.5">
                <li>
                  <Link href="/" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div>
              <h3 className="text-[11px] font-extrabold tracking-[0.25em] text-white uppercase">
                SUPPORT
              </h3>
              <div className="w-8 h-[2px] bg-accent mt-2 mb-6" />
              <ul className="space-y-3.5">
                <li>
                  <Link href="/contact#faq" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                    Blogs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h3 className="text-[11px] font-extrabold tracking-[0.25em] text-white uppercase">
                CONTACT
              </h3>
              <div className="w-8 h-[2px] bg-accent mt-2 mb-6" />
              <ul className="space-y-4">
                {phone && (
                  <li className="flex items-center gap-3.5 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 border border-zinc-800 text-accent group-hover:text-white transition-colors duration-200 flex-shrink-0">
                      <Phone className="h-4 w-4" />
                    </div>
                    <a href={`tel:${phone}`} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                      {phone}
                    </a>
                  </li>
                )}
                {email && (
                  <li className="flex items-center gap-3.5 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 border border-zinc-800 text-accent group-hover:text-white transition-colors duration-200 flex-shrink-0">
                      <Mail className="h-4 w-4" />
                    </div>
                    <a href={`mailto:${email}`} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 break-all">
                      {email}
                    </a>
                  </li>
                )}
                {whatsapp && (
                  <li className="flex items-center gap-3.5 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 border border-zinc-800 text-accent group-hover:text-white transition-colors duration-200 flex-shrink-0">
                      <MessageCircle className="h-4 w-4" />
                    </div>
                    <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                      WhatsApp Chat
                    </a>
                  </li>
                )}
                {address && (
                  <li className="flex items-start gap-3.5 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900/80 border border-zinc-800 text-accent group-hover:text-white transition-colors duration-200 flex-shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-zinc-400 leading-relaxed">
                      {address}
                    </span>
                  </li>
                )}
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ── Legal strip — near-black ──────────────────────────────────────── */}
      <div className="bg-[#09090b] border-t border-white/[0.04]">
        <div className="mx-auto max-w-[83rem] px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {year} {name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-3 sm:gap-5 items-center justify-center">
            {gst && (
              <span className="font-mono text-[10px] text-zinc-600">{gst}</span>
            )}
            <Link href="/privacy-policy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-zinc-800 select-none">•</span>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms of Service
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
  hoverBg = "hover:bg-white/10",
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  hoverBg?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.03] border border-white/[0.08] text-zinc-400 hover:text-white transition-all duration-300 ${hoverBg}`}
    >
      {icon}
    </a>
  );
}
