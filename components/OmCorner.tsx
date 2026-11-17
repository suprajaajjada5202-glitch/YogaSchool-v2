/** The Om mark on its own in a corner of a home-page section (the same mark and size as the section labels' Om): it
    turns in as the section scrolls on screen, then floats gently (CSS: .om-corner in globals.css). Decorative, so
    hidden from screen readers. */
export function OmCorner({ side = "right" }: { side?: "left" | "right" }) {
  return <span className={`om-corner om-corner--${side}`} aria-hidden="true" />;
}
