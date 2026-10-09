import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerOption, type AnswerState } from './answer-option';

import { DetectiveEmblem } from '@/components/detective/detective-emblem';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import { VOCAB_BY_LEVEL, type JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { buildRound, type QuizQuestion } from '@/lib/quiz';
import { recordChallengeScore, useBestScores } from '@/stores/challenge-store';
import { addMistake } from '@/stores/mistakes-store';

type TimedChallengeProps = {
  level: JlptLevel;
  /** 開始挑戰時呼叫，讓外層捲回最上面 */
  onStart?: () => void;
};

/** 挑戰時間（秒） */
const DURATION = 60;
/** 作答後顯示對錯多久再換下一題（毫秒） */
const FEEDBACK_MS = 450;
/** 一次準備的題數，60 秒內答不完 */
const QUESTION_POOL = 150;

type Phase = 'ready' | 'running' | 'done';

/** 限時挑戰：60 秒內看日文選中文，答對越多越好；每個等級記錄最高分 */
export function TimedChallenge({ level, onStart }: TimedChallengeProps) {
  const theme = useTheme();
  const best = useBestScores()[level] ?? 0;
  const [phase, setPhase] = useState<Phase>('ready');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [remaining, setRemaining] = useState(DURATION);
  const [previousBest, setPreviousBest] = useState(0);
  const endAt = useRef(0);
  const scoreRef = useRef(0);

  // 換等級時回到開始畫面
  useEffect(() => {
    setPhase('ready');
  }, [level]);

  // 倒數計時：以結束時間計算，畫面卡頓也不會算錯
  useEffect(() => {
    if (phase !== 'running') return;
    const timer = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setPhase('done');
        recordChallengeScore(level, scoreRef.current);
      }
    }, 200);
    return () => clearInterval(timer);
  }, [phase, level]);

  // 作答後停一下顯示對錯，再自動換題
  useEffect(() => {
    if (picked === null || phase !== 'running') return;
    const timeout = setTimeout(() => {
      setPicked(null);
      setIndex((i) => (i + 1) % questions.length);
    }, FEEDBACK_MS);
    return () => clearTimeout(timeout);
  }, [picked, phase, questions.length]);

  const start = () => {
    setQuestions(buildRound(VOCAB_BY_LEVEL[level], QUESTION_POOL));
    setIndex(0);
    setPicked(null);
    setCorrect(0);
    setWrong(0);
    scoreRef.current = 0;
    setPreviousBest(best);
    setRemaining(DURATION);
    endAt.current = Date.now() + DURATION * 1000;
    setPhase('running');
    onStart?.();
  };

  if (phase === 'ready') {
    return (
      <View style={styles.center}>
        <DetectiveEmblem />
        <ThemedText type="smallBold" style={[styles.label, { color: theme.accent }]}>
          {level} 限時挑戰
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.text}>
          {DURATION} 秒內看日文選中文，能答對幾題？答錯的單字會加入錯題本。
        </ThemedText>
        <ThemedText style={[styles.best, { color: theme.gold }]}>最高紀錄：{best} 題</ThemedText>
        <PrimaryButton label="開始挑戰" onPress={start} />
      </View>
    );
  }

  if (phase === 'done') {
    const isRecord = correct > previousBest;
    return (
      <View style={styles.center}>
        <DetectiveEmblem />
        <ThemedText type="smallBold" style={[styles.label, { color: theme.accent }]}>
          時間到！
        </ThemedText>
        <ThemedText style={styles.score}>{correct} 題</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          答錯 {wrong} 題
        </ThemedText>
        <ThemedText style={[styles.best, { color: theme.gold }]}>
          {isRecord ? '刷新紀錄！真相只有一個！' : `最高紀錄：${Math.max(best, correct)} 題`}
        </ThemedText>
        <PrimaryButton label="再挑戰一次" onPress={start} />
      </View>
    );
  }

  const question = questions[index];
  const getState = (option: string): AnswerState => {
    if (picked === null) return 'idle';
    if (option === question.word.meaning) return 'correct';
    if (option === picked) return 'wrong';
    return 'dimmed';
  };

  const pick = (option: string) => {
    if (picked !== null) return;
    setPicked(option);
    if (option === question.word.meaning) {
      scoreRef.current += 1;
      setCorrect((c) => c + 1);
    } else {
      setWrong((w) => w + 1);
      addMistake(question.word.id);
    }
  };

  const urgent = remaining <= 10;

  return (
    <View style={styles.container}>
      <View style={styles.statusRow}>
        <ThemedText
          type="smallBold"
          style={[styles.timer, { color: urgent ? theme.accent : theme.text }]}
          accessibilityLabel={`剩下 ${remaining} 秒`}>
          ⏱ {remaining} 秒
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.tabular}>
          答對 {correct}・答錯 {wrong}
        </ThemedText>
      </View>
      <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
        <View
          style={[
            styles.trackFill,
            {
              backgroundColor: urgent ? theme.accent : theme.gold,
              width: `${(remaining / DURATION) * 100}%`,
            },
          ]}
        />
      </View>
      <View
        style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <ThemedText style={styles.word} adjustsFontSizeToFit numberOfLines={1}>
          {question.word.word}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {picked !== null && question.word.reading !== question.word.word
            ? question.word.reading
            : ' '}
        </ThemedText>
      </View>
      <View style={styles.options}>
        {question.options.map((option) => (
          <AnswerOption
            key={option}
            label={option}
            state={getState(option)}
            disabled={picked !== null}
            onPress={() => pick(option)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  center: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
  },
  label: {
    letterSpacing: 2,
    marginTop: Spacing.two,
  },
  text: {
    textAlign: 'center',
  },
  best: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  score: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: 700,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timer: {
    fontSize: 18,
    fontVariant: ['tabular-nums'],
  },
  tabular: {
    fontVariant: ['tabular-nums'],
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: -Spacing.two,
  },
  trackFill: {
    height: '100%',
  },
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    alignItems: 'center',
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    gap: Spacing.one,
  },
  word: {
    fontSize: 34,
    lineHeight: 44,
    fontWeight: 700,
  },
  options: {
    gap: Spacing.two,
  },
});
