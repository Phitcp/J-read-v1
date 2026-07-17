export type JlptLevel = "N5" | "N4" | "N3" | "N2" | "N1";

export interface GrammarPointDef {
  id: string;
  point: string; // e.g. "〜ている"
  meaning: string; // short meaning, in Vietnamese
}

export type ExerciseType = "fill_blank" | "complete_sentence" | "translate_vn_to_jp";

export interface ExerciseItem {
  id: string;
  type: ExerciseType;
  grammar_point: string;
  prompt: string;
  /** Only present for type "fill_blank" - user picks one instead of typing. */
  choices?: string[];
}

export interface GrammarCheckResult {
  correct: boolean;
  explanation: string;
  grammar_notes: string;
  vocab_notes: string;
  /** Nudge only, must not reveal the answer - shown after a wrong first attempt. */
  hint: string;
  /** Revealed only after a second wrong attempt. */
  correct_answer: string;
  rewrite_suggestions: string[];
}
