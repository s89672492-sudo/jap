import { useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { useSettings } from '@/stores/settings-store';

/**
 * 網頁版：預先產生的 HTML 一律用淺色，載入後才換成實際的深淺色，避免畫面不一致。
 * 設定頁選了淺色或深色就用它，否則跟隨系統。
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const system = useSystemColorScheme();
  const { themeMode } = useSettings();

  if (!hasHydrated) return 'light';
  return themeMode === 'system' ? system : themeMode;
}
