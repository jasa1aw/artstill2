import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { homeDictionary } from "@/lib/dictionaries/home";

export function B2BSection({ locale }: { locale: Locale }) {
  const t = homeDictionary[locale].b2b;

  return (
    <section className="sales-b2b-section" id="b2b">
      <div className="sales-b2b-heading">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
        <p>{t.lead}</p>
      </div>
      <div className="sales-b2b-content">
        <ul>
          {t.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="sales-b2b-action">
          <strong>{t.promise}</strong>
          <Link className="button button-primary" href={`/${locale}/estimate`}>
            {t.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
