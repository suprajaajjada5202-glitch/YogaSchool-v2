import type { ReactNode } from "react";
import type { Voucher } from "@/lib/types";
import { CountUp } from "./CountUp";
import { Reveal } from "./Reveal";

/** "5 classes" → 5; null when the name has no class count (e.g. "30 days unlimited") */
const classCount = (name: string) => Number(/^(\d+)\s*class/i.exec(name.trim())?.[1]) || null;

/** Gift voucher options from Supabase; when none are published the standard cards (children) show.
    Class packs show their price per class against the 1-class voucher, and what that saves. */
export function Vouchers({ vouchers, children }: { vouchers: Voucher[]; children: ReactNode }) {
  if (!vouchers.length) return <>{children}</>;
  const perClass = (v: Voucher) => {
    const n = classCount(v.name);
    return n && v.price != null ? Math.round((v.price / n) * 100) / 100 : null;
  };
  const single = vouchers.find((v) => classCount(v.name) === 1)?.price ?? null;
  const best = Math.min(...vouchers.map(perClass).filter((p) => p != null));
  return (
    <div className="vcards">
      {vouchers.map((v, n) => {
        const each = perClass(v);
        const saving = each != null && single ? Math.round((single - each) * classCount(v.name)!) : 0;
        const days = /(\d+)\s*days?\b/i.exec(v.name)?.[1];
        const stats: [string, ReactNode][] = [];
        if (each != null) stats.push(["Per class", <CountUp value={each} prefix="$" />]);
        else if (/unlimited/i.test(v.name)) stats.push(["Classes", "Unlimited"]);
        if (saving > 0) stats.push(["You save", <CountUp value={saving} prefix="$" />]);
        else if (days) stats.push(["Valid for", <CountUp value={Number(days)} suffix=" days" />]);
        const isBest = each != null && each === best && single != null && each < single;
        return (
          <Reveal
            as="article"
            className={`vcard${isBest ? " vcard--best" : ""}`}
            key={v.id}
            delay={n % 4 || undefined}
            data-cm-intro=""
          >
            <div className="vcard__top">
              <h3>{v.name}</h3>
              {isBest && <span className="vcard__chip">Best value</span>}
            </div>
            <p className="vcard__price">{v.price != null && <CountUp value={v.price} prefix="$" />}</p>
            {v.description && <p className="vcard__desc">{v.description}</p>}
            <div className="vcard__foot">
              {each != null && single && (
                <div className="vcard__bar" aria-hidden="true">
                  <span style={{ width: `${Math.min(100, (each / single) * 100)}%` }} />
                </div>
              )}
              {stats.length > 0 && (
                <dl className="vcard__stats">
                  {stats.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <a className="vcard__buy" href={v.buyUrl} target="_blank" rel="noopener">
                <GiftBox />
                Buy voucher
                <span className="sr-only">: {v.name} (opens Momence in a new tab)</span>
              </a>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/** A small gift box whose lid lifts under the pointer (CSS: .vcard__lid) */
function GiftBox() {
  return (
    <svg className="vcard__gift" viewBox="0 0 24 24" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 12v9" />
        <g className="vcard__lid">
          <path d="M4 8h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1ZM12 8v4" />
          <path d="M12 8S10.5 3 8 3.8C5.8 4.5 7 8 12 8Zm0 0s1.5-5 4-4.2C18.2 4.5 17 8 12 8Z" />
        </g>
      </g>
    </svg>
  );
}
