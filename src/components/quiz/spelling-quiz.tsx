import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { NextButton } from './next-button';
import { QuizProgress } from './quiz-progress';
import { QuizResult } from './quiz-result';

import { ThemedText } from '@/components/themed-text';
import { FrequencyTag } from '@/components/ui/frequency-tag';
import { LoadingNote } from '@/components/ui/loading-note';
import { SpeakButton } from '@/components/ui/speak-button';
import { ExampleSentence } from '@/components/vocab/example-sentence';
import { Spacing } from '@/constants/theme';
import { useLevelData, type LevelData } from '@/data/level-data';
import { wordClassLabel, type JlptLevel, type VocabWord } from '@/data/vocab';
import { useQuizRound } from '@/hooks/use-quiz-round';
import { useTheme } from '@/hooks/use-theme';
import { buildSpellingQuestion, isSpellable, type SpellingQuestion } from '@/lib/spelling';
import { pickForStudy } from '@/lib/study-order';
import { addMistake, getMistakes } from '@/stores/mistakes-store';
import { useSettings } from '@/stores/settings-store';
import { getStudyCards, recordStudy } from '@/stores/study-store';

type SpellingQuizProps = {
  level: JlptLevel;
  onAnswered?: () => void;
  onNext?: () => void;
};

/** 拼寫練習：看中文意思和詞性，點假名方塊拼出讀音；這個等級的資料載入後才開始 */
export function SpellingQuiz(props: SpellingQuizProps) {
  const data = useLevelData(props.level);
  if (!data) return <LoadingNote />;
  return <SpellingQuizContent {...props} data={data} />;
}

function SpellingQuizContent({
  level,
  onAnswered,
  onNext,
  data,
}: SpellingQuizProps & { data: LevelData }) {
  const { roundSize } = useSettings();
  const quiz = useQuizRound<SpellingQuestion<VocabWord>>(
    () => {
      const words = data.words.filter((w) => isSpellable(w.reading));
      // 和單字測驗一樣：該複習、常答錯的先出，再補新單字（真題高頻的先）
      return pickForStudy(words, roundSize, getStudyCards(), getMistakes()).map((w) =>
        buildSpellingQuestion(w),
      );
    },
    (q) => q.answer.join(''),
    [level, roundSize],
    (q, correct) => {
      recordStudy(q.word.id, correct);
      if (!correct) addMistake(q.word.id);
    },
  );

  if (!quiz.ready) return null;
  if (quiz.finished || !quiz.current) {
    return (
      <QuizResult level={level} score={quiz.score} total={quiz.total} onRetry={quiz.restart} />
    );
  }

  return (
    <View style={styles.container}>
      <QuizProgress label="拼寫" index={quiz.index} total={quiz.total} score={quiz.score} />
      <SpellingBoard
        // 換題時重設已排的方塊
        key={`${quiz.index}-${quiz.current.word.id}`}
        question={quiz.current}
        answered={quiz.picked}
        onSubmit={(spelled) => {
          quiz.pick(spelled);
          onAnswered?.();
        }}
      />
      {quiz.picked !== null && (
        <NextButton
          isLast={quiz.index + 1 >= quiz.total}
          onPress={() => {
            quiz.next();
            onNext?.();
          }}
        />
      )}
    </View>
  );
}

