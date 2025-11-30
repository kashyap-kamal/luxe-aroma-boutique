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
      {/* pt-28 accounts for fixed navbar height */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <AuthHeader />
          <ChangePasswordForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}

