import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useSettings } from '@/stores/settings-store';

/** 目前要用的深淺色：設定頁選了淺色或深色就用它，否則跟隨手機系統 */
export function useColorScheme() {
  const system = useSystemColorScheme();
  const { themeMode } = useSettings();
  return themeMode === 'system' ? system : themeMode;
}
