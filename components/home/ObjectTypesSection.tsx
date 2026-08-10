import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { homeDictionary } from "@/lib/dictionaries/home";

export function ObjectTypesSection({ locale }: { locale: Locale }) {
  const t = homeDictionary[locale].objectTypes;

  return (
    <section className="sales-object-section" id="object-types">
      <div className="sales-section-heading">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
        <p>{t.lead}</p>
      </div>
      <div className="sales-object-grid">
        {t.cards.map((card) => (
          <article className="sales-object-card" key={card.number}>
            <div className="sales-object-image">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(max-width: 760px) 100vw, 25vw"
                style={{ objectFit: "cover" }}
              />
              <span></span>
              <strong>{card.number}</strong>
            </div>
            <div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
