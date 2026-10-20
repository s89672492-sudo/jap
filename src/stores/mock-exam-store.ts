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
  /** 每一題的題目 id 和自己的答案（沒作答是 null），用來重看題目和解說；舊紀錄沒有 */
  items?: MockExamItem[];
};

export type MockExamItem = { id: string; mine: string | null };

function isItem(value: unknown): value is MockExamItem {
  const item = value as MockExamItem;
  return typeof item?.id === 'string' && (item.mine === null || typeof item.mine === 'string');
}

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
        if (!Array.isArray(list)) continue;
        history[level] = list
          .filter(isRecord)
          .slice(0, KEEP)
          .map((r) => (Array.isArray(r.items) ? { ...r, items: r.items.filter(isItem) } : r));
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

/** 模擬考考過的題目 id，下次優先出沒考過的 */
type Seen = Partial<Record<JlptLevel, string[]>>;

/** 每個等級最多記住幾題（超過就忘掉最舊的） */
const SEEN_LIMIT = 6000;
const EMPTY_SEEN: Seen = {};

const seenStore = createPersistedStore<Seen>({
  key: 'mock-exam-seen',
  initial: EMPTY_SEEN,
  serialize: (seen) => JSON.stringify(seen),
  deserialize: (raw) => {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const seen: Seen = {};
      for (const level of JLPT_LEVELS) {
        const list = parsed?.[level];
        if (Array.isArray(list)) seen[level] = list.filter((id) => typeof id === 'string');
      }
      return seen;
    } catch {
      return null;
    }
  },
});

export function markMockExamSeen(level: JlptLevel, ids: string[]) {
  seenStore.update((current) => {
    const fresh = new Set(ids);
    const kept = (current[level] ?? []).filter((id) => !fresh.has(id));
    return { ...current, [level]: [...kept, ...ids].slice(-SEEN_LIMIT) };
  });
}

/** 出題時讀取（不在畫面裡） */
export function getMockExamSeen(level: JlptLevel): ReadonlySet<string> {
  return new Set(seenStore.get()[level] ?? []);
}

export function useMockExamSeenCount(level: JlptLevel): number {
  return usePersistedStore(seenStore, EMPTY_SEEN)[level]?.length ?? 0;
}
