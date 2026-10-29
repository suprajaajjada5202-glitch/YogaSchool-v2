"use client";
import { supabase } from "./client";

/** POST to an /api/admin route as the signed-in admin (the server re-checks admin access). */
export async function adminPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const { data } = await supabase()!.auth.getSession();
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${data.session?.access_token ?? ""}` },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(json.error ?? `Request failed (${res.status})`);
  return json;
}

/** Tell the website a table changed, so the next page view shows the new content (no waiting for the cache). */
export const refreshWebsite = (table: string) => adminPost("/api/admin/revalidate", { table }).catch(() => undefined);

export type ImportResult = { table: string; status: "imported" | "skipped" | "error"; count: number; message?: string };
/** missing: also top up sections that already have content with the built-in items they're missing. */
export const importContent = (tables?: string[], missing = false) =>
  adminPost<{ results: ImportResult[] }>("/api/admin/import", { tables, missing });
