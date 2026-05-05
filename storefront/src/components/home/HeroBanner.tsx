"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Spinner from "@/src/components/ui/Spinner";
import { useBanners } from "@/src/hooks/useBanners";
import { theme } from "@/src/config/theme";

const FALLBACK = [
  {
    id: 0,
    title: theme.business.name,
    subtitle: theme.business.tagline,
    imageUrl: "",
    linkUrl: "/products",
  },
];

export default function HeroBanner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: banners, isLoading } = useBanners();
  const slides = banners && banners.length > 0 ? banners : FALLBACK;

  if (!mounted) {
    return (
      <section className="relative w-full overflow-hidden bg-muted">
        <div className="h-[55vh] sm:h-[65vh] lg:h-[75vh] animate-pulse bg-muted" />
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-highlight/20">
      {isLoading ? (
        <div className="flex items-center justify-center h-[70vh] sm:h-[80vh]">
          <Spinner size="lg" />
        </div>
      ) : (
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true, dynamicBullets: true }}
          navigation
          loop={slides.length > 1}
          className="w-full h-[70vh] sm:h-[80vh] lg:h-[85vh] group"
        >
          {slides.map((banner, i) => (
            <SwiperSlide key={banner.id}>
              <div className="relative h-full w-full bg-primary overflow-hidden">
                {banner.imageUrl ? (
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    className="object-cover transition-transform duration-[10000ms] ease-linear hover:scale-105"
                    priority={i === 0}
                    sizes="100vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-hover to-[#082328]" />
                )}
                {/* Premium sophisticated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/50 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                      className="max-w-2xl"
                    >
                      <span className="inline-block mb-4 text-xs font-bold tracking-widest text-highlight uppercase bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/20">
                        SRI KRISCON EXCLUSIVE
                      </span>
                      <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight text-balance drop-shadow-sm">
                        {banner.title}
                      </h1>
                      {"subtitle" in banner && banner.subtitle && (
                        <p className="mt-6 text-lg sm:text-xl text-white/90 font-light max-w-xl leading-relaxed drop-shadow-sm">
                          {banner.subtitle}
                        </p>
                      )}
                      {banner.linkUrl && (
                        <div className="mt-10 flex flex-wrap gap-4">
                          <Link
                            href={banner.linkUrl}
                            className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-sm font-bold text-white hover:bg-[#C2006A] transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(230,0,126,0.4)]"
                          >
                            Shop Collection
                          </Link>
                          <Link
                            href="/categories"
                            className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/30 px-8 py-4 text-sm font-bold text-white hover:bg-white/20 transition-all"
                          >
                            Explore Categories
                          </Link>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}
