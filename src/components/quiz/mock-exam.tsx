import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ExamQuestionView } from './exam-question-view';
import { MockExamIntro } from './mock-exam-intro';
import { MockExamReport } from './mock-exam-report';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';
import { EXAM_TYPE_LABELS } from '@/data/exam';
import type { JlptLevel } from '@/data/vocab';
import { useDepsChanged } from '@/hooks/use-hydrated';
import { useTheme } from '@/hooks/use-theme';
import {
  buildMockExam,
  restoreMockExam,
  scoreMockExam,
  type MockExamResult,
  type MockSitting,
} from '@/lib/mock-exam';
import { stopSpeaking } from '@/lib/speech';
import { addMistake, useMistakes } from '@/stores/mistakes-store';
import {
  getMockExamSeen,
  markMockExamSeen,
  recordMockExam,
  type MockExamRecord,
} from '@/stores/mock-exam-store';
import { recordStudy } from '@/stores/study-store';

type Phase = 'intro' | 'sitting' | 'break' | 'report' | 'record';

type MockExamProps = {
  level: JlptLevel;
  /** 換題、換節時呼叫，讓外層捲回最上面 */
  onScrollTop?: () => void;
};

function formatTime(ms: number) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * 完整模擬考：說明 → 第 1 節 → 休息 → 第 2 節 → … → 成績單。
 * 每節計時（用截止時間計算，切到背景再回來也準確），時間到自動交卷。
 */
