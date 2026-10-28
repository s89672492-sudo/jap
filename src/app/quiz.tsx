import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { ExamQuiz } from '@/components/quiz/exam-quiz';
import { GrammarQuiz } from '@/components/quiz/grammar-quiz';
import { ListeningQuiz } from '@/components/quiz/listening-quiz';
import { QUIZ_MODES, QuizModeMenu, type QuizMode } from '@/components/quiz/quiz-mode-menu';
import { ReadingQuiz } from '@/components/quiz/reading-quiz';
import { ReviewQuiz } from '@/components/quiz/review-quiz';
import { SpeakingPractice } from '@/components/quiz/speaking-practice';
import { TimedChallenge } from '@/components/quiz/timed-challenge';
import { VocabQuiz } from '@/components/quiz/vocab-quiz';
import { ThemedText } from '@/components/themed-text';
import { ChipButton } from '@/components/ui/chip-button';
import { KeepAlive } from '@/components/ui/keep-alive';
import { LevelPicker } from '@/components/ui/level-picker';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useDepsChanged } from '@/hooks/use-hydrated';
import { useTheme } from '@/hooks/use-theme';
import { useJlptLevel } from '@/stores/jlpt-level-store';

export default function QuizScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const level = useJlptLevel();
  // 從首頁「今日任務」進來時（例如 /quiz?mode=review），直接打開那個模式
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const requested = QUIZ_MODES.find((m) => m.value === modeParam)?.value ?? null;
  // null：顯示模式選單；選了模式才開始答題
  const [mode, setMode] = useState<QuizMode | null>(requested);
  const [visited, setVisited] = useState<ReadonlySet<QuizMode>>(
    () => new Set(requested ? [requested] : []),
  );
  const current = QUIZ_MODES.find((m) => m.value === mode);
  const scrollRef = useRef<ScrollView>(null);

  // 等新內容排版完成後再捲動
  const scrollToEnd = () =>
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  const scrollToTop = () => scrollRef.current?.scrollTo({ y: 0, animated: false });

  const changeMode = (next: QuizMode | null) => {
    setMode(next);
    if (next) setVisited((prev) => (prev.has(next) ? prev : new Set([...prev, next])));
    scrollToTop();
  };

  if (useDepsChanged([requested]) && requested) {
    setMode(requested);
    if (!visited.has(requested)) setVisited(new Set([...visited, requested]));
  }
  // 打開後捲到最上面，並清掉網址參數（之後回到這頁不會又自動切換）
  useEffect(() => {
    if (!requested) return;
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    router.setParams({ mode: undefined });
  }, [requested]);

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
          <View style={styles.titleRow}>
            {current ? (
              <View style={styles.titleStart}>
                <ChipButton
                  label="‹ 模式"
                  accessibilityLabel="回到測驗模式選單"
                  onPress={() => changeMode(null)}
                />
                <ThemedText type="subtitle" style={styles.modeTitle} numberOfLines={1}>
                  {current.title}測驗
                </ThemedText>
              </View>
            ) : (
              <ThemedText type="subtitle" style={styles.title}>
                推理測驗
              </ThemedText>
            )}
            {/* 換等級會重新開始一輪 */}
            <LevelPicker />
          </View>
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
          {!mode && (
            <>
              <ThemedText type="small" themeColor="textSecondary">
                選一種練習開始。做到一半回到這裡，進度會保留。
              </ThemedText>
              <QuizModeMenu onPick={changeMode} inProgress={visited} />
            </>
          )}
          {/* 打開過的模式切走時只是隱藏，切回來可以接著作答 */}
          <KeepAlive active={mode === 'vocab'}>
            <VocabQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          </KeepAlive>
          <KeepAlive active={mode === 'reading'}>
            <ReadingQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          </KeepAlive>
          <KeepAlive active={mode === 'grammar'}>
            <GrammarQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          </KeepAlive>
          <KeepAlive active={mode === 'timed'}>
            <TimedChallenge level={level} onStart={scrollToTop} />
          </KeepAlive>
          <KeepAlive active={mode === 'speaking'}>
            <SpeakingPractice level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          </KeepAlive>
          <KeepAlive active={mode === 'exam'}>
            <ExamQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          </KeepAlive>
          <KeepAlive active={mode === 'listening'}>
            <ListeningQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          </KeepAlive>
          <KeepAlive active={mode === 'review'}>
            <ReviewQuiz level={level} onAnswered={scrollToEnd} onNext={scrollToTop} />
          </KeepAlive>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    minHeight: 44,
  },
  titleStart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexShrink: 1,
  },
  modeTitle: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: 2,
    flexShrink: 1,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.three,
  },
});
