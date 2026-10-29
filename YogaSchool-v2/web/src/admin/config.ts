/* Content types editable in /admin. Each maps to a Supabase table (see supabase/schema.sql). */
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const CATEGORIES: [string, string][] = [
  ["membership", "Membership"],
  ["drop_in", "Drop in"],
  ["chair", "Chair Yoga pass"],
  ["class_pass", "Class pass"],
  ["unlimited", "Unlimited pass"],
  ["private", "Private class"],
  ["other", "Other / offer"],
];
const TZ = "Australia/Brisbane";

export type Row = Record<string, unknown> & { id: string };
export type FieldType = "text" | "textarea" | "number" | "checkbox" | "url" | "image" | "select" | "time" | "datetime" | "list";
export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  half?: boolean;
  help?: string;
  def?: unknown;
  big?: boolean;
  step?: string;
  options?: [string | number, string][];
  slugFrom?: string;
};
export type ContentType = {
  title: string;
  /** Website page that shows this content */
  page: string;
  /** Field shown as a small photo in the list */
  thumb?: string;
  /** Show "Import missing …": adds the website's built-in items that aren't here yet (see ADD_MISSING in the import route) */
  addMissing?: boolean;
  single: string;
  intro: string;
  order: [string, boolean][];
  search: string[];
  cols: [string, (r: Row) => string][];
  fields: Field[];
};

export const money = (n: unknown) =>
  n == null || n === "" ? "" : `$${Number(n).toLocaleString("en-AU", { minimumFractionDigits: Number(n) % 1 ? 2 : 0 })}`;
