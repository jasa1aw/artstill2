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
  selectPlaceholder: string;
  options: {
    objectTypes: string[];
    services: string[];
    stages: string[];
    installation: string[];
    deadlines: string[];
  };
  consent: string;
  privacyLink: string;
  submit: string;
  sending: string;
  error: string;
  phoneError: string;
  success: string;
  message: {
    title: string;
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
