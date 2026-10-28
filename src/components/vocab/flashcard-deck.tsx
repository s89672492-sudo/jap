import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Flashcard } from './flashcard';
import { KnownWordsList } from './known-words-list';

import { DetectiveEmblem } from '@/components/detective/detective-emblem';
import { ThemedText } from '@/components/themed-text';
import { ChipButton } from '@/components/ui/chip-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';
import type { JlptLevel, VocabWord } from '@/data/vocab';
import { useDepsChanged, useHydrated } from '@/hooks/use-hydrated';
import { useTheme } from '@/hooks/use-theme';
import { shuffle } from '@/lib/quiz';
import { isDue } from '@/lib/srs';
import {
  resetKnownWords,
  saveFlashcardSession,
  setWordKnown,
  useFlashcardSessions,
  useFlashcardStoresLoaded,
  useKnownWords,
  type FlashcardSession,
} from '@/stores/flashcard-store';
import { addMistake } from '@/stores/mistakes-store';
import { recordStudy, useStudyCards, useStudyLoaded } from '@/stores/study-store';

type FlashcardDeckProps = {
  level: JlptLevel;
  /** 這一疊要翻的單字（可能已依詞性篩選） */
  words: VocabWord[];
  /** 用來記住這一疊翻到哪裡，例如「N5-verb」 */
  sessionKey: string;
};

type Direction = FlashcardSession['direction'];

const DIRECTION_LABELS: Record<Direction, string> = {
  'ja-zh': '日文 → 中文',
  'zh-ja': '中文 → 日文',
};

/**
 * 單字卡模式：一次一張，翻面後自評「記住了／還不熟」。
 * 記住了的單字平常不出，到了間隔複習排定的時間會排在最前面再出現；還不熟的會加入錯題本。
 * 翻到第幾張也會記住，切到別的頁面再回來可以接著翻。
 */
type DeckView = 'study' | 'known';

/** 單字卡：翻卡練習；卡片上方的「已記住 N ›」可以打開已記住的單字列表 */
export function FlashcardDeck(props: FlashcardDeckProps) {
  const [view, setView] = useState<DeckView>('study');

  if (view === 'known') {
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <ChipButton label="‹ 回到單字卡" onPress={() => setView('study')} />
        </View>
        <KnownWordsList words={props.words} />
      </View>
    );
  }
  return <FlashcardStudy {...props} onShowKnown={() => setView('known')} />;
}

type FlashcardStudyProps = FlashcardDeckProps & {
  onShowKnown: () => void;
};

