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
      model: process.env.IMAGE_TO_PROMPT_MODEL ?? "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are an expert creative director reverse-engineering tech and SaaS ad references into high-fidelity AI image prompts. The main value is a one-shot reconstruction prompt that can generate an ad very close to the reference's visual structure. For title, transcribe the visible main headline exactly when it is readable, preserving wording but not brand marks. If there is no readable headline, write a short literal descriptive title based on the main visual idea. Never use filenames, campaign codes, generic placeholders, or guessed brand names as titles. Do not copy protected logos, real brand marks, exact proprietary copy into generated ad prompts, or trademarked characters. Do preserve composition, framing, object count, spacing, palette, type style, hierarchy, lighting, texture, and mood in precise language.",
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Analyze this ad image. Return a reusable prompt and teardown for PromptSwipe. The title must be the readable main ad headline if present; otherwise use a concise literal label for the image's core concept. fullPrompt and reconstructionPrompt must be reconstruction-grade: exact enough to produce a very similar ad in one shot while replacing real logos/brand marks and exact source copy with fictional equivalents. Include canvas ratio, background, object placement, headline position, typography, color palette, lighting, visual metaphor, hierarchy, texture, margins, and exclusions. remixPrompt should be looser and designed for iteration.",
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
