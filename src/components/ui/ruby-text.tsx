import type { StyleProp, TextStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FuriganaText } from '@/components/vocab/furigana-text';
import { stripRuby } from '@/lib/furigana';
import { useSettings } from '@/stores/settings-store';

type RubyTextProps = {
  /** 用 [漢字|かな] 標好注音的文字 */
  annotated: string;
  fontSize?: number;
  fontWeight?: 400 | 600 | 700;
  color?: string;
  /** 沒有注音（或設定裡關掉注音）時的文字樣式 */
  style?: StyleProp<TextStyle>;
};

/** 資料裡已經標好注音的文字：照設定顯示注音，沒有漢字的句子直接顯示 */
export function RubyText({
  annotated,
  fontSize = 15,
  fontWeight = 400,
  color,
  style,
}: RubyTextProps) {
  const { furigana } = useSettings();
  if (furigana && annotated.includes('[')) {
    return (
      <FuriganaText
        annotated={annotated}
        fontSize={fontSize}
        fontWeight={fontWeight}
        color={color}
      />
    );
  }
  return (
    <ThemedText
      style={[
        { fontSize, lineHeight: Math.round(fontSize * 1.5), fontWeight },
        color ? { color } : null,
        style,
      ]}>
      {stripRuby(annotated)}
    </ThemedText>
  );
}
