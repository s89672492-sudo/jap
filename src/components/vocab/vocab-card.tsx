import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SpeakButton } from '@/components/ui/speak-button';
import { ExampleSentence } from '@/components/vocab/example-sentence';
import { Spacing } from '@/constants/theme';
import { PART_OF_SPEECH_LABELS, type VocabWord } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';

type VocabCardProps = {
  item: VocabWord;
};

/** 單字卡：漢字、讀音、中文意思和發音按鈕，下方是例句 */
export const VocabCard = memo(function VocabCard({ item }: VocabCardProps) {
  const theme = useTheme();
  // 單字本身就是假名時，不重複顯示讀音
  const showReading = item.reading !== item.word;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
      <View style={[styles.stripe, { backgroundColor: theme.accent }]} />
      <View style={styles.body}>
        <View style={styles.wordRow}>
          <View style={styles.text}>
            <View style={styles.metaRow}>
              {showReading && (
                <ThemedText type="small" themeColor="textSecondary">
                  {item.reading}
                </ThemedText>
              )}
              <View style={[styles.posTag, { borderColor: theme.border }]}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.posText}>
                  {PART_OF_SPEECH_LABELS[item.pos]}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={styles.word}>{item.word}</ThemedText>
            <ThemedText type="small" style={{ color: theme.accent }}>
              {item.meaning}
            </ThemedText>
          </View>
          <SpeakButton text={item.reading} />
        </View>
        <ExampleSentence word={item} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  stripe: {
    width: 6,
  },
  body: {
    flex: 1,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  posTag: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.one + 2,
  },
  posText: {
    fontSize: 11,
    lineHeight: 16,
  },
  word: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: 700,
  },
});
