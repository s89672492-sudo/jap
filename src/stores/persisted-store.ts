import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

export type PersistedStore<T> = {
  get: () => T;
  set: (value: T) => void;
  /** 先等手機裡的資料讀回，再以最新的值計算並寫入（避免蓋掉還沒讀回的存檔） */
  update: (fn: (current: T) => T) => Promise<void>;
  /** 是否已經從手機儲存空間讀回資料 */
  isLoaded: () => boolean;
  subscribe: (listener: () => void) => () => void;
};

/**
 * 存在手機裡、所有畫面共用的小型狀態。
 * 第一次有畫面使用時才從 AsyncStorage 讀回；讀取或寫入失敗時沿用記憶體中的值。
 */
export function createPersistedStore<T>(options: {
  key: string;
  initial: T;
  serialize: (value: T) => string;
  /** 讀回的資料格式不對時回傳 null，改用預設值 */
  deserialize: (raw: string) => T | null;
}): PersistedStore<T> {
  let value = options.initial;
  let loaded = false;
  // 讀回之前就被 set 過的話，以使用者剛設定的值為準，不用存檔覆蓋
  let changedBeforeLoad = false;
  let loadPromise: Promise<void> | null = null;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((listener) => listener());

  const load = () => {
    loadPromise ??= AsyncStorage.getItem(options.key)
      .then((raw) => {
        const saved = raw === null ? null : options.deserialize(raw);
        if (saved !== null && !changedBeforeLoad) value = saved;
      })
      .catch(() => {})
      .finally(() => {
        loaded = true;
        emit();
      });
    return loadPromise;
  };

  const set = (next: T) => {
    if (!loaded) changedBeforeLoad = true;
    value = next;
    emit();
    AsyncStorage.setItem(options.key, options.serialize(next)).catch(() => {});
  };

  return {
    get: () => value,
    isLoaded: () => loaded,
    set,
    update: (fn) => load().then(() => set(fn(value))),
    subscribe: (listener) => {
      listeners.add(listener);
      load();
      return () => listeners.delete(listener);
    },
  };
}

/** 讀取 store 目前的值；網頁版預先產生 HTML 時用 initial */
export function usePersistedStore<T>(store: PersistedStore<T>, initial: T): T {
  return useSyncExternalStore(store.subscribe, store.get, () => initial);
}

/** store 是否已讀回手機裡的資料 */
export function usePersistedStoreLoaded<T>(store: PersistedStore<T>): boolean {
  return useSyncExternalStore(store.subscribe, store.isLoaded, () => false);
}
