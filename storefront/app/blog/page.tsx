"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react";
import { BLOG_POSTS } from "@/src/config/blogs";
import { fadeUp, staggerContainer, staggerItem } from "@/src/lib/animations";

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24">
      {/* ── Blog Hero ─────────────────────────────────────────────────── */}
      <section className="bg-primary pt-20 pb-24 text-center">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-accent text-xs font-black uppercase tracking-[0.3em] mb-6"
          >
            <span className="h-px w-8 bg-accent/30" />
            Our Journal
            <span className="h-px w-8 bg-accent/30" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-8"
          >
            Insights, Stories & <br />
            <span className="text-accent italic">Industry Trends</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Explore our collection of articles about industrial innovation, 
            sustainability, and the future of global supply chains.
          </motion.p>
        </div>
      </section>

      {/* ── Blog Grid ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {BLOG_POSTS.map((post) => (
            <motion.article 
              key={post.id} 
              variants={staggerItem} 
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group"
            >
              <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-primary">
                    {post.category}
                  </span>
                </div>
              </Link>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {post.readTime}</span>
                </div>

                <Link href={`/blog/${post.slug}`} className="group-hover:text-accent transition-colors">
                  <h3 className="text-xl font-bold text-primary leading-tight mb-4 line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                <p className="text-zinc-500 text-sm leading-relaxed mb-8 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-6 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    By {post.author}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
                  >
                    Read More
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
