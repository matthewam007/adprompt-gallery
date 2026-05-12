"use client";

import { useEffect, useMemo, useState } from "react";
import { CreativeDetail } from "@/components/CreativeDetail";
import { FilterBar, type Filters } from "@/components/FilterBar";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Nav } from "@/components/Nav";
import { PricingModal } from "@/components/PricingModal";
import { creatives } from "@/data/creatives";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getAccessibleTitle, getSearchText } from "@/lib/creative-display";
import { getStoredAccess } from "@/lib/purchase-access";
import type { Creative } from "@/types/creative";
import Link from "next/link";

const initialFilters: Filters = {
  industry: "All",
  format: "All",
  brand: "All",
};

export default function Home() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [detailError, setDetailError] = useState("");
  const [pricingOpen, setPricingOpen] = useState(false);
  const [memberAccess, setMemberAccess] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState<"single" | "membership" | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

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

  useEffect(() => {
    trackEvent(analyticsEvents.viewedGallery, {
      totalCreatives: creatives.length,
    });

    const storedAccess = getStoredAccess();
    setMemberAccess(storedAccess.memberAccess);
    setUnlocked(storedAccess.unlockedPrompts);
  }, []);

  useEffect(() => {
    const query = search.trim();

    if (!query) {
      return;
    }

    const timeout = window.setTimeout(() => {
      trackEvent(analyticsEvents.searched, {
        query,
        resultCount: filteredCreatives.length,
      });
    }, 700);

    return () => window.clearTimeout(timeout);
  }, [filteredCreatives.length, search]);

  const startCheckout = async (type: "single" | "membership") => {
    trackEvent(
      type === "single"
        ? analyticsEvents.clickedSinglePromptCheckout
        : analyticsEvents.clickedMembershipCheckout,
      {
        creativeSlug: selectedCreative?.slug,
      },
    );

    setCheckoutLoading(type);
    setCheckoutError("");

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        creativeSlug: selectedCreative?.slug,
      }),
    });

    const payload = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !payload.url) {
      setCheckoutLoading(null);
      setCheckoutError(payload.error ?? "Could not open checkout.");
      return;
    }

    window.location.href = payload.url;
  };

  const openCreative = async (slug: string) => {
    const creative = creatives.find((item) => item.slug === slug);
    trackEvent(analyticsEvents.openedAd, {
      creativeSlug: slug,
      premium: creative?.premium,
      industry: creative?.industry,
      format: creative?.format,
    });

    setSelectedSlug(slug);
    setSelectedCreative(null);
    setDetailError("");

    const response = await fetch(`/api/creatives/${encodeURIComponent(slug)}`);
    const payload = (await response.json()) as { creative?: Creative; error?: string };

    if (!response.ok || !payload.creative) {
      setDetailError(payload.error ?? "Could not load this prompt.");
      return;
    }

    setSelectedCreative(payload.creative);
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
      <section className="shell home-actions" aria-label="Primary actions">
        <Link href="/prompt-lab" className="home-action">Upload an image</Link>
        <Link href="/request" className="home-action">Request a company</Link>
        <Link href="/request#support-widget" className="home-action">Support widget</Link>
      </section>
      <section className="shell gallery-tools" aria-label="Browse controls">
        <FilterBar filters={filters} onChange={setFilters} />
      </section>
      <section className="shell gallery-pane">
        <GalleryGrid
          creatives={filteredCreatives}
          onSelect={openCreative}
          isUnlocked={(creative) => memberAccess || !creative.premium || unlocked.includes(creative.slug)}
        />
      </section>
      {selectedSlug ? (
        <div className="detail-backdrop" role="dialog" aria-modal="true" aria-label={selectedCreative ? `${getAccessibleTitle(selectedCreative)} detail` : "Loading ad detail"}>
        {selectedCreative ? (
          <CreativeDetail
            creative={selectedCreative}
            unlocked={memberAccess || !selectedCreative.premium || unlocked.includes(selectedCreative.slug)}
            onOpenPricing={() => {
              trackEvent(analyticsEvents.openedPricing, {
                creativeSlug: selectedCreative.slug,
              });
              setPricingOpen(true);
            }}
            onClose={() => {
              setSelectedSlug(null);
              setSelectedCreative(null);
              setDetailError("");
            }}
          />
        ) : (
          <div className="detail-pane detail-loading">
            <p>{detailError || "Loading the prompt..."}</p>
            {detailError ? (
              <button
                type="button"
                className="detail-close"
                onClick={() => {
                  setSelectedSlug(null);
                  setDetailError("");
                }}
                aria-label="Close detail"
              >
                ×
              </button>
            ) : null}
          </div>
        )}
        </div>
      ) : null}
      <PricingModal
        open={pricingOpen}
        onClose={() => {
          setPricingOpen(false);
          setCheckoutError("");
        }}
        onSingleUnlock={() => startCheckout("single")}
        onMembership={() => startCheckout("membership")}
        loading={checkoutLoading}
        error={checkoutError}
        singlePurchaseDisabled={selectedCreative?.oneShotConfidence === "low"}
      />
    </main>
  );
}
