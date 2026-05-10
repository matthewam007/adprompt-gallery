"use client";

import { useEffect } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { storeMembershipAccess, storePromptUnlock } from "@/lib/purchase-access";

type CheckoutSuccessTrackerProps = {
  sessionId?: string;
};

export function CheckoutSuccessTracker({ sessionId }: CheckoutSuccessTrackerProps) {
  useEffect(() => {
    let cancelled = false;

    trackEvent(analyticsEvents.checkoutSuccess, {
      sessionId: sessionId ? "present" : "missing",
    });

    if (!sessionId) {
      return;
    }

    const checkoutSessionId = sessionId;

    async function storeAccess() {
      const response = await fetch(`/api/checkout/session?session_id=${encodeURIComponent(checkoutSessionId)}`);

      if (!response.ok || cancelled) {
        return;
      }

      const session = (await response.json()) as {
        checkoutType?: string | null;
        creativeSlug?: string | null;
      };

      if (session.checkoutType === "membership") {
        storeMembershipAccess();
      }

      if (session.checkoutType === "single" && session.creativeSlug) {
        storePromptUnlock(session.creativeSlug);
      }
    }

    storeAccess();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return null;
}
