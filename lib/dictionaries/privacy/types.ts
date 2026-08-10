export type PrivacyDictionary = {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; lead: string; updatedLabel: string; updatedDate: string };
  articles: { title: string; paragraphs: string[] }[];
};
