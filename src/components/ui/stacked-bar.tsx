import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type BarSegment = { value: number; color: string };

type StackedBarProps = {
  segments: BarSegment[];
  total: number;
  height?: number;
  /** 螢幕閱讀器念的內容，例如「N5：已熟練 10、複習中 20」 */
  accessibilityLabel?: string;
};

/** 橫向進度條，可以分好幾段顏色（不用圖表套件，一般 View 就能畫） */
export function StackedBar({ segments, total, height = 10, accessibilityLabel }: StackedBarProps) {
  const theme = useTheme();
  return (
    <View
      accessible={accessibilityLabel !== undefined}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: theme.backgroundSelected },
      ]}>
      {total > 0 &&
        segments.map((segment, i) =>
          segment.value > 0 ? (
            <View
              key={i}
              style={{
                width: `${Math.min(100, (segment.value / total) * 100)}%`,
                // 很少的數量也至少看得到一點
                minWidth: 3,
                backgroundColor: segment.color,
              }}
            />
          ) : null,
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
});
