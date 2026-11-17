import Link from "next/link";
import type { ReactNode } from "react";
import { Use } from "./Icons";
import { OmCorner } from "./OmCorner";
import { Reveal } from "./Reveal";

/* End-of-home "Class Passes and Memberships." section: the three memberships, each with an outline icon, a line and a
   link to its prices. Three designs (variant): "a" pastel cards, "b" navy band with the Everything card featured,
   "c" heading beside a stack of rows. CSS: .mp in globals.css. */

type Plan = { key: "yoga" | "strength" | "everything"; title: string; text: ReactNode; icon: ReactNode };

const HREF = "/pages/prices#memberships";

/* Outline icons on a 24 × 24 grid; pathLength 1 lets CSS draw each stroke in, whatever its length */
const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", pathLength: 1 } as const;

const PLANS: Plan[] = [
  {
    key: "yoga",
    title: "Yoga Membership",
    text: "Yoga, Yin Yoga and Chair Yoga.",
    icon: (
      <>
        <path {...line} d="M12 19.5c-2.6-1.9-3.8-4.6-3.8-7.4S9.6 6.5 12 4.5c2.4 2 3.8 4.8 3.8 7.6s-1.2 5.5-3.8 7.4Z" />
        <path {...line} d="M8.4 10.2C6.6 9.3 5 9 3.5 9.1c-.1 3.9 2.4 8.3 8.5 10.4M15.6 10.2c1.8-.9 3.4-1.2 4.9-1.1.1 3.9-2.4 8.3-8.5 10.4" />
        <path {...line} d="M5.6 15.6C4.3 15.4 3 15.5 2 16c1.6 2.4 5 3.7 10 3.5 5 .2 8.4-1.1 10-3.5-1-.5-2.3-.6-3.6-.4" />
      </>
    ),
  },
  {
    key: "strength",
    title: "Strength & Mobility",
    text: "Build strength, improve movement and increase your mobility.",
    icon: (
      <>
        <path {...line} strokeWidth={2.4} d="M7 7v10M17 7v10" />
        <path {...line} strokeWidth={2.4} d="M3.8 9.5v5M20.2 9.5v5" />
        <path {...line} strokeWidth={2.4} d="M7 12h10" />
      </>
    ),
  },
  {
    key: "everything",
    title: "Everything Membership",
    text: (
      <>
        Yoga + Strength + Mobility.
        <br /> All in one membership.
      </>
    ),
    icon: (
      <>
        <circle {...line} cx="12" cy="8.6" r="5" />
        <circle {...line} cx="8.6" cy="14.6" r="5" />
        <circle {...line} cx="15.4" cy="14.6" r="5" />
      </>
    ),
  },
];

function Icon({ plan }: { plan: Plan }) {
  return (
    <span className="mp__icon">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {plan.icon}
      </svg>
    </span>
  );
}

const LABELS = { a: "Option A: pastel cards (your screenshot)", b: "Option B: navy band, Everything featured", c: "Option C: heading beside rows" };

export function MembershipPicks({ variant }: { variant: "a" | "b" | "c" }) {
  const id = `mp-${variant}-title`;
  // B puts the all-in-one membership in the middle, raised
  const plans = variant === "b" ? [PLANS[0], PLANS[2], PLANS[1]] : PLANS;
  return (
    <section className={`section mp mp--${variant}${variant === "b" ? " on-dark" : ""}`} aria-labelledby={id}>
      <OmCorner side={variant === "b" ? "left" : "right"} />
      <div className="container">
        {/* Temporary: names the design while one is being chosen */}
        <p className="mp__option">{LABELS[variant]}</p>
        <div className="mp__layout">
          <Reveal className="home-head mp__head">
            <p className="home-eyebrow">Memberships</p>
            <h2 id={id}>Class Passes and Memberships.</h2>
            <p>5 &amp; 20 class passes</p>
            {variant === "c" && (
              <Link className="home-link" href="/pages/prices">
                See all prices <Use id="i-arrow" />
              </Link>
            )}
          </Reveal>
          <div className="mp__cards">
            {plans.map((p, n) => (
              <Reveal as="article" key={p.key} className={`mp__card mp__card--${p.key}`} delay={n + 1}>
                {variant === "b" && p.key === "everything" && <span className="mp__badge">Best value</span>}
                <Icon plan={p} />
                <div className="mp__body">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
                {variant === "c" ? (
                  <Link className="mp__go" href={HREF} aria-label={`View ${p.title}`}>
                    <Use id="i-arrow" />
                  </Link>
                ) : (
                  <Link className={`btn ${variant === "b" && p.key === "everything" ? "btn--teal" : "btn--primary"} mp__btn`} href={HREF}>
                    View Membership <Use id="i-arrow" />
                  </Link>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
