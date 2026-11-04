import { SignInForm } from "@/components/auth/signin-form";
import { AuthHeader } from "@/components/auth/auth-header";
import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In | Aromé Luxe",
  description:
    "Sign in to your Aromé Luxe account to access exclusive fragrances and order history.",
};

export default function SignInPage() {
  return (
    <main
      className="flex-1 flex items-center justify-center px-5 py-12 md:py-20"
      style={{ background: "#F2EDE4", color: "#0E0E0C" }}
    >
      <div className="w-full max-w-[460px] space-y-5">
        <AuthHeader />
        <Suspense
          fallback={
            <div
              style={{
                border: "1px solid #0E0E0C",
                background: "#FAF7F2",
                padding: "48px 28px",
                textAlign: "center",
              }}
            >
              <Loader2 className="h-5 w-5 animate-spin mx-auto mb-3" style={{ color: "#E8763A" }} />
              <p
                style={{
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  opacity: 0.6,
                }}
              >
                LOADING...
              </p>
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
