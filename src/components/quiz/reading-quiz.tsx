import { StyleSheet, View } from 'react-native';

import { NextButton } from './next-button';
import { QuizProgress } from './quiz-progress';
import { QuizResult } from './quiz-result';
import { ReadingQuestionView } from './reading-question-view';

import { Spacing } from '@/constants/theme';
import { VOCAB_BY_LEVEL, type JlptLevel } from '@/data/vocab';
import { useQuizRound } from '@/hooks/use-quiz-round';
import { buildReadingRound } from '@/lib/quiz';
import { addMistake } from '@/stores/mistakes-store';
import { useSettings } from '@/stores/settings-store';

type ReadingQuizProps = {
  level: JlptLevel;
  /** 作答後呼叫，讓外層把畫面捲到「下一題」 */
  onAnswered?: () => void;
  /** 換下一題時呼叫，讓外層捲回最上面 */
  onNext?: () => void;
};

/** 漢字讀音測驗：看漢字選讀音；答錯的單字會加入錯題本 */
export function ReadingQuiz({ level, onAnswered, onNext }: ReadingQuizProps) {
  const { roundSize } = useSettings();
  const quiz = useQuizRound(
    () => buildReadingRound(VOCAB_BY_LEVEL[level], roundSize),
    (q) => q.word.reading,
    [level, roundSize],
    (q, correct) => {
      if (!correct) addMistake(q.word.id);
    },
  );

  if (!quiz.ready) return null;

  if (quiz.finished || !quiz.current) {
    return (
      <QuizResult level={level} score={quiz.score} total={quiz.total} onRetry={quiz.restart} />
    );
  }

  return (
    <View style={styles.container}>
      <QuizProgress label="讀音" index={quiz.index} total={quiz.total} score={quiz.score} />
      <ReadingQuestionView
        question={quiz.current}
        picked={quiz.picked}
        getState={quiz.getState}
        onPick={(option) => {
          quiz.pick(option);
          onAnswered?.();
        }}
      />
      {quiz.picked !== null && (
        <NextButton
          isLast={quiz.index + 1 >= quiz.total}
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
});
