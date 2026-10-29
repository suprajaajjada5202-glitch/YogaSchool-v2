/* Supabase connection. Only the publishable (public) key is used; Row Level Security
   protects the data. Never put the secret / service_role key in this project. */
const RAW_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
export const SUPABASE_KEY = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "").trim();

/** The API "Project URL" (https://xxxx.supabase.co). The dashboard address people often copy from the browser
    (https://supabase.com/dashboard/project/xxxx/...) is turned into it automatically: same project, API form. */
function apiUrl(u: string) {
  try {
    const url = new URL(u);
    const ref = /^\/dashboard\/project\/([a-z0-9]{15,30})(\/|$)/.exec(url.pathname)?.[1];
    if (/(^|\.)supabase\.com$/.test(url.hostname)) return ref ? `https://${ref}.supabase.co` : "";
    const ok = /^https?:$/.test(url.protocol) && url.hostname.includes(".") && (url.pathname === "/" || url.pathname === "");
    return ok ? url.origin : "";
  } catch {
    return "";
  }
}

export const SUPABASE_URL = apiUrl(RAW_URL);
export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);
/** Set when a URL was provided but is not a valid Project URL (shown on /admin). */
export const supabaseUrlProblem = RAW_URL && !SUPABASE_URL ? RAW_URL : "";

export function restHeaders(extra: Record<string, string> = {}) {
  return { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, ...extra };
}

/** Read rows through the Supabase REST API (server side). Returns null if not configured or on any error. */
export async function selectRows<T>(table: string, query: string, revalidate = 60): Promise<T[] | null> {
  if (!supabaseConfigured) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: restHeaders(), next: { revalidate, tags: [table] } });
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch {
    return null;
  }
}
