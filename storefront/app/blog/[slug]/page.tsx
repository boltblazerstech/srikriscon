"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Bookmark } from "lucide-react";
import { BLOG_POSTS } from "@/src/config/blogs";
import { fadeUp } from "@/src/lib/animations";

export default function BlogPostPage() {
  const params = useParams();
  const post = BLOG_POSTS.find((p) => p.slug === params.slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/blog" className="text-primary font-bold hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* ── Article Hero ─────────────────────────────────────────────── */}
      <header className="relative w-full h-[60vh] sm:h-[70vh] bg-zinc-900 overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover opacity-60 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end pb-16 sm:pb-24">
          <div className="mx-auto max-w-4xl px-4 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <Link href="/blog" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mr-4">
                <ArrowLeft className="h-4 w-4" />
                Journal
              </Link>
              <span className="bg-accent px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {post.category}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-8"
            >
              {post.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-6 text-white/60 text-xs font-bold uppercase tracking-widest"
            >
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                {post.readTime}
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-white text-[10px]">
                  {post.author[0]}
                </div>
                By {post.author}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ── Article Content ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 py-20 lg:py-28 relative">
        {/* Floating Actions Sidebar (Desktop) */}
        <aside className="hidden xl:block absolute left-[-120px] top-28 space-y-4 sticky top-40">
          <button className="h-12 w-12 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-accent hover:border-accent transition-all">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="h-12 w-12 rounded-full border border-zinc-100 flex items-center justify-center text-zinc-400 hover:text-accent hover:border-accent transition-all">
            <Bookmark className="h-5 w-5" />
          </button>
        </aside>

        <div className="prose prose-lg lg:prose-xl prose-zinc max-w-none">
          <p className="text-xl sm:text-2xl font-medium text-zinc-600 leading-relaxed italic mb-12 border-l-4 border-accent pl-8">
            {post.excerpt}
          </p>
          
          <div className="space-y-8 text-zinc-800 leading-loose">
            <p>
              In today&apos;s rapidly evolving industrial landscape, the fusion of sustainability and technological 
              innovation is no longer a choice but a necessity. Companies are discovering that what&apos;s good for 
              the planet is often better for the bottom line. This article explores the nuanced intersections 
              of these two powerful forces.
            </p>
            
            <h2 className="text-3xl font-black text-primary pt-8">The Future is Circular</h2>
            <p>
              The transition from a linear &quot;take-make-waste&quot; model to a circular economy is revolutionizing 
              manufacturing. By designing products for longevity, disassembly, and eventual recycling, 
              industrial leaders are minimizing waste and creating more resilient supply chains.
            </p>
            
            <blockquote className="bg-zinc-50 p-10 rounded-3xl border-none my-12">
              <p className="text-2xl font-bold text-primary mb-4">&quot;Sustainability is the ultimate innovation challenge of our generation.&quot;</p>
              <cite className="text-sm font-bold text-accent uppercase tracking-widest not-italic">&mdash; Lead Innovation Officer</cite>
            </blockquote>

            <p>
              As we look toward the 2030 sustainability goals, the role of data-driven logistics cannot be 
              overstated. Real-time tracking and AI-optimized routing are already reducing carbon footprints 
              by up to 25% for leading logistics firms across the country.
            </p>
          </div>
        </div>

        {/* Tags / Footer */}
        <footer className="mt-20 pt-12 border-t border-zinc-100">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Tagged:</span>
              {["Industry", "Future", "Eco"].map(tag => (
                <span key={tag} className="px-3 py-1 bg-zinc-50 rounded text-[10px] font-bold text-zinc-600">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors">
                <Share2 className="h-4 w-4" /> Share
              </button>
              <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors">
                <Bookmark className="h-4 w-4" /> Save
              </button>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
