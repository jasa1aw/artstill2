import type { Locale } from "@/lib/i18n";
import { homeDictionary } from "@/lib/dictionaries/home";
import { AnimatedStat } from "./AnimatedStat";

export function FactsSection({ locale }: { locale: Locale }) {
  const facts = homeDictionary[locale].facts;

  return (
    <section className="sales-facts-section">
      {facts.map((fact) => (
        <article key={fact.label}>
          <AnimatedStat value={fact.value} />
          <span>{fact.label}</span>
        </article>
      ))}
    </section>
  );
}
