"use client";

import { useState } from "react";
import { playSuccessSound } from "@/lib/success-sound";
import type { Creative } from "@/types/creative";

const promptDestinations = [
  { name: "ChatGPT", url: "https://chatgpt.com/" },
  { name: "Claude", url: "https://claude.ai/new" },
  { name: "Gemini", url: "https://gemini.google.com/" },
  { name: "Midjourney", url: "https://www.midjourney.com/imagine" },
  { name: "Perplexity", url: "https://www.perplexity.ai/" },
  { name: "Meta AI", url: "https://www.meta.ai/" },
] as const;

type PromptDestinationName = (typeof promptDestinations)[number]["name"];

type PromptPanelProps = {
  creative: Creative;
  unlocked: boolean;
  onOpenPricing: () => void;
};

export function PromptPanel({ creative, unlocked, onOpenPricing }: PromptPanelProps) {
  const [copied, setCopied] = useState(false);
  const [pricingOpening, setPricingOpening] = useState(false);
  const prompt = creative.reconstructionPrompt ?? creative.fullPrompt;

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    playSuccessSound();
    window.setTimeout(() => setCopied(false), 1400);
  };

  const openDestination = async (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
    await copyPrompt();
  };

  const openPricingWithUnlock = () => {
    setPricingOpening(true);
    window.setTimeout(() => {
      setPricingOpening(false);
      onOpenPricing();
    }, 360);
  };

  if (!unlocked) {
    return (
      <section className="prompt-panel prompt-panel-locked">
        <div>
          <span className="panel-icon" aria-hidden="true"><LockIcon /></span>
          <h3>Get the exact prompt</h3>
          <p>Unlock the full prompt, teardown, and remix notes.</p>
        </div>
        <div className="prompt-preview">{creative.fullPrompt.slice(0, 148)}...</div>
        <div className="prompt-actions">
          <button
            type="button"
            className={pricingOpening ? "lock-opening" : ""}
            onClick={openPricingWithUnlock}
            disabled={pricingOpening}
          >
            <span aria-hidden="true"><LockIcon /></span>
            Unlock prompt
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="prompt-panel">
      <div className="panel-heading">
        <h3>Prompt</h3>
        <button type="button" onClick={copyPrompt} className={`copy-button ${copied ? "copy-success" : ""}`}>
          {copied ? <span className="copy-check" aria-hidden="true">✓</span> : null}
          {copied ? "Copied" : "Copy prompt"}
        </button>
      </div>
      <div className="prompt-destinations" aria-label="Open AI image generation tools">
        <span>Paste into</span>
        <div>
          {promptDestinations.map((destination) => (
            <button
              key={destination.name}
              type="button"
              onClick={() => openDestination(destination.url)}
              aria-label={`Copy prompt and open ${destination.name}`}
              title={`Copy prompt and open ${destination.name}`}
            >
              <ToolLogo name={destination.name} />
              <span className="tool-tooltip" role="tooltip">{destination.name}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="prompt-text">{prompt}</p>
    </section>
  );
}

function ToolLogo({ name }: { name: PromptDestinationName }) {
  if (name === "ChatGPT") {
    return (
      <svg className="tool-logo tool-logo-chatgpt" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 5.2c3.1 0 5.1 2.8 4.4 5.4 2.7.6 4.6 3.3 3.3 6.2 2 1.8 1.7 5.4-.9 7-2.3 1.4-4.9.5-6.2-1.2-1.9 2-5.3 2-7.1-.2-1.7-2.1-1.2-4.7.3-6.1-1.2-2.5.1-5.8 3.3-6.3.3-2.6 1.2-4.8 2.9-4.8Z" />
        <path d="M11.3 12.2 16 9.5l4.7 2.7v5.6L16 20.5l-4.7-2.7v-5.6Z" fill="none" stroke="currentColor" strokeWidth="1.9" />
      </svg>
    );
  }

  if (name === "Claude") {
    return (
      <svg className="tool-logo tool-logo-claude" viewBox="0 0 32 32" aria-hidden="true">
        <path d="m16 3 3.1 8.9L28 15.1l-8.9 3.1L16 29l-3.1-10.8L4 15.1l8.9-3.2L16 3Z" />
        <path d="m22.7 6.7-.9 5.8 5.4 2.2-5.8.9-2.2 5.4-.9-5.8-5.4-2.2 5.8-.9 2.2-5.4Z" opacity=".42" />
      </svg>
    );
  }

  if (name === "Gemini") {
    return (
      <svg className="tool-logo tool-logo-gemini" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 3.5c1.7 6 5.5 9.8 11.5 11.5C21.5 16.7 17.7 20.5 16 26.5 14.3 20.5 10.5 16.7 4.5 15 10.5 13.3 14.3 9.5 16 3.5Z" />
        <path d="M24.3 3.2c.6 2.2 2 3.6 4.2 4.2-2.2.6-3.6 2-4.2 4.2-.6-2.2-2-3.6-4.2-4.2 2.2-.6 3.6-2 4.2-4.2Z" />
      </svg>
    );
  }

  if (name === "Midjourney") {
    return (
      <svg className="tool-logo tool-logo-midjourney" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 23.5c4.5-2.1 8.1-6.5 10.2-17 4.9 5.2 8.3 10.8 10.8 17H5Z" />
        <path d="M15.2 6.5v17M8.8 23.5c2.8-3.3 5.8-5.2 9-5.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (name === "Perplexity") {
    return (
      <svg className="tool-logo tool-logo-perplexity" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M7 5h18v22H7V5Zm5 0v22M20 5v22M7 13h18M7 20h18" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 13 20 5v22l-8-7v-7Z" />
      </svg>
    );
  }

  return (
    <svg className="tool-logo tool-logo-meta" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M4.2 18.1c1.4-5.1 3.8-8 6.8-8 2.2 0 3.7 1.3 5 3.3 1.3-2 2.8-3.3 5-3.3 3 0 5.4 2.9 6.8 8 1 3.5-.5 5.9-3.3 5.9-2.4 0-4.3-1.7-8.5-7.2-4.2 5.5-6.1 7.2-8.5 7.2-2.8 0-4.3-2.4-3.3-5.9Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
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
