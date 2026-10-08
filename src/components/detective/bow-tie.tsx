import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type BowTieProps = {
  /** 領結總寬度 */
  size?: number;
};

/** 用純 View 畫的紅色領結裝飾（不依賴圖片） */
export function BowTie({ size = 56 }: BowTieProps) {
  const theme = useTheme();
  const wing = size / 2;
  const half = size / 4;

  return (
    <View style={[styles.row, { width: size, height: wing }]} accessibilityElementsHidden>
      <View
        style={[
          styles.triangle,
          {
            borderTopWidth: half,
            borderBottomWidth: half,
            borderLeftWidth: wing,
            borderLeftColor: theme.accent,
          },
        ]}
      />
      <View
        style={[
          styles.knot,
          {
            width: size / 5,
            height: size / 4,
            marginHorizontal: -size / 10,
            backgroundColor: theme.accent,
            borderColor: theme.background,
          },
        ]}
      />
      <View
        style={[
          styles.triangle,
          {
            borderTopWidth: half,
            borderBottomWidth: half,
            borderRightWidth: wing,
            borderRightColor: theme.accent,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  knot: {
    borderRadius: 4,
    borderWidth: 2,
    zIndex: 1,
  },
});
