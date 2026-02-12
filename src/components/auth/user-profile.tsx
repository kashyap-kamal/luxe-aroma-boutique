"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, Calendar, Shield, Lock, ShoppingBag } from "lucide-react";

export function UserProfile() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleChangePassword = () => {
    router.push("/profile/change-password");
  };

  if (!isAuthenticated || !user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Please sign in to view your profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  const userInitials =
    user.user_metadata?.full_name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={user.user_metadata?.avatar_url || ""}
                alt={user.user_metadata?.full_name || user.email || ""}
              />
              <AvatarFallback className="text-lg">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">
                {user.user_metadata?.full_name || user.email || "User"}
              </CardTitle>
              <CardDescription className="text-base">
                {user.email}
              </CardDescription>
              <Badge variant="secondary" className="mt-2">
                <Shield className="w-3 h-3 mr-1" />
                Verified Member
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <p className="text-sm">
                {user.user_metadata?.full_name || "Not provided"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email Address
              </label>
              <p className="text-sm flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                {user.email}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Member Since
              </label>
              <p className="text-sm flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleChangePassword}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Password
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => router.push("/orders")}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              View Orders
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
