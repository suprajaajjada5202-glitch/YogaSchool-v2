#!/usr/bin/env python3
"""One-time migration from the static site to Next.js.

Reads the approved static pages (web/src/content/pages/*.html, produced by import-static.py)
and writes:
  - src/data/*.ts        real content as typed data (teachers, classes, posts, gallery, ...)
  - src/views/*Page.tsx  each page as JSX server components; interactive parts become
                          React components (sliders, modals, forms, Supabase sections)
  - src/components/Footer.tsx, Sprite.tsx
Run:  python3 scripts/convert.py
"""
import html as H
import json
import os
import re
from html.parser import HTMLParser

WEB = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(WEB, "src")
CONTENT = os.path.join(WEB, "scripts", "static-source")
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr", "use", "path", "circle", "rect", "line", "polyline", "polygon", "ellipse", "stop"}


# ----------------------------------------------------------------------------- tiny DOM
class Node:
    def __init__(self, tag=None, attrs=None, text=None, comment=None, parent=None):
        self.tag, self.attrs, self.text, self.comment, self.parent = tag, dict(attrs or {}), text, comment, parent
        self.children = []

    def cls(self):
        return (self.attrs.get("class") or "").split()

    def has(self, c):
        return c in self.cls()

    def find_all(self, pred):
        out = []
        for c in self.children:
            if c.tag:
                if pred(c):
                    out.append(c)
                out.extend(c.find_all(pred))
        return out

    def find(self, pred):
        r = self.find_all(pred)
        return r[0] if r else None

    def text_content(self):
        if self.text is not None:
            return self.text
        return "".join(c.text_content() for c in self.children if c.comment is None)


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root")
        self.cur = self.root

    def handle_starttag(self, tag, attrs):
        n = Node(tag, [(k, v if v is not None else "") for k, v in attrs], parent=self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        n = Node(tag, [(k, v if v is not None else "") for k, v in attrs], parent=self.cur)
        self.cur.children.append(n)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(Node(text=data, parent=self.cur))

    def handle_comment(self, data):
        self.cur.children.append(Node(comment=data, parent=self.cur))


def parse(s):
    b = Builder()
    b.feed(s)
    return b.root


WS = " \t\n\r\f"  # HTML collapses only these; non-breaking spaces (\u00a0) are kept


def txt(n):
    return re.sub(f"[{WS}]+", " ", n.text_content() if n else "").strip(WS)


# ----------------------------------------------------------------------------- JSX emitter
ATTR_MAP = {
    "class": "className", "for": "htmlFor", "tabindex": "tabIndex", "readonly": "readOnly", "maxlength": "maxLength",
    "minlength": "minLength", "autocomplete": "autoComplete", "inputmode": "inputMode", "fetchpriority": "fetchPriority",
    "referrerpolicy": "referrerPolicy", "allowfullscreen": "allowFullScreen", "crossorigin": "crossOrigin",
    "viewbox": "viewBox", "preserveaspectratio": "preserveAspectRatio", "srcset": "srcSet", "colspan": "colSpan",
    "rowspan": "rowSpan", "frameborder": "frameBorder", "datetime": "dateTime", "novalidate": "noValidate",
    "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin",
    "fill-rule": "fillRule", "clip-rule": "clipRule", "stop-color": "stopColor", "xlink:href": "xlinkHref",
    "accept-charset": "acceptCharset", "http-equiv": "httpEquiv", "enterkeyhint": "enterKeyHint",
}
BOOL = {"hidden", "open", "required", "async", "defer", "novalidate", "allowfullscreen", "disabled", "multiple", "loop", "muted", "autoplay", "playsinline"}


def js_str(v):
    return json.dumps(v, ensure_ascii=False)


def style_obj(s):
    parts = []
    for decl in s.split(";"):
        if ":" not in decl:
            continue
        k, v = decl.split(":", 1)
        k, v = k.strip(), v.strip()
        if not k.startswith("--"):
            k = re.sub(r"-([a-z])", lambda m: m.group(1).upper(), k)
        parts.append(f"{js_str(k) if k.startswith('--') else k}: {js_str(v)}")
    return "{{ " + ", ".join(parts) + " }}"


def attrs_jsx(attrs, drop=()):
    out = []
    for k, v in attrs.items():
        if k in drop or k == "fetchpriority":
            continue
        name = ATTR_MAP.get(k, k)
        if k in BOOL and v in ("", k):
            out.append(name)
        elif k == "style":
            out.append(f"style={style_obj(v)}")
        elif k == "value":
            out.append(f"defaultValue={js_str(v)}")
        elif k == "checked":
            out.append("defaultChecked")
        elif k == "tabindex":
            out.append(f"tabIndex={{{int(v)}}}")
        elif '"' in v or "\n" in v:
            out.append(f"{name}={{{js_str(v)}}}")
        else:
            out.append(f'{name}="{v}"')
    return (" " + " ".join(out)) if out else ""


def text_jsx(t):
    if not t:
        return ""
    if t.strip(WS) == "":
        return '{" "}'
    lead = t[0] in WS
    trail = t[-1] in WS
    body = re.sub(f"[{WS}]+", " ", t).strip(WS)
    if re.search(r"[{}<>]", body):
        body = "{" + js_str(body) + "}"
    return ('{" "}' if lead else "") + body + ('{" "}' if trail else "")


def is_internal(href):
    if not href or not href.startswith("/") or href.startswith("//") or href.startswith("/admin"):
        return False
    path = href.split("#")[0].split("?")[0]
    return not re.search(r"\.[a-z0-9]+$", path)


class Ctx:
    def __init__(self, page):
        self.page = page
        self.imports = set()
        self.needs = set()
        self.data = {}  # extracted data modules: name -> python value


def children_jsx(n, ctx):
    return "".join(emit(c, ctx) for c in n.children)


def element(tag, attrs, inner, drop=()):
    a = attrs_jsx(attrs, drop)
    if tag in VOID and not inner.strip():
        return f"<{tag}{a} />"
    return f"<{tag}{a}>{inner}</{tag}>"


def emit(n, ctx):
    if n.comment is not None:
        c = n.comment.strip().replace("*/", "* /")
        return "{/* " + c + " */}"
    if n.text is not None:
        return text_jsx(n.text)
    r = special(n, ctx)
    if r is not None:
        return r
    attrs = dict(n.attrs)
    inner = children_jsx(n, ctx)
    # scroll-reveal -> <Reveal as="tag">
    if "reveal" in n.cls():
        ctx.imports.add("Reveal")
        rest = [c for c in n.cls() if c != "reveal"]
        if rest:
            attrs["class"] = " ".join(rest)
        else:
            attrs.pop("class", None)
        delay = attrs.pop("data-delay", None)
        as_attr = "" if n.tag == "div" else f' as="{n.tag}"'
        d = f' delay={{{delay}}}' if delay else ""
        return f"<Reveal{as_attr}{d}{attrs_jsx(attrs)}>{inner}</Reveal>"
    # internal navigation -> next/link
    if n.tag == "a" and is_internal(attrs.get("href")):
        ctx.imports.add("Link")
        return f"<Link{attrs_jsx(attrs)}>{inner}</Link>"
    return element(n.tag, attrs, inner)


# ----------------------------------------------------------------------------- interactive blocks
def img_data(img):
    return {"src": img.attrs.get("src") or img.attrs.get("data-src"), "alt": img.attrs.get("alt", ""),
            "width": int(img.attrs.get("width", 0) or 0), "height": int(img.attrs.get("height", 0) or 0)}


def special(n, ctx):
    c, a, t = n.cls(), n.attrs, n.tag
    if t == "section" and "hero" in c:
        ctx.imports.add("HeroSlider")
        ctx.data["heroSlides"] = [img_data(i) for i in n.find_all(lambda x: x.tag == "img" and x.parent.has("hero__slide"))]
        return "<HeroSlider />"
    if "tslider" in c:
        ctx.imports.add("TestimonialSlider")
        ctx.data["sliderTestimonials"] = [
            {"quote": txt(f.find(lambda x: x.tag == "blockquote")),
             "name": txt(f.find(lambda x: x.tag == "figcaption")).replace(txt(f.find(lambda x: x.tag == "span")), "").strip(),
             "role": txt(f.find(lambda x: x.tag == "span"))}
            for f in n.find_all(lambda x: x.has("tslide"))]
        return "<TestimonialSlider />"
    if "moments" in c:
        ctx.imports.add("MomentsStrip")
        first = n.find(lambda x: x.tag == "ul")
        ctx.data["moments"] = [img_data(i) for i in first.find_all(lambda x: x.tag == "img")]
        return "<MomentsStrip />"
    if a.get("id") == "gallery-grid":
        ctx.imports.add("Gallery")
        ctx.data["gallery"] = [dict(img_data(b.find(lambda x: x.tag == "img")), full=b.attrs["data-full"])
                               for b in n.find_all(lambda x: x.tag == "button")]
        return "<Gallery />"
    if t == "dialog" and a.get("id") == "lightbox":
        return ""
    if t == "button" and "data-video" in a:
        ctx.imports.add("VideoButton")
        dur = txt(n.find(lambda x: x.has("video__dur")))
        return f'<VideoButton id="{a["data-video"]}" title={js_str(H.unescape(a.get("data-title", "")))} duration="{dur}" />'
    if "yt" in c and n.find(lambda x: "data-yt" in x.attrs):
        ctx.imports.add("InlineYouTube")
        b = n.find(lambda x: "data-yt" in x.attrs)
        img = b.find(lambda x: x.tag == "img")
        return (f'<InlineYouTube id="{b.attrs["data-yt"]}" label={js_str(b.attrs.get("aria-label", ""))} '
                f'caption={js_str(txt(n.find(lambda x: x.has("yt__label"))))} thumb="{img.attrs["src"]}" />')
    if "slider__nav" in c:
        ctx.imports.add("SliderNav")
        prev = n.find(lambda x: x.attrs.get("data-dir") == "-1")
        nxt = n.find(lambda x: x.attrs.get("data-dir") == "1")
        auto = n.find(lambda x: "data-auto-toggle" in x.attrs)
        rest = "".join(emit(ch, ctx) for ch in n.children if not (ch.tag == "button" and ("data-dir" in ch.attrs or "data-auto-toggle" in ch.attrs)))
        props = f'target="{a["data-for"]}" prevLabel="{prev.attrs["aria-label"]}" nextLabel="{nxt.attrs["aria-label"]}"'
        if auto:
            props += f' pauseLabel="{auto.attrs["aria-label"]}"'
        return f"<SliderNav {props}>{rest}</SliderNav>" if rest.strip() not in ("", '{" "}') else f"<SliderNav {props} />"
    if t == "ul" and "slider__track" in c:
        ctx.imports.add("SliderTrack")
        extra = [x for x in c if x != "slider__track"]
        props = f'id="{a["id"]}" label={js_str(a.get("aria-label", ""))}'
        if extra:
            props += f' className="{" ".join(extra)}"'
        if a.get("data-auto"):
            props += f' auto={{{a["data-auto"]}}}'
        return f"<SliderTrack {props}>{children_jsx(n, ctx)}</SliderTrack>"
    if "slider__bar" in c:
        ctx.imports.add("SliderBar")
        return f'<SliderBar target="{a["data-bar-for"]}" />'
    if "tgrid" in c:
        ctx.imports.add("TeacherDirectory")
        return "<TeacherDirectory />"
    if a.get("id") == "teacher-profiles":
        return ""
    if t == "form" and a.get("id") == "contact-form":
        ctx.imports.add("ContactForm")
        return "<ContactForm />"
    sb = a.get("data-sb")
    if sb == "classes":
        ctx.imports.add("ClassRows"); ctx.needs.add("classes")
        return "<ClassRows classes={classes} />"
    if sb == "classes-jump":
        ctx.imports.add("ClassJump"); ctx.needs.add("classes")
        return "<ClassJump classes={classes} />"
    if sb == "timetable":
        ctx.imports.add("Timetable"); ctx.needs.add("timetable")
        return "<Timetable rows={timetable} />"
    if "data-sb-show-with" in a:
        return ""
    if "pricing" in c and t == "div":
        ctx.imports.add("MembershipCards"); ctx.needs.add("memberships")
        return "<MembershipCards plans={memberships} />"
    if sb == "passes":
        ctx.imports.add("PassesList"); ctx.needs.add("passes")
        fine = n.find(lambda x: x.has("fine-print"))
        return f"<PassesList groups={{passes}}>{emit(fine, ctx)}</PassesList>"
    if sb == "events":
        ctx.imports.add("UpcomingEvents"); ctx.needs.add("events")
        return "<UpcomingEvents events={events} />"
    if "pgrid" in c:
        ctx.imports.add("PostGrid"); ctx.needs.add("posts")
        expr = "posts" if ctx.page == "blog1" else "posts.slice(0, 3)"
        feat = " feature" if "pgrid--feature" in c else ""
        return f"<PostGrid posts={{{expr}}}{feat} />"
    if sb == "vouchers":
        ctx.imports.add("Vouchers"); ctx.needs.add("vouchers")
        attrs = {k: v for k, v in a.items() if k != "data-sb"}
        return f"<Vouchers vouchers={{vouchers}}>{element('div', attrs, children_jsx(n, ctx))}</Vouchers>"
    if sb == "shop":
        ctx.imports.add("Products"); ctx.needs.add("products")
        return "<Products products={products} />"
    if a.get("id") == "ribbon-schedule":
        ctx.imports.add("MomenceWidget")
        return "<MomenceWidget />"
    return None


# ----------------------------------------------------------------------------- data extraction
def extract_data():
    P = lambda name: parse(open(os.path.join(CONTENT, "pages", name + ".html"), encoding="utf-8").read())
    data = {}

    # Teachers (full profiles from the teachers page)
    tp = P("teachers")
    data["teachers"] = []
    for art in tp.find_all(lambda x: x.tag == "article" and x.parent.attrs.get("class") == "rows"):
        img = art.find(lambda x: x.tag == "img")
        data["teachers"].append({
            "slug": art.attrs["id"], "name": txt(art.find(lambda x: x.tag == "h2")),
            "role": txt(art.find(lambda x: x.has("row__sub"))), "spec": txt(art.find(lambda x: x.has("row__spec"))),
            "photo": img_data(img), "bio": [txt(p) for p in art.find(lambda x: x.has("prose")).find_all(lambda x: x.tag == "p")]})
    # Teacher cards on the home slider use the same people; nothing else to extract.

    # Classes (fallback when Supabase is empty)
    cp = P("classes")
    data["classes"] = []
    for art in cp.find_all(lambda x: x.tag == "article" and x.has("row")):
        chips = art.find_all(lambda x: x.has("chip"))
        dur = txt(chips[1]) if len(chips) > 1 else ""
        badge = art.find(lambda x: x.has("arch__badge"))
        data["classes"].append({
            "slug": art.attrs["id"].replace("class-", ""), "name": txt(art.find(lambda x: x.tag == "h2")),
            "level": txt(art.find(lambda x: x.has("row__sub"))), "duration": None if dur.startswith("[") else dur,
            "summary": txt(art.find(lambda x: x.has("row__spec"))),
            "description": [txt(p) for p in art.find(lambda x: x.has("prose")).find_all(lambda x: x.tag == "p")],
            "tag": txt(badge) if badge else None, "image": img_data(art.find(lambda x: x.tag == "img"))})

    # Blog posts
    cards = P("blog1")
    excerpts = {}
    for card in cards.find_all(lambda x: x.has("post__card")):
        link = card.find(lambda x: x.tag == "a")
        excerpts[link.attrs["href"].replace("/pages/blog-", "")] = txt(card.find(lambda x: x.tag == "p" and not x.has("post__by")))
    data["posts"] = []
    for slug in ["why-yoga", "you-cant-stop-the-waves", "james-bryan-yoga-and-the-body", "nicky-knoff-yoga-and-the-body", "healthy-vs-stagnant"]:
        p = P("blog-" + slug)
        img = p.find(lambda x: x.has("article__hero")).find(lambda x: x.tag == "img")
        author = txt(p.find(lambda x: x.has("article__meta")).find(lambda x: x.tag == "strong"))
        body = p.find(lambda x: x.tag == "article" and x.has("article")).find(lambda x: x.has("prose"))
        data["posts"].append({"slug": slug, "title": txt(p.find(lambda x: x.tag == "h1")), "author": author,
                              "excerpt": excerpts.get(slug, ""), "body": [txt(x) for x in body.find_all(lambda x: x.tag == "p")],
                              "image": img_data(img)})

    # Video library (videos page has the full list incl. the overview)
    vp = P("videos")
    data["videos"] = [{"id": b.attrs["data-video"], "title": H.unescape(b.attrs["data-title"]), "duration": txt(b.find(lambda x: x.has("video__dur")))}
                      for b in vp.find_all(lambda x: "data-video" in x.attrs)]

    # Testimonials page (full stories)
    tq = P("testimonials")
    data["testimonials"] = [{"name": txt(f.find(lambda x: x.tag == "figcaption")).replace(txt(f.find(lambda x: x.tag == "span" and x.parent.tag == "figcaption")), "").strip(),
                             "role": txt(f.find(lambda x: x.tag == "span" and x.parent.tag == "figcaption")),
                             "paragraphs": [txt(p) for p in f.find_all(lambda x: x.tag == "p")]}
                            for f in tq.find_all(lambda x: x.has("qcard"))]

    # Prices fallback (membership cards + passes lists)
    pp = P("prices")
    plans = []
    for art in pp.find_all(lambda x: x.has("plan")):
        price = art.find(lambda x: x.has("plan__price"))
        period = txt(price.find(lambda x: x.tag == "span")).lstrip("/ ").strip() if price.find(lambda x: x.tag == "span") else None
        cta = art.find(lambda x: x.tag == "a")
        badge = art.find(lambda x: x.has("plan__badge"))
        plans.append({"name": txt(art.find(lambda x: x.tag == "h3")), "description": txt(art.find(lambda x: x.has("plan__desc"))),
                      "priceLabel": txt(price).split("/")[0].strip(), "period": period,
                      "terms": txt(art.find(lambda x: x.has("plan__terms"))), "features": [txt(li) for li in art.find_all(lambda x: x.tag == "li")],
                      "badge": txt(badge) if badge else None, "featured": art.has("plan--featured"),
                      "ctaLabel": txt(cta), "ctaUrl": cta.attrs["href"]})
    data["memberships"] = plans
    groups = []
    for pl in pp.find(lambda x: x.has("passes__body")).find_all(lambda x: x.has("price-list")):
        cur = None
        for ch in pl.children:
            if ch.tag == "h4":
                cur = {"title": txt(ch), "items": [], "note": None}
                groups.append(cur)
            elif ch.tag == "ul" and cur:
                cur["items"] = [{"name": txt(li.children[0] if li.children[0].tag else li.find(lambda x: x.tag == "span")),
                                 "price": txt(li.find_all(lambda x: x.tag == "span")[-1])} for li in ch.find_all(lambda x: x.tag == "li")]
            elif ch.tag == "small" and cur:
                cur["note"] = txt(ch)
    data["passes"] = groups

    # Shop fallback
    sp = P("shop")
    data["products"] = []
    for art in sp.find_all(lambda x: x.has("product")):
        btn = art.find(lambda x: x.tag == "a" and x.has("btn"))
        img = art.find(lambda x: x.tag == "img")
        data["products"].append({"name": txt(art.find(lambda x: x.tag == "h3")), "category": txt(art.find(lambda x: x.has("post__by"))),
                                 "description": txt(art.find(lambda x: x.tag == "p" and not x.has("post__by") and not x.has("product__price"))),
                                 "priceLabel": txt(art.find(lambda x: x.has("product__price"))), "image": img_data(img) if img else None,
                                 "ctaLabel": txt(btn), "ctaUrl": btn.attrs["href"]})
    return data


TS_TYPES = {
    "teachers": "Teacher[]", "classes": "ClassItem[]", "posts": "Post[]", "videos": "Video[]", "testimonials": "Testimonial[]",
    "memberships": "Membership[]", "passes": "PassGroup[]", "products": "Product[]", "heroSlides": "Img[]",
    "sliderTestimonials": "ShortTestimonial[]", "moments": "Img[]", "gallery": "GalleryPhoto[]",
}


def write_data(data):
    os.makedirs(os.path.join(SRC, "data"), exist_ok=True)
    out = ['/* Content migrated from the approved static site (scripts/convert.py). Edit freely. */',
           'import type { ClassItem, GalleryPhoto, Img, Membership, PassGroup, Post, Product, ShortTestimonial, Teacher, Testimonial, Video } from "@/lib/types";', ""]
    for k in ["heroSlides", "moments", "gallery", "teachers", "classes", "posts", "videos", "sliderTestimonials", "testimonials", "memberships", "passes", "products"]:
        out.append(f"export const {k}: {TS_TYPES[k]} = {json.dumps(data[k], indent=2, ensure_ascii=False)};\n")
    open(os.path.join(SRC, "data", "content.ts"), "w", encoding="utf-8").write("\n".join(out))


# ----------------------------------------------------------------------------- pages
VIEWS = {  # page key -> component name
    "home": "HomePage", "about": "AboutPage", "classes": "ClassesPage", "teachers": "TeachersPage",
    "teacher-training": "TeacherTrainingPage", "timetable": "TimetablePage", "prices": "PricesPage",
    "photo-gallery": "GalleryPage", "events": "EventsPage", "testimonials": "TestimonialsPage", "blog1": "BlogPage",
    "faqs": "FaqsPage", "videos": "VideosPage", "contact-us": "ContactPage", "shop": "ShopPage",
    "workplace-wellbeing": "WorkplacePage", "gift-vouchers": "GiftVouchersPage",
}
COMPONENT_FROM = {
    "Link": "next/link", "Reveal": "@/components/Reveal", "HeroSlider": "@/components/HeroSlider",
    "TestimonialSlider": "@/components/TestimonialSlider", "MomentsStrip": "@/components/MomentsStrip", "Gallery": "@/components/Gallery",
    "VideoButton": "@/components/VideoButton", "InlineYouTube": "@/components/InlineYouTube", "SliderNav": "@/components/Slider",
    "SliderTrack": "@/components/Slider", "SliderBar": "@/components/Slider", "TeacherDirectory": "@/components/TeacherDirectory",
    "ContactForm": "@/components/ContactForm", "ClassRows": "@/components/ClassRows", "ClassJump": "@/components/ClassRows",
    "Timetable": "@/components/Timetable", "MembershipCards": "@/components/Prices", "PassesList": "@/components/Prices",
    "UpcomingEvents": "@/components/UpcomingEvents", "PostGrid": "@/components/PostGrid", "Vouchers": "@/components/Vouchers",
    "Products": "@/components/Products", "MomenceWidget": "@/components/MomenceWidget",
}
LOADERS = {"classes": "getClasses", "timetable": "getTimetable", "memberships": "getMemberships", "passes": "getPasses",
           "events": "getEvents", "posts": "getPosts", "vouchers": "getVouchers", "products": "getProducts"}


def import_lines(names):
    by = {}
    for n in sorted(names):
        by.setdefault(COMPONENT_FROM[n], []).append(n)
    lines = []
    for mod, ns in sorted(by.items()):
        if mod == "next/link":
            lines.append('import Link from "next/link";')
        elif len(ns) == 1 and mod.endswith("/" + ns[0]):
            lines.append(f'import {{ {ns[0]} }} from "{mod}";')
        else:
            lines.append(f'import {{ {", ".join(ns)} }} from "{mod}";')
    return lines


def convert_pages(collected):
    os.makedirs(os.path.join(SRC, "views"), exist_ok=True)
    for key, comp in VIEWS.items():
        root = parse(open(os.path.join(CONTENT, "pages", key + ".html"), encoding="utf-8").read())
        ctx = Ctx(key)
        body = children_jsx(root, ctx).strip()
        collected.update(ctx.data)
        needs = sorted(ctx.needs)
        lines = ['/* Converted from the static page; interactive parts are React components. */']
        lines += import_lines(ctx.imports)
        lines.append('import { JsonLd } from "@/components/JsonLd";')
        lines.append('import { seo } from "@/lib/seo";')
        if needs:
            lines.append(f'import {{ {", ".join(LOADERS[n] for n in needs)} }} from "@/lib/data";')
        lines.append("")
        is_async = bool(needs)
        lines.append(f"export default {'async ' if is_async else ''}function {comp}() {{")
        if needs:
            names = ", ".join(needs)
            calls = ", ".join(f"{LOADERS[n]}()" for n in needs)
            lines.append(f"  const [{names}] = await Promise.all([{calls}]);")
        lines.append("  return (")
        lines.append("    <>")
        lines.append("      " + body)
        lines.append(f'      <JsonLd data={{seo("{key}").jsonLd}} />')
        lines.append("    </>")
        lines.append("  );")
        lines.append("}")
        open(os.path.join(SRC, "views", comp + ".tsx"), "w", encoding="utf-8").write("\n".join(lines) + "\n")
        print("view", comp, "imports:", ",".join(sorted(ctx.imports)), "data:", ",".join(needs) or "-")


def convert_chrome():
    for name, comp in (("footer", "Footer"), ("sprite", "Sprite")):
        root = parse(open(os.path.join(CONTENT, "chrome", name + ".html"), encoding="utf-8").read())
        root.children = [c for c in root.children if not (c.text is not None and c.text.strip(WS) == "")]
        ctx = Ctx(name)
        body = children_jsx(root, ctx).strip().replace('<span id="year">2026</span>', "<span>{new Date().getFullYear()}</span>")
        imp = import_lines(ctx.imports)
        src = "\n".join(imp + ([""] if imp else []) + [f"export function {comp}() {{", "  return (", "    " + body, "  );", "}", ""])
        open(os.path.join(SRC, "components", comp + ".tsx"), "w", encoding="utf-8").write(src)
        print("component", comp)


if __name__ == "__main__":
    data = extract_data()
    convert_pages(data)
    convert_chrome()
    write_data(data)
    print("data:", {k: len(v) for k, v in data.items()})
