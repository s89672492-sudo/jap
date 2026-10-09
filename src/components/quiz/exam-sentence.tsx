import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ExamSentenceProps = {
  /** 用［］標出要畫底線的字；句子重組題用 ★ 標出要回答的位置 */
  sentence: string;
};

/** 試題的題目句子；模仿 JLPT 試卷，［］裡的字加上底線、★ 用強調色 */
export function ExamSentence({ sentence }: ExamSentenceProps) {
  const theme = useTheme();
  // 以［…］或 ★ 切開：［］裡的字畫底線，★ 用強調色標出
  const parts = sentence.split(/(［.+?］|★)/);

  return (
    <View
      style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <ThemedText style={styles.sentence}>
        {parts.map((part, i) => {
          if (part === '★') {
            return (
              <ThemedText key={i} style={[styles.sentence, { color: theme.accent }]}>
                ★
              </ThemedText>
            );
          }
          if (part.startsWith('［') && part.endsWith('］')) {
            return (
              <ThemedText
                key={i}
                style={[styles.sentence, styles.underline, { textDecorationColor: theme.accent }]}>
                {part.slice(1, -1)}
              </ThemedText>
            );
          }
          return part;
        })}
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
