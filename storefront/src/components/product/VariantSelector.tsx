"use client";

import { cn } from "@/src/lib/utils";
import type { ProductVariant, VariantType } from "@/src/types";

interface VariantSelectorProps {
  variantsByType: Partial<Record<VariantType, ProductVariant[]>>;
  selected: Record<VariantType, number | undefined>;
  onSelect: (type: VariantType, variantId: number) => void;
}

const labels: Record<VariantType, string> = {
  SIZE: "Size",
  DESIGN: "Design",
  MATERIAL: "Material",
};

export default function VariantSelector({
  variantsByType,
  selected,
  onSelect,
}: VariantSelectorProps) {
  const types = Object.keys(variantsByType) as VariantType[];
  if (types.length === 0) return null;

  return (
    <div className="space-y-4">
      {types.map((type) => {
        const variants = variantsByType[type] ?? [];
        const activeId = selected[type];
        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold text-foreground">
                {labels[type]}
              </span>
              {activeId && (
                <span className="text-sm text-muted-foreground">
                  — {variants.find((v) => v.id === activeId)?.value}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => {
                const outOfStock = v.stockQuantity === 0;
                const isActive = v.id === activeId;
                return (
                  <button
                    key={v.id}
                    onClick={() => !outOfStock && onSelect(type, v.id)}
                    disabled={outOfStock}
                    title={outOfStock ? "Out of stock" : undefined}
                    className={cn(
                      "relative px-3 py-1.5 rounded-lg border text-sm font-medium transition-all",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-white text-foreground hover:border-primary/50",
                      outOfStock &&
                        "opacity-40 cursor-not-allowed line-through"
                    )}
                  >
                    {v.value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
