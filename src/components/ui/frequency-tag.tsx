import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { EXAM_FREQUENCY_LABELS, type VocabWord } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';

/** 標籤上的文字，例如「真題高頻」「N2 真題中頻」 */
export function frequencyLabel(word: Pick<VocabWord, 'freq' | 'freqLevel'>): string | null {
  if (!word.freq) return null;
  const label = EXAM_FREQUENCY_LABELS[word.freq];
  return word.freqLevel ? `${word.freqLevel} ${label}` : label;
}

/**
 * 真題頻率的小標籤：高頻用金色外框和 ★ 標出，中頻、低頻是淡色外框。
 * 沒有統計的單字不顯示。
 */
export function FrequencyTag({
  word,
  style,
}: {
  word: Pick<VocabWord, 'freq' | 'freqLevel'>;
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const label = frequencyLabel(word);
  if (!label) return null;
  const high = word.freq === 'high';
  return (
    <View
      style={[styles.tag, { borderColor: high ? theme.gold : theme.border }, style]}
      accessibilityLabel={`${label}：在 JLPT 真題中${high ? '常' : word.freq === 'mid' ? '有時' : '偶爾'}出現`}>
      <ThemedText
        type="small"
        themeColor={high ? 'text' : 'textSecondary'}
        style={[styles.text, high && styles.high]}>
        {high ? `★ ${label}` : label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    // 放在直排的版面裡也只佔文字寬度
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.one + 2,
  },
  text: {
    fontSize: 11,
    lineHeight: 16,
  },
  high: {
    fontWeight: 700,
  },
});
