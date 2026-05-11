"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

type SubmitState = {
  loading: boolean;
  error: string;
  submitted: boolean;
};

const initialState: SubmitState = {
  loading: false,
  error: "",
  submitted: false,
};

export default function RequestPage() {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [note, setNote] = useState("");
  const [adUrl, setAdUrl] = useState("");
  const [state, setState] = useState<SubmitState>(initialState);
  const [uploadEmail, setUploadEmail] = useState("");
  const [uploadState, setUploadState] = useState<SubmitState>(initialState);
  const [supportEmail, setSupportEmail] = useState("");
  const [supportNote, setSupportNote] = useState("");
  const [supportState, setSupportState] = useState<SubmitState>(initialState);

  const submitRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ loading: true, error: "", submitted: false });

    const response = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        company,
        note,
        adUrl,
        requestType: "company_request",
      }),
    });

    const payload = await response.json();
    setState({
      loading: false,
      error: response.ok ? "" : payload.error ?? "Could not send request.",
      submitted: response.ok,
    });

    if (response.ok) {
      setEmail("");
      setCompany("");
      setNote("");
      setAdUrl("");
    }
  };

  const submitUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadState({ loading: true, error: "", submitted: false });

    const response = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: uploadEmail,
        requestType: "image_upload",
        note: "Upload an ad image for a one-shot prompt.",
      }),
    });

    const payload = await response.json();
    setUploadState({
      loading: false,
      error: response.ok ? "" : payload.error ?? "Could not send request.",
      submitted: response.ok,
    });

    if (response.ok) {
      setUploadEmail("");
      window.location.href = "/prompt-lab";
    }
  };

  const submitSupport = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSupportState({ loading: true, error: "", submitted: false });

    const response = await fetch("/api/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: supportEmail,
        requestType: "support_request",
        note: supportNote,
      }),
    });

    const payload = await response.json();
    setSupportState({
      loading: false,
      error: response.ok ? "" : payload.error ?? "Could not send request.",
      submitted: response.ok,
    });

    if (response.ok) {
      setSupportEmail("");
      setSupportNote("");
    }
  };

  return (
    <main className="request-page">
      <section className="request-hero shell">
        <div className="request-hero-copy">
          <Link href="/" className="request-home">PromptSwipe</Link>
          <h1>Request a prompt. Request a company. Upload an ad.</h1>
          <p>
            One small place for the things people actually ask for. If a brand is missing, tell us. If
            you have an ad you want rebuilt, send it over. We log everything into the same sheet and
            follow up by hand.
          </p>
        </div>
        <div className="request-hero-links">
          <Link href="/prompt-lab">Upload an image</Link>
          <a href="#request-company">Request a company</a>
          <a href="#support-widget">Support widget</a>
        </div>
      </section>

      <section className="request-band shell" id="request-company">
        <div className="request-band-copy">
          <p className="request-label">Request a company</p>
          <h2>Tell us which brand should be next.</h2>
          <p>Use this when you want more ads from a specific company in the archive.</p>
        </div>
        <form className="request-form" onSubmit={submitRequest}>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <input type="text" value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Company name" />
          <input type="url" value={adUrl} onChange={(event) => setAdUrl(event.target.value)} placeholder="Ad link or reference URL" />
          <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="What should we look for?" rows={4} />
          <button type="submit" disabled={state.loading}>{state.loading ? "Sending..." : "Send request"}</button>
          {state.error ? <p className="request-status request-error">{state.error}</p> : null}
          {state.submitted ? <p className="request-status request-success">Sent. We’ll look at it and follow up.</p> : null}
        </form>
      </section>

      <section className="request-band shell">
        <div className="request-band-copy">
          <p className="request-label">Upload an ad</p>
          <h2>Get a one-shot prompt from a reference image.</h2>
          <p>For now this routes into Prompt Lab, where you can analyze a reference and copy the blueprint.</p>
        </div>
        <form className="request-form" onSubmit={submitUpload}>
          <input type="email" value={uploadEmail} onChange={(event) => setUploadEmail(event.target.value)} placeholder="Email" />
          <p className="request-helper">We’ll use this for the prompt drop and manual follow-up.</p>
          <button type="submit" disabled={uploadState.loading}>{uploadState.loading ? "Sending..." : "Open Prompt Lab"}</button>
          {uploadState.error ? <p className="request-status request-error">{uploadState.error}</p> : null}
          {uploadState.submitted ? <p className="request-status request-success">Saved. Opening Prompt Lab now.</p> : null}
        </form>
      </section>

      <section className="request-band shell" id="support-widget">
        <div className="request-band-copy">
          <p className="request-label">Support widget</p>
          <h2>Leave a note. We’ll log it and follow up by hand.</h2>
          <p>Same sheet. Same quiet process. Good for questions, bugs, and anything that needs a human reply.</p>
        </div>
        <form className="request-form" onSubmit={submitSupport}>
          <input type="email" value={supportEmail} onChange={(event) => setSupportEmail(event.target.value)} placeholder="Email" />
          <textarea value={supportNote} onChange={(event) => setSupportNote(event.target.value)} placeholder="What do you need?" rows={4} />
          <button type="submit" disabled={supportState.loading}>{supportState.loading ? "Sending..." : "Send note"}</button>
          {supportState.error ? <p className="request-status request-error">{supportState.error}</p> : null}
          {supportState.submitted ? <p className="request-status request-success">Logged. We’ll reply if needed.</p> : null}
        </form>
      </section>
    </main>
  );
}
