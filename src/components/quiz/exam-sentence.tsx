import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { FuriganaText } from '@/components/vocab/furigana-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { lookupFurigana } from '@/lib/furigana';
import { useSettings } from '@/stores/settings-store';

type ExamSentenceProps = {
  /** 用［］標出要畫底線的字；句子重組題用 ★ 標出要回答的位置 */
  sentence: string;
};

/** 試題的題目句子；模仿 JLPT 試卷，［］裡的字加上底線、★ 用強調色 */
export function ExamSentence({ sentence }: ExamSentenceProps) {
  const theme = useTheme();
  // 以［…］或 ★ 切開：［］裡的字畫底線，★ 用強調色標出
  const parts = sentence.split(/(［.+?］|★)/);
  const { furigana } = useSettings();
  // 注音版本已去掉［］，畫底線的字本身不加注音（避免洩漏漢字讀法題的答案）
  const annotated = furigana ? lookupFurigana(sentence) : undefined;
  const open = sentence.indexOf('［');
  const close = sentence.indexOf('］');
  const underline: [number, number] | undefined =
    open >= 0 && close > open ? [open, close - 1] : undefined;
  const star = sentence.replace(/[［］]/g, '').indexOf('★');

  if (annotated) {
    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
          },
        ]}>
        <FuriganaText
          annotated={annotated}
          fontSize={20}
          fontWeight={600}
          underline={underline}
          highlight={star >= 0 ? [star, star + 1] : undefined}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
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
