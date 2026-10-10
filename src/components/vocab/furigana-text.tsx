import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { parseRuby } from "@/lib/furigana";

type FuriganaTextProps = {
  /** 加了注音的句子（[漢字|かんじ]） */
  annotated: string;
  /** 要用強調色標出的範圍（以去掉注音後的句子計算），[開始, 結束) */
  highlight?: [number, number];
  fontSize?: number;
};

/**
 * 有假名注音的句子：漢字上方顯示小字讀音。
 * React Native 沒有 <ruby>，所以把每個字排成「讀音在上、字在下」的小方塊，自動換行。
 */
export function FuriganaText({
  annotated,
  highlight,
  fontSize = 15,
}: FuriganaTextProps) {
  const theme = useTheme();
  const rubySize = Math.round(fontSize * 0.55);
  const rubyStyle = { fontSize: rubySize, lineHeight: rubySize + 3 };
  const baseStyle = { fontSize, lineHeight: fontSize + 6 };

  // 沒有注音的部分拆成單字元，才能在任何位置換行
  const cells: { text: string; ruby?: string; start: number }[] = [];
  let offset = 0;
  for (const segment of parseRuby(annotated)) {
    if (segment.ruby) {
      cells.push({ text: segment.text, ruby: segment.ruby, start: offset });
    } else {
      Array.from(segment.text).forEach((ch, i) =>
        cells.push({ text: ch, start: offset + i }),
      );
    }
    offset += segment.text.length;
  }

  const isHighlighted = (start: number, length: number) =>
    !!highlight && start < highlight[1] && start + length > highlight[0];

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={annotated.replace(/\[([^|\]]+)\|[^\]]+\]/g, "$1")}
    >
      {cells.map((cell, i) => {
        const strong = isHighlighted(cell.start, cell.text.length);
        const color = strong ? theme.accent : theme.text;
        return (
          <View key={i} style={styles.cell}>
            <ThemedText
              style={[
                rubyStyle,
                { color: strong ? theme.accent : theme.textSecondary },
              ]}
            >
              {cell.ruby ?? " "}
            </ThemedText>
            <ThemedText style={[baseStyle, { color }, strong && styles.strong]}>
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
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
  cell: {
    alignItems: "center",
  },
  strong: {
    fontWeight: 700,
  },
});
