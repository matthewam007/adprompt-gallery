import { CreativeCard } from "@/components/CreativeCard";
import type { Creative } from "@/types/creative";

type GalleryGridProps = {
  creatives: Creative[];
  onSelect: (slug: string) => void;
  isUnlocked: (creative: Creative) => boolean;
};

export function GalleryGrid({ creatives, onSelect, isUnlocked }: GalleryGridProps) {
  if (creatives.length === 0) {
    return <div className="empty-state">No references in this set.</div>;
  }

  return (
    <div className="gallery-grid">
      {creatives.map((creative) => (
        <CreativeCard
          key={creative.id}
          creative={creative}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
