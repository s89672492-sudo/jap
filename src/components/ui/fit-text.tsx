import { useState } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type TextStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';

type FitTextProps = {
  children: string;
  /** 要有 fontSize 和 lineHeight；字太長時兩個會一起等比例縮小 */
  style: StyleProp<TextStyle>;
};

/** 估計一段文字的寬度是幾個字寬：中日文字算 1，英數字算 0.6 */
function widthInEm(text: string): number {
  let em = 0;
  for (const ch of text) em += ch.charCodeAt(0) < 0x2e80 ? 0.6 : 1;
  return em;
}

/** 最多縮到原本大小的幾成；再長就換行，不會變成「…」 */
const MIN_SCALE = 0.3;

/**
 * 一行放得下就一行，放不下就縮小字體（大單字、長的外來語用）。
 * 手機 App 用系統的 adjustsFontSizeToFit；網頁版沒有這個功能（只會截成「…」），
 * 所以量容器寬度、依字數算出字體大小。
 */
export function FitText({ children, style }: FitTextProps) {
  const [width, setWidth] = useState(0);
  const flat = StyleSheet.flatten(style);

  if (Platform.OS !== 'web') {
    return (
      <ThemedText style={style} adjustsFontSizeToFit minimumFontScale={MIN_SCALE} numberOfLines={1}>
        {children}
      </ThemedText>
    );
  }

  const fontSize = flat.fontSize ?? 16;
  const lineHeight = flat.lineHeight ?? fontSize * 1.3;
  // 留一點邊，避免估得太緊被換行
  const fits = width > 0 ? (width * 0.94) / (widthInEm(children) * fontSize) : 1;
  const scale = Math.max(MIN_SCALE, Math.min(1, fits));

  return (
    <View style={styles.box} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      <ThemedText style={[style, { fontSize: fontSize * scale, lineHeight: lineHeight * scale }]}>
        {children}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
});
