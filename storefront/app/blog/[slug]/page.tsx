"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { useBlog } from "@/src/hooks/useBlogs";
import { formatDate } from "@/src/lib/utils";
import Spinner from "@/src/components/ui/Spinner";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: post, isLoading } = useBlog(slug);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: post?.title || "Sri Kriscon Blog",
      text: post?.excerpt || post?.title || "",
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or web share failed, fallback to copy clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Article link copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

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
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover opacity-60 scale-105"
            priority
          />
        )}
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
              {post.category && (
                <span className="bg-accent px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  {post.category}
                </span>
              )}
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
                {formatDate(post.createdAt)}
              </div>
              {post.readTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  {post.readTime}
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-accent flex items-center justify-center text-white text-[10px]">
                  {(post.author || "S")[0]}
                </div>
                By {post.author || "Sri Kriscon"}
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* ── Article Content ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 py-20 lg:py-28 relative">
        {/* Floating Share Button Sidebar (Desktop) */}
        <aside className="hidden xl:block absolute left-[-100px] top-28 sticky top-40">
          <button
            onClick={handleShare}
            title="Share article"
            aria-label="Share article"
            className="h-12 w-12 rounded-full border border-zinc-200 bg-white shadow-sm flex items-center justify-center text-zinc-600 hover:text-accent hover:border-accent hover:shadow-md transition-all group"
          >
            {copied ? (
              <Check className="h-5 w-5 text-emerald-600" />
            ) : (
              <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
            )}
          </button>
        </aside>

        <div className="prose prose-lg lg:prose-xl prose-zinc max-w-none">
          {post.excerpt && (
            <p className="text-xl sm:text-2xl font-medium text-zinc-600 leading-relaxed italic mb-12 border-l-4 border-accent pl-8">
              {post.excerpt}
            </p>
          )}
          
          <div 
            className="space-y-8 text-zinc-800 leading-loose prose-headings:text-primary prose-a:text-accent"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
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
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-600" /> Copied
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" /> Share Article
                  </>
                )}
              </button>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
