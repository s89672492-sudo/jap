import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerOption, type AnswerState } from '@/components/quiz/answer-option';
import { ThemedText } from '@/components/themed-text';
import { JapaneseText } from '@/components/ui/japanese-text';
import { Spacing } from '@/constants/theme';
import type { ReadingQuestion } from '@/data/reading/types';
import { useTheme } from '@/hooks/use-theme';
import { shuffle } from '@/lib/quiz';

type ArticleQuestionsProps = {
  questions: ReadingQuestion[];
  /** 全部作答完時呼叫 */
  onFinish: () => void;
};

/** 閱讀理解題：每題點一個選項就顯示對錯，全部答完顯示分數 */
export function ArticleQuestions({ questions, onFinish }: ArticleQuestionsProps) {
  const theme = useTheme();
  // 選項順序是隨機的，等畫面載入後才打亂，避免網頁版預先產生的 HTML 不一致
  const [options, setOptions] = useState<string[][]>(() => questions.map((q) => q.options));
  const [picked, setPicked] = useState<(string | null)[]>(() => questions.map(() => null));

  useEffect(() => {
    setOptions(questions.map((q) => shuffle(q.options)));
    setPicked(questions.map(() => null));
  }, [questions]);

  const answered = picked.filter((p) => p !== null).length;
  const correct = picked.filter((p, i) => p === questions[i]?.options[0]).length;

  const pick = (index: number, option: string) => {
    if (picked[index] !== null) return;
    const next = picked.map((p, i) => (i === index ? option : p));
    setPicked(next);
    if (next.every((p) => p !== null)) onFinish();
  };

  const stateOf = (index: number, option: string): AnswerState => {
    const choice = picked[index];
    if (choice === null) return 'idle';
    if (option === questions[index].options[0]) return 'correct';
    if (option === choice) return 'wrong';
    return 'dimmed';
  };

  return (
    <View style={styles.container}>
      {questions.map((question, index) => (
        <View key={question.question} style={styles.question}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            問 {index + 1}
          </ThemedText>
          <JapaneseText
            text={question.question}
            fontSize={17}
            fontWeight={700}
            style={styles.prompt}
          />
          <ThemedText type="small" themeColor="textSecondary">
            {question.questionZh}
          </ThemedText>
          <View style={styles.options}>
            {(options[index] ?? question.options).map((option) => (
              <AnswerOption
                key={option}
                label={option}
                state={stateOf(index, option)}
                disabled={picked[index] !== null}
                onPress={() => pick(index, option)}
                japanese
              />
            ))}
          </View>
        </View>
      ))}
      {answered === questions.length && (
        <ThemedText style={[styles.result, { color: theme.gold }]}>
          答對 {correct} / {questions.length} 題
          {correct === questions.length ? '・真相只有一個！' : ''}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  question: {
    gap: Spacing.two,
  },
  prompt: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: 700,
  },
  options: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  result: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
  },
});
