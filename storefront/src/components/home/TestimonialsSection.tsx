"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { useTestimonials } from "@/src/hooks/useTestimonials";
import { fadeUp } from "@/src/lib/animations";

const SLIDE_DELAY = 5000;

export default function TestimonialsSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ── Progress bar: reset on each slide change, fill over SLIDE_DELAY ────────
  const [tick, setTick] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const start = Date.now();
    const id = setInterval(() => {
      setProgress(Math.min((Date.now() - start) / SLIDE_DELAY, 1));
    }, 60);
    return () => clearInterval(id);
  }, [tick]);

  const { data: testimonials } = useTestimonials();
  if (!mounted || !testimonials || testimonials.length === 0) return null;

  return (
    <section className="bg-muted/30 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="text-center mb-14"
        >
          <span className="text-sm font-bold tracking-widest text-accent uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            What Our Partners Say
          </h2>
        </motion.div>

        {/* Swiper — no pagination dots */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: SLIDE_DELAY, disableOnInteraction: false }}
          onSlideChange={() => setTick((n) => n + 1)}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640:  { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id} className="h-auto">
              <div className="flex flex-col h-full p-8 rounded-3xl bg-white border border-border/40 shadow-[0_2px_24px_-4px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.13)] hover:-translate-y-1.5 transition-all duration-300">

                {/* Oversized opening pull-quote mark */}
                <span
                  aria-hidden
                  className="font-display text-7xl text-accent/50 leading-none -mb-2 block select-none"
                >
                  &ldquo;
                </span>

                {/* Quote — italic display serif */}
                <p className="font-display italic text-base text-foreground/75 leading-relaxed flex-1 mt-2">
                  {t.content}
                </p>

                {/* Stars */}
                <div className="flex gap-1 mt-5 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < t.rating
                          ? "text-warning fill-warning"
                          : "text-border fill-border"
                      )}
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-border/40">
                  {/* Gradient ring avatar */}
                  <div className="relative h-11 w-11 flex-shrink-0 rounded-full p-[2px] bg-gradient-to-br from-primary to-accent">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                      {t.imageUrl ? (
                        <Image
                          src={t.imageUrl}
                          alt={t.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                          {t.name[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-foreground">{t.name}</div>
                    {(t.designation || t.company) && (
                      <div className="text-xs text-muted-foreground">
                        {[t.designation, t.company].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thin progress bar — replaces pagination dots */}
        <div className="mt-8 flex justify-center">
          <div className="w-48 h-[2px] bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full"
              style={{
                width: `${progress * 100}%`,
                transition: progress === 0 ? "none" : "width 60ms linear",
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
