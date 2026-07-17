"use client";

import { useState } from "react";
import { ModelSelection } from "@/shared/types/provider";
import { ApiKeyManager } from "@/shared/hooks/useApiKeyManager";
import { JLPT_LEVELS, GRAMMAR_DATA } from "@/core/config/grammar";
import { JlptLevel, ExerciseItem, GrammarCheckResult } from "@/features/grammar/types";
import { generateGrammarExercises, checkGrammarAnswer } from "@/shared/services/apiClient";
import LevelCard from "./components/LevelCard";
import GrammarSelector from "./components/GrammarSelector";
import ExerciseCard from "./components/ExerciseCard";
import HintCard from "./components/HintCard";
import FeedbackCard from "./components/FeedbackCard";

interface Props {
  selection: ModelSelection;
  keyManager: ApiKeyManager;
}

type Step = "levels" | "config" | "exercise" | "done";

export default function GrammarTab({ selection, keyManager }: Props) {
  const [step, setStep] = useState<Step>("levels");
  const [level, setLevel] = useState<JlptLevel | null>(null);

  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ExerciseItem[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [attempt, setAttempt] = useState(0);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<GrammarCheckResult | null>(null);
  const [finalized, setFinalized] = useState(false);

  function handleSelectLevel(l: JlptLevel) {
    setLevel(l);
    setStep("config");
  }

  async function handleConfigSubmit(points: string[], count: number) {
    if (!level) return;
    setGenerating(true);
    setGenError(null);

    try {
      const data = await generateGrammarExercises(
        { level, grammarPoints: points, count },
        selection,
        keyManager
      );
      setExercises(data.exercises);
      setCurrentIndex(0);
      resetExerciseState();
      setStep("exercise");
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Lỗi không xác định.");
    } finally {
      setGenerating(false);
    }
  }

  function resetExerciseState() {
    setAttempt(0);
    setCheckResult(null);
    setCheckError(null);
    setFinalized(false);
  }

  async function handleSubmitAnswer(answer: string) {
    if (!exercises) return;
    const exercise = exercises[currentIndex];
    setChecking(true);
    setCheckError(null);

    try {
      const data = await checkGrammarAnswer({ exercise, userAnswer: answer }, selection, keyManager);
      setCheckResult(data);

      if (data.correct) {
        setFinalized(true);
      } else if (attempt === 0) {
        setAttempt(1); // allow one retry with a hint
      } else {
        setFinalized(true); // second wrong attempt - full reveal
      }
    } catch (err) {
      setCheckError(err instanceof Error ? err.message : "Lỗi không xác định.");
    } finally {
      setChecking(false);
    }
  }

  function handleNext() {
    if (!exercises) return;
    if (currentIndex + 1 >= exercises.length) {
      setStep("done");
    } else {
      setCurrentIndex(currentIndex + 1);
      resetExerciseState();
    }
  }

  function handleBackToLevels() {
    setStep("levels");
    setLevel(null);
    setExercises(null);
    resetExerciseState();
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-stone-800">Luyện ngữ pháp</h2>
        <p className="text-sm text-stone-500">
          Chọn cấp độ JLPT, chọn điểm ngữ pháp muốn luyện, rồi làm bài tập do AI tạo.
        </p>
      </header>

      {step === "levels" && (
        <div className="grid grid-cols-5 gap-3 max-w-lg">
          {JLPT_LEVELS.map((l) => (
            <LevelCard key={l} level={l} onSelect={handleSelectLevel} />
          ))}
        </div>
      )}

      {step === "config" && level && (
        <div className="flex flex-col gap-4 max-w-lg">
          <button
            onClick={handleBackToLevels}
            className="self-start text-xs text-stone-500 hover:text-stone-800 transition-colors"
          >
            ← Chọn cấp độ khác
          </button>
          <h3 className="text-sm font-medium text-stone-700">Cấp độ {level}</h3>
          <GrammarSelector
            points={GRAMMAR_DATA[level]}
            onSubmit={handleConfigSubmit}
            loading={generating}
          />
          {genError && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
              {genError}
            </p>
          )}
        </div>
      )}

      {step === "exercise" && exercises && (
        <div className="flex flex-col gap-4 max-w-lg">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToLevels}
              className="text-xs text-stone-500 hover:text-stone-800 transition-colors"
            >
              ← Kết thúc luyện tập
            </button>
            <span className="text-xs text-stone-400">
              Câu {currentIndex + 1} / {exercises.length}
            </span>
          </div>

          {!finalized && (
            <ExerciseCard
              exercise={exercises[currentIndex]}
              onSubmit={handleSubmitAnswer}
              loading={checking}
              attempt={attempt}
            />
          )}

          {checkError && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
              {checkError}
            </p>
          )}

          {!finalized && checkResult && !checkResult.correct && (
            <HintCard hint={checkResult.hint} />
          )}

          {finalized && checkResult && (
            <>
              <FeedbackCard result={checkResult} revealAnswer={!checkResult.correct} />
              <button
                onClick={handleNext}
                className="self-start bg-stone-800 text-stone-50 text-sm px-5 py-2.5 rounded-sm hover:bg-stone-700 transition-colors"
              >
                {currentIndex + 1 >= exercises.length ? "Hoàn thành" : "Câu tiếp theo"}
              </button>
            </>
          )}
        </div>
      )}

      {step === "done" && (
        <div className="flex flex-col gap-4 max-w-lg">
          <p className="text-sm text-stone-700">
            Bạn đã hoàn thành {exercises?.length ?? 0} câu ở cấp độ {level}. Tuyệt vời!
          </p>
          <button
            onClick={handleBackToLevels}
            className="self-start bg-stone-800 text-stone-50 text-sm px-5 py-2.5 rounded-sm hover:bg-stone-700 transition-colors"
          >
            Luyện tập tiếp
          </button>
        </div>
      )}
    </div>
  );
}
