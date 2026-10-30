import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ExamRoundQuestion } from '@/lib/quiz';

type SubmitReviewProps = {
  questions: ExamRoundQuestion[];
  answers: Record<string, string>;
  marked: readonly string[];
  /** 這是最後一節（交卷後看成績） */
  isLast: boolean;
  onJump: (index: number) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

/** 交卷前總覽：列出還沒作答、標記稍後檢查的題號（點了回去作答），再確認交卷 */
export function SubmitReview({
  questions,
  answers,
  marked,
  isLast,
  onJump,
  onSubmit,
  onCancel,
}: SubmitReviewProps) {
  const theme = useTheme();
  const numbered = questions.map((q, i) => ({ id: q.question.id, number: i + 1, index: i }));
  const unanswered = numbered.filter((q) => answers[q.id] === undefined);
  const flagged = numbered.filter((q) => marked.includes(q.id));

  const chips = (list: typeof numbered) => (
    <View style={styles.chips}>
      {list.map((q) => (
        <Pressable
          key={q.id}
          accessibilityRole="button"
          accessibilityLabel={`回到第 ${q.number} 題`}
          onPress={() => onJump(q.index)}
          style={({ pressed }) => [
            styles.chip,
            { borderColor: theme.border, backgroundColor: theme.background },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold">{q.number}</ThemedText>
        </Pressable>
      ))}
    </View>
  );

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.accent },
      ]}>
      <ThemedText type="smallBold">交卷前檢查</ThemedText>
      <ThemedText type="small">
        共 {questions.length} 題：已作答 {questions.length - unanswered.length}、未作答{' '}
        {unanswered.length}、標記 {flagged.length}
      </ThemedText>
      {unanswered.length > 0 && (
        <>
          <ThemedText type="small" style={{ color: theme.accent }}>
            還沒作答（未作答算答錯）：
          </ThemedText>
          {chips(unanswered)}
        </>
      )}
      {flagged.length > 0 && (
        <>
          <ThemedText type="small" style={{ color: theme.gold }}>
            🚩 標記稍後檢查：
          </ThemedText>
          {chips(flagged)}
        </>
      )}
      <ThemedText type="small" themeColor="textSecondary">
        交卷後就不能再修改這一節的答案。
      </ThemedText>
      <PrimaryButton label={isLast ? '確定交卷，查看成績' : '確定交卷'} onPress={onSubmit} />
      <SecondaryButton label="繼續作答" onPress={onCancel} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  chip: {
    minWidth: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
});
