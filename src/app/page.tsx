import { Suspense } from "react";
import { Metadata } from "next";
import {
  getFeaturedProducts,
} from "@/lib/data-service";
import { generateHomeMetadata } from "@/lib/metadata";
import { homepageConfig } from "@/lib/homepage-config";

// Components
import HeroSection from "@/components/home/hero-section";
import TickerSection from "@/components/home/ticker-section";
import CollectionsSection from "@/components/home/collections-section";
import FeaturedSection from "@/components/home/featured-section";
import ProductSpotlight from "@/components/home/product-spotlight";
import StorySection from "@/components/home/story-section";
import BundleSection from "@/components/home/bundle-section";
import ScentQuizSection from "@/components/home/scent-quiz-section";
import NewsletterSection from "@/components/home/newsletter-section";
import WhyChooseUs from "@/components/why-choose-us";
import Testimonials from "@/components/testimonials";
import Loading, {
  ProductGridSkeleton,
  TestimonialSkeleton,
} from "@/components/ui/loading";

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata();
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(8);

  return (
    <main className="flex-grow overflow-x-hidden" style={{ background: "#F2EDE4" }}>
      {homepageConfig.showHero && (
        <HeroSection products={featuredProducts} />
      )}

      <TickerSection />

      {homepageConfig.showCollections && (
        <Suspense fallback={<Loading text="Loading collections..." className="py-16" />}>
          <CollectionsSection />
        </Suspense>
      )}

      {homepageConfig.showProductSpotlight && (
        <ProductSpotlight products={featuredProducts} />
      )}

      {homepageConfig.showFeatured && (
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <FeaturedSection products={featuredProducts} />
        </Suspense>
      )}

      {homepageConfig.showBundles && (
        <BundleSection />
      )}

      {homepageConfig.showScentQuiz && (
        <ScentQuizSection />
      )}

      {homepageConfig.showStory && (
        <StorySection />
      )}

      {homepageConfig.showTestimonials && (
        <Suspense fallback={<TestimonialSkeleton />}>
          <Testimonials />
        </Suspense>
      )}

      {homepageConfig.showWhyChooseUs && (
        <WhyChooseUs />
      )}

      {homepageConfig.showNewsletter && (
        <NewsletterSection />
      )}
    </main>
  );
}
