"use client";

import { useEffect } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

type CheckoutSuccessTrackerProps = {
  sessionId?: string;
};

export function CheckoutSuccessTracker({ sessionId }: CheckoutSuccessTrackerProps) {
  useEffect(() => {
    trackEvent(analyticsEvents.checkoutSuccess, {
      sessionId: sessionId ? "present" : "missing",
    });
  }, [sessionId]);

  return null;
}
