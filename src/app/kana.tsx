import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { KanaDetailCard } from '@/components/kana/kana-detail-card';
import { KanaGrid } from '@/components/kana/kana-grid';
import { ThemedText } from '@/components/themed-text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { KANA_SECTIONS, type Kana, type KanaScript } from '@/data/kana';
import { useTheme } from '@/hooks/use-theme';

const SCRIPT_OPTIONS: { value: KanaScript; label: string }[] = [
  { value: 'hiragana', label: '平假名' },
  { value: 'katakana', label: '片假名' },
];

export default function KanaScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [script, setScript] = useState<KanaScript>('hiragana');
  const [selected, setSelected] = useState<Kana | null>(null);

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      {/* 標題、切換和詳細卡片固定在上方，捲動時不會消失 */}
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
          <ThemedText type="subtitle" style={styles.title}>
            五十音
          </ThemedText>
          <SegmentedControl options={SCRIPT_OPTIONS} value={script} onChange={setScript} />
          <KanaDetailCard kana={selected} script={script} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
          },
        ]}>
        <View style={[styles.inner, styles.sections]}>
          {KANA_SECTIONS.map((section) => (
            <KanaGrid
              key={section.id}
              section={section}
              script={script}
              selected={selected}
              onSelect={setSelected}
            />
          ))}
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
  title: {
    letterSpacing: 4,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.four,
  },
  sections: {
    gap: Spacing.five,
  },
});
