import Link from "next/link";
import type { ReactNode } from "react";
import type { Img } from "@/lib/types";
import { Reveal } from "./Reveal";

const BLOB = "M421 316Q387 382 323 413T187 427Q121 381 92 309T79 166Q113 93 186 66T331 74Q402 113 428 181T421 316Z";

/** Inner-page header without the arch layout (same photo banner as the other page heroes). image: the banner photo;
    without one, the default studio photo set on .page-hero in globals.css. */
export function SimpleHero({
  crumb,
  eyebrow,
  title,
  lead,
  image,
  className,
  children,
}: {
  crumb: string;
  eyebrow: string;
  title: ReactNode;
  lead: string;
  image?: Img;
  /** Extra class for the banner, e.g. page-hero--motion */
  className?: string;
  children?: ReactNode;
}) {
  return (
    <section className={`page-hero${className ? ` ${className}` : ""}`} style={{ paddingBottom: "var(--s-6)" }}>
      {image && (
        <div className="arch__frame">
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} decoding="async" />
        </div>
      )}
      <svg className="blob blob--a" viewBox="0 0 500 500" aria-hidden="true">
        <path fill="currentColor" d={BLOB} />
      </svg>
      <Reveal className="container article" style={{ position: "relative", zIndex: 1 }}>
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link href="/pages/home">Home</Link>
            </li>
            <li aria-current="page">{crumb}</li>
          </ol>
        </nav>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        {children}
      </Reveal>
    </section>
  );
}
