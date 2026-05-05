"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, MapPin, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/src/hooks/useCart";
import { useCheckServiceability } from "@/src/hooks/useOrders";
import Button from "@/src/components/ui/Button";
import Spinner from "@/src/components/ui/Spinner";
import EmptyState from "@/src/components/ui/EmptyState";
import { formatPrice } from "@/src/lib/utils";

export default function CartPage() {
  const { items, count, subtotal, remove, updateQty, hydrated } = useCart();
  const [pincode, setPincode] = useState("");
  const [checkedPin, setCheckedPin] = useState("");

  const { data: serviceability, isLoading: pinLoading, error: pinError } =
    useCheckServiceability(checkedPin);

  if (!hydrated) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some products to get started."
          action={{ label: "Browse Products", onClick: () => (window.location.href = "/products") }}
        />
      </div>
    );
  }

  const shipping = subtotal >= 999 ? 0 : 79;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Cart <span className="text-muted-foreground font-normal text-lg">({count} items)</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={`${item.productId}-${item.variantId ?? "base"}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex gap-4 p-4 rounded-xl border border-border bg-white">
                  {/* Image */}
                  <Link
                    href={`/products/${item.productSlug}`}
                    className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted"
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.productName}
                    </Link>
                    {item.variantValue && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.variantType}: {item.variantValue}
                      </p>
                    )}
                    <p className="text-sm font-bold text-foreground mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => remove(item.productId, item.variantId)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() =>
                          updateQty(
                            item.productId,
                            item.quantity - 1,
                            item.variantId
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex h-7 w-8 items-center justify-center text-xs font-medium border-x border-border">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQty(
                            item.productId,
                            item.quantity + 1,
                            item.variantId
                          )
                        }
                        className="flex h-7 w-7 items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Pincode checker */}
          <div className="p-4 rounded-xl border border-border bg-white">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Check Delivery
            </h3>
            <div className="flex gap-2">
              <input
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/, "").slice(0, 6))}
                placeholder="Enter pincode"
                className="flex-1 h-9 px-3 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                size="sm"
                variant="outline"
                loading={pinLoading}
                onClick={() => setCheckedPin(pincode)}
                disabled={pincode.length !== 6}
              >
                Check
              </Button>
            </div>
            {serviceability && (
              <div className={`mt-3 flex items-center gap-2 text-sm ${
                serviceability.available ? "text-success" : "text-destructive"
              }`}>
                {serviceability.available ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {serviceability.available
                  ? `Delivery available via ${serviceability.availableCouriers.slice(0, 2).join(", ")}`
                  : "Delivery not available for this pincode"}
              </div>
            )}
            {pinError && (
              <p className="mt-2 text-xs text-destructive">Could not check serviceability.</p>
            )}
          </div>

          {/* Order summary */}
          <div className="p-4 rounded-xl border border-border bg-white">
            <h3 className="font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({count} items)</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping === 0 ? "text-success" : ""}>
                  {shipping === 0 ? "FREE" : formatPrice(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Free shipping on orders above ₹999
                </p>
              )}
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button fullWidth size="lg" className="mt-4">
                Proceed to Checkout
              </Button>
            </Link>
            <Link
              href="/products"
              className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
