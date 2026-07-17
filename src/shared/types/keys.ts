export type KeyStatus = "ready" | "limited" | "exhausted";

export interface ApiKeyEntry {
  id: string;
  key: string;
  status: KeyStatus;
}

/** modelId -> list of key entries for that exact model */
export type KeyPools = Record<string, ApiKeyEntry[]>;
