import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ExamQuestionView } from './exam-question-view';
import { NextButton } from './next-button';
import { QuizProgress } from './quiz-progress';
import { QuizResult } from './quiz-result';

import { ThemedText } from '@/components/themed-text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import {
  EXAM_BY_LEVEL,
  EXAM_SECTION_TYPES,
  EXAM_TYPE_LABELS,
  type ExamSection,
} from '@/data/exam';
import type { JlptLevel } from '@/data/vocab';
import { useQuizRound } from '@/hooks/use-quiz-round';
import { buildExamRound } from '@/lib/quiz';
import { addMistake } from '@/stores/mistakes-store';
import { useSettings } from '@/stores/settings-store';

const SECTION_OPTIONS: { value: ExamSection; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'vocabulary', label: '語彙' },
  { value: 'grammar', label: '文法' },
  { value: 'reading', label: '讀解' },
  { value: 'listening', label: '聽解' },
];

type ExamQuizProps = {
  level: JlptLevel;
  /** 作答後呼叫，讓外層把畫面捲到解說和「下一題」 */
  onAnswered?: () => void;
  /** 換下一題時呼叫，讓外層捲回最上面 */
  onNext?: () => void;
};

/** 模擬試題：依 JLPT 題型自編的原創題；答錯的題目會加入錯題本 */
export function ExamQuiz({ level, onAnswered, onNext }: ExamQuizProps) {
  const { roundSize } = useSettings();
  // 像 JLPT 分科一樣，只練某一種題型
  const [section, setSection] = useState<ExamSection>('all');
  const quiz = useQuizRound(
    () => {
      const questions = EXAM_BY_LEVEL[level];
      const pool =
        section === 'all'
          ? questions
          : questions.filter((q) => EXAM_SECTION_TYPES[section].includes(q.type));
      return buildExamRound(pool, roundSize);
    },
    (q) => q.answer,
    [level, roundSize, section],
    (q, correct) => {
      if (!correct) addMistake(q.question.id);
    },
  );

  const sectionPicker = (
    <SegmentedControl options={SECTION_OPTIONS} value={section} onChange={setSection} />
  );

  if (!quiz.ready) return sectionPicker;

  if (quiz.finished || !quiz.current) {
    return (
      <View style={styles.container}>
        {sectionPicker}
        <QuizResult level={level} score={quiz.score} total={quiz.total} onRetry={quiz.restart} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {sectionPicker}
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
