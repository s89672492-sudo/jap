import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createPersistedStore,
  usePersistedStore,
  usePersistedStoreLoaded,
} from './persisted-store';

import { dateKey } from '@/lib/daily';
import { isGraduated, migratedKnownCard, review, type StoredCard } from '@/lib/srs';
import { loadKnownWords } from '@/stores/flashcard-store';
import { getMistakes, removeMistake } from '@/stores/mistakes-store';

/**
 * 間隔複習的學習紀錄：每個單字、文法、題目一張「記憶卡」，記錄答題結果和下次複習時間。
 * 單字卡、各種測驗、錯題複習、模擬考答題時都會寫到這裡（recordStudy）。
 * 原本的「已記住」「錯題本」照舊保留，這裡是另外加上的排程資料。
 */
export type StudyData = {
  v: 1;
  cards: Record<string, StoredCard>;
  /** 舊的「已記住」單字已經轉換過 */
  migratedKnown?: boolean;
};

/** 某一天的練習量：答了幾題、答對幾題、第一次練習的新項目 */
export type DayLog = { n: number; c: number; w: number };
export type StudyLog = Record<string, DayLog>;

const EMPTY: StudyData = { v: 1, cards: {} };
const EMPTY_LOG: StudyLog = {};
/** 每日紀錄只留最近這麼多天 */
const LOG_DAYS = 400;

function isStoredCard(value: unknown): value is StoredCard {
  const c = value as StoredCard;
  return (
    typeof c?.d === 'number' &&
    typeof c.s === 'number' &&
    typeof c.f === 'number' &&
    typeof c.r === 'number' &&
    typeof c.st === 'number'
  );
}

export function parseStudyData(value: unknown): StudyData | null {
  const data = value as StudyData;
  if (data?.v !== 1 || typeof data.cards !== 'object' || data.cards === null) return null;
  const cards: Record<string, StoredCard> = {};
  for (const [id, card] of Object.entries(data.cards)) if (isStoredCard(card)) cards[id] = card;
  return { v: 1, cards, migratedKnown: data.migratedKnown === true };
}

export function parseStudyLog(value: unknown): StudyLog | null {
  if (typeof value !== 'object' || value === null) return null;
  const log: StudyLog = {};
  for (const [day, entry] of Object.entries(value as Record<string, DayLog>)) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(day) && typeof entry?.n === 'number') {
      log[day] = { n: entry.n, c: entry.c ?? 0, w: entry.w ?? 0 };
    }
  }
  return log;
}

const parse =
  <T>(fn: (value: unknown) => T | null) =>
  (raw: string): T | null => {
    try {
      return fn(JSON.parse(raw));
    } catch {
      return null;
    }
  };

export const studyStore = createPersistedStore<StudyData>({
  key: 'study-cards',
  initial: EMPTY,
  serialize: (data) => JSON.stringify(data),
  deserialize: parse(parseStudyData),
});

export const studyLogStore = createPersistedStore<StudyLog>({
  key: 'study-log',
  initial: EMPTY_LOG,
  serialize: (log) => JSON.stringify(log),
  deserialize: parse(parseStudyLog),
});

/**
 * 記錄一次答題：更新這張記憶卡的下次複習時間和當天的練習量。
 * 錯題要在不同天答對、複習間隔拉長到 7 天以上，才從錯題本移除（不是答對一次就移除）。
 */
export function recordStudy(id: string, correct: boolean, now = Date.now()) {
  let isNew = false;
  let updated: StoredCard | undefined;
  studyStore
    .update((data) => {
      const previous = data.cards[id];
      isNew = previous === undefined;
      updated = review(previous, correct, now);
      return { ...data, cards: { ...data.cards, [id]: updated } };
    })
    .then(() => {
      if (correct && getMistakes().has(id) && isGraduated(updated)) removeMistake(id);
    });
  const today = dateKey(new Date(now));
  studyLogStore.update((log) => {
    const entry = log[today] ?? { n: 0, c: 0, w: 0 };
    const next = {
      ...log,
      [today]: { n: entry.n + 1, c: entry.c + (correct ? 1 : 0), w: entry.w + (isNew ? 1 : 0) },
    };
    // 太舊的紀錄刪掉，避免越存越大
    const days = Object.keys(next).sort();
    for (const day of days.slice(0, Math.max(0, days.length - LOG_DAYS))) delete next[day];
    return next;
  });
}

/** 不在畫面裡時讀取記憶卡（例如出題時挑該複習的單字） */
export function getStudyCards(): Record<string, StoredCard> {
  return studyStore.get().cards;
}

export function useStudyCards(): Record<string, StoredCard> {
  return usePersistedStore(studyStore, EMPTY).cards;
}

export function useStudyLog(): StudyLog {
  return usePersistedStore(studyLogStore, EMPTY_LOG);
}

export function useStudyLoaded(): boolean {
  const cards = usePersistedStoreLoaded(studyStore);
  const log = usePersistedStoreLoaded(studyLogStore);
  return cards && log;
}

/** 轉換前的原始紀錄另存在這個 key，萬一轉換有問題可以找回 */
export const PRE_SRS_BACKUP_KEY = 'backup-before-study-cards-v1';
const OLD_KEYS = ['known-words', 'mistakes', 'flashcard-sessions'];

/**
 * 第一次使用間隔複習時，把舊的「已記住」單字轉成記憶卡（當作大約記得 4 天，分散在 1〜10 天後複習）。
 * 轉換前先把原始紀錄另存一份；原本的「已記住」「錯題本」都不會刪除或改動。
 * 錯題本不需要轉換：錯題沒有記憶卡時就是「學習中」，要重新答對、間隔拉長後才會移除。
 */
export async function migrateOldRecords(now = Date.now()) {
  await studyStore.whenLoaded();
  if (studyStore.get().migratedKnown) return;
  try {
    if ((await AsyncStorage.getItem(PRE_SRS_BACKUP_KEY)) === null) {
      const pairs = await AsyncStorage.multiGet(OLD_KEYS);
      await AsyncStorage.setItem(
        PRE_SRS_BACKUP_KEY,
        JSON.stringify({ date: new Date(now).toISOString(), data: Object.fromEntries(pairs) }),
      );
    }
  } catch {
    // 備份寫不進去（例如儲存空間滿了）就先不轉換，下次開啟再試，不會動到原本的紀錄
    return;
  }
  const known = await loadKnownWords();
  await studyStore.update((data) => {
    const cards = { ...data.cards };
    for (const id of known) cards[id] ??= migratedKnownCard(id, now);
    return { ...data, cards, migratedKnown: true };
  });
}