function FlashcardStudy({ level, words, sessionKey, onShowKnown }: FlashcardStudyProps) {
  const theme = useTheme();
  const studyLoaded = useStudyLoaded();
  const loaded = useFlashcardStoresLoaded() && studyLoaded;
  const knownIds = useKnownWords();
  const sessions = useFlashcardSessions();
  const cards = useStudyCards();
  const [flipped, setFlipped] = useState(false);
  // 判斷「到期」用的時間：畫面載入時取一次（網頁版預先產生的畫面不知道現在幾點）
  const hydrated = useHydrated();
  const [openedAt] = useState(() => Date.now());
  const now = hydrated ? openedAt : 0;

  const byId = useMemo(() => new Map(words.map((w) => [w.id, w])), [words]);
  const unknown = useMemo(() => words.filter((w) => !knownIds.has(w.id)), [words, knownIds]);
  // 已記住、但到了複習時間的單字
  const dueKnown = useMemo(
    () =>
      words
        .filter((w) => knownIds.has(w.id) && isDue(cards[w.id], now))
        .sort((a, b) => cards[a.id].d - cards[b.id].d),
    [words, knownIds, cards, now],
  );
  const remaining = dueKnown.length + unknown.length;
  const knownCount = words.length - unknown.length;

  // 存著的進度（單字都還在這一疊裡才沿用）
  const saved = sessions[sessionKey];
  const session = saved && saved.ids.every((id) => byId.has(id)) ? saved : undefined;

  // 沒有進度時開新的一輪：到期該複習的排前面，再接還沒記住的單字（洗牌）
  // 等資料讀回、畫面載入後才洗牌
  useEffect(() => {
    if (!loaded || !hydrated || session) return;
    if (remaining > 0) {
      saveFlashcardSession(sessionKey, {
        ids: [...dueKnown, ...shuffle(unknown)].map((w) => w.id),
        index: 0,
        known: 0,
        direction: saved?.direction ?? 'ja-zh',
      });
    }
    // 只在讀回資料、換一疊或沒有進度時開新的一輪
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, hydrated, sessionKey, session === undefined]);

  if (useDepsChanged([sessionKey])) setFlipped(false);

  if (!loaded) return null;

  const progress = (
    <ThemedText type="small" themeColor="textSecondary" style={[styles.count, styles.center]}>
      {level}・已記住 {knownCount} / {words.length} 個單字
    </ThemedText>
  );

  const knownLink = knownCount > 0 && (
    <ChipButton label={`查看已記住的 ${knownCount} 個單字 ›`} onPress={onShowKnown} />
  );

  const resetButton = knownCount > 0 && (
    <SecondaryButton
      label="重設已記住的單字"
      onPress={() => {
        resetKnownWords(words.map((w) => w.id));
        saveFlashcardSession(sessionKey, null);
      }}
    />
  );

  // 這一疊全部記住了
  if (remaining === 0 && (!session || session.index >= session.ids.length)) {
    return (
      <View style={styles.summary}>
        <DetectiveEmblem />
        <ThemedText type="smallBold" style={[styles.label, { color: theme.accent }]}>
          {level} 單字全部記住了！
        </ThemedText>
        {progress}
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          真是名偵探！現在沒有要複習的單字，已記住的單字到了排定的複習時間會再出現。
        </ThemedText>
        {knownLink}
        {resetButton}
      </View>
    );
  }

  if (!session) return null;

  const deck = session.ids.map((id) => byId.get(id)!);
  const { index, known, direction } = session;

  if (index >= deck.length) {
    const unsure = deck.length - known;
    return (
      <View style={styles.summary}>
        <DetectiveEmblem />
        <ThemedText type="smallBold" style={[styles.label, { color: theme.accent }]}>
          這一輪完成
        </ThemedText>
        <ThemedText style={styles.score}>
          {known} / {deck.length}
        </ThemedText>
        {progress}
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          {unsure > 0
            ? `還不熟的 ${unsure} 個單字已加入錯題本，下一輪會再出現。`
            : '這一輪全部都記住了！'}
        </ThemedText>
        <PrimaryButton
          label={`繼續下一輪（${remaining} 個）`}
          onPress={() => saveFlashcardSession(sessionKey, null)}
        />
        {knownLink}
        {resetButton}
      </View>
    );
  }

  const word = deck[index];

  const answer = (remembered: boolean) => {
    recordStudy(word.id, remembered);
    setWordKnown(word.id, remembered);
    if (!remembered) addMistake(word.id);
    setFlipped(false);
    saveFlashcardSession(sessionKey, {
      ...session,
      index: index + 1,
      known: known + (remembered ? 1 : 0),
    });
  };

  const flipDirection = () => {
    saveFlashcardSession(sessionKey, {
      ...session,
      direction: direction === 'ja-zh' ? 'zh-ja' : 'ja-zh',
    });
    setFlipped(false);
  };

  return (
    <View style={styles.container}>
      {/* 小工具：切換方向、查看已記住的單字 */}
      <View style={styles.toolbar}>
        <ChipButton
          label={`${DIRECTION_LABELS[direction]} ⇄`}
          accessibilityLabel={`切換翻卡方向，目前是${DIRECTION_LABELS[direction]}`}
          onPress={flipDirection}
        />
        <ChipButton
          label={`已記住 ${knownCount} ›`}
          accessibilityLabel={`查看已記住的 ${knownCount} 個單字`}
          onPress={onShowKnown}
        />
      </View>
      <ThemedText type="small" themeColor="textSecondary" style={styles.count}>
        第 {index + 1} / {deck.length} 張・共 {words.length} 個單字
        {dueKnown.length > 0 ? `・${dueKnown.length} 個到了複習時間` : ''}
      </ThemedText>
      <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
        <View
          style={[
            styles.trackFill,
            { backgroundColor: theme.accent, width: `${(index / deck.length) * 100}%` },
          ]}
        />
      </View>

      {/* 換卡時用 key 重新建立，新卡片會直接是正面 */}
      <Flashcard
        key={`${word.id}-${direction}`}
        word={word}
        flipped={flipped}
        onFlip={() => setFlipped(true)}
        reverse={direction === 'zh-ja'}
      />

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
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
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
