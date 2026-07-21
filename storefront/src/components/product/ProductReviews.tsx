"use client";

import { useState } from "react";
import { Star, Check } from "lucide-react";
import { cn } from "@/src/lib/utils";
import Button from "@/src/components/ui/Button";

interface Review {
  id: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

const initialReviews: Review[] = [
  {
    id: "1",
    name: "Aarav Sharma",
    rating: 5,
    title: "Exceptional Board Quality!",
    comment: "The double-wall corrugated boxes are incredibly strong. We use them for shipping heavy auto components from Dewas, and we've had zero damage reports since switching to Sri Kriscon. Highly recommended!",
    date: "July 10, 2026"
  },
  {
    id: "2",
    name: "Priyanka Patel",
    rating: 4,
    title: "Great Custom Printing",
    comment: "The print registration of our brand logo is sharp and clear. Sizing is exactly what we requested. MOQ was reasonable. Docked 1 star because shipping took a day longer than estimated, but quality is outstanding.",
    date: "June 28, 2026"
  },
  {
    id: "3",
    name: "Vikram Malhotra",
    rating: 5,
    title: "Perfect Packaging Rolls",
    comment: "Excellent strength and flexibility in their corrugated rolls. Easy to wrap irregular products. Will definitely buy in bulk again.",
    date: "May 15, 2026"
  }
];

export default function ProductReviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Calculate stats
  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  ).toFixed(1);

  const starBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    const percentage = ((count / reviews.length) * 100).toFixed(0);
    return { stars, percentage, count };
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview: Review = {
      id: Date.now().toString(),
      name: "Customer",
      rating: rating,
      title: `${rating} Star Rating`,
      comment: comment.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    };

    setReviews((prev) => [newReview, ...prev]);
    setComment("");
    setRating(5);
  }

  return (
    <section className="mt-16 border-t border-border pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Stats */}
        <div className="lg:col-span-1">
          <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight mb-6">
            Customer Reviews
          </h2>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl font-black text-[#0B3A42]">{averageRating}</span>
            <div>
              <div className="flex text-amber-400 mb-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "h-5 w-5",
                      s <= Math.round(Number(averageRating)) ? "fill-current" : "text-zinc-200"
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Based on {reviews.length} reviews</p>
            </div>
          </div>

          {/* Breakdown bars */}
          <div className="space-y-3">
            {starBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 text-xs sm:text-sm text-zinc-600">
                <span className="w-10 text-right">{item.stars} star</span>
                <div className="flex-1 h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0B3A42] rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Reviews List & Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Simplified Write a Review Form with Stars Option Above it */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#FCFAF7] border border-border/80 rounded-2xl p-5 space-y-4"
          >
            {/* Star Rating Selection */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">
                Your Rating
              </label>
              <div className="flex gap-1 text-zinc-300">
                {[1, 2, 3, 4, 5].map((s) => {
                  const active = hoverRating != null ? s <= hoverRating : s <= rating;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-0.5 hover:scale-110 transition-transform focus:outline-none"
                    >
                      <Star
                        className={cn(
                          "h-6 w-6 transition-colors",
                          active ? "text-amber-400 fill-current" : "text-zinc-200"
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Field and Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-start">
              <input
                type="text"
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#0B3A42]/20 focus:border-[#0B3A42] transition-colors"
                placeholder="Write your review"
              />
              <Button type="submit" className="sm:h-[46px] px-6 whitespace-nowrap">
                Submit
              </Button>
            </div>
          </form>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="relative border-b border-border pb-6 last:border-b-0 last:pb-0"
              >
                {/* Date in top-right corner */}
                <div className="absolute top-0 right-0">
                  <span className="text-xs text-muted-foreground font-medium">{review.date}</span>
                </div>

                {/* Single column: Customer Name -> Rating Stars -> Review Text */}
                <div className="flex flex-col gap-2.5 pr-28">
                  {/* Customer Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B3A42] text-white font-black text-sm uppercase flex-shrink-0 shadow-xs border border-white/20">
                      {review.name ? review.name.charAt(0) : "C"}
                    </div>
                    <h4 className="font-bold text-foreground text-base leading-snug">
                      {review.name}
                    </h4>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={cn(
                          "h-4 w-4",
                          s <= review.rating ? "fill-current text-amber-400" : "text-zinc-200"
                        )}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-zinc-600 leading-relaxed">{review.comment}</p>

                  {/* Verified Purchase Badge */}
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-[#0B3A42] font-semibold bg-[#0B3A42]/5 w-fit px-2 py-0.5 rounded">
                    <Check className="h-3 w-3" /> Verified Purchase
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
