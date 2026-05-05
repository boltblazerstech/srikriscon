import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Delivered to your doorstep within 3–7 business days nationwide.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine Products",
    description: "100% authentic products sourced directly from manufacturers.",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Hassle-free returns within 7 days of delivery.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our team is always here to help you via WhatsApp or email.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-muted/40 py-20 border-y border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-sm font-bold tracking-widest text-accent uppercase mb-3 block">
            The SRI KRISCON Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Why Choose Us
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="group flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-border/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative accent blob */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-highlight/10 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors duration-500" />
              
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:bg-accent group-hover:text-white transition-colors duration-300 mb-6 relative z-10">
                <f.icon className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3 relative z-10">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
