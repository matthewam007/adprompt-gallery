# Prompt Quality Pipeline

PromptSwipe sells reconstruction-grade prompts, not guesses from filenames.

For uploaded ad references, run:

```bash
npm run generate:uploaded-seeds -- --limit=20
```

Use `--all` only when intentionally refreshing the whole library.

The generator analyzes each image with a vision model and writes:

- `src/data/additional-uploaded-seeds.ts` for gallery metadata.
- `src/data/uploaded-blueprints.json` for reconstruction prompts, remix prompts, model variants, visual blueprint, and quality scores.

The gallery prefers `uploaded-blueprints.json` whenever a blueprint exists. Without a blueprint, the app falls back to a conservative template prompt.

Required local env:

```bash
OPENAI_API_KEY=sk-...
IMAGE_TO_PROMPT_MODEL=gpt-4.1
```

Quality standard:

- `reconstructionPrompt` should get roughly 80% of the way to the reference structure in one generation.
- Preserve layout, spacing, typography, subject placement, palette, and rhythm.
- Replace real logos, trademarks, exact protected copy, and proprietary brand marks with fictional equivalents.
- `modelVariants` should be tailored for ChatGPT image generation, Midjourney, Ideogram, and Flux.
- Anything with low exactness or weak brand safety should stay unpublished until edited.
