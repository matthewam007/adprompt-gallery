import uploadedSummariesSource from "@/data/uploaded-summaries.json";
import type { BrandInspiration, Creative, Format, Industry } from "@/types/creative";

export const industries: Array<"All" | Industry> = [
  "All",
  "Devtools",
  "Fintech",
  "AI",
  "Productivity",
  "Security",
  "Collaboration",
];

export const formats: Array<"All" | Format> = [
  "All",
  "Static",
  "Carousel",
  "LinkedIn",
  "X/Twitter",
  "Meta",
  "Launch",
  "Comparison",
  "Founder-led",
];

export const brandInspirations: BrandInspiration[] = [
  "Ramp",
  "Cursor",
  "Claude",
  "Notion",
  "Linear",
  "Wiz",
  "Superhuman",
  "Vercel",
  "Stripe",
  "Figma",
];

export type UploadedSeed = [
  filename: string,
  title: string,
  brandInspiration: BrandInspiration,
  industry: Industry,
  format: Format,
  visualDirection: string,
];

export const creatives = uploadedSummariesSource as Creative[];

export function getCreativeBySlug(slug: string) {
  return creatives.find((creative) => creative.slug === slug);
}
