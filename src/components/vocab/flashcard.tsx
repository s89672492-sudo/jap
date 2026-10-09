import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { SpeakButton } from '@/components/ui/speak-button';
import { ExampleSentence } from '@/components/vocab/example-sentence';
import { Spacing } from '@/constants/theme';
import type { VocabWord } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';

type FlashcardProps = {
  word: VocabWord;
  flipped: boolean;
  onFlip: () => void;
  /** 反向：正面顯示中文，想出日文後再翻面 */
  reverse?: boolean;
};

const CARD_HEIGHT = 380;
const FLIP_DURATION = 350;

/**
 * 單字卡：正面只有日文（反向時只有中文），翻到背面才看到完整的讀音、日文和中文。
 * 換下一張時請用 key 重新建立元件，卡片才會直接回到正面、不播翻轉動畫。
 */
export function Flashcard({ word, flipped, onFlip, reverse = false }: FlashcardProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  // 0 = 正面，1 = 背面
  const progress = useSharedValue(flipped ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(flipped ? 1 : 0, {
      duration: reduceMotion ? 0 : FLIP_DURATION,
    });
  }, [flipped, progress, reduceMotion]);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${interpolate(progress.value, [0, 1], [0, 180])}deg` }],
  }));
  const backStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${interpolate(progress.value, [0, 1], [180, 360])}deg` }],
  }));

  const faceColors = { backgroundColor: theme.backgroundElement, borderColor: theme.border };
  const showReading = word.reading !== word.word;

  return (
    <View style={styles.container}>
      {/* 只有正面是按鈕；背面放發音按鈕，避免按鈕包按鈕 */}
      <Animated.View
        style={[styles.face, faceColors, frontStyle]}
        pointerEvents={flipped ? 'none' : 'auto'}
        accessibilityElementsHidden={flipped}
        importantForAccessibility={flipped ? 'no-hide-descendants' : 'auto'}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${reverse ? word.meaning : word.word}，點一下翻面`}
          accessibilityHint={reverse ? '翻到背面看日文' : '翻到背面看讀音和意思'}
          onPress={onFlip}
          style={styles.faceContent}>
          <View style={[styles.stripe, { backgroundColor: theme.accent }]} />
          {reverse ? (
            <ThemedText
              style={[styles.frontMeaning, { color: theme.accent }]}
              adjustsFontSizeToFit
              numberOfLines={3}>
              {word.meaning}
            </ThemedText>
          ) : (
            <ThemedText style={styles.word} adjustsFontSizeToFit numberOfLines={1}>
              {word.word}
            </ThemedText>
          )}
          <ThemedText type="small" themeColor="textSecondary">
            {reverse ? '想想日文怎麼說，再點一下翻面' : '點一下翻面'}
          </ThemedText>
        </Pressable>
      </Animated.View>

      <Animated.View
        style={[styles.face, faceColors, { borderColor: theme.gold }, backStyle]}
        pointerEvents={flipped ? 'auto' : 'none'}
        accessibilityElementsHidden={!flipped}
        importantForAccessibility={flipped ? 'auto' : 'no-hide-descendants'}>
        <View style={styles.faceContent}>
          <View style={[styles.stripe, { backgroundColor: theme.gold }]} />
          {showReading && (
            <ThemedText style={[styles.reading, { color: theme.textSecondary }]}>
              {word.reading}
            </ThemedText>
          )}
          <ThemedText style={styles.backWord} adjustsFontSizeToFit numberOfLines={1}>
            {word.word}
          </ThemedText>
          <ThemedText style={[styles.meaning, { color: theme.accent }]}>{word.meaning}</ThemedText>
          <SpeakButton text={word.reading} size="large" />
          <ExampleSentence word={word} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CARD_HEIGHT,
  },
  face: {
    ...StyleSheet.absoluteFill,
    borderWidth: 2,
    borderRadius: Spacing.four,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  faceContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  stripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  word: {
    fontSize: 56,
    lineHeight: 72,
    fontWeight: 700,
  },
  frontMeaning: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: 700,
    textAlign: 'center',
  },
  backWord: {
    fontSize: 40,
    lineHeight: 52,
    fontWeight: 700,
  },
  reading: {
    fontSize: 18,
    lineHeight: 24,
  },
  meaning: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: 700,
    textAlign: 'center',
  },
});
