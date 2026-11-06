import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerOption } from '@/components/quiz/answer-option';
import { ThemedText } from '@/components/themed-text';
import { ChipButton } from '@/components/ui/chip-button';
import { LoadingNote } from '@/components/ui/loading-note';
import { PrimaryButton } from '@/components/ui/primary-button';
import { RubyText } from '@/components/ui/ruby-text';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SpeakButton } from '@/components/ui/speak-button';
import { Spacing } from '@/constants/theme';
import type { TravelHeard, TravelKanji, TravelPhrase } from '@/data/travel';
import { useTravelData, type TravelData } from '@/data/travel-data';
import { useTheme } from '@/hooks/use-theme';
import { stripRuby } from '@/lib/furigana';
import { shuffle } from '@/lib/quiz';

type Tab = 'phrases' | 'heard' | 'kanji';

const TABS: { value: Tab; label: string }[] = [
  { value: 'phrases', label: '情境會話' },
  { value: 'heard', label: '常聽到的話' },
  { value: 'kanji', label: '漢字大不同' },
];

const INTRO: Record<Tab, string> = {
  phrases: '自由行最常用到的句子。點喇叭聽發音，照著唸就能用。',
  heard: '店員、車站廣播常聽到的話，以及可以怎麼回答。',
  kanji: '寫法和中文一樣，意思卻不同的詞，最容易讓台灣人誤會。',
};

/** 一輪練習最多幾題 */
const ROUND = 10;

/** 生活旅行用語：情境會話、日本人這樣說、中日漢字大不同；可以瀏覽，也可以練習 */
export function TravelGuide() {
  const data = useTravelData();
  if (!data) return <LoadingNote text="載入生活旅行用語…" />;
  return <TravelContent data={data} />;
}

function TravelContent({ data }: { data: TravelData }) {
  const [tab, setTab] = useState<Tab>('phrases');
  const [scene, setScene] = useState<string | null>(null);
  const [practice, setPractice] = useState(false);

  const scenes = useMemo(() => {
    if (tab === 'kanji') return [];
    const list = tab === 'phrases' ? data.phrases : data.heard;
    return [...new Set(list.map((item) => item.scene))];
  }, [tab, data]);

  const phrases = data.phrases.filter((p) => !scene || p.scene === scene);
  const heard = data.heard.filter((h) => !scene || h.scene === scene);
  const count =
    tab === 'phrases' ? phrases.length : tab === 'heard' ? heard.length : data.kanji.length;

  const changeTab = (next: Tab) => {
    setTab(next);
    setScene(null);
    setPractice(false);
  };

  return (
    <View style={styles.container}>
      <SegmentedControl options={TABS} value={tab} onChange={changeTab} />
      <ThemedText type="small" themeColor="textSecondary">
        {INTRO[tab]}
      </ThemedText>

      {scenes.length > 0 && !practice && (
        <View style={styles.chips}>
          <ChipButton label="全部" filled={scene === null} onPress={() => setScene(null)} />
          {scenes.map((s) => (
            <ChipButton key={s} label={s} filled={scene === s} onPress={() => setScene(s)} />
          ))}
        </View>
      )}

      {practice ? (
        <TravelPractice
          // 換分類時重新出題
          key={`${tab}-${scene}`}
          tab={tab}
          phrases={phrases}
          heard={heard}
          all={data}
          onExit={() => setPractice(false)}
        />
      ) : (
        <>
          <PrimaryButton
            label={`練習這些（${Math.min(ROUND, count)} 題）`}
            onPress={() => setPractice(true)}
          />
          {tab === 'phrases' && phrases.map((p) => <PhraseCard key={p.id} item={p} />)}
          {tab === 'heard' && heard.map((h) => <HeardCard key={h.id} item={h} />)}
          {tab === 'kanji' && data.kanji.map((k) => <KanjiCard key={k.id} item={k} />)}
        </>
      )}
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
      {children}
    </View>
  );
}

function SceneTag({ scene }: { scene: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.sceneTag, { borderColor: theme.border }]}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.sceneText}>
        {scene}
      </ThemedText>
    </View>
  );
}

function PhraseCard({ item }: { item: TravelPhrase }) {
  const theme = useTheme();
  return (
    <Card>
      <SceneTag scene={item.scene} />
      <View style={styles.row}>
        <View style={styles.flex}>
          <RubyText annotated={item.ja} fontSize={19} fontWeight={700} />
        </View>
        <SpeakButton text={stripRuby(item.ja)} />
      </View>
      <ThemedText style={{ color: theme.accent }}>{item.zh}</ThemedText>
      {item.note && <Note text={item.note} />}
    </Card>
  );
}

