"use client";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { supabase } from "./client";
import { fmtDate } from "./config";
import { Dialog } from "./Dialog";
import { useToast } from "./Toast";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_class: string | null;
  message: string;
  status: string;
  created_at: string;
};
const STATUS: [string, string][] = [
  ["new", "New"],
  ["read", "Read"],
  ["replied", "Replied"],
  ["archived", "Archived"],
];

const FILTERS: [string, string][] = [
  ["inbox", "Inbox"],
  ["new", "New"],
  ["archived", "Archived"],
  ["all", "All"],
];
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || "?";
/** "5 min ago", "3 h ago", "2 d ago", then the date */
function ago(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (!Number.isFinite(s)) return "";
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)} d ago`;
  return fmtDate(iso).replace(/,? \d{1,2}:\d{2}.*$/, "");
}

/** Contact form inbox. */
export function Messages({ onCountChange }: { onCountChange: () => void }) {
  const toast = useToast();
  const [filter, setFilter] = useState("inbox");
  const [rows, setRows] = useState<Message[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Message | null>(null);

  const load = useCallback(async () => {
    const sb = supabase();
    if (!sb) return;
    let q = sb.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(500);
    if (filter === "inbox") q = q.neq("status", "archived");
    else if (filter !== "all") q = q.eq("status", filter);
    const res = await q;
    if (res.error) setError(res.error.message);
    else {
      setError(null);
      setRows(res.data as Message[]);
    }
  }, [filter]);
  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: string, quiet = false) => {
    const res = await supabase()!.from("contact_messages").update({ status }).eq("id", id);
    if (!quiet) toast(res.error ? res.error.message : "Updated");
    onCountChange();
    setRows((rs) => rs?.map((r) => (r.id === id ? { ...r, status } : r)) ?? null);
  };
  const view = (m: Message) => {
    setOpen(m);
    if (m.status === "new") setStatus(m.id, "read", true);
  };
  const remove = async (m: Message) => {
    if (!confirm("Delete this message?")) return;
    const res = await supabase()!.from("contact_messages").delete().eq("id", m.id);
    toast(res.error ? res.error.message : "Deleted");
    setOpen(null);
    onCountChange();
    load();
  };

  return (
    <>
      <div className="a-head">
        <div>
          <h1>Messages</h1>
          <p>Enquiries from the contact form.</p>
        </div>
        <div className="a-seg" role="group" aria-label="Show">
          {FILTERS.map(([v, l]) => (
            <button key={v} type="button" aria-pressed={filter === v} onClick={() => setFilter(v)}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className={rows?.length && !error ? "a-inbox-wrap" : "a-table-wrap"}>
        {error ? (
          <p className="a-empty">Could not load: {error}</p>
        ) : rows === null ? (
          <p className="a-empty">Loading…</p>
        ) : !rows.length ? (
          <p className="a-empty">No messages here.</p>
        ) : (
          <ul className="a-inbox">
            {rows.map((m, n) => (
              <li
                key={m.id}
                className={`a-mail is-${m.status}`}
                style={{ "--r": Math.min(n, 20) } as CSSProperties}
              >
                <span className="a-mail__avatar" aria-hidden="true">
                  {initials(m.name)}
                </span>
                <div className="a-mail__main">
                  <div className="a-mail__head">
                    <button type="button" className="a-mail__from" onClick={() => view(m)}>
                      {m.name || "No name"}
                    </button>
                    {m.status === "new" && <span className="a-mail__new">New</span>}
                    <time className="a-mail__time" dateTime={m.created_at} title={fmtDate(m.created_at)}>
                      {ago(m.created_at)}
                    </time>
                  </div>
                  <p className="a-mail__contact">
                    {m.email && <a href={`mailto:${m.email}`}>{m.email}</a>}
                    {m.phone && <a href={`tel:${m.phone}`}>{m.phone}</a>}
                    {m.preferred_class && <span className="a-mail__chip">{m.preferred_class}</span>}
                  </p>
                  <p className="a-mail__text">{m.message}</p>
                </div>
                <div className="a-mail__side">
                  <select
                    className={`a-mail__status is-${m.status}`}
                    aria-label={`Status of the message from ${m.name}`}
                    value={m.status}
                    onChange={(e) => setStatus(m.id, e.target.value)}
                  >
                    {STATUS.map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <button className="a-btn-ghost" type="button" onClick={() => view(m)}>
                    Open
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {open && (
        <Dialog onClose={() => setOpen(null)}>
          <form method="dialog">
            <header>
              <h2>Message from {open.name}</h2>
              <button className="btn btn--outline btn--sm" type="button" onClick={() => setOpen(null)}>
                Close
              </button>
            </header>
            <div className="a-body">
              <div className="field a-msgview">
                <dl>
                  <dt>Received</dt>
                  <dd>{fmtDate(open.created_at)}</dd>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${open.email}`}>{open.email}</a>
                  </dd>
                  <dt>Phone</dt>
                  <dd>
                    <a href={`tel:${open.phone}`}>{open.phone}</a>
                  </dd>
                  <dt>Enquiry</dt>
                  <dd>{open.preferred_class || "—"}</dd>
                </dl>
                <p>{open.message}</p>
              </div>
            </div>
            <footer>
              <button type="button" className="btn btn--outline btn--sm a-danger" onClick={() => remove(open)}>
                Delete
              </button>
              <a
                className="btn btn--primary"
                href={`mailto:${open.email}?subject=${encodeURIComponent("Re: your enquiry to The Yoga School")}`}
                onClick={() => setStatus(open.id, "replied", true)}
              >
                Reply by email
              </a>
            </footer>
          </form>
        </Dialog>
      )}
    </>
  );
}
