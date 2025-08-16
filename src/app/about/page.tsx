import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Award,
  Heart,
  Leaf,
  Star,
  Globe,
  Shield,
} from "lucide-react";

const About = () => {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1592945403244-b3faa74b2c9a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Aromé Luxe About"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        </div>
        <div className="relative h-full luxury-container flex flex-col justify-center items-start text-white">
          <div className="mb-4">
            <Link to="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 max-w-3xl animate-fade-in">
            Our Story
          </h1>
          <p className="text-xl max-w-2xl animate-fade-in">
            Crafting luxury fragrances with passion, precision, and the finest
            ingredients from around the world.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-luxe-cream">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-luxe-blue mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                At Aromé Luxe, we believe that fragrance is an art form—a
                delicate balance of science and creativity that has the power to
                transport, inspire, and transform. Our mission is to create
                exceptional fragrances that become an integral part of your
                personal story.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We source only the finest ingredients from renowned suppliers
                worldwide, working with master perfumers who bring decades of
                expertise to every blend. Each fragrance is crafted with
                meticulous attention to detail, ensuring a scent that is both
                distinctive and enduring.
              </p>
              <div className="flex items-center gap-4">
                <Award className="h-8 w-8 text-luxe-sandy" />
                <span className="text-lg font-medium text-luxe-blue">
                  Award-winning craftsmanship
                </span>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Luxury perfume making"
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="luxury-container">
          <h2 className="text-3xl font-serif font-bold text-center text-luxe-blue mb-16">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg hover:bg-luxe-cream transition-colors">
              <div className="w-16 h-16 bg-luxe-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-luxe-blue mb-3">
                Passion
              </h3>
              <p className="text-gray-600">
                We pour our heart into every fragrance, creating scents that
                inspire and delight.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-luxe-cream transition-colors">
              <div className="w-16 h-16 bg-luxe-sandy rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-luxe-blue mb-3">
                Quality
              </h3>
              <p className="text-gray-600">
                Only the finest ingredients make their way into our carefully
                crafted fragrances.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-luxe-cream transition-colors">
              <div className="w-16 h-16 bg-luxe-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-luxe-blue mb-3">
                Heritage
              </h3>
              <p className="text-gray-600">
                We honor traditional perfumery techniques while embracing modern
                innovation.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-luxe-cream transition-colors">
              <div className="w-16 h-16 bg-luxe-sandy rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-luxe-blue mb-3">
                Integrity
              </h3>
              <p className="text-gray-600">
                We maintain the highest standards of transparency and ethical
                practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-luxe-blue text-white">
        <div className="luxury-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1590736969955-71cc94901354?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Perfume ingredients"
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-white">
                The Aromé Luxe Journey
              </h2>
              <p className="text-lg mb-6 leading-relaxed">
                Founded in 2020, Aromé Luxe began as a dream to bring the
                world's most exquisite fragrances to discerning customers. What
                started as a small boutique has grown into a respected name in
                luxury perfumery, known for our commitment to quality and
                innovation.
              </p>
              <p className="text-lg mb-6 leading-relaxed">
                Our journey has taken us to the most prestigious fragrance
                houses in France, Italy, and beyond, where we've learned from
                master perfumers and discovered rare ingredients that form the
                foundation of our unique blends.
              </p>
              <p className="text-lg leading-relaxed">
                Today, we continue to push the boundaries of perfumery, creating
                fragrances that are not just scents, but experiences that evoke
                emotion and create lasting memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20">
        <div className="luxury-container">
          <h2 className="text-3xl font-serif font-bold text-center text-luxe-blue mb-16">
            The Art of Craftsmanship
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-luxe-cream rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-luxe-blue">1</span>
              </div>
              <h3 className="text-xl font-semibold text-luxe-blue mb-4">
                Sourcing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We travel the world to source the finest ingredients—from rare
                oud in the Middle East to precious jasmine in Grasse, France.
                Every ingredient is carefully selected for its quality and
                authenticity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-luxe-cream rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-luxe-blue">2</span>
              </div>
              <h3 className="text-xl font-semibold text-luxe-blue mb-4">
                Blending
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our master perfumers blend ingredients with precision, creating
                harmonious compositions that evolve beautifully on the skin.
                Each fragrance undergoes hundreds of iterations before reaching
                perfection.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-luxe-cream rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-luxe-blue">3</span>
              </div>
              <h3 className="text-xl font-semibold text-luxe-blue mb-4">
                Aging
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Like fine wine, our fragrances are aged to perfection. This
                crucial step allows the ingredients to meld together, creating
                depth and complexity that only time can achieve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-luxe-cream">
        <div className="luxury-container">
          <h2 className="text-3xl font-serif font-bold text-center text-luxe-blue mb-16">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Founder & Master Perfumer"
                className="w-48 h-48 object-cover rounded-full mx-auto mb-4 shadow-lg"
              />
              <h3 className="text-xl font-semibold text-luxe-blue mb-2">
                Alexandre Dubois
              </h3>
              <p className="text-luxe-sandy font-medium mb-3">
                Founder & Master Perfumer
              </p>
              <p className="text-gray-600 text-sm">
                With over 20 years of experience in luxury perfumery, Alexandre
                brings his passion for exceptional fragrances to every creation.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Creative Director"
                className="w-48 h-48 object-cover rounded-full mx-auto mb-4 shadow-lg"
              />
              <h3 className="text-xl font-semibold text-luxe-blue mb-2">
                Isabella Moreau
              </h3>
              <p className="text-luxe-sandy font-medium mb-3">
                Creative Director
              </p>
              <p className="text-gray-600 text-sm">
                Isabella's artistic vision and deep understanding of fragrance
                trends guide our creative direction and brand development.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Head of Operations"
                className="w-48 h-48 object-cover rounded-full mx-auto mb-4 shadow-lg"
              />
              <h3 className="text-xl font-semibold text-luxe-blue mb-2">
                Marcus Chen
              </h3>
              <p className="text-luxe-sandy font-medium mb-3">
                Head of Operations
              </p>
              <p className="text-gray-600 text-sm">
                Marcus ensures that every aspect of our business operates with
                the precision and excellence our customers expect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20">
        <div className="luxury-container">
          <h2 className="text-3xl font-serif font-bold text-center text-luxe-blue mb-16">
            Awards & Recognition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-luxe-cream rounded-lg">
              <Star className="h-12 w-12 text-luxe-sandy mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                Luxury Fragrance Award
              </h3>
              <p className="text-gray-600 text-sm">
                2024 - Best New Fragrance House
              </p>
            </div>

            <div className="text-center p-6 bg-luxe-cream rounded-lg">
              <Award className="h-12 w-12 text-luxe-sandy mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                Excellence in Craftsmanship
              </h3>
              <p className="text-gray-600 text-sm">
                2023 - International Perfumery Association
              </p>
            </div>

            <div className="text-center p-6 bg-luxe-cream rounded-lg">
              <Heart className="h-12 w-12 text-luxe-sandy mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                Customer Choice Award
              </h3>
              <p className="text-gray-600 text-sm">
                2023 - Luxury Retail Excellence
              </p>
            </div>

            <div className="text-center p-6 bg-luxe-cream rounded-lg">
              <Leaf className="h-12 w-12 text-luxe-sandy mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-luxe-blue mb-2">
                Sustainability Award
              </h3>
              <p className="text-gray-600 text-sm">
                2022 - Green Business Initiative
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-luxe-blue text-white">
        <div className="luxury-container text-center">
          <h2 className="text-3xl font-serif font-bold mb-6">
            Experience Aromé Luxe
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover our collection of luxury fragrances and find your signature
            scent. Each bottle tells a story of passion, craftsmanship, and
            timeless elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products">
              <Button className="bg-luxe-sandy hover:bg-luxe-blue text-white px-8 py-3 text-lg">
                Shop Collection
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-luxe-blue px-8 py-3 text-lg"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
