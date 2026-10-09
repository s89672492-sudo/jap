import { JLPT_LEVELS, type JlptLevel } from '@/data/vocab';

import { createPersistedStore, usePersistedStore } from './persisted-store';

const DEFAULT_LEVEL: JlptLevel = 'N5';

const levelStore = createPersistedStore<JlptLevel>({
  key: 'jlpt-level',
  initial: DEFAULT_LEVEL,
  serialize: (level) => level,
  deserialize: (raw) => ((JLPT_LEVELS as string[]).includes(raw) ? (raw as JlptLevel) : null),
});

export function setJlptLevel(level: JlptLevel) {
  if (level !== levelStore.get()) levelStore.set(level);
}

/** 目前選擇的 JLPT 等級；單字頁和測驗頁共用，並會記住到下次開啟 App */
export function useJlptLevel(): JlptLevel {
  return usePersistedStore(levelStore, DEFAULT_LEVEL);
}
