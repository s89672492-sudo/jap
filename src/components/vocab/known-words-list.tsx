import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Pager } from '@/components/ui/pager';
import { VocabCard } from '@/components/vocab/vocab-card';
import { Spacing } from '@/constants/theme';
import type { VocabWord } from '@/data/vocab';
import { useHydrated } from '@/hooks/use-hydrated';
import { useTheme } from '@/hooks/use-theme';
import { dueLabel, MASTERY_LABELS, masteryOf } from '@/lib/srs';
import { setWordKnown, useKnownWords } from '@/stores/flashcard-store';
import { useStudyCards } from '@/stores/study-store';

const PAGE_SIZE = 20;

type KnownWordsListProps = {
  /** 目前等級、詞性的單字；只列出其中已記住的 */
  words: VocabWord[];
};

/** 單字卡按過「記住了」的單字列表；可以移回「還不熟」，讓它再出現在單字卡裡 */
export function KnownWordsList({ words }: KnownWordsListProps) {
  const theme = useTheme();
  const knownIds = useKnownWords();
  const cards = useStudyCards();
  const hydrated = useHydrated();
  const [openedAt] = useState(() => Date.now());
  const known = useMemo(() => words.filter((w) => knownIds.has(w.id)), [words, knownIds]);
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(known.length / PAGE_SIZE);
  // 移回不熟後如果這一頁空了，停在最後一頁
  const current = Math.min(page, Math.max(pageCount - 1, 0));

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
        已記住 {known.length}{' '}
        個。到了下次複習時間會再出現在單字卡裡；按「移回還不熟」則下一輪就會出現。
      </ThemedText>
      {known.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE).map((word) => (
        <View key={word.id} style={styles.item}>
          <VocabCard item={word} />
          <View style={styles.itemFooter}>
            {/* 學習狀態和下次複習時間（網頁版載入後才顯示，預先產生的畫面不知道今天幾號） */}
            {hydrated && cards[word.id] && (
              <ThemedText type="small" themeColor="textSecondary" style={styles.schedule}>
                {MASTERY_LABELS[masteryOf(cards[word.id])]}・下次複習：
                {dueLabel(cards[word.id], openedAt)}
              </ThemedText>
            )}
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
        </View>
      ))}
      <Pager page={current} pageCount={pageCount} onChange={setPage} />
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
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
  schedule: {
    flex: 1,
    minWidth: 0,
  },
  undo: {
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
