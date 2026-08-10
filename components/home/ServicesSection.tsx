import type { Locale } from "@/lib/i18n";
import { homeDictionary } from "@/lib/dictionaries/home";

/**
 * Фото карточек задаются в globals.css через
 * `.services-visual-section article:nth-child(n):before` — в разметке
 * их нет, поэтому порядок и количество карточек (ровно 3) менять нельзя.
 */
export function ServicesSection({ locale }: { locale: Locale }) {
  const t = homeDictionary[locale].services;

  return (
    <section className="services-section services-visual-section" id="services">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.title}</h2>
        </div>
        <p>{t.lead}</p>
      </div>
      <div className="service-grid">
        {t.cards.map((card) => (
          <article className="service-card" key={card.number}>
            <span className="service-number">{card.number}</span>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
