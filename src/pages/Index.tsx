
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/product/ProductGrid';
import { products } from '@/utils/mockData';

const Index = () => {
  // Featured products (first 4)
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[70vh] min-h-[500px]">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1557673834-4a4e8c5b0ed6?q=80&w=2070&auto=format&fit=crop"
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
              Exquisite fragrances crafted with the finest ingredients to elevate your presence and leave a lasting impression.
            </p>
            <Button asChild size="lg" className="bg-luxe-gold text-luxe-black hover:bg-amber-500 animate-fade-in">
              <Link to="/products">Shop Collection</Link>
            </Button>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-luxe-cream">
          <div className="luxury-container">
            <h2 className="text-3xl font-serif font-bold text-center mb-12">Our Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/products?category=Men's Collection" className="group">
                <div className="relative h-80 overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Men's Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Men's Collection</h3>
                    <span className="inline-block bg-luxe-gold text-luxe-black px-4 py-2 rounded-full text-sm font-medium">
                      Explore Now
                    </span>
                  </div>
                </div>
              </Link>
              
              <Link to="/products?category=Women's Collection" className="group">
                <div className="relative h-80 overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1499575026295-b114e3f40397?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Women's Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Women's Collection</h3>
                    <span className="inline-block bg-luxe-gold text-luxe-black px-4 py-2 rounded-full text-sm font-medium">
                      Explore Now
                    </span>
                  </div>
                </div>
              </Link>
              
              <Link to="/products?category=Unisex Collection" className="group">
                <div className="relative h-80 overflow-hidden rounded-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1595425964072-482730a1818c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Unisex Collection"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Unisex Collection</h3>
                    <span className="inline-block bg-luxe-gold text-luxe-black px-4 py-2 rounded-full text-sm font-medium">
                      Explore Now
                    </span>
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
              <h2 className="text-3xl font-serif font-bold">Featured Fragrances</h2>
              <Link to="/products" className="text-luxe-purple hover:underline">
                View All
              </Link>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>

        {/* Testimonials/Story Section */}
        <section className="py-16 bg-luxe-purple text-white">
          <div className="luxury-container text-center">
            <h2 className="text-3xl font-serif font-bold mb-8">Our Story</h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg mb-8">
                Aromé Luxe was born from a passion for exceptional fragrances and a desire to bring the world's finest scents to discerning customers. Our journey began with a simple belief: that a perfume is more than just a scent—it's an expression of personality, a memory in the making, and a finishing touch to any outfit.
              </p>
              <p className="text-lg mb-8">
                Each of our fragrances is carefully crafted using the highest quality ingredients sourced from around the globe. We work with master perfumers who blend traditional techniques with innovative approaches to create scents that are both timeless and contemporary.
              </p>
              <Button asChild variant="outline" className="border-luxe-gold text-luxe-gold hover:bg-luxe-gold hover:text-luxe-black">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gray-100">
          <div className="luxury-container text-center">
            <h2 className="text-3xl font-serif font-bold mb-3">Join Our Community</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive offers, new releases, and fragrance tips.
            </p>
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-luxe-purple"
              />
              <Button className="bg-luxe-purple hover:bg-luxe-darkPurple">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
