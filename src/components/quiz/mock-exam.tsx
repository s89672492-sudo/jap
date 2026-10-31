import { useIsFocused } from 'expo-router';
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, View } from 'react-native';

import { ExamQuestionView } from './exam-question-view';
import { QuestionNavigator } from './mock-exam/question-navigator';
import { SubmitReview } from './mock-exam/submit-review';
import { MockExamIntro } from './mock-exam-intro';
import { MockExamReport } from './mock-exam-report';

import { ThemedText } from '@/components/themed-text';
import { LoadingNote } from '@/components/ui/loading-note';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';
import { EXAM_SUBCATEGORY_LABELS, EXAM_TYPE_LABELS, type ExamQuestion } from '@/data/exam';
import { useAllLevelData } from '@/data/level-data';
import type { JlptLevel } from '@/data/vocab';
import { useDepsChanged } from '@/hooks/use-hydrated';
import { useTheme } from '@/hooks/use-theme';
import { useFuriganaLoaded } from '@/lib/furigana';
import {
  RANDOM_PAPER_ID,
  RANDOM_PAPER_VERSION,
  buildFixedPaper,
  buildRandomPaper,
  findPaper,
  latestPaperVersion,
  paperLabel,
} from '@/lib/exam-paper';
import { newSeed } from '@/lib/exam-seed';
import { restoreMockExam, scoreMockExam } from '@/lib/mock-exam';
import { finishMockExam, type FinishedExam } from '@/lib/mock-exam-runner';
import {
  MOCK_EXAM_MODE_LABELS,
  addEvent,
  answerQuestion,
  canAnswer,
  createDraft,
  expireIfNeeded,
  goToQuestion,
  markPlayed,
  startNextSitting,
  submitSitting,
  toggleMark,
  type MockExamDraft,
  type MockExamMode,
} from '@/lib/mock-exam-session';
import { answerSeconds } from '@/lib/audio-manager';
import { stopSpeaking } from '@/lib/speech';
import { useMistakes } from '@/stores/mistakes-store';
import {
  getMockExamDraft,
  saveMockExamDraft,
  useMockExamDraft,
  useMockExamDraftLoaded,
  useMockExamSaveError,
} from '@/stores/mock-exam-draft-store';
import { getMockExamSeen, type MockExamRecord } from '@/stores/mock-exam-store';

type MockExamProps = {
  level: JlptLevel;
  /** 換題、換節時呼叫，讓外層捲回最上面 */
  onScrollTop?: () => void;
};

type Screen =
  | { kind: 'intro' }
  | { kind: 'report'; finished: FinishedExam }
  | { kind: 'record'; record: MockExamRecord };

function formatTime(ms: number) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** 題號旁的題型：讀解、聽解顯示細分的大問（例如「即時應答」） */
function questionLabel(question: ExamQuestion): string {
  if ((question.type === 'reading' || question.type === 'listening') && question.subcategory) {
    return EXAM_SUBCATEGORY_LABELS[question.subcategory];
  }
  return EXAM_TYPE_LABELS[question.type];
}

/** 這次打開 App 後才開始的考試（重新整理後接著考的不算），用來記錄「接著考」 */
const startedThisSession = new Set<string>();

/**
 * 完整模擬考：說明 → 第 1 節 → 休息 → 第 2 節 → … → 成績單。
 * 進行中的考試存在手機裡（mock-exam-draft），重新整理或關掉 App 後接著考；
 * 每節用截止時間計時，時間到自動交卷。
 */
export function MockExam(props: MockExamProps) {
  // 自動出題要用到全部等級的單字、文法和注音，載入後才開始
  const all = useAllLevelData();
  const furiganaReady = useFuriganaLoaded();
  const draftLoaded = useMockExamDraftLoaded();
  if (!all || !furiganaReady || !draftLoaded) return <LoadingNote text="準備模擬考題庫…" />;
  return <MockExamContent {...props} />;
}

