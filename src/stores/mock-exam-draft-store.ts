import { useSyncExternalStore } from 'react';

import {
  createPersistedStore,
  usePersistedStore,
  usePersistedStoreLoaded,
} from './persisted-store';

import { parseDraft, type MockExamDraft } from '@/lib/mock-exam-session';

/**
 * 進行中的模擬考（同一時間最多一場）。考完或放棄時刪除。
 * 每次作答都要真的寫進手機；寫入失敗時記下錯誤，考試畫面會提醒「沒有存到」。
 */
const draftStore = createPersistedStore<MockExamDraft | null>({
  key: 'mock-exam-draft',
  initial: null,
  serialize: (draft) => JSON.stringify(draft),
  deserialize: (raw) => {
    try {
      const parsed: unknown = JSON.parse(raw);
      // 沒有進行中的考試存成 null，也是正確的格式
      if (parsed === null) return null;
      return parseDraft(parsed);
    } catch {
      return null;
    }
  },
});

// ── 最近一次存檔失敗（只在記憶體中） ──
let saveError: string | null = null;
const errorListeners = new Set<() => void>();
const setSaveError = (next: string | null) => {
  if (next === saveError) return;
  saveError = next;
  errorListeners.forEach((listener) => listener());
};

/** 存進手機；成功回傳 true。失敗時畫面會顯示提醒，資料仍保留在記憶體中可以繼續作答 */
export async function saveMockExamDraft(draft: MockExamDraft | null): Promise<boolean> {
  try {
    await draftStore.save(draft);
    setSaveError(null);
    return true;
  } catch (error) {
    setSaveError(error instanceof Error ? error.message : String(error));
    return false;
  }
}

export function getMockExamDraft(): MockExamDraft | null {
  return draftStore.get();
}

export function whenMockExamDraftLoaded(): Promise<void> {
  return draftStore.whenLoaded();
}

export function useMockExamDraft(): MockExamDraft | null {
  return usePersistedStore(draftStore, null);
}

export function useMockExamDraftLoaded(): boolean {
  return usePersistedStoreLoaded(draftStore);
}

/** 最近一次存檔失敗的原因；沒有失敗時是 null */
export function useMockExamSaveError(): string | null {
  return useSyncExternalStore(
    (listener) => {
      errorListeners.add(listener);
      return () => errorListeners.delete(listener);
    },
    () => saveError,
    () => null,
  );
}
