"use client";

import { useState } from "react";
import { playUnlockSound } from "@/lib/success-sound";

type PricingModalProps = {
  open: boolean;
  onClose: () => void;
  onSingleUnlock: () => Promise<void>;
  onMembership: () => Promise<void>;
  loading?: "single" | "membership" | null;
  error?: string;
  singlePurchaseDisabled?: boolean;
};

export function PricingModal({
  open,
  onClose,
  onSingleUnlock,
  onMembership,
  loading = null,
  error = "",
  singlePurchaseDisabled = false,
}: PricingModalProps) {
  const [unlocking, setUnlocking] = useState<"single" | "membership" | null>(null);

  if (!open) {
    return null;
  }

  const handleUnlock = async (
    type: "single" | "membership",
    action: () => Promise<void>,
  ) => {
    if (loading !== null || unlocking !== null) {
      return;
    }
    playUnlockSound();
    setUnlocking(type);
    window.setTimeout(async () => {
      setUnlocking(null);
      await action();
    }, 360);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Pricing">
      <div className="pricing-modal">
        <div className="modal-heading">
          <div>
            <h2>Take it home.</h2>
            <p>📚 Choose the one you need today, or open the whole library.</p>
          </div>
          <button type="button" onClick={onClose} className="icon-button" aria-label="Close pricing">
            ×
          </button>
        </div>
        {error ? <p className="pricing-error">{error}</p> : null}
        <div className="pricing-options">
          <article className={`pricing-option pricing-option-single ${singlePurchaseDisabled ? "pricing-option-disabled" : ""}`}>
            <span className="pricing-peek" aria-hidden="true">🎟️</span>
            <span>Single prompt</span>
            <h3>Unlock one prompt</h3>
            <strong>$2</strong>
            {singlePurchaseDisabled ? (
              <>
                <p>This one’s members-only.</p>
                <small>Some ads lean on long literal text or brand-specific typography that image models don&apos;t one-shot. We keep these in the membership so you get the notes and remix variables that make them land.</small>
                <button type="button" disabled className="pricing-option-locked-cta">
                  Members only
                </button>
              </>
            ) : (
              <>
                <p>For the one you came for.</p>
                <small>Includes the exact reconstruction prompt, model notes, layout breakdown, and remix variables.</small>
                <button
                  type="button"
                  onClick={() => handleUnlock("single", onSingleUnlock)}
                  disabled={loading !== null || unlocking !== null}
                  className={unlocking === "single" ? "lock-opening" : ""}
                >
                  <span aria-hidden="true"><LockIcon /></span>
                  {loading === "single" ? "Opening checkout..." : "Unlock prompt"}
                </button>
              </>
            )}
          </article>
          <article className="pricing-option pricing-option-member">
            <span className="pricing-peek" aria-hidden="true">🗝️</span>
            <span>Membership</span>
            <h3>Member access</h3>
            <strong>$15/mo</strong>
            <p>For people making ads every week.</p>
            <small>Unlock every prompt in the library, including new drops.</small>
            <button
              type="button"
              onClick={() => handleUnlock("membership", onMembership)}
              disabled={loading !== null || unlocking !== null}
              className={unlocking === "membership" ? "lock-opening" : ""}
            >
              <span aria-hidden="true"><LockIcon /></span>
              {loading === "membership" ? "Opening checkout..." : "Get member access"}
            </button>
          </article>
        </div>
      </div>
    </div>
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
