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
    <main
      className="flex-1 flex items-center justify-center px-5 py-12 md:py-20"
      style={{ background: "#F2EDE4", color: "#0E0E0C" }}
    >
      <div className="w-full max-w-[460px] space-y-5">
        <AuthHeader />
        <ResetPasswordForm />
      </div>
    </main>
  );
}
