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
const creativesPath = join(process.cwd(), "src", "data", "creatives.ts");

const mimeByExt = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
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
    visualDirection: { type: "string" },
  },
  required: ["title", "brandInspiration", "industry", "format", "visualDirection"],
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
  [...manualSource.matchAll(/\[\s*"([^"]+\.(?:jpg|jpeg|png|webp|gif))"/gi)].map((match) => match[1]),
);

const existingSource = await readFile(outputPath, "utf8").catch(() => "");
const existingRows = new Map(
  [...existingSource.matchAll(/\[\s*\n\s*"([^"]+)",\s*\n\s*"([^"]+)",\s*\n\s*"([^"]+)",\s*\n\s*"([^"]+)",\s*\n\s*"([^"]+)",\s*\n\s*"([^"]+)"/g)].map(
    (match) => [match[1], match.slice(1)],
  ),
);

const files = (await readdir(adsDir))
  .filter((file) => mimeByExt[extname(file).toLowerCase()])
  .filter((file) => !manuallySeeded.has(file))
  .sort();

const rows = [];
let analyzed = 0;

for (const file of files) {
  const existing = existingRows.get(file);
  const title = existing?.[1] ?? "";
  const looksMachineNamed =
    !title ||
    title === "Uploaded Reference" ||
    /(?:png|jpg|jpeg|copy|LinkedIn|Static|BrandLayer|Persona|[A-Z0-9]{5,})/.test(title);

  if (existing && !looksMachineNamed && !regenerateAll) {
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
            "You label tech/SaaS ad references for a curated gallery. Accuracy beats cleverness. Title must be the visible main headline when readable. If the headline spans multiple lines, join it naturally with spaces. If no readable headline exists, use a short literal title for the main visual idea. Do not use filenames, campaign IDs, dates, dimensions, channel names, or guessed brand names as titles. Do not editorialize with clever alternate titles.",
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Return metadata for this ad. The title should be relevant to the exact ad creative shown, not the file name. Choose the closest allowed brand inspiration by design language, not by any visible real logo. visualDirection should be a specific one-sentence description of the image's composition, subject, palette, typography, and layout.",
            },
            { type: "input_image", image_url: dataUrl, detail: "high" },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "uploaded_seed",
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
  const seed = JSON.parse(outputText);
  rows.push([file, seed.title, seed.brandInspiration, seed.industry, seed.format, seed.visualDirection]);
  analyzed += 1;
}

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

console.log(`Wrote ${rows.length} rows to ${outputPath}. Analyzed ${analyzed} image(s).`);
