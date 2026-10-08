import { StyleSheet, View } from 'react-native';

import { KanaCell } from './kana-cell';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Kana, KanaScript, KanaSection } from '@/data/kana';
import { useTheme } from '@/hooks/use-theme';

type KanaGridProps = {
  section: KanaSection;
  script: KanaScript;
  selected: Kana | null;
  onSelect: (kana: Kana) => void;
};

/** 一個區塊（清音或濁音）的五十音格線，每行固定五格 */
export function KanaGrid({ section, script, selected, onSelect }: KanaGridProps) {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: theme.accent }]} />
        <ThemedText type="smallBold" style={styles.title}>
          {section.title}
        </ThemedText>
      </View>
      {section.rows.map((row) => (
        <View key={row.label} style={styles.row}>
          {row.cells.map((kana, index) => (
            <KanaCell
              key={kana ? kana.hiragana : `${row.label}-empty-${index}`}
              kana={kana}
              script={script}
              selected={kana !== null && kana.hiragana === selected?.hiragana}
              onPress={onSelect}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    letterSpacing: 2,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
});
