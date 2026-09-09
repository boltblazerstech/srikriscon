import HeroBanner from "@/src/components/home/HeroBanner";
import MarqueeBanner from "@/src/components/home/MarqueeBanner";
import CategoryGrid from "@/src/components/home/CategoryGrid";
import FeaturedProducts from "@/src/components/home/FeaturedProducts";
import FeaturedBanner from "@/src/components/home/FeaturedBanner";
import BlogSection from "@/src/components/home/BlogSection";
import WhyChooseUs from "@/src/components/home/WhyChooseUs";
import TestimonialsSection from "@/src/components/home/TestimonialsSection";
import CtaBanner from "@/src/components/home/CtaBanner";
import WaveDivider from "@/src/components/ui/WaveDivider";
import FaqSection from "@/src/components/home/FaqSection";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <MarqueeBanner />
      <CategoryGrid />
      <FeaturedProducts />
      
      {/* white → teal */}
      <WaveDivider from="#ffffff" to="#0B3A42" />
      <WhyChooseUs />
      {/* teal → muted (testimonials bg ≈ muted colour) */}
      {/* <WaveDivider from="#0B3A42" to="#f5f5f5" />

      <br />
      <br /> */}
      <FeaturedBanner />

      <TestimonialsSection />
      
      {/* muted → near-black (zinc-950) */}
      <WaveDivider from="#f5f5f5" to="#09090b" />
      <CtaBanner />
      <BlogSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Map Section */}
      <section className="mx-auto max-w-[83rem] px-4 sm:px-6 lg:px-8 my-16 md:my-24">
        <div className="text-center mb-10">
          <h2 className="text-primary font-black text-2xl md:text-3xl tracking-tight mb-2">
            VISIT OUR FACILITY
          </h2>
          <p className="text-zinc-500 text-sm tracking-widest uppercase font-medium">
            E-6, Industrial Area, Dewas, Madhya Pradesh 455001
          </p>
        </div>
        <div className="w-full h-[450px] rounded-[24px] overflow-hidden shadow-md border border-zinc-100">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.083507071766!2d76.0281959!3d22.947151500000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3963193dd0e00c39%3A0x99403bfc8e4a5ab2!2sSri%20Kriscon%20Industries!5e0!3m2!1sen!2sin!4v1784022539561!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </section>
    </>
  );
}