function MockExamContent({ level, onScrollTop }: MockExamProps) {
  const draft = useMockExamDraft();
  const mistakes = useMistakes();
  const [view, setView] = useState<Screen>({ kind: 'intro' });

  // 換等級時回到說明頁（進行中的考試不受影響，照原本的等級考完）
  if (useDepsChanged([level]) && view.kind !== 'report') setView({ kind: 'intro' });

  const start = (mode: MockExamMode, paperId: string) => {
    const paper = paperId === RANDOM_PAPER_ID ? undefined : findPaper(level, paperId);
    const now = Date.now();
    let fresh: MockExamDraft;
    if (paper) {
      const version = latestPaperVersion(paper).version;
      fresh = createDraft(level, mode, buildFixedPaper(level, paper, version), now, {
        paperId: paper.id,
        paperVersion: version,
      });
    } else {
      // 錯題本的題目會再出，其餘優先出沒考過的；種子存進紀錄
      const seed = newSeed();
      const history = { mistakes, seen: getMockExamSeen(level) };
      fresh = createDraft(level, mode, buildRandomPaper(level, history, seed), now, {
        paperId: RANDOM_PAPER_ID,
        paperVersion: RANDOM_PAPER_VERSION,
        seed,
      });
    }
    startedThisSession.add(fresh.sessionId);
    saveMockExamDraft(fresh);
    setView({ kind: 'intro' });
    onScrollTop?.();
  };

  if (draft) {
    return (
      <MockExamSession
        draft={draft}
        onScrollTop={onScrollTop}
        onFinished={(finished) => {
          setView({ kind: 'report', finished });
          onScrollTop?.();
        }}
      />
    );
  }

  const backToIntro = () => {
    setView({ kind: 'intro' });
    onScrollTop?.();
  };

  if (view.kind === 'report') {
    return (
      <MockExamReport
        result={view.finished.result}
        items={view.finished.items}
        answers={view.finished.answers}
        record={view.finished.record}
        onRetry={backToIntro}
        onBack={backToIntro}
      />
    );
  }

  if (view.kind === 'record' && view.record.items) {
    return (
      <SavedReport level={level} record={view.record} onRetry={backToIntro} onBack={backToIntro} />
    );
  }

  return (
    <MockExamIntro
      level={level}
      onStart={start}
      onOpenRecord={(record) => {
        setView({ kind: 'record', record });
        onScrollTop?.();
      }}
    />
  );
}

type SessionProps = {
  draft: MockExamDraft;
  onScrollTop?: () => void;
  onFinished: (finished: FinishedExam) => void;
};

