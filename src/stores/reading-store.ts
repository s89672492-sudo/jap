import { createPersistedStore, usePersistedStore, usePersistedStoreLoaded } from './persisted-store';

import { dateKey } from '@/lib/daily';

type StringSet = ReadonlySet<string>;

const EMPTY: StringSet = new Set();

/** 存成字串陣列的集合 */
function createStringSetStore(key: string) {
  return createPersistedStore<StringSet>({
    key,
    initial: EMPTY,
    serialize: (ids) => JSON.stringify([...ids]),
    deserialize: (raw) => {
      try {
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed) ? new Set(parsed.filter((id) => typeof id === 'string')) : null;
      } catch {
        return null;
      }
    },
  });
}

/** 已讀完的文章 id（例如 n3-r05） */
const readingStore = createStringSetStore('reading-done');
/** 有讀完文章的日期（例如 2026-10-10），用來算連續閱讀天數 */
const readingDaysStore = createStringSetStore('reading-days');

const add = (current: StringSet, value: string) =>
  current.has(value) ? current : new Set([...current, value]);

/** 做完閱讀理解題時呼叫：記錄文章已讀，今天也算有閱讀 */
export function markArticleRead(id: string) {
  readingStore.update((current) => add(current, id));
  readingDaysStore.update((current) => add(current, dateKey()));
}

export function useReadArticles(): StringSet {
  return usePersistedStore(readingStore, EMPTY);
}

export function useReadingDays(): StringSet {
  return usePersistedStore(readingDaysStore, EMPTY);
}

/** 每天、每個等級的今日文章，同一天不會換 */
type DailyPicks = { date: string; picks: Partial<Record<string, string>> };

const EMPTY_PICKS: DailyPicks = { date: '', picks: {} };

const dailyStore = createPersistedStore<DailyPicks>({
  key: 'reading-daily',
  initial: EMPTY_PICKS,
  serialize: (value) => JSON.stringify(value),
  deserialize: (raw) => {
    try {
      const parsed = JSON.parse(raw) as DailyPicks;
      return typeof parsed?.date === 'string' && typeof parsed.picks === 'object' ? parsed : null;
    } catch {
      return null;
    }
  },
});

/** 記錄今天這個等級選了哪一篇（已經選過就不改）；換日時清掉舊的 */
export function saveDailyPick(date: string, level: string, id: string) {
  dailyStore.update((current) => {
    if (current.date === date && current.picks[level]) return current;
    return { date, picks: { ...(current.date === date ? current.picks : {}), [level]: id } };
  });
}

export function useDailyPicks(): DailyPicks {
  return usePersistedStore(dailyStore, EMPTY_PICKS);
}

/** 今日文章和已讀紀錄都從手機讀回來了沒（讀回前不要先選文章） */
export function useReadingLoaded(): boolean {
  const picks = usePersistedStoreLoaded(dailyStore);
  const read = usePersistedStoreLoaded(readingStore);
  return picks && read;
}
