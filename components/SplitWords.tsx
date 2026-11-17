import type { CSSProperties } from "react";

/** Headline text split into words for a staggered reveal: each word sits in a mask (.sw) and its inner span rises
    out of it, offset by its place in the line (--w). `start` continues the count across several pieces of one line. */
export function SplitWords({ text, start = 0 }: { text: string; start?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="sw" style={{ "--w": start + i } as CSSProperties}>
            <span>{w}</span>
          </span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </>
  );
}
