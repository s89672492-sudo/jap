import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnswerOption, type AnswerState } from '@/components/quiz/answer-option';
import { QuestionCard } from '@/components/quiz/question-card';
import { QuizResult } from '@/components/quiz/quiz-result';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { JLPT_LEVELS, VOCAB_BY_LEVEL, type JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { buildRound, type QuizQuestion } from '@/lib/quiz';

const LEVEL_OPTIONS = JLPT_LEVELS.map((level) => ({ value: level, label: level }));

export default function QuizScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [level, setLevel] = useState<JlptLevel>('N5');
  // 題目是隨機的，等畫面載入後才抽題，避免網頁版預先產生的 HTML 和實際畫面不一致
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const ready = questions.length > 0;
  const finished = ready && index >= questions.length;
  const question = questions[index];

  const startRound = (nextLevel: JlptLevel) => {
    setLevel(nextLevel);
    setQuestions(buildRound(VOCAB_BY_LEVEL[nextLevel]));
    setIndex(0);
    setPicked(null);
    setScore(0);
  };

  useEffect(() => {
    setQuestions(buildRound(VOCAB_BY_LEVEL.N5));
  }, []);

  const handlePick = (option: string) => {
    if (picked !== null) return;
    setPicked(option);
    if (option === question.word.meaning) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };

  const getState = (option: string): AnswerState => {
    if (picked === null) return 'idle';
    if (option === question.word.meaning) return 'correct';
    if (option === picked) return 'wrong';
    return 'dimmed';
  };

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
          <View style={styles.titleRow}>
            <ThemedText type="subtitle" style={styles.title}>
              推理測驗
            </ThemedText>
            {ready && !finished && (
              <ThemedText type="small" themeColor="textSecondary">
                第 {index + 1} / {questions.length} 題・答對 {score}
              </ThemedText>
            )}
          </View>
          {/* 切換等級會重新開始一輪 */}
          <SegmentedControl options={LEVEL_OPTIONS} value={level} onChange={startRound} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
          },
        ]}>
        <View style={styles.inner}>
          {!ready ? null : finished ? (
            <QuizResult
              level={level}
              score={score}
              total={questions.length}
              onRetry={() => startRound(level)}
            />
          ) : (
            <>
              <ThemedText type="smallBold" style={[styles.prompt, { color: theme.accent }]}>
                這個單字是什麼意思？
              </ThemedText>
              <QuestionCard word={question.word} revealReading={picked !== null} />
              <View style={styles.options}>
                {question.options.map((option) => (
                  <AnswerOption
                    key={option}
                    label={option}
                    state={getState(option)}
                    disabled={picked !== null}
                    onPress={() => handlePick(option)}
                  />
                ))}
              </View>
              {picked !== null && (
                <PrimaryButton
                  label={index + 1 < questions.length ? '下一題' : '查看調查報告'}
                  onPress={handleNext}
                />
              )}
            </>
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
    gap: Spacing.three,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    columnGap: Spacing.two,
  },
  title: {
    letterSpacing: 4,
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.four,
  },
  prompt: {
    letterSpacing: 1,
  },
  options: {
    gap: Spacing.two,
  },
});
