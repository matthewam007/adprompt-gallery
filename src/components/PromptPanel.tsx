"use client";

import Image from "next/image";
import { useState } from "react";
import { playSuccessSound, playUnlockSound } from "@/lib/success-sound";
import type { Creative } from "@/types/creative";

const promptDestinations = [
  { name: "ChatGPT", url: "https://chatgpt.com/", iconUrl: "https://chatgpt.com/favicon.ico" },
  { name: "Claude", url: "https://claude.ai/new", iconUrl: "https://claude.ai/favicon.ico" },
  { name: "Gemini", url: "https://gemini.google.com/", iconUrl: "https://gemini.google.com/favicon.ico" },
  { name: "Midjourney", url: "https://www.midjourney.com/imagine", iconUrl: "https://www.midjourney.com/favicon.ico" },
  { name: "Perplexity", url: "https://www.perplexity.ai/", iconUrl: "https://www.perplexity.ai/favicon.ico" },
  { name: "Meta AI", url: "https://www.meta.ai/", iconUrl: "https://www.meta.ai/favicon.ico" },
] as const;

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
    playUnlockSound();
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
              <Image className="tool-logo" src={destination.iconUrl} alt="" width={23} height={23} unoptimized />
              <span className="tool-tooltip" role="tooltip">{destination.name}</span>
            </button>
          ))}
        </div>
      </div>
      <p className="prompt-text">{prompt}</p>
    </section>
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
