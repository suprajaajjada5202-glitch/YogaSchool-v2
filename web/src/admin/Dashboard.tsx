"use client";
import { useCallback, useEffect, useState } from "react";
import { importContent, type ImportResult } from "./api";
import { supabase } from "./client";
import { TYPES } from "./config";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

type Counts = Record<string, { total: number; live: number }>;

/** Overview: how much content each section has, plus the one-click import of the website's current content. */
export function Dashboard({ go, newMessages }: { go: (key: string) => void; newMessages: number }) {
  const toast = useToast();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<ImportResult[] | null>(null);

  const load = useCallback(async () => {
    const sb = supabase()!;
    const entries = await Promise.all(
      Object.keys(TYPES).map(async (t) => {
        const [all, live] = await Promise.all([
          sb.from(t).select("id", { count: "exact", head: true }),
          sb.from(t).select("id", { count: "exact", head: true }).eq("published", true),
        ]);
        return [t, { total: all.count ?? 0, live: live.count ?? 0 }] as const;
      }),
    );
    setCounts(Object.fromEntries(entries));
  }, []);
  useEffect(() => {
    load();
  }, [load]);

  const empty = counts ? Object.keys(TYPES).filter((t) => counts[t].total === 0) : [];

  async function runImport() {
    setBusy(true);
    setResults(null);
    try {
      const { results } = await importContent(empty);
      setResults(results);
      const n = results.filter((r) => r.status === "imported").reduce((a, r) => a + r.count, 0);
      toast(n ? `Imported ${n} items. The website now reads them from Supabase.` : "Nothing new to import");
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Import failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="a-head">
        <h1>Dashboard</h1>
        <a className="btn btn--outline btn--sm" href="/pages/home" target="_blank" rel="noopener">
          View website ↗
        </a>
      </div>

      {counts && empty.length > 0 && (
        <section className="a-import">
          <div>
            <h2>Import content</h2>
            <p>
              {empty.length === Object.keys(TYPES).length
                ? "All sections are"
                : `${empty.map((t) => TYPES[t].title).join(", ")} ${empty.length === 1 ? "is" : "are"}`}{" "}
              empty. Import copies what the website shows today, so you can edit it here.
            </p>
          </div>
          <button className="btn btn--primary" type="button" onClick={runImport} disabled={busy}>
            {busy ? "Importing…" : `Import into ${empty.length} empty section${empty.length === 1 ? "" : "s"}`}
          </button>
        </section>
      )}
      {results && (
        <ul className="a-results" aria-live="polite">
          {results.map((r) => (
            <li key={r.table} className={`is-${r.status}`}>
              <strong>{TYPES[r.table]?.title ?? r.table}</strong>
              <span>
                {r.status === "imported" ? `${r.count} imported` : r.status === "skipped" ? r.message : `Error: ${r.message}`}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="a-stats">
        <button type="button" className="a-stat a-stat--msg" onClick={() => go("messages")}>
          <Icon name="messages" />
          <span className="a-stat__n">{newMessages}</span>
          <span className="a-stat__l">New {newMessages === 1 ? "message" : "messages"}</span>
          <span className="a-stat__s">From the website contact form</span>
        </button>
        {Object.entries(TYPES).map(([key, t]) => {
          const c = counts?.[key];
          return (
            <button type="button" className="a-stat" key={key} onClick={() => go(key)}>
              <Icon name={key} />
              <span className="a-stat__n">{c ? c.total : "–"}</span>
              <span className="a-stat__l">{t.title}</span>
              {c && c.total > 0 && (
                <span className="a-stat__s">
                  {c.live} live{c.total - c.live ? ` · ${c.total - c.live} hidden` : ""}
                </span>
              )}
              {c && c.total === 0 && <span className="a-stat__s a-stat__s--warn">Empty: website shows built-in content</span>}
            </button>
          );
        })}
      </div>
    </>
  );
}
