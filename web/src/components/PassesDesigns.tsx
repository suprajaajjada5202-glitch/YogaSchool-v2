"use client";
/* TEMPORARY: three alternative designs for the Pricing page passes section, shown on the local-only preview page
   app/(site)/pages/passes-designs. Delete this file (and that folder) once a design is chosen. */
import { useState, type KeyboardEvent } from "react";
import type { PassGroup } from "@/lib/types";
import { TileIcon } from "./Icons";
import { passIcon, splitName, withPhone } from "./Prices";

type Item = PassGroup["items"][number];
const featured = (g: PassGroup) => /unlimited/i.test(g.title);

/** "$120" for 5 classes → "$24 a class"; "$1,045" for 180 days → "≈ $41 a week". Nothing for other prices. */
function perUnit(i: Item) {
  if (!/^\$[\d,.]+$/.test(i.price.trim())) return null;
  const total = Number(i.price.replace(/[$,]/g, ""));
  const classes = i.name.match(/(\d+)\s*class/i);
  if (classes && Number(classes[1]) > 1) return `$${Math.round(total / Number(classes[1]))} a class`;
  const days = i.name.match(/(\d+)\s*days?/i);
  if (days) return `≈ $${Math.round(total / (Number(days[1]) / 7))} a week`;
  return null;
}

function BuyLink({ item, group, className, label = "Buy" }: { item: Item; group: PassGroup; className: string; label?: string }) {
  return item.url ? (
    <a className={className} href={item.url} target="_blank" rel="noopener">
      {label}
      <span className="sr-only">
        {" "}
        {group.title}: {item.name} (opens Momence in a new tab)
      </span>
    </a>
  ) : (
    <a className={className} href="tel:+61412499700">
      Call to book
    </a>
  );
}

/* ---------- Option 1: price menu ---------- */
function MenuDesign({ groups }: { groups: PassGroup[] }) {
  const columns = [groups.slice(0, 3), groups.slice(3)];
  return (
    <div className="pd-menu">
      {columns.map((col, c) => (
        <div className="pd-menu__col" key={c}>
          {col.map((g) => (
            <section className={`pd-menu__group${featured(g) ? " pd-menu__group--featured on-dark" : ""}`} key={g.title}>
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((i) => {
                  const [label, detail] = splitName(i.name);
                  return (
                    <li key={i.name}>
                      <span className="pd-menu__name">
                        {label}
                        {detail && <small>{detail}</small>}
                      </span>
                      <span className="pd-menu__dots" aria-hidden="true" />
                      <span className="pd-menu__price">{i.price}</span>
                      {i.url ? <BuyLink item={i} group={g} className="pd-menu__buy" label="Buy →" /> : <span className="pd-menu__buy" />}
                    </li>
                  );
                })}
              </ul>
              {g.note && <p className="pd-menu__note">{withPhone(g.note)}</p>}
            </section>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ---------- Option 2: tabs ---------- */
function TabsDesign({ groups }: { groups: PassGroup[] }) {
  const [tab, setTab] = useState(0);
  const g = groups[tab];
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const next = (tab + step + groups.length) % groups.length;
    setTab(next);
    document.getElementById(`pd-tab-${next}`)?.focus();
  };
  return (
    <div className="pd-tabs">
      <div className="pd-tabs__list" role="tablist" aria-label="Pass type" onKeyDown={onKey}>
        {groups.map((x, i) => (
          <button
            key={x.title}
            id={`pd-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={i === tab}
            aria-controls="pd-tabpanel"
            tabIndex={i === tab ? 0 : -1}
            onClick={() => setTab(i)}
          >
            <TileIcon d={passIcon(x.title)} className="pd-tabs__ic" />
            {x.title}
          </button>
        ))}
      </div>
      <div className="pd-tabs__panel" role="tabpanel" id="pd-tabpanel" aria-labelledby={`pd-tab-${tab}`}>
        <div className="pd-tabs__grid">
          {g.items.map((i) => {
            const [label, detail] = splitName(i.name);
            const unit = perUnit(i);
            return (
              <div className={`pd-tile${featured(g) ? " pd-tile--featured on-dark" : ""}`} key={i.name}>
                <p className="pd-tile__name">{label}</p>
                <p className="pd-tile__detail">{detail ?? " "}</p>
                <p className="pd-tile__price">{i.price}</p>
                <p className="pd-tile__unit">{unit ?? " "}</p>
                <BuyLink item={i} group={g} className={`btn btn--sm ${i.url ? "btn--primary" : "btn--outline"}`} label="Buy now" />
              </div>
            );
          })}
        </div>
        {g.note && <p className="pd-tabs__note">{withPhone(g.note)}</p>}
      </div>
    </div>
  );
}

/* ---------- Option 3: grouped rows ---------- */
function RowsDesign({ groups }: { groups: PassGroup[] }) {
  return (
    <div className="pd-rows">
      {groups.map((g) => (
        <section className={`pd-row${featured(g) ? " pd-row--featured on-dark" : ""}`} key={g.title}>
          <div className="pd-row__head">
            <TileIcon d={passIcon(g.title)} className="pd-row__ic" />
            <h3>{g.title}</h3>
            {g.note && <p>{withPhone(g.note)}</p>}
          </div>
          <ul className="pd-row__options">
            {g.items.map((i) => {
              const [label, detail] = splitName(i.name);
              const unit = perUnit(i);
              return (
                <li className="pd-opt" key={i.name}>
                  <span className="pd-opt__name">
                    {label}
                    {detail && <small>{detail}</small>}
                  </span>
                  <span className="pd-opt__price">{i.price}</span>
                  <span className="pd-opt__unit">{unit ?? " "}</span>
                  <BuyLink item={i} group={g} className="pd-opt__buy" />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

const OPTIONS = [
  { name: "Price menu", text: "Elegant and compact, like a studio price board. Everything visible at a glance.", Design: MenuDesign },
  { name: "Tabs", text: "One pass type at a time, as large price tiles with the cost per class or per week.", Design: TabsDesign },
  { name: "Grouped rows", text: "Each pass type in its own row: name and conditions on the left, options on the right.", Design: RowsDesign },
];

export function PassesDesigns({ groups }: { groups: PassGroup[] }) {
  return (
    <>
      <section className="page-hero pd-hero">
        <div className="container">
          <p className="eyebrow">Design preview · local only</p>
          <h1>
            Pricing passes: <em>3 options</em>
          </h1>
          <p className="lead">
            The same prices and Buy links in three layouts. Pick one and it replaces the cards on the Pricing page. This page
            only exists on your local site.
          </p>
        </div>
      </section>
      {OPTIONS.map(({ name, text, Design }, n) => (
        <section className={`section${n % 2 ? "" : " section--tint"}`} key={name} aria-labelledby={`pd-opt-${n}`}>
          <div className="container">
            <div className="pd-label">
              <span>Option {n + 1}</span>
              <h2 id={`pd-opt-${n}`}>{name}</h2>
              <p>{text}</p>
            </div>
            <Design groups={groups} />
          </div>
        </section>
      ))}
    </>
  );
}
