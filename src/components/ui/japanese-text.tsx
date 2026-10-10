import type { StyleProp, TextStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FuriganaText } from '@/components/vocab/furigana-text';
import { lookupFurigana } from '@/lib/furigana';
import { useSettings } from '@/stores/settings-store';

type JapaneseTextProps = {
  text: string;
  /** 要用強調色標出的字（第一次出現的位置） */
  highlight?: string;
  fontSize?: number;
  fontWeight?: 400 | 600 | 700;
  center?: boolean;
  color?: string;
  /** 沒有注音時用的文字樣式（和原本的 ThemedText 一樣） */
  style?: StyleProp<TextStyle>;
};

/**
 * 日文句子：設定裡開啟「假名注音」且有收錄注音時，漢字上方顯示讀音；
 * 否則照原本的樣子顯示文字。
 */
export function JapaneseText({
  text,
  highlight,
  fontSize = 15,
  fontWeight = 400,
  center,
  color,
  style,
}: JapaneseTextProps) {
  const { furigana } = useSettings();
  const annotated = furigana ? lookupFurigana(text) : undefined;
  const at = highlight ? text.indexOf(highlight) : -1;

  if (annotated) {
    return (
      <FuriganaText
        annotated={annotated}
        highlight={at >= 0 && highlight ? [at, at + highlight.length] : undefined}
        fontSize={fontSize}
        fontWeight={fontWeight}
        center={center}
        color={color}
      />
    );
  }
  return <ThemedText style={style}>{text}</ThemedText>;
}
