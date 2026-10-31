import type { ExamQuestion, ExamSubcategory, ScriptLine, ScriptSpeaker } from '../types';

/**
 * N3〜N1 擴充題庫共用的出題工具（N5、N4 的題庫檔各自有一份，寫法相同）。
 * 選項第一個是正確答案；optionNotes 的順序和 options 一樣。
 */
const BASE = { license: 'original', version: 1 } as const;

export type Four = [string, string, string, string];
export type Three = [string, string, string];
type Difficulty = 1 | 2 | 3;

/** 用法：題目是一個詞，選出用法正確的句子 */
export function usage(
  id: string,
  difficulty: Difficulty,
  word: string,
  meaning: string,
  options: Four,
  explanation: string,
  optionNotes: Four,
): ExamQuestion {
  return {
    ...BASE,
    id,
    type: 'usage',
    subcategory: 'usage',
    difficulty,
    sentence: word,
    options,
    explanation,
    translation: `「${word}」：${meaning}`,
    optionNotes,
  };
}

/** 語形成（N2）：接頭語、接尾語、複合語 */
export function wordFormation(
  id: string,
  difficulty: Difficulty,
  sentence: string,
  options: Four,
  explanation: string,
  translation: string,
  optionNotes: Four,
): ExamQuestion {
  return {
    ...BASE,
    id,
    type: 'context',
    subcategory: 'word-formation',
    difficulty,
    sentence,
    options,
    explanation,
    translation,
    optionNotes,
  };
}

/** 句子重組：sentence 用＿＿表示空格、★ 表示要回答的位置；第一個選項是放在 ★ 的詞 */
export function order(
  id: string,
  difficulty: Difficulty,
  sentence: string,
  options: Four,
  explanation: string,
  translation: string,
  optionNotes: Four,
): ExamQuestion {
  return {
    ...BASE,
    id,
    type: 'sentence-order',
    subcategory: 'sentence-order',
    difficulty,
    sentence,
    options,
    explanation,
    translation,
    optionNotes,
  };
}

export type Blank = [options: Four, explanation: string, notes: Four];

const FULL_WIDTH = ['１', '２', '３', '４', '５', '６'];

/** 文章文法：一篇文章挖幾個空格，每個空格一題（id：前綴-1、-2…） */
export function textGrammar(
  idPrefix: string,
  groupId: string,
  difficulty: Difficulty,
  blanks: Blank[],
): ExamQuestion[] {
  return blanks.map(([options, explanation, optionNotes], i) => ({
    ...BASE,
    id: `${idPrefix}-${i + 1}`,
    type: 'text-grammar',
    subcategory: 'text-grammar',
    difficulty,
    groupId,
    sentence: `（${FULL_WIDTH[i]}）に入るのはどれか。`,
    options,
    explanation,
    translation: `第 ${i + 1} 個空格應該填入哪一個？`,
    optionNotes,
  }));
}

export type PassageQuestion = [sentence: string, options: Four, explanation: string, notes: Four];

/** 讀解題組：一篇文章幾個問題（id：前綴-1、-2…） */
export function readingSet(
  idPrefix: string,
  groupId: string,
  subcategory: Extract<
    ExamSubcategory,
    'short' | 'mid' | 'long' | 'integrated' | 'thematic' | 'info-search'
  >,
  difficulty: Difficulty,
  questions: PassageQuestion[],
): ExamQuestion[] {
  return questions.map(([sentence, options, explanation, optionNotes], i) => ({
    ...BASE,
    id: `${idPrefix}-${i + 1}`,
    type: 'reading',
    subcategory,
    difficulty,
    groupId,
    sentence,
    options,
    explanation,
    optionNotes,
  }));
}

type Line = [ScriptSpeaker, string];
const lines = (items: Line[]): ScriptLine[] => items.map(([speaker, text]) => ({ speaker, text }));

/**
 * 聽解（課題理解、重點理解、概要理解、綜合理解）：script 第一句是情境說明，sentence 是問題。
 * 概要理解的問題和選項用唸的（題目紙上沒有印）。
 */
export function dialogue(
  id: string,
  subcategory: Extract<ExamSubcategory, 'task' | 'point' | 'summary' | 'integrated-listening'>,
  difficulty: Difficulty,
  script: Line[],
  sentence: string,
  options: Four,
  explanation: string,
  translation: string,
  optionNotes: Four,
): ExamQuestion {
  return {
    ...BASE,
    id,
    type: 'listening',
    subcategory,
    difficulty,
    script: lines(script),
    sentence,
    options,
    explanation,
    translation,
    optionNotes,
  };
}

/** 發話表現：sentence 是情境和問題，三個說法用唸的 */
export function utterance(
  id: string,
  difficulty: Difficulty,
  sentence: string,
  options: Three,
  explanation: string,
  translation: string,
  optionNotes: Three,
): ExamQuestion {
  return {
    ...BASE,
    id,
    type: 'listening',
    subcategory: 'utterance',
    difficulty,
    sentence,
    options,
    explanation,
    translation,
    optionNotes,
  };
}

/** 即時應答：一句話，三個回答用唸的 */
export function quick(
  id: string,
  difficulty: Difficulty,
  speaker: ScriptSpeaker,
  line: string,
  options: Three,
  explanation: string,
  translation: string,
  optionNotes: Three,
): ExamQuestion {
  return {
    ...BASE,
    id,
    type: 'listening',
    subcategory: 'quick-response',
    difficulty,
    script: [{ speaker, text: line }],
    sentence: '最もよい返事はどれですか。',
    options,
    explanation,
    translation,
    optionNotes,
  };
}
