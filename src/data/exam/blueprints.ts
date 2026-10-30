import type { ExamCategory, ExamDifficulty, ExamQuestionType, ExamSubcategory } from './types';

import type { JlptLevel } from '@/data/vocab/types';

/**
 * 各等級的考卷藍圖：考試分幾節、每節時間、每節有哪些大問、每個大問正式考試大約幾題。
 *
 * 時間：依 JLPT 官方公布的「試驗科目與時間」（N4、N5 自 2020 年 12 月起縮短，
 * N1 聽解自 2022 年 12 月起為 55 分鐘）。
 * 題數：官方標示為「大約題數」，而且會調整；這裡是參考值，開發時無法連線到 jlpt.jp 逐一核對，
 * 所以 countsVerified 是 false。組卷時以題庫實際有的題目為準，不會為了湊數產生題目。
 */

export type BlueprintItem = {
  subcategory: ExamSubcategory;
  /** 題目用的題型（題目說明、計分科目） */
  type: ExamQuestionType;
  /** 正式考試大約的題數（參考值） */
  officialCount: number;
};

export type BlueprintSitting = {
  label: string;
  /** 正式考試這一節的時間（分鐘） */
  minutes: number;
  categories: ExamCategory[];
  items: BlueprintItem[];
};

export type LevelBlueprint = {
  level: JlptLevel;
  sittings: BlueprintSitting[];
  /** 時間已依官方資料確認 */
  timesVerified: true;
  /** 各大問題數尚未逐一和官方最新資料核對 */
  countsVerified: false;
  /** 組隨機考卷時的難度比例（1 基礎、2 標準、3 進階） */
  difficultyMix: Record<ExamDifficulty, number>;
};

const item = (
  subcategory: ExamSubcategory,
  type: ExamQuestionType,
  officialCount: number,
): BlueprintItem => ({ subcategory, type, officialCount });

const MIX: Record<ExamDifficulty, number> = { 1: 0.3, 2: 0.5, 3: 0.2 };

const N5: LevelBlueprint = {
  level: 'N5',
  timesVerified: true,
  countsVerified: false,
  difficultyMix: MIX,
  sittings: [
    {
      label: '言語知識（文字・語彙）',
      minutes: 20,
      categories: ['vocabulary'],
      items: [
        item('kanji-reading', 'kanji-reading', 7),
        item('orthography', 'orthography', 5),
        item('context', 'context', 6),
        item('paraphrase', 'paraphrase', 3),
      ],
    },
    {
      label: '言語知識（文法）・讀解',
      minutes: 40,
      categories: ['grammar', 'reading'],
      items: [
        item('grammar-form', 'grammar', 9),
        item('sentence-order', 'sentence-order', 4),
        item('text-grammar', 'text-grammar', 4),
        item('short', 'reading', 2),
        item('mid', 'reading', 2),
        item('info-search', 'reading', 1),
      ],
    },
    {
      label: '聽解',
      minutes: 30,
      categories: ['listening'],
      items: [
        item('task', 'listening', 7),
        item('point', 'listening', 6),
        item('utterance', 'listening', 5),
        item('quick-response', 'listening', 6),
      ],
    },
  ],
};

const N4: LevelBlueprint = {
  level: 'N4',
  timesVerified: true,
  countsVerified: false,
  difficultyMix: MIX,
  sittings: [
    {
      label: '言語知識（文字・語彙）',
      minutes: 25,
      categories: ['vocabulary'],
      items: [
        item('kanji-reading', 'kanji-reading', 7),
        item('orthography', 'orthography', 5),
        item('context', 'context', 8),
        item('paraphrase', 'paraphrase', 4),
        item('usage', 'usage', 4),
      ],
    },
    {
      label: '言語知識（文法）・讀解',
      minutes: 55,
      categories: ['grammar', 'reading'],
      items: [
        item('grammar-form', 'grammar', 13),
        item('sentence-order', 'sentence-order', 4),
        item('text-grammar', 'text-grammar', 4),
        item('short', 'reading', 3),
        item('mid', 'reading', 3),
        item('info-search', 'reading', 2),
      ],
    },
    {
      label: '聽解',
      minutes: 35,
      categories: ['listening'],
      items: [
        item('task', 'listening', 8),
        item('point', 'listening', 7),
        item('utterance', 'listening', 5),
        item('quick-response', 'listening', 8),
      ],
    },
  ],
};

