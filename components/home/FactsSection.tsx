import type { Locale } from "@/lib/i18n";
import { homeDictionary } from "@/lib/dictionaries/home";

export function FactsSection({ locale }: { locale: Locale }) {
  const facts = homeDictionary[locale].facts;

  return (
    <section className="sales-facts-section">
      {facts.map((fact) => (
        <article key={fact.label}>
          <strong>{fact.value}</strong>
          <span>{fact.label}</span>
        </article>
      ))}
    </section>
  );
}
