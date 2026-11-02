import type { JlptLevel } from '@/data/vocab/types';

/**
 * 題型（決定題目說明和計分科目）。
 * usage（用法）、text-grammar（文章文法）是第二版加入的題型，舊資料沒有。
 */
export type ExamQuestionType =
  | 'kanji-reading'
  | 'orthography'
  | 'context'
  | 'paraphrase'
  | 'usage'
  | 'grammar'
  | 'sentence-order'
  | 'text-grammar'
  | 'reading'
  | 'listening';

/** JLPT 的四大類 */
export type ExamCategory = 'vocabulary' | 'grammar' | 'reading' | 'listening';

/**
 * 細分題型（JLPT 試題本的「大問」）。各等級實際用到哪些見 data/exam/blueprints.ts。
 * vocabulary：漢字讀法、表記、語形成、文脈規定、言い換え類義、用法
 * grammar：文法形式、句子重組、文章文法
 * reading：短篇、中篇、長篇、綜合理解、主張理解、資訊檢索
 * listening：課題理解、重點理解、概要理解、發話表現、即時應答、綜合理解
 */
export type ExamSubcategory =
  | 'kanji-reading'
  | 'orthography'
  | 'word-formation'
  | 'context'
  | 'paraphrase'
  | 'usage'
  | 'grammar-form'
  | 'sentence-order'
  | 'text-grammar'
  | 'short'
  | 'mid'
  | 'long'
  | 'integrated'
  | 'thematic'
  | 'info-search'
  | 'task'
  | 'point'
  | 'summary'
  | 'utterance'
  | 'quick-response'
  | 'integrated-listening';

/** 1 基礎、2 標準、3 進階（同一等級內的相對難度） */
export type ExamDifficulty = 1 | 2 | 3;

/** 題目或素材的來源與授權（每題都要能追溯） */
export type ExamSource = {
  /** 例如「偵探日語原創練習題」 */
  source: string;
  /** 例如「original」（本專案自編）、「CC-BY-4.0」 */
  license: string;
};

/**
 * 題組：一篇文章或一段聽力對應好幾題。題目用 groupId 對到題組，文章、音檔只存一份。
 */
export type ExamGroup = {
  id: string;
  kind: 'passage' | 'audio';
  subcategory: ExamSubcategory;
  /** 讀解文章（日文）；可以直接寫注音 [漢字|かな]，讀進來時會分成文章和注音版本 */
  passage?: string;
  /** 文章或對話的中文翻譯（考後才顯示） */
  translation?: string;
  /** 聽力對話（第一句是情境說明） */
  script?: ScriptLine[];
  /** 圖片（assets 路徑，由 require 載入） */
  image?: number;
  /** 音檔路徑（之後的聽力系統用） */
  audio?: string;
  difficulty?: ExamDifficulty;
  source?: string;
  license?: string;
  version?: number;
};

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
  // ── 第二版的分類欄位：舊題目沒有寫，讀進來時依題型補上預設值（見 data/exam/index.ts） ──
  level?: JlptLevel;
  category?: ExamCategory;
  subcategory?: ExamSubcategory;
  difficulty?: ExamDifficulty;
  source?: string;
  license?: string;
  /** 題目內容版本：修改題目內容時加一（考卷會用內容檢查碼發現改動） */
  version?: number;
  /** 讀解、聽力題組 */
  groupId?: string;
  /** 每個選項的解說，順序和 options 相同（第一個是正確答案的說明） */
  optionNotes?: [string, string, string, string] | [string, string, string];
  /** 題目句子的中文翻譯（考後顯示） */
  translation?: string;
  // ── 讀進來時由題組補上（資料檔裡不用寫） ──
  /** 文章的注音版本（[漢字|かな]） */
  passageFurigana?: string;
  /** 文章或對話的中文翻譯 */
  passageTranslation?: string;
  sentence: string;
  /** 第一個是正確答案；出題時會打亂順序。聽解的發話表現、即時應答和 JLPT 一樣只有 3 個 */
  options: [string, string, string, string] | [string, string, string];
  /** 中文解說，作答後顯示 */
  explanation: string;
  /** 讀解：要閱讀的文章 */
  passage?: string;
  /** 加了假名注音的題目句子（去掉［］），自動出的題目才有；沒有的話依句子查注音表 */
  furigana?: string;
  /** 聽解：對話內容（第一句是情境說明），作答後才顯示 */
  script?: ScriptLine[];
};

