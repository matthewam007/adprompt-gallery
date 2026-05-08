import type { Creative } from "@/types/creative";

const machineTitlePattern =
  /(?:uploaded reference|(?:^|\s)(?:png|jpg|jpeg|jfif|webp|gif)(?:\s|$)|copy|linkedin|static|brandlayer|persona|1200x1200|1080x1080|4x5|1x1|^[\d\s_-]+$|[a-f0-9]{12,}|[a-z][A-Z][a-z]|[A-Za-z]+\d|\d[A-Za-z]+)/;

const extensionPattern = /\.(?:jpg|jpeg|png|webp|gif)$/i;
const assetNoisePattern =
  /(?:png|jpg|jpeg|jfif|webp|gif|copy|linkedin|static|paid|social|single|image|ad|ads|square|brand|option|variation|campaign|1200|1080|4x5|1x1|2x|v\d+)/gi;

function normalizeTitle(value: string) {
  return value
    .replace(extensionPattern, "")
    .replace(assetNoisePattern, "")
    .replace(/[^a-z0-9]+/gi, "")
    .toLowerCase();
}

function looksFilenameDerived(creative: Creative, title: string) {
  if (!creative.image) {
    return false;
  }

  const filename = creative.image.split("/").pop() ?? "";
  const titleKey = normalizeTitle(title);
  const filenameKey = normalizeTitle(filename);

  if (titleKey.length < 6 || filenameKey.length < 6) {
    return false;
  }

  return filenameKey.includes(titleKey) || titleKey.includes(filenameKey);
}

export function getDisplayTitle(creative: Creative) {
  const title = creative.title.trim();

  if (!title || machineTitlePattern.test(title) || looksFilenameDerived(creative, title)) {
    return null;
  }

  return title;
}

export function getAccessibleTitle(creative: Creative) {
  return getDisplayTitle(creative) ?? `${creative.brandInspiration}-style ${creative.format} ad`;
}

export function hasReliableMetadata(creative: Creative) {
  return !creative.id.startsWith("uploaded-");
}

export function getSearchText(creative: Creative) {
  return [
    getDisplayTitle(creative),
    creative.title,
    creative.brandInspiration,
    creative.industry,
    creative.format,
    creative.shortDescription,
    creative.whyItWorks,
    creative.structureNotes,
    creative.fullPrompt,
    creative.reconstructionPrompt,
    creative.remixPrompt,
    creative.negativePrompt,
    creative.editableVariables.join(" "),
    creative.remixNotes.join(" "),
    creative.visualStyleTags.join(" "),
    creative.visual.headline,
    creative.visual.subline,
    creative.visual.motif,
    creative.image?.replace(/^\/ads\//, "").replace(/[-_.]/g, " "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
