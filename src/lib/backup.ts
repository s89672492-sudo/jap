import AsyncStorage from '@react-native-async-storage/async-storage';

import { dateKey } from '@/lib/daily';
// 確保所有紀錄都已登記（備份會用到每一種紀錄的格式檢查）
import '@/stores/bookmarks-store';
import '@/stores/challenge-store';
import '@/stores/flashcard-store';
import '@/stores/jlpt-level-store';
import '@/stores/mistakes-store';
import '@/stores/mock-exam-store';
import '@/stores/reading-store';
import '@/stores/settings-store';
import { getRegisteredStore, reloadStores } from '@/stores/persisted-store';
import { migrateOldRecords } from '@/stores/study-store';

/**
 * 學習紀錄備份：把存在手機裡的紀錄匯出成一個 JSON 檔，之後可以還原。
 * 背景圖片不放進備份（整張照片很大，而且照片本來就在相簿裡）。
 */

/** 備份檔格式版本；格式改變時加一，並在 upgradeBackup 加上舊版轉換 */
export const BACKUP_FORMAT = 1;
const APP_ID = 'detective-japanese';

/** 學習紀錄：還原時一律換成備份檔的內容（備份檔沒有的項目會清空） */
export const LEARNING_KEYS = [
  'mistakes',
  'known-words',
  'flashcard-sessions',
  'bookmarks',
  'reading-done',
  'reading-days',
  'reading-daily',
  'mock-exam-history',
  'mock-exam-seen',
  'challenge-best',
  'study-cards',
  'study-log',
] as const;

/** 偏好設定：備份檔有才還原，沒有就保留這支手機目前的設定 */
export const PREFERENCE_KEYS = ['settings', 'jlpt-level'] as const;

const ALL_KEYS: readonly string[] = [...LEARNING_KEYS, ...PREFERENCE_KEYS];

/** 還原前把這支手機原本的紀錄另存在這裡，萬一要找回可以用 */
export const BEFORE_RESTORE_KEY = 'backup-before-restore';
/** 上次匯出備份的時間 */
export const BACKUP_META_KEY = 'backup-meta';

export type BackupFile = {
  app: typeof APP_ID;
  format: number;
  exportedAt: string;
  /** 每一項紀錄照手機裡的存檔文字保存（各項格式不同，例如等級是純文字 N3），還原時原樣寫回 */
  data: Record<string, string>;
};

/** 讀取這支手機目前的紀錄（還沒存過、或已經壞掉讀不回的項目不放） */
async function readCurrent(): Promise<Record<string, string>> {
  const pairs = await AsyncStorage.multiGet(ALL_KEYS);
  const data: Record<string, string> = {};
  for (const [key, raw] of pairs) {
    if (raw !== null && getRegisteredStore(key)?.validate(raw)) data[key] = raw;
  }
  return data;
}

/** 做一份備份檔的內容 */
export async function createBackup(now = new Date()): Promise<{ name: string; text: string }> {
  const backup: BackupFile = {
    app: APP_ID,
    format: BACKUP_FORMAT,
    exportedAt: now.toISOString(),
    data: await readCurrent(),
  };
  await AsyncStorage.setItem(BACKUP_META_KEY, JSON.stringify({ lastExport: now.toISOString() }));
  // 檔名用英文：部分瀏覽器遇到中文檔名會改成「download」
  return { name: `detective-japanese-backup-${dateKey(now)}.json`, text: JSON.stringify(backup) };
}

export async function getLastExport(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(BACKUP_META_KEY);
    const meta = raw ? (JSON.parse(raw) as { lastExport?: string }) : null;
    return typeof meta?.lastExport === 'string' ? meta.lastExport : null;
  } catch {
    return null;
  }
}

/** 舊版備份檔轉成目前的格式（目前只有第 1 版） */
function upgradeBackup(backup: BackupFile): BackupFile {
  return backup;
}

export type ParsedBackup = { ok: true; backup: BackupFile } | { ok: false; message: string };

