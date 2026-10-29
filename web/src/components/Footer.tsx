import Link from "next/link";
import { LOGO, MOMENCE_SHOP_URL, MOMENCE_VIDEOS } from "@/lib/site";

/** Link columns, six links each so they line up. Links starting with http open in a new tab. */
const COLUMNS: { title: string; links: [label: string, href: string][] }[] = [
  {
    title: "Classes",
    links: [
      ["Classes", "/pages/classes"],
      ["Timetable", "/pages/timetable"],
      ["Prices", "/pages/prices"],
      ["New Student Registration", "/pages/NewStudentRegistration"],
      ["Gift Vouchers", "/gift-vouchers"],
      ["Workplace Wellbeing", "/workplace-wellbeing"],
    ],
  },
  {
    title: "Studio",
    links: [
      ["About", "/pages/about"],
      ["Teachers", "/pages/teachers"],
      ["Gallery", "/pages/photo-gallery"],
      ["Teacher Training", "/pages/teacher-training"],
      ["Testimonials", "/pages/testimonials"],
      ["Contact", "/pages/contact-us"],
    ],
  },
  {
    title: "Resources",
    links: [
      ["Blog", "/pages/blog1"],
      ["Events", "/pages/events"],
      ["Videos", "/pages/videos"],
      ["On-demand Videos", MOMENCE_VIDEOS],
      ["Shop", MOMENCE_SHOP_URL],
      ["FAQs", "/pages/faqs"],
    ],
  },
];

/** Small outline icon for the Visit column */
function Ic({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link className="footer__logo" href="/pages/home" aria-label="The Yoga School, home">
              <img decoding="async" src={LOGO} alt="" width="180" height="180" loading="lazy" />
              <span>
                The Yoga School<small>Cairns · Knoff Yoga</small>
              </span>
            </Link>
            <p className="footer__tagline">Stretch your body, calm your mind.</p>
            <p className="footer__about">
              Our passion is to share the physical, mental and spiritual benefits of yoga. Beginners are always welcome.
            </p>
            <div className="socials">
              <a
                href="https://www.facebook.com/theyogaschoolaustralia/"
                target="_blank"
                rel="noopener"
                aria-label="The Yoga School on Facebook"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3Z"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/theyogaschoolcairns/"
                target="_blank"
                rel="noopener"
                aria-label="The Yoga School on Instagram"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <g fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
                  </g>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@theyogaschoolcairns5508"
                target="_blank"
                rel="noopener"
                aria-label="The Yoga School on YouTube"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3-5.2 3Z"
                  />
                </svg>
              </a>
            </div>
          </div>
          {COLUMNS.map((col) => (
            <nav className="footer__col" key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul className="footer__links">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    {href.startsWith("http") ? (
                      <a href={href} target="_blank" rel="noopener">
                        {label}
                        <span aria-hidden="true"> ↗</span>
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link href={href}>{label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="footer__visit">
            <h3>Visit</h3>
            <ul className="footer__contact">
              <li>
                <Ic d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21zM12 9.5h.01" />
                <address>
                  Suite 14, 159-161 Pease Street
                  <br />
                  Piccones Village, Edge Hill
                  <br />
                  Cairns QLD 4870, Australia
                </address>
              </li>
              <li>
                <Ic d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
                <a href="tel:+61412499700">0412 499 700</a>
              </li>
              <li>
                <Ic d="M4 6h16v12H4zM4 7l8 6 8-6" />
                <a href="mailto:info@theyogaschool.com.au">info@theyogaschool.com.au</a>
              </li>
              <li>
                <Ic d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 9a8 8 0 0 1 16 0" />
                <a href="https://momence.com/sign-in" target="_blank" rel="noopener">
                  Student Login<span aria-hidden="true"> ↗</span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} The Yoga School. All rights reserved.
            <span className="footer__sep" aria-hidden="true">
              ·
            </span>
            <Link href="/pages/terms-and-conditions">Terms &amp; Conditions</Link>
          </p>
          <p>
            Website by{" "}
            <a href="https://voolasoftwaresolutions.com/" target="_blank" rel="noopener">
              Voola Software Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
