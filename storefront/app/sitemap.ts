import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://srikriscon.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://srikriscon-be-13514095818.asia-south1.run.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                       lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE_URL}/products`,         lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/categories`,       lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/blog`,             lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE_URL}/about`,            lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`,          lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/gallery`,          lastModified: now, changeFrequency: "weekly",  priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`,   lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/terms-conditions`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/shipping-policy`,  lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  let dynamicProducts: MetadataRoute.Sitemap = [];
  let dynamicCategories: MetadataRoute.Sitemap = [];
  let dynamicBlogs: MetadataRoute.Sitemap = [];

  try {
    const [prodRes, catRes, blogRes] = await Promise.allSettled([
      fetch(`${API_URL}/api/products?size=200`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/api/categories/active`, { next: { revalidate: 3600 } }),
      fetch(`${API_URL}/api/blogs`, { next: { revalidate: 3600 } }),
    ]);

    if (prodRes.status === "fulfilled" && prodRes.value.ok) {
      const prodJson = await prodRes.value.json();
      const products = prodJson.data?.content || prodJson.content || [];
      dynamicProducts = products.map((p: any) => ({
        url: `${BASE_URL}/products/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }

    if (catRes.status === "fulfilled" && catRes.value.ok) {
      const catJson = await catRes.value.json();
      const categories = catJson.data || catJson || [];
      if (Array.isArray(categories)) {
        dynamicCategories = categories.map((c: any) => ({
          url: `${BASE_URL}/categories/${c.slug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
      }
    }

    if (blogRes.status === "fulfilled" && blogRes.value.ok) {
      const blogJson = await blogRes.value.json();
      const blogs = blogJson.data || blogJson || [];
      if (Array.isArray(blogs)) {
        dynamicBlogs = blogs.map((b: any) => ({
          url: `${BASE_URL}/blog/${b.slug}`,
          lastModified: b.createdAt ? new Date(b.createdAt) : now,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
      }
    }
  } catch (err) {
    // Graceful fallback to static pages if API is unreachable
  }

  return [...staticPages, ...dynamicProducts, ...dynamicCategories, ...dynamicBlogs];
}
