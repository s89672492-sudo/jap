import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { COVER_IMAGES } from '@/data/reading/covers';
import type { ReadingTopic } from '@/data/reading/types';

/** 每個主題的底色（半透明，深淺色模式都適用）：單字圖示的底色、缺圖時的底色 */
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

/** 文章封面插畫：文章頁上方的大圖，或列表裡的小圖 */
export function ArticleCover({ id, topic, size }: ArticleCoverProps) {
  const image = COVER_IMAGES[id];
  const style = size === 'thumb' ? styles.thumb : styles.banner;

  // 每篇都有封面插畫；萬一缺圖就顯示主題色的底，版面不會跳動
  if (!image) return <View style={[style, { backgroundColor: TOPIC_TINTS[topic] }]} />;

  return (
    <Image
      source={image}
      style={style}
      contentFit="cover"
      transition={200}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
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
  },
});
