import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SpeakButton } from '@/components/ui/speak-button';
import { Spacing } from '@/constants/theme';
import type { VocabWord } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';

type VocabCardProps = {
  item: VocabWord;
};

/** 單字卡：漢字、讀音、中文意思，右側是發音按鈕 */
export const VocabCard = memo(function VocabCard({ item }: VocabCardProps) {
  const theme = useTheme();
  // 單字本身就是假名時，不重複顯示讀音
  const showReading = item.reading !== item.word;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
      <View style={[styles.stripe, { backgroundColor: theme.accent }]} />
      <View style={styles.body}>
        <View style={styles.text}>
          {showReading && (
            <ThemedText type="small" themeColor="textSecondary">
              {item.reading}
            </ThemedText>
          )}
          <ThemedText style={styles.word}>{item.word}</ThemedText>
          <ThemedText type="small" style={{ color: theme.accent }}>
            {item.meaning}
          </ThemedText>
        </View>
        <SpeakButton text={item.reading} />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  stripe: {
    width: 6,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.three,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.three,
    gap: Spacing.three,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  word: {
    fontSize: 26,
    lineHeight: 34,
    fontWeight: 700,
  },
});
