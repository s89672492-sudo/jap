import { StyleSheet, View } from 'react-native';

import { AnswerOption, type AnswerState } from './answer-option';
import { QuestionCard } from './question-card';

import { ThemedText } from '@/components/themed-text';
import { ExampleSentence } from '@/components/vocab/example-sentence';
import { Spacing } from '@/constants/theme';
import type { QuizQuestion } from '@/lib/quiz';

type VocabQuestionViewProps = {
  question: QuizQuestion;
  picked: string | null;
  getState: (option: string) => AnswerState;
  onPick: (option: string) => void;
};

/** 一題單字題：看日文選中文 */
export function VocabQuestionView({ question, picked, getState, onPick }: VocabQuestionViewProps) {
  return (
    <>
      <ThemedText type="smallBold" themeColor="textSecondary">
        這個單字是什麼意思？
      </ThemedText>
      <QuestionCard word={question.word} revealReading={picked !== null} />
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
      {picked !== null && <ExampleSentence word={question.word} />}
    </>
  );
}

const styles = StyleSheet.create({
  options: {
    gap: Spacing.two,
  },
});
