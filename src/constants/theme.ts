/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

/**
 * 偵探風格配色：深藍西裝外套、紅色領結、金色放大鏡、泛黃案件檔案紙。
 */
export const Colors = {
  light: {
    text: '#14213D',
    background: '#F5EFE0',
    backgroundElement: '#FFFBF2',
    backgroundSelected: '#E9DFC7',
    textSecondary: '#5B6478',
    primary: '#1F3A93',
    accent: '#C8102E',
    gold: '#B8860B',
    border: '#D9CBA8',
    onPrimary: '#FFFFFF',
    success: '#2E7D32',
    // 圖示底色等用的淡色（和上面四個主色成對）
    primarySoft: '#E3E8F6',
    accentSoft: '#F8E1E3',
    goldSoft: '#F3E7C6',
    successSoft: '#DFEEDD',
    /** 淡色底上的圖示顏色（淺色模式和主色相同） */
    primaryIcon: '#1F3A93',
    accentIcon: '#C8102E',
    goldIcon: '#8A6508',
    successIcon: '#2E7D32',
    /** 卡片陰影的顏色（深藍，不用純黑） */
    shadow: 'rgba(20, 33, 61, 0.10)',
    /** 首頁招牌區塊：深藍西裝色底、米白字 */
    hero: '#14213D',
    onHero: '#F5EFE0',
    onHeroMuted: '#C5CEDF',
    heroGold: '#F2C94C',
  },
  dark: {
    text: '#F5EFE0',
    background: '#0B1426',
    backgroundElement: '#16223A',
    backgroundSelected: '#22314F',
    textSecondary: '#C5CEDF',
    primary: '#3D6FD6',
    accent: '#E63946',
    gold: '#F2C94C',
    border: '#3D5078',
    onPrimary: '#FFFFFF',
    success: '#4CAF50',
    primarySoft: '#2A4480',
    accentSoft: '#5A2633',
    goldSoft: '#54461C',
    successSoft: '#1F4A30',
    // 深色底上的圖示要用比較亮的顏色才看得清楚
    primaryIcon: '#A9C4FF',
    accentIcon: '#FF9AA2',
    goldIcon: '#F2C94C',
    successIcon: '#86E29B',
    shadow: 'rgba(0, 0, 0, 0.35)',
    hero: '#1A2A4A',
    onHero: '#F5EFE0',
    onHeroMuted: '#C5CEDF',
    heroGold: '#F2C94C',
  },
} as const;

/** 啟動畫面背景色（深藍），與 app.json 的 splash 設定一致 */
export const SplashBackground = '#14213D';

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** 圓角：小標籤、列、卡片、大卡片（依層級由小到大，不要全部同一個圓角） */
export const Radius = {
  tag: 6,
  row: 12,
  card: 18,
  sheet: 24,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 64 }) ?? 0;
export const MaxContentWidth = 800;