export const EXAM_TYPE_LABELS: Record<ExamQuestionType, string> = {
  'kanji-reading': '漢字讀法',
  orthography: '表記',
  context: '文脈語彙',
  paraphrase: '言い換え',
  usage: '用法',
  grammar: '文法',
  'sentence-order': '句子重組',
  'text-grammar': '文章文法',
  reading: '讀解',
  listening: '聽解',
};

export const EXAM_TYPE_PROMPTS: Record<ExamQuestionType, string> = {
  'kanji-reading': '畫底線的字怎麼讀？',
  orthography: '畫底線的字用漢字怎麼寫？',
  context: '（　）裡應該填入哪一個？',
  paraphrase: '哪一個意思最接近畫底線的部分？',
  usage: '下面哪一句的用法最正確？',
  grammar: '（　）裡應該填入哪一個？',
  'sentence-order': '排成正確的句子時，★ 應該放哪一個？',
  'text-grammar': '閱讀文章，選出最適合填入空格的選項。',
  reading: '閱讀文章，回答問題。',
  listening: '聽完對話，回答問題。',
};

export type ExamSection = 'all' | 'vocabulary' | 'grammar' | 'reading' | 'listening';

/** JLPT 的科目分類，給模擬試題的題型篩選使用 */
export const EXAM_SECTION_TYPES: Record<Exclude<ExamSection, 'all'>, ExamQuestionType[]> = {
  vocabulary: ['kanji-reading', 'orthography', 'context', 'paraphrase', 'usage'],
  grammar: ['grammar', 'sentence-order', 'text-grammar'],
  reading: ['reading'],
  listening: ['listening'],
};

export const EXAM_SUBCATEGORY_LABELS: Record<ExamSubcategory, string> = {
  'kanji-reading': '漢字讀法',
  orthography: '表記',
  'word-formation': '語形成',
  context: '文脈規定',
  paraphrase: '言い換え類義',
  usage: '用法',
  'grammar-form': '文法形式',
  'sentence-order': '句子重組',
  'text-grammar': '文章文法',
  short: '短篇讀解',
  mid: '中篇讀解',
  long: '長篇讀解',
  integrated: '綜合理解',
  thematic: '主張理解',
  'info-search': '資訊檢索',
  task: '課題理解',
  point: '重點理解',
  summary: '概要理解',
  utterance: '發話表現',
  'quick-response': '即時應答',
  'integrated-listening': '綜合理解（聽解）',
};

export const EXAM_CATEGORY_LABELS: Record<ExamCategory, string> = {
  vocabulary: '文字・語彙',
  grammar: '文法',
  reading: '讀解',
  listening: '聽解',
};

/** 舊題目沒有寫分類時，依題型推定 */
export const TYPE_DEFAULTS: Record<
  ExamQuestionType,
  { category: ExamCategory; subcategory: ExamSubcategory }
> = {
  'kanji-reading': { category: 'vocabulary', subcategory: 'kanji-reading' },
  orthography: { category: 'vocabulary', subcategory: 'orthography' },
  context: { category: 'vocabulary', subcategory: 'context' },
  paraphrase: { category: 'vocabulary', subcategory: 'paraphrase' },
  usage: { category: 'vocabulary', subcategory: 'usage' },
  grammar: { category: 'grammar', subcategory: 'grammar-form' },
  'sentence-order': { category: 'grammar', subcategory: 'sentence-order' },
  'text-grammar': { category: 'grammar', subcategory: 'text-grammar' },
  reading: { category: 'reading', subcategory: 'short' },
  listening: { category: 'listening', subcategory: 'point' },
};

/** 本專案自編題目的來源標示（不是官方歷屆試題） */
export const ORIGINAL_SOURCE: ExamSource = {
  source: '偵探日語原創練習題（依 JLPT 題型自編，非官方試題）',
  license: 'original',
};
