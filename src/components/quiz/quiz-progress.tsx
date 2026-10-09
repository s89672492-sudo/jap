import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type QuizProgressProps = {
  /** 左側的題型標籤，例如「漢字讀法」 */
  label: string;
  index: number;
  total: number;
  score: number;
};

/** 題目上方的一列：題型標籤 + 第幾題、答對幾題 */
export function QuizProgress({ label, index, total, score }: QuizProgressProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={[styles.tag, { borderColor: theme.accent }]}>
        <ThemedText type="smallBold" style={{ color: theme.accent }}>
          {label}
        </ThemedText>
      </View>
      <ThemedText type="small" themeColor="textSecondary" style={styles.count}>
        第 {index + 1} / {total} 題・答對 {score}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tag: {
    borderWidth: 1.5,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  count: {
    fontVariant: ['tabular-nums'],
  },
});
