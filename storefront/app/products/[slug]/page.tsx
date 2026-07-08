"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, Minus, Plus, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { useProduct, useProducts } from "@/src/hooks/useProducts";
import { useCart } from "@/src/hooks/useCart";
import ImageGallery from "@/src/components/product/ImageGallery";
import VariantSelector from "@/src/components/product/VariantSelector";
import ProductGrid from "@/src/components/product/ProductGrid";
import Button from "@/src/components/ui/Button";
import Badge from "@/src/components/ui/Badge";
import Spinner from "@/src/components/ui/Spinner";
import { formatPrice, cn } from "@/src/lib/utils";
import type { ProductVariant, VariantType } from "@/src/types";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug);
  const { add } = useCart();

  const [selectedVariants, setSelectedVariants] = useState<
    Record<VariantType, number | undefined>
  >({ SIZE: undefined, DESIGN: undefined, MATERIAL: undefined, COLOR: undefined });
  const [qty, setQty] = useState(1);

  // Related products from same category
  const { data: relatedPage } = useProducts({
    categoryId: product?.category?.id,
    size: 4,
  });
  const related = relatedPage?.content.filter((p) => p.slug !== slug) ?? [];

  const selectedVariant = useMemo<ProductVariant | undefined>(() => {
    const id = Object.values(selectedVariants).find((v) => v != null);
    if (!id) return undefined;
    return product?.variants.find((v) => v.id === id);
  }, [selectedVariants, product]);

  const displayPrice = selectedVariant?.price ?? product?.startingPrice ?? product?.price ?? 0;

  const minQty = product?.minOrderQty ?? 1;
  const stock = selectedVariant?.stockQuantity ?? product?.stockQuantity ?? 0;
  const outOfStock = stock === 0;

  function handleSelect(type: VariantType, id: number) {
    setSelectedVariants((prev) => ({
      SIZE: undefined,
      DESIGN: undefined,
      MATERIAL: undefined,
      COLOR: undefined,
      [type]: id,
    }));
  }

  function handleAddToCart() {
    if (!product) return;
    const hasVariants = product.variants.length > 0;
    const types = Object.keys(product.variantsByType) as VariantType[];

    if (hasVariants && !selectedVariant) {
      toast.error(`Please select a ${types[0]?.toLowerCase() ?? "variant"}`);
      return;
    }

    add(
      {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        imageUrl: product.images[0]?.url,
        sku: product.sku,
        variantId: selectedVariant?.id,
        variantType: selectedVariant?.type,
        variantValue: selectedVariant?.value,
        price: displayPrice,
        minOrderQty: minQty,
      },
      qty
    );
    toast.success("Added to cart");
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5">
        <a href="/" className="hover:text-foreground">Home</a>
        <span>/</span>
        <a href="/products" className="hover:text-foreground">Products</a>
        {product.category && (
          <>
            <span>/</span>
            <a href={`/categories/${product.category.slug}`} className="hover:text-foreground">
              {product.category.name}
            </a>
          </>
        )}
        <span>/</span>
        <span className="text-foreground truncate">{product.name}</span>
      </nav>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div>
          <ImageGallery images={product.images} />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.category && (
            <span className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              {formatPrice(displayPrice)}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                <Badge variant="accent">
                  {Math.round(
                    ((product.comparePrice - product.price) / product.comparePrice) * 100
                  )}
                  % off
                </Badge>
              </>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Stock indicator */}
          {outOfStock ? (
            <Badge variant="danger" className="mt-3 w-fit">Out of Stock</Badge>
          ) : stock <= (product.lowStockThreshold ?? 5) ? (
            <Badge variant="accent" className="mt-3 w-fit">
              Only {stock} left!
            </Badge>
          ) : null}

          <div className="my-5 h-px bg-border" />

          {/* Variant selector */}
          <VariantSelector
            variantsByType={product.variantsByType}
            selected={selectedVariants}
            onSelect={handleSelect}
          />

          {/* Quantity */}
          <div className="mt-5">
            <span className="text-sm font-semibold mb-2 block">Quantity</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(minQty, q - 1))}
                  className="flex h-10 w-10 items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-12 items-center justify-center font-medium text-sm border-x border-border">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(stock || 999, q + 1))}
                  className="flex h-10 w-10 items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {minQty > 1 && (
                <span className="text-xs text-muted-foreground">Min: {minQty}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={outOfStock}
              icon={<ShoppingCart className="h-4 w-4" />}
              size="lg"
              fullWidth
              className="flex-1"
            >
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied!");
              }}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors flex-shrink-0"
              aria-label="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-8">
              <h2 className="font-semibold mb-2">Description</h2>
              <div
                className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* Meta */}
          {product.sku && (
            <p className="mt-4 text-xs text-muted-foreground">SKU: {product.sku}</p>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-6">You might also like</h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}

