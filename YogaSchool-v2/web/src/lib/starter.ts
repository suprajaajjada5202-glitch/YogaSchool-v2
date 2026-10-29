/* Starter content for the admin "Import" button: everything the website shows today, shaped as
   Supabase rows. Classes, prices and blog come from the built-in site content (so the website looks the
   same before and after importing); timetable and events come from the live Momence data. */
import * as site from "@/data/content";
import type { ContentTable } from "./adminAuth";
import { getMomenceSessions } from "./momence";

type Row = Record<string, unknown>;
const TZ = "Australia/Brisbane";
const VOUCHER_URL = "https://momence.com/gcc/23652";

/** "$1,045" -> 1045; anything else (e.g. "$120 / $160") stays as display text. */
function priceOf(label: string): { price: number | null; price_label: string | null } {
  const m = /^\$([\d,]+(?:\.\d+)?)$/.exec(label.trim());
  return m ? { price: Number(m[1].replace(/,/g, "")), price_label: null } : { price: null, price_label: label };
}
const parts = (iso: string) => {
  const p: Record<string, string> = {};
  new Intl.DateTimeFormat("en-GB", { timeZone: TZ, weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false })
    .formatToParts(new Date(iso))
    .forEach((x) => (p[x.type] = x.value));
  return {
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(p.weekday) + 1,
    time: `${p.hour === "24" ? "00" : p.hour}:${p.minute}`,
  };
};
/** Momence class name -> class slug on the Classes page. */
function classSlug(name: string) {
  const n = name.toLowerCase();
  if (n.includes("yin")) return "yin";
  if (n.includes("chair")) return "chair";
  if (n.includes("shoshin")) return "shoshin";
  if (n.includes("introduction") || /level\s*1\b/.test(n)) return "l1";
  if (/level\s*2/.test(n)) return "l2";
  if (n.includes("intermediate") || /level\s*3/.test(n)) return "l3";
  if (n.includes("all level")) return "all";
  return null;
}
const GROUP_CATEGORY: Record<string, string> = {
  "Drop in": "drop_in",
  "Chair Yoga passes": "chair",
  "Class passes": "class_pass",
  "Unlimited passes": "unlimited",
  "Private classes": "private",
};

export async function starterRows(table: ContentTable, classSlugs: Set<string>): Promise<Row[]> {
  switch (table) {
    case "classes":
      return site.classes.map((c, i) => ({
        slug: c.slug,
        name: c.name,
        level: c.level || null,
        duration: c.duration,
        description: c.description.join("\n\n"),
        tag: c.tag,
        image_url: c.image?.src ?? null,
        sort: i * 10,
        published: true,
      }));
    case "prices": {
      const rows: Row[] = site.memberships.map((m, i) => ({
        category: "membership",
        name: m.name,
        ...priceOf(m.priceLabel),
        period: m.period,
        description: m.description,
        features: m.features,
        terms: m.terms,
        badge: m.badge,
        featured: m.featured,
        cta_label: m.ctaLabel,
        cta_url: m.ctaUrl,
        sort: (i + 1) * 10,
        published: true,
      }));
      site.passes.forEach((g, gi) =>
        g.items.forEach((it, ii) =>
          rows.push({
            category: GROUP_CATEGORY[g.title] ?? "other",
            name: it.name,
            ...priceOf(it.price),
            // the website joins the item notes of a group, so the group note goes on its first item
            description: ii === 0 ? g.note : null,
            features: [],
            featured: false,
            sort: (gi + 1) * 100 + ii * 10,
            published: true,
          }),
        ),
      );
      return rows;
    }
    case "blog_posts":
      return site.posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        author: p.author,
        excerpt: p.excerpt,
        body: p.body.join("\n\n"),
        image_url: p.image?.src ?? null,
        published_at: p.publishedAt ?? new Date().toISOString(),
        published: true,
      }));
    case "gift_vouchers": {
      // Voucher amounts follow the current class prices on the Prices page
      const pass = (title: string, name: string) =>
        site.passes.find((g) => g.title === title)?.items.find((i) => i.name === name)?.price;
      const v = (name: string, label: string | undefined, description: string, sort: number) => ({
        name,
        price: label ? priceOf(label).price : null,
        description,
        buy_url: VOUCHER_URL,
        sort,
        published: true,
      });
      return [
        v("1 class", pass("Drop in", "Adult"), "A single class at The Yoga School.", 10),
        v("5 classes", pass("Class passes", "5 classes"), "A 5-class pack, valid 6 months from first use.", 20),
        v("20 classes", pass("Class passes", "20 classes"), "A 20-class pack, valid 12 months from first use.", 30),
        v("30 days unlimited (new students)", "$99", "30 days of unlimited classes for someone new to The Yoga School.", 40),
      ];
    }
    case "timetable": {
      // One week of the live Momence timetable = the regular weekly pattern
      const seen = new Set<string>();
      const rows: Row[] = [];
      for (const s of await getMomenceSessions(7)) {
        if (s.type !== "fitness") continue;
        const a = parts(s.startsAt);
        const key = `${a.day} ${a.time} ${s.name}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const slug = classSlug(s.name);
        rows.push({
          day_of_week: a.day,
          start_time: a.time,
          end_time: s.endsAt ? parts(s.endsAt).time : null,
          class_name: s.name,
          class_slug: slug && classSlugs.has(slug) ? slug : null,
          teacher: s.teacher || null,
          book_url: s.link,
          published: true,
        });
      }
      return rows;
    }
    case "events":
      return (await getMomenceSessions(180))
        .filter((s) => s.type !== "fitness" && !s.cancelled)
        .map((s) => ({
          title: s.name,
          starts_at: s.startsAt,
          ends_at: s.endsAt || null,
          teacher: s.teacher || null,
          // Momence uses $999-style placeholders for "book direct" events: leave those blank
          price_label: s.free ? "Free" : s.price != null && s.price < 500 ? `$${s.price}` : null,
          image_url: s.image,
          description: s.description || null,
          book_url: s.link,
          published: true,
        }));
  }
}
