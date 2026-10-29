import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PassesDesigns } from "@/components/PassesDesigns";
import { getPasses } from "@/lib/data";
import "./passes-designs.css";

/* TEMPORARY /pages/passes-designs: three alternative designs for the Pricing page passes section.
   Only on the local dev site (404 on the live site). Delete this folder and components/PassesDesigns.tsx
   once a design is chosen. */
export const metadata: Metadata = { title: "Passes design options", robots: { index: false, follow: false } };

export default async function PassesDesignsPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <PassesDesigns groups={await getPasses()} />;
}
