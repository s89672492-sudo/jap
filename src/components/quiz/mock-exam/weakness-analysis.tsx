import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { practiceTarget, type TypeStat } from '@/lib/exam-analysis';

/** 最弱的大問：答對率和「開始針對練習」按鈕（打開對應的練習） */
export function WeaknessAnalysis({ weak, note }: { weak: TypeStat[]; note?: string }) {
  const theme = useTheme();
  if (weak.length === 0) {
    return (
      <ThemedText type="small" themeColor="textSecondary">
        目前沒有明顯的弱點題型（每個題型至少要有幾題紀錄、答對率低於八成才會列出）。
      </ThemedText>
    );
  }
  return (
    <View style={styles.list}>
      {note && (
        <ThemedText type="small" themeColor="textSecondary">
          {note}
        </ThemedText>
      )}
      {weak.map((stat, i) => {
        const target = practiceTarget(stat.subcategory);
        return (
          <View key={stat.subcategory} style={[styles.row, { borderColor: theme.border }]}>
            <View style={styles.head}>
              <ThemedText type="smallBold" style={styles.flex}>
                {i + 1}. {stat.label}
              </ThemedText>
              <ThemedText type="smallBold" style={{ color: theme.accent }}>
                {Math.round(stat.rate * 100)}%
              </ThemedText>
            </View>
            <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
              <View
                style={[styles.fill, { width: `${stat.rate * 100}%`, backgroundColor: theme.gold }]}
              />
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              答對 {stat.correct} / {stat.total} 題
            </ThemedText>
            <SecondaryButton
              label={`開始針對練習：${stat.label}`}
              onPress={() =>
                router.navigate({
                  pathname: '/quiz',
                  params: target.focus
                    ? { mode: target.mode, focus: target.focus }
                    : { mode: target.mode },
                })
              }
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.three,
  },
  row: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
    gap: Spacing.one,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
