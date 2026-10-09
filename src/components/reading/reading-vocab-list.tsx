import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SpeakButton } from '@/components/ui/speak-button';
import { Spacing } from '@/constants/theme';
import type { ReadingVocab } from '@/data/reading/types';
import { useTheme } from '@/hooks/use-theme';

type ReadingVocabListProps = {
  vocab: ReadingVocab[];
};

/** 文章的重點單字：日文、讀音、中文，可點喇叭聽發音 */
export function ReadingVocabList({ vocab }: ReadingVocabListProps) {
  const theme = useTheme();

  return (
    <View style={styles.list}>
      {vocab.map((item) => (
        <View key={item.word} style={[styles.row, { borderBottomColor: theme.border }]}>
          <View style={styles.text}>
            <ThemedText style={styles.word}>
              {item.word}
              {item.reading !== item.word && (
                <ThemedText type="small" themeColor="textSecondary">
                  {'  '}
                  {item.reading}
                </ThemedText>
              )}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.accent }}>
              {item.meaning}
            </ThemedText>
          </View>
          <SpeakButton text={item.reading} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    flex: 1,
  },
  word: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 700,
  },
});
