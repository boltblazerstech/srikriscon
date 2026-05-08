"use client";

import { useEffect, useRef } from "react";
import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";
import GrainOverlay from "@/src/components/ui/GrainOverlay";
import { fadeUp, staggerContainer, staggerItem } from "@/src/lib/animations";

const STATS = [
  { value: 500,  suffix: "+",  label: "Products Available" },
  { value: 10,   suffix: "K+", label: "Happy Customers" },
  { value: 99,   suffix: "%",  label: "Quality Assured" },
  { value: 24,   suffix: "/7", label: "Customer Support" },
];

const FEATURES = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Delivered to your doorstep within 3–7 business days nationwide.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine Products",
    description: "100% authentic products sourced directly from manufacturers.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free returns within 7 days of delivery.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our team is always here to help you via WhatsApp or email.",
  },
];

// ── Animated count-up stat ──────────────────────────────────────────────────
function StatCounter({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString("en-IN"));

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    return controls.stop;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <div ref={ref} className="text-center sm:text-left">
      <p className="font-display text-5xl sm:text-6xl font-bold text-white leading-none">
        <motion.span>{rounded}</motion.span>
        <span className="text-accent">{suffix}</span>
      </p>
      <p className="mt-2 text-xs text-white/45 font-semibold tracking-[0.15em] uppercase">
        {label}
      </p>
    </div>
  );
}

// ── Section ─────────────────────────────────────────────────────────────────
export default function WhyChooseUs() {
  return (
    <section className="relative bg-primary py-24 overflow-hidden">
      <GrainOverlay />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Headline ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <span className="text-[10px] font-extrabold tracking-[0.35em] text-accent uppercase block mb-4">
            The SRI KRISCON Difference
          </span>
          <h2 className="font-display italic text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-xl">
            Built on trust,<br />delivered with care.
          </h2>
        </motion.div>

        {/* ── Count-up stats ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pb-16 border-b border-white/10"
        >
          {STATS.map((s) => (
            <motion.div key={s.label} variants={staggerItem}>
              <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Glass feature cards ── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-14"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={staggerItem}
              className="group relative p-7 rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.11] hover:border-white/20 transition-all duration-300 overflow-hidden"
            >
              {/* Large decorative ordinal */}
              <span className="pointer-events-none absolute top-4 right-5 text-8xl font-black text-white/[0.045] leading-none select-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Icon */}
              <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-white/10 text-highlight mb-5 group-hover:bg-accent/20 group-hover:text-white transition-all duration-300 relative z-10">
                <f.icon className="h-5 w-5" strokeWidth={1.5} />
              </div>

              <h3 className="text-white font-bold text-lg mb-2 relative z-10">
                {f.title}
              </h3>
              <p className="text-white/45 text-sm leading-relaxed relative z-10">
                {f.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
