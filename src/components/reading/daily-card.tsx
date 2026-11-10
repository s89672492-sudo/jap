import { StyleSheet, View } from 'react-native';

import { ArticleCover } from './article-cover';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Radius, Spacing } from '@/constants/theme';
import type { DailyArticle } from '@/hooks/use-daily-article';
import { useTheme } from '@/hooks/use-theme';
import { useReadArticles } from '@/stores/reading-store';

type DailyCardProps = {
  daily: DailyArticle;
  onOpen: () => void;
};

/** 今日一篇：今天的文章、今天完成了沒、連續閱讀天數 */
export function DailyCard({ daily, onOpen }: DailyCardProps) {
  const theme = useTheme();
  const { article, doneToday, streak } = daily;
  const articleDone = useReadArticles().has(article.id);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.gold,
          boxShadow: `0 2px 10px ${theme.shadow}`,
        },
      ]}>
      <View style={styles.header}>
        <View style={styles.headerItem}>
          <Icon name="calendar" size={16} color={theme.accent} />
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            今日一篇
          </ThemedText>
        </View>
        <View style={styles.headerItem}>
          <Icon name="streak" size={16} color={theme.gold} />
          <ThemedText type="smallBold" style={{ color: theme.gold }}>
            連續 {streak} 天
          </ThemedText>
        </View>
      </View>
      <View style={styles.body}>
        <ArticleCover id={article.id} topic={article.topic} size="thumb" />
        <View style={styles.text}>
          <ThemedText style={styles.title}>{article.title}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {article.titleZh}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        {doneToday ? '✓ 今天的閱讀已完成，明天再來！' : '讀完並做完閱讀理解題，今天就算完成。'}
      </ThemedText>
      <PrimaryButton label={articleDone ? '再讀一次' : '開始閱讀'} onPress={onOpen} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: Radius.card,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  headerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 700,
  },
});
