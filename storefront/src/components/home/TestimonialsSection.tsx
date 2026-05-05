"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Star } from "lucide-react";
import { useTestimonials } from "@/src/hooks/useTestimonials";

export default function TestimonialsSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: testimonials } = useTestimonials();
  if (!mounted || !testimonials || testimonials.length === 0) return null;

  return (
    <section className="bg-background py-20 border-y border-border/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-sm font-bold tracking-widest text-accent uppercase mb-3 block">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            What Our Partners Say
          </h2>
        </div>
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="flex flex-col h-full p-8 rounded-3xl bg-white border border-border/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < t.rating
                          ? "text-warning fill-warning"
                          : "text-border fill-border"
                      }`}
                    />
                  ))}
                </div>
                {/* Content */}
                <p className="text-sm text-foreground leading-relaxed flex-1 mb-4">
                  &ldquo;{t.content}&rdquo;
                </p>
                {/* Author */}
                <div className="flex items-center gap-3">
                  {t.imageUrl ? (
                    <Image
                      src={t.imageUrl}
                      alt={t.name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {t.name[0]}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
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
      </div>
    </section>
  );
}
