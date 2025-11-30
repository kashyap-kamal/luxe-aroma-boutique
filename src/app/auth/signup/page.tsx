import { SignUpForm } from "@/components/auth/signup-form";
import { AuthHeader } from "@/components/auth/auth-header";
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
        <AuthHeader />
        <SignUpForm />
      </div>
    </div>
  );
}

