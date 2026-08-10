import type { EstimateDictionary } from "./types";

export const estimateEn: EstimateDictionary = {
  meta: {
    title: "Tell us about your project- Art Stil",
    description:
      "Complete the short brief. WhatsApp will then open with a structured message ready for the Art Stil manager.",
  },
  hero: {
    eyebrow: "Initial project estimate",
    title: "Tell us about your project",
    lead: "Complete the short brief. WhatsApp will then open with a structured message ready for the Art Stil manager.",
  },
  brief: {
    eyebrow: "Project brief",
    title: "Essential property information",
    intro:
      "The form takes approximately two minutes. The final price can be determined after reviewing dimensions, photographs or drawings.",
  },
  sidebar: {
    prepareTitle: "Useful materials to prepare",
    prepareItems: [
      "Photographs of the existing facade",
      "Architectural drawings or visualisations",
      "Approximate building dimensions",
      "References for the preferred decor",
    ],
    nextTitle: "What happens next",
    nextItems: [
      "The manager reviews the information",
      "Any missing details are clarified",
      "Photographs or drawings are requested",
      "An initial proposal is prepared",
    ],
    note: "Photographs and documents can be attached directly in WhatsApp after submitting the brief.",
  },
  formFields: {
    fields: {
      name: "Your name",
      phone: "Phone or WhatsApp",
      city: "Project location",
      objectType: "Property type",
      service: "Required service",
      stage: "Project stage",
      installation: "Installation requirements",
      deadline: "Expected schedule",
      description: "Brief project description",
    },
    placeholders: {
      name: "For example, Arman",
      phone: "+7 700 000 00 00",
      city: "For example, Almaty",
      description: "Describe the facade, approximate dimensions and whether drawings or photographs are available...",
    },
    selectPlaceholder: "Select an option",
    options: {
      objectTypes: ["Private residence", "Residential development", "Commercial building", "Public building", "Facade reconstruction", "Other property"],
      services: ["Complete facade decoration", "Cornices and mouldings", "Columns and capitals", "Window surrounds", "Balustrades and arches", "Facade panels", "Bespoke architectural products", "Initial consultation"],
      stages: ["Architectural project is ready", "Sketch or visualisation is available", "Property is under construction", "Property is already completed", "Reconstruction is planned", "Initial concept only"],
      installation: ["Installation is required", "Delivery without installation", "Installation supervision", "Not decided yet"],
      deadlines: ["As soon as possible", "Within 1 month", "Within 1–3 months", "After 3 months", "Schedule not decided yet"],
    },
    consent: "I consent to the processing of the submitted information for a project consultation.",
    privacyLink: "Privacy policy",
    submit: "Send brief via WhatsApp",
    sending: "Preparing the message…",
    error: "Please complete all required fields.",
    phoneError: "Please check the phone number. It must contain at least 7 digits.",
    success: "The brief is ready. Press Send in the WhatsApp window that opened.",
    message: {
      title: "New Art Stil website enquiry",
      name: "Name",
      phone: "Phone",
      city: "Project location",
      objectType: "Property type",
      service: "Required service",
      stage: "Project stage",
      installation: "Installation",
      deadline: "Schedule",
      description: "Description",
      empty: "Not provided",
    },
  },
};
