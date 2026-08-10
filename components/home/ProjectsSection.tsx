import Link from "next/link";
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
          <Link href={`/${locale}/projects`}>
            {t.link}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
      <div className="sales-projects-grid">
        {t.cards.map((card) => (
          <article key={card.number}>
            <Link className="sales-project-image" href={card.href}>
              <Image
                src={card.image}
                alt={card.alt}
                fill
                sizes="(max-width: 760px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
              />
              <span></span>
              <strong>{card.number}</strong>
            </Link>
            <div>
              <small>{card.category}</small>
              <h3>{card.title}</h3>
              <Link href={card.href}>
                {card.cta}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
