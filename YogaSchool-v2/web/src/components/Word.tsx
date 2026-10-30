import type { CSSProperties, ReactNode } from "react";

/** A heading word that rises out of a mask, n-th in line. For banners with .page-hero--motion (CSS: .gw in globals.css). */
export function Word({ n, children }: { n: number; children: ReactNode }) {
  return (
    <span className="gw">
      <span style={{ "--w": n } as CSSProperties}>{children}</span>
    </span>
  );
}
