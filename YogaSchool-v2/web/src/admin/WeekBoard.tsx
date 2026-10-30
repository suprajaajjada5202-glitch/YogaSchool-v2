"use client";
import type { CSSProperties } from "react";
import { DAYS, TZ, hhmm, type Row } from "./config";
import { Icon } from "./Icon";

const EDIT_ICON = "M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4";
const COPY_ICON = "M9 9h11v11H9zM5 15V4h11";
const PLUS_ICON = "M12 5v14M5 12h14";

const minutes = (t: unknown) => {
  const [h, m] = hhmm(t).split(":").map(Number);
  return Number.isFinite(h) ? h * 60 + (m || 0) : null;
};
/** Morning, afternoon or evening: each gets its own accent colour on the card */
const partOfDay = (start: number | null) => (start === null ? "any" : start < 12 * 60 ? "am" : start < 17 * 60 ? "pm" : "eve");
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");

/** Timetable as a week board: a column per day, a card per class time, with the same live switch / edit / duplicate
    as the list. Rows arrive already filtered and sorted by day then start time. */
export function WeekBoard({
  rows,
  onEdit,
  onDuplicate,
  onToggle,
  onAdd,
}: {
  rows: Row[];
  onEdit: (r: Row) => void;
  onDuplicate: (r: Row) => void;
  onToggle: (r: Row) => void;
  onAdd: (day: number) => void;
}) {
  const today = DAYS.indexOf(new Intl.DateTimeFormat("en-AU", { timeZone: TZ, weekday: "long" }).format(new Date())) + 1;
  const days = DAYS.map((name, i) => ({ day: i + 1, name, rows: rows.filter((r) => Number(r.day_of_week) === i + 1) }));
  const unscheduled = rows.filter((r) => !(Number(r.day_of_week) >= 1 && Number(r.day_of_week) <= 7));
  let n = 0; // running index for the entrance stagger

  return (
    <div className="a-week" role="list" aria-label="Week timetable">
      {[...days, ...(unscheduled.length ? [{ day: 0, name: "No day set", rows: unscheduled }] : [])].map((d) => (
        <section
          key={d.day}
          className={`a-day${d.day === today ? " is-today" : ""}`}
          role="listitem"
          aria-label={`${d.name}, ${d.rows.length} ${d.rows.length === 1 ? "class" : "classes"}`}
        >
          <header className="a-day__head">
            <span className="a-day__name">
              <b>{d.name.slice(0, 3)}</b>
              <span>{d.name.slice(3)}</span>
            </span>
            {d.day === today && <span className="a-day__today">Today</span>}
            <span className="a-day__count">{d.rows.length}</span>
          </header>
          <div className="a-day__list">
            {d.rows.map((r) => {
              const start = minutes(r.start_time);
              const end = minutes(r.end_time);
              const length = start !== null && end !== null && end > start ? end - start : null;
              const teacher = String(r.teacher ?? "");
              return (
                <article
                  key={r.id}
                  className={`a-slot${r.published ? "" : " is-hidden"}`}
                  data-tod={partOfDay(start)}
                  style={{ "--r": Math.min(n++, 20) } as CSSProperties}
                >
                  <div className="a-slot__time">
                    <span>
                      <b>{hhmm(r.start_time) || "—"}</b>
                      {r.end_time ? <small>–{hhmm(r.end_time)}</small> : null}
                    </span>
                    {length && <em>{length} min</em>}
                  </div>
                  <button type="button" className="a-slot__name" onClick={() => onEdit(r)}>
                    {String(r.class_name ?? "") || "Untitled class"}
                  </button>
                  {teacher && (
                    <p className="a-slot__teacher">
                      <span aria-hidden="true">{initials(teacher)}</span>
                      {teacher}
                    </p>
                  )}
                  <div className="a-slot__foot">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(r.published)}
                      aria-label={`Show ${String(r.class_name ?? "this class")} on the website`}
                      className="a-switch a-switch--sm"
                      onClick={() => onToggle(r)}
                    >
                      <span />
                    </button>
                    <span className="a-slot__state">{r.published ? "Live" : "Hidden"}</span>
                    <span className="a-slot__acts">
                      <button type="button" className="a-cardbtn" onClick={() => onEdit(r)} aria-label="Edit" title="Edit">
                        <Icon path={EDIT_ICON} />
                      </button>
                      <button type="button" className="a-cardbtn" onClick={() => onDuplicate(r)} aria-label="Duplicate" title="Duplicate">
                        <Icon path={COPY_ICON} />
                      </button>
                    </span>
                  </div>
                </article>
              );
            })}
            {!d.rows.length && <p className="a-day__empty">No classes</p>}
            {d.day > 0 && (
              <button type="button" className="a-day__add" onClick={() => onAdd(d.day)}>
                <Icon path={PLUS_ICON} />
                Add to {d.name}
              </button>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
