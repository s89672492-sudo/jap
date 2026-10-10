import { useDeferredValue, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { ThemedText } from '@/components/themed-text';
import { PagedList } from '@/components/ui/paged-list';
import { SearchBox } from '@/components/ui/search-box';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { AutoPlayer } from '@/components/vocab/auto-player';
import { FlashcardDeck } from '@/components/vocab/flashcard-deck';
import { GrammarCard } from '@/components/vocab/grammar-card';
import { VocabCard } from '@/components/vocab/vocab-card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { GRAMMAR_BY_LEVEL, type GrammarPoint } from '@/data/grammar';
import {
  JLPT_LEVELS,
  PART_OF_SPEECH_LABELS,
  VOCAB_BY_LEVEL,
  type PartOfSpeech,
  type VocabWord,
} from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { ALL_GRAMMAR, ALL_WORDS, searchGrammar, searchWords } from '@/lib/search';
import { useBookmarks } from '@/stores/bookmarks-store';
import { setJlptLevel, useJlptLevel } from '@/stores/jlpt-level-store';

const LEVEL_OPTIONS = JLPT_LEVELS.map((level) => ({ value: level, label: level }));

type VocabMode = 'list' | 'flashcard' | 'autoplay' | 'grammar' | 'saved';

type PosFilter = 'all' | PartOfSpeech;

const POS_OPTIONS: { value: PosFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  ...(Object.keys(PART_OF_SPEECH_LABELS) as PartOfSpeech[]).map((pos) => ({
    value: pos,
    label: PART_OF_SPEECH_LABELS[pos],
  })),
];

/** 每頁幾個，避免一頁太長要一直滑（文法卡比較高，所以少一點） */
const PAGE_SIZE = 20;
const GRAMMAR_PAGE_SIZE = 10;

const MODE_OPTIONS: { value: VocabMode; label: string }[] = [
  { value: 'list', label: '列表' },
  { value: 'flashcard', label: '單字卡' },
  { value: 'autoplay', label: '播放' },
  { value: 'grammar', label: '文法' },
  { value: 'saved', label: '收藏' },
];

/** 收藏列表裡混合了單字和文法 */
type SavedItem = { kind: 'word'; item: VocabWord } | { kind: 'grammar'; item: GrammarPoint };

export default function VocabScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const level = useJlptLevel();
  const bookmarks = useBookmarks();
  const [mode, setMode] = useState<VocabMode>('list');
  const [pos, setPos] = useState<PosFilter>('all');
  const [query, setQuery] = useState('');
  // 打字時先更新輸入框，搜尋結果稍後再算，打字不會卡
  const deferredQuery = useDeferredValue(query.trim());
  const searching = deferredQuery.length > 0 && (mode === 'list' || mode === 'grammar');

  const words = useMemo(() => {
    const all = VOCAB_BY_LEVEL[level];
    return pos === 'all' ? all : all.filter((word) => word.pos === pos);
  }, [level, pos]);

  const wordResults = useMemo(
    () => (searching && mode === 'list' ? searchWords(deferredQuery) : []),
    [searching, mode, deferredQuery],
  );
  const grammarResults = useMemo(
    () => (searching && mode === 'grammar' ? searchGrammar(deferredQuery) : []),
    [searching, mode, deferredQuery],
  );

  const saved = useMemo<SavedItem[]>(
    () => [
      ...ALL_WORDS.filter((word) => bookmarks.has(word.id)).map(
        (item) => ({ kind: 'word', item }) as const,
      ),
      ...ALL_GRAMMAR.filter((point) => bookmarks.has(point.id)).map(
        (item) => ({ kind: 'grammar', item }) as const,
      ),
    ],
    [bookmarks],
  );

  const grammar = GRAMMAR_BY_LEVEL[level];

  const subtitle = (() => {
    if (searching) {
      const count = mode === 'list' ? wordResults.length : grammarResults.length;
      return `全部等級・找到 ${count} 個`;
    }
    if (mode === 'saved') return `${saved.length} 個收藏`;
    if (mode === 'grammar') return `${level}・${grammar.length} 個文法`;
    return `${level}・${words.length} 個`;
  })();

  const title = { list: '單字', flashcard: '單字', autoplay: '單字', grammar: '文法', saved: '收藏' }[mode];

  const posFilter = <SegmentedControl options={POS_OPTIONS} value={pos} onChange={setPos} />;

  const contentPadding = {
    paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
    paddingLeft: insets.left + Spacing.three,
    paddingRight: insets.right + Spacing.three,
  };
  const listStyle = [styles.list, contentPadding];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppBackground />
      {/* 標題、模式、等級和搜尋固定在上方 */}
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
              {title}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {subtitle}
            </ThemedText>
          </View>
          <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={setMode} />
          {mode !== 'saved' && !searching && (
            <SegmentedControl options={LEVEL_OPTIONS} value={level} onChange={setJlptLevel} />
          )}
          {(mode === 'list' || mode === 'grammar') && (
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder={mode === 'list' ? '搜尋單字：日文、假名或中文' : '搜尋文法：句型或中文'}
            />
          )}
        </View>
      </View>

      {mode === 'list' &&
        (searching ? (
          <PagedList
            items={wordResults}
            pageSize={PAGE_SIZE}
            keyExtractor={(item) => item.id}
            renderItem={(item) => <VocabCard item={item} showLevel />}
            resetKey={`search-${deferredQuery}`}
            emptyText="找不到符合的單字"
            contentContainerStyle={listStyle}
          />
        ) : (
          <PagedList
            items={words}
            pageSize={PAGE_SIZE}
            keyExtractor={(item) => item.id}
            renderItem={(item) => <VocabCard item={item} />}
            resetKey={`${level}-${pos}`}
            header={posFilter}
            emptyText="這個分類沒有單字"
            contentContainerStyle={listStyle}
          />
        ))}
      {mode === 'grammar' && (
        <PagedList
          items={searching ? grammarResults : grammar}
          pageSize={GRAMMAR_PAGE_SIZE}
          keyExtractor={(item) => item.id}
          renderItem={(item) => <GrammarCard item={item} showLevel={searching} />}
          resetKey={searching ? `search-${deferredQuery}` : `grammar-${level}`}
          emptyText="找不到符合的文法"
          contentContainerStyle={listStyle}
        />
      )}
      {mode === 'saved' && (
        <PagedList
          items={saved}
          pageSize={PAGE_SIZE}
          keyExtractor={(entry) => entry.item.id}
          renderItem={(entry) =>
            entry.kind === 'word' ? (
              <VocabCard item={entry.item} showLevel />
            ) : (
              <GrammarCard item={entry.item} showLevel />
            )
          }
          resetKey="saved"
          emptyText="還沒有收藏。在單字或文法卡片上點 ☆ 就能加入這裡。"
          contentContainerStyle={listStyle}
        />
      )}
      {mode === 'autoplay' && (
        <ScrollView contentContainerStyle={listStyle}>
          <View style={styles.posFilter}>{posFilter}</View>
          <AutoPlayer words={words} />
        </ScrollView>
      )}
      {mode === 'flashcard' && (
        <ScrollView contentContainerStyle={listStyle}>
          <View style={styles.posFilter}>{posFilter}</View>
          <FlashcardDeck level={level} words={words} />
        </ScrollView>
      )}
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
  list: {
    paddingTop: Spacing.three,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  posFilter: {
    marginBottom: Spacing.three,
  },
});
