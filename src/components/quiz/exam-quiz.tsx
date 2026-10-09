import { StyleSheet, View } from 'react-native';

import { AnswerOption } from './answer-option';
import { ExamSentence } from './exam-sentence';
import { QuizProgress } from './quiz-progress';
import { QuizResult } from './quiz-result';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { EXAM_BY_LEVEL, EXAM_TYPE_LABELS, EXAM_TYPE_PROMPTS } from '@/data/exam';
import type { JlptLevel } from '@/data/vocab';
import { useQuizRound } from '@/hooks/use-quiz-round';
import { useTheme } from '@/hooks/use-theme';
import { buildExamRound } from '@/lib/quiz';

type ExamQuizProps = {
  level: JlptLevel;
  /** 作答後呼叫，讓外層把畫面捲到解說和「下一題」 */
  onAnswered?: () => void;
  /** 換下一題時呼叫，讓外層捲回最上面 */
  onNext?: () => void;
};

/** 模擬試題：依 JLPT 題型自編的原創題，作答後顯示解說 */
export function ExamQuiz({ level, onAnswered, onNext }: ExamQuizProps) {
  const theme = useTheme();
  const quiz = useQuizRound(() => buildExamRound(EXAM_BY_LEVEL[level]), (q) => q.answer, [level]);

  if (!quiz.ready) return null;

  if (quiz.finished || !quiz.current) {
    return (
      <QuizResult level={level} score={quiz.score} total={quiz.total} onRetry={quiz.restart} />
    );
  }

  const { question, options } = quiz.current;

  return (
    <View style={styles.container}>
      <QuizProgress
        label={EXAM_TYPE_LABELS[question.type]}
        index={quiz.index}
        total={quiz.total}
        score={quiz.score}
      />
      <ThemedText type="smallBold" themeColor="textSecondary">
        {EXAM_TYPE_PROMPTS[question.type]}
      </ThemedText>
      <ExamSentence sentence={question.sentence} />
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
        <>
          <View
            style={[
              styles.explanation,
              { backgroundColor: theme.backgroundSelected, borderColor: theme.gold },
            ]}>
            <ThemedText type="smallBold" style={{ color: theme.gold }}>
              推理解說
            </ThemedText>
            <ThemedText type="small">{question.explanation}</ThemedText>
          </View>
          <PrimaryButton
            label={quiz.index + 1 < quiz.total ? '下一題' : '查看調查報告'}
            onPress={() => {
              quiz.next();
              onNext?.();
            }}
          />
        </>
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
  options: {
    gap: Spacing.two,
  },
  explanation: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
  },
});
