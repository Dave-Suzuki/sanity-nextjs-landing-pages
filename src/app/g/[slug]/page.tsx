import type { Metadata } from "next";
import { GuideViewer } from "@/components/guide/GuideViewer";
import { SAMPLE_GUIDE } from "@/lib/sample-data";
import { notFound } from "next/navigation";

// For now, use sample data. Later, fetch from Supabase.
function getGuideBySlug(slug: string) {
  if (slug === SAMPLE_GUIDE.slug) return SAMPLE_GUIDE;
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };

  return {
    title: `${guide.title} — Machikado`,
    description: guide.subtitle || `Travel guide for ${guide.title}`,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) notFound();

  return <GuideViewer guide={guide} />;
}
