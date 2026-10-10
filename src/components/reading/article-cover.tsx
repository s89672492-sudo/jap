import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { SceneIllustration } from './scene-illustration';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { COVER_IMAGES } from '@/data/reading/covers';
import { ARTICLE_SCENES, DEFAULT_SCENE } from '@/data/reading/scenes';
import type { ReadingTopic } from '@/data/reading/types';

/** 每個主題的插圖底色（半透明，深淺色模式都適用） */
export const TOPIC_TINTS: Record<ReadingTopic, string> = {
  生活: 'rgba(244, 162, 97, 0.28)',
  文化: 'rgba(214, 40, 57, 0.18)',
  社會: 'rgba(42, 157, 143, 0.24)',
  自然: 'rgba(106, 168, 79, 0.28)',
  科學: 'rgba(69, 123, 220, 0.24)',
  推理: 'rgba(30, 30, 60, 0.30)',
};

type ArticleCoverProps = {
  id: string;
  topic: ReadingTopic;
  /** banner：文章頁上方的大插圖；thumb：列表裡的小圖 */
  size: 'banner' | 'thumb';
};

/** 文章插圖：有封面插畫就用插畫；沒有的話，列表用主題色底的小圖示，文章頁用會動的場景 */
export function ArticleCover({ id, topic, size }: ArticleCoverProps) {
  const [main, left, right] = ARTICLE_SCENES[id] ?? DEFAULT_SCENE;
  const image = COVER_IMAGES[id];

  if (image) {
    return (
      <Image
        source={image}
        style={size === 'thumb' ? styles.thumb : styles.banner}
        contentFit="cover"
        transition={200}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    );
  }

  if (size === 'thumb') {
    const background = { backgroundColor: TOPIC_TINTS[topic] };
    return (
      <View
        style={[styles.thumb, background]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants">
        <ThemedText style={styles.thumbEmoji}>{main}</ThemedText>
      </View>
    );
  }

  // 大插圖用插畫風場景；推理故事一律是夜晚，比較有氣氛
  return (
    <SceneIllustration
      emojis={[main, left, right]}
      backdrop={topic === '推理' ? 'night' : undefined}
      height={170}
    />
  );
}

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: Spacing.three,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: {
    fontSize: 30,
    lineHeight: 38,
  },
});
