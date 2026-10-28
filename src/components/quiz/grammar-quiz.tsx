import { StyleSheet, View } from 'react-native';

import { GrammarQuestionView } from './grammar-question-view';
import { NextButton } from './next-button';
import { QuizProgress } from './quiz-progress';
import { QuizResult } from './quiz-result';

import { LoadingNote } from '@/components/ui/loading-note';
import { Spacing } from '@/constants/theme';
import { useLevelData, type LevelData } from '@/data/level-data';
import type { JlptLevel } from '@/data/vocab';
import { useQuizRound } from '@/hooks/use-quiz-round';
import { buildGrammarRound } from '@/lib/quiz';
import { pickForStudy } from '@/lib/study-order';
import { useSettings } from '@/stores/settings-store';
import { getStudyCards, recordStudy } from '@/stores/study-store';

type GrammarQuizProps = {
  level: JlptLevel;
  /** 作答後呼叫，讓外層把畫面捲到「下一題」 */
  onAnswered?: () => void;
  /** 換下一題時呼叫，讓外層捲回最上面 */
  onNext?: () => void;
};

/** 文法測驗：例句挖空，選出正確的文法部分 */
/** 這個等級的資料載入後才開始 */
export function GrammarQuiz(props: GrammarQuizProps) {
  const data = useLevelData(props.level);
  if (!data) return <LoadingNote />;
  return <GrammarQuizContent {...props} data={data} />;
}

function GrammarQuizContent({
  level,
  onAnswered,
  onNext,
  data,
}: GrammarQuizProps & { data: LevelData }) {
  const { roundSize } = useSettings();
  const quiz = useQuizRound(
    () =>
      buildGrammarRound(
        pickForStudy(data.grammar, roundSize, getStudyCards(), new Set()),
        roundSize,
      ),
    (q) => q.answer,
    [level, roundSize],
    (q, correct) => recordStudy(q.point.id, correct),
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
