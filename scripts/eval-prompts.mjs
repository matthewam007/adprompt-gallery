import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";

async function loadDotEnvLocal() {
  const source = await readFile(join(process.cwd(), ".env.local"), "utf8").catch(() => "");
  for (const line of source.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const [k, ...rest] = t.split("=");
    const v = rest.join("=").trim().replace(/^["']|["']$/g, "");
    if (k && !process.env[k]) process.env[k] = v;
  }
}
await loadDotEnvLocal();

if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY required");

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v = "true"] = a.replace(/^--/, "").split("=");
    return [k, v];
  }),
);
const sampleSize = Number(args.get("n") ?? 15);
const seed = args.has("seed") ? Number(args.get("seed")) : Date.now();
const confidenceFilter = args.get("confidence"); // "high", "medium", "low", or "high,medium"
const evalDir = join(process.cwd(), "eval");
const outDir = join(evalDir, "output");
await mkdir(outDir, { recursive: true });

const blueprints = JSON.parse(await readFile(join(process.cwd(), "src/data/uploaded-blueprints.json"), "utf8"));
let all = Object.entries(blueprints);

if (confidenceFilter) {
  const allowed = new Set(confidenceFilter.split(",").map((s) => s.trim()));
  all = all.filter(([, bp]) => allowed.has(bp.oneShotConfidence));
  console.log(`filtering to oneShotConfidence in {${[...allowed].join(",")}}: ${all.length} available`);
}

// seeded shuffle (Mulberry32)
function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(seed);
const shuffled = all.slice().sort(() => rng() - 0.5);
const sample = shuffled.slice(0, sampleSize);

console.log(`eval: n=${sampleSize} seed=${seed}`);

function pickSize(aspectRatio) {
  // gpt-image-1 supports: 1024x1024, 1024x1536 (portrait), 1536x1024 (landscape)
  if (!aspectRatio) return "1024x1024";
  const [w, h] = aspectRatio.split(":").map(Number);
  if (!w || !h) return "1024x1024";
  if (h > w) return "1024x1536";
  if (w > h) return "1536x1024";
  return "1024x1024";
}

const results = [];
let i = 0;
for (const [filename, blueprint] of sample) {
  i += 1;
  const prompt = blueprint?.modelVariants?.chatgpt;
  if (!prompt) {
    console.log(`[${i}/${sampleSize}] SKIP ${filename} (no chatgpt variant)`);
    continue;
  }

  const size = pickSize(blueprint.aspectRatio);
  process.stdout.write(`[${i}/${sampleSize}] ${filename} (${size}) ... `);

  const t0 = Date.now();
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size,
      n: 1,
      quality: "medium",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.log(`FAIL (${res.status})`);
    console.log("  ", text.slice(0, 300));
    results.push({ filename, ok: false, error: `${res.status}: ${text.slice(0, 200)}`, size });
    continue;
  }

  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) {
    console.log("FAIL (no b64_json)");
    results.push({ filename, ok: false, error: "no b64_json", size });
    continue;
  }

  const ext = ".png";
  const baseName = filename.replace(/\.[^.]+$/, "");
  const outFile = `${baseName}${ext}`;
  await writeFile(join(outDir, outFile), Buffer.from(b64, "base64"));

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`ok (${elapsed}s)`);
  results.push({
    filename,
    ok: true,
    size,
    output: outFile,
    title: blueprint.title,
    brand: blueprint.brandInspiration,
    industry: blueprint.industry,
    format: blueprint.format,
    aspectRatio: blueprint.aspectRatio,
    promptQuality: blueprint.promptQuality,
    prompt,
    reconstructionPrompt: blueprint.reconstructionPrompt,
  });
}

await writeFile(join(evalDir, "results.json"), JSON.stringify({ seed, results }, null, 2));
console.log(`\nresults written to eval/results.json`);
console.log(`open eval/index.html in a browser to review`);
