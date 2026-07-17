import { NextRequest, NextResponse } from "next/server";
import { explainSentence } from "@/core/ai";
import { ProviderConfig } from "@/shared/types/provider";
import { handleRouteError } from "@/core/utils/handleRouteError";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sentence, contextBefore, contextAfter, providerConfig } = body as {
      sentence: string;
      contextBefore?: string;
      contextAfter?: string;
      providerConfig: ProviderConfig;
    };

    if (!sentence || !sentence.trim()) {
      return NextResponse.json({ error: "Sentence is empty" }, { status: 400 });
    }
    if (!providerConfig?.apiKey || !providerConfig?.provider || !providerConfig?.model) {
      return NextResponse.json({ error: "Missing provider configuration" }, { status: 400 });
    }

    const result = await explainSentence(providerConfig, { sentence, contextBefore, contextAfter });
    return NextResponse.json(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
