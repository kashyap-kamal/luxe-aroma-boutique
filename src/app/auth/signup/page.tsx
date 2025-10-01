import { SignUpForm } from "@/components/auth/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Aromé Luxe",
  description:
    "Create your Aromé Luxe account to discover luxury fragrances and enjoy personalized shopping experiences.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Aromé Luxe</h1>
          <p className="text-gray-600">Luxury Fragrances & Perfumes</p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}

