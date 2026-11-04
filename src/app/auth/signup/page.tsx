import { SignUpForm } from "@/components/auth/signup-form";
import { AuthHeader } from "@/components/auth/auth-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | Aromé Luxe",
  description:
    "Create your Aromé Luxe account to discover luxury fragrances and track your orders.",
};

export default function SignUpPage() {
  return (
    <main
      className="flex-1 flex items-center justify-center px-5 py-12 md:py-20"
      style={{ background: "#F2EDE4", color: "#0E0E0C" }}
    >
      <div className="w-full max-w-[460px] space-y-5">
        <AuthHeader />
        <SignUpForm />
      </div>
    </main>
  );
}
