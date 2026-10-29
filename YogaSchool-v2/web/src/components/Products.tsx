import type { Product } from "@/lib/types";
import { CtaLink } from "./CtaLink";
import { Use } from "./Icons";
import { Reveal } from "./Reveal";

export function Products({ products }: { products: Product[] }) {
  return (
    <div className="products">
      {products.map((p, n) => (
        <Reveal as="article" className="product" key={p.name} delay={n % 3 || undefined}>
          <div className={`product__media${p.image ? "" : " product__media--empty"}`}>
            {!p.image && (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  d="M6 7h12l-1 13H7L6 7Zm3 0a3 3 0 0 1 6 0"
                />
              </svg>
            )}
            {p.image && (
              <img
                decoding="async"
                src={p.image.src}
                alt={p.image.alt}
                width={p.image.width}
                height={p.image.height}
                loading="lazy"
              />
            )}
          </div>
          <div className="product__body">
            {p.category && <p className="post__by">{p.category}</p>}
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <div className="product__foot">
              <p className="product__price">{p.priceLabel}</p>
              {!p.ctaUrl ? (
                <span className="chip">{p.ctaLabel}</span>
              ) : (
                <CtaLink className={`btn ${p.ctaUrl.startsWith("/") ? "btn--outline" : "btn--primary"} btn--sm`} href={p.ctaUrl}>
                  {p.ctaLabel}
                  {!p.ctaUrl.startsWith("/") && (
                    <>
                      {" "}
                      <Use id="i-arrow" />
                    </>
                  )}
                </CtaLink>
              )}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
