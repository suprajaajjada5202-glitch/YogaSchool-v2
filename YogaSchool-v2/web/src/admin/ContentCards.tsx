"use client";
import type { CSSProperties } from "react";
import { TZ, type ContentType, type Row } from "./config";
import { Icon } from "./Icon";

const EDIT_ICON = "M4 20h4L19 9l-4-4L4 16v4ZM14 6l4 4";
const COPY_ICON = "M9 9h11v11H9zM5 15V4h11";

const dateParts = (iso: unknown) => {
  if (!iso) return null;
  const d = new Date(String(iso));
  if (Number.isNaN(d.getTime())) return null;
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-AU", { timeZone: TZ, ...o }).format(d);
  return { day: f({ day: "numeric" }), month: f({ month: "short" }), weekday: f({ weekday: "short" }) };
};

/** Content as a grid of cards (photo, title, key facts, live switch, edit / duplicate). Same rows and actions as the
    list; the card's look comes from the type's `card` settings in config.ts. */
export function ContentCards({
  table,
  type,
  rows,
  onEdit,
  onDuplicate,
  onToggle,
}: {
  table: string;
  type: ContentType;
  rows: Row[];
  onEdit: (r: Row) => void;
  onDuplicate: (r: Row) => void;
  onToggle: (r: Row) => void;
}) {
  const card = type.card!;
  const groups: [string, Row[]][] = [];
  for (const r of rows) {
    const g = card.group?.(r) ?? "";
    const found = groups.find(([k]) => k === g);
    if (found) found[1].push(r);
    else groups.push([g, [r]]);
  }
  let n = 0; // running index for the entrance stagger

  return (
    <div className="a-cards-groups">
      {groups.map(([g, list]) => (
        <section key={g || "all"} className="a-cards-group" aria-label={g || type.title}>
          {g && (
            <h2 className="a-cards-group__head">
              {g}
              <span>{list.length}</span>
            </h2>
          )}
          <ul className={`a-cards a-cards--${table}`}>
            {list.map((r) => {
              const title = card.title(r) || "Untitled";
              const image = type.thumb ? String(r[type.thumb] ?? "") : "";
              const date = dateParts(card.date?.(r));
              const meta = (card.meta?.(r) ?? []).filter(Boolean);
              const value = card.value?.(r);
              const tag = card.tag?.(r);
              const text = card.text?.(r).split(/\n\s*\n/)[0];
              return (
                <li
                  key={r.id}
                  className={`a-ccard${r.published ? "" : " is-hidden"}`}
                  style={{ "--r": Math.min(n++, 20) } as CSSProperties}
                >
                  {type.thumb && (
                    <div
                      className="a-ccard__media"
                      style={image ? ({ "--a-img": `url(${JSON.stringify(image)})` } as CSSProperties) : undefined}
                    >
                      <Icon name={table} />
                      {image && (
                        <img
                          src={image}
                          alt=""
                          loading="lazy"
                          // A missing or broken image shows the section icon instead of an empty box
                          onError={(e) => {
                            e.currentTarget.parentElement?.style.removeProperty("--a-img");
                            e.currentTarget.remove();
                          }}
                        />
                      )}
                      {date && (
                        <span className="a-ccard__date">
                          <small>{date.month}</small>
                          <b>{date.day}</b>
                          <small>{date.weekday}</small>
                        </span>
                      )}
                      {tag && <span className="a-ccard__tag">{tag}</span>}
                    </div>
                  )}
                  <div className="a-ccard__body">
                    <div className="a-ccard__top">
                      {card.kicker?.(r) && <p className="a-ccard__kicker">{card.kicker(r)}</p>}
                      {!type.thumb && tag && <span className="a-ccard__tag a-ccard__tag--inline">{tag}</span>}
                    </div>
                    <h3>
                      <button type="button" className="a-ccard__title" onClick={() => onEdit(r)}>
                        {title}
                      </button>
                    </h3>
                    {value && (
                      <p className="a-ccard__value">
                        <b>{value}</b>
                        {card.sub?.(r) && <small>{card.sub(r)}</small>}
                      </p>
                    )}
                    {text && <p className="a-ccard__text">{text}</p>}
                    {!!meta.length && (
                      <ul className="a-ccard__meta">
                        {meta.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    )}
                    <div className="a-ccard__foot">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={Boolean(r.published)}
                        aria-label={`Show ${title} on the website`}
                        className="a-switch a-switch--sm"
                        onClick={() => onToggle(r)}
                      >
                        <span />
                      </button>
                      <span className="a-slot__state">{r.published ? "Live" : "Hidden"}</span>
                      <span className="a-slot__acts">
                        <button type="button" className="a-cardbtn" onClick={() => onEdit(r)} aria-label={`Edit ${title}`} title="Edit">
                          <Icon path={EDIT_ICON} />
                        </button>
                        <button
                          type="button"
                          className="a-cardbtn"
                          onClick={() => onDuplicate(r)}
                          aria-label={`Duplicate ${title}`}
                          title="Duplicate"
                        >
                          <Icon path={COPY_ICON} />
                        </button>
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
