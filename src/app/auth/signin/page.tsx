import { SignInForm } from "@/components/auth/signin-form";
import { AuthHeader } from "@/components/auth/auth-header";
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
        <AuthHeader />
        <SignInForm />
      </div>
    </div>
  );
}

