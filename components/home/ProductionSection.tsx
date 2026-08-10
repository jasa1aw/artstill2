import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { homeDictionary } from "@/lib/dictionaries/home";

export function ProductionSection({ locale }: { locale: Locale }) {
  const t = homeDictionary[locale].production;

  return (
    <section className="sales-production-section" id="production">
      <div className="sales-production-intro">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.title}</h2>
        </div>
        <p>{t.lead}</p>
      </div>
      <div className="sales-production-layout">
        <div className="sales-production-photos">
          <figure>
            <Image
              src={t.photos[0].image}
              alt={t.photos[0].alt}
              fill
              sizes="(max-width: 900px) 100vw, 38vw"
              style={{ objectFit: "cover" }}
            />
          </figure>
          <figure>
            <Image
              src={t.photos[1].image}
              alt={t.photos[1].alt}
              fill
              sizes="(max-width: 900px) 100vw, 24vw"
              style={{ objectFit: "cover" }}
            />
          </figure>
        </div>
        <div className="sales-production-steps">
          {t.steps.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
