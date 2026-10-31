import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { LoadingNote } from '@/components/ui/loading-note';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { SpeakButton } from '@/components/ui/speak-button';
import { Spacing } from '@/constants/theme';
import { useLevelData } from '@/data/level-data';
import { wordClassLabel, type JlptLevel, type VocabWord } from '@/data/vocab';
import { useNow } from '@/hooks/use-learning-progress';
import { useTheme } from '@/hooks/use-theme';
import { recallChance } from '@/lib/srs';
import { addMistake, useMistakes, useMistakesLoaded } from '@/stores/mistakes-store';
import { getStudyCards, recordStudy, useStudyCards, useStudyLoaded } from '@/stores/study-store';

/** 一次看幾個 */
const BATCH = 10;

type Mark = 'ok' | 'again';

/**
 * 今日複習單字：到期的單字一次列出 10 個，看完打勾。
 * 打勾＝記得（下次複習時間往後延）；還不熟＝放進錯題本，之後再練。
 * 不用一次看完，沒看的明天還會在。
 */
export function DueWordsReview({ level }: { level: JlptLevel }) {
  const data = useLevelData(level);
  const now = useNow();
  // 複習紀錄和錯題本要先從手機讀回來，才知道哪些到期
  const studyLoaded = useStudyLoaded();
  const mistakesLoaded = useMistakesLoaded();
  if (!data || now === null || !studyLoaded || !mistakesLoaded)
    return <LoadingNote text="準備今天要複習的單字…" />;
  return <ReviewList key={level} level={level} words={data.words} now={now} />;
}

function ReviewList({ level, words, now }: { level: JlptLevel; words: VocabWord[]; now: number }) {
  const theme = useTheme();
  const cards = useStudyCards();
  const mistakes = useMistakes();
  const [marks, setMarks] = useState<Record<string, Mark>>({});

  // 現在到期、還不在錯題本的單字，最容易忘的排前面（和首頁的數字一樣）
  const due = useMemo(
    () =>
      words
        .filter((w) => cards[w.id] && cards[w.id].d <= now && !mistakes.has(w.id))
        .sort((a, b) => recallChance(cards[a.id], now) - recallChance(cards[b.id], now)),
    [words, cards, mistakes, now],
  );
  // 這一批：打勾後不會馬上消失，看完一批再換下一批
  const [batch, setBatch] = useState<VocabWord[]>(() => due.slice(0, BATCH));

  const mark = (word: VocabWord, value: Mark) => {
    if (marks[word.id]) return;
    recordStudy(word.id, value === 'ok');
    if (value === 'again') addMistake(word.id);
    setMarks((current) => ({ ...current, [word.id]: value }));
  };

  const unmarked = batch.filter((w) => !marks[w.id]);
  const remaining = due.filter((w) => !marks[w.id] && !batch.includes(w)).length;
  const doneCount = Object.keys(marks).length;

  const nextBatch = () => {
    // 用最新的複習紀錄重新挑（剛打勾的已經不到期了）
    const fresh = getStudyCards();
    const next = words
      .filter(
        (w) => fresh[w.id] && fresh[w.id].d <= Date.now() && !mistakes.has(w.id) && !marks[w.id],
      )
      .sort((a, b) => recallChance(fresh[a.id], now) - recallChance(fresh[b.id], now))
      .slice(0, BATCH);
    setBatch(next);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        <ThemedText type="smallBold">
          {level} 到期的單字：還有 {unmarked.length + remaining} 個・今天已完成 {doneCount} 個
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          一次只看 {BATCH} 個，不用一次看完，沒看的明天還會在。看完按「✓
          記得」，下次複習時間會往後延；按「還不熟」會放進錯題本，之後再練。
        </ThemedText>
      </View>

      {batch.length === 0 ? (
        <View style={styles.center}>
          <ThemedText type="subtitle" style={styles.centerText}>
            🎉 今天的單字都複習完了
          </ThemedText>
        </View>
      ) : (
        batch.map((word) => (
          <WordRow key={word.id} word={word} mark={marks[word.id]} onMark={(m) => mark(word, m)} />
        ))
      )}

      {batch.length > 0 && unmarked.length > 0 && (
        <SecondaryButton
          label={`這 ${unmarked.length} 個都記得 ✓`}
          onPress={() => unmarked.forEach((w) => mark(w, 'ok'))}
        />
      )}
      {batch.length > 0 && unmarked.length === 0 && (
        <View style={styles.center}>
          <ThemedText type="smallBold" style={[styles.centerText, { color: theme.success }]}>
            ✓ 這一批完成了！
          </ThemedText>
          {remaining > 0 ? (
            <PrimaryButton label={`下一批（還有 ${remaining} 個）`} onPress={nextBatch} />
          ) : (
            <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
              今天到期的單字都看完了。
            </ThemedText>
          )}
        </View>
      )}
      <SecondaryButton
        label="改用單字測驗複習"
        onPress={() => router.navigate({ pathname: '/quiz', params: { mode: 'vocab' } })}
      />
    </View>
  );
}

function WordRow({
  word,
  mark,
  onMark,
}: {
  word: VocabWord;
  mark?: Mark;
  onMark: (mark: Mark) => void;
}) {
  const theme = useTheme();
  const showReading = word.reading !== word.word;
  return (
    <View
      style={[
        styles.word,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: mark === 'ok' ? theme.success : mark === 'again' ? theme.gold : theme.border,
          opacity: mark ? 0.75 : 1,
        },
      ]}>
      <View style={styles.wordHead}>
        <View style={styles.wordText}>
          <ThemedText type="small" themeColor="textSecondary">
            {showReading ? `${word.reading}・` : ''}
            {wordClassLabel(word)}
          </ThemedText>
          <ThemedText style={styles.wordTitle}>{word.word}</ThemedText>
          <ThemedText type="small" style={{ color: theme.accent }}>
            {word.meaning}
          </ThemedText>
        </View>
        <SpeakButton text={word.reading} />
      </View>
      {word.example && (
        <ThemedText type="small" themeColor="textSecondary">
          {word.example.ja.replace(/\[([^|\]]+)\|[^\]]+\]/g, '$1')}　{word.example.zh}
        </ThemedText>
      )}
      {mark ? (
        <ThemedText
          type="smallBold"
          style={{ color: mark === 'ok' ? theme.success : theme.gold }}
          accessibilityLiveRegion="polite">
          {mark === 'ok' ? '✓ 記得（已完成）' : '已放進錯題本'}
        </ThemedText>
      ) : (
        <View style={styles.buttons}>
          <View style={styles.flex}>
            <SecondaryButton label="還不熟" onPress={() => onMark('again')} />
          </View>
          <View style={styles.flex}>
            <PrimaryButton label="✓ 記得" onPress={() => onMark('ok')} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  word: {
    borderWidth: 2,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  wordHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  wordText: {
    flex: 1,
    minWidth: 0,
  },
  wordTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 700,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  center: {
    alignItems: 'stretch',
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  centerText: {
    textAlign: 'center',
  },
});
