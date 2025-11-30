"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Auth Header Component
 * Displays the logo and tagline on auth pages
 * Uses dark logo since auth pages have light backgrounds
 */
export function AuthHeader() {
  return (
    <div className="text-center">
      <Link href="/" className="inline-block">
        <Image
          src="/assets/arome-luxe-logo.png"
          alt="Aromé Luxe"
          width={180}
          height={60}
          className="h-auto max-h-14 w-auto object-contain mx-auto"
          priority
        />
      </Link>
      <p className="text-gray-600 mt-2">Luxury Fragrances & Perfumes</p>
    </div>
  );
}

