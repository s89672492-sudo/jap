import { StyleSheet, View } from 'react-native';

import { AnswerOption } from './answer-option';
import { QuestionCard } from './question-card';
import { QuizProgress } from './quiz-progress';
import { QuizResult } from './quiz-result';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { VOCAB_BY_LEVEL, type JlptLevel } from '@/data/vocab';
import { useQuizRound } from '@/hooks/use-quiz-round';
import { buildRound } from '@/lib/quiz';

type VocabQuizProps = {
  level: JlptLevel;
  /** 作答後呼叫，讓外層把畫面捲到解說和「下一題」 */
  onAnswered?: () => void;
  /** 換下一題時呼叫，讓外層捲回最上面 */
  onNext?: () => void;
};

/** 單字測驗：看日文單字，選中文意思 */
export function VocabQuiz({ level, onAnswered, onNext }: VocabQuizProps) {
  const quiz = useQuizRound(
    () => buildRound(VOCAB_BY_LEVEL[level]),
    (q) => q.word.meaning,
    [level],
  );

  if (!quiz.ready) return null;

  if (quiz.finished || !quiz.current) {
    return (
      <QuizResult level={level} score={quiz.score} total={quiz.total} onRetry={quiz.restart} />
    );
  }

  const { word, options } = quiz.current;

  return (
    <View style={styles.container}>
      <QuizProgress label="單字" index={quiz.index} total={quiz.total} score={quiz.score} />
      <ThemedText type="smallBold" themeColor="textSecondary">
        這個單字是什麼意思？
      </ThemedText>
      <QuestionCard word={word} revealReading={quiz.picked !== null} />
      <View style={styles.options}>
        {options.map((option) => (
          <AnswerOption
            key={option}
            label={option}
            state={quiz.getState(option)}
            disabled={quiz.picked !== null}
            onPress={() => {
              quiz.pick(option);
              onAnswered?.();
            }}
          />
        ))}
      </View>
      {quiz.picked !== null && (
        <PrimaryButton
          label={quiz.index + 1 < quiz.total ? '下一題' : '查看調查報告'}
          onPress={() => {
            quiz.next();
            onNext?.();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  options: {
    gap: Spacing.two,
  },
});
