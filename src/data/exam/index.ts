import type { JlptLevel } from '@/data/vocab/types';
import { stripRuby } from '@/lib/furigana';

import { N4_EXAM_BANK } from './bank/n4';
import { N4_LISTENING_BANK } from './bank/n4-listening';
import { N5_EXAM_BANK } from './bank/n5';
import { N5_LISTENING_BANK } from './bank/n5-listening';
import { N4_FROZEN } from './frozen/n4';
import { N5_FROZEN } from './frozen/n5';
import { N1_EXAM_GROUPS } from './groups/n1';
import { N2_EXAM_GROUPS } from './groups/n2';
import { N3_EXAM_GROUPS } from './groups/n3';
import { N4_EXAM_GROUPS } from './groups/n4';
import { N5_EXAM_GROUPS } from './groups/n5';
import { N1_EXAM } from './n1';
import { N2_EXAM } from './n2';
import { N3_EXAM } from './n3';
import { N4_EXAM } from './n4';
import { N5_EXAM } from './n5';
import { ORIGINAL_SOURCE, TYPE_DEFAULTS, type ExamGroup, type ExamQuestion } from './types';

export {
  EXAM_CATEGORY_LABELS,
  EXAM_SECTION_TYPES,
  EXAM_SUBCATEGORY_LABELS,
  EXAM_TYPE_LABELS,
  EXAM_TYPE_PROMPTS,
  ORIGINAL_SOURCE,
  TYPE_DEFAULTS,
} from './types';
export type {
  ExamCategory,
  ExamDifficulty,
  ExamGroup,
  ExamQuestion,
  ExamQuestionType,
  ExamSection,
  ExamSubcategory,
  ScriptLine,
  ScriptSpeaker,
} from './types';

const RAW_EXAM: Record<JlptLevel, ExamQuestion[]> = {
  // 原有的 50 題＋擴充題庫（新題型、讀解題組）
  N5: [...N5_EXAM, ...N5_EXAM_BANK, ...N5_LISTENING_BANK],
  N4: [...N4_EXAM, ...N4_EXAM_BANK, ...N4_LISTENING_BANK],
  N3: N3_EXAM,
  N2: N2_EXAM,
  N1: N1_EXAM,
};

export const EXAM_GROUPS_BY_LEVEL: Record<JlptLevel, ExamGroup[]> = {
  N5: N5_EXAM_GROUPS,
  N4: N4_EXAM_GROUPS,
  N3: N3_EXAM_GROUPS,
  N2: N2_EXAM_GROUPS,
  N1: N1_EXAM_GROUPS,
};

const GROUP_BY_ID = new Map(
  Object.values(EXAM_GROUPS_BY_LEVEL)
    .flat()
    .map((group) => [group.id, group]),
);

export function getExamGroup(id: string): ExamGroup | undefined {
  return GROUP_BY_ID.get(id);
}

/**
 * 讀進來的題目：補上題組的文章或對話（畫面直接用 passage、script），
 * 舊題目沒有寫的分類、難度、來源、版本，依題型補預設值。
 */
const RUBY = /\[[^|\]]+\|[^\]]+\]/;

export function normalizeQuestion(level: JlptLevel, question: ExamQuestion): ExamQuestion {
  const group = question.groupId ? GROUP_BY_ID.get(question.groupId) : undefined;
  const defaults = TYPE_DEFAULTS[question.type];
  // 新題目可以直接在句子、文章裡寫注音 [漢字|かな]：分成畫面用的文字和注音版本
  const sentenceHasRuby = RUBY.test(question.sentence);
  const rawPassage = question.passage ?? group?.passage;
  const passageHasRuby = rawPassage !== undefined && RUBY.test(rawPassage);
  return {
    ...question,
    sentence: sentenceHasRuby ? stripRuby(question.sentence) : question.sentence,
    furigana:
      question.furigana ?? (sentenceHasRuby ? question.sentence.replace(/[［］]/g, '') : undefined),
    level: question.level ?? level,
    category: question.category ?? defaults.category,
    subcategory: question.subcategory ?? group?.subcategory ?? defaults.subcategory,
    difficulty: question.difficulty ?? group?.difficulty ?? 2,
    source: question.source ?? group?.source ?? ORIGINAL_SOURCE.source,
    license: question.license ?? group?.license ?? ORIGINAL_SOURCE.license,
    version: question.version ?? 1,
    passage: rawPassage !== undefined && passageHasRuby ? stripRuby(rawPassage) : rawPassage,
    passageFurigana: passageHasRuby ? rawPassage : undefined,
    passageTranslation: group?.translation,
    script: question.script ?? group?.script,
  };
}

export const EXAM_BY_LEVEL: Record<JlptLevel, ExamQuestion[]> = {
  N5: RAW_EXAM.N5.map((q) => normalizeQuestion('N5', q)),
  N4: RAW_EXAM.N4.map((q) => normalizeQuestion('N4', q)),
  N3: RAW_EXAM.N3.map((q) => normalizeQuestion('N3', q)),
  N2: RAW_EXAM.N2.map((q) => normalizeQuestion('N2', q)),
  N1: RAW_EXAM.N1.map((q) => normalizeQuestion('N1', q)),
};

/**
 * 固定考卷用、已固定下來的自動出題（frozen/）：只有固定考卷、考試紀錄、錯題本會用到，
 * 不放進隨機組卷和題型練習（那裡已經有自動出的同一題）。
 */
export const FROZEN_BY_LEVEL: Record<JlptLevel, ExamQuestion[]> = {
  N5: N5_FROZEN.map(({ from: _from, ...q }) => normalizeQuestion('N5', q)),
  N4: N4_FROZEN.map(({ from: _from, ...q }) => normalizeQuestion('N4', q)),
  N3: [],
  N2: [],
  N1: [],
};

const QUESTION_BY_ID = new Map(
  [...Object.values(EXAM_BY_LEVEL), ...Object.values(FROZEN_BY_LEVEL)]
    .flat()
    .map((question) => [question.id, question]),
);

/** 用 id 找自編題目（自動出的題目在 lib/generated-exam.ts） */
export function getAuthoredQuestion(id: string): ExamQuestion | undefined {
  return QUESTION_BY_ID.get(id);
}
