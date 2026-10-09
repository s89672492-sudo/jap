import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AnswerOption, type AnswerState } from './answer-option';

import { ThemedText } from '@/components/themed-text';
import { ExampleSentence } from '@/components/vocab/example-sentence';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ListeningQuestion } from '@/lib/quiz';
import { speakJapanese } from '@/lib/speech';

type ListeningQuestionViewProps = {
  question: ListeningQuestion;
  picked: string | null;
  getState: (option: string) => AnswerState;
  onPick: (option: string) => void;
};

/** 一題聽力題：自動播放發音，作答後才顯示讀音、意思和例句 */
export function ListeningQuestionView({
  question,
  picked,
  getState,
  onPick,
}: ListeningQuestionViewProps) {
  const theme = useTheme();
  const { word } = question;

  // 換到新題目時自動播放一次
  useEffect(() => {
    speakJapanese(word.reading);
  }, [word.id, word.reading]);

  return (
    <>
      <ThemedText type="smallBold" themeColor="textSecondary">
        聽到的是哪一個單字？
      </ThemedText>
      <View
        style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="再聽一次"
          onPress={() => speakJapanese(word.reading)}
          style={({ pressed }) => [
            styles.playButton,
            { backgroundColor: theme.primary, borderColor: theme.gold },
            pressed && styles.pressed,
          ]}>
          <SymbolView
            name={{ ios: 'speaker.wave.3.fill', android: 'volume_up', web: 'volume_up' }}
            size={36}
            tintColor={theme.onPrimary}
          />
        </Pressable>
        <ThemedText type="smallBold" themeColor="textSecondary">
          再聽一次
        </ThemedText>
        {picked !== null && (
          <View style={styles.reveal}>
            {word.reading !== word.word && (
              <ThemedText type="small" themeColor="textSecondary">
                {word.reading}
              </ThemedText>
            )}
            <ThemedText style={styles.word}>{word.word}</ThemedText>
            <ThemedText type="smallBold" style={{ color: theme.accent }}>
              {word.meaning}
            </ThemedText>
          </View>
        )}
      </View>
      <View style={styles.options}>
        {question.options.map((option) => (
          <AnswerOption
            key={option}
            label={option}
            state={getState(option)}
            disabled={picked !== null}
            onPress={() => onPick(option)}
          />
        ))}
      </View>
      {picked !== null && <ExampleSentence word={word} />}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    alignItems: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  playButton: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  reveal: {
    alignItems: 'center',
    gap: Spacing.half,
    marginTop: Spacing.two,
  },
  word: {
    fontSize: 32,
    lineHeight: 42,
    fontWeight: 700,
  },
  options: {
    gap: Spacing.two,
  },
});
