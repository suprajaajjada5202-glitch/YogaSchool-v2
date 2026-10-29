/* Server-side content loaders. Each reads Supabase (refreshed every 60 s) and falls back to
   the built-in content from src/data/content.ts when Supabase is not set up or a table is empty. */
import * as fallback from "@/data/content";
import { getMomenceEventSummary, getShopProducts, momenceProductUrl, momenceSessionId } from "./momence";
import { selectRows } from "./supabase";
import type { ClassItem, EventItem, Membership, PassGroup, Post, Product, TimetableRow, Voucher } from "./types";

const paras = (s: string | null | undefined) =>
  (s ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
const money = (n: number | null | undefined) =>
  n == null ? "" : `$${Number(n) % 1 ? Number(n).toFixed(2) : Number(n).toLocaleString("en-AU")}`;
const img = (src: string | null | undefined, alt: string) => (src ? { src, alt, width: 1000, height: 750 } : null);

type DbClass = {
  slug: string;
  name: string;
  level: string | null;
  duration: string | null;
  summary: string | null;
  description: string | null;
  tag: string | null;
  image_url: string | null;
};
/** Card text: the first sentence, cut at a word if it runs long. */
function firstSentence(text: string) {
  const s = text.split(/(?<=[.!?])\s+/)[0].trim();
  return s.length > 160 ? `${s.slice(0, 160).replace(/\s+\S*$/, "")}…` : s;
}
export async function getClasses(): Promise<ClassItem[]> {
  const rows = await selectRows<DbClass>("classes", "select=*&published=eq.true&order=sort.asc");
  if (!rows?.length) return fallback.classes;
  return rows.map((c) => {
    // /admin has one Description field; older rows may only have the retired "Short description" (summary)
    const description = paras(c.description || c.summary);
    return {
      slug: c.slug,
      name: c.name,
      level: c.level ?? "",
      duration: c.duration || null,
      summary: firstSentence(description[0] ?? ""),
      description,
      tag: c.tag || null,
      image: img(c.image_url, `${c.name} class at The Yoga School`),
    };
  });
}

type DbTime = {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string | null;
  class_name: string;
  class_slug: string | null;
  teacher: string | null;
  level: string | null;
  notes: string | null;
  book_url: string | null;
};
/** Empty list = no published timetable yet (the page then shows only the Momence widget). */
export async function getTimetable(): Promise<TimetableRow[]> {
  const rows = await selectRows<DbTime>("timetable", "select=*&published=eq.true&order=day_of_week.asc,start_time.asc");
  return (rows ?? []).map((r) => ({
    id: r.id,
    day: r.day_of_week,
    start: r.start_time.slice(0, 5),
    end: r.end_time ? r.end_time.slice(0, 5) : null,
    className: r.class_name,
    classSlug: r.class_slug,
    teacher: r.teacher,
    level: r.level,
    notes: r.notes && !/^Imported from Momence/i.test(r.notes) ? r.notes : null,
    bookUrl: r.book_url,
  }));
}

type DbPrice = {
  category: string;
  name: string;
  price: number | null;
  price_label: string | null;
  period: string | null;
  description: string | null;
  features: string[] | null;
  terms: string | null;
  badge: string | null;
  featured: boolean;
  cta_label: string | null;
  cta_url: string | null;
};
const priceText = (p: DbPrice) => p.price_label || money(p.price);
async function prices() {
  return selectRows<DbPrice>("prices", "select=*&published=eq.true&order=sort.asc");
}
export async function getMemberships(): Promise<Membership[]> {
  const rows = (await prices())?.filter((p) => p.category === "membership");
  if (!rows?.length) return fallback.memberships;
  return rows.map((p) => ({
    name: p.name,
    description: p.description ?? "",
    priceLabel: priceText(p),
    period: p.period,
    terms: p.terms ?? "",
    features: p.features ?? [],
    badge: p.badge,
    featured: p.featured,
    ctaLabel: p.cta_label ?? "Join",
    ctaUrl: p.cta_url ?? "/pages/contact-us",
  }));
}
const GROUPS: [string, string][] = [
  ["drop_in", "Drop in"],
  ["chair", "Chair Yoga passes"],
  ["class_pass", "Class passes"],
  ["unlimited", "Unlimited passes"],
  ["private", "Private classes"],
];
export async function getPasses(): Promise<PassGroup[]> {
  const rows = (await prices())?.filter((p) => p.category !== "membership" && p.category !== "other");
  if (!rows?.length) return fallback.passes;
  // Buy link: the row's "Button link" from /admin, else the built-in Momence checkout link for the same pass
  const builtInUrl = (title: string, name: string) =>
    fallback.passes.find((g) => g.title === title)?.items.find((i) => i.name === name)?.url ?? null;
  return GROUPS.map(([cat, title]) => {
    const items = rows.filter((r) => r.category === cat);
    const notes = items.map((i) => i.description).filter(Boolean);
    return {
      title,
      items: items.map((i) => ({ name: i.name, price: priceText(i), url: i.cta_url || builtInUrl(title, i.name) })),
      note: notes.length ? notes.join(" ") : null,
    };
  }).filter((g) => g.items.length);
}

type DbEvent = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  teacher: string | null;
  price_label: string | null;
  description: string | null;
  book_url: string | null;
};
/** Upcoming events only (finished events drop off automatically). */
export async function getEvents(): Promise<EventItem[]> {
  const since = new Date(Date.now() - 7 * 864e5).toISOString();
  const rows = await selectRows<DbEvent>(
    "events",
    `select=*&published=eq.true&starts_at=gte.${encodeURIComponent(since)}&order=starts_at.asc&limit=48`,
  );
  const now = Date.now();
  const upcoming = (rows ?? []).filter((e) => new Date(e.ends_at ?? e.starts_at).getTime() >= now).slice(0, 24);
  return Promise.all(
    upcoming.map(async (e) => {
      // No description in /admin: show the event's summary from Momence, as the old site did
      const sessionId = e.description?.trim() ? null : momenceSessionId(e.book_url);
      return {
        id: e.id,
        title: e.title,
        startsAt: e.starts_at,
        endsAt: e.ends_at,
        teacher: e.teacher,
        priceLabel: e.price_label,
        description: sessionId ? (await getMomenceEventSummary(sessionId)) || null : e.description,
        bookUrl: e.book_url,
      };
    }),
  );
}

