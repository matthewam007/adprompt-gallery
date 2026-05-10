import { NextResponse } from "next/server";
import { getCreativeBySlug } from "@/data/creatives";
import uploadedBlueprintsSource from "@/data/uploaded-blueprints.json";
import type { PromptSwipeBlueprint } from "@/lib/image-to-prompt-schema";
import type { BrandInspiration, Format, Industry } from "@/types/creative";

const uploadedBlueprints = uploadedBlueprintsSource as Record<string, PromptSwipeBlueprint | undefined>;

type CreativeRouteProps = {
  params: {
    slug: string;
  };
};

export function GET(_request: Request, { params }: CreativeRouteProps) {
  const summary = getCreativeBySlug(params.slug);

  if (!summary?.image) {
    return NextResponse.json({ error: "Creative not found." }, { status: 404 });
  }

  const filename = summary.image.replace(/^\/ads\//, "");
  const blueprint = uploadedBlueprints[filename];

  if (!blueprint) {
    return NextResponse.json({ error: "Prompt not ready." }, { status: 404 });
  }

  return NextResponse.json({
    creative: {
      ...summary,
      title: blueprint.title,
      brandInspiration: blueprint.brandInspiration as BrandInspiration,
      industry: blueprint.industry as Industry,
      format: blueprint.format as Format,
      visualStyleTags: blueprint.visualBlueprint.styleTags,
      shortDescription: blueprint.shortDescription,
      whyItWorks: blueprint.whyItWorks,
      structureNotes: blueprint.structureNotes,
      fullPrompt: blueprint.fullPrompt,
      reconstructionPrompt: blueprint.reconstructionPrompt,
      remixPrompt: blueprint.remixPrompt,
      editableVariables: blueprint.editableVariables,
      negativePrompt: blueprint.negativePrompt,
      recommendedModel: blueprint.recommendedModel,
      aspectRatio: blueprint.aspectRatio,
      remixNotes: blueprint.remixNotes,
      promptQuality: blueprint.promptQuality,
      modelVariants: blueprint.modelVariants,
      visualBlueprint: blueprint.visualBlueprint,
      visual: {
        ...summary.visual,
        headline: blueprint.title,
      },
    },
  });
}
