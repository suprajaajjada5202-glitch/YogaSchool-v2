"use client";
import { useId, useState } from "react";

/** A long testimonial: the opening paragraphs (about 320 characters), then the rest behind "Read the full story".
    A short leftover (e.g. a sign-off) is shown straight away rather than hidden. */
export function StoryText({ paragraphs }: { paragraphs: string[] }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  let shown = 0;
  for (let chars = 0; shown < paragraphs.length && chars < 320; shown++) chars += paragraphs[shown].length;
  if (paragraphs.slice(shown).join("").length < 160) shown = paragraphs.length;
  const rest = paragraphs.slice(shown);
  return (
    <div className="story__text">
      {paragraphs.slice(0, shown).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {rest.length > 0 && (
        <>
          <div id={id} hidden={!open}>
            {rest.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <button type="button" className="story__more" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)}>
            {open ? "Show less" : "Read the full story"}
          </button>
        </>
      )}
    </div>
  );
}
