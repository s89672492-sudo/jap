import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ExamQuestionView } from './exam-question-view';
import { MockExam } from './mock-exam';
import { NextButton } from './next-button';
import { QuizProgress } from './quiz-progress';
import { QuizResult } from './quiz-result';

import { ThemedText } from '@/components/themed-text';
import { ChipButton } from '@/components/ui/chip-button';
import { KeepAlive } from '@/components/ui/keep-alive';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import {
  EXAM_BY_LEVEL,
  EXAM_SECTION_TYPES,
  EXAM_SUBCATEGORY_LABELS,
  EXAM_TYPE_LABELS,
  type ExamSection,
  type ExamSubcategory,
} from '@/data/exam';
import type { JlptLevel } from '@/data/vocab';
import { useDepsChanged } from '@/hooks/use-hydrated';
import { useQuizRound } from '@/hooks/use-quiz-round';
import { useTheme } from '@/hooks/use-theme';
import { buildExamRound } from '@/lib/quiz';
import { addMistake } from '@/stores/mistakes-store';
import { useSettings } from '@/stores/settings-store';
import { recordStudy } from '@/stores/study-store';

const SECTION_OPTIONS: { value: ExamSection; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'vocabulary', label: '語彙' },
  { value: 'grammar', label: '文法' },
  { value: 'reading', label: '讀解' },
  { value: 'listening', label: '聽解' },
];

type ExamMode = 'practice' | 'mock';

const EXAM_MODE_OPTIONS: { value: ExamMode; label: string }[] = [
  { value: 'practice', label: '題型練習' },
  { value: 'mock', label: '完整模擬考' },
];

type ExamQuizProps = {
  level: JlptLevel;
  /** 作答後呼叫，讓外層把畫面捲到解說和「下一題」 */
  onAnswered?: () => void;
  /** 換下一題時呼叫，讓外層捲回最上面 */
  onNext?: () => void;
  /** 模擬考進行中：只顯示模擬考，不能切到題型練習（練習會看到解說） */
  locked?: boolean;
  /** 只練某一個大問（弱點分析的「開始針對練習」） */
  focus?: string | null;
};

/** 模擬試題：可以分題型練習，或照 JLPT 考科和時間做一次完整模擬考 */
export function ExamQuiz({
  level,
  onAnswered,
  onNext,
  locked = false,
  focus = null,
}: ExamQuizProps) {
  const [chosen, setMode] = useState<ExamMode>('practice');
  const mode = locked ? 'mock' : chosen;
  // 考完時停在模擬考的成績單
  if (useDepsChanged([locked]) && !locked && chosen !== 'mock') setMode('mock');
  // 指定要練某個大問：切到題型練習
  const focusChanged = useDepsChanged([focus]);
  if (focusChanged && focus && !locked && chosen !== 'practice') setMode('practice');
  const modePicker = locked ? null : (
    <SegmentedControl options={EXAM_MODE_OPTIONS} value={mode} onChange={setMode} />
  );

  // 模擬考考到一半切去練習，再切回來還在原本的地方（計時照樣進行）
  return (
    <View style={styles.container}>
      {modePicker}
      <KeepAlive active={mode === 'practice'}>
        <ExamPractice level={level} onAnswered={onAnswered} onNext={onNext} focus={focus} />
      </KeepAlive>
      <KeepAlive active={mode === 'mock'}>
        <MockExam level={level} onScrollTop={onNext} />
      </KeepAlive>
    </View>
  );
}

/** 題型練習：依 JLPT 題型自編的原創題；每題作答後馬上看解說，答錯的題目會加入錯題本 */
function ExamPractice({ level, onAnswered, onNext, focus }: ExamQuizProps) {
  const theme = useTheme();
  const { roundSize } = useSettings();
  // 像 JLPT 分科一樣，只練某一種題型
  const [section, setSection] = useState<ExamSection>('all');
  // 只練某一個大問（例如「言い換え」）；有新的指定時換過去
  const [only, setOnly] = useState<ExamSubcategory | null>(asSubcategory(focus));
  if (useDepsChanged([focus]) && asSubcategory(focus)) setOnly(asSubcategory(focus));
  const quiz = useQuizRound(
    () => {
      const questions = EXAM_BY_LEVEL[level];
      const pool = only
        ? questions.filter((q) => q.subcategory === only)
        : section === 'all'
          ? questions
          : questions.filter((q) => EXAM_SECTION_TYPES[section].includes(q.type));
      return buildExamRound(pool, roundSize);
    },
    (q) => q.answer,
    [level, roundSize, section, only],
    (q, correct) => {
      recordStudy(q.question.id, correct);
      if (!correct) addMistake(q.question.id);
    },
  );

  const sectionPicker = only ? (
    <View
      style={[styles.focus, { backgroundColor: theme.backgroundElement, borderColor: theme.gold }]}>
      <ThemedText type="smallBold" style={styles.flex}>
        針對練習：{EXAM_SUBCATEGORY_LABELS[only]}
      </ThemedText>
      <ChipButton label="✕ 全部題型" onPress={() => setOnly(null)} />
    </View>
  ) : (
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

const asSubcategory = (value: string | null | undefined): ExamSubcategory | null =>
  value && value in EXAM_SUBCATEGORY_LABELS ? (value as ExamSubcategory) : null;

const styles = StyleSheet.create({
  focus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.two,
    paddingLeft: Spacing.three,
  },
  flex: {
    flex: 1,
  },
  container: {
    gap: Spacing.three,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
  },
});
