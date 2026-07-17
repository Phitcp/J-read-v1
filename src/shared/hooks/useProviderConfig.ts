"use client";

import { useEffect, useState } from "react";
import { ModelSelection } from "@/shared/types/provider";
import { DEFAULT_MODELS } from "@/core/config/models";

const STORAGE_KEY = "jread_model_selection";

const DEFAULT_SELECTION: ModelSelection = {
  provider: "anthropic",
  model: DEFAULT_MODELS.anthropic[0],
};

function loadFromStorage(): ModelSelection | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ModelSelection;
  } catch {
    return null;
  }
}

function saveToStorage(selection: ModelSelection) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
}

/**
 * Single source of truth for which provider + model is currently active.
 * Does NOT hold any API key - keys live in useApiKeyManager, keyed per model,
 * and get resolved at request time so the server route is stateless.
 */
export function useProviderConfig() {
  const [selection, setSelection] = useState<ModelSelection>(DEFAULT_SELECTION);

  useEffect(() => {
    // One-time sync from localStorage (an external system) on mount.
    const saved = loadFromStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setSelection(saved);
  }, []);

  function updateSelection(next: ModelSelection) {
    setSelection(next);
    saveToStorage(next);
  }

  return { selection, updateSelection };
}
