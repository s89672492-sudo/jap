export type ExamQuestionType =
  | 'kanji-reading'
  | 'orthography'
  | 'context'
  | 'paraphrase'
  | 'grammar'
  | 'sentence-order'
  | 'reading'
  | 'listening';

export type ScriptSpeaker = 'narrator' | 'man' | 'woman';

/** 聽解題的一句台詞；播放時依說話者用不同音高，方便分辨 */
export type ScriptLine = {
  speaker: ScriptSpeaker;
  text: string;
};

/**
 * 依 JLPT 題型自編的原創模擬題（不是官方歷屆試題）。
 * sentence 中用［］標出畫底線的字，用（　）表示空格；
 * 句子重組題用＿＿表示空格、★ 表示要回答的位置。
 * 讀解題的 sentence 是問題、passage 是文章；聽解題的 sentence 是問題、script 是對話。
 */
export type ExamQuestion = {
  id: string;
  type: ExamQuestionType;
  sentence: string;
  /** 第一個是正確答案；出題時會打亂順序 */
  options: [string, string, string, string];
  /** 中文解說，作答後顯示 */
  explanation: string;
  /** 讀解：要閱讀的文章 */
  passage?: string;
  /** 聽解：對話內容（第一句是情境說明），作答後才顯示 */
  script?: ScriptLine[];
};

export const EXAM_TYPE_LABELS: Record<ExamQuestionType, string> = {
  'kanji-reading': '漢字讀法',
  orthography: '表記',
  context: '文脈語彙',
  paraphrase: '言い換え',
  grammar: '文法',
  'sentence-order': '句子重組',
  reading: '讀解',
  listening: '聽解',
};

export const EXAM_TYPE_PROMPTS: Record<ExamQuestionType, string> = {
  'kanji-reading': '畫底線的字怎麼讀？',
  orthography: '畫底線的字用漢字怎麼寫？',
  context: '（　）裡應該填入哪一個？',
  paraphrase: '哪一個意思最接近畫底線的部分？',
  grammar: '（　）裡應該填入哪一個？',
  'sentence-order': '排成正確的句子時，★ 應該放哪一個？',
  reading: '閱讀文章，回答問題。',
  listening: '聽完對話，回答問題。',
};

export type ExamSection = 'all' | 'vocabulary' | 'grammar' | 'reading' | 'listening';

/** JLPT 的科目分類，給模擬試題的題型篩選使用 */
export const EXAM_SECTION_TYPES: Record<Exclude<ExamSection, 'all'>, ExamQuestionType[]> = {
  vocabulary: ['kanji-reading', 'orthography', 'context', 'paraphrase'],
  grammar: ['grammar', 'sentence-order'],
  reading: ['reading'],
  listening: ['listening'],
};
