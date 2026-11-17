/* Momence's timetable widget script, served from this site (components/MomenceWidget.tsx).
   momence.com doesn't cache it at its CDN and, from some networks, sends it at ~1 KB/s: several
   minutes for its ~940 KB. Fetched here on the server and kept for an hour (refreshed in the
   background after that), it reaches visitors at normal speed and their browser caches it. */
const SRC = "https://momence.com/plugin/host-schedule/host-schedule.js";

export async function GET() {
  try {
    const res = await fetch(SRC, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Momence answered ${res.status}`);
    return new Response(await res.text(), {
      headers: {
        "Content-Type": "text/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    // The widget then loads straight from momence.com instead
    return new Response(null, { status: 502, headers: { "Cache-Control": "no-store" } });
  }
}
