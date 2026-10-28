import { useDeferredValue, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { ThemedText } from '@/components/themed-text';
import { KeepAlive } from '@/components/ui/keep-alive';
import { LoadingNote } from '@/components/ui/loading-note';
import { LevelPicker } from '@/components/ui/level-picker';
import { PagedList } from '@/components/ui/paged-list';
import { SearchBox } from '@/components/ui/search-box';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { AutoPlayer } from '@/components/vocab/auto-player';
import { FlashcardDeck } from '@/components/vocab/flashcard-deck';
import { GrammarCard } from '@/components/vocab/grammar-card';
import { VocabCard } from '@/components/vocab/vocab-card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import type { GrammarPoint } from '@/data/grammar';
import { useAllLevelData, useLevelData } from '@/data/level-data';
import { PART_OF_SPEECH_LABELS, type PartOfSpeech, type VocabWord } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { searchGrammar, searchWords } from '@/lib/search';
import { useBookmarks } from '@/stores/bookmarks-store';
import { useJlptLevel } from '@/stores/jlpt-level-store';

type VocabMode = 'list' | 'flashcard' | 'autoplay' | 'grammar' | 'saved';

type PosFilter = 'all' | PartOfSpeech;

const POS_OPTIONS: { value: PosFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  ...(Object.keys(PART_OF_SPEECH_LABELS) as PartOfSpeech[]).map((pos) => ({
    value: pos,
    label: PART_OF_SPEECH_LABELS[pos],
  })),
];

const NO_WORDS: VocabWord[] = [];
const NO_GRAMMAR: GrammarPoint[] = [];

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
  const hasQuery = deferredQuery.length > 0;
  const searching = hasQuery && (mode === 'list' || mode === 'grammar');

  // 這個等級的資料用到時才載入；跨等級搜尋和收藏才需要全部等級
  const levelData = useLevelData(level);
  const allData = useAllLevelData(hasQuery || mode === 'saved');
  const loading = levelData === null;

  const words = useMemo(() => {
    const all = levelData?.words ?? NO_WORDS;
    return pos === 'all' ? all : all.filter((word) => word.pos === pos);
  }, [levelData, pos]);

  const wordResults = useMemo(
    () => (hasQuery && allData ? searchWords(allData.words, deferredQuery) : NO_WORDS),
    [hasQuery, allData, deferredQuery],
  );
  const grammarResults = useMemo(
    () => (hasQuery && allData ? searchGrammar(allData.grammar, deferredQuery) : NO_GRAMMAR),
    [hasQuery, allData, deferredQuery],
  );

  const saved = useMemo<SavedItem[]>(
    () =>
      allData
        ? [
            ...allData.words
              .filter((word) => bookmarks.has(word.id))
              .map((item) => ({ kind: 'word', item }) as const),
            ...allData.grammar
              .filter((point) => bookmarks.has(point.id))
              .map((item) => ({ kind: 'grammar', item }) as const),
          ]
        : [],
    [bookmarks, allData],
  );

  const grammar = levelData?.grammar ?? NO_GRAMMAR;
  const allLoading = allData === null;

  const subtitle = (() => {
    if (searching && allLoading) return '載入全部等級…';
    if (mode === 'saved' && allLoading) return '載入中…';
    if (loading && mode !== 'saved' && !searching) return '載入中…';
    if (searching) {
      const count = mode === 'list' ? wordResults.length : grammarResults.length;
      return `全部等級・找到 ${count} 個`;
    }
    if (mode === 'saved') return `${saved.length} 個收藏`;
    if (mode === 'grammar') return `${grammar.length} 個文法`;
    return `${words.length} 個`;
  })();

  const title = {
    list: '單字',
    flashcard: '單字',
    autoplay: '單字',
    grammar: '文法',
    saved: '收藏',
  }[mode];

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
      {/* 標題（含等級）、模式和搜尋固定在上方 */}
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
            <View style={styles.titleSide}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
                {subtitle}
              </ThemedText>
              <LevelPicker />
            </View>
          </View>
          <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={setMode} />
          {(mode === 'list' || mode === 'grammar') && (
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder={mode === 'list' ? '搜尋單字：日文、假名或中文' : '搜尋文法：句型或中文'}
            />
          )}
        </View>
      </View>

      {/* 打開過的模式切走時只是隱藏，切回來還在原本的頁數、單字卡進度 */}
      <KeepAlive active={mode === 'list'} style={styles.fill}>
        {hasQuery ? (
          <PagedList
            items={wordResults}
            pageSize={PAGE_SIZE}
            keyExtractor={(item) => item.id}
            renderItem={(item) => <VocabCard item={item} showLevel />}
            resetKey={`search-${deferredQuery}`}
            emptyText={allLoading ? '載入全部等級的單字…' : '找不到符合的單字'}
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
            emptyText={loading ? '載入中…' : '這個分類沒有單字'}
            contentContainerStyle={listStyle}
          />
        )}
      </KeepAlive>
      <KeepAlive active={mode === 'grammar'} style={styles.fill}>
        <PagedList
          items={hasQuery ? grammarResults : grammar}
          pageSize={GRAMMAR_PAGE_SIZE}
          keyExtractor={(item) => item.id}
          renderItem={(item) => <GrammarCard item={item} showLevel={hasQuery} />}
          resetKey={hasQuery ? `search-${deferredQuery}` : `grammar-${level}`}
          emptyText={(hasQuery ? allLoading : loading) ? '載入中…' : '找不到符合的文法'}
          contentContainerStyle={listStyle}
        />
      </KeepAlive>
      <KeepAlive active={mode === 'saved'} style={styles.fill}>
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
          emptyText={allLoading ? '載入中…' : '還沒有收藏。在單字或文法卡片上點 ☆ 就能加入這裡。'}
          contentContainerStyle={listStyle}
        />
      </KeepAlive>
      <KeepAlive active={mode === 'autoplay'} style={styles.fill}>
        <ScrollView contentContainerStyle={listStyle}>
          <View style={styles.posFilter}>{posFilter}</View>
          {loading ? <LoadingNote /> : <AutoPlayer words={words} />}
        </ScrollView>
      </KeepAlive>
      <KeepAlive active={mode === 'flashcard'} style={styles.fill}>
        <ScrollView contentContainerStyle={listStyle}>
          <View style={styles.posFilter}>{posFilter}</View>
          {loading ? (
            <LoadingNote />
          ) : (
            <FlashcardDeck level={level} words={words} sessionKey={`${level}-${pos}`} />
          )}
        </ScrollView>
      </KeepAlive>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  fill: {
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
