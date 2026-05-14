"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

type SubmitState = "idle" | "loading" | "success" | "error";
type Reason = "note" | "refund";

const REFUND_TEMPLATE =
  "Refund request — the prompt didn't land for me.\n\nWhich prompt: \nWhat happened: \n";

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [reason, setReason] = useState<Reason>("note");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const noteRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (open) {
      noteRef.current?.focus();
    }
  }, [open]);

  const switchReason = (next: Reason) => {
    setReason(next);
    if (next === "refund") {
      trackEvent(analyticsEvents.openedRefundTab);
      if (!note.trim()) {
        setNote(REFUND_TEMPLATE);
      }
    }
    if (next === "note" && note === REFUND_TEMPLATE) {
      setNote("");
    }
    noteRef.current?.focus();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setError("");

    const response = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        requestType: reason === "refund" ? "refund_request" : "support_request",
        note: note.trim(),
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? "Could not send. Try again?");
      setState("error");
      return;
    }

    trackEvent(
      reason === "refund"
        ? analyticsEvents.submittedRefundRequest
        : analyticsEvents.submittedSupportNote,
    );

    setState("success");
    setEmail("");
    setNote("");
    window.setTimeout(() => {
      setOpen(false);
      setReason("note");
      window.setTimeout(() => setState("idle"), 200);
    }, 1800);
  };

  return (
    <div className={`support-widget ${open ? "support-widget-open" : ""}`}>
      {open ? (
        <div className="support-widget-panel" role="dialog" aria-label="Send us a note">
          <div className="support-widget-head">
            <div>
              <h3>{reason === "refund" ? "💸 Refund this one." : "📬 Drop us a note."}</h3>
              <p className="support-widget-sub">
                {reason === "refund"
                  ? "Tell us which prompt didn't land. We'll refund within 24 hours."
                  : "We read every one."}
              </p>
            </div>
            <button
              type="button"
              className="support-widget-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="support-widget-tabs" role="tablist" aria-label="Reason">
            <button
              type="button"
              role="tab"
              aria-selected={reason === "note"}
              className={reason === "note" ? "is-active" : ""}
              onClick={() => switchReason("note")}
            >
              Send a note
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={reason === "refund"}
              className={reason === "refund" ? "is-active" : ""}
              onClick={() => switchReason("refund")}
            >
              Request a refund
            </button>
          </div>

          <form className="support-widget-form" onSubmit={submit}>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email"
              aria-label="Your email"
            />
            <textarea
              ref={noteRef}
              required
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={
                reason === "refund"
                  ? "Which prompt, what went wrong..."
                  : "Question, bug, ask, anything..."
              }
              rows={reason === "refund" ? 6 : 4}
              aria-label="Your message"
            />
            <button type="submit" disabled={state === "loading" || state === "success"}>
              {state === "loading"
                ? "Sending..."
                : state === "success"
                ? "Sent ✓"
                : reason === "refund"
                ? "Request refund"
                : "Send note"}
            </button>
            {state === "error" ? <p className="support-widget-error">{error}</p> : null}
            {state === "success" ? (
              <p className="support-widget-success">
                {reason === "refund"
                  ? "Got it. We'll process the refund within 24 hours."
                  : "Logged. We'll reply if needed."}
              </p>
            ) : null}
          </form>
        </div>
      ) : null}
      <button
        type="button"
        className="support-widget-toggle"
        aria-label={open ? "Close support" : "Open support"}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? (
          <span aria-hidden="true">×</span>
        ) : (
          <>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M4 5.5h16v11H8.5L4 19.5v-14Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <span>Send us a note</span>
          </>
        )}
      </button>
    </div>
  );
}
