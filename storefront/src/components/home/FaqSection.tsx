"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/src/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

const defaultFaqs: FaqItem[] = [
  {
    question: "What types of packaging boxes do you manufacture?",
    answer: "We manufacture a wide range of premium packaging solutions, including heavy-duty corrugated boxes, corrugated rolls, customized luxury boxes, retail cartons, and custom shipping boxes suited for industrial and retail needs."
  },
  {
    question: "Do you provide customized branding and sizing?",
    answer: "Yes! We specialize in custom-sized packaging, brand logo printing, custom color selection, and specialty finishes. You can choose structural designs and materials tailored specifically to your product requirements."
  },
  {
    question: "What is the minimum order quantity (MOQ)?",
    answer: "Minimum order quantities vary depending on the product type and level of customization. Generally, custom corrugated boxes have a low MOQ to help businesses scale. Contact our sales team for a precise quote."
  },
  {
    question: "Do you ship across India?",
    answer: "Yes, we ship nationwide from our industrial facility in Dewas, Madhya Pradesh. We partner with reliable logistics networks to ensure secure packaging delivery to all major commercial hubs and industrial areas."
  },
  {
    question: "Can I request a sample before placing a bulk order?",
    answer: "Absolutely. We offer sample boxes so you can verify the board thickness, dimensions, and printing quality before proceeding with full-scale production."
  }
];

export default function FaqSection({ items, className }: { items?: FaqItem[]; className?: string }) {
  const allFaqs = items && items.length > 0 ? [...items, ...defaultFaqs] : defaultFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Default open the first one like the reference image

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <section className={cn("mx-auto max-w-[83rem] px-4 sm:px-6 lg:px-8 my-16 md:my-24", className)}>
      <div className="text-center mb-10">
        <span className="text-[#E6007E] text-xs font-extrabold tracking-[0.25em] uppercase block mb-2">
          GOT QUESTIONS?
        </span>
        <h2 className="text-[#0B3A42] font-display font-black text-3xl md:text-4xl tracking-tight mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-zinc-500 text-sm max-w-lg mx-auto leading-relaxed">
          Find answers to common questions about our products, customization options, and ordering process.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {allFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={cn(
                "rounded-[20px] overflow-hidden transition-all duration-300 bg-white",
                isOpen 
                  ? "border-2 border-[#0B3A42] shadow-md" 
                  : "border border-zinc-200 shadow-sm bg-zinc-50/50"
              )}
            >
              <button
                onClick={() => toggle(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-foreground focus:outline-none group"
              >
                <span className={cn(
                  "text-sm sm:text-base pr-4 transition-colors",
                  isOpen ? "text-[#0B3A42] font-bold" : "text-zinc-800 group-hover:text-primary"
                )}>
                  {faq.question}
                </span>
                
                <span className="flex-shrink-0">
                  {isOpen ? (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B3A42] text-white transition-all duration-300">
                      <ChevronUp className="h-4 w-4" />
                    </span>
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5] text-zinc-400 group-hover:bg-zinc-200 group-hover:text-zinc-600 transition-all duration-300">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  )}
                </span>
              </button>

              <div
                className={cn(
                  "transition-all duration-300 ease-in-out overflow-hidden",
                  isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="px-6 pb-6 pt-2 text-sm text-zinc-500 leading-relaxed border-t border-zinc-100">
                  <div className="pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
