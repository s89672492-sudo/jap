import { LEVEL_COUNTS } from '@/data/level-counts';
import { JLPT_LEVELS, type JlptLevel } from '@/data/vocab';
import { dateKey, readingStreak } from '@/lib/daily';
import { masteryOf, type Mastery, type StoredCard } from '@/lib/srs';
import type { StudyLog } from '@/stores/study-store';

/**
 * 首頁「今日任務」和「學習進度總覽」的統計：只用記憶卡、錯題本、每日練習紀錄計算，
 * 不需要下載各等級的單字資料（總數在 data/level-counts.ts）。
 */

/** 記憶卡的種類，從 id 看：單字 n5-001、文法 n5-g01，其他是試題（n5-exam-01、gen-kr-n5-001…） */
export type ItemKind = 'word' | 'grammar' | 'question';

export function kindOfId(id: string): ItemKind {
  if (/^n[1-5]-\d+$/.test(id)) return 'word';
  if (/^n[1-5]-g\d+$/.test(id)) return 'grammar';
  return 'question';
}

export function levelOfId(id: string): JlptLevel | null {
  const match = /(?:^|-)n([1-5])-/.exec(id);
  return match ? (`N${match[1]}` as JlptLevel) : null;
}

export type LevelProgress = {
  /** 各學習狀態的單字數（沒有記憶卡的算新單字） */
  words: Record<Mastery, number>;
  wordsTotal: number;
  /** 練過的文法（有記憶卡）、已熟練的文法 */
  grammarPracticed: number;
  grammarMastered: number;
  grammarTotal: number;
  /** 到期該複習、而且不在錯題本裡的單字和文法（錯題另外算） */
  dueWords: number;
  dueGrammar: number;
  /** 錯題本裡的題數、其中到期的題數（還沒有複習紀錄的錯題也算到期） */
  mistakes: number;
  dueMistakes: number;
};

const emptyLevel = (level: JlptLevel): LevelProgress => ({
  words: { new: LEVEL_COUNTS[level].words, learning: 0, reviewing: 0, mastered: 0 },
  wordsTotal: LEVEL_COUNTS[level].words,
  grammarPracticed: 0,
  grammarMastered: 0,
  grammarTotal: LEVEL_COUNTS[level].grammar,
  dueWords: 0,
  dueGrammar: 0,
  mistakes: 0,
  dueMistakes: 0,
});

/** 每個等級的學習進度和待複習數量 */
export function levelProgress(
  cards: Record<string, StoredCard>,
  mistakes: ReadonlySet<string>,
  now: number,
): Record<JlptLevel, LevelProgress> {
  const result = Object.fromEntries(
    JLPT_LEVELS.map((level) => [level, emptyLevel(level)]),
  ) as Record<JlptLevel, LevelProgress>;

  for (const [id, card] of Object.entries(cards)) {
    const level = levelOfId(id);
    if (!level) continue;
    const progress = result[level];
    const kind = kindOfId(id);
    const due = card.d <= now && !mistakes.has(id);
    if (kind === 'word') {
      const mastery = masteryOf(card);
      progress.words.new -= 1;
      progress.words[mastery] += 1;
      if (due) progress.dueWords += 1;
    } else if (kind === 'grammar') {
      progress.grammarPracticed += 1;
      if (masteryOf(card) === 'mastered') progress.grammarMastered += 1;
      if (due) progress.dueGrammar += 1;
    }
  }
  // 資料更新後如果有已經不存在的單字，不要算出負數
  for (const progress of Object.values(result))
    progress.words.new = Math.max(0, progress.words.new);

  for (const id of mistakes) {
    const level = levelOfId(id);
    if (!level) continue;
    result[level].mistakes += 1;
    const card = cards[id];
    if (!card || card.d <= now) result[level].dueMistakes += 1;
  }
  return result;
}

/** 連續學習天數：有答題練習（任何測驗、單字卡、模擬考）或讀完文章的日子都算 */
export function learningStreak(
  log: StudyLog,
  readingDays: ReadonlySet<string>,
  now: number,
): number {
  const days = new Set(readingDays);
  for (const [day, entry] of Object.entries(log)) if (entry.n > 0) days.add(day);
  return readingStreak(days, new Date(now));
}

export type DayStat = {
  date: string;
  /** 圖表下方的標籤：今天、週一… */
  label: string;
  /** 答題數、答對數 */
  n: number;
  c: number;
};

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

/** 最近幾天（含今天）的練習量，由舊到新 */
export function recentDays(log: StudyLog, now: number, days = 7): DayStat[] {
  const result: DayStat[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const key = dateKey(date);
    const entry = log[key];
    result.push({
      date: key,
      label: i === 0 ? '今天' : `週${WEEKDAYS[date.getDay()]}`,
      n: entry?.n ?? 0,
      c: entry?.c ?? 0,
    });
  }
  return result;
}

/** 答對率（0〜1）；沒有答題時回傳 null */
export function accuracy(stats: { n: number; c: number }[]): number | null {
  const n = stats.reduce((sum, s) => sum + s.n, 0);
  const c = stats.reduce((sum, s) => sum + s.c, 0);
  return n > 0 ? c / n : null;
}

export const percent = (value: number | null) =>
  value === null ? '—' : `${Math.round(value * 100)}%`;
