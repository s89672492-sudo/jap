import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ExamQuiz } from '@/components/quiz/exam-quiz';
import { ReviewQuiz } from '@/components/quiz/review-quiz';
import { VocabQuiz } from '@/components/quiz/vocab-quiz';
import { ThemedText } from '@/components/themed-text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { JLPT_LEVELS } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { setJlptLevel, useJlptLevel } from '@/stores/jlpt-level-store';

type QuizMode = 'vocab' | 'exam' | 'review';

const MODE_OPTIONS: { value: QuizMode; label: string }[] = [
  { value: 'vocab', label: '單字測驗' },
  { value: 'exam', label: '模擬試題' },
  { value: 'review', label: '錯題本' },
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

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
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
          <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={setMode} />
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
          {mode === 'exam' && (
            <ExamQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
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
