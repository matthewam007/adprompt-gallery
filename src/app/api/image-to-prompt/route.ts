import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { NextResponse } from "next/server";
import { adPromptBlueprintSchema } from "@/lib/image-to-prompt-schema";

const mimeByExt: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function POST(request: Request) {
  const { imagePath } = (await request.json()) as { imagePath?: string };

  if (!imagePath || !imagePath.startsWith("/ads/")) {
    return NextResponse.json({ error: "Pass an imagePath from /ads." }, { status: 400 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set. Add it to .env.local to analyze images." },
      { status: 500 },
    );
  }

  const normalized = normalize(imagePath).replace(/^(\.\.[/\\])+/, "");
  const absolutePath = join(process.cwd(), "public", normalized);
  const ext = extname(absolutePath).toLowerCase();
  const mime = mimeByExt[ext];

  if (!mime) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }

  const image = await readFile(absolutePath);
  const dataUrl = `data:${mime};base64,${image.toString("base64")}`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.IMAGE_TO_PROMPT_MODEL ?? "gpt-5.1",
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
            {
              type: "input_image",
              image_url: dataUrl,
              detail: "high",
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "ad_prompt_blueprint",
          strict: true,
          schema: adPromptBlueprintSchema,
        },
      },
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: payload.error?.message ?? "OpenAI request failed." }, { status: 500 });
  }

  const outputText = payload.output_text ?? payload.output?.flatMap((item: any) => item.content ?? [])
    .find((content: any) => content.type === "output_text")?.text;

  if (!outputText) {
    return NextResponse.json({ error: "No structured output returned.", raw: payload }, { status: 500 });
  }

  return NextResponse.json({ blueprint: JSON.parse(outputText) });
}
