export const SITE_URL = "https://theyogaschool.com.au";
export const LOGO =
  "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/Site_Logo2.png";
export const OFFER_URL = "https://momence.com/The-Yoga-School/membership/30-days-$99-NS-intro-offer-special!/113989";
/** Google Maps embed of the studio (Contact page, home page "Locate us") */
export const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d954.6893892806809!2d145.7398414291665!3d-16.91193361616657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x697864372f355dc9:0xb1f69afbf68bcaa2!2sThe+Yoga+School!5e0!3m2!1sen!2sau!4v1534855194268";

export type NavItem = { href: string; label: string; sub: string; icon: string };

const I = {
  home: "M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z",
  about: "M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z",
  classes: "M4 19V5M4 19h16M8 15V9M12 15V7M16 15v-3",
  teachers: "M9 8a3 3 0 1 0 0 .01M3 20a6 6 0 0 1 12 0M17 11a2.5 2.5 0 1 0 0-.01M15.5 20a4.5 4.5 0 0 1 5.5-4.4",
  training: "M2 9l10-5 10 5-10 5zM6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5",
  schedule: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
  prices: "M20 12l-8 8-8-8V4h8zM8 8h.01",
  gallery: "M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15 9h.01",
  events: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M9 15l2 2 4-4",
  testimonials: "M7 7h4v4H8c0 2 1 3 3 3v2c-3 0-4-2-4-5zM14 7h4v4h-3c0 2 1 3 3 3v2c-3 0-4-2-4-5z",
  blog: "M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h4",
  faqs: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z",
  workplace: "M4 8h16v12H4zM9 8V5h6v3M4 13h16",
  contact: "M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 9.5h.01",
  shop: "M6 7h12l-1 13H7zM9 7a3 3 0 0 1 6 0",
  gift: "M4 8h16v12H4zM12 8v12M4 12h16M12 8S10.5 3 8 3.8C5.8 4.5 7 8 12 8zm0 0s1.5-5 4-4.2C18.2 4.5 17 8 12 8z",
  ticket: "M4 7h16v3a2 2 0 0 0 0 4v3H4v-3a2 2 0 0 0 0-4zM14 7v10",
  video: "M4 6h12v12H4zM16 10l4-2v8l-4-2",
  offer: "M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6L12 16.8l-5.4 2.6 1.2-6-4.5-4.1 6.1-.7z",
};
export const MOMENCE_VIDEOS = "https://momence.com/video/plugin/23652";
/** Membership Terms & Conditions (2026 V2 PDF, applies to all three memberships), as linked from the live site's
    prices page. Note: /pages/terms-and-conditions holds the older terms page from the live site. */
export const MEMBERSHIP_TERMS_PDF =
  "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/the-yoga-school/Terms_and_conditions_2026_V2.pdf";
/** The Momence online shop: the menu's "Shop" and "Props & equipment" links and the footer's, in a new tab */
export const MOMENCE_SHOP_URL = "https://momence.com/The-Yoga-School/products/23652";

const N = (href: string, label: string, sub: string, icon: string): NavItem => ({ href, label, sub, icon });

/** A desktop bar entry; one with children also opens a dropdown (on hover or keyboard focus) */
export type NavEntry = NavItem & { children?: NavItem[] };

/** "About" dropdown (as on the old site: Teachers and Gallery sit under About; "About" itself opens the About page) */
export const ABOUT: NavItem[] = [
  N("/pages/teachers", "Teachers", "Meet the team", I.teachers),
  N("/pages/photo-gallery", "Gallery", "Inside the studio", I.gallery),
];

/** "Shop" dropdown (same three links as the old site's Shop menu). "Shop" itself and "Props & equipment" open the
    Momence online shop. Links starting with http open Momence in a new tab. */
export const SHOP: NavItem[] = [
  N("/pages/prices#passes", "Class passes", "Drop-ins, class packs & unlimited", I.ticket),
  N(MOMENCE_SHOP_URL, "Props & equipment", "Mats, blocks, books & more", I.shop),
  N(MOMENCE_VIDEOS, "On-demand videos", "Practise at home", I.video),
];

/** Desktop bar, in the old site's menu order. Entries that don't fit the bar move into "More" (components/Header.tsx). */
export const NAV: NavEntry[] = [
  N("/pages/home", "Home", "Welcome", I.home),
  N("/pages/classes", "Classes", "Levels 1–4 & more", I.classes),
  N("/pages/timetable", "Timetable", "Live timetable", I.schedule),
  N("/pages/prices", "Prices", "Passes & memberships", I.prices),
  { ...N("/pages/about", "About", "Our story", I.about), children: ABOUT },
  { ...N(MOMENCE_SHOP_URL, "Shop", "Online shop", I.shop), children: SHOP },
  N("/pages/events", "Events", "Workshops & specials", I.events),
  N("/pages/blog1", "Blog", "Reflections on practice", I.blog),
  N("/pages/teacher-training", "Teacher Training", "With the Masters", I.training),
  N("/pages/testimonials", "Testimonials", "Student stories", I.testimonials),
  N("/pages/contact-us", "Contact", "Visit or call us", I.contact),
];

/** Always in "More": pages the old menu didn't list, and the new student offer (Momence, in a new tab) */
export const MORE: NavItem[] = [
  N("/pages/faqs", "FAQs", "Good to know", I.faqs),
  N(OFFER_URL, "New Student Offer", "30 days unlimited for $99", I.offer),
  N("/workplace-wellbeing", "Workplace", "Team wellbeing", I.workplace),
  N("/gift-vouchers", "Gift vouchers", "Give the gift of yoga", I.gift),
];

/** Bar entries as plain links (a dropdown is its own link, then its items), each page once. */
export function flatNav(entries: NavEntry[]): NavItem[] {
  const seen = new Set<string>();
  return entries.flatMap((n) => [n, ...(n.children ?? [])]).filter((n) => !seen.has(n.href) && seen.add(n.href));
}

/** Mobile menu tiles: everything, in menu order */
export const TILES: NavItem[] = flatNav([...NAV, ...MORE]);

/** Mobile menu sections, by href (pages keep their TILES labels and links) */
const MENU_GROUPS: [string, string[]][] = [
  ["Explore", ["/pages/home", "/pages/classes", "/pages/timetable", "/pages/prices", "/pages/prices#passes"]],
  ["Learning", ["/pages/teacher-training", MOMENCE_VIDEOS, "/pages/blog1"]],
  ["Community", ["/pages/about", "/pages/teachers", "/pages/events", "/pages/testimonials", "/pages/photo-gallery"]],
  ["More", [MOMENCE_SHOP_URL, "/gift-vouchers", "/workplace-wellbeing", "/pages/faqs", "/pages/contact-us"]],
];

/** Mobile menu: every page in TILES, in sections. A page not placed in MENU_GROUPS lands in the last section, so a
    new menu entry never goes missing from the phone menu. */
export const MENU_SECTIONS: { title: string; items: NavItem[] }[] = MENU_GROUPS.map(([title, hrefs], i) => ({
  title,
  items: [
    ...hrefs.flatMap((h) => TILES.filter((t) => t.href === h)),
    ...(i === MENU_GROUPS.length - 1 ? TILES.filter((t) => !MENU_GROUPS.some(([, g]) => g.includes(t.href))) : []),
  ],
}));
