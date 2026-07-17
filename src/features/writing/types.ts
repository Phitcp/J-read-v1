export interface WritingMistake {
  original: string;
  correct: string;
  explanation: string;
}

export interface WritingReviewResult {
  score: number; // overall score, 0-100
  grammar_mistakes: WritingMistake[];
  spelling_mistakes: WritingMistake[];
  naturalness: string;
  suggestions: string[];
  corrected_version: string;
}
