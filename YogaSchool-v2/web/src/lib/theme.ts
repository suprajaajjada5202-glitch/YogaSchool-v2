/* Light / dark mode. <html data-theme> is set before first paint by THEME_SCRIPT (in app/layout.tsx):
   the visitor's saved choice if they used the toggle, otherwise their device setting (followed live). */
export type Theme = "light" | "dark";
export const THEME_KEY = "tys-theme";

export const THEME_SCRIPT = `(function(){var d=document.documentElement,m=window.matchMedia("(prefers-color-scheme: dark)");function a(){var t=null;try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}if(t!=="light"&&t!=="dark")t=m.matches?"dark":"light";d.setAttribute("data-theme",t)}a();try{m.addEventListener("change",a)}catch(e){}window.addEventListener("storage",function(e){if(e.key==="${THEME_KEY}")a()})})();`;

export function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function setTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {
    /* private mode: the choice just isn't remembered */
  }
}

/** Re-render when <html data-theme> changes (toggle, device setting, another tab). */
export function subscribeTheme(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
