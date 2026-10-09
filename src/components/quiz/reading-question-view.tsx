import { StyleSheet, View } from 'react-native';

import { AnswerOption, type AnswerState } from './answer-option';

import { ThemedText } from '@/components/themed-text';
import { SpeakButton } from '@/components/ui/speak-button';
import { ExampleSentence } from '@/components/vocab/example-sentence';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ReadingQuestion } from '@/lib/quiz';

type ReadingQuestionViewProps = {
  question: ReadingQuestion;
  picked: string | null;
  getState: (option: string) => AnswerState;
  onPick: (option: string) => void;
};

/** 一題讀音題：看漢字選讀音。發音按鈕會洩漏答案，所以作答後才出現 */
export function ReadingQuestionView({ question, picked, getState, onPick }: ReadingQuestionViewProps) {
  const theme = useTheme();
  const { word } = question;

  return (
    <>
      <ThemedText type="smallBold" themeColor="textSecondary">
        這個單字怎麼唸？
      </ThemedText>
      <View
        style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <ThemedText style={styles.word} adjustsFontSizeToFit numberOfLines={1}>
          {word.word}
        </ThemedText>
        {picked !== null && (
          <View style={styles.reveal}>
            <ThemedText type="smallBold" style={{ color: theme.accent }}>
              {word.meaning}
            </ThemedText>
            <SpeakButton text={word.reading} size="large" />
          </View>
        )}
      </View>
      <View style={styles.options}>
        {question.options.map((option) => (
          <AnswerOption
            key={option}
            label={option}
            state={getState(option)}
            disabled={picked !== null}
            onPress={() => onPick(option)}
          />
        ))}
      </View>
      {picked !== null && <ExampleSentence word={word} />}
    </>
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
  word: {
    fontSize: 44,
    lineHeight: 56,
    fontWeight: 700,
  },
  reveal: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  options: {
    gap: Spacing.two,
  },
});
