"use client";

import Link from "next/link";
import { Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function TopBanner() {
  return (
    <div className="bg-[#0B3A42] text-white h-10 px-4 relative z-[60] overflow-hidden flex items-center">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-center gap-3 sm:gap-6 text-center">
        
        {/* Left Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="hidden xs:block"
        >
          <Sun className="h-3.5 w-3.5 text-yellow-400" />
        </motion.div>

        {/* Text */}
        <p className="text-[11px] sm:text-xs font-bold tracking-wide uppercase">
          Get Extra 6% Off on Prepaid Orders
        </p>

        {/* Action */}
        <Link 
          href="/products"
          className="text-[11px] sm:text-xs font-black uppercase tracking-tighter border-b-2 border-white hover:text-accent hover:border-accent transition-all pb-0.5"
        >
          Shop Now
        </Link>

        {/* Right Icon */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="hidden xs:block"
        >
          <Sun className="h-3.5 w-3.5 text-yellow-400" />
        </motion.div>

      </div>

      {/* Subtle background glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
    </div>
  );
}
