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
  },
  dark: {
    text: '#F5EFE0',
    background: '#0B1426',
    backgroundElement: '#16223A',
    backgroundSelected: '#22314F',
    textSecondary: '#A9B3C7',
    primary: '#3D6FD6',
    accent: '#E63946',
    gold: '#F2C94C',
    border: '#2C3B5A',
    onPrimary: '#FFFFFF',
    success: '#4CAF50',
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

export const BottomTabInset = Platform.select({ ios: 50, android: 80, web: 64 }) ?? 0;
export const MaxContentWidth = 800;