/** 讀入備份檔並檢查：格式、版本、每一項紀錄能不能被 App 讀回。任何一項有問題都不還原 */
export function parseBackup(text: string): ParsedBackup {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, message: '這不是備份檔（無法讀取檔案內容）。' };
  }
  const file = raw as BackupFile;
  if (file?.app !== APP_ID || typeof file.data !== 'object' || file.data === null) {
    return { ok: false, message: '這不是偵探日語的備份檔。' };
  }
  if (typeof file.format !== 'number' || file.format < 1) {
    return { ok: false, message: '備份檔的版本資訊不正確。' };
  }
  if (file.format > BACKUP_FORMAT) {
    return {
      ok: false,
      message: '這個備份檔來自較新版本的 App，請先重新整理網頁或更新 App 再還原。',
    };
  }
  const backup = upgradeBackup(file);
  for (const key of ALL_KEYS) {
    if (!(key in backup.data)) continue;
    const raw = backup.data[key];
    const store = getRegisteredStore(key);
    if (typeof raw !== 'string' || !store || !store.validate(raw)) {
      return {
        ok: false,
        message: `備份檔裡的「${KEY_LABELS[key] ?? key}」格式不正確，沒有還原任何資料。`,
      };
    }
  }
  return { ok: true, backup };
}

const KEY_LABELS: Record<string, string> = {
  mistakes: '錯題本',
  'known-words': '已記住單字',
  'flashcard-sessions': '單字卡進度',
  bookmarks: '收藏',
  'reading-done': '閱讀已讀紀錄',
  'reading-days': '閱讀天數',
  'reading-daily': '今日文章',
  'mock-exam-history': '模擬考成績',
  'mock-exam-seen': '考過的題目',
  'challenge-best': '限時挑戰最高分',
  'study-cards': '間隔複習紀錄',
  'study-log': '每日練習紀錄',
  settings: '設定',
  'jlpt-level': '等級',
};

export type BackupSummary = { label: string; value: string }[];

const count = (value: unknown): number => {
  if (Array.isArray(value)) return value.length;
  if (value && typeof value === 'object') return Object.keys(value).length;
  return 0;
};

const parseJson = (raw: string | undefined): unknown => {
  if (raw === undefined) return undefined;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
};

/** 備份內容的摘要（預覽、比較目前紀錄用） */
export function summarize(raw: Record<string, string>): BackupSummary {
  const data = Object.fromEntries(
    Object.entries(raw).map(([key, value]) => [key, parseJson(value)]),
  );
  const history = data['mock-exam-history'] as Record<string, unknown[]> | undefined;
  const exams = Object.values(history ?? {}).reduce((sum, list) => sum + count(list), 0);
  const studyCards = (data['study-cards'] as { cards?: unknown } | undefined)?.cards;
  const best = Object.values((data['challenge-best'] as Record<string, number>) ?? {});
  return [
    { label: '錯題本', value: `${count(data.mistakes)} 題` },
    { label: '已記住單字', value: `${count(data['known-words'])} 個` },
    { label: '收藏', value: `${count(data.bookmarks)} 個` },
    { label: '間隔複習', value: `${count(studyCards)} 個項目` },
    { label: '練習天數', value: `${count(data['study-log'])} 天` },
    { label: '閱讀已讀', value: `${count(data['reading-done'])} 篇` },
    { label: '模擬考成績', value: `${exams} 次` },
    { label: '限時挑戰最高分', value: best.length ? `${Math.max(...best)} 題` : '—' },
  ];
}

export async function currentSummary(): Promise<BackupSummary> {
  return summarize(await readCurrent());
}

/**
 * 還原：先把目前的紀錄另存一份，再寫入備份檔的內容；
 * 寫入失敗時把原本的紀錄寫回去，不會只還原一半。
 */
export async function restoreBackup(backup: BackupFile) {
  const keys = ALL_KEYS.filter(
    (key) => key in backup.data || (LEARNING_KEYS as readonly string[]).includes(key),
  );
  const previous = await AsyncStorage.multiGet(keys);
  await AsyncStorage.setItem(
    BEFORE_RESTORE_KEY,
    JSON.stringify({ date: new Date().toISOString(), data: Object.fromEntries(previous) }),
  );
  const toWrite = keys
    .filter((key) => key in backup.data)
    .map((key): [string, string] => [key, backup.data[key]]);
  const toClear = keys.filter((key) => !(key in backup.data));
  try {
    await AsyncStorage.multiSet(toWrite);
    if (toClear.length > 0) await AsyncStorage.multiRemove(toClear);
  } catch (error) {
    // 寫回原本的紀錄
    const restoreOld = previous.filter((pair): pair is [string, string] => pair[1] !== null);
    const removeNew = previous.filter(([, raw]) => raw === null).map(([key]) => key);
    await AsyncStorage.multiSet(restoreOld).catch(() => {});
    if (removeNew.length > 0) await AsyncStorage.multiRemove(removeNew).catch(() => {});
    await reloadStores(keys);
    throw error;
  }
  await reloadStores(keys);
  // 備份檔若是間隔複習之前做的，已記住的單字要重新排複習時間
  await migrateOldRecords();
}
