import { StyleSheet, View } from 'react-native';

import { NextButton } from './next-button';
import { QuizProgress } from './quiz-progress';
import { QuizResult } from './quiz-result';
import { VocabQuestionView } from './vocab-question-view';

import { Spacing } from '@/constants/theme';
import { VOCAB_BY_LEVEL, type JlptLevel } from '@/data/vocab';
import { useQuizRound } from '@/hooks/use-quiz-round';
import { buildRound } from '@/lib/quiz';
import { pickForStudy } from '@/lib/study-order';
import { addMistake, getMistakes } from '@/stores/mistakes-store';
import { useSettings } from '@/stores/settings-store';
import { getStudyCards, recordStudy } from '@/stores/study-store';

type VocabQuizProps = {
  level: JlptLevel;
  /** 作答後呼叫，讓外層把畫面捲到「下一題」 */
  onAnswered?: () => void;
  /** 換下一題時呼叫，讓外層捲回最上面 */
  onNext?: () => void;
};

/** 單字測驗：看日文單字，選中文意思；答錯的單字會加入錯題本 */
export function VocabQuiz({ level, onAnswered, onNext }: VocabQuizProps) {
  const { roundSize } = useSettings();
  const quiz = useQuizRound(
    () => {
      const words = VOCAB_BY_LEVEL[level];
      // 優先出該複習、常答錯的單字，再補新單字
      return buildRound(
        words,
        roundSize,
        pickForStudy(words, roundSize, getStudyCards(), getMistakes()),
      );
    },
    (q) => q.word.meaning,
    [level, roundSize],
    (q, correct) => {
      recordStudy(q.word.id, correct);
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
      <QuizProgress label="單字" index={quiz.index} total={quiz.total} score={quiz.score} />
      <VocabQuestionView
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
