"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, Plus } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useCart } from "@/src/hooks/useCart";
import { cn, formatPrice, getPrimaryImage } from "@/src/lib/utils";
import type { Product } from "@/src/types";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  /** Renders a large portrait card for the asymmetric editorial grid */
  hero?: boolean;
}

export default function ProductCard({ product, hero = false }: Props) {
  const { add } = useCart();
  const imageUrl = getPrimaryImage(product.images);
  const isOnSale = product.comparePrice != null && product.comparePrice > product.price;
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = !isOutOfStock && product.stockQuantity <= product.lowStockThreshold;
  const salePercent = isOnSale
    ? Math.round((1 - product.price / product.comparePrice!) * 100)
    : 0;

  // 3-D tilt — only applied to hero cards
  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const xSpring = useSpring(xRaw, { stiffness: 150, damping: 20 });
  const ySpring = useSpring(yRaw, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [-3, 3]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!hero) return;
    const rect = e.currentTarget.getBoundingClientRect();
    xRaw.set((e.clientX - rect.left) / rect.width - 0.5);
    yRaw.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    xRaw.set(0);
    yRaw.set(0);
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants.length > 0) {
      toast("Select a variant on the product page", { icon: "👆" });
      return;
    }
    add({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      imageUrl: imageUrl ?? undefined,
      sku: product.sku,
      price: product.price,
      minOrderQty: product.minOrderQty,
    });
    toast.success("Added to cart");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full"
    >
      <motion.div
        style={hero ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -5, transition: { type: "spring", stiffness: 350, damping: 28 } }}
        className="h-full"
      >
        <Link
          href={`/products/${product.slug}`}
          className={cn(
            "group relative flex flex-col h-full overflow-hidden bg-white",
            "rounded-2xl border border-border/60",
            "shadow-[0_2px_16px_-4px_rgba(0,0,0,0.07)]",
            "hover:shadow-[0_20px_48px_-12px_rgba(11,58,66,0.18)]",
            "hover:border-primary/20",
            "transition-all duration-300"
          )}
        >
          {/* Bottom accent line — slides in from left on hover */}
          <span
            aria-hidden
            className="absolute bottom-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-primary via-accent to-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-30 pointer-events-none"
          />

          {/* ── Image ──────────────────────────────────────────────────── */}
          <div
            className={cn(
              "relative overflow-hidden bg-muted flex-shrink-0",
              hero ? "aspect-[3/4]" : "aspect-square"
            )}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                sizes={
                  hero
                    ? "(max-width: 1024px) 100vw, 50vw"
                    : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                }
              />
            ) : (
              <div className="h-full w-full flex flex-col items-center justify-center gap-2.5 bg-gradient-to-br from-muted to-muted/40">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary/30" />
                </div>
                <span className="text-[11px] text-muted-foreground/40 font-medium tracking-wide">
                  No image
                </span>
              </div>
            )}

            {/* Depth gradient at image bottom */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/35 via-black/10 to-transparent pointer-events-none z-10"
            />

            {/* Shine sweep */}
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-in-out pointer-events-none z-20"
            />

            {/* Badges — top left */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
              {isOnSale && (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide bg-accent text-white shadow-[0_2px_10px_rgba(230,0,126,0.55)]">
                  -{salePercent}%
                </span>
              )}
              {product.featured && !isOnSale && (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide bg-primary text-white">
                  Featured
                </span>
              )}
              {isOutOfStock && (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-black/55 backdrop-blur-sm text-white/85">
                  Sold out
                </span>
              )}
              {isLowStock && (
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-warning text-white">
                  Low stock
                </span>
              )}
            </div>

            {/* Quick-add — slides up from image bottom */}
            {!isOutOfStock && (
              <button
                onClick={handleAddToCart}
                className={cn(
                  "absolute inset-x-0 bottom-0 z-20",
                  "flex items-center justify-center gap-2",
                  "py-3 text-xs font-bold tracking-wide text-white",
                  "bg-primary/85 backdrop-blur-[2px]",
                  "translate-y-full group-hover:translate-y-0",
                  "transition-transform duration-300 ease-out",
                  "hover:bg-accent active:scale-[0.98]"
                )}
                aria-label="Add to cart"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                {product.variants.length > 0 ? "Select Options" : "Add to Cart"}
              </button>
            )}
          </div>

          {/* ── Info ───────────────────────────────────────────────────── */}
          <div className={cn("flex flex-col flex-1", hero ? "p-5" : "p-4")}>

            {/* Category */}
            {product.category && (
              <span className="text-[10px] font-extrabold tracking-[0.2em] text-accent/75 uppercase mb-1">
                {product.category.name}
              </span>
            )}

            {/* Name */}
            <h3
              className={cn(
                "font-semibold text-foreground/90 leading-snug line-clamp-2",
                hero ? "text-lg" : "text-sm"
              )}
            >
              {product.name}
            </h3>

            {/* Push price to bottom */}
            <div className="flex-1 min-h-[8px]" />

            {/* Price row */}
            <div className="flex items-center justify-between gap-2 mt-2">
              <div className="flex items-baseline gap-2">
                <span
                  className={cn(
                    "font-bold text-primary",
                    hero ? "text-2xl" : "text-base"
                  )}
                >
                  {formatPrice(product.startingPrice ?? product.price)}
                </span>
                {isOnSale && (
                  <span
                    className={cn(
                      "text-muted-foreground line-through",
                      hero ? "text-sm" : "text-xs"
                    )}
                  >
                    {formatPrice(product.comparePrice!)}
                  </span>
                )}
              </div>

              {/* Variant count */}
              {product.variants.length > 0 && (
                <span className="flex-shrink-0 text-[10px] text-muted-foreground/55 font-medium">
                  {product.variants.length} options
                </span>
              )}
            </div>

            {/* Min order note */}
            {product.minOrderQty > 1 && (
              <p className="mt-1 text-[10px] text-muted-foreground/50">
                Min. order: {product.minOrderQty} units
              </p>
            )}
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
