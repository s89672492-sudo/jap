import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { CaseCard } from '@/components/detective/case-card';
import { DueWordsReview } from '@/components/home/due-words-review';
import { ExamSummary } from '@/components/home/exam-summary';
import { HomeHero } from '@/components/home/home-hero';
import { LevelProgressList } from '@/components/home/level-progress-list';
import { ProgressOverview } from '@/components/home/progress-overview';
import { TodayTasks } from '@/components/home/today-tasks';
import { ExamInProgressBanner, ExamLock } from '@/components/quiz/mock-exam/exam-lock';
import { ThemedText } from '@/components/themed-text';
import { ChipButton } from '@/components/ui/chip-button';
import { LoadingNote } from '@/components/ui/loading-note';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { TravelGuide } from '@/components/travel/travel-guide';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useDailyArticle } from '@/hooks/use-daily-article';
import { useLearningProgress } from '@/hooks/use-learning-progress';
import { useTheme } from '@/hooks/use-theme';
import { useJlptLevel } from '@/stores/jlpt-level-store';

type HomeView = 'home' | 'overview' | 'review' | 'travel';

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const level = useJlptLevel();
  const daily = useDailyArticle(level);
  const progress = useLearningProgress();
  // 首頁、「學習進度總覽」、「今日複習單字」或「生活旅行用語」
  const [view, setView] = useState<HomeView>('home');
  const scrollRef = useRef<ScrollView>(null);

  const open = (next: HomeView) => {
    setView(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  // Android 的返回鍵：在進度總覽、複習單字時先回到首頁
  useEffect(() => {
    if (view === 'home') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setView('home');
      return true;
    });
    return () => sub.remove();
  }, [view]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppBackground />
      <ScrollView
        ref={scrollRef}
        style={styles.screen}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.three,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
          },
        ]}>
        {view !== 'home' ? (
          <View style={styles.inner}>
            <View style={styles.overviewHeader}>
              <ChipButton
                label="‹ 事務所"
                accessibilityLabel="回到事務所首頁"
                onPress={() => open('home')}
              />
              <ThemedText type="subtitle" style={styles.overviewTitle} numberOfLines={1}>
                {view === 'review'
                  ? `複習單字・${level}`
                  : view === 'travel'
                    ? '生活旅行用語'
                    : '學習進度總覽'}
              </ThemedText>
            </View>
            {view === 'travel' ? (
              <ExamLock what="生活旅行用語">
                <TravelGuide />
              </ExamLock>
            ) : view === 'review' ? (
              // 考試中不能看單字（避免查到答案）
              <ExamLock what="單字複習">
                <DueWordsReview level={level} />
              </ExamLock>
            ) : progress ? (
              <ProgressOverview progress={progress} />
            ) : (
              <LoadingNote text="讀取學習紀錄…" />
            )}
          </View>
        ) : (
          <View style={styles.inner}>
            <HomeHero progress={progress} />

            <ExamInProgressBanner />

            {progress ? (
              <TodayTasks
                level={level}
                progress={progress}
                daily={daily}
                onReviewWords={() => open('review')}
              />
            ) : (
              <LoadingNote text="讀取今日任務…" />
            )}

            {progress && <ExamSummary level={level} />}

            <CaseCard label="CASE 001" title="單字之謎">
              <ThemedText type="small" themeColor="textSecondary">
                每位偵探的第一步：蒐集線索。從 N5～N1 的單字和文法開始調查吧！
              </ThemedText>
            </CaseCard>

            <PrimaryButton label="開始調查單字" onPress={() => router.navigate('/vocab')} />

            <CaseCard label="CASE 003" title="生活旅行用語">
              <ThemedText type="small" themeColor="textSecondary">
                到日本自由行用得到的句子：點餐、搭車、購物、問路，還有店員常說的話和容易誤會的漢字。
              </ThemedText>
            </CaseCard>
            <SecondaryButton label="打開生活旅行用語" onPress={() => open('travel')} />

            {progress && (
              <>
                <CaseCard label="CASE 002" title="各等級學習進度">
                  <LevelProgressList levels={progress.levels} />
                </CaseCard>
                <SecondaryButton label="查看學習進度總覽" onPress={() => open('overview')} />
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
