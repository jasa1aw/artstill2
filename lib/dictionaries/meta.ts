import type { Locale } from "@/lib/i18n";

export const siteMeta: Record<
  Locale,
  { title: string; description: string; ogLocale: string; areaServed: string }
> = {
  ru: {
    title: "Art Stil — архитектурный фасадный декор из стеклофибробетона",
    description:
      "Проектирование, производство, доставка и монтаж архитектурного фасадного декора из стеклофибробетона в Алматы и по Казахстану.",
    ogLocale: "ru_RU",
    areaServed: "Казахстан",
  },
  kk: {
    title: "Art Stil — шыныталшықты бетоннан сәулеттік қасбет декоры",
    description:
      "Алматыда және Қазақстан бойынша сәулеттік қасбет декорын жобалау, өндіру, жеткізу және монтаждау.",
    ogLocale: "kk_KZ",
    areaServed: "Қазақстан",
  },
  en: {
    title: "Art Stil — architectural GRC facade design and production",
    description:
      "Design, manufacturing, delivery and installation of architectural glass fibre reinforced concrete facade elements across Kazakhstan.",
    ogLocale: "en_US",
    areaServed: "Kazakhstan",
  },
};
