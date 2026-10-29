"use client";
import { useCallback, useEffect, useState } from "react";
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
        <div className="a-tools">
          <select aria-label="Show" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="inbox">Inbox (not archived)</option>
            <option value="new">New only</option>
            <option value="archived">Archived</option>
            <option value="all">All</option>
          </select>
        </div>
      </div>
      <div className="a-table-wrap">
        {error ? (
          <p className="a-empty">Could not load: {error}</p>
        ) : rows === null ? (
          <p className="a-empty">Loading…</p>
        ) : !rows.length ? (
          <p className="a-empty">No messages here.</p>
        ) : (
          <table className="a-table">
            <thead>
              <tr>
                <th>Received</th>
                <th>From</th>
                <th>Enquiry</th>
                <th>Message</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => (
                <tr key={m.id} className={m.status === "new" ? "is-new" : undefined}>
                  <td>{fmtDate(m.created_at)}</td>
                  <td>
                    <strong>{m.name}</strong>
                    <br />
                    <a href={`mailto:${m.email}`}>{m.email}</a>
                    <br />
                    <a href={`tel:${m.phone}`}>{m.phone}</a>
                  </td>
                  <td>{m.preferred_class || "—"}</td>
                  <td>
                    <div className="a-clip">{m.message}</div>
                  </td>
                  <td>
                    <select aria-label="Status" value={m.status} onChange={(e) => setStatus(m.id, e.target.value)}>
                      {STATUS.map(([v, l]) => (
                        <option key={v} value={v}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="a-actions">
                    <button className="btn btn--outline btn--sm" type="button" onClick={() => view(m)}>
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
