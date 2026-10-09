import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { ReadingArticle } from '@/data/reading/types';
import { useTheme } from '@/hooks/use-theme';
import { useReadArticles } from '@/stores/reading-store';

type ArticleListProps = {
  articles: ReadingArticle[];
  onOpen: (article: ReadingArticle) => void;
};

/** 文章列表：標題、中文標題、主題；做完閱讀理解題的會打勾 */
export function ArticleList({ articles, onOpen }: ArticleListProps) {
  const theme = useTheme();
  const read = useReadArticles();

  return (
    <View style={styles.list}>
      {articles.map((article) => {
        const done = read.has(article.id);
        return (
          <Pressable
            key={article.id}
            accessibilityRole="button"
            accessibilityLabel={`${article.title}${done ? '，已讀' : ''}`}
            onPress={() => onOpen(article)}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
              pressed && styles.pressed,
            ]}>
            <View style={[styles.stripe, { backgroundColor: article.topic === '推理' ? theme.accent : theme.gold }]} />
            <View style={styles.text}>
              <ThemedText type="small" themeColor="textSecondary">
                {article.topic === '推理' ? '🔍 推理' : article.topic}
              </ThemedText>
              <ThemedText style={styles.title}>{article.title}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {article.titleZh}
              </ThemedText>
            </View>
            {done && (
              <ThemedText style={[styles.check, { color: theme.success }]} accessibilityLabel="已讀">
                ✓
              </ThemedText>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Spacing.three,
    overflow: 'hidden',
    minHeight: 64,
  },
  pressed: {
    opacity: 0.7,
  },
  stripe: {
    alignSelf: 'stretch',
    width: 6,
  },
  text: {
    flex: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    gap: Spacing.half,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 700,
  },
  check: {
    fontSize: 22,
    fontWeight: 700,
    paddingHorizontal: Spacing.three,
  },
});
