import Link from "next/link";
import type { ReactNode } from "react";
import type { Membership, PassGroup } from "@/lib/types";
import { CtaLink } from "./CtaLink";
import { TileIcon, Use } from "./Icons";
import { Reveal } from "./Reveal";

/** Membership cards (Supabase "prices" rows with category = membership, or built-in). */
export function MembershipCards({ plans }: { plans: Membership[] }) {
  return (
    <div className="pricing">
      {plans.map((p, n) => (
        <Reveal as="article" key={p.name} className={`plan${p.featured ? " plan--featured on-dark" : ""}`} delay={n || undefined}>
          {p.badge && <span className="plan__badge">{p.badge}</span>}
          <h3>{p.name}</h3>
          <p className="plan__desc">{p.description}</p>
          <p className="plan__price">
            {p.priceLabel} {p.period && <span>/ {p.period}</span>}
          </p>
          {p.terms && <p className="plan__terms">{p.terms}</p>}
          <ul>
            {p.features.map((f) => (
              <li key={f}>
                <Use id="i-check" />
                {f}
              </li>
            ))}
          </ul>
          <CtaLink className={`btn ${p.featured ? "btn--teal" : "btn--outline"}`} href={p.ctaUrl}>
            {p.ctaLabel}
          </CtaLink>
        </Reveal>
      ))}
    </div>
  );
}

/** Home page plan tile colour and icon, picked from the plan name: everything, strength & mobility, else yoga. */
const PLAN_LOOKS: [RegExp, string, ReactNode][] = [
  [
    /everything|all access/i,
    "sage",
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8.6" r="5" />
      <circle cx="8.6" cy="14.6" r="5" />
      <circle cx="15.4" cy="14.6" r="5" />
    </g>,
  ],
  [
    /shoshin|strength|mobility/i,
    "sky",
    <g fill="currentColor">
      <rect x="5.5" y="6.5" width="3" height="11" rx="1" />
      <rect x="15.5" y="6.5" width="3" height="11" rx="1" />
      <rect x="2.5" y="9" width="2.5" height="6" rx="1" />
      <rect x="19" y="9" width="2.5" height="6" rx="1" />
      <rect x="8.5" y="11" width="7" height="2" />
    </g>,
  ],
];
const PLAN_LOOK_YOGA: [string, ReactNode] = [
  "peach",
  <path
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M12 5c1.9 1.9 2.9 4.2 2.9 6.7S13.9 16.3 12 18c-1.9-1.7-2.9-3.8-2.9-6.3S10.1 6.9 12 5ZM9.3 9.3C7.2 8.6 5 8.7 3.2 9.6c.4 3.6 2.6 7 8.8 8.4m2.7-8.7c2.1-.7 4.3-.6 6.1.3-.4 3.6-2.6 7-8.8 8.4M5 20.5c2.2-.9 4.6-1.3 7-1.3s4.8.4 7 1.3"
  />,
];
const planLook = (name: string): [string, ReactNode] => {
  const look = PLAN_LOOKS.find(([re]) => re.test(name));
  return look ? [look[1], look[2]] : PLAN_LOOK_YOGA;
};

/** Membership tiles for the home page (same plans as MembershipCards): name, description and a link to the full
    details and prices on /pages/prices. */
export function MembershipTiles({ plans }: { plans: Membership[] }) {
  return (
    <div className="plan-tiles">
      {plans.map((p, n) => {
        const [tone, icon] = planLook(p.name);
        return (
          <Reveal as="article" key={p.name} className={`plan-tile plan-tile--${tone}`} delay={n || undefined}>
            <span className="plan-tile__ic">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {icon}
              </svg>
            </span>
            <div className="plan-tile__body">
              <h3>{/membership/i.test(p.name) ? p.name : `${p.name} Membership`}</h3>
              <p>{p.description}</p>
              <Link className="btn btn--primary btn--sm" href="/pages/prices#memberships">
                View Membership<span className="sr-only">: {p.name}</span>
              </Link>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/** Text with the studio phone number turned into a call link. */
export function withPhone(text: string) {
  const parts = text.split("0412 499 700");
  return parts.map((p, i) => (
    <span key={i}>
      {p}
      {i < parts.length - 1 && <a href="tel:+61412499700">0412 499 700</a>}
    </span>
  ));
}

/** Outline icon for a pass group, picked from its title. */
const PASS_ICONS: [RegExp, string][] = [
  [/drop/i, "M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4V7Zm11 0v2m0 3v1m0 3v1"],
  [/chair/i, "M7 3h10v9H7zM5 12h14M7 12v9m10-9v9M7 17h10"],
  [/unlimited/i, "M12 12c-2-2.5-3.5-4-5.5-4a4 4 0 0 0 0 8c2 0 3.5-1.5 5.5-4Zm0 0c2 2.5 3.5 4 5.5 4a4 4 0 0 0 0-8c-2 0-3.5 1.5-5.5 4Z"],
  [/private/i, "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9a8 8 0 0 1 16 0"],
];
const PASS_ICON_DEFAULT = "M12 3 2 8l10 5 10-5-10-5ZM2 12.5l10 5 10-5M2 17l10 5 10-5";
export const passIcon = (title: string) => PASS_ICONS.find(([re]) => re.test(title))?.[1] ?? PASS_ICON_DEFAULT;

/** "180 days (max 3-week hold)" or "1 person: 60 / 90 min" → main label + detail line. */
export function splitName(name: string): [string, string | null] {
  const m = name.match(/^(.+?)(?::\s+(.+)|\s+\((.+)\))$/);
  return m ? [m[1], m[2] ?? m[3]] : [name, null];
}

/** Pass groups as a grid of cards (unlimited passes highlighted), then the fine print (children). */
export function PassesList({ groups, children }: { groups: PassGroup[]; children?: ReactNode }) {
  return (
    <>
      <div className="pass-grid">
        {groups.map((g, n) => {
          const featured = /unlimited/i.test(g.title);
          return (
            <Reveal
              as="article"
              key={g.title}
              className={`pass-card${featured ? " pass-card--featured on-dark" : ""}`}
              delay={n % 3 || undefined}
            >
              <header className="pass-card__head">
                <TileIcon className="pass-card__ic" d={passIcon(g.title)} />
                <h3>{g.title}</h3>
              </header>
              <ul className="pass-card__list">
                {g.items.map((i) => {
                  const [label, detail] = splitName(i.name);
                  return (
                    <li key={i.name}>
                      <span className="pass-card__name">
                        {label}
                        {detail && <small>{detail}</small>}
                      </span>
                      <span className="pass-card__price">{i.price}</span>
                      {i.url && (
                        <a className="pass-card__buy" href={i.url} target="_blank" rel="noopener">
                          Buy<span className="sr-only">
                            {" "}
                            {g.title}: {i.name} (opens Momence in a new tab)
                          </span>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
              {g.note && <p className="pass-card__note">{withPhone(g.note)}</p>}
            </Reveal>
          );
        })}
      </div>
      {children}
    </>
  );
}
