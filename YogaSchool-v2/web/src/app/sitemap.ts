import type { MetadataRoute } from "next";
import { posts } from "@/data/posts";
import seoData from "@/data/seo.json";
import { SITE_URL } from "@/lib/site";

/* Every page + every blog article (articles at their original /blog/... URLs). */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = Object.values(seoData as Record<string, { path: string }>)
    .map((s) => s.path)
    .filter((p) => p !== "/pages/post" && !p.startsWith("/pages/blog-"))
    .map((p) => ({ url: SITE_URL + p, changeFrequency: "weekly" as const, priority: p === "/pages/home" ? 1 : 0.7 }));
  const articles = posts.map((p) => ({
    url: SITE_URL + p.path,
    lastModified: p.publishedAt,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));
  return [...pages, ...articles];
}
