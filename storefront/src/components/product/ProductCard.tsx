"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, ShoppingCart } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/src/hooks/useCart";
import { cn, formatPrice, getPrimaryImage } from "@/src/lib/utils";
import type { Product } from "@/src/types";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  hero?: boolean;
}

export default function ProductCard({ product, hero = false }: Props) {
  const { add } = useCart();
  const imageUrl = getPrimaryImage(product.images);
  const isOnSale     = product.comparePrice != null && product.comparePrice > product.price;
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock   = !isOutOfStock && product.stockQuantity <= product.lowStockThreshold;
  const salePercent  = isOnSale
    ? Math.round((1 - product.price / product.comparePrice!) * 100)
    : 0;

  const variantPills = product.variants.slice(0, 4);
  const [selIdx, setSelIdx] = useState<number | null>(variantPills.length > 0 ? 0 : null);

  // 3-D tilt (hero only)
  const xRaw = useMotionValue(0);
  const yRaw = useMotionValue(0);
  const xS   = useSpring(xRaw, { stiffness: 150, damping: 20 });
  const yS   = useSpring(yRaw, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(yS, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(xS, [-0.5, 0.5], [-3, 3]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!hero) return;
    const r = e.currentTarget.getBoundingClientRect();
    xRaw.set((e.clientX - r.left) / r.width - 0.5);
    yRaw.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onMouseLeave() { xRaw.set(0); yRaw.set(0); }

  function addToCart(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation();
    if (product.variants.length > 0 && selIdx === null) {
      toast("Select a variant on the product page", { icon: "👆" }); return;
    }
    const v = selIdx !== null ? product.variants[selIdx] : null;
    add({
      productId:   product.id,
      productName: product.name,
      productSlug: product.slug,
      imageUrl:    imageUrl ?? undefined,
      sku:         v?.sku   ?? product.sku,
      price:       v?.price ?? product.price,
      minOrderQty: product.minOrderQty,
      variantId:   v?.id,
      variantValue: v?.value,
    });
    toast.success("Added to cart!");
  }

  const currentPrice =
    selIdx !== null && product.variants[selIdx]?.price
      ? product.variants[selIdx].price
      : (product.startingPrice ?? product.price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        style={hero ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        whileHover={{ y: -5, transition: { type: "spring", stiffness: 320, damping: 28 } }}
      >
        <div className={cn(
          "group flex flex-col bg-white overflow-hidden transition-all duration-300",
          "rounded-2xl shadow-[0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_-12px_rgba(11,58,66,0.15)]"
        )}>

          {/* ── Arch image — full-width, no side gaps ───────────────────── */}
          <Link href={`/products/${product.slug}`} className="block relative flex-shrink-0">
            {/* Gold ring wrapper */}
            <div className="relative p-[2px]"
              style={{ borderRadius: "50% 50% 0 0 / 20% 20% 0 0" }}
            >
              {/* Gold border ring */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  borderRadius: "50% 50% 0 0 / 20% 20% 0 0",
                  border: "2px solid #C9A84C",
                }}
              />

              {/* Image dome */}
              <div
                className={cn(
                  "relative overflow-hidden bg-[#f7f0e8]",
                  hero ? "h-72" : "h-56 sm:h-72"
                )}
                style={{ borderRadius: "50% 50% 0 0 / 20% 20% 0 0" }}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    sizes={hero ? "50vw" : "(max-width:640px) 50vw, 25vw"}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Package className="h-10 w-10 text-zinc-200" />
                  </div>
                )}

                {/* Shine sweep */}
                <span aria-hidden className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 pointer-events-none" />

                {/* Sale Badge — Clear Circle */}
                {isOnSale && (
                  <div className="absolute top-4 left-4 z-30 bg-accent text-white w-12 h-12 flex flex-col items-center justify-center rounded-full shadow-[0_4px_12px_rgba(230,0,126,0.4)] border-2 border-white">
                    <span className="text-[12px] font-black leading-none">
                      {salePercent}%
                    </span>
                    <span className="text-[8px] font-bold uppercase tracking-tighter">
                      OFF
                    </span>
                  </div>
                )}

                {/* Stock badge */}
                {(isOutOfStock || isLowStock) && (
                  <span className={cn(
                    "absolute top-4 right-4 z-20 text-[10px] font-bold rounded-full px-2 py-0.5",
                    isOutOfStock ? "bg-black/55 text-white" : "bg-warning text-white"
                  )}>
                    {isOutOfStock ? "Sold out" : "Low stock"}
                  </span>
                )}
              </div>
            </div>
          </Link>

          {/* ── Info — centered, tight ──────────────────────────────────── */}
          <div className="flex flex-col items-center text-center px-3 pt-3 pb-3 gap-1.5">

            {/* Name */}
            <Link href={`/products/${product.slug}`} className="w-full">
              <h3 className={cn(
                "font-bold text-zinc-800 leading-tight line-clamp-2 hover:text-primary transition-colors",
                hero ? "text-base" : "text-sm"
              )}>
                {product.name}
              </h3>
            </Link>

            {/* Price */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className={cn("font-extrabold text-zinc-800", hero ? "text-xl" : "text-sm")}>
                ₹{currentPrice.toFixed ? currentPrice.toFixed(0) : currentPrice}
              </span>
              {isOnSale && (
                <span className="text-xs text-zinc-400 line-through">
                  ₹{product.comparePrice!.toFixed ? product.comparePrice!.toFixed(0) : product.comparePrice}
                </span>
              )}
            </div>

            {/* Variant pills */}
            {variantPills.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5">
                {variantPills.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={(e) => { e.preventDefault(); setSelIdx(idx); }}
                    className={cn(
                      "px-3 py-1 rounded-full text-[11px] font-bold border transition-all",
                      selIdx === idx
                        ? "bg-[#6B5C2E] text-white border-[#6B5C2E]"
                        : "bg-white text-zinc-600 border-zinc-300 hover:border-[#6B5C2E] hover:text-[#6B5C2E]"
                    )}
                  >
                    {v.value}
                  </button>
                ))}
                {product.variants.length > 4 && (
                  <span className="px-2 py-1 text-[10px] text-zinc-400 self-center">+{product.variants.length - 4}</span>
                )}
              </div>
            )}

            {product.minOrderQty > 1 && (
              <p className="text-[10px] text-zinc-400">Min. {product.minOrderQty} units</p>
            )}

            {/* Add to Cart */}
            <button
              onClick={addToCart}
              disabled={isOutOfStock}
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-full py-2.5 mt-0.5",
                "text-[11px] font-extrabold tracking-widest uppercase transition-all duration-200",
                isOutOfStock
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  : "bg-[#6B5C2E] text-white hover:bg-primary active:scale-[0.98] shadow-md hover:shadow-lg"
              )}
            >
              {!isOutOfStock && <ShoppingCart className="h-3.5 w-3.5" strokeWidth={2.5} />}
              {isOutOfStock ? "Out of Stock" : "Add To Cart"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