/** 進行中的考試：作答、休息。每個動作都存到手機 */
function MockExamSession({ draft, onScrollTop, onFinished }: SessionProps) {
  const theme = useTheme();
  const saveError = useMockExamSaveError();
  const focused = useIsFocused();
  const [now, setNow] = useState(() => Date.now());
  const [reviewing, setReviewing] = useState(false);
  const [confirmQuit, setConfirmQuit] = useState(false);
  // 正式模式的聽解：播完後的作答時間，時間到自動換下一題
  const [answerWindow, setAnswerWindow] = useState<{ id: string; until: number } | null>(null);
  const wasFocused = useRef(focused);

  /** 用手機裡最新的進度計算下一步並存檔（避免用到畫面上舊的資料） */
  const update = (fn: (current: MockExamDraft, time: number) => MockExamDraft) => {
    const current = getMockExamDraft();
    if (!current || current.sessionId !== draft.sessionId) return;
    const time = Date.now();
    const next = fn(current, time);
    // 存檔會更新 store，畫面跟著重畫
    if (next !== current) saveMockExamDraft(next);
  };

  const finish = async (final: MockExamDraft) => {
    stopSpeaking();
    const finished = await finishMockExam(final);
    if (finished) onFinished(finished);
  };

  /** 交出目前這一節（手動或時間到）；最後一節交卷後結算 */
  const submit = (auto: boolean) => {
    const current = getMockExamDraft();
    if (!current || current.sessionId !== draft.sessionId) return;
    const result = submitSitting(current, Date.now(), auto);
    if (result.draft === current) return;
    setReviewing(false);
    stopSpeaking();
    // 先存「這一節已交卷」，結算途中關掉 App 也不能回來重新作答
    saveMockExamDraft(result.draft).then(() => {
      if (result.finished) finish(result.draft);
    });
    if (!result.finished) onScrollTop?.();
  };

  // 計時：每秒檢查一次截止時間；剛打開（例如重新整理後）時間已經過了，也會自動交卷
  const tick = useEffectEvent(() => {
    const current = getMockExamDraft();
    const time = Date.now();
    setNow(time);
    if (!current || current.sessionId !== draft.sessionId) return;
    if (answerWindow && time >= answerWindow.until) {
      const questions = current.sittings[current.sittingIndex].questions;
      const onThatQuestion = questions[current.questionIndex]?.question.id === answerWindow.id;
      setAnswerWindow(null);
      if (onThatQuestion && current.questionIndex + 1 < questions.length) {
        saveMockExamDraft(goToQuestion(current, current.questionIndex + 1, time));
        onScrollTop?.();
      }
    }
    const expired = expireIfNeeded(current, time);
    if (!expired.expired) return;
    setReviewing(false);
    stopSpeaking();
    saveMockExamDraft(expired.draft).then(() => {
      if (expired.finished) finish(expired.draft);
    });
  });
  useEffect(() => {
    // 第一次檢查放到下一輪，不在 effect 裡直接更新畫面
    const first = setTimeout(tick, 0);
    if (draft.status !== 'sitting') return () => clearTimeout(first);
    const timer = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [draft.status, draft.sittingIndex]);

  // 重新整理或重新打開 App 後接著考：記一筆「接著考」
  const markResume = useEffectEvent(() => {
    if (!startedThisSession.has(draft.sessionId)) {
      startedThisSession.add(draft.sessionId);
      update((d, t) => addEvent(d, 'resume', t));
    }
  });
  useEffect(() => {
    markResume();
  }, []);

  // App 切到背景、離開考試畫面（其他分頁）都記下來
  const onAppState = useEffectEvent((state: string) => {
    if (state === 'background' || state === 'inactive') {
      update((d, t) => (d.status === 'sitting' ? addEvent(d, 'background', t) : d));
    } else if (state === 'active') {
      update((d, t) => (d.status === 'sitting' ? addEvent(d, 'foreground', t) : d));
    }
  });
  useEffect(() => {
    const sub = AppState.addEventListener('change', onAppState);
    return () => sub.remove();
  }, []);
  const onFocusChange = useEffectEvent((isFocused: boolean) => {
    if (isFocused === wasFocused.current) return;
    wasFocused.current = isFocused;
    if (!isFocused) stopSpeaking();
    update((d, t) => (d.status === 'sitting' ? addEvent(d, isFocused ? 'return' : 'leave', t) : d));
  });
  useEffect(() => {
    onFocusChange(focused);
  }, [focused]);

  // 離開模擬考畫面時停止聽解播放
  useEffect(() => () => stopSpeaking(), []);

  const saveWarning = saveError ? (
    <View style={[styles.warning, { borderColor: theme.accent }]} accessibilityLiveRegion="polite">
      <ThemedText type="smallBold" style={{ color: theme.accent }}>
        ⚠ 作答進度沒有存到手機
      </ThemedText>
      <ThemedText type="small">
        可能是儲存空間已滿或瀏覽器不允許存資料。可以繼續作答，但重新整理或關掉 App
        會遺失這次的進度。
      </ThemedText>
      <SecondaryButton
        label="再試一次儲存"
        onPress={() => update((d, t) => ({ ...d, updatedAt: t }))}
      />
    </View>
  ) : null;

  const quit = confirmQuit ? (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.accent },
      ]}>
      <ThemedText type="smallBold">放棄這次模擬考？</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        這次的作答不會計分，也不會留下成績紀錄。以前的成績、錯題本不受影響。
      </ThemedText>
      <PrimaryButton
        label="確定放棄"
        onPress={() => {
          stopSpeaking();
          saveMockExamDraft(null);
        }}
      />
      <SecondaryButton label="繼續考試" onPress={() => setConfirmQuit(false)} />
    </View>
  ) : (
    <Pressable
      accessibilityRole="button"
      onPress={() => setConfirmQuit(true)}
      style={({ pressed }) => [styles.quit, pressed && styles.pressed]}>
      <ThemedText type="small" themeColor="textSecondary">
        放棄這次考試
      </ThemedText>
    </Pressable>
  );

  const examTag = `${draft.level}・${paperLabel(draft.level, draft.paperId, draft.paperVersion)}・${MOCK_EXAM_MODE_LABELS[draft.mode]}`;

  if (draft.status === 'break') {
    const done = draft.sittingIndex;
    const next = draft.sittings[done + 1];
    const lastEvent = [...draft.events]
      .reverse()
      .find((e) => e.sitting === done && (e.kind === 'submit' || e.kind === 'auto-submit'));
    if (!next) {
      // 最後一節已交卷但還沒結算完（例如結算時關掉 App）：再結算一次
      return <FinishPending draft={draft} onFinish={finish} />;
    }
    return (
      <View style={styles.container}>
        {saveWarning}
        <View
          style={[
            styles.card,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          ]}>
          <ThemedText type="small" themeColor="textSecondary">
            {examTag}
          </ThemedText>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            第 {done + 1} 節結束{lastEvent?.kind === 'auto-submit' ? '（時間到，已自動交卷）' : ''}
          </ThemedText>
          <ThemedText type="small">
            下一節：{next.label}（{next.questions.length} 題・{next.seconds / 60} 分鐘）
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            可以先休息一下，準備好再開始。開始後才會計時；已交卷的節不能再修改。
          </ThemedText>
        </View>
        <PrimaryButton
          label="開始下一節"
          onPress={() => {
            update((d, t) => startNextSitting(d, t));
            onScrollTop?.();
          }}
        />
        {quit}
      </View>
    );
  }

  const sitting = draft.sittings[draft.sittingIndex];
  const item = sitting.questions[draft.questionIndex];
  const picked = draft.answers[item.question.id] ?? null;
  const marked = draft.marked.includes(item.question.id);
  const remaining = Math.max(0, draft.deadline - now);
  const lowTime = remaining <= 60_000;
  const isLastQuestion = draft.questionIndex + 1 >= sitting.questions.length;
  const isLastSitting = draft.sittingIndex + 1 >= draft.sittings.length;
  const open = canAnswer(draft, now);

  const goTo = (index: number) => {
    setReviewing(false);
    setAnswerWindow(null);
    update((d, t) => goToQuestion(d, index, t));
    onScrollTop?.();
  };

  return (
    <View style={styles.container}>
      {saveWarning}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        <View style={styles.headerText}>
          <ThemedText type="small" themeColor="textSecondary">
            {examTag}
          </ThemedText>
          <ThemedText type="smallBold" numberOfLines={2}>
            第 {draft.sittingIndex + 1} 節　{sitting.label}
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

      <QuestionNavigator
        questions={sitting.questions}
        answers={draft.answers}
        marked={draft.marked}
        current={draft.questionIndex}
        onJump={goTo}
      />

      <View style={styles.questionHead}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.flex}>
          第 {draft.questionIndex + 1} 題・{questionLabel(item.question)}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={marked ? '取消標記這一題' : '標記這一題，稍後檢查'}
          accessibilityState={{ selected: marked }}
          onPress={() => update((d, t) => toggleMark(d, item.question.id, t))}
          style={({ pressed }) => [
            styles.markButton,
            {
              borderColor: marked ? theme.gold : theme.border,
              backgroundColor: marked ? theme.backgroundSelected : theme.backgroundElement,
            },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold" style={{ color: marked ? theme.gold : theme.text }}>
            {marked ? '🚩 已標記' : '🚩 標記'}
          </ThemedText>
        </Pressable>
      </View>
      <ExamQuestionView
        item={item}
        picked={picked}
        reveal={false}
        listening={
          // 正式模式：聽解只播一次，播完後有固定的作答時間，接著自動換下一題
          draft.mode === 'official'
            ? {
                allowReplay: false,
                played: (draft.played?.[item.question.id] ?? 0) > 0,
                onPlayed: () => {
                  update((d, t) => markPlayed(d, item.question.id, t));
                  setAnswerWindow({
                    id: item.question.id,
                    until: Date.now() + answerSeconds(item) * 1000,
                  });
                },
              }
            : undefined
        }
        getState={(option) => (option === picked ? 'selected' : 'idle')}
        onPick={(option) => {
          if (open) update((d, t) => answerQuestion(d, item.question.id, option, t));
        }}
      />

      {answerWindow?.id === item.question.id && (
        <ThemedText type="small" themeColor="textSecondary" accessibilityLiveRegion="polite">
          作答時間：還有 {Math.max(0, Math.ceil((answerWindow.until - now) / 1000))}{' '}
          秒，之後自動進入下一題
        </ThemedText>
      )}
      <View style={styles.navRow}>
        <View style={styles.flex}>
          <SecondaryButton
            label="上一題"
            onPress={() => goTo(Math.max(0, draft.questionIndex - 1))}
          />
        </View>
        {!isLastQuestion && (
          <View style={styles.flex}>
            <PrimaryButton label="下一題" onPress={() => goTo(draft.questionIndex + 1)} />
          </View>
        )}
      </View>

      {reviewing ? (
        <SubmitReview
          questions={sitting.questions}
          answers={draft.answers}
          marked={draft.marked}
          isLast={isLastSitting}
          onJump={goTo}
          onSubmit={() => submit(false)}
          onCancel={() => setReviewing(false)}
        />
      ) : (
        <SecondaryButton
          label={isLastSitting ? '交卷，查看成績' : '交卷，結束這一節'}
          onPress={() => setReviewing(true)}
        />
      )}
      {quit}
    </View>
  );
}

