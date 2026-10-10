import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ArticleCover, TOPIC_TINTS } from './article-cover';
import { ArticleQuestions } from './article-questions';
import { ReadingParagraph } from './reading-paragraph';
import { ReadingVocabList } from './reading-vocab-list';

import { ThemedText } from '@/components/themed-text';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';
import { PARAGRAPH_CAST, PARAGRAPH_SCENES, VOCAB_ICONS } from '@/data/reading/illustrations';
import type { ReadingArticle } from '@/data/reading/types';
import { useTheme } from '@/hooks/use-theme';
import { markArticleRead } from '@/stores/reading-store';

type ArticleViewProps = {
  article: ReadingArticle;
  onBack: () => void;
};

/** 文章閱讀頁：標題、內文（可開翻譯、可朗讀）、重點單字、閱讀理解題 */
export function ArticleView({ article, onBack }: ArticleViewProps) {
  const theme = useTheme();
  const [showTranslation, setShowTranslation] = useState(false);
  const length = article.paragraphs.reduce((sum, p) => sum + p.ja.length, 0);
  const tint = TOPIC_TINTS[article.topic];
  const scenes = PARAGRAPH_SCENES[article.id];
  const cast = PARAGRAPH_CAST[article.id];

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="返回文章列表"
        onPress={onBack}
        hitSlop={8}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
        <ThemedText type="smallBold" style={{ color: theme.primary }}>
          ‹ 返回列表
        </ThemedText>
      </Pressable>

      <ArticleCover id={article.id} topic={article.topic} size="banner" />

      <View style={styles.titleBlock}>
        <ThemedText type="small" themeColor="textSecondary">
          {article.id.slice(0, 2).toUpperCase()}・{article.topic}・{length} 字
        </ThemedText>
        <ThemedText style={styles.title}>{article.title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {article.titleZh}
        </ThemedText>
      </View>

      <SecondaryButton
        label={showTranslation ? '隱藏中文翻譯' : '顯示中文翻譯'}
        onPress={() => setShowTranslation((v) => !v)}
      />

      <View
        style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        {article.paragraphs.map((paragraph, index) => (
          <ReadingParagraph
            key={index}
            paragraph={paragraph}
            showTranslation={showTranslation}
            scene={scenes?.[index]}
            cast={cast?.[index]}
          />
        ))}
      </View>

      <ThemedText type="smallBold" style={[styles.section, { color: theme.accent }]}>
        重點單字
      </ThemedText>
      <ReadingVocabList vocab={article.vocab} icons={VOCAB_ICONS[article.id]} tint={tint} />

      <ThemedText type="smallBold" style={[styles.section, { color: theme.accent }]}>
        閱讀理解
      </ThemedText>
      <ArticleQuestions questions={article.questions} onFinish={() => markArticleRead(article.id)} />

      <SecondaryButton label="返回文章列表" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  back: {
    minHeight: 44,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.6,
  },
  titleBlock: {
    gap: Spacing.one,
  },
  title: {
    fontSize: 24,
    lineHeight: 34,
    fontWeight: 700,
  },
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  section: {
    letterSpacing: 2,
    marginTop: Spacing.two,
  },
});
