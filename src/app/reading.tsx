import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { ArticleList } from '@/components/reading/article-list';
import { ArticleView } from '@/components/reading/article-view';
import { DailyCard } from '@/components/reading/daily-card';
import { ExternalLinks } from '@/components/reading/external-links';
import { ThemedText } from '@/components/themed-text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { READING_BY_LEVEL, type ReadingArticle } from '@/data/reading';
import { JLPT_LEVELS } from '@/data/vocab';
import { useDailyArticle } from '@/hooks/use-daily-article';
import { useTheme } from '@/hooks/use-theme';
import { setJlptLevel, useJlptLevel } from '@/stores/jlpt-level-store';
import { useReadArticles } from '@/stores/reading-store';

const LEVEL_OPTIONS = JLPT_LEVELS.map((level) => ({ value: level, label: level }));

export default function ReadingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const level = useJlptLevel();
  const read = useReadArticles();
  const [article, setArticle] = useState<ReadingArticle | null>(null);
  const daily = useDailyArticle(level);
  // 從首頁「閱讀今日文章」進來時，直接打開今日文章
  const { open: openParam } = useLocalSearchParams<{ open?: string }>();
  const scrollRef = useRef<ScrollView>(null);

  const articles = READING_BY_LEVEL[level];
  const readCount = articles.filter((a) => read.has(a.id)).length;

  const open = (next: ReadingArticle | null) => {
    setArticle(next);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  useEffect(() => {
    if (openParam !== 'daily' || !daily) return;
    open(daily.article);
    router.setParams({ open: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openParam, daily?.article.id]);

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
            <ThemedText type="small" themeColor="textSecondary">
              {level}・已讀 {readCount} / {articles.length} 篇
            </ThemedText>
          </View>
          {!article && (
            <SegmentedControl options={LEVEL_OPTIONS} value={level} onChange={setJlptLevel} />
          )}
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
              <ArticleList articles={articles} onOpen={open} />
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
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.two,
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
