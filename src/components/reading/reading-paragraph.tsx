import { Image } from 'expo-image';
import { StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { SceneIllustration } from './scene-illustration';

import { ThemedText } from '@/components/themed-text';
import { SpeakButton } from '@/components/ui/speak-button';
import { Spacing } from '@/constants/theme';
import type { ReadingParagraph as Paragraph } from '@/data/reading/types';
import { useTheme } from '@/hooks/use-theme';

type ReadingParagraphProps = {
  paragraph: Paragraph;
  showTranslation: boolean;
  /** 這段的插圖：表情符號會擺進插畫風的場景裡 */
  scene?: string[];
  /** 這段的主角和心情 */
  cast?: [string | null, string | null];
  /** 這段的插畫；有的話就用插畫，不用表情符號場景 */
  image?: ImageSourcePropType;
};

/** 文章的一段：日文佔滿整行（小螢幕比較好讀），下面是朗讀按鈕；打開翻譯時顯示中文 */
export function ReadingParagraph({ paragraph, showTranslation, scene, cast, image }: ReadingParagraphProps) {
  const theme = useTheme();

  return (
    <View style={styles.block}>
      {image ? (
        <Image
          source={image}
          style={styles.image}
          contentFit="cover"
          transition={200}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ) : scene && scene.length > 0 && (
        <SceneIllustration
          // 主角已經站在前面，插圖裡同樣的角色就不再畫一次
          emojis={scene.filter((emoji) => emoji !== cast?.[0])}
          who={cast?.[0]}
          mood={cast?.[1]}
          height={140}
        />
      )}
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
