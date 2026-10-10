import { Image } from 'expo-image';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { JapaneseText } from '@/components/ui/japanese-text';
import { SpeakButton } from '@/components/ui/speak-button';
import { Spacing } from '@/constants/theme';
import type { ReadingParagraph as Paragraph } from '@/data/reading/types';
import { useTheme } from '@/hooks/use-theme';

type ReadingParagraphProps = {
  paragraph: Paragraph;
  showTranslation: boolean;
  /** 這段的插畫 */
  image?: ImageSourcePropType;
};

/** 文章的一段：日文佔滿整行（小螢幕比較好讀），下面是朗讀按鈕；打開翻譯時顯示中文 */
export function ReadingParagraph({
  paragraph,
  showTranslation,
  image,
}: ReadingParagraphProps) {
  const theme = useTheme();

  return (
    <View style={styles.block}>
      {image && (
        <Image
          source={image}
          style={styles.image}
          contentFit="cover"
          transition={200}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      )}
      <JapaneseText text={paragraph.ja} fontSize={18} style={styles.ja} />
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
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: Spacing.three,
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
