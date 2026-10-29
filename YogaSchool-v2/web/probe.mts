import { starterRows } from "@/lib/starter";
const U = process.env.U!, K = process.env.K!;
const slugs = new Set(["l1", "l2", "l3", "l4", "all", "yin", "chair", "shoshin", "private"]);
const poison: Record<string, [string, unknown]> = {
  classes: ["name", null], timetable: ["class_name", null], prices: ["category", "zzz-invalid"], events: ["title", null],
  blog_posts: ["title", null], shop_products: ["name", null], gift_vouchers: ["name", null],
};
for (const t of Object.keys(poison)) {
  const rows = (await starterRows(t as never, slugs)).map((r) => ({ ...r, [poison[t][0]]: poison[t][1] }));
  // same request shape as the fixed import route
  const columns = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const qs = new URLSearchParams({ columns: columns.join(",") });
  const slug = t === "classes" || t === "blog_posts";
  if (slug) qs.set("on_conflict", "slug");
  const res = await fetch(`${U}/rest/v1/${t}?${qs}`, { method: "POST", headers: { apikey: K, Authorization: `Bearer ${K}`, "Content-Type": "application/json", Prefer: ["return=minimal", "missing=default", ...(slug ? ["resolution=ignore-duplicates"] : [])].join(",") }, body: JSON.stringify(rows) });
  console.log(t.padEnd(14), rows.length, res.status, (await res.text()).slice(0, 130));
}
