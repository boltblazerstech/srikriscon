"use client";

import { motion } from "framer-motion";
import { 
  Package, 
  Layers, 
  ShieldCheck, 
  Gift, 
  Palette,
  Award,
  PenTool,
  Factory,
  Clock,
  Users,
  Handshake
} from "lucide-react";
import { cn } from "@/src/lib/utils";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="bg-zinc-950 text-white py-24 sm:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-zinc-900 to-zinc-950" />
        <div className="mx-auto max-w-4xl relative z-10 text-center">
          <motion.h1 
            initial="hidden" animate="visible" variants={FADE_UP}
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-6"
          >
            About SRI KRISCON INDUSTRIES
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={FADE_UP} transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-zinc-300 leading-relaxed max-w-3xl mx-auto"
          >
            Packaging that captivates, differentiates, and leaves a lasting impression.
          </motion.p>
        </div>
      </section>

      {/* Main Story */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
          className="bg-white rounded-2xl shadow-sm border border-border p-8 sm:p-12 space-y-6 text-base sm:text-lg text-slate-700 leading-relaxed"
        >
          <p>
            At <strong className="text-zinc-900">SRI KRISCON INDUSTRIES</strong>, we take pride in being a trusted name in the packaging industry, specializing in the manufacturing of high-quality Rigid Boxes, Mono Cartons, and Corrugated Cartons. With a strong commitment to excellence, innovation, and customer satisfaction, we deliver packaging solutions that not only protect products but also enhance their market appeal. We combine visual appeal with structural strength to create packaging that enhances the charm and value of confectionery products.
          </p>
          <p>
            Driven by precision and backed by modern manufacturing techniques, we cater to a wide range of industries including FMCG, pharmaceuticals, electronics, food & beverages, and more. Our team focuses on understanding the unique requirements of each client and providing customized packaging solutions that align perfectly with their brand identity.
          </p>
          <p>
            Quality is at the core of everything we do. From selecting premium raw materials to ensuring strict quality control at every stage of production, we maintain the highest standards to deliver durable, reliable, and aesthetically appealing packaging.
          </p>
          <p className="font-medium text-zinc-900 text-xl border-l-4 border-primary pl-6 py-2 my-8 italic">
            "We believe packaging is a statement of prestige. Our mission is to empower brands with packaging that captivates, differentiates, and leaves a lasting impression in a competitive marketplace."
          </p>
        </motion.div>
      </section>

      {/* Two Column Grid: Expertise & Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Expertise */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP}
          className="bg-white rounded-2xl shadow-sm border border-border p-8 sm:p-10 h-full"
        >
          <h2 className="text-3xl font-bold text-zinc-900 mb-8">Our Expertise</h2>
          <ul className="space-y-6">
            <FeatureItem icon={Package} title="Luxury Rigid Boxes" desc="For premium product presentation" />
            <FeatureItem icon={Layers} title="Premium Mono Cartons" desc="With high-end printing finishes" />
            <FeatureItem icon={ShieldCheck} title="Corrugated Cartons" desc="Durable and highly efficient" />
            <FeatureItem icon={Gift} title="Sweet Shop Packaging" desc="Specialized confectionery solutions" />
            <FeatureItem icon={Palette} title="Customized Designs" desc="Fully aligned with your brand identity" />
          </ul>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={FADE_UP} transition={{ delay: 0.1 }}
          className="bg-zinc-950 text-white rounded-2xl shadow-xl p-8 sm:p-10 h-full flex flex-col"
        >
          <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
          <ul className="space-y-6 mb-8 flex-1">
            <FeatureItem dark icon={Award} title="High-Quality" desc="Mono & Corrugated Cartons" />
            <FeatureItem dark icon={PenTool} title="Custom Design" desc="And precise printing solutions" />
            <FeatureItem dark icon={Factory} title="Advanced Manufacturing" desc="State-of-the-art setup" />
            <FeatureItem dark icon={Clock} title="Timely Delivery" desc="With competitive pricing" />
            <FeatureItem dark icon={Users} title="Customer-Centric" desc="Your needs always come first" />
          </ul>
          <div className="pt-6 border-t border-zinc-800">
            <p className="flex items-start gap-4 text-zinc-300">
              <Handshake className="h-8 w-8 text-white flex-shrink-0 mt-1" />
              <span className="leading-relaxed">We are committed to building long-term relationships with our clients by consistently delivering value, quality, and reliability.</span>
            </p>
          </div>
        </motion.div>

      </section>
    </div>
  );
}

function FeatureItem({ icon: Icon, title, desc, dark = false }: any) {
  return (
    <li className="flex items-start gap-4">
      <div className={cn(
        "flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0",
        dark ? "bg-zinc-800 text-white" : "bg-primary/10 text-primary"
      )}>
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <div>
        <h3 className={cn("font-bold text-lg", dark ? "text-white" : "text-zinc-900")}>{title}</h3>
        <p className={cn("text-sm", dark ? "text-zinc-400" : "text-slate-600")}>{desc}</p>
      </div>
    </li>
  );
}
