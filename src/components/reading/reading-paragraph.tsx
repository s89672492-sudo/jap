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

/** 文章的一段：日文佔滿整行（小螢幕比較好讀），下面是朗讀按鈕；打開翻譯時顯示中文 */
export function ReadingParagraph({ paragraph, showTranslation }: ReadingParagraphProps) {
  const theme = useTheme();

  return (
    <View style={styles.block}>
      <ThemedText style={styles.ja}>{paragraph.ja}</ThemedText>
      {showTranslation && (
        <View style={[styles.zhBox, { borderLeftColor: theme.gold }]}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.zh}>
            {paragraph.zh}
          </ThemedText>
        </View>
      )}
      <View style={styles.actions}>
        <SpeakButton text={paragraph.ja} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    gap: Spacing.two,
  },
  actions: {
    alignItems: 'flex-end',
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
