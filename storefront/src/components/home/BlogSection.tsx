"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react";
import { useBlogs } from "@/src/hooks/useBlogs";
import { fadeUp, staggerContainer, staggerItem } from "@/src/lib/animations";
import { formatDate } from "@/src/lib/utils";

export default function BlogSection() {
  const { data: blogs, isLoading } = useBlogs();

  if (isLoading || !blogs || blogs.length === 0) return null;

  const featuredPosts = blogs.slice(0, 3);

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
        >
          <div>
            <span className="text-sm font-bold tracking-[0.2em] text-accent uppercase mb-3 block">
              The Journal
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-primary tracking-tight">
              Latest Insights & Stories
            </h2>
          </div>
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors"
          >
            Explore the Blog
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {featuredPosts.map((post) => (
            <motion.article 
              key={post.id} 
              variants={staggerItem} 
              className="bg-white rounded-3xl overflow-hidden border border-zinc-100/85 shadow-sm hover:shadow-[0_20px_50px_rgba(11,58,66,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
            >
              <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary/5 flex items-center justify-center text-primary font-bold">
                    Sri Kriscon Journal
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                {post.category && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-[#0B3A42] shadow-sm">
                      {post.category}
                    </span>
                  </div>
                )}
              </Link>

              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(post.createdAt)}
                  </div>
                  {post.readTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </div>
                  )}
                </div>

                <Link href={`/blog/${post.slug}`} className="block">
                  <h3 className="font-display text-[18px] font-bold text-[#0B3A42] leading-snug mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                </Link>

                <div className="mt-auto pt-5 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    By {post.author || "Sri Kriscon"}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#0B3A42] group-hover:text-accent group-hover:gap-2.5 transition-all duration-300"
                  >
                    Read Article
                    <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