function HeardCard({ item }: { item: TravelHeard }) {
  const theme = useTheme();
  return (
    <Card>
      <SceneTag scene={item.scene} />
      <View style={styles.row}>
        <View style={styles.flex}>
          <RubyText annotated={item.ja} fontSize={18} fontWeight={700} />
        </View>
        <SpeakButton text={stripRuby(item.ja)} />
      </View>
      <ThemedText style={{ color: theme.accent }}>{item.zh}</ThemedText>
      {item.reply && (
        <View style={[styles.reply, { borderLeftColor: theme.gold }]}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            可以這樣回答
          </ThemedText>
          <View style={styles.row}>
            <View style={styles.flex}>
              <RubyText annotated={item.reply.ja} fontSize={16} />
            </View>
            <SpeakButton text={stripRuby(item.reply.ja)} />
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {item.reply.zh}
          </ThemedText>
        </View>
      )}
      {item.note && <Note text={item.note} />}
    </Card>
  );
}

function KanjiCard({ item }: { item: TravelKanji }) {
  const theme = useTheme();
  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.flex}>
          <ThemedText type="small" themeColor="textSecondary">
            {item.reading}
          </ThemedText>
          <ThemedText style={styles.kanji}>{item.word}</ThemedText>
        </View>
        <SpeakButton text={item.reading} />
      </View>
      <ThemedText>
        <ThemedText type="smallBold">日文意思：</ThemedText>
        <ThemedText style={{ color: theme.accent }}>{item.meaning}</ThemedText>
      </ThemedText>
      <View style={[styles.misread, { borderColor: theme.gold }]}>
        <ThemedText type="smallBold">✗ 容易誤會成</ThemedText>
        <RubyText annotated={item.misread} fontSize={14} />
      </View>
      <View style={styles.row}>
        <View style={styles.flex}>
          <RubyText annotated={item.example.ja} />
          <ThemedText type="small" themeColor="textSecondary">
            {item.example.zh}
          </ThemedText>
        </View>
        <SpeakButton text={stripRuby(item.example.ja)} />
      </View>
    </Card>
  );
}

function Note({ text }: { text: string }) {
  return (
    <View style={styles.note}>
      <ThemedText type="small" themeColor="textSecondary">
        💡
      </ThemedText>
      <View style={styles.flex}>
        <RubyText annotated={text} fontSize={13} />
      </View>
    </View>
  );
}

// ── 練習：情境會話看中文選日文、日本人這樣說聽日文選中文、漢字大不同看漢字選日文意思 ──

type PracticeQuestion = {
  id: string;
  /** 題目（日文時有注音標記） */
  prompt: string;
  promptIsJapanese: boolean;
  /** 題目要朗讀的日文（可以聽） */
  speak?: string;
  answer: string;
  options: string[];
  /** 作答後顯示的補充 */
  after: { ja?: string; zh?: string; note?: string };
};

/** 題目取自目前篩選的情境，錯誤選項從同一類的全部內容挑（情境題目少時也有四個選項） */
function buildQuestions(
  tab: Tab,
  phrases: TravelPhrase[],
  heard: TravelHeard[],
  all: TravelData,
): PracticeQuestion[] {
  const pickOptions = (answer: string, pool: string[]) =>
    shuffle([answer, ...shuffle([...new Set(pool)].filter((o) => o !== answer)).slice(0, 3)]);
  if (tab === 'phrases') {
    return shuffle(phrases)
      .slice(0, ROUND)
      .map((p) => ({
        id: p.id,
        prompt: p.zh,
        promptIsJapanese: false,
        answer: stripRuby(p.ja),
        options: pickOptions(
          stripRuby(p.ja),
          all.phrases.map((x) => stripRuby(x.ja)),
        ),
        after: { ja: p.ja, note: p.note },
      }));
  }
  if (tab === 'heard') {
    return shuffle(heard)
      .slice(0, ROUND)
      .map((h) => ({
        id: h.id,
        prompt: h.ja,
        promptIsJapanese: true,
        speak: stripRuby(h.ja),
        answer: h.zh,
        options: pickOptions(
          h.zh,
          all.heard.map((x) => x.zh),
        ),
        after: { note: h.note, ...(h.reply && { ja: h.reply.ja, zh: `回答：${h.reply.zh}` }) },
      }));
  }
  return shuffle(all.kanji)
    .slice(0, ROUND)
    .map((k) => ({
      id: k.id,
      prompt: k.word,
      promptIsJapanese: false,
      speak: k.reading,
      answer: k.meaning,
      options: pickOptions(
        k.meaning,
        all.kanji.map((x) => x.meaning),
      ),
      after: { ja: k.example.ja, zh: k.example.zh, note: `${k.reading}。容易誤會成：${k.misread}` },
    }));
}

