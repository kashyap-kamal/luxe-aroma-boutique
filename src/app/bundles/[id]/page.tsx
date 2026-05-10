import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchBundles, fetchBundleById } from "@/lib/bundle-service";
import BundleDetailClient from "./bundle-detail-client";

export async function generateStaticParams() {
  const bundles = await fetchBundles();
  return bundles.map((b) => ({ id: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const bundle = await fetchBundleById(id);
  if (!bundle) return { title: "Bundle Not Found" };
  return {
    title: `${bundle.name} | Aromé Luxe`,
    description: bundle.short_description ?? bundle.description ?? undefined,
  };
}

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bundle = await fetchBundleById(id);

  if (!bundle) notFound();

  return <BundleDetailClient bundle={bundle} />;
}
