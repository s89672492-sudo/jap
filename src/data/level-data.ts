import { useEffect, useSyncExternalStore } from 'react';

import type { GrammarPoint } from '@/data/grammar';
import type { ReadingArticle } from '@/data/reading';
import { JLPT_LEVELS, type JlptLevel, type VocabWord } from '@/data/vocab';

/**
 * 學習資料依等級分批載入：每個等級的單字（含例句）、文法和閱讀文章是獨立的檔案，
 * 用到哪個等級才下載和解析，不必一開啟就處理全部 9,618 個單字。
 * 網頁版的檔名帶有內容指紋，更新後不會新舊資料混用；離線快取會在背景把各等級都存起來。
 */
export type LevelData = {
  words: VocabWord[];
  grammar: GrammarPoint[];
  reading: ReadingArticle[];
};

/** 全部等級合在一起（跨等級搜尋、收藏、模擬考自動出題用） */
export type AllLevelData = {
  byLevel: Record<JlptLevel, LevelData>;
  words: VocabWord[];
  grammar: GrammarPoint[];
  wordById: Map<string, VocabWord>;
  grammarById: Map<string, GrammarPoint>;
};

const LOADERS: Record<JlptLevel, () => Promise<{ LEVEL_DATA: LevelData }>> = {
  N5: () => import('./levels/n5'),
  N4: () => import('./levels/n4'),
  N3: () => import('./levels/n3'),
  N2: () => import('./levels/n2'),
  N1: () => import('./levels/n1'),
};

const loaded: Partial<Record<JlptLevel, LevelData>> = {};
const pending: Partial<Record<JlptLevel, Promise<LevelData>>> = {};
let all: AllLevelData | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export function loadLevel(level: JlptLevel): Promise<LevelData> {
  const done = loaded[level];
  if (done) return Promise.resolve(done);
  pending[level] ??= LOADERS[level]().then((module) => {
    loaded[level] = module.LEVEL_DATA;
    emit();
    return module.LEVEL_DATA;
  });
  return pending[level];
}

export async function loadAllLevels(): Promise<AllLevelData> {
  if (all) return all;
  const levels = await Promise.all(JLPT_LEVELS.map(loadLevel));
  if (!all) {
    const byLevel = Object.fromEntries(JLPT_LEVELS.map((level, i) => [level, levels[i]])) as Record<
      JlptLevel,
      LevelData
    >;
    const words = levels.flatMap((data) => data.words);
    const grammar = levels.flatMap((data) => data.grammar);
    all = {
      byLevel,
      words,
      grammar,
      wordById: new Map(words.map((word) => [word.id, word])),
      grammarById: new Map(grammar.map((point) => [point.id, point])),
    };
    emit();
  }
  return all;
}

/** 已經載入的等級（沒載入時回傳 undefined）；不在畫面裡時使用 */
export function getLevel(level: JlptLevel): LevelData | undefined {
  return loaded[level];
}

/** 全部等級（還沒載入完時回傳 null）；不在畫面裡時使用 */
export function getAllLevels(): AllLevelData | null {
  return all;
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** 這個等級的資料；還沒載入時開始載入並回傳 null，載入完成後畫面自動更新 */
export function useLevelData(level: JlptLevel): LevelData | null {
  const data = useSyncExternalStore(
    subscribe,
    () => loaded[level] ?? null,
    () => loaded[level] ?? null,
  );
  useEffect(() => {
    loadLevel(level);
  }, [level]);
  return data;
}

/** 全部等級的資料；還沒載入完時回傳 null（只有跨等級的功能才需要） */
export function useAllLevelData(enabled = true): AllLevelData | null {
  const data = useSyncExternalStore(
    subscribe,
    () => all,
    () => all,
  );
  useEffect(() => {
    if (enabled) loadAllLevels();
  }, [enabled]);
  return data;
}
