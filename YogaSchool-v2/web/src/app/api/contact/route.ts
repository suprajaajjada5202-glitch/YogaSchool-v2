import { NextResponse } from "next/server";
import { SUPABASE_URL, restHeaders, supabaseConfigured } from "@/lib/supabase";

/* Receives the contact form and saves it in Supabase (table contact_messages).
   Row Level Security only allows inserting new messages, so the public key is enough. */
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (str(body.website, 200)) return NextResponse.json({ ok: true }); // spam trap: humans never fill this

  const msg = {
    name: str(body.name, 120),
    phone: str(body.phone, 40),
    email: str(body.email, 200),
    preferred_class: str(body.preferred_class, 120) || null,
    message: str(body.message, 5000),
  };
  const problems = [
    msg.name.length < 2 && "name",
    !/^[+()\d\s-]{8,}$/.test(msg.phone) && "phone",
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(msg.email) && "email",
    msg.message.length < 10 && "message",
  ].filter(Boolean);
  if (problems.length) return NextResponse.json({ error: "Invalid fields", fields: problems }, { status: 400 });
  if (!supabaseConfigured) return NextResponse.json({ error: "Messages are not configured" }, { status: 503 });

  const res = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
    method: "POST",
    headers: restHeaders({ "Content-Type": "application/json", Prefer: "return=minimal" }),
    body: JSON.stringify(msg),
  });
  if (!res.ok) {
    console.error("[contact] Supabase insert failed", res.status, await res.text());
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
