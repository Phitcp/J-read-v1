# API Key Manager feature (scaffold)

Not implemented yet. See `plan-phase-2.md` → Feature 4 (API Key Manager).
Will contain: ApiKeyList, ApiKeyStatus, CurrentKeyIndicator, ModelStatusCard components.
Runtime key-rotation logic will sit in `core/models` (using each adapter's `health()`
check) so it applies uniformly across providers.
