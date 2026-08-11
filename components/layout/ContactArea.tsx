import type { Locale } from "@/lib/i18n";
import { layoutDictionary } from "@/lib/dictionaries/layout";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/site";
import { LeadTriggerButton } from "@/components/lead/LeadTriggerButton";

/** Золотая CTA-секция перед футером. Одинаковая на всех страницах сайта. */
export function ContactArea({ locale }: { locale: Locale }) {
  const t = layoutDictionary[locale].contact;

  return (
    <section className="contact-area" id="contacts">
      <div className="contact-area-inner">
        <div className="contact-heading">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2>{t.title}</h2>
          <p>{t.lead}</p>
          <LeadTriggerButton label={t.cta} className="button contact-main-button" />
        </div>
        <div className="contact-information">
          <article>
            <span className="contact-index">01</span>
            <div>
              <small>{t.phoneLabel}</small>
              <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
            </div>
          </article>
          <article>
            <span className="contact-index">02</span>
            <div>
              <small>{t.areaLabel}</small>
              <strong>{t.areaValue}</strong>
            </div>
          </article>
          <article>
            <span className="contact-index">03</span>
            <div>
              <small>{t.hoursLabel}</small>
              <strong>{t.hoursValue}</strong>
            </div>
          </article>
          <article>
            <span className="contact-index">04</span>
            <div>
              <small>{t.instagramLabel}</small>
              <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                {INSTAGRAM_HANDLE}
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
