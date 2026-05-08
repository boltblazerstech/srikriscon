"use client";

const ITEMS = [
  "FREE SHIPPING ON ORDERS ABOVE ₹999",
  "NEW ARRIVALS EVERY WEEK",
  "EXCLUSIVE MEMBER DEALS",
  "PREMIUM QUALITY GUARANTEED",
  "EASY RETURNS & EXCHANGES",
  "10,000+ HAPPY CUSTOMERS",
];

const doubled = [...ITEMS, ...ITEMS];

export default function MarqueeBanner() {
  return (
    <div className="bg-primary overflow-hidden py-2.5 border-b border-white/5 group">
      <div className="flex animate-marquee will-change-transform group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-center flex-shrink-0">
            <span className="text-[10px] font-extrabold tracking-[0.22em] text-white/75 uppercase px-8">
              {item}
            </span>
            <span className="text-accent text-xs leading-none select-none">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
