import { createPersistedStore, usePersistedStore } from './persisted-store';

import { JLPT_LEVELS, type JlptLevel } from '@/data/vocab';
import { isRoundQuestion, type ExamEvent, type MockExamMode } from '@/lib/mock-exam-session';
import type { ExamRoundQuestion } from '@/lib/quiz';

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
  // ── 以下是第 2 版紀錄才有的欄位（舊紀錄沒有，畫面要能處理沒有的情況） ──
  /** 紀錄格式版本：沒有＝第 1 版 */
  v?: 2;
  sessionId?: string;
  mode?: MockExamMode;
  paperId?: string;
  paperVersion?: number;
  /** 隨機考卷的種子 */
  seed?: string;
  startedAt?: string;
  /** 考試中離開考試畫面的次數 */
  leaveCount?: number;
  events?: ExamEvent[];
  /** 考卷快照：當時的題目、選項順序和正確答案，題庫之後更新也能還原。只有最近幾次保留 */
  snapshot?: ExamRoundQuestion[];
};

export type MockExamItem = {
  id: string;
  mine: string | null;
  /** 正確答案（第 2 版） */
  answer?: string;
  /** 這一題停留的毫秒數（第 2 版） */
  ms?: number;
};

function isItem(value: unknown): value is MockExamItem {
  const item = value as MockExamItem;
  return typeof item?.id === 'string' && (item.mine === null || typeof item.mine === 'string');
}

/** 每個等級只有最近幾次保留考卷快照（快照比較大），更舊的只留題目 id */
const KEEP_SNAPSHOTS = 5;

/** 讀回時清掉格式不對的欄位，其他照舊保留 */
function cleanRecord(record: MockExamRecord): MockExamRecord {
  const cleaned: MockExamRecord = { ...record };
  if (Array.isArray(record.items)) cleaned.items = record.items.filter(isItem);
  else delete cleaned.items;
  if (record.snapshot !== undefined) {
    if (Array.isArray(record.snapshot) && record.snapshot.every(isRoundQuestion)) {
      cleaned.snapshot = record.snapshot;
    } else delete cleaned.snapshot;
  }
  if (record.events !== undefined && !Array.isArray(record.events)) delete cleaned.events;
  return cleaned;
}

const trimSnapshots = (list: MockExamRecord[]) =>
  list.map((record, i) => {
    if (i < KEEP_SNAPSHOTS || !record.snapshot) return record;
    const { snapshot: _dropped, ...rest } = record;
    return rest;
  });

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
        history[level] = list.filter(isRecord).slice(0, KEEP).map(cleanRecord);
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
    [level]: trimSnapshots([record, ...(current[level] ?? [])].slice(0, KEEP)),
  }));
}

/** 這一場考試已經記錄過了沒（避免重複記錄同一場） */
export function hasMockExamRecord(level: JlptLevel, sessionId: string): boolean {
  return (mockExamStore.get()[level] ?? []).some((record) => record.sessionId === sessionId);
}

export function whenMockExamHistoryLoaded(): Promise<void> {
  return mockExamStore.whenLoaded();
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

/** 刪除一次考試紀錄（用考完的時間找） */
export function deleteMockExamRecord(level: JlptLevel, date: string) {
  mockExamStore.update((current) => ({
    ...current,
    [level]: (current[level] ?? []).filter((record) => record.date !== date),
  }));
}

/** 忘掉這個等級考過哪些題目，之後每題都當作沒考過 */
export function clearMockExamSeen(level: JlptLevel) {
  seenStore.update((current) => ({ ...current, [level]: [] }));
}
