import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { OfferPopup } from "@/components/OfferPopup";
import { Sprite } from "@/components/Sprite";

/** Shared chrome for every public page: icons, header + menu, footer, new-student offer popup. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Sprite />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <OfferPopup />
    </>
  );
}
