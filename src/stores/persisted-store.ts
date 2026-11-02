import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

export type PersistedStore<T> = {
  get: () => T;
  set: (value: T) => void;
  /** 和 set 一樣，但等寫入手機完成；寫入失敗時丟出錯誤（畫面要告訴使用者沒存到） */
  save: (value: T) => Promise<void>;
  /** 先等手機裡的資料讀回，再以最新的值計算並寫入（避免蓋掉還沒讀回的存檔） */
  update: (fn: (current: T) => T) => Promise<void>;
  /** 是否已經從手機儲存空間讀回資料 */
  isLoaded: () => boolean;
  /** 等資料從手機讀回（不在畫面裡時使用，例如備份、轉換舊紀錄） */
  whenLoaded: () => Promise<void>;
  subscribe: (listener: () => void) => () => void;
};

/** 所有存在手機裡的資料，依 key 登記，給備份還原用 */
type RegisteredStore = {
  /** 這段文字（存檔格式）能不能被讀回 */
  validate: (raw: string) => boolean;
  /** 重新從手機讀回（還原備份後讓畫面換成新的紀錄） */
  reload: () => Promise<void>;
};

const registry = new Map<string, RegisteredStore>();

export function getRegisteredStore(key: string): RegisteredStore | undefined {
  return registry.get(key);
}

/** 重新讀回這些 key 的資料，畫面會跟著更新 */
export async function reloadStores(keys: string[]) {
  await Promise.all(keys.map((key) => registry.get(key)?.reload()));
}

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

  const save = async (next: T) => {
    if (!loaded) changedBeforeLoad = true;
    value = next;
    emit();
    await AsyncStorage.setItem(options.key, options.serialize(next));
  };

  registry.set(options.key, {
    validate: (raw) => options.deserialize(raw) !== null,
    reload: async () => {
      let next = options.initial;
      try {
        const raw = await AsyncStorage.getItem(options.key);
        if (raw !== null) next = options.deserialize(raw) ?? options.initial;
      } catch {
        // 讀不到就用預設值
      }
      value = next;
      loaded = true;
      loadPromise = Promise.resolve();
      emit();
    },
  });

  return {
    get: () => value,
    isLoaded: () => loaded,
    whenLoaded: () => load(),
    set,
    save,
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
