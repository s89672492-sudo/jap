import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ExamSentenceProps = {
  /** 用［］標出要畫底線的字 */
  sentence: string;
};

/** 試題的題目句子；［］裡的字加上底線，模仿 JLPT 試卷 */
export function ExamSentence({ sentence }: ExamSentenceProps) {
  const theme = useTheme();
  // 以［…］切開，奇數位置就是要畫底線的部分
  const parts = sentence.split(/［(.+?)］/);

  return (
    <View
      style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <ThemedText style={styles.sentence}>
        {parts.map((part, i) =>
          i % 2 === 1 ? (
            <ThemedText
              key={i}
              style={[styles.sentence, styles.underline, { textDecorationColor: theme.accent }]}>
              {part}
            </ThemedText>
          ) : (
            part
          ),
        )}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
  },
  sentence: {
    fontSize: 20,
    lineHeight: 34,
    fontWeight: 600,
  },
  underline: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});
