import { createPersistedStore, usePersistedStore } from './persisted-store';

import { JLPT_LEVELS, type JlptLevel } from '@/data/vocab';

/** 一次模擬考的成績 */
export type MockExamRecord = {
  /** 考完的時間（ISO 字串） */
  date: string;
  total: number;
  passed: boolean;
  /** 各科分數，例如 [{ label: '聽解', score: 40, max: 60 }] */
  sections: { label: string; score: number; max: number }[];
};

type History = Partial<Record<JlptLevel, MockExamRecord[]>>;

/** 每個等級只留最近幾次 */
const KEEP = 10;
const EMPTY: History = {};

function isRecord(value: unknown): value is MockExamRecord {
  const r = value as MockExamRecord;
  return (
    typeof r?.date === 'string' &&
    typeof r.total === 'number' &&
    typeof r.passed === 'boolean' &&
    Array.isArray(r.sections)
  );
}

const mockExamStore = createPersistedStore<History>({
  key: 'mock-exam-history',
  initial: EMPTY,
  serialize: (history) => JSON.stringify(history),
  deserialize: (raw) => {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const history: History = {};
      for (const level of JLPT_LEVELS) {
        const list = parsed?.[level];
        if (Array.isArray(list)) history[level] = list.filter(isRecord).slice(0, KEEP);
      }
      return history;
    } catch {
      return null;
    }
  },
});

/** 記錄一次模擬考成績（最新的放最前面） */
export function recordMockExam(level: JlptLevel, record: MockExamRecord) {
  mockExamStore.update((current) => ({
    ...current,
    [level]: [record, ...(current[level] ?? [])].slice(0, KEEP),
  }));
}

/** 各等級的模擬考紀錄，最新的在前面 */
export function useMockExamHistory(): History {
  return usePersistedStore(mockExamStore, EMPTY);
}
