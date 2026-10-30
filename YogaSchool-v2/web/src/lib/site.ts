export const SITE_URL = "https://theyogaschool.com.au";
export const LOGO =
  "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/Site_Logo2.png";
export const OFFER_URL = "https://momence.com/The-Yoga-School/membership/30-days-$99-NS-intro-offer-special!/113989";
/** Google Maps embed of the studio (Contact page, home page "Locate us") */
export const MAP_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d954.6893892806809!2d145.7398414291665!3d-16.91193361616657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x697864372f355dc9:0xb1f69afbf68bcaa2!2sThe+Yoga+School!5e0!3m2!1sen!2sau!4v1534855194268";

export const MOMENCE_VIDEOS = "https://momence.com/video/plugin/23652";
/** Membership Terms & Conditions (2026 V2 PDF, applies to all three memberships), as linked from the live site's
    prices page. Note: /pages/terms-and-conditions holds the older terms page from the live site. */
export const MEMBERSHIP_TERMS_PDF =
  "https://3989ac5bcbe1edfc864a-0a7f10f87519dba22d2dbc6233a731e5.ssl.cf2.rackcdn.com/TheYogaSchool/the-yoga-school/Terms_and_conditions_2026_V2.pdf";
/** The Momence online shop: the menu's and the footer's "Shop" (as on the live site), in a new tab */
export const MOMENCE_SHOP_URL = "https://momence.com/The-Yoga-School/products/23652";

/** "Book a Class" (header bar and the phone menu) */
export const BOOK_URL = "/pages/timetable";

/* ---------- Main menu (components/Header.tsx, components/MegaMenu.tsx) ----------
   Laid out to the client's mockup: Classes ▾ · Timetable · Memberships · Workshops · About ▾ · Shop, then "Book a Class".
   Every page the old site's menu linked to is still in here, once: the pages the mockup's bar leaves out sit in the
   Classes and About mega menus. Links starting with http (Momence) open in a new tab. */

export type NavLink = { href: string; label: string; sub?: string };
/** A titled column of links in a mega menu */
export type NavGroup = { title: string; links: NavLink[] };
/** The highlighted card at the end of a mega menu */
export type NavCard = {
  href: string;
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  img: string;
  width: number;
  height: number;
};
/** A bar entry: a plain link, or a mega menu (a button opening columns of links and a card) */
export type NavEntry = { label: string; href: string } | { label: string; id: string; groups: NavGroup[]; card: NavCard };

export const NAV: NavEntry[] = [
  {
    label: "Classes",
    id: "classes",
    groups: [
      {
        title: "Classes",
        links: [
          { href: "/pages/classes", label: "Classes & levels", sub: "Knoff Yoga, Yin, Chair & Shoshin" },
          { href: "/pages/prices#passes", label: "Class passes", sub: "Drop-ins & class packs" },
          { href: "/gift-vouchers", label: "Gift vouchers", sub: "Give the gift of yoga" },
        ],
      },
      {
        title: "New here?",
        links: [
          { href: "/pages/NewStudentRegistration", label: "New student registration", sub: "Before your first class" },
          { href: "/pages/faqs", label: "FAQs", sub: "Good to know" },
        ],
      },
      {
        title: "Go deeper",
        links: [
          { href: "/pages/teacher-training", label: "Teacher Training", sub: "With the Masters" },
          { href: "/workplace-wellbeing", label: "Workplace Wellbeing", sub: "Yoga for your team" },
        ],
      },
      {
        title: "Practise at home",
        links: [
          { href: "/pages/videos", label: "Videos", sub: "Watch and learn" },
          { href: MOMENCE_VIDEOS, label: "On-demand videos", sub: "Stream classes at home" },
        ],
      },
    ],
    card: {
      href: OFFER_URL,
      eyebrow: "New students",
      title: "30 days unlimited for $99",
      text: "Unlimited classes for your first month.",
      cta: "Claim the offer",
      img: "/images/gallery/DSC00180.jpg",
      width: 1000,
      height: 714,
    },
  },
  { label: "Timetable", href: "/pages/timetable" },
  { label: "Memberships", href: "/pages/prices" },
  { label: "Workshops", href: "/pages/events" },
  {
    label: "About",
    id: "about",
    groups: [
      {
        title: "Our school",
        links: [
          { href: "/pages/about", label: "About us", sub: "Our story & Knoff Yoga" },
          { href: "/pages/teachers", label: "Teachers", sub: "Meet the team" },
          { href: "/pages/photo-gallery", label: "Gallery", sub: "Inside the studio" },
        ],
      },
      {
        title: "Community",
        links: [
          { href: "/pages/testimonials", label: "Testimonials", sub: "Student stories" },
          { href: "/pages/blog1", label: "Blog", sub: "Reflections on practice" },
        ],
      },
    ],
    card: {
      href: "/pages/contact-us",
      eyebrow: "Visit us",
      title: "Edge Hill, Cairns",
      text: "Suite 14, 159-161 Pease Street, Piccones Village",
      cta: "Contact us",
      img: "/images/headers/empty-studio.jpg",
      width: 800,
      height: 300,
    },
  },
  { label: "Shop", href: MOMENCE_SHOP_URL },
];

export const isExternal = (href: string) => /^https?:/.test(href);
