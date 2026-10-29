import { revalidateTag } from "next/cache";
import { adminToken, isContentTable } from "@/lib/adminAuth";

/** POST { table } — called by /admin after every save, so the website shows the change on the next page view. */
export async function POST(req: Request) {
  if (!(await adminToken(req))) return Response.json({ error: "Admins only" }, { status: 401 });
  const { table } = (await req.json().catch(() => ({}))) as { table?: unknown };
  if (!isContentTable(table)) return Response.json({ error: "Unknown table" }, { status: 400 });
  revalidateTag(table, { expire: 0 });
  return Response.json({ ok: true });
}
