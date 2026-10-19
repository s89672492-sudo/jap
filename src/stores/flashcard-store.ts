import {
  createPersistedStore,
  usePersistedStore,
  usePersistedStoreLoaded,
} from './persisted-store';

/** 單字卡按過「記住了」的單字 id；之後翻單字卡會略過這些 */
type KnownIds = ReadonlySet<string>;

const EMPTY_KNOWN: KnownIds = new Set();

const knownStore = createPersistedStore<KnownIds>({
  key: 'known-words',
  initial: EMPTY_KNOWN,
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

export function setWordKnown(id: string, known: boolean) {
  knownStore.update((current) => {
    if (current.has(id) === known) return current;
    const next = new Set(current);
    if (known) next.add(id);
    else next.delete(id);
    return next;
  });
}

/** 把這些單字從「已記住」移除（重新背） */
export function resetKnownWords(ids: string[]) {
  knownStore.update((current) => {
    const next = new Set(current);
    ids.forEach((id) => next.delete(id));
    return next;
  });
}

export function useKnownWords(): KnownIds {
  return usePersistedStore(knownStore, EMPTY_KNOWN);
}

/** 一疊單字卡翻到哪裡：順序、目前第幾張、這一輪記住幾張、方向 */
export type FlashcardSession = {
  ids: string[];
  index: number;
  known: number;
  direction: 'ja-zh' | 'zh-ja';
};

type Sessions = Record<string, FlashcardSession>;

const EMPTY_SESSIONS: Sessions = {};

function isSession(value: unknown): value is FlashcardSession {
  const s = value as FlashcardSession;
  return (
    Array.isArray(s?.ids) &&
    typeof s.index === 'number' &&
    typeof s.known === 'number' &&
    (s.direction === 'ja-zh' || s.direction === 'zh-ja')
  );
}

const sessionStore = createPersistedStore<Sessions>({
  key: 'flashcard-sessions',
  initial: EMPTY_SESSIONS,
  serialize: (sessions) => JSON.stringify(sessions),
  deserialize: (raw) => {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const sessions: Sessions = {};
      for (const [key, value] of Object.entries(parsed ?? {})) {
        if (isSession(value)) sessions[key] = value;
      }
      return sessions;
    } catch {
      return null;
    }
  },
});

/** 記下某一疊（等級＋詞性）翻到哪裡；傳 null 代表這一疊已翻完 */
export function saveFlashcardSession(key: string, session: FlashcardSession | null) {
  sessionStore.update((current) => {
    const next = { ...current };
    if (session) next[key] = session;
    else delete next[key];
    return next;
  });
}

export function useFlashcardSessions(): Sessions {
  return usePersistedStore(sessionStore, EMPTY_SESSIONS);
}

/** 已記住的單字和翻卡進度都從手機讀回來了 */
export function useFlashcardStoresLoaded(): boolean {
  const known = usePersistedStoreLoaded(knownStore);
  const sessions = usePersistedStoreLoaded(sessionStore);
  return known && sessions;
}
