import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Flashcard } from './flashcard';

import { DetectiveEmblem } from '@/components/detective/detective-emblem';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';
import { VOCAB_BY_LEVEL, type JlptLevel, type VocabWord } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { shuffle } from '@/lib/quiz';
import { addMistake } from '@/stores/mistakes-store';

type FlashcardDeckProps = {
  level: JlptLevel;
};

/** 單字卡模式：一次一張，翻面後自評「記住了／還不熟」；還不熟的單字會加入錯題本 */
export function FlashcardDeck({ level }: FlashcardDeckProps) {
  const theme = useTheme();
  // 順序是隨機的，等畫面載入後才洗牌，避免網頁版預先產生的 HTML 和實際畫面不一致
  const [deck, setDeck] = useState<VocabWord[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [round, setRound] = useState(0);

  useEffect(() => {
    setDeck(shuffle(VOCAB_BY_LEVEL[level]));
    setIndex(0);
    setFlipped(false);
    setKnown(0);
  }, [level, round]);

  if (deck.length === 0) return null;

  if (index >= deck.length) {
    const unsure = deck.length - known;
    return (
      <View style={styles.summary}>
        <DetectiveEmblem />
        <ThemedText type="smallBold" style={[styles.label, { color: theme.accent }]}>
          {level} 單字卡完成
        </ThemedText>
        <ThemedText style={styles.score}>
          {known} / {deck.length}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          {unsure > 0
            ? `還不熟的 ${unsure} 個單字已加入錯題本，可以到「測驗 → 錯題本」複習。`
            : '全部都記住了，真是名偵探！'}
        </ThemedText>
        <PrimaryButton label="再翻一輪" onPress={() => setRound((r) => r + 1)} />
      </View>
    );
  }

  const word = deck[index];

  const answer = (remembered: boolean) => {
    if (remembered) setKnown((k) => k + 1);
    else addMistake(word.id);
    setFlipped(false);
    setIndex((i) => i + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.count}>
          第 {index + 1} / {deck.length} 張
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.count}>
          記住了 {known}
        </ThemedText>
      </View>
      <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
        <View
          style={[
            styles.trackFill,
            { backgroundColor: theme.accent, width: `${(index / deck.length) * 100}%` },
          ]}
        />
      </View>

      {/* 換卡時用 key 重新建立，新卡片會直接是正面 */}
      <Flashcard key={word.id} word={word} flipped={flipped} onFlip={() => setFlipped(true)} />

      {flipped ? (
        <View style={styles.answerRow}>
          <View style={styles.answerButton}>
            <SecondaryButton label="還不熟" onPress={() => answer(false)} />
          </View>
          <View style={styles.answerButton}>
            <PrimaryButton label="記住了" onPress={() => answer(true)} />
          </View>
        </View>
      ) : (
        <PrimaryButton label="翻面" onPress={() => setFlipped(true)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  count: {
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: -Spacing.two,
  },
  trackFill: {
    height: '100%',
  },
  answerRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  answerButton: {
    flex: 1,
  },
  summary: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
  },
  label: {
    letterSpacing: 2,
    marginTop: Spacing.two,
  },
  score: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: 700,
  },
  center: {
    textAlign: 'center',
  },
});
