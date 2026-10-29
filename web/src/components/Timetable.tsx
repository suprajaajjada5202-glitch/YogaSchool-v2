"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { TimetableRow } from "@/lib/types";
import { Reveal } from "./Reveal";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const time = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")}${h < 12 ? "am" : "pm"}`;
};
/** Today in Cairns (Mon = 0) */
const todayIndex = () => (new Date(new Date().toLocaleString("en-US", { timeZone: "Australia/Brisbane" })).getDay() + 6) % 7;

/** Weekly timetable with a tab per day. Renders nothing until classes are published in Supabase. */
export function Timetable({ rows }: { rows: TimetableRow[] }) {
  const [day, setDay] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => setDay(todayIndex()), []);
  if (!rows.length) return null;

  const byDay = DAYS.map((_, i) => rows.filter((r) => r.day === i + 1));
  const select = (i: number, focus = false) => {
    setDay(i);
    if (focus) tabs.current[i]?.focus();
  };

  return (
    <>
      <div>
        <Reveal className="tt">
          <div className="tt__tabs" role="tablist" aria-label="Day of the week">
            {DAYS.map((d, i) => (
              <button
                key={d}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tt-tab-${i}`}
                aria-controls={`tt-panel-${i}`}
                aria-selected={i === day}
                tabIndex={i === day ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") {
                    e.preventDefault();
                    select((i + 1) % 7, true);
                  }
                  if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    select((i + 6) % 7, true);
                  }
                }}
              >
                <span>{d.slice(0, 3)}</span>
                <small>{byDay[i].length ? `${byDay[i].length} class${byDay[i].length > 1 ? "es" : ""}` : "No classes"}</small>
              </button>
            ))}
          </div>
          {DAYS.map((d, i) => (
            <div
              className="tt__panel"
              role="tabpanel"
              id={`tt-panel-${i}`}
              aria-labelledby={`tt-tab-${i}`}
              hidden={i !== day}
              key={d}
            >
              <h3 className="tt__day">{d}</h3>
              {byDay[i].length ? (
                <ul>
                  {byDay[i].map((r) => (
                    <li className="tt__row" key={r.id}>
                      <p className="tt__time">
                        {time(r.start)}
                        {r.end && <span>– {time(r.end)}</span>}
                      </p>
                      <div className="tt__info">
                        <h3>
                          {r.classSlug ? <Link href={`/pages/classes#class-${r.classSlug}`}>{r.className}</Link> : r.className}
                        </h3>
                        <p>{[r.teacher, r.level].filter(Boolean).join(" · ")}</p>
                        {r.notes && <p className="tt__note">{r.notes}</p>}
                      </div>
                      {r.bookUrl ? (
                        <a className="btn btn--teal btn--sm" href={r.bookUrl} target="_blank" rel="noopener">
                          Book
                        </a>
                      ) : (
                        <a className="btn btn--teal btn--sm" href="#book">
                          Book
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="tt__empty">No classes on {d}. Check another day.</p>
              )}
            </div>
          ))}
        </Reveal>
      </div>
      <Reveal as="h2" className="book-head">
        Book online
      </Reveal>
    </>
  );
}
