import { createPersistedStore, usePersistedStore } from './persisted-store';

import { checkPin, makePin, parsePin, type ExamPin } from '@/lib/exam-pin';

/**
 * 考試鎖的密碼（只存雜湊）。只存在這支手機，不放進學習紀錄備份。
 * null：還沒設定密碼，考試中的複習頁面無法解鎖。
 */
const pinStore = createPersistedStore<ExamPin | null>({
  key: 'exam-pin',
  initial: null,
  serialize: (pin) => JSON.stringify(pin),
  deserialize: (raw) => {
    try {
      const parsed: unknown = JSON.parse(raw);
      return parsed === null ? null : parsePin(parsed);
    } catch {
      return null;
    }
  },
});

/** 有沒有設定密碼 */
export function useHasExamPin(): boolean {
  return usePersistedStore(pinStore, null) !== null;
}

export function verifyExamPin(pin: string): boolean {
  const saved = pinStore.get();
  return saved !== null && checkPin(saved, pin);
}

/** 設定或更改密碼（呼叫前要先確認格式和舊密碼） */
export function saveExamPin(pin: string): Promise<void> {
  return pinStore.save(makePin(pin));
}

export function clearExamPin(): Promise<void> {
  return pinStore.save(null);
}
