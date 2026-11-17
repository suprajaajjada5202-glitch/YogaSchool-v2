// One wave crest-to-crest is 176 units wide, so drifting a layer by exactly that much loops without a jump
const WAVE = "M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z";

/** Divider into a tinted section: three navy waves drift behind the light front wave (CSS: .wave). */
export function Wave() {
  return (
    <svg className="wave" viewBox="0 24 150 28" preserveAspectRatio="none" aria-hidden="true">
      <g className="wave__layer">
        <path d={WAVE} />
      </g>
      <g className="wave__layer" transform="translate(0 2)">
        <path d={WAVE} />
      </g>
      <g className="wave__layer" transform="translate(0 4)">
        <path d={WAVE} />
      </g>
      <g className="wave__front" transform="translate(0 6)">
        <path d={WAVE} />
      </g>
    </svg>
  );
}
