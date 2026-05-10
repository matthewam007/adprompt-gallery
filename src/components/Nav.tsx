"use client";

import { useState } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

type NavProps = {
  onPricing: () => void;
  search: string;
  onSearch: (value: string) => void;
};

export function Nav({ onPricing, search, onSearch }: NavProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [captureError, setCaptureError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const captureEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    setIsSubmitting(true);
    setCaptureError("");

    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const payload = await response.json();
      setCaptureError(payload.error ?? "Could not join.");
      return;
    }

    trackEvent(analyticsEvents.emailSubmitted);
    setSubmitted(true);
    setEmail("");
  };

  return (
    <header className="topbar">
      <nav className="shell nav">
        <button className="wordmark" type="button" aria-label="PromptSwipe">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 56 44" role="img">
              <rect x="32" y="3" width="8" height="5" rx="1.7" />
              <rect x="25" y="10" width="14" height="5" rx="1.7" />
              <rect x="16" y="17" width="25" height="5" rx="1.7" />
              <rect x="1" y="24" width="32" height="5" rx="1.7" />
              <rect x="13" y="31" width="25" height="5" rx="1.7" />
              <rect x="41" y="14" width="8" height="5" rx="1.7" />
              <rect x="36" y="21" width="18" height="5" rx="1.7" />
              <rect x="34" y="28" width="15" height="5" rx="1.7" />
              <rect x="49" y="28" width="6" height="5" rx="1.7" />
              <rect x="8" y="36" width="10" height="5" rx="1.7" />
              <rect x="22" y="38" width="7" height="5" rx="1.7" />
              <rect x="34" y="36" width="11" height="5" rx="1.7" />
              <rect x="28" y="0" width="6" height="4" rx="1.5" />
              <rect x="20" y="38" width="5" height="5" rx="1.7" />
            </svg>
          </span>
          PromptSwipe
        </button>
        <label className="nav-search">
          <span>Search</span>
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search..."
          />
          <span className="search-icon" aria-hidden="true">⌕</span>
        </label>
        <div className="nav-links" aria-label="Primary navigation">
          <button
            type="button"
            onClick={() => {
              trackEvent(analyticsEvents.openedPricing, {
                source: "nav",
              });
              onPricing();
            }}
          >
            Pricing
          </button>
        </div>
        <form className="nav-capture" onSubmit={captureEmail}>
          <div className="nav-capture-row">
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSubmitted(false);
                setCaptureError("");
              }}
              placeholder="Email"
              aria-label="Email address"
            />
            <button type="submit" disabled={isSubmitting}>
              {submitted ? (
                "✓"
              ) : isSubmitting ? (
                "..."
              ) : (
                <span className="slot-label" aria-label="Save">
                  <span className="slot-reel" aria-hidden="true">
                    <span>Save</span>
                    <span>Save</span>
                    <span>Save</span>
                    <span>Save</span>
                    <span>Save</span>
                  </span>
                </span>
              )}
            </button>
          </div>
          <p className={captureError ? "nav-capture-error" : ""}>
            {captureError ||
              (submitted
                ? "📬 You’re in. We’ll send the next batch when it’s worth your time."
                : "Get world-class ad ideas straight to your inbox weekly.")}
          </p>
        </form>
      </nav>
    </header>
  );
}
