import { createPersistedStore, usePersistedStore } from './persisted-store';

/** 已讀完的文章 id（例如 n3-r05） */
type ReadIds = ReadonlySet<string>;

const EMPTY: ReadIds = new Set();

const readingStore = createPersistedStore<ReadIds>({
  key: 'reading-done',
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

export function markArticleRead(id: string) {
  readingStore.update((current) => (current.has(id) ? current : new Set([...current, id])));
}

export function useReadArticles(): ReadIds {
  return usePersistedStore(readingStore, EMPTY);
}
