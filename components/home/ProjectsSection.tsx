import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { homeDictionary } from "@/lib/dictionaries/home";

export function ProjectsSection({ locale }: { locale: Locale }) {
  const t = homeDictionary[locale].projects;

  return (
    <section className="sales-projects-section" id="projects">
      <div className="sales-projects-heading">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.title}</h2>
        </div>
        <div>
          <p>{t.lead}</p>
        </div>
      </div>
      <div className="sales-projects-grid">
        {t.cards.map((card) => (
          <article key={card.number}>
            <div className="sales-project-image">
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(max-width: 760px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
              />
              <span></span>
              <strong>{card.number}</strong>
            </div>
            <div>
              <small>{card.category}</small>
              <h3>{card.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
