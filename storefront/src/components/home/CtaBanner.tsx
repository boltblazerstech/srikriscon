import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { theme } from "@/src/config/theme";

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-highlight py-20 sm:py-28">
      {/* decorative premium gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-white/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="max-w-3xl mx-auto bg-white/30 backdrop-blur-md p-8 sm:p-12 rounded-[2.5rem] border border-white/40 shadow-2xl">
          <span className="text-sm font-extrabold tracking-widest text-primary uppercase mb-4 block">
            Exclusive Packaging Solutions
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-primary text-balance leading-tight drop-shadow-sm">
            Elevate Your Brand Today
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-primary/80 font-medium max-w-2xl mx-auto leading-relaxed">
            Discover {theme.business.name}&apos;s full range of premium quality products.
            Designed for excellence and durability.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-10 py-4 text-sm font-bold text-white hover:bg-primary-hover transition-all hover:scale-105 hover:shadow-xl w-full sm:w-auto"
            >
              Shop Collection <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary bg-transparent px-10 py-4 text-sm font-bold text-primary hover:bg-primary/10 transition-all w-full sm:w-auto"
            >
              View Categories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
