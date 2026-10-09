import { createPersistedStore, usePersistedStore } from './persisted-store';

/** 收藏的 id：單字用單字 id（例如 n5-001），文法用文法 id（例如 n5-g01） */
type BookmarkIds = ReadonlySet<string>;

const EMPTY: BookmarkIds = new Set();

const bookmarksStore = createPersistedStore<BookmarkIds>({
  key: 'bookmarks',
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

/** 收藏或取消收藏 */
export function toggleBookmark(id: string) {
  bookmarksStore.update((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
}

export function useBookmarks(): BookmarkIds {
  return usePersistedStore(bookmarksStore, EMPTY);
}
