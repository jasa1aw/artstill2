export type EstimateStepDictionary = {
  /** Короткая подпись для чипа в прогресс-баре. */
  chip: string;
  title: string;
  hint: string;
};

export type EstimateFormDictionary = {
  fields: {
    name: string;
    phone: string;
    city: string;
    objectType: string;
    service: string;
    stage: string;
    installation: string;
    deadline: string;
    description: string;
  };
  placeholders: {
    name: string;
    phone: string;
    city: string;
    description: string;
  };
  /** Подсказка под полем- видна всегда, в отличие от placeholder. */
  hints: {
    phone: string;
    description: string;
  };
  options: {
    objectTypes: string[];
    services: string[];
    stages: string[];
    installation: string[];
    deadlines: string[];
  };
  steps: {
    contacts: EstimateStepDictionary;
    object: EstimateStepDictionary;
    task: EstimateStepDictionary;
    details: EstimateStepDictionary;
  };
  nav: {
    /** Шаблон с {step} и {total}. */
    progress: string;
    back: string;
    next: string;
    edit: string;
    optional: string;
  };
  review: {
    title: string;
    note: string;
    showText: string;
    hideText: string;
  };
  draft: {
    restored: string;
    clear: string;
  };
  /** Если браузер заблокировал popup wa.me. */
  fallback: {
    text: string;
    open: string;
    copy: string;
    copied: string;
  };
  consent: string;
  privacyLink: string;
  submit: string;
  sending: string;
  error: string;
  phoneError: string;
  success: string;
  fieldErrors: {
    name: string;
    phone: string;
    city: string;
    choice: string;
    consent: string;
  };
  message: {
    title: string;
    /** Подзаголовок сообщения: откуда пришла заявка. */
    source: string;
    sections: {
      contacts: string;
      object: string;
      task: string;
      description: string;
    };
    name: string;
    phone: string;
    city: string;
    objectType: string;
    service: string;
    stage: string;
    installation: string;
    deadline: string;
    description: string;
    empty: string;
  };
};

export type EstimateDictionary = {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; lead: string };
  brief: {
    eyebrow: string;
    title: string;
    intro: string;
  };
  sidebar: {
    prepareTitle: string;
    prepareItems: string[];
    nextTitle: string;
    nextItems: string[];
    note: string;
  };
  formFields: EstimateFormDictionary;
};
