import { StyleSheet, View } from 'react-native';

import { DetectiveEmblem } from '@/components/detective/detective-emblem';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import type { LearningProgress } from '@/hooks/use-learning-progress';
import { useTheme } from '@/hooks/use-theme';
import { accuracy, percent } from '@/lib/progress';

/**
 * 首頁最上面的招牌：深藍底（偵探的西裝外套）、徽章、事務所名稱，
 * 下面一排是今天的數字：連續天數、今日答題、今日答對率。
 */
export function HomeHero({ progress }: { progress: LearningProgress | null }) {
  const theme = useTheme();
  const today = progress ? (progress.log[progress.today] ?? { n: 0, c: 0, w: 0 }) : null;

  return (
    <View
      style={[
        styles.panel,
        { backgroundColor: theme.hero, boxShadow: `0 6px 18px ${theme.shadow}` },
      ]}>
      <View style={styles.top}>
        <DetectiveEmblem size={72} />
        <View style={styles.titles}>
          <ThemedText style={[styles.title, { color: theme.onHero }]} numberOfLines={1}>
            偵探事務所
          </ThemedText>
          <ThemedText style={[styles.tagline, { color: theme.heroGold }]}>
            真相只有一個！
          </ThemedText>
        </View>
      </View>

      {progress && today && (
        <View style={[styles.stats, { borderTopColor: 'rgba(245, 239, 224, 0.18)' }]}>
          <View style={styles.stat}>
            <View style={styles.statValueRow}>
              <Icon name="streak" size={18} color={theme.heroGold} />
              <ThemedText style={[styles.statValue, { color: theme.heroGold }]}>
                {progress.streak}
              </ThemedText>
            </View>
            <ThemedText style={[styles.statLabel, { color: theme.onHeroMuted }]}>
              連續天數
            </ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={[styles.statValue, { color: theme.onHero }]}>{today.n}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.onHeroMuted }]}>
              今日答題
            </ThemedText>
          </View>
          <View style={styles.stat}>
            <ThemedText style={[styles.statValue, { color: theme.onHero }]}>
              {percent(accuracy([today]))}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: theme.onHeroMuted }]}>
              今日答對率
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: Radius.sheet,
    padding: Spacing.four - 4,
    gap: Spacing.three,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  titles: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.one,
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 700,
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 700,
    letterSpacing: 2,
  },
  stats: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing.three,
  },
  stat: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: 2,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  statValue: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 700,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 500,
  },
});
