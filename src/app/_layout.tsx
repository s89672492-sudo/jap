import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import Head from 'expo-router/head';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { registerServiceWorker } from '@/lib/service-worker';
import { loadJapaneseVoices } from '@/lib/voices';
import { migrateOldRecords } from '@/stores/study-store';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  useEffect(registerServiceWorker, []);
  // 先讀好手機上的日文聲音，第一次按發音就能用最自然的聲音
  useEffect(() => {
    loadJapaneseVoices();
  }, []);
  // 第一次使用間隔複習：舊的「已記住」轉成複習排程（會先備份原始紀錄，只做一次）
  useEffect(() => {
    migrateOldRecords();
  }, []);
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* 網頁版分頁標題；手機 App 上不影響 */}
      <Head>
        <title>偵探日語</title>
      </Head>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
