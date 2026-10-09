import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { ExamQuiz } from '@/components/quiz/exam-quiz';
import { GrammarQuiz } from '@/components/quiz/grammar-quiz';
import { ListeningQuiz } from '@/components/quiz/listening-quiz';
import { ReadingQuiz } from '@/components/quiz/reading-quiz';
import { ReviewQuiz } from '@/components/quiz/review-quiz';
import { TimedChallenge } from '@/components/quiz/timed-challenge';
import { VocabQuiz } from '@/components/quiz/vocab-quiz';
import { ThemedText } from '@/components/themed-text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { JLPT_LEVELS } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { setJlptLevel, useJlptLevel } from '@/stores/jlpt-level-store';

type QuizMode = 'vocab' | 'reading' | 'grammar' | 'listening' | 'exam' | 'timed' | 'review';

// 模式太多，小螢幕一排放不下，所以分兩排；兩排合起來只會有一個被選取
const MODE_ROWS: { value: QuizMode; label: string }[][] = [
  [
    { value: 'vocab', label: '單字' },
    { value: 'reading', label: '讀音' },
    { value: 'grammar', label: '文法' },
    { value: 'listening', label: '聽力' },
  ],
  [
    { value: 'exam', label: '試題' },
    { value: 'timed', label: '限時' },
    { value: 'review', label: '錯題' },
  ],
];

const LEVEL_OPTIONS = JLPT_LEVELS.map((level) => ({ value: level, label: level }));

export default function QuizScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const level = useJlptLevel();
  const [mode, setMode] = useState<QuizMode>('vocab');
  const scrollRef = useRef<ScrollView>(null);

  // 等新內容排版完成後再捲動
  const scrollToEnd = () =>
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: false });

  const changeMode = (next: QuizMode) => {
    setMode(next);
    scrollToTop();
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppBackground />
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.three,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
            borderBottomColor: theme.border,
          },
        ]}>
        <View style={styles.inner}>
          <ThemedText type="subtitle" style={styles.title}>
            推理測驗
          </ThemedText>
          {/* 切換模式或等級都會重新開始一輪 */}
          {MODE_ROWS.map((options, row) => (
            <SegmentedControl key={row} options={options} value={mode} onChange={changeMode} />
          ))}
          <SegmentedControl options={LEVEL_OPTIONS} value={level} onChange={setJlptLevel} />
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
          },
        ]}>
        <View style={styles.inner}>
          {mode === 'vocab' && (
            <VocabQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          )}
          {mode === 'reading' && (
            <ReadingQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          )}
          {mode === 'grammar' && (
            <GrammarQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          )}
          {mode === 'timed' && <TimedChallenge level={level} onStart={scrollToTop} />}
          {mode === 'exam' && (
            <ExamQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          )}
          {mode === 'listening' && (
            <ListeningQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          )}
          {mode === 'review' && (
            <ReviewQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingBottom: Spacing.three,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.two,
  },
  title: {
    letterSpacing: 4,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.three,
  },
});
