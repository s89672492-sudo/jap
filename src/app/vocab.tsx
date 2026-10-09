import { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { ThemedText } from '@/components/themed-text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { FlashcardDeck } from '@/components/vocab/flashcard-deck';
import { VocabCard } from '@/components/vocab/vocab-card';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { JLPT_LEVELS, VOCAB_BY_LEVEL } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { setJlptLevel, useJlptLevel } from '@/stores/jlpt-level-store';

const LEVEL_OPTIONS = JLPT_LEVELS.map((level) => ({ value: level, label: level }));

type VocabMode = 'list' | 'flashcard';

const MODE_OPTIONS: { value: VocabMode; label: string }[] = [
  { value: 'list', label: '列表' },
  { value: 'flashcard', label: '單字卡' },
];

export default function VocabScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const level = useJlptLevel();
  const words = VOCAB_BY_LEVEL[level];
  const [mode, setMode] = useState<VocabMode>('list');

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
              單字
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {level}・{words.length} 個
            </ThemedText>
          </View>
          <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={setMode} />
          <SegmentedControl options={LEVEL_OPTIONS} value={level} onChange={setJlptLevel} />
        </View>
      </View>

      {mode === 'list' ? (
        <FlatList
          // 切換等級時從頂端重新開始
          key={level}
          data={words}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <VocabCard item={item} />}
          contentContainerStyle={[styles.list, contentPadding]}
          ItemSeparatorComponent={Separator}
        />
      ) : (
        <ScrollView contentContainerStyle={[styles.list, contentPadding]}>
          <FlashcardDeck level={level} />
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
  separator: {
    height: Spacing.two,
  },
});
