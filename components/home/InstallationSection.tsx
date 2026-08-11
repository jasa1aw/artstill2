import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { homeDictionary } from "@/lib/dictionaries/home";
import { LeadTriggerButton } from "@/components/lead/LeadTriggerButton";

export function InstallationSection({ locale }: { locale: Locale }) {
  const t = homeDictionary[locale].installation;

  return (
    <section className="sales-installation-section" id="installation">
      <div className="sales-installation-image">
        <Image
          src={t.image}
          alt={t.alt}
          fill
          sizes="(max-width: 900px) 100vw, 52vw"
          style={{ objectFit: "cover" }}
        />
        <span></span>
      </div>
      <div className="sales-installation-copy">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
        <p>{t.lead}</p>
        <ul>
          {t.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <LeadTriggerButton label={t.cta} className="button button-primary" />
      </div>
    </section>
  );
}
