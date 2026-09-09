import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/src/components/Providers";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import WhatsAppButton from "@/src/components/layout/WhatsAppButton";
import Favicon from "@/src/components/layout/Favicon";
import { theme } from "@/src/config/theme";

// ── Fonts ─────────────────────────────────────────────────────────────────────
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
  style:  ["normal", "italic"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const defaultTitle = theme.business.name;
  const defaultDesc = theme.business.tagline;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const res = await fetch(`${apiUrl}/api/settings/public`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const response = await res.json();
      const settings = response.data || {};
      const storeName = settings.storeName || defaultTitle;
      const storeTagline = settings.storeTagline || defaultDesc;

      return {
        title: {
          default: storeName,
          template: `%s | ${storeName}`,
        },
        description: storeTagline,
        icons: {
          icon: settings.faviconUrl || "/favicon.ico",
          shortcut: settings.faviconUrl || "/favicon.ico",
          apple: settings.faviconUrl || "/favicon.ico",
        }
      };
    }
  } catch (error) {
    // Fail silently, fallback to theme defaults
  }

  return {
    title: {
      default: defaultTitle,
      template: `%s | ${defaultTitle}`,
    },
    description: defaultDesc,
    icons: {
      icon: "/favicon.ico",
    }
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        <Providers>
          <Favicon />
          <Navbar />
          <main className="min-h-screen pt-[108px] md:pt-[158px]">{children}</main>
          <Footer />
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
