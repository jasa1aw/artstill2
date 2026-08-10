import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { homeDictionary } from "@/lib/dictionaries/home";

/**
 * Фото плиток задаются в globals.css через
 * `.sales-catalog-grid article:nth-child(n):before` — в разметке их нет,
 * поэтому порядок и количество карточек (ровно 6) менять нельзя.
 */
export function CatalogSection({ locale }: { locale: Locale }) {
  const t = homeDictionary[locale].catalog;

  return (
    <section className="sales-catalog-section" id="catalog">
      <div className="sales-catalog-heading">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.title}</h2>
        </div>
        <div>
          <p>{t.lead}</p>
          <Link href={`/${locale}/catalog`}>
            {t.link}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <div className="sales-catalog-grid">
        {t.items.map((item) => (
          <article key={item.number}>
            <span>{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
