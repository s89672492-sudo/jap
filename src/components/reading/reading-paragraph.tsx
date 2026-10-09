import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SpeakButton } from '@/components/ui/speak-button';
import { Spacing } from '@/constants/theme';
import type { ReadingParagraph as Paragraph } from '@/data/reading/types';
import { useTheme } from '@/hooks/use-theme';

type ReadingParagraphProps = {
  paragraph: Paragraph;
  showTranslation: boolean;
};

/** 文章的一段：日文、朗讀按鈕，打開翻譯時在下方顯示中文 */
export function ReadingParagraph({ paragraph, showTranslation }: ReadingParagraphProps) {
  const theme = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <ThemedText style={styles.ja}>{paragraph.ja}</ThemedText>
        {showTranslation && (
          <View style={[styles.zhBox, { borderLeftColor: theme.gold }]}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.zh}>
              {paragraph.zh}
            </ThemedText>
          </View>
        )}
      </View>
      <SpeakButton text={paragraph.ja} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  text: {
    flex: 1,
    gap: Spacing.two,
  },
  ja: {
    fontSize: 18,
    lineHeight: 32,
  },
  zhBox: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.two,
  },
  zh: {
    lineHeight: 22,
  },
});
