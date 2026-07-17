import { NextRequest, NextResponse } from "next/server";
import { segmentJapaneseText } from "@/core/ai";
import { ProviderConfig } from "@/shared/types/provider";
import { handleRouteError } from "@/core/utils/handleRouteError";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, providerConfig } = body as {
      text: string;
      providerConfig: ProviderConfig;
    };

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Text is empty" }, { status: 400 });
    }
    if (!providerConfig?.apiKey || !providerConfig?.provider || !providerConfig?.model) {
      return NextResponse.json({ error: "Missing provider configuration" }, { status: 400 });
    }

    const result = await segmentJapaneseText(providerConfig, text);
    return NextResponse.json(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
