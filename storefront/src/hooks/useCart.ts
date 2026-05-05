"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CartItem, VariantType } from "@/src/types";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AddToCartPayload {
  productId: number;
  variantId?: number;
  productName: string;
  productSlug: string;
  imageUrl?: string;
  sku?: string;
  variantType?: VariantType;
  variantValue?: string;
  price: number;
  minOrderQty?: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (payload: AddToCartPayload, qty?: number) => void;
  remove: (productId: number, variantId?: number) => void;
  updateQty: (productId: number, qty: number, variantId?: number) => void;
  clear: () => void;
  hydrated: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextValue | null>(null);
CartContext.displayName = "CartContext";

const STORAGE_KEY = "sf_cart";

function itemKey(productId: number, variantId?: number) {
  return `${productId}-${variantId ?? "base"}`;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      /* ignore parse errors */
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage whenever cart changes (after hydration)
  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((payload: AddToCartPayload, qty = 1) => {
    const min = payload.minOrderQty ?? 1;
    const addQty = Math.max(qty, min);
    setItems((prev) => {
      const key = itemKey(payload.productId, payload.variantId);
      const existing = prev.find((i) => itemKey(i.productId, i.variantId) === key);
      if (existing) {
        return prev.map((i) =>
          itemKey(i.productId, i.variantId) === key
            ? { ...i, quantity: i.quantity + addQty }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: payload.productId,
          variantId: payload.variantId,
          productName: payload.productName,
          productSlug: payload.productSlug,
          imageUrl: payload.imageUrl,
          sku: payload.sku,
          variantType: payload.variantType,
          variantValue: payload.variantValue,
          price: payload.price,
          quantity: addQty,
          minOrderQty: min,
        },
      ];
    });
  }, []);

  const remove = useCallback((productId: number, variantId?: number) => {
    const key = itemKey(productId, variantId);
    setItems((prev) => prev.filter((i) => itemKey(i.productId, i.variantId) !== key));
  }, []);

  const updateQty = useCallback(
    (productId: number, qty: number, variantId?: number) => {
      const key = itemKey(productId, variantId);
      setItems((prev) => {
        const item = prev.find((i) => itemKey(i.productId, i.variantId) === key);
        if (!item) return prev;
        const newQty = Math.max(qty, item.minOrderQty);
        if (newQty <= 0)
          return prev.filter((i) => itemKey(i.productId, i.variantId) !== key);
        return prev.map((i) =>
          itemKey(i.productId, i.variantId) === key ? { ...i, quantity: newQty } : i
        );
      });
    },
    []
  );

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  // Use React.createElement to avoid JSX in a .ts file
  return React.createElement(
    CartContext.Provider,
    { value: { items, count, subtotal, add, remove, updateQty, clear, hydrated } },
    children
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
