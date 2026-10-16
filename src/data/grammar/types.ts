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
  /** 文法測驗用的挖空題；沒有的話測驗會改用舊的出題方式 */
  quiz?: GrammarQuiz;
};

/** 文法測驗題：例句中把 blank 挖空，四個選項是 blank 加三個容易混淆的錯誤選項 */
export type GrammarQuiz = {
  /** 例句中要挖空的文法部分（只含文法，不含前面的單字） */
  blank: string;
  distractors: [string, string, string];
};
