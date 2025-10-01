import { SignInForm } from "@/components/auth/signin-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Aromé Luxe",
  description:
    "Sign in to your Aromé Luxe account to access exclusive fragrances and personalized recommendations.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Aromé Luxe</h1>
          <p className="text-gray-600">Luxury Fragrances & Perfumes</p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}