type DbPost = {
  slug: string;
  title: string;
  author: string;
  excerpt: string | null;
  body: string | null;
  image_url: string | null;
  published_at: string;
};
/** Original live URL of a built-in article (e.g. /blog/2014/03/23/yoga-is-a-complete-system), if it has one. */
const builtInPath = (slug: string) => fallback.posts.find((p) => p.slug === slug)?.path;

const toPost = (p: DbPost): Post => ({
  slug: p.slug,
  path: builtInPath(p.slug),
  title: p.title,
  author: p.author,
  excerpt: p.excerpt ?? "",
  body: paras(p.body),
  image: img(p.image_url, ""),
  publishedAt: p.published_at,
});
export async function getPosts(): Promise<Post[]> {
  const rows = await selectRows<DbPost>("blog_posts", "select=*&published=eq.true&order=published_at.desc");
  return rows?.length ? rows.map(toPost) : fallback.posts;
}
export async function getPost(slug: string): Promise<Post | null> {
  const rows = await selectRows<DbPost>("blog_posts", `select=*&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  if (rows?.length) return toPost(rows[0]);
  return fallback.posts.find((p) => p.slug === slug) ?? null;
}
/** Article by its original URL path (/blog/YYYY/MM/DD/slug). Supabase content wins if it has the same slug. */
export async function getPostByPath(path: string): Promise<Post | null> {
  const built = fallback.posts.find((p) => p.path === path);
  return built ? ((await getPost(built.slug)) ?? built) : null;
}
/** Built-in articles keep their original live URLs (/blog/…); articles added in /admin use /pages/post?slug=… */
export const postHref = (slug: string) => builtInPath(slug) ?? `/pages/post?slug=${encodeURIComponent(slug)}`;

type DbVoucher = { id: string; name: string; price: number | null; description: string | null; buy_url: string | null };
/** Empty list = page shows its standard voucher cards. */
export async function getVouchers(): Promise<Voucher[]> {
  const rows = await selectRows<DbVoucher>("gift_vouchers", "select=*&published=eq.true&order=sort.asc");
  return (rows ?? []).map((v) => ({
    id: v.id,
    name: v.name,
    price: v.price,
    description: v.description,
    buyUrl: v.buy_url || "https://momence.com/gcc/23652",
  }));
}

/** Shop: the studio's live Momence shop catalogue (managed in Momence, refreshed hourly); built-in items if Momence is unreachable. */
export async function getProducts(): Promise<Product[]> {
  const live: Product[] = (await getShopProducts()).map((p) => ({
    name: p.name,
    category: "",
    description: p.description,
    priceLabel: p.price != null ? money(p.price) : "Enquire in studio",
    image: p.image ? { src: p.image, alt: p.name, width: 600, height: 600 } : null,
    ctaLabel: "Buy",
    ctaUrl: momenceProductUrl(p.id, p.name),
  }));
  return live.length ? live : fallback.products;
}
