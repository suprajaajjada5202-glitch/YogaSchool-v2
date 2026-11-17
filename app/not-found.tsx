import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Sprite } from "@/components/Sprite";

export const metadata = { title: "Page not found | The Yoga School Cairns", robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <Sprite />
      <Header />
      <main id="main">
        <section className="page-hero" style={{ minHeight: "70vh" }}>
          <div className="container" style={{ position: "relative", zIndex: 1 }}>
            <p className="eyebrow">404</p>
            <h1>
              This page has <em>moved on</em>
            </h1>
            <p className="lead">The page you are looking for doesn’t exist. Try one of these instead.</p>
            <div className="page-hero__actions">
              <Link className="btn btn--primary" href="/pages/home">
                Home
              </Link>
              <Link className="btn btn--outline" href="/pages/classes">
                Classes
              </Link>
              <Link className="btn btn--outline" href="/pages/timetable">
                Timetable
              </Link>
              <Link className="btn btn--outline" href="/pages/contact-us">
                Contact
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
