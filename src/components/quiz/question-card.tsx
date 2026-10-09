import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SpeakButton } from '@/components/ui/speak-button';
import { Spacing } from '@/constants/theme';
import type { VocabWord } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';

type QuestionCardProps = {
  word: VocabWord;
  /** 作答後才顯示讀音，避免直接洩漏答案線索 */
  revealReading: boolean;
};

/** 題目卡：大字顯示日文單字，可點喇叭聽發音 */
export function QuestionCard({ word, revealReading }: QuestionCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.reading}>
        {revealReading && word.reading !== word.word ? word.reading : ' '}
      </ThemedText>
      <ThemedText style={styles.word} adjustsFontSizeToFit numberOfLines={1}>
        {word.word}
      </ThemedText>
      <SpeakButton text={word.reading} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    alignItems: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  reading: {
    fontSize: 16,
  },
  word: {
    fontSize: 44,
    lineHeight: 56,
    fontWeight: 700,
  },
});
