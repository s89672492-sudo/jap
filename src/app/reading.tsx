import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { ExamLock } from '@/components/quiz/mock-exam/exam-lock';
import { ArticleList } from '@/components/reading/article-list';
import { ArticleView } from '@/components/reading/article-view';
import { DailyCard } from '@/components/reading/daily-card';
import { ExternalLinks } from '@/components/reading/external-links';
import { ThemedText } from '@/components/themed-text';
import { LevelPicker } from '@/components/ui/level-picker';
import { LoadingNote } from '@/components/ui/loading-note';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useLevelData } from '@/data/level-data';
import type { ReadingArticle } from '@/data/reading';
import { useDailyArticle } from '@/hooks/use-daily-article';
import { useDepsChanged } from '@/hooks/use-hydrated';
import { useTheme } from '@/hooks/use-theme';
import { useJlptLevel } from '@/stores/jlpt-level-store';
import { useReadArticles } from '@/stores/reading-store';

const NO_ARTICLES: ReadingArticle[] = [];

export default function ReadingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const level = useJlptLevel();
  const read = useReadArticles();
  const daily = useDailyArticle(level);
  // 從首頁「閱讀今日文章」進來時，直接打開今日文章
  const { open: openParam } = useLocalSearchParams<{ open?: string }>();
  const dailyRequest = openParam === 'daily' && daily ? daily.article : null;
  const [article, setArticle] = useState<ReadingArticle | null>(dailyRequest);
  const scrollRef = useRef<ScrollView>(null);

  const levelData = useLevelData(level);
  const articles = levelData?.reading ?? NO_ARTICLES;
  const readCount = articles.filter((a) => read.has(a.id)).length;

  const open = (next: ReadingArticle | null) => {
    setArticle(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  if (useDepsChanged([dailyRequest]) && dailyRequest) setArticle(dailyRequest);
  // 打開後捲到最上面，並清掉網址參數（之後回到這頁不會又自動打開）
  useEffect(() => {
    if (!dailyRequest) return;
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    router.setParams({ open: undefined });
  }, [dailyRequest]);

  // Android 的返回鍵：在文章裡時先回到列表
  useEffect(() => {
    if (!article) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      open(null);
      return true;
    });
    return () => sub.remove();
  }, [article]);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppBackground />
      <ExamLock what="閱讀文章">
        <View
          style={[
            styles.header,
            {
              paddingTop: insets.top + Spacing.three,
              paddingLeft: insets.left + Spacing.three,
              paddingRight: insets.right + Spacing.three,
              borderBottomColor: theme.border,
            },
          ]}>
          <View style={styles.inner}>
            <View style={styles.titleRow}>
              <ThemedText type="subtitle" style={styles.title}>
                閱讀
              </ThemedText>
              <View style={styles.titleSide}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                  {levelData ? `已讀 ${readCount} / ${articles.length} 篇` : '載入中…'}
                </ThemedText>
                {/* 讀文章時不換等級，回到列表才顯示 */}
                {!article && <LevelPicker />}
              </View>
            </View>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
              paddingLeft: insets.left + Spacing.three,
              paddingRight: insets.right + Spacing.three,
            },
          ]}>
          <View style={styles.inner}>
            {article ? (
              <ArticleView article={article} onBack={() => open(null)} />
            ) : (
              <>
                {daily && <DailyCard daily={daily} onOpen={() => open(daily.article)} />}
                <ThemedText type="small" themeColor="textSecondary">
                  原創的分級文章，依等級的單字和文法撰寫。讀完做閱讀理解題就會打勾。
                </ThemedText>
                {levelData ? <ArticleList articles={articles} onOpen={open} /> : <LoadingNote />}
                <ThemedText type="smallBold" style={[styles.section, { color: theme.accent }]}>
                  更多線上閱讀
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  以下是免費的日文閱讀網站，會用瀏覽器開啟。
                </ThemedText>
                <ExternalLinks level={level} />
              </>
            )}
          </View>
        </ScrollView>
      </ExamLock>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    minHeight: 44,
  },
  titleSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexShrink: 1,
  },
  subtitle: {
    flexShrink: 1,
    textAlign: 'right',
  },
  title: {
    letterSpacing: 4,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.three,
  },
  section: {
    letterSpacing: 2,
    marginTop: Spacing.three,
  },
});
