import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthHeader } from "@/components/auth/auth-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Aromé Luxe",
  description:
    "Reset your Aromé Luxe account password. Enter your new password to complete the reset process.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader />
        <ResetPasswordForm />
      </div>
    </div>
  );
}





