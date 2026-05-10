"use client";

import { useState } from "react";
import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { playSuccessSound, playUnlockSound } from "@/lib/success-sound";
import type { Creative } from "@/types/creative";

const promptDestinations = [
  { name: "ChatGPT", url: "https://chatgpt.com/", variant: "chatgpt" },
  { name: "Claude", url: "https://claude.ai/new", variant: "chatgpt" },
  { name: "Gemini", url: "https://gemini.google.com/", variant: "chatgpt" },
  { name: "Midjourney", url: "https://www.midjourney.com/imagine", variant: "midjourney" },
  { name: "Perplexity", url: "https://www.perplexity.ai/", variant: "chatgpt" },
  { name: "Meta AI", url: "https://www.meta.ai/", variant: "chatgpt" },
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
  const promptPreview = getPromptPreview(prompt);

  const copyPrompt = async (promptText = prompt) => {
    await navigator.clipboard.writeText(promptText);
    trackEvent(analyticsEvents.clickedCopyPrompt, {
      creativeSlug: creative.slug,
      source: "prompt_panel",
    });
    setCopied(true);
    playSuccessSound();
    window.setTimeout(() => setCopied(false), 1400);
  };

  const openDestination = async (url: string, variant: (typeof promptDestinations)[number]["variant"]) => {
    window.open(url, "_blank", "noopener,noreferrer");
    await copyPrompt(creative.modelVariants?.[variant] ?? prompt);
  };

  const openPricingWithUnlock = () => {
    trackEvent(analyticsEvents.clickedUnlockPrompt, {
      creativeSlug: creative.slug,
      source: "prompt_panel",
    });
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
          <div className="locked-panel-heading">
            <span className="panel-icon" aria-hidden="true"><LockIcon /></span>
            <h3>Get the exact reconstruction prompt</h3>
          </div>
          <p>Unlock the 80%-there reconstruction prompt and creative notes.</p>
        </div>
        <div className="prompt-preview prompt-preview-locked">
          <span>Preview</span>
          <p>{promptPreview}</p>
          <div className="prompt-preview-fade" aria-hidden="true" />
        </div>
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
        <button type="button" onClick={() => copyPrompt()} className={`copy-button ${copied ? "copy-success" : ""}`}>
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
              onClick={() => openDestination(destination.url, destination.variant)}
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

function getPromptPreview(prompt: string) {
  const cleanPrompt = prompt.replace(/\s+/g, " ").trim();
  const preview = cleanPrompt.slice(0, 255);
  const lastSpace = preview.lastIndexOf(" ");

  return `${preview.slice(0, lastSpace > 210 ? lastSpace : preview.length)}...`;
}

function ToolLogo({ name }: { name: PromptDestinationName }) {
  if (name === "ChatGPT") {
    return (
      <svg className="tool-logo tool-logo-chatgpt" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M12.1 5.6a6 6 0 0 1 9 3.4 6 6 0 0 1 4.7 8.2 6 6 0 0 1-6.8 8.6 6 6 0 0 1-9-3.4 6 6 0 0 1-4.7-8.2 6 6 0 0 1 6.8-8.6Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M11.4 12.1 16 9.5l4.6 2.6v5.3L16 20l-4.6-2.6v-5.3Zm4.6-2.6v5.2m4.6-2.6-4.6 2.6m0 5.3v-5.3m-4.6 2.7 4.6-2.7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "Claude") {
    return (
      <svg className="tool-logo tool-logo-claude" viewBox="0 0 32 32" aria-hidden="true">
        <path d="m16 3.5 3 9 9.5 3.5-9.5 3.5-3 9-3-9L3.5 16l9.5-3.5 3-9Z" />
        <path d="m22.7 6.9-.9 5.5 5.3 2.1-5.6.9-2.2 5.3-.8-5.5-5.3-2.2 5.6-.8 2.1-5.3Z" opacity=".45" />
      </svg>
    );
  }

  if (name === "Gemini") {
    return (
      <svg className="tool-logo tool-logo-gemini" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="gemini-gradient" x1="4" x2="28" y1="26" y2="6">
            <stop stopColor="#6D8DFF" />
            <stop offset=".5" stopColor="#B969FF" />
            <stop offset="1" stopColor="#F0C35A" />
          </linearGradient>
        </defs>
        <path d="M16 3.5c1.7 6 5.5 9.8 11.5 11.5C21.5 16.7 17.7 20.5 16 26.5 14.3 20.5 10.5 16.7 4.5 15 10.5 13.3 14.3 9.5 16 3.5Z" fill="url(#gemini-gradient)" />
      </svg>
    );
  }

  if (name === "Midjourney") {
    return (
      <svg className="tool-logo tool-logo-midjourney" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 23.5c4.7-2.2 8-7.4 10.2-17.2 5 5.2 8.4 10.7 10.8 17.2H5Z" />
        <path d="M15.2 6.3v17.2M8.9 23.5c2.6-3.2 5.7-5.1 9.1-5.7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (name === "Perplexity") {
    return (
      <svg className="tool-logo tool-logo-perplexity" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M7 5h18v22H7V5Zm5 0v22M20 5v22M7 13h18M7 20h18" fill="none" stroke="currentColor" strokeWidth="1.8" />
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
