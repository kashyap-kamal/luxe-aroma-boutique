import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { AuthHeader } from "@/components/auth/auth-header";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Email | Aromé Luxe",
  description:
    "Verify your email address to complete your Aromé Luxe account registration.",
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader />
        <Suspense
          fallback={
            <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow p-6 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">
                Loading verification form...
              </p>
            </div>
          }
        >
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  );
}
