import Footer from "@/components/footer";
import LearnMoreButton from "@/components/learn-more-button";
import Navbar from "@/components/navbar";
import ProductGrid from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/ mock-data";
import Link from "next/link";

export default function Home() {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px]">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1654448079061-46d219efffde?q=80&w=2070&auhref=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Luxury perfumes"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
          </div>
          <div className="relative h-full luxury-container flex flex-col justify-center items-start text-white">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 max-w-2xl animate-fade-in">
              Discover Your Signature Scent
            </h1>
            <p className="text-lg md:text-xl max-w-lg mb-8 animate-fade-in">
              Exquisite fragrances crafted with the finest ingredients to
              elevate your presence and leave a lasting impression.
            </p>
            <Link href="/products" className="group">
              <LearnMoreButton
                text="Shop Collection"
                className="w-64 [&_.button-text]:text-white"
              />
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-luxe-cream">
          <div className="luxury-container">
            <h2 className="text-3xl font-serif font-bold text-center mb-12">
              Our Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link
                href="/products?category=Men's Collection"
                className="group"
              >
                <div className="relative h-80 overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?ixlib=rb-4.0.3&auhref=format&fit=crop&w=600&q=80"
                    alt="Men's Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">
                      Men's Collection
                    </h3>
                    <button className="flex items-center bg-transparent text-white cursor-pointer font-bold text-sm uppercase border-0 outline-0 p-4 before:bg-white before:content-[''] before:inline-block before:h-[1px] before:mr-[10px] before:transition-all before:duration-[0.42s] before:ease-[cubic-bezier(.25,.8,.25,1)] before:w-0 group-hover:before:bg-white group-hover:before:w-12">
                      Explore Now
                    </button>
                  </div>
                </div>
              </Link>

              <Link
                href="/products?category=Women's Collection"
                className="group"
              >
                <div className="relative h-80 overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1499575026295-b114e3f40397?ixlib=rb-4.0.3&auhref=format&fit=crop&w=600&q=80"
                    alt="Women's Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">
                      Women's Collection
                    </h3>
                    <button className="flex items-center bg-transparent text-white cursor-pointer font-bold text-sm uppercase border-0 outline-0 p-4 before:bg-white before:content-[''] before:inline-block before:h-[1px] before:mr-[10px] before:transition-all before:duration-[0.42s] before:ease-[cubic-bezier(.25,.8,.25,1)] before:w-0 group-hover:before:bg-white group-hover:before:w-12">
                      Explore Now
                    </button>
                  </div>
                </div>
              </Link>

              <Link
                href="/products?category=Unisex Collection"
                className="group"
              >
                <div className="relative h-80 overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1595425964072-482730a1818c?ixlib=rb-4.0.3&auhref=format&fit=crop&w=600&q=80"
                    alt="Unisex Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">
                      Unisex Collection
                    </h3>
                    <button className="flex items-center bg-transparent text-white cursor-pointer font-bold text-sm uppercase border-0 outline-0 p-4 before:bg-white before:content-[''] before:inline-block before:h-[1px] before:mr-[10px] before:transition-all before:duration-[0.42s] before:ease-[cubic-bezier(.25,.8,.25,1)] before:w-0 group-hover:before:bg-white group-hover:before:w-12">
                      Explore Now
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="luxury-container">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-serif font-bold">
                Featured Fragrances
              </h2>
              <Link href="/products" className="text-luxe-blue hover:underline">
                View All
              </Link>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>

        {/* Testimonials/Story Section */}
        <section className="py-16 bg-luxe-blue text-white">
          <div className="luxury-container text-center">
            <h2 className="text-3xl font-poppins font-black mb-8 text-white">
              Our Story
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg mb-8">
                Aromé Luxe was born from a passion for exceptional fragrances
                and a desire to bring the world's finest scents to discerning
                customers. Our journey began with a simple belief: that a
                perfume is more than just a scent—it's an expression of
                personality, a memory in the making, and a finishing touch to
                any outfit.
              </p>
              <p className="text-lg mb-8">
                Each of our fragrances is carefully crafted using the highest
                quality ingredients sourced from around the globe. We work with
                master perfumers who blend traditional techniques with
                innovative approaches to create scents that are both timeless
                and contemporary.
              </p>
              <Link href="/about" className="group">
                <LearnMoreButton
                  text="Learn More About Us"
                  className="w-80 [&_.circle]:bg-white [&_.circle_.icon.arrow]:before:border-black [&_.button-text]:pl-8 [&_.button-text]:text-white [&_*]:group-hover:text-black"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gray-100">
          <div className="luxury-container text-center">
            <h2 className="text-3xl font-serif font-bold mb-3">
              Join Our Community
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new releases,
              and fragrance tips.
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 h-12">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-luxe-blue"
              />
              <Button className="bg-luxe-sandy h-full hover:bg-luxe-blue">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
