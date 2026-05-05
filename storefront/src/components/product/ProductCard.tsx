"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/src/hooks/useCart";
import { cn, formatPrice, getPrimaryImage } from "@/src/lib/utils";
import Badge from "@/src/components/ui/Badge";
import type { Product } from "@/src/types";
import toast from "react-hot-toast";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const imageUrl = getPrimaryImage(product.images);
  const isOnSale =
    product.comparePrice != null && product.comparePrice > product.price;

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
    <div className="hover:-translate-y-1 transition-transform duration-200">
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex flex-col rounded-xl overflow-hidden border border-border bg-white shadow-sm hover:shadow-md transition-shadow"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground/30 text-4xl">
              📦
            </div>
          )}
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isOnSale && <Badge variant="accent">Sale</Badge>}
            {product.featured && <Badge variant="primary">Featured</Badge>}
            {product.stockQuantity === 0 && (
              <Badge variant="muted">Out of stock</Badge>
            )}
          </div>
          {/* Quick add */}
          <button
            onClick={handleAddToCart}
            className={cn(
              "absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md text-foreground",
              "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
            )}
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-3">
          {product.category && (
            <span className="text-xs text-muted-foreground mb-0.5">
              {product.category.name}
            </span>
          )}
          <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base font-bold text-foreground">
              {formatPrice(product.startingPrice ?? product.price)}
            </span>
            {isOnSale && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.comparePrice!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
