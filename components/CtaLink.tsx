import Link from "next/link";
import type { ReactNode } from "react";

/** Internal paths use next/link; external URLs open in a new tab. */
export function CtaLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }
  return (
    <a className={className} href={href} target="_blank" rel="noopener">
      {children}
    </a>
  );
}