/** 最後一節交卷後還沒結算完成時（例如結算途中關掉 App），打開就再結算一次 */
function FinishPending({
  draft,
  onFinish,
}: {
  draft: MockExamDraft;
  onFinish: (draft: MockExamDraft) => void;
}) {
  const run = useEffectEvent(() => {
    onFinish(draft);
  });
  useEffect(() => {
    run();
  }, []);
  return <LoadingNote text="計算成績…" />;
}

type SavedReportProps = {
  level: JlptLevel;
  record: MockExamRecord;
  onRetry: () => void;
  onBack: () => void;
};

/** 重看以前的模擬考：有考卷快照就照當時的考卷還原，舊紀錄用題目 id 找回 */
function SavedReport({ level, record, onRetry, onBack }: SavedReportProps) {
  const restored = useMemo(
    () => restoreMockExam(level, record.items ?? [], record.snapshot),
    [level, record],
  );
  const result = useMemo(
    () => scoreMockExam(level, restored.items, restored.answers),
    [level, restored],
  );
  return (
    <MockExamReport
      result={{ ...result, total: record.total, passed: record.passed }}
      items={restored.items}
      answers={restored.answers}
      record={record}
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
  warning: {
    borderWidth: 2,
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
  questionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  markButton: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
  quit: {
    alignSelf: 'center',
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
