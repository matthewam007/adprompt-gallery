"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");
  const noteRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (open) {
      noteRef.current?.focus();
    }
  }, [open]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("loading");
    setError("");

    const response = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        requestType: "support_request",
        note: note.trim(),
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? "Could not send. Try again?");
      setState("error");
      return;
    }

    setState("success");
    setEmail("");
    setNote("");
    window.setTimeout(() => {
      setOpen(false);
      window.setTimeout(() => setState("idle"), 200);
    }, 1600);
  };

  return (
    <div className={`support-widget ${open ? "support-widget-open" : ""}`}>
      {open ? (
        <div className="support-widget-panel" role="dialog" aria-label="Send us a note">
          <div className="support-widget-head">
            <div>
              <p className="support-widget-eyebrow">Talk to us</p>
              <h3>Drop us a note.</h3>
              <p className="support-widget-sub">We log every one. Reply by hand when it matters.</p>
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
              placeholder="Question, bug, ask, anything..."
              rows={4}
              aria-label="Your message"
            />
            <button type="submit" disabled={state === "loading" || state === "success"}>
              {state === "loading" ? "Sending..." : state === "success" ? "Sent ✓" : "Send note"}
            </button>
            {state === "error" ? <p className="support-widget-error">{error}</p> : null}
            {state === "success" ? (
              <p className="support-widget-success">Logged. We&apos;ll reply if needed.</p>
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
