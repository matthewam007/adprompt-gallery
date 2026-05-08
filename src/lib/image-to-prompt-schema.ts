export const adPromptBlueprintSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    brandInspiration: {
      type: "string",
      enum: ["Ramp", "Cursor", "Claude", "Notion", "Linear", "Wiz", "Superhuman", "Vercel", "Stripe", "Figma"],
    },
    industry: {
      type: "string",
      enum: ["Devtools", "Fintech", "AI", "Productivity", "Security", "Collaboration"],
    },
    format: {
      type: "string",
      enum: ["Static", "Carousel", "LinkedIn", "X/Twitter", "Meta", "Launch", "Comparison", "Founder-led"],
    },
    shortDescription: { type: "string" },
    whyItWorks: { type: "string" },
    structureNotes: { type: "string" },
    fullPrompt: { type: "string" },
    reconstructionPrompt: { type: "string" },
    remixPrompt: { type: "string" },
    editableVariables: {
      type: "array",
      items: { type: "string" },
    },
    negativePrompt: { type: "string" },
    recommendedModel: { type: "string" },
    aspectRatio: { type: "string" },
    remixNotes: {
      type: "array",
      items: { type: "string" },
    },
    visualBlueprint: {
      type: "object",
      additionalProperties: false,
      properties: {
        composition: { type: "string" },
        typography: { type: "string" },
        palette: {
          type: "array",
          items: { type: "string" },
        },
        subject: { type: "string" },
        layout: { type: "string" },
        styleTags: {
          type: "array",
          items: { type: "string" },
        },
      },
      required: ["composition", "typography", "palette", "subject", "layout", "styleTags"],
    },
  },
  required: [
    "title",
    "brandInspiration",
    "industry",
    "format",
    "shortDescription",
    "whyItWorks",
    "structureNotes",
    "fullPrompt",
    "reconstructionPrompt",
    "remixPrompt",
    "editableVariables",
    "negativePrompt",
    "recommendedModel",
    "aspectRatio",
    "remixNotes",
    "visualBlueprint",
  ],
} as const;

export type PromptSwipeBlueprint = {
  title: string;
  brandInspiration: string;
  industry: string;
  format: string;
  shortDescription: string;
  whyItWorks: string;
  structureNotes: string;
  fullPrompt: string;
  reconstructionPrompt: string;
  remixPrompt: string;
  editableVariables: string[];
  negativePrompt: string;
  recommendedModel: string;
  aspectRatio: string;
  remixNotes: string[];
  visualBlueprint: {
    composition: string;
    typography: string;
    palette: string[];
    subject: string;
    layout: string;
    styleTags: string[];
  };
};