export const hhmm = (t: unknown) => (t ? String(t).slice(0, 5) : "");
export const fmtDate = (iso: unknown) =>
  iso
    ? new Intl.DateTimeFormat("en-AU", {
        timeZone: TZ,
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(String(iso)))
    : "";
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
/** timestamptz <-> <input type="datetime-local"> in Cairns time (UTC+10, no daylight saving) */
export function toLocalInput(iso: unknown) {
  if (!iso) return "";
  const p: Record<string, string> = {};
  new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .formatToParts(new Date(String(iso)))
    .forEach((x) => (p[x.type] = x.value));
  return `${p.year}-${p.month}-${p.day}T${p.hour === "24" ? "00" : p.hour}:${p.minute}`;
}
export const fromLocalInput = (v: string) => (v ? `${v}:00+10:00` : null);

const status = (r: Row) => (r.published ? "Live" : "Hidden");
const F = (name: string, label: string, type: FieldType, o: Partial<Field> = {}): Field => ({ name, label, type, ...o });
const PUBLISHED = F("published", "Published (visible on the website)", "checkbox", { def: true });

export const TYPES: Record<string, ContentType> = {
  classes: {
    page: "/pages/classes",
    thumb: "image_url",
    addMissing: true,
    title: "Classes",
    single: "class",
    order: [["sort", true]],
    search: ["name", "level"],
    intro: "Classes on the Classes page and the home page slider. Lower “Order” numbers appear first.",
    cols: [
      ["Name", (r) => String(r.name ?? "")],
      ["Who it's for", (r) => String(r.level ?? "")],
      ["Duration", (r) => String(r.duration || "—")],
      ["Status", status],
    ],
    fields: [
      F("name", "Class name", "text", { required: true }),
      F("level", "Who it's for", "text", { half: true, help: "e.g. Beginners or All levels" }),
      F("duration", "Duration", "text", { half: true, help: "e.g. 60–75 min. Leave empty to hide." }),
      F("description", "Description", "textarea", {
        big: true,
        help: "Leave a blank line between paragraphs. The first sentence also appears on the home page class cards.",
      }),
      F("image_url", "Photo", "image"),
      F("tag", "Photo label", "text", {
        half: true,
        help: "Optional short tag shown on the class photo, e.g. Start here or New. Leave empty for none.",
      }),
      F("sort", "Order", "number", { half: true, def: 0, help: "Lower numbers appear first." }),
      F("slug", "Web address name", "text", {
        required: true,
        slugFrom: "name",
        help: "Filled in from the class name. Used in links, e.g. /pages/classes#class-yin.",
      }),
      PUBLISHED,
    ],
  },
  timetable: {
    page: "/pages/timetable",
    title: "Timetable",
    single: "class time",
    order: [
      ["day_of_week", true],
      ["start_time", true],
    ],
    search: ["class_name", "teacher"],
    intro:
      "Weekly timetable. When at least one class is published, the Timetable page shows it above the Momence booking widget.",
    cols: [
      ["Day", (r) => DAYS[Number(r.day_of_week) - 1]],
      ["Time", (r) => hhmm(r.start_time) + (r.end_time ? "–" + hhmm(r.end_time) : "")],
      ["Class", (r) => String(r.class_name ?? "")],
      ["Teacher", (r) => String(r.teacher ?? "")],
      ["Status", status],
    ],
    fields: [
      F("day_of_week", "Day", "select", { half: true, required: true, options: DAYS.map((d, i) => [i + 1, d]), def: 1 }),
      F("class_name", "Class name", "text", { half: true, required: true }),
      F("start_time", "Start time", "time", { half: true, required: true }),
      F("end_time", "End time", "time", { half: true }),
      F("teacher", "Teacher", "text", { half: true }),
      F("level", "Level", "text", { half: true }),
      F("class_slug", "Links to class", "text", {
        half: true,
        help: "Optional: the class web address name, e.g. yin, l1, all, shoshin.",
      }),
      F("book_url", "Booking link", "url", { half: true, help: "Optional. Empty = scrolls to the Momence booking widget." }),
      F("notes", "Note shown to students", "text"),
      PUBLISHED,
    ],
  },
  prices: {
    page: "/pages/prices",
    title: "Prices",
    single: "price",
    order: [["sort", true]],
    search: ["name", "category"],
    intro: "Memberships appear as cards on the Prices page; everything else appears in the passes list.",
    cols: [
      ["Type", (r) => CATEGORIES.find((c) => c[0] === r.category)?.[1] ?? String(r.category)],
      ["Name", (r) => String(r.name ?? "")],
      ["Price", (r) => String(r.price_label || money(r.price))],
      ["Status", status],
    ],
    fields: [
      F("category", "Type", "select", { half: true, required: true, options: CATEGORIES, def: "membership" }),
      F("name", "Name", "text", { half: true, required: true }),
      F("price", "Price ($)", "number", { half: true, step: "0.01" }),
      F("price_label", "Price text (optional)", "text", { half: true, help: "Overrides the price, e.g. $120 / $160" }),
      F("period", "Per", "text", { half: true, help: "e.g. fortnight" }),
      F("badge", "Badge", "text", { half: true, help: "e.g. All access" }),
      F("description", "Description", "textarea"),
      F("features", "Included (one per line)", "list"),
      F("terms", "Terms", "text", { help: "e.g. Minimum 12-week commitment" }),
      F("cta_label", "Button text", "text", { half: true }),
      F("cta_url", "Button link", "text", { half: true }),
      F("sort", "Sort", "number", { half: true, def: 0 }),
      F("featured", "Highlight this card", "checkbox", { half: true }),
      PUBLISHED,
    ],
  },
  events: {
    page: "/pages/events",
    thumb: "image_url",
    title: "Events",
    single: "event",
    order: [["starts_at", false]],
    search: ["title", "teacher"],
    intro:
      "Upcoming events appear on the Events page automatically and disappear once they have finished. Times are Cairns time.",
    cols: [
      ["When", (r) => fmtDate(r.starts_at)],
      ["Event", (r) => String(r.title ?? "")],
      ["Teacher", (r) => String(r.teacher ?? "")],
      ["Status", status],
    ],
    fields: [
      F("title", "Event title", "text", { required: true }),
      F("starts_at", "Starts", "datetime", { half: true, required: true }),
      F("ends_at", "Ends", "datetime", { half: true }),
      F("teacher", "Teacher", "text", { half: true }),
      F("price_label", "Price", "text", { half: true, help: "e.g. $45 or Free" }),
      F("location", "Location", "text", { def: "The Yoga School, Piccones Village, Edge Hill" }),
      F("description", "Description", "textarea", {
        help: "Blank line = new paragraph. Leave empty to show the event's summary from Momence.",
      }),
      F("book_url", "Booking link", "url"),
      F("image_url", "Image", "image"),
      PUBLISHED,
    ],
  },
  blog_posts: {
    page: "/pages/blog1",
    thumb: "image_url",
    title: "Blog",
    single: "article",
    order: [["published_at", false]],
    search: ["title", "author"],
    intro: "Articles on the Blog page. A future publish date keeps an article hidden until that day.",
    cols: [
      ["Title", (r) => String(r.title ?? "")],
      ["Author", (r) => String(r.author ?? "")],
      ["Date", (r) => fmtDate(r.published_at)],
      ["Status", status],
    ],
    fields: [
      F("title", "Title", "text", { required: true }),
      F("slug", "Web address name", "text", { required: true, half: true, slugFrom: "title" }),
      F("author", "Author", "text", { half: true, def: "The Yoga School" }),
      F("excerpt", "Short summary", "textarea", { help: "Shown on the blog cards." }),
      F("body", "Article", "textarea", { big: true, help: "Leave a blank line between paragraphs." }),
      F("image_url", "Main image", "image"),
      F("published_at", "Publish date", "datetime", { half: true, def: "now" }),
      PUBLISHED,
    ],
  },
  gift_vouchers: {
    page: "/gift-vouchers",
    title: "Gift vouchers",
    single: "voucher",
    order: [["sort", true]],
    search: ["name"],
    intro: "Voucher options on the Gift vouchers page. When none are published, the page shows its standard cards.",
    cols: [
      ["Voucher", (r) => String(r.name ?? "")],
      ["Price", (r) => money(r.price)],
      ["Status", status],
    ],
    fields: [
      F("name", "Voucher name", "text", { required: true, half: true }),
      F("price", "Price ($)", "number", { half: true, step: "0.01" }),
      F("description", "Description", "textarea"),
      F("buy_url", "Buy link", "url", { def: "https://momence.com/gcc/23652" }),
      F("sort", "Sort", "number", { half: true, def: 0 }),
      PUBLISHED,
    ],
  },
};
/** Sidebar icons (24x24 stroke paths) */
export const ICONS: Record<string, string> = {
  dashboard: "M4 13h6V4H4zM14 20h6v-9h-6zM14 4v3h6V4zM4 20h6v-3H4z",
  messages: "M4 5h16v11H8l-4 4zM8 9h8M8 12h5",
  classes: "M12 4a2 2 0 1 0 0 .01M6 21l3-7 3 2 3-2 3 7M4 11l8-3 8 3",
  timetable: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4M8 14h3M13 14h3M8 17h3",
  prices: "M20 12l-8 8-8-8V4h8zM8 8h.01",
  events: "M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  blog_posts: "M5 4h14v16H5zM8 8h8M8 12h8M8 16h5",
  gift_vouchers: "M4 8h16v12H4zM12 8v12M4 12h16M12 8S10.5 3 8 3.8C5.8 4.5 7 8 12 8zm0 0s1.5-5 4-4.2C18.2 4.5 17 8 12 8z",
};
export const NAV: [string, string][] = [
  ["dashboard", "Dashboard"],
  ["messages", "Messages"],
  ...Object.entries(TYPES).map(([k, t]) => [k, t.title] as [string, string]),
];
