/** The Om tile in a corner of a home-page section: it turns in as the section scrolls on screen, then floats with
    soft rings breathing out around it (CSS: .om-corner in globals.css). Decorative, so hidden from screen readers. */
export function OmCorner({ side = "right" }: { side?: "left" | "right" }) {
  return (
    <span className={`om-corner om-corner--${side}`} aria-hidden="true">
      <img src="/images/om.png" alt="" width={100} height={95} loading="lazy" decoding="async" />
    </span>
  );
}
