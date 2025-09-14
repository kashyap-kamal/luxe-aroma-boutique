import React from "react";
import { Shield, Truck, Award, Heart, Zap, Headphones } from "lucide-react";

const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premium Quality",
      description:
        "Handpicked fragrances from the world&apos;s finest perfumers with authentic ingredients and long-lasting scents.",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Free Shipping",
      description:
        "Enjoy complimentary shipping on all orders. Your favorite fragrances delivered right to your doorstep.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payment",
      description:
        "Shop with confidence using our secure payment gateway. Your financial information is always protected.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customer Love",
      description:
        "Join thousands of satisfied customers who trust Aromé Luxe for their fragrance needs.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Delivery",
      description:
        "Quick processing and fast delivery across India. Get your orders within 3-5 business days.",
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "24/7 Support",
      description:
        "Our dedicated customer support team is always ready to help you with any questions or concerns.",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="luxury-container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Why Choose Aromé Luxe?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We&apos;re committed to providing you with an exceptional fragrance
            shopping experience. Here&apos;s what makes us the perfect choice
            for your perfume needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-luxe-blue/10 text-luxe-blue rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-luxe-blue/5 to-purple-500/5 rounded-lg p-8">
            <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900">
              Your Satisfaction is Our Priority
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe that every customer deserves the best. That&apos;s why
              we go above and beyond to ensure you have a memorable shopping
              experience with us. From premium products to exceptional service,
              we&apos;re here to exceed your expectations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
