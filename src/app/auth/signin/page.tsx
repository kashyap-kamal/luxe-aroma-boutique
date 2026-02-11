import { SignInForm } from "@/components/auth/signin-form";
import { AuthHeader } from "@/components/auth/auth-header";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In | Aromé Luxe",
  description:
    "Sign in to your Aromé Luxe account to access exclusive fragrances and personalized recommendations.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader />
        <Suspense
          fallback={
            <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading sign in form...</p>
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
