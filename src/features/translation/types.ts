export interface VocabItem {
  word: string;
  reading: string; // furigana / romaji reading
  meaning: string;
}

export interface GrammarPoint {
  phrase: string; // the grammar pattern found in the sentence, e.g. "〜ている"
  explanation: string; // explanation in Vietnamese
}

export interface ExplainResult {
  translation: string; // Vietnamese translation of the sentence
  grammar_points: GrammarPoint[];
  vocab: VocabItem[];
}

export interface IngestResult {
  sentences: string[];
}