function SpellingBoard({
  question,
  answered,
  onSubmit,
}: {
  question: SpellingQuestion<VocabWord>;
  /** 交出的拼法；null 表示還在作答 */
  answered: string | null;
  onSubmit: (spelled: string) => void;
}) {
  const theme = useTheme();
  const { word, answer, tiles } = question;
  // 排進答案列的方塊（存方塊在 tiles 裡的位置，同一個假名出現兩次也分得開）
  const [placed, setPlaced] = useState<number[]>([]);
  const done = answered !== null;
  const correct = done && answered === answer.join('');

  const add = (index: number) => {
    if (done || placed.includes(index) || placed.length >= answer.length) return;
    const next = [...placed, index];
    setPlaced(next);
    // 排滿就自動判定
    if (next.length === answer.length) onSubmit(next.map((i) => tiles[i]).join(''));
  };
  const remove = (slot: number) => {
    if (done) return;
    setPlaced(placed.filter((_, i) => i !== slot));
  };

  return (
    <View style={styles.board}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        用假名拼出這個單字的讀音（共 {answer.length} 格）
      </ThemedText>
      <View
        style={[
          styles.prompt,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        <View style={[styles.posTag, { borderColor: theme.border }]}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.posText}>
            {wordClassLabel(word)}
          </ThemedText>
        </View>
        <ThemedText style={[styles.meaning, { color: theme.accent }]}>{word.meaning}</ThemedText>
        {done && (
          <>
            <ThemedText style={styles.word}>{word.word}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {word.reading}
            </ThemedText>
            <FrequencyTag word={word} style={styles.centered} />
            <SpeakButton text={word.reading} size="large" />
          </>
        )}
      </View>

      {/* 答案列：點已排好的格子可以退回 */}
      <View style={styles.slots} accessibilityLabel="答案列">
        {answer.map((expected, slot) => {
          const tile = placed[slot] !== undefined ? tiles[placed[slot]] : null;
          const wrong = done && !correct && tile !== expected;
          const right = done && (correct || tile === expected);
          return (
            <Pressable
              key={slot}
              accessibilityRole="button"
              accessibilityLabel={
                tile
                  ? `第 ${slot + 1} 格：${tile}${done ? (wrong ? `，錯了，正確是 ${expected}` : '，正確') : '，點一下退回'}`
                  : `第 ${slot + 1} 格：空的`
              }
              disabled={done || !tile}
              onPress={() => remove(slot)}
              style={[
                styles.slot,
                {
                  borderColor: wrong ? theme.accent : right ? theme.success : theme.border,
                  backgroundColor: tile ? theme.backgroundElement : theme.background,
                },
              ]}>
              <ThemedText style={[styles.tileText, wrong && { color: theme.accent }]}>
                {tile ?? ''}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {done ? (
        <View style={styles.result}>
          <ThemedText
            type="smallBold"
            style={{ color: correct ? theme.success : theme.accent }}
            accessibilityLiveRegion="polite">
            {correct ? '○ 拼對了！' : `× 正確的拼法：${answer.join('')}`}
          </ThemedText>
          <ExampleSentence word={word} />
        </View>
      ) : (
        <View style={styles.pool}>
          {tiles.map((tile, index) => {
            const used = placed.includes(index);
            return (
              <Pressable
                key={index}
                accessibilityRole="button"
                accessibilityLabel={used ? `${tile}（已使用）` : tile}
                accessibilityState={{ disabled: used }}
                disabled={used}
                onPress={() => add(index)}
                style={({ pressed }) => [
                  styles.tile,
                  {
                    borderColor: theme.primary,
                    backgroundColor: used ? theme.background : theme.backgroundElement,
                  },
                  used && styles.used,
                  pressed && styles.pressed,
                ]}>
                <ThemedText style={styles.tileText}>{tile}</ThemedText>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  board: {
    gap: Spacing.three,
  },
  prompt: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    alignItems: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  posTag: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
  },
  posText: {
    fontSize: 12,
  },
  meaning: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 700,
    textAlign: 'center',
  },
  word: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 700,
  },
  centered: {
    alignSelf: 'center',
  },
  slots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  slot: {
    minWidth: 48,
    height: 52,
    paddingHorizontal: Spacing.one,
    borderWidth: 2,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pool: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  tile: {
    minWidth: 52,
    height: 52,
    paddingHorizontal: Spacing.two,
    borderWidth: 2,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: 700,
  },
  used: {
    opacity: 0.3,
  },
  pressed: {
    opacity: 0.7,
  },
  result: {
    gap: Spacing.two,
  },
});
