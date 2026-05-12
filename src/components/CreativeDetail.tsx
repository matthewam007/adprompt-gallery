"use client";

import { useState } from "react";
import { AdPreview } from "@/components/AdPreview";
import { PromptPanel } from "@/components/PromptPanel";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { getAccessibleTitle, getDisplayTitle, hasReliableMetadata } from "@/lib/creative-display";
import { playSuccessSound, playUnlockSound } from "@/lib/success-sound";
import type { Creative } from "@/types/creative";

type CreativeDetailProps = {
  creative: Creative;
  unlocked: boolean;
  onOpenPricing: () => void;
  onClose: () => void;
};

export function CreativeDetail({ creative, unlocked, onOpenPricing, onClose }: CreativeDetailProps) {
  const [copied, setCopied] = useState(false);
  const [pricingOpening, setPricingOpening] = useState(false);
  const title = getDisplayTitle(creative);
  const accessibleTitle = getAccessibleTitle(creative);
  const reliableMetadata = hasReliableMetadata(creative);
  const commentary =
    creative.whyItWorks ||
    "This works because it trusts one good thought to do the talking. The visual arrives first and gives the eye somewhere easy to land, while the copy follows with just enough confidence to make the point feel earned. Nothing is trying too hard. The idea has room, the restraint feels intentional, and the whole piece carries itself with the kind of calm you remember later.";

  const handleCopyPrompt = async () => {
    if (!unlocked) {
      trackEvent(analyticsEvents.clickedUnlockPrompt, {
        creativeSlug: creative.slug,
        source: "detail_header",
      });
      playUnlockSound();
      setPricingOpening(true);
      window.setTimeout(() => {
        setPricingOpening(false);
        onOpenPricing();
      }, 360);
      return;
    }

    await navigator.clipboard.writeText(creative.reconstructionPrompt ?? creative.fullPrompt);
    trackEvent(analyticsEvents.clickedCopyPrompt, {
      creativeSlug: creative.slug,
      source: "detail_header",
    });
    setCopied(true);
    playSuccessSound();
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <aside className="detail-pane" aria-label={`${accessibleTitle} detail`}>
      <div className="detail-topbar">
        {reliableMetadata ? (
          <div>
            {title ? <h1>{title}</h1> : null}
            <p>{creative.brandInspiration} · {creative.industry}</p>
          </div>
        ) : (
          <div aria-hidden="true" />
        )}
        <div className="detail-actions">
          <button
            type="button"
            className={`copy-prompt-mini ${!unlocked ? "copy-prompt-mini-unlock" : ""} ${pricingOpening ? "lock-opening" : ""}`}
            onClick={handleCopyPrompt}
            disabled={pricingOpening}
          >
            {unlocked && copied ? (
              <span className="copy-check" aria-hidden="true">✓</span>
            ) : (
              <span aria-hidden="true">{unlocked ? "⧉" : <LockIcon />}</span>
            )}
            {unlocked ? (copied ? "Copied" : "Copy prompt") : "Unlock prompt"}
          </button>
          <button type="button" className="detail-close" onClick={onClose} aria-label="Close detail">
            ×
          </button>
        </div>
      </div>
      <div className="detail-preview-wrap">
        <AdPreview creative={creative} large />
      </div>
      <div className="detail-drawer">
        <section className="detail-section detail-commentary">
          <h2>Why it holds</h2>
          <p>{commentary}</p>
        </section>
        <PromptPanel
          creative={creative}
          unlocked={unlocked}
          onOpenPricing={onOpenPricing}
        />
      </div>
    </aside>
  );
}

function LockIcon() {
  return (
    <svg className="lock-icon" viewBox="0 0 20 20" focusable="false">
      <rect x="4.5" y="8.5" width="11" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path className="lock-shackle" d="M7 8.5V6.8a3 3 0 0 1 6 0v1.7" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}
