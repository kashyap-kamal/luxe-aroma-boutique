"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchBundleById, Bundle } from "@/lib/bundle-service";
import BundleDetailClient from "../[id]/bundle-detail-client";
import Loading from "@/components/ui/loading";

function BundleDetailFallbackContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetchBundleById(id)
      .then(setBundle)
      .catch(() => setBundle(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <Loading text="Loading bundle..." className="py-24 min-h-[60vh]" />;
  }

  if (!id || !bundle) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-lg font-serif">Bundle not found</p>
        <Link href="/products" className="underline text-sm">
          Back to collection
        </Link>
      </main>
    );
  }

  return <BundleDetailClient bundle={bundle} />;
}

export default function BundleDetailFallbackPage(): React.JSX.Element {
  return (
    <Suspense
      fallback={<Loading text="Loading bundle..." className="py-24 min-h-[60vh]" />}
    >
      <BundleDetailFallbackContent />
    </Suspense>
  );
}
