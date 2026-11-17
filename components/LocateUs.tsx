import Link from "next/link";
import { MAP_EMBED } from "@/lib/site";
import { Use } from "./Icons";
import { Reveal } from "./Reveal";

/** "Locate us" band at the end of the home page (as on the old site). The whole card opens the Contact page;
    the phone number, email and Kayak badge keep their own links. */
export function LocateUs() {
  return (
    <section className="section locate" aria-labelledby="locate-title">
      <div className="container">
        <Reveal className="locate__card">
          <div className="locate__info">
            <p className="eyebrow">Visit the studio</p>
            <h2 id="locate-title">
              <Link className="locate__link" href="/pages/contact-us">
                Locate <em>us</em>
                <span className="sr-only">: contact details and directions</span>
              </Link>
            </h2>
            <p className="locate__lead">We are located at:</p>
            <address>
              Suite 14, 159-161 Pease Street
              <br />
              Piccones Village, Edge Hill
              <br />
              Cairns, Queensland 4870, Australia
            </address>
            <ul className="locate__contact">
              <li>
                <span>Mobile</span>
                <a href="tel:+61412499700">0412 499 700</a>
              </li>
              <li>
                <span>Email</span>
                <a href="mailto:info@theyogaschool.com.au">info@theyogaschool.com.au</a>
              </li>
            </ul>
            <span className="link-arrow locate__more" aria-hidden="true">
              Contact &amp; directions <Use id="i-arrow" />
            </span>
          </div>
          <div className="locate__map">
            {/* A preview only: clicks go to the Contact page (its map is interactive) */}
            <iframe
              title="Map showing The Yoga School at Piccones Village, Edge Hill, Cairns"
              src={MAP_EMBED}
              loading="lazy"
              tabIndex={-1}
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <a className="locate__kayak" href="https://www.kayak.com.au/Cairns.23637.guide" target="_blank" rel="noopener">
            <img src="/images/kayak-guides.png" alt="Find us on KAYAK Guides" width={755} height={601} loading="lazy" decoding="async" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
