"use client";

import { useState, useMemo } from "react";
import { ShoppingCart, Minus, Plus, Share2, ShieldCheck, Truck, RefreshCw, FileText } from "lucide-react";
import WhatsAppIcon from "@/src/components/ui/WhatsAppIcon";
import toast from "react-hot-toast";
import { useProduct, useProducts } from "@/src/hooks/useProducts";
import { useCart } from "@/src/hooks/useCart";
import ImageGallery from "@/src/components/product/ImageGallery";
import VariantSelector from "@/src/components/product/VariantSelector";
import ProductGrid from "@/src/components/product/ProductGrid";
import ProductReviews from "@/src/components/product/ProductReviews";
import FaqSection from "@/src/components/home/FaqSection";
import Button from "@/src/components/ui/Button";
import Badge from "@/src/components/ui/Badge";
import Spinner from "@/src/components/ui/Spinner";
import { formatPrice, cn, whatsappLink } from "@/src/lib/utils";
import { theme } from "@/src/config/theme";
import type { ProductVariant, VariantType } from "@/src/types";

interface Props {
  slug: string;
}

export default function ProductDetailClient({ slug }: Props) {
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
  const comparePrice = product?.comparePrice;
  const isOnSale = comparePrice != null && comparePrice > displayPrice;
  const discountPercent = isOnSale ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100) : 0;

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

  function handleChatWithUs() {
    if (!product) return;
    const whatsappNum = theme.business.whatsapp || "917999921111";
    const msg = `Hi Sri Kriscon, I am interested in "${product.name}" (SKU: ${product.sku || 'N/A'}, Selling Price: ₹${displayPrice.toFixed(0)}).\nCould you please provide more details?`;
    window.open(whatsappLink(whatsappNum, msg), "_blank");
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
        <p className="text-muted-foreground text-lg">Product not found.</p>
        <a href="/products" className="mt-4 inline-block text-primary font-bold hover:underline">
          Browse All Products →
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 font-sans">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1.5 flex-wrap">
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
        <span className="text-foreground truncate max-w-xs">{product.name}</span>
      </nav>

      {/* ── Main Top Grid: Gallery (Left) | Purchase Options & Short Description (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div>
          <ImageGallery images={product.images} />
        </div>

        {/* Info & Purchase Options */}
        <div className="flex flex-col">
          {product.category && (
            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
            {product.name}
          </h1>

          {/* Pricing Display */}
          <div className="mt-5 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight">
                {formatPrice(displayPrice)}
              </span>
              {comparePrice != null && comparePrice !== displayPrice && (
                <span className="text-base sm:text-lg text-zinc-400 font-normal line-through">
                  {formatPrice(comparePrice)}
                </span>
              )}
            </div>

            {comparePrice != null && comparePrice !== displayPrice && (
              <div className="flex items-center gap-2.5">
                {comparePrice > displayPrice ? (
                  <>
                    <span className="bg-[#DCFCE7] text-[#15803D] font-extrabold text-xs px-2.5 py-1 rounded-md tracking-wide">
                      {discountPercent}% OFF
                    </span>
                    <span className="text-[#16A34A] font-bold text-sm sm:text-base">
                      You Save {formatPrice(comparePrice - displayPrice)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="bg-[#FEE2E2] text-[#991B1B] font-extrabold text-xs px-2.5 py-1 rounded-md tracking-wide">
                      {Math.round(((displayPrice - comparePrice) / comparePrice) * 100)}% MARKUP
                    </span>
                    <span className="text-[#DC2626] font-bold text-sm sm:text-base">
                      You Pay Extra {formatPrice(displayPrice - comparePrice)}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Stock indicator */}
          {outOfStock ? (
            <Badge variant="danger" className="mt-3 w-fit">Out of Stock</Badge>
          ) : stock <= (product.lowStockThreshold ?? 5) ? (
            <Badge variant="accent" className="mt-3 w-fit">
              Only {stock} units left!
            </Badge>
          ) : (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              In Stock & Ready for Dispatch
            </div>
          )}

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
              <div className="flex items-center border border-border rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQty((q) => Math.max(minQty, q - 1))}
                  className="flex h-10 w-10 items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-12 items-center justify-center font-bold text-sm border-x border-border">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => Math.min(stock || 999, q + 1))}
                  className="flex h-10 w-10 items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {minQty > 1 && (
                <span className="text-xs text-muted-foreground">Min. order: {minQty} units</span>
              )}
            </div>
          </div>

          {/* Action Row: Add to Cart & Share */}
          <div className="mt-6 flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={outOfStock}
              icon={<ShoppingCart className="h-4 w-4" />}
              size="lg"
              fullWidth
              className="flex-1 font-bold"
            >
              {outOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Product link copied!");
              }}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors flex-shrink-0"
              aria-label="Share product"
            >
              <Share2 className="h-4 w-4 text-zinc-600" />
            </button>
          </div>

          {/* Chat with us button directly below Add to cart */}
          <button
            onClick={handleChatWithUs}
            type="button"
            className="w-full mt-3 flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white py-3 px-5 font-bold text-sm shadow-sm hover:shadow-md transition-all duration-200"
          >
            <WhatsAppIcon className="h-5 w-5 text-white" />
            <span>Chat with us on WhatsApp</span>
          </button>

          {/* ── Short Description placed below Add to Cart & WhatsApp button ── */}
          {product.shortDescription && (
            <div className="mt-5 p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Overview
              </span>
              <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                {product.shortDescription}
              </p>
            </div>
          )}

          {/* Value props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary shrink-0" />
              <span>Pan-India Safe Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              <span>GST Input Credit Ready</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary shrink-0" />
              <span>Direct Factory Pricing</span>
            </div>
          </div>

          {/* Meta */}
          {product.sku && (
            <p className="mt-4 text-xs text-muted-foreground font-mono">SKU: {product.sku}</p>
          )}
        </div>
      </div>

      {/* ── Full Width Section: Long / Detailed Description below top grid ── */}
      {product.description && (
        <section className="mt-16 pt-12 border-t border-border">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <FileText className="h-3.5 w-3.5" />
              Full Specifications
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mb-6">
              Product Description
            </h2>
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 sm:p-10 shadow-xs">
              <div
                className="text-sm sm:text-base text-zinc-700 leading-relaxed prose prose-zinc max-w-none
                           prose-headings:font-bold prose-headings:text-primary
                           prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-6 prose-h2:mb-3
                           prose-h3:text-lg prose-h3:font-semibold prose-h3:text-[#B5A57A]
                           prose-p:mb-4 prose-ul:list-disc prose-ul:pl-5 prose-li:mb-2
                           prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-zinc-50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Product Reviews */}
      <ProductReviews productId={product.id} />

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">You might also like</h2>
          </div>
          <ProductGrid products={related} />
        </section>
      )}

      {/* Product FAQ Section */}
      <FaqSection items={product.faqs} isProductPage={true} className="mt-20 md:mt-24 px-0 max-w-none border-t border-border pt-16" />
    </div>
  );
}
