import type { Metadata } from "next";
import seoData from "@/data/seo.json";
import { SITE_URL } from "./site";

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  canonical: string;
  ogType: string;
  ogImage: string;
  headerLight: boolean;
  momence: boolean;
  jsonLd: Record<string, unknown>[];
};

const SEO = seoData as Record<string, PageSeo>;

export function seo(key: string): PageSeo {
  const s = SEO[key];
  if (!s) throw new Error(`No SEO entry for page "${key}"`);
  return s;
}

/** Next.js metadata for a page (title, description, canonical live URL, Open Graph). */
export function pageMetadata(
  key: string,
  override?: { title?: string; description?: string; image?: string; path?: string },
): Metadata {
  const s = seo(key);
  const title = override?.title ?? s.title;
  const description = override?.description ?? s.description;
  const url = SITE_URL + (override?.path ?? s.path);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: s.ogType === "article" ? "article" : "website",
      siteName: "The Yoga School Cairns",
      locale: "en_AU",
      url,
      title,
      description,
      images: [override?.image ?? s.ogImage],
    },
    twitter: { card: "summary_large_image" },
  };
}

/** Metadata for a blog article at its own URL. */
export function articleMetadata(
  post: { title: string; excerpt: string; image: { src: string } | null; publishedAt?: string; author: string },
  path: string,
): Metadata {
  const url = SITE_URL + path;
  const title = `${post.title} | The Yoga School Blog`;
  return {
    title: { absolute: title },
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "The Yoga School Cairns",
      locale: "en_AU",
      url,
      title,
      description: post.excerpt,
      images: post.image ? [post.image.src] : [seo("blog1").ogImage],
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: { card: "summary_large_image" },
  };
}
