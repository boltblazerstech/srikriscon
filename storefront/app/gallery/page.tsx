"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGallery } from "@/src/hooks/useGallery";
import Spinner from "@/src/components/ui/Spinner";
import EmptyState from "@/src/components/ui/EmptyState";
import type { GalleryImage } from "@/src/types";

export default function GalleryPage() {
  const { data, isLoading } = useGallery(0, 100);
  const images = data?.content ?? [];
  const [active, setActive] = useState<GalleryImage | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-2">Gallery</h1>
      <p className="text-muted-foreground mb-8">A showcase of our products and work.</p>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : images.length === 0 ? (
        <EmptyState title="No images yet" />
      ) : (
        /* Masonry via CSS columns */
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {images.map((img, i) => (
            <motion.button
              key={img.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5) }}
              onClick={() => setActive(img)}
              className="group relative w-full overflow-hidden rounded-xl bg-muted break-inside-avoid mb-3 block"
            >
              <Image
                src={img.url}
                alt={img.altText ?? img.title ?? "Gallery image"}
                width={600}
                height={400}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {(img.title || img.altText) && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                  <p className="text-white text-xs font-medium p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    {img.title ?? img.altText}
                  </p>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20"
              onClick={() => setActive(null)}
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full max-h-[85vh] relative"
            >
              <Image
                src={active.url}
                alt={active.altText ?? "Gallery"}
                width={1200}
                height={900}
                className="w-full h-full object-contain rounded-xl"
              />
              {active.title && (
                <p className="text-center text-white/80 text-sm mt-3">{active.title}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
