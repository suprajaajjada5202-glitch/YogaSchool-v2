import { MOMENCE_SHOP_URL } from "@/lib/site";
import type { Product } from "@/lib/types";
import { CtaLink } from "./CtaLink";
import { Use } from "./Icons";
import { Reveal } from "./Reveal";
import { SliderNav, SliderTrack } from "./Slider";

/** Props first: these are what most students come back for. */
const PRIORITY = /mat|block|bolster|stool|cushion|belt|strap|eye pillow|roller|sandbag|barrel|neti/i;

/** "Shop the studio" banner: real products (with photos) from the studio's shop, auto-scrolling. The button opens the
    Momence shop and each product its own Momence page, in a new tab. */
export function ShopBanner({ products }: { products: Product[] }) {
  const withPhotos = products.filter((p) => p.image);
  const picks = [...withPhotos.filter((p) => PRIORITY.test(p.name)), ...withPhotos.filter((p) => !PRIORITY.test(p.name))].slice(
    0,
    12,
  );
  if (!picks.length) return null;
  return (
    <section className="section section--dark on-dark clip-x shop-banner" aria-labelledby="shop-title">
      <div className="container">
        <Reveal className="section-head section-head--row">
          <div>
            <p className="eyebrow">Shop the studio</p>
            <h2 id="shop-title">
              Props for your <em>practice</em>
            </h2>
            <p className="lead">Mats, blocks, bolsters, meditation stools, books and more. Members get 10% off retail.</p>
          </div>
          <SliderNav target="shop-track" prevLabel="Previous products" nextLabel="Next products" pauseLabel="Pause products">
            <a className="btn btn--teal btn--sm" href={MOMENCE_SHOP_URL} target="_blank" rel="noopener">
              Browse the shop <Use id="i-arrow" />
            </a>
          </SliderNav>
        </Reveal>
        <Reveal className="slider slider--4">
          <SliderTrack id="shop-track" label="Products, scroll horizontally" auto={3500}>
            {picks.map((p) => (
              <li className="slide" key={p.name}>
                <CtaLink className="shop-card" href={p.ctaUrl || MOMENCE_SHOP_URL}>
                  <span className="shop-card__media">
                    <img
                      src={p.image!.src}
                      alt={p.image!.alt}
                      width={p.image!.width}
                      height={p.image!.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="shop-card__name">{p.name}</span>
                  <span className="shop-card__price">{p.priceLabel}</span>
                </CtaLink>
              </li>
            ))}
          </SliderTrack>
        </Reveal>
      </div>
    </section>
  );
}
