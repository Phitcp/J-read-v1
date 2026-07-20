import { NextRequest, NextResponse } from "next/server";
import { translateSentencesBatch } from "@/core/ai";
import { ProviderConfig } from "@/shared/types/provider";
import { handleRouteError } from "@/core/utils/handleRouteError";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sentences, providerConfig } = body as {
      sentences: string[];
      providerConfig: ProviderConfig;
    };

    if (!Array.isArray(sentences) || sentences.length === 0) {
      return NextResponse.json({ error: "Missing sentences array" }, { status: 400 });
    }
    if (!providerConfig?.apiKey || !providerConfig?.provider || !providerConfig?.model) {
      return NextResponse.json({ error: "Missing provider configuration" }, { status: 400 });
    }

    const result = await translateSentencesBatch(providerConfig, sentences);
    return NextResponse.json(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
