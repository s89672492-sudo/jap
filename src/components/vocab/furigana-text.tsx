import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { parseRuby, stripRuby } from '@/lib/furigana';

type Range = [number, number];

type FuriganaTextProps = {
  /** 加了注音的句子（[漢字|かんじ]） */
  annotated: string;
  /** 用強調色標出的範圍（以去掉注音後的句子計算），[開始, 結束) */
  highlight?: Range;
  /** 畫底線的範圍（試題用） */
  underline?: Range;
  /** 把這個範圍換成別的字（例如文法題的空格「＿＿＿」） */
  replace?: { range: Range; text: string };
  fontSize?: number;
  /** 字的粗細，例如試題句子用 600 */
  fontWeight?: 400 | 600 | 700;
  center?: boolean;
  /** 文字顏色（例如答對後白字）；不設定就用主題顏色 */
  color?: string;
  style?: StyleProp<ViewStyle>;
};

type Cell = { text: string; ruby?: string; start: number; replaced?: boolean };

/**
 * 有假名注音的句子：漢字上方顯示小字讀音。
 * React Native 沒有 <ruby>，所以把每個字排成「讀音在上、字在下」的小方塊，自動換行。
 */
export function FuriganaText({
  annotated,
  highlight,
  underline,
  replace,
  fontSize = 15,
  fontWeight = 400,
  center = false,
  color,
  style,
}: FuriganaTextProps) {
  const theme = useTheme();
  const rubySize = Math.max(8, Math.round(fontSize * 0.55));
  const rubyStyle = { fontSize: rubySize, lineHeight: rubySize + 3 };
  const baseStyle = {
    fontSize,
    lineHeight: Math.round(fontSize * 1.4),
    fontWeight,
  };

  const inRange = (range: Range | undefined, start: number, length: number) =>
    !!range && start < range[1] && start + length > range[0];

  // 沒有注音的部分拆成單字元，才能在任何位置換行
  const cells: Cell[] = [];
  let offset = 0;
  let replacedAdded = false;
  for (const segment of parseRuby(annotated)) {
    const pieces = segment.ruby
      ? [{ text: segment.text, ruby: segment.ruby, start: offset }]
      : Array.from(segment.text).map((ch, i) => ({
          text: ch,
          start: offset + i,
        }));
    for (const piece of pieces) {
      if (replace && inRange(replace.range, piece.start, piece.text.length)) {
        if (!replacedAdded)
          cells.push({
            text: replace.text,
            start: piece.start,
            replaced: true,
          });
        replacedAdded = true;
        continue;
      }
      cells.push(piece);
    }
    offset += segment.text.length;
  }

  return (
    <View
      style={[styles.row, center && styles.center, style]}
      accessible
      accessibilityLabel={stripRuby(annotated)}>
      {cells.map((cell, i) => {
        const strong = cell.replaced || inRange(highlight, cell.start, cell.text.length);
        const lined = !cell.replaced && inRange(underline, cell.start, cell.text.length);
        return (
          <View key={i} style={styles.cell}>
            <ThemedText
              style={[
                rubyStyle,
                {
                  color: color ?? (strong ? theme.accent : theme.textSecondary),
                },
              ]}>
              {cell.ruby ?? ' '}
            </ThemedText>
            <ThemedText
              style={[
                baseStyle,
                { color: color ?? (strong ? theme.accent : theme.text) },
                strong && styles.strong,
                lined && [styles.underline, { textDecorationColor: theme.accent }],
              ]}>
              {cell.text}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  center: {
    justifyContent: 'center',
  },
  cell: {
    alignItems: 'center',
  },
  strong: {
    fontWeight: 700,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});
