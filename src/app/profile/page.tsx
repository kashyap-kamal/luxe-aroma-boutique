import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserProfile } from "@/components/auth/user-profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile | Aromé Luxe",
  description: "Manage your Aromé Luxe profile and preferences.",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-12">
        <div className="luxury-container">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Your Profile
            </h1>
            <UserProfile />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

