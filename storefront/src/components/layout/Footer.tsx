"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
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
  const { value: whatsappNumber } = useSetting("whatsappNumber");
  const { value: facebookUrl } = useSetting("facebookUrl");
  const { value: instagramUrl } = useSetting("instagramUrl");
  const { value: youtubeUrl } = useSetting("youtubeUrl");

  const name = (storeName || business.name).toUpperCase();
  const tagline = storeTagline || "Premium agricultural machinery for modern farming. Built for performance, designed for durability.";
  const phone = storePhone || business.phone;
  const email = storeEmail || business.email;
  const address = storeAddress || "E-6, Industrial Area, Dewas, Madhya Pradesh 455001";
  const whatsapp = whatsappNumber || business.whatsapp;
  const facebook = facebookUrl || business.facebook;
  const instagram = instagramUrl || business.instagram;
  const youtube = youtubeUrl || business.youtube;

  return (
    <footer className="bg-[#081420] text-zinc-400 border-t border-white/10 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ── Main 4-Column Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 py-16">
          
          {/* Column 1: Brand & Socials (Width: 4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <Link href="/" className="inline-block group">
                <h2 className="text-xl sm:text-2xl font-black tracking-wider text-[#38bdf8] uppercase font-sans transition-colors group-hover:text-cyan-300">
                  {name}
                </h2>
              </Link>
              <div className="w-9 h-[2px] bg-[#38bdf8] mt-2" />
            </div>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              {tagline}
            </p>

            <div className="pt-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-3.5">
                FOLLOW US
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
                    href={whatsappLink(whatsapp)}
                    label="WhatsApp"
                    icon={<MessageCircle className="h-4 w-4" />}
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
              <div className="w-6 h-[2px] bg-[#38bdf8] mt-2 mb-6" />
            </div>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support (Width: 3 cols) */}
          <div className="lg:col-span-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                SUPPORT
              </h3>
              <div className="w-6 h-[2px] bg-[#38bdf8] mt-2 mb-6" />
            </div>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  Warranty & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact (Width: 3 cols) */}
          <div className="lg:col-span-3">
            <div>
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-white">
                CONTACT
              </h3>
              <div className="w-6 h-[2px] bg-[#38bdf8] mt-2 mb-6" />
            </div>
            <ul className="space-y-4 text-sm">
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3.5 group hover:text-white transition-colors"
                  >
                    <span className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#38bdf8] shrink-0 group-hover:bg-[#38bdf8]/10 group-hover:border-[#38bdf8]/40 transition-all">
                      <Phone className="h-4 w-4" />
                    </span>
                    <span>{phone}</span>
                  </a>
                </li>
              )}

              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3.5 group hover:text-white transition-colors"
                  >
                    <span className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#38bdf8] shrink-0 group-hover:bg-[#38bdf8]/10 group-hover:border-[#38bdf8]/40 transition-all">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="break-all">{email}</span>
                  </a>
                </li>
              )}

              {whatsapp && (
                <li>
                  <a
                    href={whatsappLink(whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3.5 group hover:text-white transition-colors"
                  >
                    <span className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#38bdf8] shrink-0 group-hover:bg-[#38bdf8]/10 group-hover:border-[#38bdf8]/40 transition-all">
                      <MessageCircle className="h-4 w-4" />
                    </span>
                    <span>WhatsApp Chat</span>
                  </a>
                </li>
              )}

              {address && (
                <li>
                  <div className="flex items-start gap-3.5">
                    <span className="h-9 w-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#38bdf8] shrink-0 mt-0.5">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="leading-relaxed text-zinc-400">
                      {address}
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </div>

        </div>

      </div>

      {/* ── Bottom Legal Strip ────────────────────────────────────────── */}
      <div className="border-t border-white/10 bg-[#040c14]/80 py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {year} {name} Pvt Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-zinc-500">
            <Link href="/privacy-policy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Shipping Policy
            </Link>
            <span>•</span>
            <Link href="/track" className="hover:text-zinc-300 transition-colors">
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
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-[#38bdf8]/50 hover:bg-[#38bdf8]/10 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
