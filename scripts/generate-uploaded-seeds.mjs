import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";

async function loadDotEnvLocal() {
  const envPath = join(process.cwd(), ".env.local");
  const source = await readFile(envPath, "utf8").catch(() => "");

  for (const line of source.split("\n")) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...valueParts] = trimmed.split("=");
    const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

await loadDotEnvLocal();

const adsDir = join(process.cwd(), "public", "ads");
const outputPath = join(process.cwd(), "src", "data", "additional-uploaded-seeds.ts");
const blueprintPath = join(process.cwd(), "src", "data", "uploaded-blueprints.json");
const creativesPath = join(process.cwd(), "src", "data", "creatives.ts");

const mimeByExt = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

const schema = {
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
    promptQuality: {
      type: "object",
      additionalProperties: false,
      properties: {
        exactness: { type: "number", minimum: 1, maximum: 10 },
        editability: { type: "number", minimum: 1, maximum: 10 },
        brandSafety: { type: "number", minimum: 1, maximum: 10 },
        confidenceNote: { type: "string" },
      },
      required: ["exactness", "editability", "brandSafety", "confidenceNote"],
    },
    modelVariants: {
      type: "object",
      additionalProperties: false,
      properties: {
        chatgpt: { type: "string" },
        midjourney: { type: "string" },
        ideogram: { type: "string" },
        flux: { type: "string" },
      },
      required: ["chatgpt", "midjourney", "ideogram", "flux"],
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
    "promptQuality",
    "modelVariants",
    "visualBlueprint",
  ],
};

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, value = "true"] = arg.replace(/^--/, "").split("=");
    return [key, value];
  }),
);

const limit = args.has("limit") ? Number(args.get("limit")) : Infinity;
const regenerateAll = args.has("all");
const model = process.env.IMAGE_TO_PROMPT_MODEL ?? "gpt-4.1-mini";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required.");
}

const manualSource = await readFile(creativesPath, "utf8");
const manuallySeeded = new Set(
  [...manualSource.matchAll(/\[\s*"([^"]+\.(?:jpg|jpeg|png|webp|gif|avif))"/gi)].map((match) => match[1]),
);

const existingSource = await readFile(outputPath, "utf8").catch(() => "");
const existingRows = new Map(
  [...existingSource.matchAll(/\[\s*\n\s*"([^"]+)",\s*\n\s*"([^"]+)",\s*\n\s*"([^"]+)",\s*\n\s*"([^"]+)",\s*\n\s*"([^"]+)",\s*\n\s*"([^"]+)"/g)].map(
    (match) => [match[1], match.slice(1)],
  ),
);
const existingBlueprints = JSON.parse(await readFile(blueprintPath, "utf8").catch(() => "{}"));

const files = (await readdir(adsDir))
  .filter((file) => mimeByExt[extname(file).toLowerCase()])
  .filter((file) => !manuallySeeded.has(file))
  .sort();

const rows = [];
let analyzed = 0;

async function persistRows() {
  const quote = (value) => JSON.stringify(value);
  const body = rows
    .map(
      ([filename, title, brandInspiration, industry, format, visualDirection]) => `  [
    ${quote(filename)},
    ${quote(title)},
    ${quote(brandInspiration)},
    ${quote(industry)},
    ${quote(format)},
    ${quote(visualDirection)}
  ],`,
    )
    .join("\n");

  await writeFile(
    outputPath,
    `import type { UploadedSeed } from "@/data/creatives";

export const additionalUploadedSeeds: UploadedSeed[] = [
${body}
];
`,
  );

  await writeFile(blueprintPath, `${JSON.stringify(existingBlueprints, null, 2)}\n`);
}

async function analyzeFile(file, dataUrl) {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          input: [
            {
              role: "system",
              content:
                "You are PromptSwipe's senior creative director and image-to-prompt specialist. Your job is to reverse-engineer tech/SaaS ad screenshots into reconstruction-grade prompts that can get roughly 80% of the way to the reference in one generation while staying legally safe. Do not claim to recover the original hidden prompt. Instead, create an exact reconstruction prompt: preserve composition, hierarchy, typography, spacing, subject placement, color, texture, lighting, margins, and ad format, while replacing real logos, trademarks, and exact protected copy with fictional equivalents. Write in a warm, plainspoken, quietly confident editorial voice. No hype, no exclamation marks.",
            },
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text:
                    "Analyze this ad image and return a complete PromptSwipe blueprint. The title must be the visible main headline when readable; otherwise use a literal visual label. reconstructionPrompt is the product: make it highly specific, long enough to preserve the reference's layout and visual system, and optimized for producing a close cousin in one shot. Include exact details about canvas ratio, background, object count, object placement, headline location, type scale, type mood, spacing, palette, lighting, texture, CTA placement, and what to avoid. fullPrompt should be a polished cross-tool prompt. modelVariants must be tailored separately for ChatGPT image generation, Midjourney, Ideogram, and Flux. whyItWorks should be actual creative analysis in a warm Robert Redford-like voice, never starting with 'This holds because'. promptQuality should score how likely the prompt is to recreate the reference structure.",
                },
                { type: "input_image", image_url: dataUrl, detail: "high" },
              ],
            },
          ],
          text: {
            format: {
              type: "json_schema",
              name: "promptswipe_blueprint",
              strict: true,
              schema,
            },
          },
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error?.message ?? `OpenAI request failed for ${file}`);
      }

      const outputText =
        payload.output_text ??
        payload.output?.flatMap((item) => item.content ?? []).find((content) => content.type === "output_text")?.text;

      return JSON.parse(outputText);
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      console.warn(`Retrying ${file} after attempt ${attempt} failed: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
    }
  }
}

for (const file of files) {
  const existing = existingRows.get(file);
  const existingBlueprint = existingBlueprints[file];

  if (existing && existingBlueprint && !regenerateAll) {
    rows.push(existing);
    continue;
  }

  if (analyzed >= limit) {
    if (existing) {
      rows.push(existing);
    }
    continue;
  }

  const ext = extname(file).toLowerCase();
  const image = await readFile(join(adsDir, file));
  const dataUrl = `data:${mimeByExt[ext]};base64,${image.toString("base64")}`;

  console.log(`Analyzing ${file}`);
  const blueprint = await analyzeFile(file, dataUrl);
  existingBlueprints[file] = blueprint;
  rows.push([
    file,
    blueprint.title,
    blueprint.brandInspiration,
    blueprint.industry,
    blueprint.format,
    blueprint.visualBlueprint.composition,
  ]);
  analyzed += 1;
  await persistRows();
}

await persistRows();

console.log(`Wrote ${rows.length} rows to ${outputPath}.`);
console.log(`Wrote ${Object.keys(existingBlueprints).length} blueprints to ${blueprintPath}.`);
console.log(`Analyzed ${analyzed} image(s).`);
