export type Industry =
  | "Devtools"
  | "Fintech"
  | "AI"
  | "Productivity"
  | "Security"
  | "Collaboration";

export type Format =
  | "Static"
  | "Carousel"
  | "LinkedIn"
  | "X/Twitter"
  | "Meta"
  | "Launch"
  | "Comparison"
  | "Founder-led";

export type BrandInspiration =
  | "Ramp"
  | "Cursor"
  | "Claude"
  | "Notion"
  | "Linear"
  | "Wiz"
  | "Superhuman"
  | "Vercel"
  | "Stripe"
  | "Figma";

export type Creative = {
  id: string;
  title: string;
  slug: string;
  brandInspiration: BrandInspiration;
  industry: Industry;
  format: Format;
  visualStyleTags: string[];
  premium: boolean;
  shortDescription: string;
  whyItWorks: string;
  structureNotes: string;
  fullPrompt: string;
  reconstructionPrompt?: string;
  remixPrompt?: string;
  editableVariables: string[];
  negativePrompt: string;
  recommendedModel: string;
  aspectRatio: string;
  remixNotes: string[];
  promptQuality?: {
    exactness: number;
    editability: number;
    brandSafety: number;
    confidenceNote: string;
  };
  oneShotConfidence?: "high" | "medium" | "low";
  oneShotRisk?: {
    score: number;
    reasons: string[];
  };
  modelVariants?: {
    chatgpt: string;
    midjourney: string;
    ideogram: string;
    flux: string;
  };
  visualBlueprint?: {
    composition: string;
    typography: string;
    palette: string[];
    subject: string;
    layout: string;
    styleTags: string[];
  };
  image?: string;
  visual: {
    headline: string;
    subline: string;
    background: string;
    accent: string;
    motif: "receipt" | "code" | "chat" | "docs" | "shield" | "timeline" | "mail" | "terminal" | "ledger" | "canvas";
  };
};
