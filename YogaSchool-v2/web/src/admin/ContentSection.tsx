"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { importContent, refreshWebsite } from "./api";
import { supabase } from "./client";
import { TYPES, type Row } from "./config";
import { Editor } from "./Editor";
import { Icon } from "./Icon";
import { useToast } from "./Toast";

type Filter = "all" | "live" | "hidden";

/** List + search + filter + live switch + add / edit / duplicate for one content table. */
export function ContentSection({ table }: { table: string }) {
  const type = TYPES[table];
  const toast = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [term, setTerm] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<{ row: Row | null; isNew: boolean } | null>(null);
  const [importing, setImporting] = useState(false);

  const load = useCallback(async () => {
    const sb = supabase();
    if (!sb) return;
    let q = sb.from(table).select("*");
    type.order.forEach(([col, asc]) => (q = q.order(col, { ascending: asc })));
    const res = await q;
    if (res.error) setError(res.error.message);
    else {
      setError(null);
      setRows(res.data as Row[]);
    }
  }, [table, type]);

  useEffect(() => {
    setRows(null);
    load();
  }, [load]);

  const shown = useMemo(() => {
    const t = term.toLowerCase();
    return (rows ?? []).filter(
      (r) =>
        (filter === "all" || (filter === "live") === Boolean(r.published)) &&
        (!t ||
          type.search.some((f) =>
            String(r[f] ?? "")
              .toLowerCase()
              .includes(t),
          )),
    );
  }, [rows, term, filter, type]);
  const live = rows?.filter((r) => r.published).length ?? 0;

  async function toggle(r: Row) {
    const published = !r.published;
    setRows((rs) => rs?.map((x) => (x.id === r.id ? { ...x, published } : x)) ?? null);
    const res = await supabase()!.from(table).update({ published }).eq("id", r.id);
    if (res.error) {
      toast(`Could not update: ${res.error.message}`);
      return load();
    }
    await refreshWebsite(table);
    toast(published ? "Now live on the website" : "Hidden from the website");
  }

  async function runImport(missing = false) {
    setImporting(true);
    try {
      const { results } = await importContent([table], missing);
      const r = results[0];
      toast(r?.status === "imported" ? `Imported ${r.count} items` : (r?.message ?? "Nothing imported"));
      load();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }

  const duplicate = (r: Row) => {
    const copy = { ...r, published: false } as Row;
    if (typeof copy.slug === "string") copy.slug += "-copy";
    setEditing({ row: copy, isNew: true });
  };

  return (
    <>
      <div className="a-head">
        <div>
          <p className="a-eyebrow">
            <Icon name={table} /> Content
          </p>
          <h1>{type.title}</h1>
          <p>{type.intro}</p>
        </div>
        <div className="a-head__actions">
          <a className="btn btn--outline btn--sm" href={type.page} target="_blank" rel="noopener">
            View page ↗
          </a>
          {type.addMissing && !!rows?.length && (
            <button
              className="btn btn--outline btn--sm"
              type="button"
              disabled={importing}
              onClick={() => runImport(true)}
              title={`Adds the website's built-in ${type.title.toLowerCase()} that aren't here yet. Existing ones are never changed.`}
            >
              {importing ? "Importing…" : `Import missing ${type.title.toLowerCase()}`}
            </button>
          )}
          <button className="btn btn--primary btn--sm" type="button" onClick={() => setEditing({ row: null, isNew: true })}>
            + Add {type.single}
          </button>
        </div>
      </div>

      <div className="a-toolbar">
        <div className="a-seg" role="group" aria-label="Show">
          {(
            [
              ["all", `All ${rows?.length ?? ""}`],
              ["live", `Live ${rows ? live : ""}`],
              ["hidden", `Hidden ${rows ? rows.length - live : ""}`],
            ] as [Filter, string][]
          ).map(([k, label]) => (
            <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}>
              {label}
            </button>
          ))}
        </div>
        <input
          className="a-search"
          type="search"
          placeholder={`Search ${type.title.toLowerCase()}…`}
          aria-label={`Search ${type.title}`}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      <div className="a-table-wrap">
        {error ? (
          <p className="a-empty">Could not load: {error}</p>
        ) : rows === null ? (
          <p className="a-empty">Loading…</p>
        ) : !rows.length ? (
          <div className="a-empty">
            <Icon name={table} />
            <h2>No {type.title.toLowerCase()} in Supabase yet</h2>
            <p>The website is showing its built-in content. Import it to edit it here, or add your own.</p>
            <div className="a-empty__actions">
              <button className="btn btn--primary btn--sm" type="button" disabled={importing} onClick={() => runImport()}>
                {importing ? "Importing…" : "Import from the website"}
              </button>
              <button className="btn btn--outline btn--sm" type="button" onClick={() => setEditing({ row: null, isNew: true })}>
                + Add {type.single}
              </button>
            </div>
          </div>
        ) : !shown.length ? (
          <p className="a-empty">Nothing matches.</p>
        ) : (
          <table className="a-table">
            <thead>
              <tr>
                {type.thumb && (
                  <th scope="col">
                    <span className="sr-only">Photo</span>
                  </th>
                )}
                {type.cols
                  .filter(([h]) => h !== "Status")
                  .map(([h]) => (
                    <th scope="col" key={h}>
                      {h}
                    </th>
                  ))}
                <th scope="col">Live</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <tr key={r.id} className={r.published ? undefined : "is-hidden"}>
                  {type.thumb && (
                    <td className="a-thumb">
                      {r[type.thumb] ? <img src={String(r[type.thumb])} alt="" loading="lazy" /> : <span />}
                    </td>
                  )}
                  {type.cols
                    .filter(([h]) => h !== "Status")
                    .map(([h, fn], i) => (
                      <td key={h} className={i === 0 ? "a-primary" : undefined}>
                        {i === 0 ? (
                          <button type="button" className="a-rowlink" onClick={() => setEditing({ row: r, isNew: false })}>
                            {fn(r) || "—"}
                          </button>
                        ) : (
                          fn(r)
                        )}
                      </td>
                    ))}
                  <td className="a-live">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(r.published)}
                      aria-label={`Show on website`}
                      className="a-switch"
                      onClick={() => toggle(r)}
                    >
                      <span />
                    </button>
                  </td>
                  <td className="a-actions">
                    <button className="a-btn-ghost" type="button" onClick={() => setEditing({ row: r, isNew: false })}>
                      Edit
                    </button>
                    <button className="a-btn-ghost" type="button" onClick={() => duplicate(r)}>
                      Duplicate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editing && (
        <Editor
          table={table}
          type={type}
          row={editing.row}
          isNew={editing.isNew}
          onDone={(changed) => {
            setEditing(null);
            if (changed) load();
          }}
        />
      )}
    </>
  );
}
