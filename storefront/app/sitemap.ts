import type { MetadataRoute } from "next";
import { theme } from "@/src/config/theme";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mystore.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                      lastModified: now, changeFrequency: "daily",   priority: 1 },
    { url: `${BASE_URL}/products`,        lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/categories`,      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/gallery`,         lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE_URL}/about`,           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`,         lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`,  lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE_URL}/terms`,           lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Dynamic product and category URLs would be fetched here if backend is available at build time.
  // Example (uncomment and adapt):
  // const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?size=1000`)
  //   .then(r => r.json()).then(r => r.data?.content ?? [])
  // const productUrls = products.map((p: { slug: string; updatedAt: string }) => ({
  //   url: `${BASE_URL}/products/${p.slug}`,
  //   lastModified: new Date(p.updatedAt),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.7,
  // }))

  return [...staticPages];
}
