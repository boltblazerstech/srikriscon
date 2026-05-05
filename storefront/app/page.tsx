import HeroBanner from "@/src/components/home/HeroBanner";
import CategoryGrid from "@/src/components/home/CategoryGrid";
import FeaturedProducts from "@/src/components/home/FeaturedProducts";
import WhyChooseUs from "@/src/components/home/WhyChooseUs";
import TestimonialsSection from "@/src/components/home/TestimonialsSection";
import CtaBanner from "@/src/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <WhyChooseUs />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
