import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { homeDictionary } from "@/lib/dictionaries/home";

export function TexturesSection({ locale }: { locale: Locale }) {
  const t = homeDictionary[locale].textures;

  return (
    <section className="sales-textures-section" id="textures">
      <div className="sales-section-heading sales-textures-heading">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2>{t.title}</h2>
        <p>{t.lead}</p>
      </div>
      <div className="sales-textures-grid">
        {t.items.map((item) => (
          <article key={item.title}>
            <div className="sales-texture-image">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 760px) 50vw, 17vw"
                style={{ objectFit: "cover" }}
              />
              <span></span>
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </article>
        ))}
      </div>
      <p className="sales-texture-note">{t.note}</p>
    </section>
  );
}
