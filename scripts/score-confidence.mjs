import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const blueprintPath = join(process.cwd(), "src/data/uploaded-blueprints.json");
const blueprints = JSON.parse(await readFile(blueprintPath, "utf8"));

// Heuristics that correlate with image-gen failure modes observed in the n=15 eval:
//   - long literal quoted copy → models mangle it
//   - mentions of UI screenshots / interface chrome → not a thing models render well
//   - specific brand typography callouts (Linear's mono, Notion's pixel logotype, etc.)
//   - high overall word count in the prompt body (proxy for complex composition)

const UI_TERMS = [
  "spreadsheet", "browser window", "interface", "dashboard", "sidebar",
  "navigation panel", "editing panel", "software ui", "app ui",
  "browser tab", "menu bar", "toolbar", "modal",
];

const TYPOGRAPHY_RISK_TERMS = [
  "monospace", "mono typeface", "pixelated logotype", "stencil",
  "bespoke wordmark", "custom typeface", "letterform",
  "handwritten", "graffiti", "marquee text", "varsity",
];

function longQuoteRisk(prompt) {
  // count literal quoted strings >40 chars (smart or straight quotes)
  if (!prompt) return 0;
  const quotes = prompt.match(/['"‘’“”]([^'"‘’“”]{40,})['"‘’“”]/g) || [];
  return quotes.length;
}

function termHits(prompt, terms) {
  if (!prompt) return 0;
  const lower = prompt.toLowerCase();
  let hits = 0;
  for (const term of terms) {
    if (lower.includes(term)) hits += 1;
  }
  return hits;
}

function score(bp) {
  let risk = 0;
  const reasons = [];

  const text =
    `${bp.reconstructionPrompt ?? ""}\n${bp.fullPrompt ?? ""}\n${bp.modelVariants?.chatgpt ?? ""}`;

  // 1. long-quote risk: each long quote adds 1 risk point, capped at 2
  const lq = Math.min(2, longQuoteRisk(text));
  if (lq > 0) {
    risk += lq;
    reasons.push(`long-quoted-text(${lq})`);
  }

  // 2. UI screenshot mentions
  const ui = termHits(text, UI_TERMS);
  if (ui >= 2) {
    risk += 2;
    reasons.push(`ui-screenshot(${ui})`);
  } else if (ui === 1) {
    risk += 1;
    reasons.push("ui-screenshot(1)");
  }

  // 3. brand-typography risk
  const tg = termHits(text, TYPOGRAPHY_RISK_TERMS);
  if (tg >= 1) {
    risk += 1;
    reasons.push(`brand-typography(${tg})`);
  }

  // 4. prompt body length (proxy for complexity)
  const wc = (bp.reconstructionPrompt ?? "").split(/\s+/).filter(Boolean).length;
  if (wc > 250) {
    risk += 1;
    reasons.push(`long-prompt(${wc})`);
  }

  let confidence;
  if (risk >= 3) confidence = "low";
  else if (risk === 2) confidence = "medium";
  else confidence = "high";

  return { confidence, risk, reasons };
}

const tally = { high: 0, medium: 0, low: 0 };
const examples = { high: [], medium: [], low: [] };

for (const [key, bp] of Object.entries(blueprints)) {
  const { confidence, risk, reasons } = score(bp);
  bp.oneShotConfidence = confidence;
  bp.oneShotRisk = { score: risk, reasons };
  tally[confidence] += 1;
  if (examples[confidence].length < 3) {
    examples[confidence].push(`${key} (risk=${risk} ${reasons.join(",")}) — ${bp.title}`);
  }
}

await writeFile(blueprintPath, `${JSON.stringify(blueprints, null, 2)}\n`);

// Also patch uploaded-summaries.json so the app sees the new field at runtime
const summariesPath = join(process.cwd(), "src/data/uploaded-summaries.json");
const summaries = JSON.parse(await readFile(summariesPath, "utf8"));
let patched = 0;
for (const summary of summaries) {
  const imagePath = summary.image ?? "";
  const filename = imagePath.split("/").pop();
  const bp = blueprints[filename];
  if (bp?.oneShotConfidence) {
    summary.oneShotConfidence = bp.oneShotConfidence;
    summary.oneShotRisk = bp.oneShotRisk;
    patched += 1;
  }
}
await writeFile(summariesPath, `${JSON.stringify(summaries, null, 2)}\n`);
console.log(`patched ${patched}/${summaries.length} summaries with confidence field`);

console.log("scored", Object.keys(blueprints).length, "blueprints");
console.log("");
console.log(`  high:   ${tally.high} (${((tally.high / 360) * 100).toFixed(1)}%)`);
console.log(`  medium: ${tally.medium} (${((tally.medium / 360) * 100).toFixed(1)}%)`);
console.log(`  low:    ${tally.low} (${((tally.low / 360) * 100).toFixed(1)}%)`);
console.log("");
console.log("--- sample low confidence (would be members-only) ---");
examples.low.forEach((e) => console.log(`  ${e}`));
console.log("");
console.log("--- sample medium ---");
examples.medium.forEach((e) => console.log(`  ${e}`));
console.log("");
console.log("--- sample high ---");
examples.high.forEach((e) => console.log(`  ${e}`));

// sanity-check the eval samples we already rated
const evalRatings = {
  "exp4h2_donepng.jpeg": "off",
  "a8d90a5d159aa373e22cb2f696edd4cd.jpg": "off",
  "1762380632329.jpeg": "off",
  "9941495476bd0631eea5bd2497dd461d.jpg": "off",
};
console.log("\n--- predicted confidence for the 4 off-rated prompts ---");
for (const [key, vote] of Object.entries(evalRatings)) {
  const bp = blueprints[key];
  if (bp) console.log(`  ${vote} → predicted ${bp.oneShotConfidence} (risk=${bp.oneShotRisk.score} ${bp.oneShotRisk.reasons.join(",")}) — ${bp.title}`);
}
