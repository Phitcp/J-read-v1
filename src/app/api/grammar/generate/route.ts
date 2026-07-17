import { NextRequest, NextResponse } from "next/server";
import { generateGrammarExercises } from "@/core/ai";
import { ProviderConfig } from "@/shared/types/provider";
import { JlptLevel } from "@/features/grammar/types";
import { handleRouteError } from "@/core/utils/handleRouteError";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { level, grammarPoints, count, providerConfig } = body as {
      level: JlptLevel;
      grammarPoints: string[];
      count: number;
      providerConfig: ProviderConfig;
    };

    if (!level || !Array.isArray(grammarPoints) || grammarPoints.length === 0) {
      return NextResponse.json({ error: "Missing level or grammar points" }, { status: 400 });
    }
    if (!count || count < 1) {
      return NextResponse.json({ error: "Invalid question count" }, { status: 400 });
    }
    if (!providerConfig?.apiKey || !providerConfig?.provider || !providerConfig?.model) {
      return NextResponse.json({ error: "Missing provider configuration" }, { status: 400 });
    }

    const result = await generateGrammarExercises(providerConfig, { level, grammarPoints, count });
    return NextResponse.json(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