export function MockExam({ level, onScrollTop }: MockExamProps) {
  const theme = useTheme();
  const [phase, setPhase] = useState<Phase>('intro');
  // 說明頁先用一份預覽（題數、時間），按開始時再重新出題、打亂選項
  const preview = useMemo(() => buildMockExam(level), [level]);
  const mistakes = useMistakes();
  // 從「最近成績」打開的舊考試紀錄
  const [record, setRecord] = useState<MockExamRecord | null>(null);
  const [sittings, setSittings] = useState<MockSitting[]>(preview);
  const [sittingIndex, setSittingIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [deadline, setDeadline] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [confirming, setConfirming] = useState(false);
  const [result, setResult] = useState<MockExamResult | null>(null);
  const finishing = useRef(false);

  // 換等級時回到說明頁
  if (useDepsChanged([preview])) {
    setPhase('intro');
    setSittings(preview);
  }

  const sitting = sittings[sittingIndex];
  const remaining = Math.max(0, deadline - now);

  const startSitting = (index: number) => {
    setSittingIndex(index);
    setQuestionIndex(0);
    setConfirming(false);
    setDeadline(Date.now() + sittings[index].seconds * 1000);
    setNow(Date.now());
    finishing.current = false;
    setPhase('sitting');
    onScrollTop?.();
  };

  const start = () => {
    // 錯題本的題目會再出，其餘優先出沒考過的
    const fresh = buildMockExam(level, { mistakes, seen: getMockExamSeen(level) });
    setSittings(fresh);
    setAnswers({});
    setResult(null);
    setSittingIndex(0);
    setQuestionIndex(0);
    setConfirming(false);
    setDeadline(Date.now() + fresh[0].seconds * 1000);
    setNow(Date.now());
    finishing.current = false;
    setPhase('sitting');
    onScrollTop?.();
  };

  const finishSitting = () => {
    if (finishing.current) return;
    finishing.current = true;
    stopSpeaking();
    if (sittingIndex + 1 < sittings.length) {
      setPhase('break');
      onScrollTop?.();
      return;
    }
    // 全部考完：計分、記錄、把錯題加入錯題本
    const items = sittings.flatMap((s) => s.questions);
    const scored = scoreMockExam(level, items, answers);
    for (const item of items) {
      const correct = answers[item.question.id] === item.answer;
      recordStudy(item.question.id, correct);
      if (!correct) addMistake(item.question.id);
    }
    markMockExamSeen(
      level,
      items.map((item) => item.question.id),
    );
    recordMockExam(level, {
      date: new Date().toISOString(),
      total: scored.total,
      passed: scored.passed,
      sections: scored.sections.map((s) => ({
        label: s.section.label,
        score: s.score,
        max: s.section.max,
      })),
      items: items.map((item) => ({
        id: item.question.id,
        mine: answers[item.question.id] ?? null,
      })),
    });
    setResult(scored);
    setPhase('report');
    onScrollTop?.();
  };

  // 計時：每秒更新一次，時間到自動交卷（用截止時間算，切到背景再回來也準確）
  const tick = useEffectEvent(() => {
    const time = Date.now();
    setNow(time);
    if (deadline > 0 && time >= deadline) finishSitting();
  });
  useEffect(() => {
    if (phase !== 'sitting') return;
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  // 離開模擬考（切換模式、等級或分頁）時停止聽解播放
  useEffect(() => () => stopSpeaking(), []);

  if (phase === 'intro') {
    return (
      <MockExamIntro
        level={level}
        sittings={preview}
        onStart={start}
        onOpenRecord={(opened) => {
          setRecord(opened);
          setPhase('record');
          onScrollTop?.();
        }}
      />
    );
  }

  if (phase === 'record' && record?.items) {
    return (
      <SavedReport
        level={level}
        record={record}
        onRetry={start}
        onBack={() => {
          setPhase('intro');
          onScrollTop?.();
        }}
      />
    );
  }

  if (phase === 'report' && result) {
    return (
      <MockExamReport
        result={result}
        items={sittings.flatMap((s) => s.questions)}
        answers={answers}
        onRetry={start}
        onBack={() => {
          setPhase('intro');
          onScrollTop?.();
        }}
      />
    );
  }

  if (phase === 'break') {
    const nextSitting = sittings[sittingIndex + 1];
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.card,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          ]}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            第 {sittingIndex + 1} 節結束
          </ThemedText>
          <ThemedText type="small">
            下一節：{nextSitting.label}（{nextSitting.questions.length} 題・
            {nextSitting.seconds / 60} 分鐘）
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            可以先休息一下，準備好再開始。開始後才會計時。
          </ThemedText>
        </View>
        <PrimaryButton label="開始下一節" onPress={() => startSitting(sittingIndex + 1)} />
      </View>
    );
  }

  const item = sitting.questions[questionIndex];
  const picked = answers[item.question.id] ?? null;
  const answeredCount = sitting.questions.filter((q) => answers[q.question.id]).length;
  const unanswered = sitting.questions.length - answeredCount;
  const isLast = questionIndex + 1 >= sitting.questions.length;
  const lowTime = remaining <= 60_000;

  const goTo = (index: number) => {
    setQuestionIndex(index);
    setConfirming(false);
    onScrollTop?.();
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        <View style={styles.headerText}>
          <ThemedText type="smallBold" numberOfLines={2}>
            第 {sittingIndex + 1} 節　{sitting.label}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            已作答 {answeredCount} / {sitting.questions.length}
          </ThemedText>
        </View>
        <View
          accessibilityLabel={`剩餘時間 ${formatTime(remaining)}`}
          style={[styles.timer, { borderColor: lowTime ? theme.accent : theme.gold }]}>
          <ThemedText style={[styles.timerText, { color: lowTime ? theme.accent : theme.text }]}>
            {formatTime(remaining)}
          </ThemedText>
        </View>
      </View>

      {/* 題號：點了可以跳到那一題，已作答的塗滿 */}
      <View style={styles.numbers}>
        {sitting.questions.map((q, i) => {
          const done = Boolean(answers[q.question.id]);
          const current = i === questionIndex;
          return (
            <Pressable
              key={q.question.id}
              accessibilityRole="button"
              accessibilityLabel={`第 ${i + 1} 題${done ? '，已作答' : ''}`}
              onPress={() => goTo(i)}
              hitSlop={2}
              style={[
                styles.number,
                {
                  borderColor: current ? theme.accent : theme.border,
                  backgroundColor: done ? theme.primary : theme.backgroundElement,
                },
              ]}>
              <ThemedText
                type="smallBold"
                style={[
                  styles.numberText,
                  { color: done ? theme.onPrimary : theme.textSecondary },
                ]}>
                {i + 1}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      <ThemedText type="small" themeColor="textSecondary">
        第 {questionIndex + 1} 題・{EXAM_TYPE_LABELS[item.question.type]}
      </ThemedText>
      <ExamQuestionView
        item={item}
        picked={picked}
        reveal={false}
        getState={(option) => (option === picked ? 'selected' : 'idle')}
        onPick={(option) => setAnswers((current) => ({ ...current, [item.question.id]: option }))}
      />

      <View style={styles.navRow}>
        <View style={styles.flex}>
          <SecondaryButton label="上一題" onPress={() => goTo(Math.max(0, questionIndex - 1))} />
        </View>
        {!isLast && (
          <View style={styles.flex}>
            <PrimaryButton label="下一題" onPress={() => goTo(questionIndex + 1)} />
          </View>
        )}
      </View>

      {confirming ? (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.backgroundElement, borderColor: theme.accent },
          ]}>
          <ThemedText type="smallBold">
            {unanswered > 0 ? `還有 ${unanswered} 題沒作答，確定要交卷嗎？` : '確定要交卷嗎？'}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            交卷後就不能再修改這一節的答案。
          </ThemedText>
          <PrimaryButton label="確定交卷" onPress={finishSitting} />
          <SecondaryButton label="繼續作答" onPress={() => setConfirming(false)} />
        </View>
      ) : (
        <SecondaryButton
          label={sittingIndex + 1 < sittings.length ? '交卷，結束這一節' : '交卷，查看成績'}
          onPress={() => setConfirming(true)}
        />
      )}
    </View>
  );
}

type SavedReportProps = {
  level: JlptLevel;
  record: MockExamRecord;
  onRetry: () => void;
  onBack: () => void;
};

/** 重看以前的模擬考：找回當時的題目和答案，重新算一次成績單 */
function SavedReport({ level, record, onRetry, onBack }: SavedReportProps) {
  const restored = useMemo(() => restoreMockExam(level, record.items ?? []), [level, record]);
  const result = useMemo(
    () => scoreMockExam(level, restored.items, restored.answers),
    [level, restored],
  );
  return (
    <MockExamReport
      result={{ ...result, total: record.total, passed: record.passed }}
      items={restored.items}
      answers={restored.answers}
      date={record.date}
      onRetry={onRetry}
      onBack={onBack}
    />
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
    gap: Spacing.two,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  timer: {
    borderWidth: 2,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    minWidth: 76,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: 700,
    fontVariant: ['tabular-nums'],
  },
  numbers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.one,
  },
  number: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 13,
    fontVariant: ['tabular-nums'],
  },
  navRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
});
