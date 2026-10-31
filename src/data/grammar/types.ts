export type GrammarPoint = {
  id: string;
  /** 句型，例如「〜たことがある」 */
  pattern: string;
  /** 接續方式 */
  connection: string;
  /** 中文意思 */
  meaning: string;
  example: {
    ja: string;
    zh: string;
    /** 例句中要用強調色標出的部分 */
    highlight: string;
  };
  /** 考試重點：用法差異、容易混淆的句型、JLPT 常見考法 */
  tip?: string;
  /** 文法測驗用的挖空題；沒有的話測驗會改用舊的出題方式 */
  quiz?: GrammarQuiz;
  /** 相似文法（資料在 notes/，載入時合併） */
  similar?: GrammarSimilar[];
  /** 常見錯誤（資料在 notes/，載入時合併） */
  mistakes?: GrammarMistake[];
};

/** 容易混淆的相似文法 */
export type GrammarSimilar = {
  pattern: string;
  /** 和這個文法的差別 */
  diff: string;
  /** App 裡對應的文法 id（有的話） */
  id?: string;
};

/** 常見錯誤：錯的說法、正確說法和原因 */
export type GrammarMistake = {
  wrong: string;
  right: string;
  why: string;
};

/** 每個文法 id 的相似文法和常見錯誤 */
export type GrammarNotes = Record<
  string,
  { similar?: GrammarSimilar[]; mistakes?: GrammarMistake[] }
>;

/** 把相似文法、常見錯誤合併進文法資料（原本的資料不改） */
export function withNotes(points: GrammarPoint[], notes: GrammarNotes): GrammarPoint[] {
  return points.map((point) => (notes[point.id] ? { ...point, ...notes[point.id] } : point));
}

/** 文法測驗題：例句中把 blank 挖空，四個選項是 blank 加三個容易混淆的錯誤選項 */
export type GrammarQuiz = {
  /** 例句中要挖空的文法部分（只含文法，不含前面的單字） */
  blank: string;
  distractors: [string, string, string];
};
