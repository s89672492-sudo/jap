import { StyleSheet, View } from 'react-native';

import { ExamQuestionView } from './exam-question-view';
import { NextButton } from './next-button';
import { QuizProgress } from './quiz-progress';
import { QuizResult } from './quiz-result';
import { VocabQuestionView } from './vocab-question-view';

import { DetectiveEmblem } from '@/components/detective/detective-emblem';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { EXAM_BY_LEVEL, EXAM_TYPE_LABELS } from '@/data/exam';
import { VOCAB_BY_LEVEL, type JlptLevel } from '@/data/vocab';
import { useQuizRound } from '@/hooks/use-quiz-round';
import {
  buildExamRound,
  buildRound,
  shuffle,
  type ExamRoundQuestion,
  type QuizQuestion,
} from '@/lib/quiz';
import { removeMistake, useMistakes, useMistakesLoaded } from '@/stores/mistakes-store';
import { useSettings } from '@/stores/settings-store';

type ReviewItem =
  | { kind: 'vocab'; id: string; question: QuizQuestion }
  | { kind: 'exam'; id: string; item: ExamRoundQuestion };

type ReviewQuizProps = {
  level: JlptLevel;
  onAnswered?: () => void;
  onNext?: () => void;
};

/** 錯題本：從這個等級答錯過的單字和試題出題，答對就從錯題本移除 */
export function ReviewQuiz({ level, onAnswered, onNext }: ReviewQuizProps) {
  const mistakes = useMistakes();
  const { roundSize } = useSettings();
  const loaded = useMistakesLoaded();

  const words = VOCAB_BY_LEVEL[level];
  const missedWords = words.filter((w) => mistakes.has(w.id));
  const missedExam = EXAM_BY_LEVEL[level].filter((q) => mistakes.has(q.id));
  const missedCount = missedWords.length + missedExam.length;

  const quiz = useQuizRound<ReviewItem>(
    () => {
      const vocabItems: ReviewItem[] = buildRound(words, missedWords.length, missedWords).map(
        (question) => ({ kind: 'vocab', id: question.word.id, question }),
      );
      const examItems: ReviewItem[] = buildExamRound(missedExam, missedExam.length).map(
        (item) => ({ kind: 'exam', id: item.question.id, item }),
      );
      return shuffle([...vocabItems, ...examItems]).slice(0, roundSize);
    },
    (r) => (r.kind === 'vocab' ? r.question.word.meaning : r.item.answer),
    // 錯題要等從手機讀回後才能出題；作答中錯題本變動不會重新出題
    [level, loaded, roundSize],
    (r, correct) => {
      if (correct) removeMistake(r.id);
    },
  );

  // 還沒開始、而且這個等級沒有錯題：顯示空狀態
  if (!quiz.ready && missedCount === 0) {
    return (
      <View style={styles.empty}>
        <DetectiveEmblem />
        <ThemedText style={styles.emptyTitle}>{level} 錯題本是空的</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          在「單字」「試題」「聽力」答錯的題目，以及單字卡選「還不熟」的單字，都會自動記在這裡。答對之後就會從錯題本移除。
        </ThemedText>
      </View>
    );
  }

  if (!quiz.ready) return null;

  if (quiz.finished || !quiz.current) {
    return (
      <View style={styles.container}>
        <QuizResult level={level} score={quiz.score} total={quiz.total} onRetry={quiz.restart} />
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          {missedCount > 0 ? `還有 ${missedCount} 題錯題待複習` : '這個等級的錯題都解決了！'}
        </ThemedText>
      </View>
    );
  }

  const current = quiz.current;
  const onPick = (option: string) => {
    quiz.pick(option);
    onAnswered?.();
  };

  return (
    <View style={styles.container}>
      <QuizProgress
        label={current.kind === 'vocab' ? '錯題・單字' : `錯題・${EXAM_TYPE_LABELS[current.item.question.type]}`}
        index={quiz.index}
        total={quiz.total}
        score={quiz.score}
      />
      {current.kind === 'vocab' ? (
        <VocabQuestionView
          question={current.question}
          picked={quiz.picked}
          getState={quiz.getState}
          onPick={onPick}
        />
      ) : (
        <ExamQuestionView
          item={current.item}
          picked={quiz.picked}
          getState={quiz.getState}
          onPick={onPick}
        />
      )}
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
  empty: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.five,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 700,
  },
  center: {
    textAlign: 'center',
  },
});