function TravelPractice({
  tab,
  phrases,
  heard,
  all,
  onExit,
}: {
  tab: Tab;
  phrases: TravelPhrase[];
  heard: TravelHeard[];
  all: TravelData;
  onExit: () => void;
}) {
  const theme = useTheme();
  const [round, setRound] = useState(0);
  const questions = useMemo(
    () => buildQuestions(tab, phrases, heard, all),
    // 「再練一輪」時重新出題
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [round],
  );
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const q = questions[index];

  if (!q) {
    return (
      <View style={styles.container}>
        <ThemedText type="subtitle" style={styles.center}>
          答對 {score} / {questions.length} 題
        </ThemedText>
        <PrimaryButton
          label="再練一輪"
          onPress={() => {
            setRound((r) => r + 1);
            setIndex(0);
            setScore(0);
            setPicked(null);
          }}
        />
        <SecondaryButton label="回到列表" onPress={onExit} />
      </View>
    );
  }

  const pick = (option: string) => {
    if (picked !== null) return;
    setPicked(option);
    if (option === q.answer) setScore((s) => s + 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ThemedText type="smallBold" themeColor="textSecondary" style={styles.flex}>
          第 {index + 1} / {questions.length} 題・答對 {score}
        </ThemedText>
        <ChipButton label="結束練習" onPress={onExit} />
      </View>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {tab === 'phrases'
          ? '這個情況日文怎麼說？'
          : tab === 'heard'
            ? '聽到這句話，是什麼意思？'
            : '這個詞在日文是什麼意思？'}
      </ThemedText>
      <Card>
        <View style={styles.row}>
          <View style={styles.flex}>
            {q.promptIsJapanese ? (
              <RubyText annotated={q.prompt} fontSize={20} fontWeight={700} />
            ) : (
              <ThemedText style={tab === 'kanji' ? styles.kanji : styles.prompt}>
                {q.prompt}
              </ThemedText>
            )}
          </View>
          {q.speak && <SpeakButton text={q.speak} />}
        </View>
      </Card>
      <View style={styles.options}>
        {q.options.map((option) => (
          <AnswerOption
            key={option}
            label={option}
            state={
              picked === null
                ? 'idle'
                : option === q.answer
                  ? 'correct'
                  : option === picked
                    ? 'wrong'
                    : 'dimmed'
            }
            disabled={picked !== null}
            onPress={() => pick(option)}
          />
        ))}
      </View>
      {picked !== null && (
        <>
          <Card>
            <ThemedText
              type="smallBold"
              style={{ color: picked === q.answer ? theme.success : theme.accent }}
              accessibilityLiveRegion="polite">
              {picked === q.answer ? '○ 答對了！' : `× 正確答案：${q.answer}`}
            </ThemedText>
            {q.after.ja && (
              <View style={styles.row}>
                <View style={styles.flex}>
                  <RubyText annotated={q.after.ja} fontSize={16} />
                </View>
                <SpeakButton text={stripRuby(q.after.ja)} />
              </View>
            )}
            {q.after.zh && (
              <ThemedText type="small" themeColor="textSecondary">
                {q.after.zh}
              </ThemedText>
            )}
            {q.after.note && <Note text={q.after.note} />}
          </Card>
          <PrimaryButton
            label={index + 1 >= questions.length ? '看結果' : '下一題'}
            onPress={() => {
              setPicked(null);
              setIndex((i) => i + 1);
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  sceneTag: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.one + 2,
  },
  sceneText: {
    fontSize: 11,
    lineHeight: 16,
  },
  reply: {
    borderLeftWidth: 3,
    paddingLeft: Spacing.two,
    gap: Spacing.one,
  },
  note: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  misread: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Spacing.two,
    padding: Spacing.two,
    gap: Spacing.half,
  },
  kanji: {
    fontSize: 30,
    lineHeight: 40,
    fontWeight: 700,
  },
  prompt: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 700,
  },
  options: {
    gap: Spacing.two,
  },
  center: {
    textAlign: 'center',
  },
});
