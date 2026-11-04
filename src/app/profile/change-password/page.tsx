import { ProtectedRoute } from "@/components/auth/protected-route";
import { ChangePasswordForm } from "@/components/auth/change-password-form";
import { AuthHeader } from "@/components/auth/auth-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Password | Aromé Luxe",
  description: "Change your Aromé Luxe account password.",
};

export default function ChangePasswordPage() {
  return (
    <ProtectedRoute>
      <main
        className="flex-1 flex items-center justify-center px-5 py-12 md:py-20"
        style={{ background: "#F2EDE4", color: "#0E0E0C" }}
      >
        <div className="w-full max-w-[460px] space-y-5">
          <AuthHeader />
          <ChangePasswordForm />
        </div>
      </main>
    </ProtectedRoute>
  );
}
