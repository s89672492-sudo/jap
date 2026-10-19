import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Pager } from '@/components/ui/pager';
import { VocabCard } from '@/components/vocab/vocab-card';
import { Spacing } from '@/constants/theme';
import type { VocabWord } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { setWordKnown, useKnownWords } from '@/stores/flashcard-store';

const PAGE_SIZE = 20;

type KnownWordsListProps = {
  /** 目前等級、詞性的單字；只列出其中已記住的 */
  words: VocabWord[];
};

/** 單字卡按過「記住了」的單字列表；可以移回「還不熟」，讓它再出現在單字卡裡 */
export function KnownWordsList({ words }: KnownWordsListProps) {
  const theme = useTheme();
  const knownIds = useKnownWords();
  const known = useMemo(() => words.filter((w) => knownIds.has(w.id)), [words, knownIds]);
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(known.length / PAGE_SIZE);

  // 移回不熟後如果這一頁空了，退回上一頁
  useEffect(() => {
    if (page > 0 && page >= pageCount) setPage(Math.max(0, pageCount - 1));
  }, [page, pageCount]);

  if (known.length === 0) {
    return (
      <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
        還沒有記住的單字。在單字卡翻面後按「記住了」，就會列在這裡。
      </ThemedText>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        已記住 {known.length} 個。按「移回還不熟」，這個單字下一輪會再出現在單字卡裡。
      </ThemedText>
      {known.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((word) => (
        <View key={word.id} style={styles.item}>
          <VocabCard item={word} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`把 ${word.word} 移回還不熟`}
            onPress={() => setWordKnown(word.id, false)}
            style={({ pressed }) => [
              styles.undo,
              { borderColor: theme.border, backgroundColor: theme.backgroundElement },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="smallBold" style={{ color: theme.accent }}>
              移回還不熟
            </ThemedText>
          </Pressable>
        </View>
      ))}
      <Pager page={page} pageCount={pageCount} onChange={setPage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  item: {
    gap: Spacing.one,
  },
  undo: {
    alignSelf: 'flex-end',
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderRadius: 22,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: Spacing.five,
  },
  pressed: {
    opacity: 0.7,
  },
});
