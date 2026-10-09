import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

import { JLPT_LEVELS, type JlptLevel } from '@/data/vocab';

const STORAGE_KEY = 'jlpt-level';
const DEFAULT_LEVEL: JlptLevel = 'N5';

let currentLevel: JlptLevel = DEFAULT_LEVEL;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function isJlptLevel(value: string | null): value is JlptLevel {
  return value !== null && (JLPT_LEVELS as string[]).includes(value);
}

/** 第一次有畫面使用時，從手機儲存空間讀回上次選的等級 */
function loadOnce() {
  if (loaded) return;
  loaded = true;
  AsyncStorage.getItem(STORAGE_KEY)
    .then((saved) => {
      if (isJlptLevel(saved) && saved !== currentLevel) {
        currentLevel = saved;
        emit();
      }
    })
    .catch(() => {
      // 讀取失敗就沿用預設等級
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  loadOnce();
  return () => listeners.delete(listener);
}

export function setJlptLevel(level: JlptLevel) {
  if (level === currentLevel) return;
  currentLevel = level;
  emit();
  AsyncStorage.setItem(STORAGE_KEY, level).catch(() => {
    // 儲存失敗不影響目前畫面
  });
}

/** 目前選擇的 JLPT 等級；單字頁和測驗頁共用，並會記住到下次開啟 App */
export function useJlptLevel(): JlptLevel {
  return useSyncExternalStore(
    subscribe,
    () => currentLevel,
    () => DEFAULT_LEVEL,
  );
}
