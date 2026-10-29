import type { ReactNode } from "react";
import type { Voucher } from "@/lib/types";
import { Reveal } from "./Reveal";

const money = (n: number | null) => (n == null ? "" : `$${n % 1 ? n.toFixed(2) : n.toLocaleString("en-AU")}`);
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
        const stats: [string, string][] = [];
        if (each != null) stats.push(["Per class", money(each)]);
        else if (/unlimited/i.test(v.name)) stats.push(["Classes", "Unlimited"]);
        if (saving > 0) stats.push(["You save", money(saving)]);
        else if (days) stats.push(["Valid for", `${days} days`]);
        return (
          <Reveal as="article" className="vcard" key={v.id} delay={n % 4 || undefined}>
            <div className="vcard__top">
              <h3>{v.name}</h3>
              {each != null && each === best && single != null && each < single && <span className="vcard__chip">Best value</span>}
            </div>
            <p className="vcard__price">{money(v.price)}</p>
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
