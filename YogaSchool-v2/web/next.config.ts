import path from "node:path";
import type { NextConfig } from "next";

/* SEO redirect map: every old URL Google knows (from the live sitemaps + a full crawl of
   theyogaschool.com.au) that isn't served as-is goes to its closest page here, with a 301
   (permanent) so search rankings carry over. 301 rather than 308 for the widest SEO-tool support. Pages already at the same URL need no entry. */
const SEO_REDIRECTS: [string, string][] = [
  // Old links to .html files (from the static build)
  ["/pages/:slug.html", "/pages/:slug"],
  ["/index.html", "/"],
  ["/admin/index.html", "/admin"],
  // The old CMS served every page at the site root too (e.g. /classes); the live URLs are /pages/...
  ["/about", "/pages/about"],
  ["/blog1", "/pages/blog1"],
  ["/classes", "/pages/classes"],
  ["/contact-us", "/pages/contact-us"],
  ["/events", "/pages/events"],
  ["/faqs", "/pages/faqs"],
  ["/photo-gallery", "/pages/photo-gallery"],
  ["/prices", "/pages/prices"],
  ["/shop", "/pages/shop"],
  ["/teacher-training", "/pages/teacher-training"],
  ["/teachers", "/pages/teachers"],
  ["/terms-and-conditions", "/pages/terms-and-conditions"],
  ["/testimonials", "/pages/testimonials"],
  ["/timetable", "/pages/timetable"],
  ["/videos", "/pages/videos"],
  ["/NewStudentRegistration", "/pages/NewStudentRegistration"],
  ["/pages/workplace-wellbeing", "/workplace-wellbeing"],
  ["/pages/gift-vouchers", "/gift-vouchers"],
  // Retired pages -> closest current page
  ["/location-map", "/pages/contact-us"],
  ["/pages/location-map", "/pages/contact-us"],
  ["/email", "/pages/contact-us"],
  ["/email-2", "/pages/contact-us"],
  ["/thank-you", "/pages/contact-us"],
  ["/our-friends", "/pages/teacher-training"],
  ["/pages/our-friends", "/pages/teacher-training"],
  ["/pricess", "/pages/prices"],
  ["/pages/pricess", "/pages/prices"],
  ["/prices-copy", "/pages/prices"],
  ["/prices-copy1", "/pages/prices"],
  ["/promotions", "/pages/prices"],
  ["/events-copy1", "/pages/events"],
  ["/service/events", "/pages/events"],
  ["/pages/feedback", "/pages/testimonials"],
  ["/meditation-seats", "/pages/shop"],
  ["/pages/meditation-seats", "/pages/shop"],
  ["/online-store", "/pages/shop"],
  ["/pages/online-store", "/pages/shop"],
  ["/shop1", "/pages/shop"],
  ["/products", "/pages/shop"],
  ["/products/:path*", "/pages/shop"],
  ["/service/store", "/pages/shop"],
  ["/service/store/:path*", "/pages/shop"],
  ["/apps/mindbody/:path*", "/pages/timetable"],
  // Blog: articles keep their original /blog/YYYY/MM/DD/slug URLs. Only dead or duplicate ones redirect.
  ["/blog", "/pages/blog1"],
  ["/blog/feed", "/pages/blog1"],
  ["/blog/:y/:m/:d/events", "/pages/events"],
  ["/blog/2013/04/03/the-yoga-school-test-post-1", "/pages/blog1"],
  ["/blog/2013/04/03/the-yoga-school-test-post-2", "/pages/blog1"],
  ["/blog/2014/06/24/fascia-release-with-yoga", "/blog/2014/06/24/fascia-release-with-yoga1"],
  ["/blog/2014/11/21/holiday-yoga-practice", "/blog/2014/11/21/holiday-yoga-practice1"],
  ["/blog/2015/03/04/progress-in-yoga1", "/blog/2015/03/04/progress-in-yoga"],
  // Temporary article URLs from the first rebuild (never live) -> original URLs
  ["/pages/blog-why-yoga", "/blog/2019/11/07/why-yoga-why-not-yoga"],
  ["/pages/blog-you-cant-stop-the-waves", "/blog/2018/02/07/you-cant-stop-the-waves"],
  [
    "/pages/blog-james-bryan-yoga-and-the-body",
    "/blog/2017/06/25/how-has-yoga-changed-your-relationship-with-your-body---james-bryan",
  ],
  [
    "/pages/blog-nicky-knoff-yoga-and-the-body",
    "/blog/2017/06/25/how-has-yoga-changed-your-relationship-with-your-body---nicky-knoff",
  ],
  ["/pages/blog-healthy-vs-stagnant", "/blog/2017/06/20/healthy-vs-stagnant"],
];

const nextConfig: NextConfig = {
  // Keep the live URLs exactly: /pages/home, /pages/classes … (no trailing slash, no .html)
  trailingSlash: false,
  // Allow live reload when opening the dev server from another device / the network address (dev only)
  allowedDevOrigins: ["192.168.1.*"],
  // This folder is the app root (the parent folder only has a shortcut package.json)
  turbopack: { root: path.join(__dirname) },
  async redirects() {
    return SEO_REDIRECTS.map(([source, destination]) => ({ source, destination, statusCode: 301 as const }));
  },
};

export default nextConfig;
