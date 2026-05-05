"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { ProductImage } from "@/src/types";

export default function ImageGallery({ images }: { images: ProductImage[] }) {
  const sorted = [...images].sort((a, b) =>
    a.primary === b.primary ? a.sortOrder - b.sortOrder : a.primary ? -1 : 1
  );
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const current = sorted[active];

  if (sorted.length === 0) {
    return (
      <div className="aspect-square rounded-xl bg-muted flex items-center justify-center text-muted-foreground/30 text-6xl">
        📦
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-3">
        {/* Thumbnail strip — vertical on desktop */}
        {sorted.length > 1 && (
          <div className="hidden sm:flex flex-col gap-2 w-16 flex-shrink-0">
            {sorted.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActive(i)}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                  i === active ? "border-primary" : "border-transparent hover:border-border"
                )}
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? `View ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div className="flex-1 relative aspect-square rounded-xl overflow-hidden bg-muted group cursor-zoom-in">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full"
              onClick={() => setLightbox(true)}
            >
              <Image
                src={current.url}
                alt={current.altText ?? "Product image"}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="h-4 w-4 text-foreground" />
          </div>
        </div>
      </div>

      {/* Mobile thumbnail strip */}
      {sorted.length > 1 && (
        <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-14 w-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors",
                i === active ? "border-primary" : "border-transparent hover:border-border"
              )}
            >
              <Image
                src={img.url}
                alt={img.altText ?? `View ${i + 1}`}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(false)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={() => setLightbox(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl w-full aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current.url}
                alt={current.altText ?? "Product image"}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
