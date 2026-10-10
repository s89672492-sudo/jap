import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SpeakButton } from '@/components/ui/speak-button';
import { Spacing } from '@/constants/theme';
import type { ReadingVocab } from '@/data/reading/types';
import { useTheme } from '@/hooks/use-theme';

type ReadingVocabListProps = {
  vocab: ReadingVocab[];
  /** 單字 → 小圖示 */
  icons?: Record<string, string>;
  tint: string;
};

/** 文章的重點單字：日文、讀音、中文，可點喇叭聽發音 */
export function ReadingVocabList({ vocab, icons, tint }: ReadingVocabListProps) {
  const theme = useTheme();

  return (
    <View style={styles.list}>
      {vocab.map((item) => (
        <View key={item.word} style={[styles.row, { borderBottomColor: theme.border }]}>
          {icons?.[item.word] && (
            <View style={[styles.icon, { backgroundColor: tint }]}>
              <ThemedText style={styles.iconEmoji}>{icons[item.word]}</ThemedText>
            </View>
          )}
          <View style={styles.text}>
            <ThemedText style={styles.word}>
              {item.word}
              {item.reading !== item.word && (
                <ThemedText type="small" themeColor="textSecondary">
                  {'  '}
                  {item.reading}
                </ThemedText>
              )}
            </ThemedText>
            <ThemedText type="small" style={{ color: theme.accent }}>
              {item.meaning}
            </ThemedText>
          </View>
          <SpeakButton text={item.reading} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.one,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    flex: 1,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 24,
    lineHeight: 30,
  },
  word: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: 700,
  },
});
