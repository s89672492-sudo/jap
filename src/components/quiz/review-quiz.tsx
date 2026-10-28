import { StyleSheet, View } from 'react-native';

import { ExamQuestionView } from './exam-question-view';
import { NextButton } from './next-button';
import { QuizProgress } from './quiz-progress';
import { QuizResult } from './quiz-result';
import { VocabQuestionView } from './vocab-question-view';

import { DetectiveEmblem } from '@/components/detective/detective-emblem';
import { LoadingNote } from '@/components/ui/loading-note';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAllLevelData, type LevelData } from '@/data/level-data';
import { EXAM_BY_LEVEL, EXAM_TYPE_LABELS, type ExamQuestion } from '@/data/exam';
import { type JlptLevel } from '@/data/vocab';
import { useQuizRound } from '@/hooks/use-quiz-round';
import { useFuriganaLoaded } from '@/lib/furigana';
import { getGeneratedQuestion, parseGeneratedId } from '@/lib/generated-exam';
import {
  buildExamRound,
  buildRound,
  shuffle,
  type ExamRoundQuestion,
  type QuizQuestion,
} from '@/lib/quiz';
import { useMistakes, useMistakesLoaded } from '@/stores/mistakes-store';
import { useSettings } from '@/stores/settings-store';
import { getStudyCards, recordStudy } from '@/stores/study-store';

type ReviewItem =
  | { kind: 'vocab'; id: string; question: QuizQuestion }
  | { kind: 'exam'; id: string; item: ExamRoundQuestion };

type ReviewQuizProps = {
  level: JlptLevel;
  onAnswered?: () => void;
  onNext?: () => void;
};

/**
 * 錯題本：從這個等級答錯過的單字和試題出題，先出到期該複習的。
 * 答對一次不會馬上移除：要在不同天答對、複習間隔拉長到 7 天以上，才會自動移出錯題本。
 */
export function ReviewQuiz(props: ReviewQuizProps) {
  // 錯題可能包含模擬考自動出的題目，出題要用到全部等級的單字和注音
  const all = useAllLevelData();
  const furiganaReady = useFuriganaLoaded();
  if (!all || !furiganaReady) return <LoadingNote />;
  return <ReviewQuizContent {...props} data={all.byLevel[props.level]} />;
}

function ReviewQuizContent({
  level,
  onAnswered,
  onNext,
  data,
}: ReviewQuizProps & { data: LevelData }) {
  const mistakes = useMistakes();
  const { roundSize } = useSettings();
  const loaded = useMistakesLoaded();

  const words = data.words;
  const missedWords = words.filter((w) => mistakes.has(w.id));
  // 模擬試題的錯題：自編的題目，加上模擬考裡自動出的題目
  const missedExam = [
    ...EXAM_BY_LEVEL[level].filter((q) => mistakes.has(q.id)),
    ...[...mistakes]
      .filter((id) => parseGeneratedId(id)?.level === level)
      .map(getGeneratedQuestion)
      .filter((q): q is ExamQuestion => q !== null),
  ];
  const missedCount = missedWords.length + missedExam.length;

  const quiz = useQuizRound<ReviewItem>(
    () => {
      const vocabItems: ReviewItem[] = buildRound(words, missedWords.length, missedWords).map(
        (question) => ({ kind: 'vocab', id: question.word.id, question }),
      );
      const examItems: ReviewItem[] = buildExamRound(missedExam, missedExam.length).map((item) => ({
        kind: 'exam',
        id: item.question.id,
        item,
      }));
      // 先出到期的（還沒有複習紀錄的錯題也算到期），同樣到期的隨機
      const cards = getStudyCards();
      const dueAt = (r: ReviewItem) => cards[r.id]?.d ?? 0;
      const ordered = shuffle([...vocabItems, ...examItems]).sort((a, b) => dueAt(a) - dueAt(b));
      return shuffle(ordered.slice(0, roundSize));
    },
    (r) => (r.kind === 'vocab' ? r.question.word.meaning : r.item.answer),
    // 錯題要等從手機讀回後才能出題；作答中錯題本變動不會重新出題
    [level, loaded, roundSize],
    // 答對、答錯都記錄；間隔拉長到 7 天以上時會自動移出錯題本
    (r, correct) => recordStudy(r.id, correct),
  );

  // 還沒開始、而且這個等級沒有錯題：顯示空狀態
  if (!quiz.ready && missedCount === 0) {
    return (
      <View style={styles.empty}>
        <DetectiveEmblem />
        <ThemedText style={styles.emptyTitle}>{level} 錯題本是空的</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          在「單字」「試題」「聽力」答錯的題目，以及單字卡選「還不熟」的單字，都會自動記在這裡。要在不同天答對、複習間隔拉長到
          7 天以上，才會從錯題本移除。
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
        label={
          current.kind === 'vocab'
            ? '錯題・單字'
            : `錯題・${EXAM_TYPE_LABELS[current.item.question.type]}`
        }
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
