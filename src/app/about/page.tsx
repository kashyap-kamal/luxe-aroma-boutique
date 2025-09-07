import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Leaf, Globe, Shield, User } from "lucide-react";
import Image from "next/image";

const About = () => {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src="/assets/about-us/about-us.jpeg"
            alt="Aromé Luxe About"
            className="w-full h-full object-cover object-bottom"
            width={1280}
            height={640}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent"></div>
        </div>
        <div className="relative h-full luxury-container flex flex-col justify-center items-start text-white">
          <div className="mb-4">
            <Link href="/">
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white/20 border-white/40 text-white hover:bg-white/30 hover:border-white/60 backdrop-blur-sm"
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
              {/* <div className="flex items-center gap-4">
               */}
            </div>
            <div className="relative">
              <Image
                src="/assets/about-us/our-mission.jpeg"
                alt="Luxury perfume making"
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
                width={500}
                height={500}
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
              <h3 className="text-xl font-semibold text-black mb-3">Passion</h3>
              <p className="text-gray-600">
                We pour our heart into every fragrance, creating scents that
                inspire and delight.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-luxe-cream transition-colors">
              <div className="w-16 h-16 bg-luxe-sandy rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">Quality</h3>
              <p className="text-gray-600">
                Only the finest ingredients make their way into our carefully
                crafted fragrances.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg hover:bg-luxe-cream transition-colors">
              <div className="w-16 h-16 bg-luxe-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-3">
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
              <h3 className="text-xl font-semibold text-black mb-3">
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
              <Image
                src="/assets/about-us/ingredients.jpeg"
                alt="Perfume ingredients"
                className="w-full h-96 object-cover rounded-lg shadow-2xl"
                width={550}
                height={350}
              />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6 text-white">
                The Aromé Luxe Journey
              </h2>
              <p className="text-lg mb-6 leading-relaxed">
                Growing up in an Indian household, I was surrounded by a
                symphony of scents that shaped my earliest memories. From the
                intoxicating aroma of jasmine garlands that my grandmother wore
                to the earthy fragrance of sandalwood incense burning in our
                prayer room, every corner of our home told a story through
                scent.
              </p>
              <p className="text-lg mb-6 leading-relaxed">
                As a child, I was both fascinated and critical of the world of
                fragrances. I would spend hours in our spice cabinet, inhaling
                the complex layers of cardamom, cinnamon, and cloves, while
                simultaneously being repelled by the harsh chemical odors that
                seemed to permeate so many commercial products. This early
                obsession with authentic, natural scents became the foundation
                of my journey into perfumery.
              </p>
              <p className="text-lg leading-relaxed">
                Today, Aromé Luxe represents my deep-rooted love for fragrances
                that tell authentic stories. We blend the traditional wisdom of
                Indian perfumery with modern techniques, creating scents that
                honor both heritage and innovation—fragrances that would have
                made my grandmother proud and that speak to the discerning nose
                of today&apos;s luxury connoisseur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20">
        <div className="luxury-container">
          <h2 className="text-3xl font-serif font-bold text-center text-black mb-16">
            The Art of Craftsmanship
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-luxe-cream rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">
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
                <span className="text-3xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">
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
                <span className="text-3xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Aging</h3>
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
          <h2 className="text-3xl font-serif font-bold text-center text-black mb-16">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-48 h-48 bg-luxe-cream rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="h-24 w-24 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Kamal Kashyap
              </h3>
              <p className="text-luxe-sandy font-medium mb-3">
                Founder & Master Perfumer
              </p>
              <p className="text-gray-600 text-sm">
                The visionary behind Aromé Luxe, Kamal is the master craftsman
                who creates our exquisite fragrances with decades of expertise
                in perfumery.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 bg-luxe-cream rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="h-24 w-24 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Ayush Paharia
              </h3>
              <p className="text-luxe-sandy font-medium mb-3">Web Developer</p>
              <p className="text-gray-600 text-sm">
                Kamal&apos;s nephew who brings our digital vision to life,
                crafting the online experience that showcases our luxury
                fragrances to the world.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 bg-luxe-cream rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="h-24 w-24 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Amol Paharia
              </h3>
              <p className="text-luxe-sandy font-medium mb-3">
                Operations Support
              </p>
              <p className="text-gray-600 text-sm">
                Ayush&apos;s brother and another nephew of Kamal, Amol handles
                all the day-to-day operations that keep Aromé Luxe running
                smoothly.
              </p>
            </div>

            <div className="text-center">
              <div className="w-48 h-48 bg-luxe-cream rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <User className="h-24 w-24 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Moksh Kashyap
              </h3>
              <p className="text-luxe-sandy font-medium mb-3">
                Fragrance Specialist
              </p>
              <p className="text-gray-600 text-sm">
                Kamal&apos;s son and brother to Ayush and Amol, Moksh originally
                started working with scents on a personal basis and brings that
                intimate knowledge to our team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      {/* <section className="py-20">
        <div className="luxury-container">
          <h2 className="text-3xl font-serif font-bold text-center text-black mb-16">
            Awards & Recognition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-luxe-cream rounded-lg">
              <Star className="h-12 w-12 text-luxe-sandy mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">
                Luxury Fragrance Award
              </h3>
              <p className="text-gray-600 text-sm">
                2024 - Best New Fragrance House
              </p>
            </div>

            <div className="text-center p-6 bg-luxe-cream rounded-lg">
              <Award className="h-12 w-12 text-luxe-sandy mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">
                Excellence in Craftsmanship
              </h3>
              <p className="text-gray-600 text-sm">
                2023 - International Perfumery Association
              </p>
            </div>

            <div className="text-center p-6 bg-luxe-cream rounded-lg">
              <Heart className="h-12 w-12 text-luxe-sandy mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">
                Customer Choice Award
              </h3>
              <p className="text-gray-600 text-sm">
                2023 - Luxury Retail Excellence
              </p>
            </div>

            <div className="text-center p-6 bg-luxe-cream rounded-lg">
              <Leaf className="h-12 w-12 text-luxe-sandy mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">
                Sustainability Award
              </h3>
              <p className="text-gray-600 text-sm">
                2022 - Green Business Initiative
              </p>
            </div>
          </div>
        </div>
      </section> */}

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
            <Link href="/products">
              <Button
                variant="default"
                className="bg-white text-black hover:bg-white hover:-translate-y-1 font-semibold px-8 py-3 text-lg relative "
              >
                Shop Collection
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="border-white text-white bg-transparent hover:-translate-y-1  hover:bg-transparent hover:text-white px-8 py-3 text-lg"
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
