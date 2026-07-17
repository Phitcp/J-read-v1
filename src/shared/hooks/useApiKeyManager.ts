"use client";

import { useEffect, useState, useCallback } from "react";
import { ApiKeyEntry, KeyPools, KeyStatus } from "@/shared/types/keys";

const STORAGE_KEY = "jread_key_pools";

function loadFromStorage(): KeyPools {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as KeyPools;
  } catch {
    return {};
  }
}

function saveToStorage(pools: KeyPools) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pools));
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Manages API key pools per exact model id (e.g. "claude-sonnet-4-6").
 * Keys never leave the browser except as the single active key sent
 * per-request to our own API routes.
 */
export function useApiKeyManager() {
  const [pools, setPools] = useState<KeyPools>({});

  useEffect(() => {
    // One-time sync from localStorage (an external system) on mount.
    const saved = loadFromStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPools(saved);
  }, []);

  function persist(next: KeyPools) {
    setPools(next);
    saveToStorage(next);
  }

  const getKeysForModel = useCallback(
    (model: string): ApiKeyEntry[] => pools[model] ?? [],
    [pools]
  );

  const getAllModelsWithKeys = useCallback(
    (): string[] => Object.keys(pools).filter((m) => (pools[m] ?? []).length > 0),
    [pools]
  );

  const getActiveKey = useCallback(
    (model: string): ApiKeyEntry | null => {
      const keys = pools[model] ?? [];
      return keys.find((k) => k.status === "ready") ?? null;
    },
    [pools]
  );

  function addKey(model: string, rawKey: string) {
    const trimmed = rawKey.trim();
    if (!trimmed) return;
    const existing = pools[model] ?? [];
    const entry: ApiKeyEntry = { id: genId(), key: trimmed, status: "ready" };
    persist({ ...pools, [model]: [...existing, entry] });
  }

  function removeKey(model: string, keyId: string) {
    const existing = pools[model] ?? [];
    persist({ ...pools, [model]: existing.filter((k) => k.id !== keyId) });
  }

  function setKeyStatus(model: string, keyId: string, status: KeyStatus) {
    const existing = pools[model] ?? [];
    persist({
      ...pools,
      [model]: existing.map((k) => (k.id === keyId ? { ...k, status } : k)),
    });
  }

  function markKeyExhausted(model: string, keyId: string) {
    setKeyStatus(model, keyId, "exhausted");
  }

  function resetKey(model: string, keyId: string) {
    setKeyStatus(model, keyId, "ready");
  }

  return {
    getKeysForModel,
    getAllModelsWithKeys,
    getActiveKey,
    addKey,
    removeKey,
    markKeyExhausted,
    resetKey,
  };
}

export type ApiKeyManager = ReturnType<typeof useApiKeyManager>;
