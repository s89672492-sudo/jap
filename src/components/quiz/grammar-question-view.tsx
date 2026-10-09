import { StyleSheet, View } from 'react-native';

import { AnswerOption, type AnswerState } from './answer-option';

import { ThemedText } from '@/components/themed-text';
import { GrammarCard } from '@/components/vocab/grammar-card';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { GrammarQuestion } from '@/lib/quiz';

type GrammarQuestionViewProps = {
  question: GrammarQuestion;
  picked: string | null;
  getState: (option: string) => AnswerState;
  onPick: (option: string) => void;
};

const BLANK = '＿＿＿';

/** 一題文法題：例句挖空，看中文翻譯選出空格的部分；作答後顯示完整的文法卡 */
export function GrammarQuestionView({ question, picked, getState, onPick }: GrammarQuestionViewProps) {
  const theme = useTheme();
  const { point, answer } = question;
  const index = point.example.ja.indexOf(answer);
  const before = point.example.ja.slice(0, index);
  const after = point.example.ja.slice(index + answer.length);

  return (
    <>
      <ThemedText type="smallBold" themeColor="textSecondary">
        空格裡應該填入哪一個？
      </ThemedText>
      <View
        style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <ThemedText style={styles.sentence}>
          {before}
          <ThemedText style={[styles.sentence, styles.blank, { color: theme.accent }]}>
            {picked === null ? BLANK : answer}
          </ThemedText>
          {after}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {point.example.zh}
        </ThemedText>
      </View>
      <View style={styles.options}>
        {question.options.map((option) => (
          <AnswerOption
            key={option}
            label={option}
            state={getState(option)}
            disabled={picked !== null}
            onPress={() => onPick(option)}
          />
        ))}
      </View>
      {picked !== null && <GrammarCard item={point} />}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  sentence: {
    fontSize: 20,
    lineHeight: 32,
  },
  blank: {
    fontWeight: 700,
  },
  options: {
    gap: Spacing.two,
  },
});
