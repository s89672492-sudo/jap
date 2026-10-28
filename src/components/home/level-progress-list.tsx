import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { StackedBar } from '@/components/ui/stacked-bar';
import { Spacing } from '@/constants/theme';
import { JLPT_LEVELS, type JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import type { LevelProgress } from '@/lib/progress';
import { MASTERY_LABELS, type Mastery } from '@/lib/srs';

/** 學習狀態的顏色（新單字不畫，就是底色） */
export function useMasteryColors(): Record<Exclude<Mastery, 'new'>, string> {
  const theme = useTheme();
  return { learning: theme.gold, reviewing: theme.primary, mastered: theme.success };
}

/** 各等級單字進度條：學習中、複習中、已熟練三段 */
export function LevelProgressList({
  levels,
  legend = true,
}: {
  levels: Record<JlptLevel, LevelProgress>;
  /** 下方顯示顏色說明 */
  legend?: boolean;
}) {
  const colors = useMasteryColors();
  return (
    <View style={styles.list}>
      {JLPT_LEVELS.map((level) => {
        const p = levels[level];
        const practiced = p.wordsTotal - p.words.new;
        return (
          <View key={level} style={styles.row}>
            <View style={styles.rowHead}>
              <ThemedText type="smallBold">{level}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                練過 {practiced} / {p.wordsTotal}・熟練 {p.words.mastered}
              </ThemedText>
            </View>
            <StackedBar
              total={p.wordsTotal}
              segments={[
                { value: p.words.mastered, color: colors.mastered },
                { value: p.words.reviewing, color: colors.reviewing },
                { value: p.words.learning, color: colors.learning },
              ]}
              accessibilityLabel={`${level} 單字：${(
                ['mastered', 'reviewing', 'learning', 'new'] as const
              )
                .map((m) => `${MASTERY_LABELS[m]} ${p.words[m]}`)
                .join('、')}`}
            />
          </View>
        );
      })}
      {legend && <MasteryLegend />}
    </View>
  );
}

export function MasteryLegend({ counts }: { counts?: Record<Mastery, number> }) {
  const colors = useMasteryColors();
  const theme = useTheme();
  const items: { key: Mastery; color: string }[] = [
    { key: 'mastered', color: colors.mastered },
    { key: 'reviewing', color: colors.reviewing },
    { key: 'learning', color: colors.learning },
    { key: 'new', color: theme.backgroundSelected },
  ];
  return (
    <View style={styles.legend}>
      {items.map((item) => (
        <View key={item.key} style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: item.color, borderColor: theme.border }]} />
          <ThemedText type="small" themeColor="textSecondary">
            {MASTERY_LABELS[item.key]}
            {counts ? ` ${counts[item.key]}` : ''}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
  row: {
    gap: Spacing.one,
  },
  rowHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: Spacing.three,
    rowGap: Spacing.one,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
