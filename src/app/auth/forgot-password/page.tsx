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
    <main
      className="flex-1 flex items-center justify-center px-5 py-12 md:py-20"
      style={{ background: "#F2EDE4", color: "#0E0E0C" }}
    >
      <div className="w-full max-w-[460px] space-y-5">
        <AuthHeader />
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
