import { Appearance, Platform } from 'react-native';

import { createPersistedStore, usePersistedStore } from './persisted-store';

export type ThemeMode = 'system' | 'light' | 'dark';
export type SpeechSpeed = 'slow' | 'normal' | 'fast';
export type RoundSize = 10 | 20 | 30;

export type Settings = {
  speechSpeed: SpeechSpeed;
  roundSize: RoundSize;
  themeMode: ThemeMode;
};

export const DEFAULT_SETTINGS: Settings = {
  speechSpeed: 'normal',
  roundSize: 10,
  themeMode: 'system',
};

/** expo-speech 的 rate：1.0 是正常語速 */
export const SPEECH_RATES: Record<SpeechSpeed, number> = {
  slow: 0.6,
  normal: 0.85,
  fast: 1.05,
};

const settingsStore = createPersistedStore<Settings>({
  key: 'settings',
  initial: DEFAULT_SETTINGS,
  serialize: (settings) => JSON.stringify(settings),
  // 只取認得的欄位，缺少或格式不對的就用預設值
  deserialize: (raw) => {
    try {
      const saved = JSON.parse(raw) as Partial<Settings>;
      return {
        speechSpeed:
          saved.speechSpeed && saved.speechSpeed in SPEECH_RATES
            ? saved.speechSpeed
            : DEFAULT_SETTINGS.speechSpeed,
        roundSize: [10, 20, 30].includes(saved.roundSize as number)
          ? (saved.roundSize as RoundSize)
          : DEFAULT_SETTINGS.roundSize,
        themeMode: ['system', 'light', 'dark'].includes(saved.themeMode as string)
          ? (saved.themeMode as ThemeMode)
          : DEFAULT_SETTINGS.themeMode,
      };
    } catch {
      return null;
    }
  },
});

// 手機上讓系統元件（狀態列等）也跟著切換深淺色；網頁版由 useColorScheme 處理
let appliedThemeMode: ThemeMode = DEFAULT_SETTINGS.themeMode;
settingsStore.subscribe(() => {
  const { themeMode } = settingsStore.get();
  if (Platform.OS === 'web' || themeMode === appliedThemeMode) return;
  appliedThemeMode = themeMode;
  Appearance.setColorScheme(themeMode === 'system' ? 'unspecified' : themeMode);
});

export function updateSettings(patch: Partial<Settings>) {
  settingsStore.update((current) => ({ ...current, ...patch }));
}

/** 不在畫面裡時讀取設定（例如播放發音） */
export function getSettings(): Settings {
  return settingsStore.get();
}

export function useSettings(): Settings {
  return usePersistedStore(settingsStore, DEFAULT_SETTINGS);
}
