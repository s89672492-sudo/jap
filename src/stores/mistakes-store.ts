import { createPersistedStore, usePersistedStore, usePersistedStoreLoaded } from './persisted-store';

/** 答錯的題目 id：單字用單字 id（例如 n5-001），模擬試題用題目 id（例如 n5-exam-01） */
type MistakeIds = ReadonlySet<string>;

const EMPTY: MistakeIds = new Set();

const mistakesStore = createPersistedStore<MistakeIds>({
  key: 'mistakes',
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

export function addMistake(id: string) {
  mistakesStore.update((current) => (current.has(id) ? current : new Set([...current, id])));
}

export function removeMistake(id: string) {
  mistakesStore.update((current) => {
    if (!current.has(id)) return current;
    const next = new Set(current);
    next.delete(id);
    return next;
  });
}

export function useMistakes(): MistakeIds {
  return usePersistedStore(mistakesStore, EMPTY);
}

export function useMistakesLoaded(): boolean {
  return usePersistedStoreLoaded(mistakesStore);
}
