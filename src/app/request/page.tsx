"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

type SubmitState = {
  loading: boolean;
  error: string;
  submitted: boolean;
};

const initial: SubmitState = { loading: false, error: "", submitted: false };

export default function RequestPage() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [adUrl, setAdUrl] = useState("");
  const [note, setNote] = useState("");
  const [state, setState] = useState<SubmitState>(initial);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ loading: true, error: "", submitted: false });

    const response = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        company,
        adUrl,
        note,
        requestType: "company_request",
      }),
    });

    const payload = await response.json();
    setState({
      loading: false,
      error: response.ok ? "" : payload.error ?? "Could not send.",
      submitted: response.ok,
    });

    if (response.ok) {
      setEmail("");
      setCompany("");
      setAdUrl("");
      setNote("");
    }
  };

  return (
    <main className="request-page">
      <header className="request-nav shell">
        <Link href="/" className="wordmark" aria-label="PromptSwipe home">
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
        </Link>
        <Link href="/">Back to gallery</Link>
      </header>

      <article className="request-essay shell">
        <p className="request-eyebrow">Request a brand</p>
        <h1>Tell us which company should be next.</h1>
        <p className="request-lede">
          A swipe file is only as good as what&apos;s in it. If a brand you study is missing, name it.
          We&apos;ll add the best ads next.
        </p>

        <form className="request-form-clean" onSubmit={submit} noValidate>
          <label className="request-field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@studio.com"
            />
          </label>

          <label className="request-field">
            <span>Company</span>
            <input
              type="text"
              required
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              placeholder="Linear, Ramp, Stripe..."
            />
          </label>

          <label className="request-field">
            <span>Ad reference <em>(optional)</em></span>
            <input
              type="url"
              value={adUrl}
              onChange={(event) => setAdUrl(event.target.value)}
              placeholder="A link to an ad you want studied"
            />
          </label>

          <label className="request-field">
            <span>What to look for <em>(optional)</em></span>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="What about their work caught your eye?"
              rows={4}
            />
          </label>

          <div className="request-submit-row">
            <button type="submit" disabled={state.loading}>
              {state.loading ? "Sending..." : "Send request"}
            </button>
            {state.error ? <p className="request-msg request-msg-error">{state.error}</p> : null}
            {state.submitted ? (
              <p className="request-msg request-msg-success">Got it. We&apos;ll look at it and follow up.</p>
            ) : null}
          </div>
        </form>
      </article>
    </main>
  );
}
