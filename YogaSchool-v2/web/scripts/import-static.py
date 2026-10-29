#!/usr/bin/env python3
"""One-time migration: copies page content + SEO metadata from the static site
(../pages/*.html etc.) into web/src/content so Next.js can render it at the same URLs.
Re-run only if you change the static pages:  python3 scripts/import-static.py"""
import html, json, os, re

WEB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC = os.path.dirname(WEB)
OUT = os.path.join(WEB, "scripts", "static-source")
os.makedirs(os.path.join(OUT, "pages"), exist_ok=True)
os.makedirs(os.path.join(OUT, "chrome"), exist_ok=True)

ROUTES = {"home": "pages/home.html", "workplace-wellbeing": "workplace-wellbeing.html", "gift-vouchers": "gift-vouchers.html"}
for f in sorted(os.listdir(os.path.join(STATIC, "pages"))):
    if f.endswith(".html") and not f.startswith("__") and f != "home.html":
        ROUTES[f[:-5]] = "pages/" + f
ROOT_LEVEL = {"workplace-wellbeing", "gift-vouchers"}
MOMENCE = re.compile(r'\s*<script async type="module" host_id="23652"[^>]*></script>')

def norm(s):
    s = re.sub(r'((?:src|href|data-src|data-full)=")(?:\.\./)*(images|assets)/', r'\1/\2/', s)
    return s

meta = {}
for key, rel in ROUTES.items():
    s = open(os.path.join(STATIC, rel), encoding="utf-8").read()
    get = lambda pat: (re.search(pat, s, re.S) or [None, None])[1]
    main = s[s.index('<main id="main">') + len('<main id="main">'):s.index("</main>")]
    momence = bool(MOMENCE.search(main))
    main = MOMENCE.sub("", main)
    if 'id="lightbox"' in s:  # gallery viewer lives outside <main> in the static page
        main += "\n" + s[s.index('  <dialog class="lightbox'):s.index("</dialog>", s.index('  <dialog class="lightbox')) + 9]
    assert "<script" not in re.sub(r"<noscript>.*?</noscript>", "", main, flags=re.S), key
    main = norm(main.strip("\n"))
    open(os.path.join(OUT, "pages", key + ".html"), "w", encoding="utf-8").write(main + "\n")
    meta[key] = {
        "path": ("/" if key in ROOT_LEVEL else "/pages/") + key,
        "title": html.unescape(get(r"<title>(.*?)</title>")),
        "description": html.unescape(get(r'<meta name="description" content="([^"]*)"')),
        "canonical": get(r'<link rel="canonical" href="([^"]*)"'),
        "ogType": get(r'<meta property="og:type" content="([^"]*)"'),
        "ogImage": get(r'<meta property="og:image" content="([^"]*)"'),
        "headerLight": 'class="site-header is-light' in s,
        "momence": momence,
        "jsonLd": [json.loads(x) for x in re.findall(r'<script type="application/ld\+json">\s*(.*?)\s*</script>', s, re.S)],
    }
meta["home"]["path"] = "/pages/home"
json.dump(meta, open(os.path.join(OUT, "pages.json"), "w", encoding="utf-8"), indent=2, ensure_ascii=False)

# Shared chrome that is identical on every page (header + menu are React components instead)
ref = open(os.path.join(STATIC, "pages/about.html"), encoding="utf-8").read()
chrome = {
    "sprite": ref[ref.index('<svg width="0" height="0"'):ref.index("</svg>", ref.index('<svg width="0" height="0"')) + 6],
    "footer": ref[ref.index('<footer class="site-footer'):ref.index("</footer>") + 9],
    "fab": ref[ref.index('<div class="fab">'):ref.index("</div>", ref.index('<div class="fab">')) + 6],
    "sheet": ref[ref.index('<dialog class="sheet"'):ref.index("</dialog>", ref.index('<dialog class="sheet"')) + 9],
}
for k, v in chrome.items():
    open(os.path.join(OUT, "chrome", k + ".html"), "w", encoding="utf-8").write(norm(v) + "\n")
print("imported", len(meta), "pages:", ", ".join(sorted(meta)))
print("momence widget on:", [k for k, m in meta.items() if m["momence"]])
