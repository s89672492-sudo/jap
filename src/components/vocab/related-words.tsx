import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { VocabWord, WordRelation } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';

const KIND_LABEL: Record<WordRelation['kind'], string> = {
  antonym: '反義',
  synonym: '近義',
};

/**
 * 單字的反義詞、近義詞：一種一行，標籤後面列出單字（讀音）和中文意思。
 * 反義用強調色、近義用金色，和文字一起標出種類，不只靠顏色區分。
 */
export function RelatedWords({ word, center = false }: { word: VocabWord; center?: boolean }) {
  const theme = useTheme();
  if (!word.related?.length) return null;
  const groups = (['antonym', 'synonym'] as const)
    .map((kind) => ({ kind, items: word.related!.filter((r) => r.kind === kind) }))
    .filter((g) => g.items.length > 0);

  return (
    <View style={[styles.container, center && styles.center]}>
      {groups.map(({ kind, items }) => (
        <View key={kind} style={[styles.row, center && styles.rowCenter]}>
          <View
            style={[styles.label, { borderColor: kind === 'antonym' ? theme.accent : theme.gold }]}>
            <ThemedText type="smallBold" style={styles.labelText}>
              {KIND_LABEL[kind]}
            </ThemedText>
          </View>
          <View style={styles.items}>
            {items.map((r) => (
              <ThemedText key={r.id} type="small">
                {r.word}
                {r.reading !== r.word ? `（${r.reading}）` : ''} {r.meaning}
              </ThemedText>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  center: {
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  rowCenter: {
    justifyContent: 'center',
  },
  label: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.one + 2,
  },
  labelText: {
    fontSize: 11,
    lineHeight: 18,
  },
  items: {
    flexShrink: 1,
  },
});
