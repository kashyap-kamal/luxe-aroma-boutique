import { Suspense } from "react";
import { Metadata } from "next";
import {
  getFeaturedProducts,
  getCategories,
} from "@/lib/data-service";
import { generateHomeMetadata } from "@/lib/metadata";

// Components
import HeroSection from "@/components/home/hero-section";
import CollectionsSection from "@/components/home/collections-section";
import FeaturedSection from "@/components/home/featured-section";
import StorySection from "@/components/home/story-section";
import NewsletterSection from "@/components/home/newsletter-section";
import WhyChooseUs from "@/components/why-choose-us";
import Testimonials from "@/components/testimonials";
import Loading, {
  ProductGridSkeleton,
  TestimonialSkeleton,
  WhyChooseUsSkeleton,
} from "@/components/ui/loading";

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata();
}

export default async function Home() {
  // Fetch data in parallel
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(4),
    getCategories(),
  ]);

  return (
    <main className="flex-grow bg-white overflow-x-hidden">
      {/* Hero Section - Client Component */}
      <HeroSection />

      {/* Collections Section - Client Component */}
      <Suspense
        fallback={<Loading text="Loading collections..." className="py-16" />}
      >
        <CollectionsSection categories={categories} />
      </Suspense>

      {/* Featured Products Section - Client Component */}
      <Suspense fallback={<ProductGridSkeleton count={4} />}>
        <FeaturedSection products={featuredProducts} />
      </Suspense>

      {/* Why Choose Us Section - Client-side with streaming */}
      <Suspense fallback={<WhyChooseUsSkeleton />}>
        <WhyChooseUs />
      </Suspense>

      {/* Story Section - Client Component */}
      <StorySection />

      {/* Testimonials Section - Client-side with streaming */}
      <Suspense fallback={<TestimonialSkeleton />}>
        <Testimonials />
      </Suspense>

      {/* Newsletter Section - Client Component */}
      <NewsletterSection />
    </main>
  );
}
