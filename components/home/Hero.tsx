import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { homeDictionary } from "@/lib/dictionaries/home";

export function Hero({ locale }: { locale: Locale }) {
  const t = homeDictionary[locale].hero;

  return (
    <section className="hero">
      <div className="hero-grid">
        <div className="hero-content">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="hero-description">{t.description}</p>
          <p className="hero-sales-copy">{t.salesCopy}</p>
          <div className="hero-sales-promise">
            <span>01</span>
            <strong>{t.promise}</strong>
          </div>
          <div className="hero-actions">
            <Link className="button button-primary" href={`/${locale}/estimate`}>
              {t.ctaPrimary}
            </Link>
            <a className="button button-secondary" href="#projects">
              {t.ctaSecondary}
            </a>
          </div>
          <div className="hero-facts">
            {t.facts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="sun-disc"></div>
          <div className="building-frame">
            <div className="building-roof"></div>
            <div className="building-columns">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="building-base"></div>
          </div>
          <span className="vertical-caption">ARCHITECTURAL · FACADE · GRC</span>
        </div>
      </div>
      <div className="hero-scroll-line">
        <span></span>
        <small>ART STIL · ALMATY</small>
      </div>
    </section>
  );
}
