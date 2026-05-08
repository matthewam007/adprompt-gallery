"use client";

import { useMemo, useState } from "react";
import { CreativeDetail } from "@/components/CreativeDetail";
import { FilterBar, type Filters } from "@/components/FilterBar";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Nav } from "@/components/Nav";
import { PricingModal } from "@/components/PricingModal";
import { creatives } from "@/data/creatives";
import { getAccessibleTitle, getSearchText } from "@/lib/creative-display";

const initialFilters: Filters = {
  industry: "All",
  format: "All",
  brand: "All",
};

export default function Home() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [memberAccess, setMemberAccess] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>([]);

  const filteredCreatives = useMemo(() => {
    const query = search.trim().toLowerCase();

    return creatives.filter((creative) => {
      const industryMatch = filters.industry === "All" || creative.industry === filters.industry;
      const formatMatch = filters.format === "All" || creative.format === filters.format;
      const brandMatch = filters.brand === "All" || creative.brandInspiration === filters.brand;
      const searchMatch = query.length === 0 || getSearchText(creative).includes(query);

      return industryMatch && formatMatch && brandMatch && searchMatch;
    });
  }, [filters, search]);

  const selectedCreative = creatives.find((creative) => creative.slug === selectedSlug) ?? null;

  const unlockCreative = (slug: string) => {
    setUnlocked((current) => (current.includes(slug) ? current : [...current, slug]));
  };

  return (
    <main>
      <Nav onPricing={() => setPricingOpen(true)} search={search} onSearch={setSearch} />
      <section className="shell intro">
        <p>A hand-picked library of prompts behind ads worth studying.</p>
        <div className="member-toggle">
          <span>{memberAccess ? "Member access on" : "Browse without signing in"}</span>
          <button
            type="button"
            aria-pressed={memberAccess}
            onClick={() => setMemberAccess((value) => !value)}
          >
            {memberAccess ? "Member" : "Demo unlock"}
          </button>
        </div>
      </section>
      <section className="shell gallery-tools" aria-label="Browse controls">
        <FilterBar filters={filters} onChange={setFilters} />
      </section>
      <section className="shell gallery-pane">
        <GalleryGrid
          creatives={filteredCreatives}
          onSelect={setSelectedSlug}
          isUnlocked={(creative) => memberAccess || !creative.premium || unlocked.includes(creative.slug)}
        />
      </section>
      {selectedCreative ? (
        <div className="detail-backdrop" role="dialog" aria-modal="true" aria-label={`${getAccessibleTitle(selectedCreative)} detail`}>
        <CreativeDetail
          creative={selectedCreative}
          unlocked={memberAccess || !selectedCreative.premium || unlocked.includes(selectedCreative.slug)}
          onOpenPricing={() => setPricingOpen(true)}
          onClose={() => setSelectedSlug(null)}
        />
        </div>
      ) : null}
      <PricingModal
        open={pricingOpen}
        onClose={() => setPricingOpen(false)}
        onSingleUnlock={() => {
          if (selectedCreative) {
            unlockCreative(selectedCreative.slug);
          }
          setPricingOpen(false);
        }}
        onMembership={() => {
          setMemberAccess(true);
          setPricingOpen(false);
        }}
      />
    </main>
  );
}
