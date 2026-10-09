import { useEffect, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { ThemedText } from '@/components/themed-text';
import { Pager } from '@/components/ui/pager';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { FlashcardDeck } from '@/components/vocab/flashcard-deck';
import { GrammarCard } from '@/components/vocab/grammar-card';
import { VocabCard } from '@/components/vocab/vocab-card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { GRAMMAR_BY_LEVEL } from '@/data/grammar';
import {
  JLPT_LEVELS,
  PART_OF_SPEECH_LABELS,
  VOCAB_BY_LEVEL,
  type PartOfSpeech,
} from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { setJlptLevel, useJlptLevel } from '@/stores/jlpt-level-store';

const LEVEL_OPTIONS = JLPT_LEVELS.map((level) => ({ value: level, label: level }));

type VocabMode = 'list' | 'flashcard' | 'grammar';

type PosFilter = 'all' | PartOfSpeech;

const POS_OPTIONS: { value: PosFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  ...(Object.keys(PART_OF_SPEECH_LABELS) as PartOfSpeech[]).map((pos) => ({
    value: pos,
    label: PART_OF_SPEECH_LABELS[pos],
  })),
];

/** 單字列表每頁幾個，避免一頁太長要一直滑 */
const PAGE_SIZE = 20;

const MODE_OPTIONS: { value: VocabMode; label: string }[] = [
  { value: 'list', label: '列表' },
  { value: 'flashcard', label: '單字卡' },
  { value: 'grammar', label: '文法' },
];

export default function VocabScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const level = useJlptLevel();
  const [mode, setMode] = useState<VocabMode>('list');
  const [pos, setPos] = useState<PosFilter>('all');
  const words = useMemo(() => {
    const all = VOCAB_BY_LEVEL[level];
    return pos === 'all' ? all : all.filter((word) => word.pos === pos);
  }, [level, pos]);

  // 換等級或詞性時回到第一頁
  const [page, setPage] = useState(0);
  useEffect(() => {
    setPage(0);
  }, [level, pos]);
  const pageCount = Math.ceil(words.length / PAGE_SIZE);
  const pageWords = words.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const posFilter = (
    <View style={styles.posFilter}>
      <SegmentedControl options={POS_OPTIONS} value={pos} onChange={setPos} />
    </View>
  );

  const pager = <Pager page={page} pageCount={pageCount} onChange={setPage} />;

  const contentPadding = {
    paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
    paddingLeft: insets.left + Spacing.three,
    paddingRight: insets.right + Spacing.three,
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppBackground />
      {/* 標題和等級切換固定在上方 */}
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
              {mode === 'grammar' ? '文法' : '單字'}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {mode === 'grammar'
                ? `${level}・${GRAMMAR_BY_LEVEL[level].length} 個文法`
                : `${level}・${words.length} 個`}
            </ThemedText>
          </View>
          <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={setMode} />
          <SegmentedControl options={LEVEL_OPTIONS} value={level} onChange={setJlptLevel} />
        </View>
      </View>

      {mode === 'grammar' && (
        <FlatList
          key={`grammar-${level}`}
          data={GRAMMAR_BY_LEVEL[level]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <GrammarCard item={item} />}
          contentContainerStyle={[styles.list, contentPadding]}
          ItemSeparatorComponent={Separator}
        />
      )}
      {mode === 'list' && (
        <FlatList
          // 切換等級、詞性或頁數時從頂端開始
          key={`${level}-${pos}-${page}`}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {posFilter}
              {pager}
            </View>
          }
          ListFooterComponent={<View style={styles.listFooter}>{pager}</View>}
          data={pageWords}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <VocabCard item={item} />}
          contentContainerStyle={[styles.list, contentPadding]}
          ItemSeparatorComponent={Separator}
        />
      )}
      {mode === 'flashcard' && (
        <ScrollView contentContainerStyle={[styles.list, contentPadding]}>
          {posFilter}
          <FlashcardDeck level={level} words={words} />
        </ScrollView>
      )}
    </View>
  );
}

function Separator() {
  return <View style={styles.separator} />;
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
  },
  title: {
    letterSpacing: 4,
  },
  list: {
    paddingTop: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  posFilter: {
    marginBottom: Spacing.three,
  },
  listHeader: {
    marginBottom: Spacing.three,
  },
  listFooter: {
    marginTop: Spacing.three,
  },
  separator: {
    height: Spacing.two,
  },
});
