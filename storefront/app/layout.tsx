import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/src/components/Providers";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import WhatsAppButton from "@/src/components/layout/WhatsAppButton";
import { theme } from "@/src/config/theme";

// ── Font ── change the import here when updating theme.ts font.sans ──────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",   // exposes as CSS var used in globals.css
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: theme.business.name,
    template: `%s | ${theme.business.name}`,
  },
  description: theme.business.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
