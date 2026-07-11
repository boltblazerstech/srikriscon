"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Spinner from "@/src/components/ui/Spinner";
import { useBanners } from "@/src/hooks/useBanners";
import { theme } from "@/src/config/theme";
import { useSetting } from "@/src/hooks/useSettings";

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

  const sectionRef = useRef<HTMLElement>(null);
  const { value: storeName } = useSetting("storeName");
  const { value: storeTagline } = useSetting("storeTagline");
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Image drifts down 80px as the hero scrolls out → appears to move slower than the page
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const fallbackBanners = [
    {
      id: 0,
      title: storeName || theme.business.name,
      subtitle: storeTagline || theme.business.tagline,
      imageUrl: "",
      linkUrl: "/products",
    },
  ];

  const { data: banners, isLoading } = useBanners();
  const slides = banners && banners.length > 0 ? banners : fallbackBanners;

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-primary">
      {!mounted ? (
        <div className="h-[60vh] sm:h-[70vh] lg:h-[80vh] animate-pulse bg-primary/60" />
      ) : isLoading ? (
        <div className="flex items-center justify-center h-[70vh] sm:h-[80vh]">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation
            loop={slides.length > 1}
            className="w-full h-[75vh] min-h-[480px] sm:h-[82vh] sm:min-h-[580px] lg:h-[88vh] group"
          >
            {slides.map((banner, i) => (
              <SwiperSlide key={banner.id}>
                <div className="relative h-full w-full bg-primary overflow-hidden">
                  {banner.imageUrl ? (
                    /* Extra-tall container gives parallax room without clipping */
                    <motion.div
                      className="absolute -top-[12%] -bottom-[12%] left-0 right-0"
                      style={{ y: imageY }}
                    >
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        className="object-cover"
                        priority={i === 0}
                        sizes="100vw"
                      />
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0d4550] to-[#061c20]" />
                  )}

                  {/* Layered cinematic overlays */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto max-w-7xl px-6 lg:px-12 w-full">
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="max-w-2xl"
                      >
                        {/* Decorative line + badge */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5, duration: 0.7 }}
                          className="flex items-center gap-3 mb-4 sm:mb-6"
                        >
                          <div className="h-px w-8 bg-accent" />
                          <span className="inline-flex items-center gap-2 text-[10px] font-extrabold tracking-[0.25em] text-white/70 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            New Collection
                          </span>
                        </motion.div>

                        {/* Headline — display serif */}
                        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.0] tracking-tight text-balance drop-shadow-lg">
                          {banner.title}
                        </h1>

                        {"subtitle" in banner && banner.subtitle && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-white/65 font-light max-w-lg leading-relaxed tracking-wide"
                          >
                            {banner.subtitle}
                          </motion.p>
                        )}

                        {/* CTAs */}
                        {banner.linkUrl && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.85, duration: 0.7 }}
                            className="mt-6 sm:mt-8 md:mt-10 flex flex-wrap gap-3 sm:gap-4"
                          >
                            <Link
                              href={banner.linkUrl}
                              className="inline-flex items-center gap-2 justify-center rounded-full bg-accent px-6 py-3 text-xs sm:px-8 sm:py-4 sm:text-sm font-bold text-white hover:bg-[#C2006A] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_28px_rgba(230,0,126,0.45)] group/btn"
                            >
                              Shop Collection
                              <ArrowRight
                                size={15}
                                className="transition-transform duration-300 group-hover/btn:translate-x-1"
                              />
                            </Link>
                            <Link
                              href="/categories"
                              className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-xs sm:px-8 sm:py-4 sm:text-sm font-bold text-white hover:bg-white/10 hover:border-white/60 transition-all duration-300 backdrop-blur-sm"
                            >
                              Explore Categories
                            </Link>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 right-8 sm:right-12 z-20 hidden sm:flex flex-col items-center gap-2 pointer-events-none"
          >
            <div className="relative h-10 w-px bg-white/20 overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full bg-white/60 rounded-full"
                style={{ height: "45%" }}
                animate={{ y: ["-100%", "220%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "linear", repeatDelay: 0.4 }}
              />
            </div>
            <span className="text-[9px] font-bold tracking-[0.3em] text-white/35 uppercase">
              Scroll
            </span>
          </motion.div>
        </>
      )}
    </section>
  );
}
