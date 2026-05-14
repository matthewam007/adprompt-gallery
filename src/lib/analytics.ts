"use client";

import { track } from "@vercel/analytics";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    clarity?: (command: "event", name: string) => void;
  }
}

export const analyticsEvents = {
  viewedGallery: "Viewed gallery",
  searched: "Searched",
  clickedFilter: "Clicked filter",
  openedAd: "Opened ad",
  clickedCopyPrompt: "Clicked copy prompt",
  clickedUnlockPrompt: "Clicked unlock prompt",
  openedPricing: "Opened pricing",
  clickedSinglePromptCheckout: "Clicked single prompt checkout",
  clickedMembershipCheckout: "Clicked membership checkout",
  emailSubmitted: "Email submitted",
  checkoutSuccess: "Checkout success",
  viewedLockedSingleTier: "Viewed locked single tier",
  clickedLockedSingleCta: "Clicked locked single CTA",
  openedRefundTab: "Opened refund tab",
  submittedRefundRequest: "Submitted refund request",
  submittedSupportNote: "Submitted support note",
} as const;

export function trackEvent(name: string, properties: AnalyticsProperties = {}) {
  track(name, cleanProperties(properties));

  if (typeof window !== "undefined") {
    window.clarity?.("event", name);
  }
}

function cleanProperties(properties: AnalyticsProperties) {
  return Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined && value !== null),
  ) as Record<string, string | number | boolean>;
}
