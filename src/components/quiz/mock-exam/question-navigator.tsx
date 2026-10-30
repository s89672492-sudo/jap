import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ExamRoundQuestion } from '@/lib/quiz';

type QuestionNavigatorProps = {
  questions: ExamRoundQuestion[];
  answers: Record<string, string>;
  marked: readonly string[];
  current: number;
  onJump: (index: number) => void;
};

/**
 * 題號導覽：已作答的塗滿、標記的有 🚩、目前這題是紅框。點了跳到那一題。
 * 上方顯示已作答、未作答、標記的題數。
 */
export function QuestionNavigator({
  questions,
  answers,
  marked,
  current,
  onJump,
}: QuestionNavigatorProps) {
  const theme = useTheme();
  const answered = questions.filter((q) => answers[q.question.id] !== undefined).length;
  const markedCount = questions.filter((q) => marked.includes(q.question.id)).length;

  return (
    <View style={styles.container}>
      <View style={styles.summary} accessibilityLiveRegion="polite">
        <ThemedText type="small">
          已作答 <ThemedText type="smallBold">{answered}</ThemedText>
        </ThemedText>
        <ThemedText type="small">
          未作答{' '}
          <ThemedText
            type="smallBold"
            style={{ color: answered < questions.length ? theme.accent : theme.text }}>
            {questions.length - answered}
          </ThemedText>
        </ThemedText>
        <ThemedText type="small">
          🚩 標記 <ThemedText type="smallBold">{markedCount}</ThemedText>
        </ThemedText>
      </View>
      <View style={styles.numbers}>
        {questions.map((q, i) => {
          const done = answers[q.question.id] !== undefined;
          const flagged = marked.includes(q.question.id);
          const isCurrent = i === current;
          return (
            <Pressable
              key={q.question.id}
              accessibilityRole="button"
              accessibilityLabel={`第 ${i + 1} 題，${done ? '已作答' : '未作答'}${flagged ? '，已標記' : ''}`}
              accessibilityState={{ selected: isCurrent }}
              onPress={() => onJump(i)}
              hitSlop={2}
              style={[
                styles.number,
                {
                  borderColor: isCurrent ? theme.accent : flagged ? theme.gold : theme.border,
                  backgroundColor: done ? theme.primary : theme.backgroundElement,
                },
              ]}>
              <ThemedText
                type="smallBold"
                style={[
                  styles.numberText,
                  { color: done ? theme.onPrimary : theme.textSecondary },
                ]}>
                {i + 1}
              </ThemedText>
              {flagged && <ThemedText style={styles.flag}>🚩</ThemedText>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  summary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: Spacing.three,
  },
  numbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  number: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  flag: {
    position: 'absolute',
    top: -6,
    right: -4,
    fontSize: 12,
    lineHeight: 14,
  },
});
