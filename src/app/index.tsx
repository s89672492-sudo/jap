import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { CaseCard } from '@/components/detective/case-card';
import { DetectiveEmblem } from '@/components/detective/detective-emblem';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useDailyArticle } from '@/hooks/use-daily-article';
import { useTheme } from '@/hooks/use-theme';
import { useJlptLevel } from '@/stores/jlpt-level-store';

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const level = useJlptLevel();
  const daily = useDailyArticle(level);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppBackground />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
          },
        ]}>
        <View style={styles.inner}>
          <View style={styles.hero}>
            <DetectiveEmblem />
            <ThemedText type="subtitle" style={styles.title}>
              偵探事務所
            </ThemedText>
            <View style={[styles.taglineBox, { borderColor: theme.gold }]}>
              <ThemedText type="smallBold" style={[styles.tagline, { color: theme.gold }]}>
                真相只有一個！
              </ThemedText>
            </View>
          </View>

          <CaseCard label="CASE 001" title="單字之謎">
            <ThemedText type="small" themeColor="textSecondary">
              每位偵探的第一步：蒐集線索。從 N5～N1 的單字和文法開始調查吧！
            </ThemedText>
          </CaseCard>

          <PrimaryButton label="開始調查單字" onPress={() => router.navigate('/vocab')} />

          {daily && (
            <>
              <CaseCard label="CASE 002" title="今日閱讀">
                <ThemedText type="small" themeColor="textSecondary">
                  {level}・{daily.article.title}（{daily.article.titleZh}）
                </ThemedText>
                <ThemedText type="smallBold" style={{ color: theme.gold }}>
                  {daily.doneToday ? '✓ 今天已完成' : '今天還沒讀'}・🔥 連續 {daily.streak} 天
                </ThemedText>
              </CaseCard>
              <SecondaryButton
                label={daily.doneToday ? '再去閱讀' : '閱讀今日文章'}
                onPress={() => router.navigate({ pathname: '/reading', params: { open: 'daily' } })}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
  },
  title: {
    textAlign: 'center',
    letterSpacing: 4,
  },
  taglineBox: {
    borderWidth: 1.5,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  tagline: {
    letterSpacing: 2,
  },
});
