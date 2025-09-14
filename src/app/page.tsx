import { Suspense } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LearnMoreButton from "@/components/learn-more-button";
import ProductGrid from "@/components/product-grid";
import Testimonials from "@/components/testimonials";
import WhyChooseUs from "@/components/why-choose-us";
import { Button } from "@/components/ui/button";
import Loading, {
  ProductGridSkeleton,
  TestimonialSkeleton,
  WhyChooseUsSkeleton,
} from "@/components/ui/loading";
import { getFeaturedProducts, getCategories } from "@/lib/data-service";
import { generateHomeMetadata } from "@/lib/metadata";
import { categoryNameMap } from "@/lib/utils";

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata();
}

// Hero Section Component
function HeroSection() {
  const heroImage =
    "https://images.unsplash.com/photo-1654448079061-46d219efffde?q=80&w=2070&auhref=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <section className="relative h-[70vh] min-h-[500px]">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Luxury perfumes collection"
          className="w-full h-full object-cover"
          width={1280}
          height={640}
          priority
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>
      <div className="relative h-full luxury-container flex flex-col justify-center items-start text-white">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 max-w-2xl animate-fade-in">
          Discover Your Signature Scent
        </h1>
        <p className="text-lg md:text-xl max-w-lg mb-8 animate-fade-in">
          Exquisite fragrances crafted with the finest ingredients to elevate
          your presence and leave a lasting impression.
        </p>
        <Link href="/products" className="group">
          <LearnMoreButton
            text="Shop Collection"
            className="w-64 [&_.button-text]:text-white"
          />
        </Link>
      </div>
    </section>
  );
}

// Collections Section Component
async function CollectionsSection() {
  const categories = await getCategories();
  console.log(categories);

  return (
    <section className="py-16 bg-luxe-cream">
      <div className="luxury-container">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">
          Our Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.slice(0, 3).map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.name}`}
              className="group"
            >
              <div className="relative h-80 overflow-hidden rounded-lg">
                <div
                  className={`w-full h-full bg-gradient-to-br ${
                    category.name === "men"
                      ? "from-gray-200 to-gray-300"
                      : category.name === "women"
                      ? "from-pink-200 to-pink-300"
                      : "from-purple-200 to-purple-300"
                  } flex items-center justify-center`}
                >
                  <div className="text-center text-gray-500">
                    {category.name === "men" ? (
                      <div className="mb-2">
                        <Image
                          src="/assets/home/mens-collection.png"
                          alt="Men's Collection"
                          width={128}
                          height={128}
                          className="mx-auto"
                        />
                      </div>
                    ) : (
                      <div className="text-4xl mb-2">
                        {category.name === "women" ? "👩" : "👥"}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6">
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">
                    {categoryNameMap(category.name)}
                  </h3>
                  <button className="flex items-center bg-transparent text-white cursor-pointer font-bold text-sm uppercase border-0 outline-0 p-4 before:bg-white before:content-[''] before:inline-block before:h-[1px] before:mr-[10px] before:transition-all before:duration-[0.42s] before:ease-[cubic-bezier(.25,.8,.25,1)] before:w-0 group-hover:before:bg-white group-hover:before:w-12">
                    Explore Now
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Featured Products Section Component
async function FeaturedProductsSection() {
  const featuredProducts = await getFeaturedProducts(4);

  return (
    <section className="py-16">
      <div className="luxury-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-serif font-bold">Featured Fragrances</h2>
          <Link href="/products" className="text-black hover:underline">
            View All
          </Link>
        </div>
        <ProductGrid products={featuredProducts} />
      </div>
    </section>
  );
}

// Newsletter Section Component
function NewsletterSection() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="luxury-container text-center">
        <h2 className="text-3xl font-serif font-bold mb-3">
          Join Our Community
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter for exclusive offers, new releases, and
          fragrance tips.
        </p>
        <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 h-12">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-grow px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-luxe-blue"
          />
          <Button className="bg-black h-full hover:bg-luxe-blue">
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
}

// Story Section Component
function StorySection() {
  return (
    <section className="py-16 bg-luxe-blue text-white">
      <div className="luxury-container text-center">
        <h2 className="text-3xl font-poppins font-black mb-8 text-white">
          Our Story
        </h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-8">
            Aromé Luxe was born from a passion for exceptional fragrances and a
            desire to bring the world&apos;s finest scents to discerning
            customers. Our journey began with a simple belief: that a perfume is
            more than just a scent—it&apos;s an expression of personality, a
            memory in the making, and a finishing touch to any outfit.
          </p>
          <p className="text-lg mb-8">
            Each of our fragrances is carefully crafted using the highest
            quality ingredients sourced from around the globe. We work with
            master perfumers who blend traditional techniques with innovative
            approaches to create scents that are both timeless and contemporary.
          </p>
          <Link href="/about" className="group">
            <LearnMoreButton
              text="Learn More About Us"
              className="w-80 [&_.circle]:bg-white [&_.circle_.icon.arrow]:before:border-black [&_.button-text]:pl-8 [&_.button-text]:text-white group-hover:[&_.button-text]:text-luxe-blue"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="flex-grow">
      {/* Hero Section - Renders immediately */}
      <HeroSection />

      {/* Collections Section - Server-side rendered */}
      <Suspense
        fallback={<Loading text="Loading collections..." className="py-16" />}
      >
        <CollectionsSection />
      </Suspense>

      {/* Featured Products Section - Server-side rendered with streaming */}
      <Suspense fallback={<ProductGridSkeleton count={4} />}>
        <FeaturedProductsSection />
      </Suspense>

      {/* Why Choose Us Section - Client-side with streaming */}
      <Suspense fallback={<WhyChooseUsSkeleton />}>
        <WhyChooseUs />
      </Suspense>

      {/* Testimonials Section - Client-side with streaming */}
      <Suspense fallback={<TestimonialSkeleton />}>
        <Testimonials />
      </Suspense>

      {/* Story Section - Renders immediately */}
      <StorySection />

      {/* Newsletter Section - Renders immediately */}
      <NewsletterSection />
    </main>
  );
}
