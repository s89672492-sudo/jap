import { StyleSheet, View } from 'react-native';

import { GrammarQuestionView } from './grammar-question-view';
import { NextButton } from './next-button';
import { QuizProgress } from './quiz-progress';
import { QuizResult } from './quiz-result';

import { Spacing } from '@/constants/theme';
import { GRAMMAR_BY_LEVEL } from '@/data/grammar';
import type { JlptLevel } from '@/data/vocab';
import { useQuizRound } from '@/hooks/use-quiz-round';
import { buildGrammarRound } from '@/lib/quiz';
import { useSettings } from '@/stores/settings-store';

type GrammarQuizProps = {
  level: JlptLevel;
  /** 作答後呼叫，讓外層把畫面捲到「下一題」 */
  onAnswered?: () => void;
  /** 換下一題時呼叫，讓外層捲回最上面 */
  onNext?: () => void;
};

/** 文法測驗：例句挖空，選出正確的文法部分 */
export function GrammarQuiz({ level, onAnswered, onNext }: GrammarQuizProps) {
  const { roundSize } = useSettings();
  const quiz = useQuizRound(
    () => buildGrammarRound(GRAMMAR_BY_LEVEL[level], roundSize),
    (q) => q.answer,
    [level, roundSize],
  );

  if (!quiz.ready) return null;

  if (quiz.finished || !quiz.current) {
    return (
      <QuizResult level={level} score={quiz.score} total={quiz.total} onRetry={quiz.restart} />
    );
  }

  return (
    <View style={styles.container}>
      <QuizProgress label="文法" index={quiz.index} total={quiz.total} score={quiz.score} />
      <GrammarQuestionView
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
