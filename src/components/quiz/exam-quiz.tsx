import { StyleSheet, View } from 'react-native';

import { ExamQuestionView } from './exam-question-view';
import { NextButton } from './next-button';
import { QuizProgress } from './quiz-progress';
import { QuizResult } from './quiz-result';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { EXAM_BY_LEVEL, EXAM_TYPE_LABELS } from '@/data/exam';
import type { JlptLevel } from '@/data/vocab';
import { useQuizRound } from '@/hooks/use-quiz-round';
import { buildExamRound } from '@/lib/quiz';
import { addMistake } from '@/stores/mistakes-store';

type ExamQuizProps = {
  level: JlptLevel;
  /** 作答後呼叫，讓外層把畫面捲到解說和「下一題」 */
  onAnswered?: () => void;
  /** 換下一題時呼叫，讓外層捲回最上面 */
  onNext?: () => void;
};

/** 模擬試題：依 JLPT 題型自編的原創題；答錯的題目會加入錯題本 */
export function ExamQuiz({ level, onAnswered, onNext }: ExamQuizProps) {
  const quiz = useQuizRound(
    () => buildExamRound(EXAM_BY_LEVEL[level]),
    (q) => q.answer,
    [level],
    (q, correct) => {
      if (!correct) addMistake(q.question.id);
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
      <QuizProgress
        label={EXAM_TYPE_LABELS[quiz.current.question.type]}
        index={quiz.index}
        total={quiz.total}
        score={quiz.score}
      />
      <ExamQuestionView
        item={quiz.current}
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
      <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
        本題為依 JLPT 題型自編的原創模擬題，非官方歷屆試題。
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
  },
});
