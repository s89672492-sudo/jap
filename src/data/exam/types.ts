export type ExamQuestionType =
  | 'kanji-reading'
  | 'orthography'
  | 'context'
  | 'paraphrase'
  | 'grammar'
  | 'sentence-order';

/**
 * 依 JLPT 題型自編的原創模擬題（不是官方歷屆試題）。
 * sentence 中用［］標出畫底線的字，用（　）表示空格；
 * 句子重組題用＿＿表示空格、★ 表示要回答的位置。
 */
export type ExamQuestion = {
  id: string;
  type: ExamQuestionType;
  sentence: string;
  /** 第一個是正確答案；出題時會打亂順序 */
  options: [string, string, string, string];
  /** 中文解說，作答後顯示 */
  explanation: string;
};

export const EXAM_TYPE_LABELS: Record<ExamQuestionType, string> = {
  'kanji-reading': '漢字讀法',
  orthography: '表記',
  context: '文脈語彙',
  paraphrase: '言い換え',
  grammar: '文法',
  'sentence-order': '句子重組',
};

export const EXAM_TYPE_PROMPTS: Record<ExamQuestionType, string> = {
  'kanji-reading': '畫底線的字怎麼讀？',
  orthography: '畫底線的字用漢字怎麼寫？',
  context: '（　）裡應該填入哪一個？',
  paraphrase: '哪一個意思最接近畫底線的部分？',
  grammar: '（　）裡應該填入哪一個？',
  'sentence-order': '排成正確的句子時，★ 應該放哪一個？',
};
