import { AdPreview } from "@/components/AdPreview";
import type { Creative } from "@/types/creative";

type CreativeCardProps = {
  creative: Creative;
  onSelect: (slug: string) => void;
};

export function CreativeCard({ creative, onSelect }: CreativeCardProps) {
  return (
    <button
      type="button"
      className="creative-card"
      data-cursor
      onClick={() => onSelect(creative.slug)}
    >
      <span className="card-open-icon" aria-hidden="true">↗</span>
      <AdPreview creative={creative} />
    </button>
  );
}
