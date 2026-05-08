import HeroBanner from "@/src/components/home/HeroBanner";
import MarqueeBanner from "@/src/components/home/MarqueeBanner";
import CategoryGrid from "@/src/components/home/CategoryGrid";
import FeaturedProducts from "@/src/components/home/FeaturedProducts";
import WhyChooseUs from "@/src/components/home/WhyChooseUs";
import TestimonialsSection from "@/src/components/home/TestimonialsSection";
import CtaBanner from "@/src/components/home/CtaBanner";
import WaveDivider from "@/src/components/ui/WaveDivider";

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
      <WaveDivider from="#0B3A42" to="#f5f5f5" />

      <TestimonialsSection />

      {/* muted → near-black (zinc-950) */}
      <WaveDivider from="#f5f5f5" to="#09090b" />
      <CtaBanner />
    </>
  );
}
