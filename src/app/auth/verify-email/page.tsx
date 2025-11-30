import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { AuthHeader } from "@/components/auth/auth-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email | Aromé Luxe",
  description:
    "Verify your email address to complete your Aromé Luxe account registration.",
};

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader />
        <VerifyEmailForm />
      </div>
    </div>
  );
}

