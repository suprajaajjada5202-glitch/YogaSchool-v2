/* Live data from Momence (the studio's booking and shop system), read on the server.
   These are the same public endpoints Momence's own timetable widget and shop page use.
   Every loader returns an empty list on any problem, so pages simply hide or fall back. */
const HOST_ID = 23652;
/** A product's own page in the Momence shop (its Buy link). Momence finds it by id; the name only reads well. */
export const momenceProductUrl = (id: number, name: string) =>
  `https://momence.com/The-Yoga-School/product/${encodeURIComponent(name.replace(/\s+/g, "-"))}/${id}`;

export type UpcomingClass = {
  id: number;
  name: string;
  startsAt: string;
  durationMinutes: number;
  teacher: string;
  teacherPicture: string | null;
  price: number | null;
  bookUrl: string;
  spotsLeft: number | null;
};

export type ShopProduct = { id: number; name: string; description: string; image: string | null; price: number | null };

/** Tidy Momence text: trailing full stops on class names and double spaces in teacher names. */
const tidy = (s: string | null | undefined) =>
  (s ?? "")
    .replace(/\s+/g, " ")
    .replace(/[.\s]+$/, "")
    .trim();

/** Momence keeps an event's write-up in the session's "level" field. Its opening paragraph is the summary the
    old site showed (without a first line that only repeats the event name); the full text is on Momence. */
export function momenceSummary(name: string, text: string | null | undefined) {
  const key = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const body = (text ?? "").trim();
  const nl = body.indexOf("\n");
  const rest = nl > 0 && key(body.slice(0, nl)) === key(name) ? body.slice(nl + 1) : body;
  return rest.trim().split(/\n\s*\n/)[0].trim();
}

/** Momence session id from an event link (momence.com/s/143061284 or momence.com/The-Yoga-School/Name/143061284). */
export function momenceSessionId(url: string | null | undefined) {
  const m = /^https:\/\/momence\.com\/(?:s|The-Yoga-School\/[^/?#]+)\/(\d+)\/?(?:[?#]|$)/.exec(url ?? "");
  return m ? Number(m[1]) : null;
}

/** Summary of one Momence event (see momenceSummary); "" if it has none (refreshed hourly). */
export async function getMomenceEventSummary(sessionId: number): Promise<string> {
  try {
    const res = await fetch(`https://momence.com/_api/primary/plugin/sessions/${sessionId}`, { next: { revalidate: 3600 } });
    if (!res.ok) return "";
    const s = ((await res.json()) as { message?: { hostId: number; sessionName: string; level: string | null } }).message;
    return s?.hostId === HOST_ID ? momenceSummary(s.sessionName, s.level) : "";
  } catch {
    return "";
  }
}

type MomenceSession = {
  id: number;
  sessionName: string;
  startsAt: string;
  durationMinutes: number;
  teacher: string | null;
  teacherPicture: string | null;
  fixedTicketPrice: number | null;
  link: string;
  isCancelled: boolean;
  remainingSpots: number | null;
};

/** The next classes from the live Momence timetable (refreshed every 5 minutes). */
export async function getUpcomingClasses(limit = 12): Promise<UpcomingClass[]> {
  const from = new Date();
  const to = new Date(from.getTime() + 14 * 864e5);
  const qs = new URLSearchParams({
    fromDate: from.toISOString(),
    toDate: to.toISOString(),
    pageSize: "100",
    page: "0",
    timeZone: "Australia/Brisbane",
  });
  try {
    const res = await fetch(`https://readonly-api.momence.com/host-plugins/host/${HOST_ID}/host-schedule/sessions?${qs}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { payload?: MomenceSession[] };
    const now = Date.now();
    return (data.payload ?? [])
      .filter((s) => !s.isCancelled && new Date(s.startsAt).getTime() > now)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
      .slice(0, limit)
      .map((s) => ({
        id: s.id,
        name: tidy(s.sessionName),
        startsAt: s.startsAt,
        durationMinutes: s.durationMinutes,
        teacher: tidy(s.teacher),
        teacherPicture: s.teacherPicture,
        price: s.fixedTicketPrice,
        bookUrl: s.link,
        spotsLeft: s.remainingSpots,
      }));
  } catch {
    return [];
  }
}

type MomenceProduct = {
  id: number;
  name: string;
  description: string | null;
  imageLink: string | null;
  priceInCurrency: number | null;
};

/** Every product in the studio's Momence shop (refreshed hourly). */
export async function getShopProducts(): Promise<ShopProduct[]> {
  try {
    const res = await fetch(`https://momence.com/_api/primary/checkout/host/${HOST_ID}/retail-products?page=0&pageSize=100&q=`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { payload?: MomenceProduct[] };
    return (data.payload ?? []).map((p) => ({
      id: p.id,
      name: tidy(p.name),
      description: (p.description ?? "").trim(),
      image: p.imageLink,
      price: p.priceInCurrency,
    }));
  } catch {
    return [];
  }
}

export type MomenceSlot = {
  name: string;
  type: string;
  startsAt: string;
  endsAt: string;
  teacher: string;
  price: number | null;
  free: boolean;
  image: string | null;
  description: string;
  link: string;
  cancelled: boolean;
};

/** Every session (classes and special events) in the next `days` days. Not cached: used by the admin import. */
export async function getMomenceSessions(days: number): Promise<MomenceSlot[]> {
  const from = new Date();
  const to = new Date(from.getTime() + days * 864e5);
  const out: MomenceSlot[] = [];
  try {
    for (let page = 0; page < 10; page++) {
      const qs = new URLSearchParams({
        fromDate: from.toISOString(),
        toDate: to.toISOString(),
        pageSize: "200",
        page: String(page),
        timeZone: "Australia/Brisbane",
      });
      const res = await fetch(`https://readonly-api.momence.com/host-plugins/host/${HOST_ID}/host-schedule/sessions?${qs}`, {
        cache: "no-store",
      });
      if (!res.ok) break;
      const list =
        (
          (await res.json()) as {
            payload?: (MomenceSession & {
              type: string;
              endsAt: string;
              freeEvent: boolean;
              image: string | null;
              level: string | null;
            })[];
          }
        ).payload ?? [];
      out.push(
        ...list.map((s) => ({
          name: tidy(s.sessionName),
          type: s.type,
          startsAt: s.startsAt,
          endsAt: s.endsAt,
          teacher: tidy(s.teacher),
          price: s.fixedTicketPrice,
          free: Boolean(s.freeEvent),
          image: s.image,
          description: momenceSummary(s.sessionName, s.level),
          link: s.link,
          cancelled: s.isCancelled,
        })),
      );
      if (list.length < 200) break;
    }
  } catch {
    /* return what we have */
  }
  return out.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}
