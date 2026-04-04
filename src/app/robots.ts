import { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://aromeluxe.in";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/auth/", "/checkout/", "/order-success/", "/profile/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
