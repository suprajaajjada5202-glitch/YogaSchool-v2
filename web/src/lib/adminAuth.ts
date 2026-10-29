/* Server-side admin check for /api/admin/* routes. The browser sends the signed-in user's Supabase access
   token; Supabase itself answers whether that user is in public.admins (the is_admin() SQL function).
   No secret key is involved: every write made with this token is still checked by Row Level Security. */
import { SUPABASE_KEY, SUPABASE_URL, supabaseConfigured } from "./supabase";

export function bearer(req: Request) {
  const m = /^Bearer\s+(.+)$/i.exec(req.headers.get("authorization") ?? "");
  return m?.[1] ?? null;
}

export function userHeaders(token: string, extra: Record<string, string> = {}) {
  return { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...extra };
}

/** The user's token if they are an admin, otherwise null. */
export async function adminToken(req: Request): Promise<string | null> {
  const token = bearer(req);
  if (!token || !supabaseConfigured) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, {
      method: "POST",
      headers: userHeaders(token),
      body: "{}",
      cache: "no-store",
    });
    return res.ok && (await res.json()) === true ? token : null;
  } catch {
    return null;
  }
}

/** Tables the admin panel edits; each is also the cache tag used by the website (see selectRows). */
export const CONTENT_TABLES = ["classes", "timetable", "prices", "events", "blog_posts", "gift_vouchers"] as const;
export type ContentTable = (typeof CONTENT_TABLES)[number];
export const isContentTable = (t: unknown): t is ContentTable => CONTENT_TABLES.includes(t as ContentTable);
