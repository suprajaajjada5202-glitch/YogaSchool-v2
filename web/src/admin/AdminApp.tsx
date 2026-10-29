"use client";
import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { LOGO } from "@/lib/site";
import { supabaseUrlProblem } from "@/lib/supabase";
import { supabase } from "./client";
import { NAV, TYPES } from "./config";
import { ContentSection } from "./ContentSection";
import { Dashboard } from "./Dashboard";
import { Icon } from "./Icon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Messages } from "./Messages";
import { ToastProvider } from "./Toast";

type View = "loading" | "setup" | "login" | "notAdmin" | "app";

/** /admin: staff sign in (Supabase Auth) and manage website content. */
export function AdminApp() {
  const [view, setView] = useState<View>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [section, setSection] = useState("dashboard");
  const [newCount, setNewCount] = useState(0);
  const [msg, setMsg] = useState<{ text: string; ok?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [denied, setDenied] = useState<{ id: string; email: string; reason: string } | null>(null);

  const start = useCallback(async (u: User) => {
    const sb = supabase()!;
    const { data, error } = await sb.from("admins").select("user_id").eq("user_id", u.id).maybeSingle();
    if (error || !data) {
      // Stay signed in and show exactly what to run, so the owner can fix it and press "Check again"
      setDenied({
        id: u.id,
        email: u.email ?? "",
        reason: error ? `Supabase error: ${error.message}` : "No row for this login in public.admins.",
      });
      setView("notAdmin");
      return;
    }
    setUser(u);
    const fromHash = location.hash.slice(1);
    setSection(fromHash === "messages" || fromHash in TYPES ? fromHash : "dashboard");
    setView("app");
  }, []);

  useEffect(() => {
    const sb = supabase();
    if (!sb) return setView("setup");
    sb.auth.getSession().then(({ data }) => (data.session ? start(data.session.user) : setView("login")));
    const { data: sub } = sb.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        const pw = prompt("Choose a new password (at least 8 characters):");
        if (pw && pw.length >= 8)
          sb.auth.updateUser({ password: pw }).then((r) => alert(r.error ? r.error.message : "Password updated."));
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [start]);

  const refreshCount = useCallback(async () => {
    const res = await supabase()!.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new");
    setNewCount(res.count ?? 0);
  }, []);
  useEffect(() => {
    if (view === "app") refreshCount();
  }, [view, refreshCount]);

  const go = (key: string) => {
    setSection(key);
    history.replaceState(null, "", `#${key}`);
  };

  async function signIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    const { data, error } = await supabase()!.auth.signInWithPassword({
      email: String(f.get("email")).trim(),
      password: String(f.get("password")),
    });
    setBusy(false);
    if (error) return setMsg({ text: `Sign in failed: ${error.message}` });
    start(data.user);
  }
  async function forgot(form: HTMLFormElement | null) {
    const email = String(new FormData(form ?? undefined).get("email") ?? "").trim();
    if (!email) return setMsg({ text: "Type your email address first, then click “Forgot password?”." });
    const { error } = await supabase()!.auth.resetPasswordForEmail(email, { redirectTo: location.href.split("#")[0] });
    setMsg(
      error ? { text: error.message } : { text: "If that email has an admin account, a reset link is on its way.", ok: true },
    );
  }

  if (view === "loading")
    return (
      <div className="a-center">
        <p className="a-empty">Loading…</p>
      </div>
    );
  if (view === "setup")
    return (
      <div className="a-center">
        <div className="a-card">
          <h1>Connect Supabase</h1>
          {supabaseUrlProblem && (
            <p className="a-msg a-msg--err">
              <strong>NEXT_PUBLIC_SUPABASE_URL</strong> is not a valid Project URL: <code>{supabaseUrlProblem}</code>. Use the
              “Project URL” from Supabase → Project Settings → API, which looks like <code>https://xxxx.supabase.co</code>.
            </p>
          )}
          <p>
            Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to{" "}
            <code>.env.local</code>, then restart. See <code>supabase/README.md</code>.
          </p>
        </div>
      </div>
    );
  if (view === "notAdmin" && denied) {
    const sql = `insert into public.admins (user_id, email)\nvalues ('${denied.id}', '${denied.email}')\non conflict (user_id) do nothing;`;
    return (
      <div className="a-center">
        <div className="a-card" style={{ width: "min(640px, 100%)" }}>
          <img src={LOGO} alt="The Yoga School logo" width={64} height={64} />
          <h1>Not an admin yet</h1>
          <p>
            You are signed in as <strong>{denied.email}</strong>, but this login doesn’t have admin access.
          </p>
          <p className="a-msg a-msg--err">{denied.reason}</p>
          <p>
            In Supabase, open <strong>SQL Editor → New query</strong>, paste this and click <strong>Run</strong>:
          </p>
          <pre style={{ whiteSpace: "pre-wrap", background: "var(--c-light)", padding: 12, borderRadius: 8, fontSize: 13 }}>
            {sql}
          </pre>
          <button className="btn btn--outline btn--sm" type="button" onClick={() => navigator.clipboard?.writeText(sql)}>
            Copy SQL
          </button>
          <button
            className="btn btn--primary"
            type="button"
            onClick={async () => {
              const { data } = await supabase()!.auth.getUser();
              if (data.user) start(data.user);
            }}
          >
            Check again
          </button>
          <button
            className="a-link"
            type="button"
            onClick={() =>
              supabase()!
                .auth.signOut()
                .then(() => location.reload())
            }
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }
  if (view === "login")
    return (
      <div className="a-center">
        <form className="a-card" noValidate onSubmit={signIn}>
          <img src={LOGO} alt="The Yoga School logo" width={64} height={64} />
          <h1>Admin sign in</h1>
          <p className="lead" style={{ fontSize: "var(--fs-sm)" }}>
            The Yoga School website content
          </p>
          <div className="field">
            <label htmlFor="l-email">Email</label>
            <input id="l-email" name="email" type="email" autoComplete="username" required />
          </div>
          <div className="field">
            <label htmlFor="l-pass">Password</label>
            <div className="a-pw">
              <input id="l-pass" name="password" type={showPw ? "text" : "password"} autoComplete="current-password" required />
              <button
                type="button"
                className="a-pw__toggle"
                aria-controls="l-pass"
                aria-pressed={showPw}
                aria-label={showPw ? "Hide password" : "Show password"}
                onClick={() => setShowPw((v) => !v)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
                    <circle cx="12" cy="12" r="3" />
                    {showPw && <path d="M4 4l16 16" />}
                  </g>
                </svg>
                <span>{showPw ? "Hide" : "Show"}</span>
              </button>
            </div>
          </div>
          <button className="btn btn--primary" type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
          <button className="a-link" type="button" onClick={(e) => forgot(e.currentTarget.form)}>
            Forgot password?
          </button>
          {msg && (
            <p className={`a-msg ${msg.ok ? "a-msg--ok" : "a-msg--err"}`} role="alert">
              {msg.text}
            </p>
          )}
        </form>
      </div>
    );

  const navButton = ([key, label]: [string, string]) => (
    <button key={key} type="button" aria-current={section === key ? "page" : undefined} onClick={() => go(key)}>
      <Icon name={key} />
      <span>{label}</span>
      {key === "messages" && newCount > 0 && <span className="a-badge">{newCount}</span>}
    </button>
  );
  return (
    <ToastProvider>
      <div className="a-app">
        <aside className="a-side">
          <div className="a-side__top">
            <a className="a-brand" href="/pages/home" target="_blank" rel="noopener">
              <img src={LOGO} alt="" width={40} height={40} />
              <span>
                The Yoga School
                <small>Website admin</small>
              </span>
            </a>
            <ThemeToggle />
          </div>
          <nav aria-label="Sections">
            {NAV.slice(0, 2).map(navButton)}
            <p className="a-navlabel">Content</p>
            {NAV.slice(2).map(navButton)}
          </nav>
          <div className="a-user">
            <span className="a-user__avatar" aria-hidden="true">
              {(user?.email ?? "?").charAt(0).toUpperCase()}
            </span>
            <span className="a-user__email">{user?.email}</span>
            <button
              type="button"
              onClick={() =>
                supabase()!
                  .auth.signOut()
                  .then(() => location.reload())
              }
            >
              Sign out
            </button>
          </div>
        </aside>
        <main className="a-main">
          {section === "dashboard" ? (
            <Dashboard go={go} newMessages={newCount} />
          ) : section === "messages" ? (
            <Messages onCountChange={refreshCount} />
          ) : (
            <ContentSection key={section} table={section} />
          )}
        </main>
      </div>
    </ToastProvider>
  );
}
