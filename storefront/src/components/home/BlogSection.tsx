"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
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
            <motion.article key={post.id} variants={staggerItem} className="group flex flex-col h-full">
              <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-100 mb-6">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary/5 flex items-center justify-center text-primary font-bold">
                    Sri Kriscon Journal
                  </div>
                )}
                {post.category && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">
                      {post.category}
                    </span>
                  </div>
                )}
              </Link>

              <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.createdAt)}
                </div>
                {post.readTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    {post.readTime}
                  </div>
                )}
              </div>

              <Link href={`/blog/${post.slug}`} className="block group-hover:text-accent transition-colors">
                <h3 className="text-xl font-bold text-primary leading-tight mb-3">
                  {post.title}
                </h3>
              </Link>

              <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="mt-auto">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary group-hover:gap-3 transition-all"
                >
                  Read Article
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