const N3: LevelBlueprint = {
  level: 'N3',
  timesVerified: true,
  countsVerified: false,
  difficultyMix: MIX,
  sittings: [
    {
      label: '言語知識（文字・語彙）',
      minutes: 30,
      categories: ['vocabulary'],
      items: [
        item('kanji-reading', 'kanji-reading', 8),
        item('orthography', 'orthography', 6),
        item('context', 'context', 11),
        item('paraphrase', 'paraphrase', 5),
        item('usage', 'usage', 5),
      ],
    },
    {
      label: '言語知識（文法）・讀解',
      minutes: 70,
      categories: ['grammar', 'reading'],
      items: [
        item('grammar-form', 'grammar', 13),
        item('sentence-order', 'sentence-order', 5),
        item('text-grammar', 'text-grammar', 5),
        item('short', 'reading', 4),
        item('mid', 'reading', 6),
        item('long', 'reading', 4),
        item('info-search', 'reading', 2),
      ],
    },
    {
      label: '聽解',
      minutes: 40,
      categories: ['listening'],
      items: [
        item('task', 'listening', 6),
        item('point', 'listening', 6),
        item('summary', 'listening', 3),
        item('utterance', 'listening', 4),
        item('quick-response', 'listening', 9),
      ],
    },
  ],
};

const N2: LevelBlueprint = {
  level: 'N2',
  timesVerified: true,
  countsVerified: false,
  difficultyMix: MIX,
  sittings: [
    {
      label: '言語知識（文字・語彙・文法）・讀解',
      minutes: 105,
      categories: ['vocabulary', 'grammar', 'reading'],
      items: [
        item('kanji-reading', 'kanji-reading', 5),
        item('orthography', 'orthography', 5),
        item('word-formation', 'context', 3),
        item('context', 'context', 7),
        item('paraphrase', 'paraphrase', 5),
        item('usage', 'usage', 5),
        item('grammar-form', 'grammar', 12),
        item('sentence-order', 'sentence-order', 5),
        item('text-grammar', 'text-grammar', 5),
        item('short', 'reading', 5),
        item('mid', 'reading', 9),
        item('integrated', 'reading', 2),
        item('thematic', 'reading', 3),
        item('info-search', 'reading', 2),
      ],
    },
    {
      label: '聽解',
      minutes: 50,
      categories: ['listening'],
      items: [
        item('task', 'listening', 5),
        item('point', 'listening', 6),
        item('summary', 'listening', 5),
        item('quick-response', 'listening', 12),
        item('integrated-listening', 'listening', 4),
      ],
    },
  ],
};

const N1: LevelBlueprint = {
  level: 'N1',
  timesVerified: true,
  countsVerified: false,
  difficultyMix: MIX,
  sittings: [
    {
      label: '言語知識（文字・語彙・文法）・讀解',
      minutes: 110,
      categories: ['vocabulary', 'grammar', 'reading'],
      items: [
        item('kanji-reading', 'kanji-reading', 6),
        item('context', 'context', 7),
        item('paraphrase', 'paraphrase', 6),
        item('usage', 'usage', 6),
        item('grammar-form', 'grammar', 10),
        item('sentence-order', 'sentence-order', 5),
        item('text-grammar', 'text-grammar', 5),
        item('short', 'reading', 4),
        item('mid', 'reading', 9),
        item('long', 'reading', 4),
        item('integrated', 'reading', 3),
        item('thematic', 'reading', 4),
        item('info-search', 'reading', 2),
      ],
    },
    {
      label: '聽解',
      minutes: 55,
      categories: ['listening'],
      items: [
        item('task', 'listening', 5),
        item('point', 'listening', 6),
        item('summary', 'listening', 5),
        item('quick-response', 'listening', 11),
        item('integrated-listening', 'listening', 3),
      ],
    },
  ],
};

export const BLUEPRINTS: Record<JlptLevel, LevelBlueprint> = { N5, N4, N3, N2, N1 };

/** 正式考試這一節大約幾題（參考值） */
export function officialQuestionCount(sitting: BlueprintSitting): number {
  return sitting.items.reduce((sum, i) => sum + i.officialCount, 0);
}
