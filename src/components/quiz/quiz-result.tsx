import { StyleSheet, View } from 'react-native';

import { DetectiveEmblem } from '@/components/detective/detective-emblem';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import type { JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';

type QuizResultProps = {
  level: JlptLevel;
  score: number;
  total: number;
  onRetry: () => void;
};

function getRank(score: number, total: number) {
  const ratio = total === 0 ? 0 : score / total;
  if (ratio === 1) return '名偵探！真相只有一個！';
  if (ratio >= 0.7) return '優秀的偵探，離真相只差一步';
  if (ratio >= 0.4) return '見習偵探，繼續蒐集線索吧';
  return '案件陷入膠著…再調查一次！';
}

/** 一輪結束後的結果畫面：破案率 + 稱號 */
export function QuizResult({ level, score, total, onRetry }: QuizResultProps) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <DetectiveEmblem />
      <ThemedText type="smallBold" style={[styles.label, { color: theme.accent }]}>
        {level} 調查報告
      </ThemedText>
      <ThemedText style={styles.score}>
        {score} / {total}
      </ThemedText>
      <ThemedText style={[styles.rank, { color: theme.gold }]}>{getRank(score, total)}</ThemedText>
      <PrimaryButton label="再調查一輪" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
  },
  label: {
    letterSpacing: 2,
    marginTop: Spacing.two,
  },
  score: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: 700,
  },
  rank: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: Spacing.three,
  },
});
