import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
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

/** 文章插圖：主題色底，加上表情符號組成的小場景 */
export function ArticleCover({ id, topic, size }: ArticleCoverProps) {
  const [main, left, right] = ARTICLE_SCENES[id] ?? DEFAULT_SCENE;
  const background = { backgroundColor: TOPIC_TINTS[topic] };

  if (size === 'thumb') {
    return (
      <View style={[styles.thumb, background]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <ThemedText style={styles.thumbEmoji}>{main}</ThemedText>
      </View>
    );
  }

  return (
    <View
      style={[styles.banner, background]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants">
      {/* 角落的點點裝飾 */}
      <ThemedText style={[styles.deco, styles.decoTopLeft]}>·  ·  ·</ThemedText>
      <ThemedText style={[styles.deco, styles.decoBottomRight]}>·  ·  ·</ThemedText>
      <ThemedText style={[styles.side, styles.sideLeft]}>{left}</ThemedText>
      <ThemedText style={styles.main}>{main}</ThemedText>
      <ThemedText style={[styles.side, styles.sideRight]}>{right}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 150,
    borderRadius: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
    overflow: 'hidden',
  },
  main: {
    fontSize: 72,
    lineHeight: 90,
  },
  side: {
    fontSize: 40,
    lineHeight: 52,
  },
  sideLeft: {
    transform: [{ translateY: 22 }, { rotate: '-12deg' }],
  },
  sideRight: {
    transform: [{ translateY: -22 }, { rotate: '12deg' }],
  },
  deco: {
    position: 'absolute',
    fontSize: 22,
    opacity: 0.35,
    letterSpacing: 2,
  },
  decoTopLeft: {
    top: Spacing.two,
    left: Spacing.three,
  },
  decoBottomRight: {
    bottom: Spacing.two,
    right: Spacing.three,
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
