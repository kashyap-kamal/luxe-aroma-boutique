import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthHeader } from "@/components/auth/auth-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Aromé Luxe",
  description:
    "Reset your Aromé Luxe account password. Enter your email to receive a password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader />
        <ForgotPasswordForm />
      </div>
    </div>
  );
}





