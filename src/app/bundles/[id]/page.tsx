import { notFound } from "next/navigation";
import { Metadata } from "next";
import { fetchBundles, fetchBundleById } from "@/lib/bundle-service";
import BundleDetailClient from "./bundle-detail-client";

const PLACEHOLDER_BUNDLE_ID = "_placeholder";

export async function generateStaticParams(): Promise<Array<{ id: string }>> {
  const bundles = await fetchBundles();
  if (bundles.length === 0) {
    return [{ id: PLACEHOLDER_BUNDLE_ID }];
  }
  return bundles.map((b) => ({ id: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (id === PLACEHOLDER_BUNDLE_ID) return { title: "Bundle Not Found" };
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
  if (id === PLACEHOLDER_BUNDLE_ID) notFound();
  const bundle = await fetchBundleById(id);

  if (!bundle) notFound();

  return <BundleDetailClient bundle={bundle} />;
}
