"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Calendar, Clock, Share2, ArrowLeft, ArrowRight,
  Search, CheckCircle2, Copy, Bookmark,
  Tag, BookOpen, ChevronRight, Phone, Mail, Award, Check, Send, Sparkles
} from "lucide-react";
import toast from "react-hot-toast";
import WhatsAppIcon from "@/src/components/ui/WhatsAppIcon";
import { BLOG_POSTS } from "@/src/config/blogs";
import { theme } from "@/src/config/theme";
import { whatsappLink } from "@/src/lib/utils";

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Consultation form state
  const [consultForm, setConsultForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug);
  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 font-sans">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl border border-zinc-200 shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Article Not Found</h1>
          <p className="text-sm text-zinc-500 mb-6">The article you are looking for might have been moved or updated.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  function handleConsultSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consultForm.name || !consultForm.phone) {
      toast.error("Please provide your name and phone number");
      return;
    }
    setIsSubmitting(true);
    const msg = `*Free Consultation Request*\n\nName: ${consultForm.name}\nPhone: ${consultForm.phone}\nEmail: ${consultForm.email || "N/A"}\nRequirement: ${consultForm.message || "Consultation requested from blog: " + post?.title}`;
    const whatsappNum = theme.business.whatsapp || "917999921111";
    window.open(whatsappLink(whatsappNum, msg), "_blank");
    toast.success("Consultation request submitted! Our team will call you shortly.");
    setConsultForm({ name: "", phone: "", email: "", message: "" });
    setIsSubmitting(false);
  }

  function handleCopyLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    }
  }

  function handleShare(platform: string) {
    if (typeof window === "undefined") return;
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post?.title || "");

    let shareUrl = "";
    if (platform === "whatsapp") {
      shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
    } else if (platform === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
    } else if (platform === "facebook") {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }
    if (shareUrl) window.open(shareUrl, "_blank", "width=600,height=450");
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-zinc-800">
      
      {/* ── Breadcrumb Bar ─────────────────────────────────────────────── */}
      <div className="border-b border-zinc-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-zinc-400" />
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3 text-zinc-400" />
            <span className="text-zinc-500 font-medium">{post.category}</span>
            <ChevronRight className="h-3 w-3 text-zinc-400" />
            <span className="text-zinc-900 font-semibold truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Article Header Section (Hero Metadata) ──────────────────────── */}
      <header className="bg-white border-b border-zinc-200/80 pt-10 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Category badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-4">
              <Tag className="h-3.5 w-3.5" />
              {post.category}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 leading-[1.15] tracking-tight mb-6">
              {post.title}
            </h1>

            {/* Author & Publish Metadata */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-zinc-500 border-t border-zinc-100 pt-5">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  {post.author[0]}
                </div>
                <div>
                  <span className="block text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Author</span>
                  <span className="font-semibold text-zinc-800 text-xs">{post.author}</span>
                </div>
              </div>

              <div className="h-6 w-px bg-zinc-200 hidden sm:block" />

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{post.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{post.readTime}</span>
              </div>

              <div className="h-6 w-px bg-zinc-200 hidden sm:block" />

              <div className="flex items-center gap-2 text-zinc-600">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span>Sri Kriscon Knowledge Desk</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Layout: 2 Columns (Content | Sticky Sidebar) ─────────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* ── LEFT / MAIN CONTENT (Col 8) ───────────────────────────── */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* Featured Image */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-zinc-200/80 shadow-sm bg-zinc-100">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
            </div>

            {/* Table of Contents Widget */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs">
              <div className="flex items-center gap-2.5 text-zinc-900 font-bold text-base mb-4 pb-3 border-b border-zinc-100">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Table of Contents</span>
              </div>
              <ul className="space-y-2 text-sm text-zinc-600">
                <li>
                  <a href="#overview" className="hover:text-primary hover:underline flex items-center gap-2">
                    <span className="text-primary font-bold">1.</span> Executive Overview & Importance
                  </a>
                </li>
                <li>
                  <a href="#key-factors" className="hover:text-primary hover:underline flex items-center gap-2">
                    <span className="text-primary font-bold">2.</span> Key Structural & Material Considerations
                  </a>
                </li>
                <li>
                  <a href="#practical-benefits" className="hover:text-primary hover:underline flex items-center gap-2">
                    <span className="text-primary font-bold">3.</span> Measurable Business Benefits & Cost Efficiency
                  </a>
                </li>
                <li>
                  <a href="#industry-standards" className="hover:text-primary hover:underline flex items-center gap-2">
                    <span className="text-primary font-bold">4.</span> Compliance, Safety & Environmental Integrity
                  </a>
                </li>
                <li>
                  <a href="#conclusion" className="hover:text-primary hover:underline flex items-center gap-2">
                    <span className="text-primary font-bold">5.</span> Final Recommendations & Implementation
                  </a>
                </li>
              </ul>
            </div>

            {/* Article Body */}
            <article className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-10 shadow-xs space-y-8 text-zinc-700 leading-relaxed">
              
              {/* Lead excerpt */}
              <div id="overview" className="border-l-4 border-primary pl-5 py-1">
                <p className="text-base sm:text-lg font-medium text-zinc-900 leading-relaxed italic">
                  &ldquo;{post.excerpt}&rdquo;
                </p>
              </div>

              <div className="space-y-4 text-base">
                <p>
                  In the contemporary industrial and consumer marketplace, packaging has transitioned from a mere protective shell into a pivotal determinant of brand equity, logistics safety, and operational excellence. Companies across India and global supply networks face increasing pressure to balance rigorous structural strength with modern aesthetic appeal.
                </p>
                <p>
                  Whether handling confectionery goods, pharmaceutical supplies, or high-value consumer electronics, adopting specialized packaging protocols ensures products reach their destination in flawless condition while reinforcing customer confidence at first unboxing.
                </p>
              </div>

              {/* Section 2 */}
              <div id="key-factors" className="space-y-4 pt-4 border-t border-zinc-100">
                <h2 className="text-2xl font-extrabold text-zinc-900 flex items-center gap-2">
                  <span className="text-primary font-mono text-xl">01.</span>
                  Key Structural & Material Considerations
                </h2>
                <p>
                  Selecting the correct substrate is the foundation of dependable packaging. The combination of high-bursting factor (BF) kraft paper, precision-creased mono cartons, and high-density grey board for rigid structures provides the necessary resilience against compressive loads during pallet stacking and road transport.
                </p>

                {/* Key Takeaways Box */}
                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 space-y-3">
                  <h3 className="font-bold text-sm text-primary uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Crucial Quality Checklist
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-zinc-800">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Consistent Caliper & Grammage (GSM)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Accurate Die-Line Creasing & Folding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Moisture & Heat Resistance Coatings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Food-Grade Inks for Edible Packaging</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div id="practical-benefits" className="space-y-4 pt-4 border-t border-zinc-100">
                <h2 className="text-2xl font-extrabold text-zinc-900 flex items-center gap-2">
                  <span className="text-primary font-mono text-xl">02.</span>
                  Measurable Business Benefits & Cost Efficiency
                </h2>
                <p>
                  Many organizations perceive custom packaging strictly as an operational expense. However, data across supply chains reveals that precision-engineered boxes yield high returns by curbing product transit damages by upwards of 35% and drastically minimizing reverse logistics penalties.
                </p>
                <p>
                  Furthermore, standardized box dimensions optimize warehouse racking space and container cubic capacity, translating directly into reduced shipping expenses per unit shipped.
                </p>

                {/* Blockquote */}
                <blockquote className="bg-zinc-50 border-l-4 border-[#B5A57A] p-6 rounded-r-2xl my-6">
                  <p className="text-base sm:text-lg font-semibold text-zinc-900 italic">
                    &ldquo;Excellence in packaging is not about over-engineering; it is about calibrating materials to the exact transit demands of the product.&rdquo;
                  </p>
                  <cite className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mt-2 not-italic">
                    — Technical Operations, Sri Kriscon Industries
                  </cite>
                </blockquote>
              </div>

              {/* Section 4 */}
              <div id="industry-standards" className="space-y-4 pt-4 border-t border-zinc-100">
                <h2 className="text-2xl font-extrabold text-zinc-900 flex items-center gap-2">
                  <span className="text-primary font-mono text-xl">03.</span>
                  Compliance, Safety & Sustainability
                </h2>
                <p>
                  Modern consumers actively reward brands that prioritize ecological stewardship. Utilizing FSC-certified renewable paper stock, biodegradable glues, and non-toxic water-based UV coatings aligns your business with national sustainability guidelines while captivating eco-conscious buyers.
                </p>
              </div>

              {/* Section 5: Conclusion */}
              <div id="conclusion" className="space-y-4 pt-4 border-t border-zinc-100">
                <h2 className="text-2xl font-extrabold text-zinc-900">
                  Conclusion & Strategic Implementation
                </h2>
                <p>
                  Evaluating your current packaging footprint is an essential step in safeguarding your bottom line. By collaborating with experienced manufacturing partners equipped with internal testing and modern die-cutting facilities, you ensure durability, beauty, and cost effectiveness across every consignment.
                </p>
              </div>

            </article>

            {/* ── Free Consultation Lead Form Box (Reference Inspiration) ──── */}
            <div className="bg-white rounded-2xl border-2 border-primary/20 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-zinc-900">
                    Get a Free Packaging & Machinery Consultation
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Discuss your box specifications, volumes, and custom printing with Sri Kriscon specialists.
                  </p>
                </div>
              </div>

              <form onSubmit={handleConsultSubmit} className="space-y-3.5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={consultForm.name}
                      onChange={(e) => setConsultForm({ ...consultForm, name: e.target.value })}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={consultForm.phone}
                      onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={consultForm.email}
                      onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">Packaging / Machine Requirement</label>
                    <input
                      type="text"
                      value={consultForm.message}
                      onChange={(e) => setConsultForm({ ...consultForm, message: e.target.value })}
                      placeholder="e.g. Sweet boxes, rigid packaging, mono cartons"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm transition-all shadow-md active:scale-[0.99]"
                >
                  <Send className="h-4 w-4" />
                  <span>Request Free Consultation</span>
                </button>
              </form>
            </div>

            {/* Social Share Bar */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-800">
                <Share2 className="h-4 w-4 text-primary" />
                <span>Share this article:</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                  aria-label="Share on WhatsApp"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 text-white" /> WhatsApp
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-bold hover:opacity-90 transition-opacity"
                  aria-label="Share on X"
                >
                  X / Twitter
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077b5] text-white text-xs font-bold hover:opacity-90 transition-opacity"
                  aria-label="Share on LinkedIn"
                >
                  LinkedIn
                </button>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700 text-xs font-bold hover:bg-zinc-100 transition-colors"
                  aria-label="Copy link"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              </div>
            </div>

            {/* Author Card */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-extrabold text-2xl shrink-0">
                {post.author[0]}
              </div>
              <div className="space-y-2 text-center sm:text-left">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">{post.author}</h3>
                  <p className="text-xs text-primary font-semibold">Packaging & Industrial Materials Specialist</p>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  Focusing on corrugated box engineering, structural die-cutting, and sustainable supply chain packaging at Sri Kriscon Industries. Passionate about empowering businesses through durable and high-aesthetic box manufacturing.
                </p>
              </div>
            </div>

            {/* Previous / Next Article Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost ? (
                <Link
                  href={`/blog/${prevPost.slug}`}
                  className="group bg-white rounded-xl border border-zinc-200/90 p-4 shadow-xs hover:border-primary/50 transition-colors flex flex-col justify-between"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1 mb-1 group-hover:text-primary">
                    <ArrowLeft className="h-3 w-3" /> Previous Article
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-zinc-800 line-clamp-2 group-hover:text-primary transition-colors">
                    {prevPost.title}
                  </p>
                </Link>
              ) : <div />}

              {nextPost ? (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className="group bg-white rounded-xl border border-zinc-200/90 p-4 shadow-xs hover:border-primary/50 transition-colors flex flex-col justify-between text-right"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center justify-end gap-1 mb-1 group-hover:text-primary">
                    Next Article <ArrowRight className="h-3 w-3" />
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-zinc-800 line-clamp-2 group-hover:text-primary transition-colors">
                    {nextPost.title}
                  </p>
                </Link>
              ) : <div />}
            </div>

          </main>

          {/* ── RIGHT / STICKY SIDEBAR (Col 4) ─────────────────────────── */}
          <aside className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            
            {/* Search Box Widget */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">
                Search Articles
              </h3>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search packaging topics..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-zinc-50"
                />
                <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Popular / Related Posts Widget */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 pb-2 border-b border-zinc-100 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" />
                Related Articles
              </h3>
              <div className="space-y-4">
                {otherPosts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="group flex items-center gap-3.5"
                  >
                    <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0 bg-zinc-100">
                      <Image
                        src={p.imageUrl}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-800 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                        {p.title}
                      </p>
                      <span className="text-[10px] text-zinc-400 mt-1 block">
                        {p.date} • {p.readTime}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Category Cloud Widget */}
            <div className="bg-white rounded-2xl border border-zinc-200/90 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3.5 pb-2 border-b border-zinc-100">
                Packaging Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Rigid Boxes", count: "12" },
                  { name: "Mono Cartons", count: "8" },
                  { name: "Sweet Boxes", count: "16" },
                  { name: "Corrugated", count: "10" },
                  { name: "Sustainability", count: "5" },
                  { name: "Die-Cutting", count: "7" },
                ].map((tag) => (
                  <span
                    key={tag.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200/80 bg-zinc-50 text-xs font-medium text-zinc-700 hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    <span>{tag.name}</span>
                    <span className="text-[10px] text-zinc-400 bg-white px-1.5 py-0.2 rounded font-mono">
                      {tag.count}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* High-Converting CTA Box (Sri Kriscon Theme) */}
            <div className="bg-[#072429] text-white rounded-2xl p-6 shadow-md relative overflow-hidden border border-white/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#B5A57A]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#B5A57A]/20 text-[#B5A57A] text-[10px] font-bold uppercase tracking-wider">
                  Custom Manufacturing
                </span>
                <h4 className="text-lg font-bold leading-tight">
                  Need Custom Packaging or Machinery for Your Enterprise?
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Sri Kriscon engineers custom rigid boxes, sweet cartons, and industrial packing with quick turnaround and pan-India shipping.
                </p>
                <div className="pt-2 space-y-2.5">
                  <a
                    href={whatsappLink(theme.business.whatsapp, "Hi Sri Kriscon, I read your blog and want to inquire about custom packaging.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 font-bold text-xs transition-colors shadow-xs"
                  >
                    <WhatsAppIcon className="h-4 w-4 text-white" />
                    Chat on WhatsApp
                  </a>
                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:bg-white/10 text-white py-2.5 px-4 font-bold text-xs transition-colors"
                  >
                    Request Custom Quote
                  </Link>
                </div>
              </div>
            </div>

          </aside>

        </div>
      </div>

    </div>
  );
}
