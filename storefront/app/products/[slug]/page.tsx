import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import { getPrimaryImage } from "@/src/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://srikriscon-be-13514095818.asia-south1.run.app";
    const res = await fetch(`${apiUrl}/api/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://srikriscon.com";

  if (!product) {
    return {
      title: "Product Details | Sri Kriscon Industries",
      description: "Explore premium industrial packaging and boxes at Sri Kriscon.",
    };
  }

  // Determine primary or first image
  const rawImage =
    (product.images && getPrimaryImage(product.images)) ||
    product.images?.[0]?.url ||
    "/Sri Kriscon logo png.webp";

  const imageUrl = rawImage.startsWith("http")
    ? rawImage
    : `${siteUrl.replace(/\/$/, "")}/${rawImage.replace(/^\//, "")}`;

  const title = `${product.name} | Sri Kriscon Industries`;
  const description =
    product.shortDescription ||
    (product.description
      ? product.description.replace(/<[^>]*>?/gm, "").slice(0, 160)
      : "") ||
    "High quality packaging boxes and industrial solutions from Sri Kriscon.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl.replace(/\/$/, "")}/products/${slug}`,
      siteName: "Sri Kriscon Industries",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  return <ProductDetailClient slug={slug} />;
}
