"use client";
import Link from "next/link";
import { useEffect } from "react";

/** Friendly fallback if a page fails to render. */
export default function SiteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <section className="page-hero" style={{ minHeight: "70vh" }}>
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <p className="eyebrow">Something went wrong</p>
        <h1>
          Let’s take a <em>breath</em> and try again
        </h1>
        <p className="lead">This page could not be loaded. Please try again, or call us on 0412 499 700.</p>
        <div className="page-hero__actions">
          <button type="button" className="btn btn--primary" onClick={reset}>
            Try again
          </button>
          <Link className="btn btn--outline" href="/pages/home">
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
