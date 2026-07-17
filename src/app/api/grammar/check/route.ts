import { NextRequest, NextResponse } from "next/server";
import { checkGrammarAnswer } from "@/core/ai";
import { ProviderConfig } from "@/shared/types/provider";
import { ExerciseItem } from "@/features/grammar/types";
import { handleRouteError } from "@/core/utils/handleRouteError";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { exercise, userAnswer, providerConfig } = body as {
      exercise: ExerciseItem;
      userAnswer: string;
      providerConfig: ProviderConfig;
    };

    if (!exercise || !userAnswer || !userAnswer.trim()) {
      return NextResponse.json({ error: "Missing exercise or answer" }, { status: 400 });
    }
    if (!providerConfig?.apiKey || !providerConfig?.provider || !providerConfig?.model) {
      return NextResponse.json({ error: "Missing provider configuration" }, { status: 400 });
    }

    const result = await checkGrammarAnswer(providerConfig, { exercise, userAnswer });
    return NextResponse.json(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
