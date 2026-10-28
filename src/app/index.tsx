import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { CaseCard } from '@/components/detective/case-card';
import { DetectiveEmblem } from '@/components/detective/detective-emblem';
import { LevelProgressList } from '@/components/home/level-progress-list';
import { ProgressOverview } from '@/components/home/progress-overview';
import { TodayTasks } from '@/components/home/today-tasks';
import { ThemedText } from '@/components/themed-text';
import { ChipButton } from '@/components/ui/chip-button';
import { LoadingNote } from '@/components/ui/loading-note';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useDailyArticle } from '@/hooks/use-daily-article';
import { useLearningProgress } from '@/hooks/use-learning-progress';
import { useTheme } from '@/hooks/use-theme';
import { useJlptLevel } from '@/stores/jlpt-level-store';

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const level = useJlptLevel();
  const daily = useDailyArticle(level);
  const progress = useLearningProgress();
  // 首頁或「學習進度總覽」
  const [showOverview, setShowOverview] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const toggleOverview = (next: boolean) => {
    setShowOverview(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  // Android 的返回鍵：在進度總覽時先回到首頁
  useEffect(() => {
    if (!showOverview) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setShowOverview(false);
      return true;
    });
    return () => sub.remove();
  }, [showOverview]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppBackground />
      <ScrollView
        ref={scrollRef}
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
        {showOverview ? (
          <View style={styles.inner}>
            <View style={styles.overviewHeader}>
              <ChipButton
                label="‹ 事務所"
                accessibilityLabel="回到事務所首頁"
                onPress={() => toggleOverview(false)}
              />
              <ThemedText type="subtitle" style={styles.overviewTitle} numberOfLines={1}>
                學習進度總覽
              </ThemedText>
            </View>
            {progress ? (
              <ProgressOverview progress={progress} />
            ) : (
              <LoadingNote text="讀取學習紀錄…" />
            )}
          </View>
        ) : (
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

            {progress ? (
              <TodayTasks level={level} progress={progress} daily={daily} />
            ) : (
              <LoadingNote text="讀取今日任務…" />
            )}

            <CaseCard label="CASE 001" title="單字之謎">
              <ThemedText type="small" themeColor="textSecondary">
                每位偵探的第一步：蒐集線索。從 N5～N1 的單字和文法開始調查吧！
              </ThemedText>
            </CaseCard>

            <PrimaryButton label="開始調查單字" onPress={() => router.navigate('/vocab')} />

            {progress && (
              <>
                <CaseCard label="CASE 002" title="各等級學習進度">
                  <LevelProgressList levels={progress.levels} />
                </CaseCard>
                <SecondaryButton label="查看學習進度總覽" onPress={() => toggleOverview(true)} />
              </>
            )}
          </View>
        )}
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
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  overviewTitle: {
    flex: 1,
    minWidth: 0,
  },
});
