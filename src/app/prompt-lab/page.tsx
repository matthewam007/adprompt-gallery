"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { creatives } from "@/data/creatives";
import { getAccessibleTitle, getDisplayTitle } from "@/lib/creative-display";
import type { AdPromptBlueprint } from "@/lib/image-to-prompt-schema";

const imageCreatives = creatives.filter((creative) => creative.image);

export default function PromptLabPage() {
  const [selectedPath, setSelectedPath] = useState(imageCreatives[0]?.image ?? "");
  const [result, setResult] = useState<AdPromptBlueprint | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedCreative = useMemo(
    () => imageCreatives.find((creative) => creative.image === selectedPath),
    [selectedPath],
  );

  const analyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    const response = await fetch("/api/image-to-prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imagePath: selectedPath }),
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Analysis failed.");
      return;
    }

    setResult(payload.blueprint);
  };

  const copyResult = async () => {
    if (!result) {
      return;
    }

    await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  };

  return (
    <main className="prompt-lab shell">
      <header className="prompt-lab-header">
        <div>
          <a href="/">AdPrompt Gallery</a>
          <h1>Prompt Lab</h1>
          <p>Turn an uploaded ad reference into a prompt, teardown, and JSON blueprint.</p>
        </div>
        <button type="button" onClick={analyze} disabled={!selectedPath || loading}>
          {loading ? "Analyzing..." : "Analyze image"}
        </button>
      </header>

      <section className="prompt-lab-grid">
        <div className="prompt-lab-picker">
          <label>
            <span>Reference</span>
            <select value={selectedPath} onChange={(event) => setSelectedPath(event.target.value)}>
              {imageCreatives.map((creative) => (
                <option key={creative.id} value={creative.image}>
                  {getDisplayTitle(creative) ?? getAccessibleTitle(creative)}
                </option>
              ))}
            </select>
          </label>
          {selectedCreative?.image ? (
            <div className="prompt-lab-preview">
              <Image src={selectedCreative.image} alt={getAccessibleTitle(selectedCreative)} fill sizes="520px" />
            </div>
          ) : null}
        </div>

        <div className="prompt-lab-output">
          <div className="prompt-lab-output-top">
            <h2>Output</h2>
            <button type="button" onClick={copyResult} disabled={!result}>
              Copy JSON
            </button>
          </div>
          {error ? <p className="prompt-lab-error">{error}</p> : null}
          {result ? (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          ) : (
            <p className="prompt-lab-empty">Select an image and run analysis.</p>
          )}
        </div>
      </section>
    </main>
  );
}
