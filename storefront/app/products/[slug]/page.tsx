import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
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

  // Primary image
  const primaryImg =
    product.images?.[0]?.url || "/product_images/SKI_SWEET-BOXES (1).webp";
  const imageUrl = primaryImg.startsWith("http")
    ? primaryImg
    : `${siteUrl}${primaryImg.startsWith("/") ? "" : "/"}${primaryImg}`;

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
      url: `${siteUrl}/products/${slug}`,
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
