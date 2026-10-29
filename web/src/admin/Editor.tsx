"use client";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { refreshWebsite } from "./api";
import { supabase } from "./client";
import { fromLocalInput, hhmm, slugify, toLocalInput, type ContentType, type Field, type Row } from "./config";
import { Dialog } from "./Dialog";
import { useToast } from "./Toast";

type Values = Record<string, string | boolean>;

function initialValue(f: Field, row: Row | null): string | boolean {
  const v = row ? row[f.name] : undefined;
  if (f.type === "checkbox") return v === undefined ? f.def === true : Boolean(v);
  if (v == null) return f.def === "now" ? toLocalInput(new Date().toISOString()) : f.def == null ? "" : String(f.def);
  if (f.type === "datetime") return toLocalInput(v);
  if (f.type === "time") return hhmm(v);
  if (f.type === "list") return (v as string[]).join("\n");
  return String(v);
}

/** Add / edit / duplicate / delete one row of a content type. */
export function Editor({
  table,
  type,
  row,
  isNew,
  onDone,
}: {
  table: string;
  type: ContentType;
  row: Row | null;
  isNew: boolean;
  onDone: (changed: boolean) => void;
}) {
  const toast = useToast();
  const [values, setValues] = useState<Values>(() => Object.fromEntries(type.fields.map((f) => [f.name, initialValue(f, row)])));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const touchedSlug = useRef<Record<string, boolean>>(
    Object.fromEntries(type.fields.filter((f) => f.slugFrom).map((f) => [f.name, Boolean(values[f.name])])),
  );

  const set = (name: string, v: string | boolean) =>
    setValues((s) => {
      const next = { ...s, [name]: v };
      type.fields
        .filter((f) => f.slugFrom === name && !touchedSlug.current[f.name])
        .forEach((f) => (next[f.name] = slugify(String(v))));
      return next;
    });

  async function upload(f: Field, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const sb = supabase();
    if (!file || !sb) return;
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `${table}/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${ext}`;
    toast("Uploading…");
    const { error: err } = await sb.storage.from("media").upload(path, file, { cacheControl: "31536000", upsert: false });
    if (err) return toast(`Upload failed: ${err.message}`);
    set(f.name, sb.storage.from("media").getPublicUrl(path).data.publicUrl);
    toast("Image uploaded");
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    const sb = supabase();
    if (!sb) return;
    const data: Record<string, unknown> = {};
    const missing: string[] = [];
    for (const f of type.fields) {
      const v = values[f.name];
      let out: unknown;
      if (f.type === "checkbox") out = Boolean(v);
      else if (f.type === "number") out = v === "" ? null : Number(v);
      else if (f.type === "select") out = f.name === "day_of_week" ? Number(v) : v;
      else if (f.type === "list")
        out = String(v)
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      else if (f.type === "datetime") out = fromLocalInput(String(v));
      else out = String(v).trim() || null;
      if (f.required && (out == null || out === "")) missing.push(f.label);
      data[f.name] = out;
    }
    if (typeof data.slug === "string") data.slug = slugify(data.slug);
    if (missing.length) return setError(`Please fill in: ${missing.join(", ")}`);
    setSaving(true);
    const res = isNew ? await sb.from(table).insert(data) : await sb.from(table).update(data).eq("id", row!.id);
    setSaving(false);
    if (res.error)
      return setError(res.error.code === "23505" ? "That web address name is already used. Choose another." : res.error.message);
    await refreshWebsite(table);
    toast(data.published === false ? "Saved (hidden from the website)" : "Saved · live on the website");
    onDone(true);
  }

  async function remove() {
    const sb = supabase();
    if (!sb || !row || !confirm(`Delete this ${type.single}? This cannot be undone.`)) return;
    const res = await sb.from(table).delete().eq("id", row.id);
    if (res.error) return setError(res.error.message);
    await refreshWebsite(table);
    toast("Deleted");
    onDone(true);
  }

  return (
    <Dialog onClose={() => onDone(false)}>
      <form noValidate onSubmit={save}>
        <header>
          <h2>{isNew ? `Add ${type.single}` : `Edit ${type.single}`}</h2>
          <button type="button" className="btn btn--outline btn--sm" onClick={() => onDone(false)}>
            Close
          </button>
        </header>
        <div className="a-body">
          {type.fields.map((f, i) => {
            const id = `f_${f.name}`;
            const cls = `field${f.half ? " field--half" : ""}`;
            const help = f.help && <p className="a-help">{f.help}</p>;
            const v = values[f.name];
            if (f.type === "checkbox")
              return (
                <div className={cls} key={f.name}>
                  <label className="a-check">
                    <input type="checkbox" id={id} checked={Boolean(v)} onChange={(e) => set(f.name, e.target.checked)} />{" "}
                    {f.label}
                  </label>
                  {help}
                </div>
              );
            const common = { id, name: f.name, required: f.required, autoFocus: i === 0 };
            let input;
            if (f.type === "select")
              input = (
                <select {...common} value={String(v)} onChange={(e) => set(f.name, e.target.value)}>
                  {f.options!.map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
              );
            else if (f.type === "textarea" || f.type === "list")
              input = (
                <textarea
                  {...common}
                  className={f.big ? "big" : undefined}
                  value={String(v)}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              );
            else if (f.type === "image")
              input = (
                <>
                  <input
                    {...common}
                    type="text"
                    placeholder="Paste an image link or upload"
                    value={String(v)}
                    onChange={(e) => set(f.name, e.target.value)}
                  />
                  <div className="a-img">
                    {v ? <img alt="" src={String(v)} /> : null}
                    <label className="btn btn--outline btn--sm">
                      Upload image
                      <input type="file" accept="image/*" hidden onChange={(e) => upload(f, e)} />
                    </label>
                  </div>
                </>
              );
            else
              input = (
                <input
                  {...common}
                  type={f.type === "datetime" ? "datetime-local" : f.type}
                  step={f.step}
                  value={String(v)}
                  onChange={(e) => {
                    if (f.name in touchedSlug.current) touchedSlug.current[f.name] = true;
                    set(f.name, e.target.value);
                  }}
                />
              );
            return (
              <div className={cls} key={f.name}>
                <label htmlFor={id}>{f.label}</label>
                {input}
                {help}
              </div>
            );
          })}
          {error && (
            <p className="a-msg a-msg--err field" role="alert">
              {error}
            </p>
          )}
        </div>
        <footer>
          {!isNew ? (
            <button type="button" className="btn btn--outline btn--sm a-danger" onClick={remove}>
              Delete
            </button>
          ) : (
            <span></span>
          )}
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </footer>
      </form>
    </Dialog>
  );
}
