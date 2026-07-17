import { NextResponse } from "next/server";
import { ProviderQuotaError } from "@/core/models/errors";

export function handleRouteError(err: unknown) {
  if (err instanceof ProviderQuotaError) {
    return NextResponse.json({ error: err.message, errorType: "quota_exceeded" }, { status: 429 });
  }
  const message = err instanceof Error ? err.message : "Unknown error";
  return NextResponse.json({ error: message }, { status: 500 });
}
