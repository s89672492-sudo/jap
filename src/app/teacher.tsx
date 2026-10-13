import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBackground } from '@/components/app-background';
import { ChatView } from '@/components/teacher/chat-view';
import { InterruptedNotice } from '@/components/teacher/interrupted-notice';
import { ModelPanel, type ModelPhase } from '@/components/teacher/model-panel';
import { SupportCard } from '@/components/teacher/support-card';
import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useOnline } from '@/hooks/use-online';
import { useTheme } from '@/hooks/use-theme';
import {
  checkSupport,
  deleteModel,
  hasModelFiles,
  isModelDownloaded,
  loadedModelId,
  loadModel,
  stopGenerating,
  streamChat,
  takeInterruptedModel,
} from '@/lib/local-llm';
import {
  modelIdFor,
  modelKeyFor,
  SMALLER_MODEL,
  TEACHER_MODELS,
  type ChatMessage,
  type LoadProgress,
  type SupportReport,
  type TeacherModelKey,
} from '@/lib/local-llm-models';
import { buildMessages } from '@/lib/teacher-prompt';
import { useJlptLevel } from '@/stores/jlpt-level-store';
import { setTeacherModel, useTeacherModel } from '@/stores/teacher-store';

/** 把 WebLLM 的錯誤換成看得懂的說明 */
function explainError(error: unknown, online: boolean): string {
  const message = error instanceof Error ? error.message : String(error);
  if (!online || /fetch|network/i.test(message)) {
    return '下載失敗：請確認網路連線後再試。第一次下載需要網路。';
  }
  if (/memory|device.*lost|OOM|allocation/i.test(message)) {
    return '記憶體不足：請關掉其他分頁或 App，或改用「日文專家」模型。';
  }
  if (/quota|storage/i.test(message)) {
    return '儲存空間不足：請清出空間後再試。';
  }
  return `發生錯誤：${message}`;
}

/**
 * AI 日文老師：在裝置本地執行的語言模型（WebLLM + WebGPU），不使用雲端 AI。
 * 流程：檢查裝置 → 選模型 → 第一次下載（之後離線可用）→ 文字問答。
 */
export default function TeacherScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const level = useJlptLevel();
  const online = useOnline();
  const modelKey = useTeacherModel();

  const [report, setReport] = useState<SupportReport | null>(null);
  const [downloaded, setDownloaded] = useState<boolean | null>(null);
  const [hasFiles, setHasFiles] = useState(false);
  const [phase, setPhase] = useState<ModelPhase>('idle');
  const [progress, setProgress] = useState<LoadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  /** 上次被瀏覽器中斷（通常是記憶體不足）的模型，以及自動改用的模型 */
  const [interrupted, setInterrupted] = useState<{
    from: TeacherModelKey;
    to: TeacherModelKey | null;
  } | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const modelId = report ? modelIdFor(modelKey, report.f16) : null;

  useEffect(() => {
    checkSupport().then(setReport);
    const crashedId = takeInterruptedModel();
    const from = crashedId ? modelKeyFor(crashedId) : null;
    if (from) {
      const to = SMALLER_MODEL[from];
      if (to) setTeacherModel(to);
      setInterrupted({ from, to });
    }
  }, []);

  // 換模型時重新確認有沒有下載過；已經載入的話直接可以聊天
  useEffect(() => {
    if (!report?.ok || !modelId) return;
    let cancelled = false;
    setDownloaded(null);
    setError(null);
    setPhase(loadedModelId() === modelId ? 'ready' : 'idle');
    setHasFiles(false);
    isModelDownloaded(modelId).then((value) => {
      if (!cancelled) setDownloaded(value);
    });
    hasModelFiles(modelId).then((value) => {
      if (!cancelled) setHasFiles(value);
    });
    return () => {
      cancelled = true;
    };
  }, [report, modelId]);

  const start = useCallback(async () => {
    if (!modelId) return;
    const model = TEACHER_MODELS[modelKey];
    if (
      modelKey === 'best' &&
      !window.confirm(
        `「${model.label}」需要約 ${(model.memoryMB / 1024).toFixed(1)} GB 記憶體。` +
          'iPhone 和多數手機會因記憶體不足讓頁面自動重新整理，建議在平板或電腦使用。確定要繼續嗎？',
      )
    ) {
      return;
    }
    setInterrupted(null);
    setPhase('loading');
    setError(null);
    setProgress(null);
    try {
      await loadModel(modelId, setProgress);
      setDownloaded(true);
      setPhase('ready');
    } catch (e) {
      setError(explainError(e, navigator.onLine));
      setPhase('error');
      setDownloaded(await isModelDownloaded(modelId));
      setHasFiles(await hasModelFiles(modelId));
    }
  }, [modelId, modelKey]);

  const remove = useCallback(async () => {
    if (!modelId) return;
    if (!window.confirm('要刪除這個模型嗎？之後要用需要重新下載。')) return;
    await deleteModel(modelId);
    setDownloaded(false);
    setHasFiles(false);
    setPhase('idle');
  }, [modelId]);

  const send = useCallback(
    async (text: string) => {
      const history: ChatMessage[] = [...messages, { role: 'user', content: text }];
      setMessages([...history, { role: 'assistant', content: '' }]);
      setBusy(true);
      let reply = '';
      try {
        for await (const piece of streamChat(buildMessages(level, history))) {
          reply += piece;
          setMessages([...history, { role: 'assistant', content: reply }]);
        }
      } catch (e) {
        reply += `\n（${explainError(e, true)}）`;
        setMessages([...history, { role: 'assistant', content: reply }]);
      } finally {
        setBusy(false);
      }
    },
    [messages, level],
  );

  // 有新訊息時捲到最下面
  useEffect(() => {
    if (messages.length > 0) scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const changeModel = (key: TeacherModelKey) => {
    if (busy) return;
    setTeacherModel(key);
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <AppBackground />
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + Spacing.three,
            paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
          },
        ]}>
        <View style={styles.inner}>
          <Pressable
            accessibilityRole="button"
            onPress={() => (router.canGoBack() ? router.back() : router.navigate('/'))}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
            <ThemedText type="smallBold" style={{ color: theme.primary }}>
              ‹ 返回事務所
            </ThemedText>
          </Pressable>
          <View style={styles.titleRow}>
            <ThemedText type="subtitle" style={styles.title}>
              AI 日文老師
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {level}・本地執行
            </ThemedText>
          </View>

          {interrupted && (
            <InterruptedNotice
              from={interrupted.from}
              to={interrupted.to}
              onDismiss={() => setInterrupted(null)}
            />
          )}
          {(!report?.ok || phase !== 'ready') && <SupportCard report={report} />}
          {report?.ok && (
            <ModelPanel
              modelKey={modelKey}
              onChangeModel={changeModel}
              downloaded={downloaded}
              phase={phase}
              progress={progress}
              error={error}
              online={online}
              onStart={start}
              onDelete={remove}
              canDelete={hasFiles}
            />
          )}
          {phase === 'ready' && (
            <ChatView
              messages={messages}
              busy={busy}
              onSend={send}
              onStop={stopGenerating}
              onClear={() => setMessages([])}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  back: {
    minHeight: 44,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  title: {
    letterSpacing: 2,
  },
  pressed: {
    opacity: 0.6,
  },
});
