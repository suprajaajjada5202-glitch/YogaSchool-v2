"use client";
import { useEffect, useRef, useState } from "react";

const SRC = "/api/momence-widget";
const MOMENCE_SRC = "https://momence.com/plugin/host-schedule/host-schedule.js";
const SETTINGS = { host_id: "23652", teacher_ids: "[]", location_ids: "[]", tag_ids: "[]", default_filter: "show-all" };

/* The widget script, downloaded once per visit from this site (app/api/momence-widget) and kept here. */
let code: Promise<string> | null = null;
function widgetCode() {
  code ??= fetch(SRC).then((r) => (r.ok ? r.text() : Promise.reject(new Error(`Widget script: ${r.status}`))));
  code.catch(() => {
    code = null; // try again on the next page view
  });
  return code;
}

/** Live Momence timetable / workshops widget (same account as the current site).
    Momence finds its script via `script[host_id][src$="host-schedule.js"]` and draws the timetable
    right after that script tag, so the script is placed inside this box. Each page view runs the
    downloaded code from a fresh blob URL (ending in "#host-schedule.js"), so the module runs again
    after client-side navigation without downloading it again. If this site can't supply the code,
    it loads straight from momence.com as before. */
export function MomenceWidget() {
  const host = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const box = host.current;
    if (!box) return;
    let live = true;
    // Our placeholder shows until Momence draws anything (its own loader comes first)
    const mo = new MutationObserver(() => {
      if (!box.querySelector(".momence-host-schedule-layout > div")) return;
      setDrawn(true);
      mo.disconnect();
    });
    mo.observe(box, { childList: true, subtree: true });
    widgetCode()
      .catch(() => null)
      .then((js) => {
        if (!live) return;
        const s = document.createElement("script");
        s.type = "module";
        if (js) {
          const url = URL.createObjectURL(new Blob([js], { type: "text/javascript" }));
          s.src = `${url}#host-schedule.js`;
          s.onload = () => URL.revokeObjectURL(url);
        } else {
          s.src = `${MOMENCE_SRC}?v=${Date.now()}&f=host-schedule.js`;
        }
        Object.entries(SETTINGS).forEach(([k, v]) => s.setAttribute(k, v));
        box.appendChild(s);
      });
    return () => {
      live = false;
      mo.disconnect();
      box.innerHTML = "";
    };
  }, []);
  return (
    <>
      {!drawn && (
        <div className="schedule__loading" role="status">
          <span aria-hidden="true"></span>
          Loading the live timetable…
        </div>
      )}
      <div id="ribbon-schedule"></div>
      <div ref={host} style={{ display: "contents" }}></div>
    </>
  );
}
