"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ChevronRight, Search, Filter } from "lucide-react";
import { useBlogs } from "@/src/hooks/useBlogs";
import { fadeUp, staggerContainer, staggerItem } from "@/src/lib/animations";
import { formatDate, cn } from "@/src/lib/utils";
import Spinner from "@/src/components/ui/Spinner";

export default function BlogListingPage() {
  const { data: blogs, isLoading } = useBlogs();
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    if (!blogs) return [];
    const cats = blogs.map((b) => b.category).filter(Boolean);
    return Array.from(new Set(cats));
  }, [blogs]);

  // Filter blogs based on Search & Category selections
  const filteredBlogs = useMemo(() => {
    if (!blogs) return [];
    return blogs.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24">
      {/* ── Blog Hero (with Search Box) ─────────────────────────────────── */}
      <section className="bg-[#0B3A42] pt-20 pb-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full filter blur-3xl" />
          <div className="absolute bottom-5 right-10 w-96 h-96 bg-white rounded-full filter blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4">
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
            className="text-zinc-300 text-lg max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Stay updated with the latest trends in digital marketing, industrial innovation, web design, and supply chain technologies.
          </motion.p>

          {/* Search box inside Hero banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="max-w-md mx-auto relative shadow-xl"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-zinc-400 outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all backdrop-blur-md"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Blog Filter Panel (Floating Card) ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-12">
        <div className="bg-white rounded-3xl shadow-lg border border-zinc-100 p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-[#0B3A42]" />
            <h3 className="font-semibold text-zinc-800 text-sm sm:text-base">Filter by Category</h3>
            <span className="text-xs text-zinc-400">({filteredBlogs.length} articles)</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => setSelectedCategory("All")}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer",
                selectedCategory === "All"
                  ? "bg-accent text-white shadow-md shadow-accent/20"
                  : "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer",
                  selectedCategory === cat
                    ? "bg-accent text-white shadow-md shadow-accent/20"
                    : "bg-zinc-50 border border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Blog Grid ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : !blogs || blogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-zinc-100">
            <h3 className="text-xl font-bold text-primary mb-2">No Articles Found</h3>
            <p className="text-zinc-500 text-sm">Check back later for new updates and insights.</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-zinc-100">
            <h3 className="text-xl font-bold text-primary mb-2">No Results Found</h3>
            <p className="text-zinc-500 text-sm">No articles match your search parameters. Try adjusting your query or category filters.</p>
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredBlogs.map((post) => (
              <motion.article 
                key={post.id} 
                variants={staggerItem} 
                className="bg-white rounded-3xl overflow-hidden border border-zinc-100/85 shadow-sm hover:shadow-[0_20px_50px_rgba(11,58,66,0.06)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
              >
                <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(post.createdAt)}</span>
                    {post.readTime && (
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
                    )}
                  </div>

                  <Link href={`/blog/${post.slug}`} className="block">
                    <h3 className="font-display text-[18px] font-bold text-[#0B3A42] leading-snug mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <div className="mt-auto pt-6 border-t border-zinc-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      By {post.author || "Sri Kriscon"}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#0B3A42] group-hover:text-accent group-hover:gap-2.5 transition-all duration-300"
                    >
                      Read More
                      <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
