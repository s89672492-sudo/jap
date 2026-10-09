export type ExamQuestionType = 'kanji-reading' | 'context' | 'grammar';

/**
 * 依 JLPT 題型自編的原創模擬題（不是官方歷屆試題）。
 * sentence 中用［］標出畫底線的字，用（　）表示空格。
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
  context: '文脈語彙',
  grammar: '文法',
};

export const EXAM_TYPE_PROMPTS: Record<ExamQuestionType, string> = {
  'kanji-reading': '畫底線的字怎麼讀？',
  context: '（　）裡應該填入哪一個？',
  grammar: '（　）裡應該填入哪一個？',
};
