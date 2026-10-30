"use client";
import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
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

const COLLAPSE_KEY = "admin-menu-collapsed";
const DESKTOP = "(min-width: 960px)"; // matches the breakpoint in admin.css

/* 24 × 24 outline icons for the menu controls */
const MENU_ICON = "M4 7h16M4 12h16M4 17h10";
const CLOSE_ICON = "M6 6l12 12M18 6 6 18";
const FOLD_ICON = "M15 6l-6 6 6 6M4 4v16";
const SIGNOUT_ICON = "M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l4-4-4-4M14 12H4";

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
  const navRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  // Desktop: sidebar folded to an icon rail (remembered). Phones/tablets: sidebar open as a drawer.
  const [collapsed, setCollapsed] = useState(() => typeof window !== "undefined" && localStorage.getItem(COLLAPSE_KEY) === "1");
  const [drawer, setDrawer] = useState(false);
  const [pill, setPill] = useState<CSSProperties | null>(null);
  const [pillReady, setPillReady] = useState(false); // glide only after it is first placed, not in from the corner
  useEffect(() => {
    if (!pill || pillReady) return;
    const f = requestAnimationFrame(() => setPillReady(true));
    return () => cancelAnimationFrame(f);
  }, [pill, pillReady]);

  // Menu highlight: one pill that slides to the current section (re-measured when the menu changes size)
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (view !== "app" || !nav) return;
    const place = () => {
      const b = nav.querySelector<HTMLElement>('[aria-current="page"]');
      if (!b) return setPill(null);
      setPill({ width: b.offsetWidth, height: b.offsetHeight, transform: `translate(${b.offsetLeft}px, ${b.offsetTop}px)` });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [view, section]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => {
      localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      return !c;
    });
  }, []);
  const closeDrawer = useCallback(() => {
    setDrawer(false);
    menuBtnRef.current?.focus();
  }, []);

  // Ctrl/⌘ + B opens or closes the menu (not while typing, where it means bold); Esc closes the drawer
  useEffect(() => {
    if (view !== "app") return;
    const desktop = matchMedia(DESKTOP);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && drawer) return closeDrawer();
      const t = e.target as HTMLElement;
      if (e.key.toLowerCase() !== "b" || !(e.metaKey || e.ctrlKey) || t.closest("input, textarea, select, [contenteditable]"))
        return;
      e.preventDefault();
      if (desktop.matches) toggleCollapsed();
      else setDrawer((d) => !d);
    };
    // Growing the window past the phone layout closes the drawer
    const onWide = () => desktop.matches && setDrawer(false);
    addEventListener("keydown", onKey);
    desktop.addEventListener("change", onWide);
    return () => {
      removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onWide);
    };
  }, [view, drawer, closeDrawer, toggleCollapsed]);

  // While the drawer is open the page behind it does not scroll, and focus moves into the drawer
  useEffect(() => {
    if (!drawer) return;
    document.documentElement.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [drawer]);

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
    setDrawer(false);
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

  const navButton = ([key, label]: [string, string], n: number) => (
    <button
      key={key}
      type="button"
      aria-current={section === key ? "page" : undefined}
      onClick={() => go(key)}
      data-tip={label}
      style={{ "--i": n } as CSSProperties}
    >
      <Icon name={key} />
      <span className="a-nav__label">{label}</span>
      {key === "messages" && newCount > 0 && (
        <span className="a-badge" aria-label={`${newCount} new`}>
          {newCount}
        </span>
      )}
    </button>
  );
  const signOut = () =>
    supabase()!
      .auth.signOut()
      .then(() => location.reload());
  const current = NAV.find(([k]) => k === section)?.[1] ?? "Dashboard";
  return (
    <ToastProvider>
      <div className={`a-app${collapsed ? " is-collapsed" : ""}${drawer ? " is-drawer" : ""}`}>
        {/* Phones and tablets: bar with the menu button; the sidebar opens over the page as a drawer */}
        <header className="a-topbar">
          <button
            ref={menuBtnRef}
            type="button"
            className="a-iconbtn"
            aria-label="Open menu"
            aria-controls="a-side"
            aria-expanded={drawer}
            onClick={() => setDrawer(true)}
          >
            <Icon path={MENU_ICON} />
          </button>
          <span className="a-topbar__title">
            <img src={LOGO} alt="" width={30} height={30} />
            <span key={section}>{current}</span>
          </span>
          <ThemeToggle />
        </header>
        <div className="a-scrim" aria-hidden="true" onClick={closeDrawer} />
        <aside className="a-side" id="a-side" aria-label="Admin menu">
          <div className="a-side__top">
            <a className="a-brand" href="/pages/home" target="_blank" rel="noopener" title="Open the website">
              <img src={LOGO} alt="" width={40} height={40} />
              <span>
                The Yoga School
                <small>Website admin</small>
              </span>
            </a>
            <button
              ref={closeBtnRef}
              type="button"
              className="a-iconbtn a-side__close"
              aria-label="Close menu"
              onClick={closeDrawer}
            >
              <Icon path={CLOSE_ICON} />
            </button>
          </div>
          <button
            type="button"
            className="a-fold"
            aria-label={collapsed ? "Expand menu" : "Collapse menu"}
            aria-expanded={!collapsed}
            aria-controls="a-side"
            title={`${collapsed ? "Expand" : "Collapse"} menu (Ctrl/⌘ + B)`}
            onClick={toggleCollapsed}
          >
            <Icon path={FOLD_ICON} />
          </button>
          <nav aria-label="Sections" ref={navRef}>
            <span
              className={`a-nav__pill${pill ? " is-on" : ""}${pillReady ? " is-ready" : ""}`}
              style={pill ?? undefined}
              aria-hidden="true"
            />
            {NAV.slice(0, 2).map(navButton)}
            <p className="a-navlabel" style={{ "--i": 2 } as CSSProperties}>
              <span>Content</span>
            </p>
            {NAV.slice(2).map((item, n) => navButton(item, n + 3))}
          </nav>
          <div className="a-side__foot">
            <ThemeToggle />
            <div className="a-user">
              <span className="a-user__avatar" aria-hidden="true" title={user?.email}>
                {(user?.email ?? "?").charAt(0).toUpperCase()}
              </span>
              <span className="a-user__email">{user?.email}</span>
              <button type="button" className="a-user__out" onClick={signOut} data-tip="Sign out">
                <Icon path={SIGNOUT_ICON} />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </aside>
        <main className="a-main">
          {/* keyed, so each section fades in when it opens */}
          <div className="a-view" key={section}>
            {section === "dashboard" ? (
              <Dashboard go={go} newMessages={newCount} />
            ) : section === "messages" ? (
              <Messages onCountChange={refreshCount} />
            ) : (
              <ContentSection table={section} />
            )}
          </div>
        </main>
      </div>
    </ToastProvider>
  );
}
