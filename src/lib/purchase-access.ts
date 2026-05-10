"use client";

const memberAccessKey = "promptswipe-member-access";
const unlockedPromptsKey = "promptswipe-unlocked-prompts";

export function getStoredAccess() {
  if (typeof window === "undefined") {
    return { memberAccess: false, unlockedPrompts: [] as string[] };
  }

  return {
    memberAccess: window.localStorage.getItem(memberAccessKey) === "true",
    unlockedPrompts: parseUnlockedPrompts(window.localStorage.getItem(unlockedPromptsKey)),
  };
}

export function storeMembershipAccess() {
  window.localStorage.setItem(memberAccessKey, "true");
}

export function storePromptUnlock(slug: string) {
  const current = getStoredAccess().unlockedPrompts;
  const next = current.includes(slug) ? current : [...current, slug];

  window.localStorage.setItem(unlockedPromptsKey, JSON.stringify(next));
}

function parseUnlockedPrompts(value: string | null) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}
