import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { PronunciationDiff } from './pronunciation-diff';

import { DetectiveEmblem } from '@/components/detective/detective-emblem';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SpeakButton } from '@/components/ui/speak-button';
import { Spacing } from '@/constants/theme';
import { VOCAB_BY_LEVEL, type JlptLevel, type VocabWord } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { checkPronunciation, verdict, type PronunciationResult } from '@/lib/pronunciation';
import { shuffle } from '@/lib/quiz';
import { stopSpeaking } from '@/lib/speech';
import {
  isRecognitionSupported,
  startRecognition,
  type RecognitionError,
} from '@/lib/speech-recognition';
import { addMistake } from '@/stores/mistakes-store';
import { useSettings } from '@/stores/settings-store';

type SpeakingPracticeProps = {
  level: JlptLevel;
  /** 顯示辨識結果後呼叫，讓外層捲到結果 */
  onAnswered?: () => void;
  /** 換下一題時呼叫，讓外層捲回最上面 */
  onNext?: () => void;
};

type Target = 'word' | 'sentence';

const TARGET_OPTIONS: { value: Target; label: string }[] = [
  { value: 'word', label: '說單字' },
  { value: 'sentence', label: '說例句' },
];

const ERROR_MESSAGES: Record<RecognitionError, string> = {
  'not-allowed': '沒有麥克風權限。請在瀏覽器網址列旁允許使用麥克風後再試一次。',
  'no-speech': '沒有聽到聲音，請靠近麥克風再說一次。',
  network: '語音辨識需要網路連線，請確認網路後再試一次。',
  unsupported: '這個裝置不支援語音辨識。',
  other: '辨識失敗，請再試一次。',
};

/** 口說練習：聽標準發音 → 按麥克風說日文 → 比對辨識結果，標出唸錯的字 */
export function SpeakingPractice({ level, onAnswered, onNext }: SpeakingPracticeProps) {
  const theme = useTheme();
  const { roundSize } = useSettings();
  const [target, setTarget] = useState<Target>('word');
  const [supported, setSupported] = useState<boolean | null>(null);
  const [items, setItems] = useState<VocabWord[]>([]);
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [partial, setPartial] = useState('');
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** 每一題最好的分數 */
  const [best, setBest] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const stopRef = useRef<() => void>(() => {});

  // 瀏覽器支不支援、題目順序都和裝置有關，等畫面載入後才決定
  useEffect(() => {
    setSupported(isRecognitionSupported());
  }, []);

  useEffect(() => {
    const words = VOCAB_BY_LEVEL[level].filter((w) => target === 'word' || w.example);
    setItems(shuffle(words).slice(0, roundSize));
    setIndex(0);
    setResult(null);
    setError(null);
    setBest([]);
  }, [level, target, roundSize, round]);

  // 結果或錯誤訊息畫出來之後，再讓外層捲到下面
  useEffect(() => {
    if (result || error) onAnswered?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, error]);

  // 離開畫面時停止收音
  useEffect(() => () => stopRef.current(), []);

  if (supported === null || items.length === 0) return null;

  if (index >= items.length) {
    const average = best.length ? best.reduce((a, b) => a + b, 0) / best.length : 0;
    const good = best.filter((s) => s >= 0.85).length;
    return (
      <View style={styles.center}>
        <DetectiveEmblem />
        <ThemedText type="smallBold" style={[styles.label, { color: theme.accent }]}>
          {level} 口說練習報告
        </ThemedText>
        <ThemedText style={styles.big}>{Math.round(average * 100)} 分</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.centerText}>
          說得很好的有 {good} / {items.length} 題。差比較多的單字已加入錯題本。
        </ThemedText>
        <PrimaryButton label="再練一輪" onPress={() => setRound((r) => r + 1)} />
      </View>
    );
  }

  const word = items[index];
  const targets = target === 'word' ? [word.word, word.reading] : [word.example?.ja ?? word.word];
  const spoken = target === 'word' ? word.reading : (word.example?.ja ?? word.word);
  const judged = result ? verdict(result.score) : null;

  const listen = () => {
    if (listening) {
      stopRef.current();
      return;
    }
    stopSpeaking();
    setError(null);
    setResult(null);
    setPartial('');
    setListening(true);
    stopRef.current = startRecognition({
      onPartial: setPartial,
      onResult: (alternatives) => {
        if (alternatives.length === 0) {
          setError(ERROR_MESSAGES['no-speech']);
          return;
        }
        const checked = checkPronunciation(targets, alternatives);
        setResult(checked);
        setBest((prev) => {
          const next = [...prev];
          next[index] = Math.max(next[index] ?? 0, checked.score);
          return next;
        });
      },
      onError: (code) => setError(ERROR_MESSAGES[code]),
      onEnd: () => setListening(false),
    });
  };

  const goNext = () => {
    stopRef.current();
    if ((best[index] ?? 0) < 0.6) addMistake(word.id);
    setBest((prev) => {
      const next = [...prev];
      next[index] = next[index] ?? 0;
      return next;
    });
    setResult(null);
    setError(null);
    setPartial('');
    setIndex((i) => i + 1);
    onNext?.();
  };

  return (
    <View style={styles.container}>
      <SegmentedControl options={TARGET_OPTIONS} value={target} onChange={setTarget} />

      {!supported && (
        <View style={[styles.notice, { borderColor: theme.gold, backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="small" themeColor="textSecondary">
            這個裝置不支援語音辨識，只能聽發音跟著唸。請用手機或電腦的 Chrome 打開網站版，就能辨識你有沒有說對。
          </ThemedText>
        </View>
      )}

      <View style={styles.progressRow}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.tabular}>
          第 {index + 1} / {items.length} 題
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          先聽，再按麥克風說
        </ThemedText>
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        {target === 'word' ? (
          <>
            {word.reading !== word.word && (
              <ThemedText type="small" themeColor="textSecondary">
                {word.reading}
              </ThemedText>
            )}
            <ThemedText style={styles.word} adjustsFontSizeToFit numberOfLines={1}>
              {word.word}
            </ThemedText>
            <ThemedText type="smallBold" style={{ color: theme.accent }}>
              {word.meaning}
            </ThemedText>
          </>
        ) : (
          <>
            <ThemedText style={styles.sentence}>{word.example?.ja}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {word.example?.zh}
            </ThemedText>
          </>
        )}
        <View style={styles.actions}>
          <SpeakButton text={spoken} size="large" />
          {supported && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={listening ? '停止收音' : '開始說'}
              onPress={listen}
              style={({ pressed }) => [
                styles.mic,
                { backgroundColor: listening ? theme.accent : theme.primary, borderColor: theme.gold },
                pressed && styles.pressed,
              ]}>
              <ThemedText style={styles.micIcon}>🎤</ThemedText>
            </Pressable>
          )}
        </View>
        {supported && (
          <ThemedText type="small" themeColor="textSecondary">
            {listening ? `聽取中…${partial ? `「${partial}」` : ''}（再按一次停止）` : '按 🎤 開始說'}
          </ThemedText>
        )}
      </View>

      {error && (
        <ThemedText type="small" style={{ color: theme.accent }}>
          {error}
        </ThemedText>
      )}

      {result && judged && (
        <View style={[styles.result, { borderColor: theme.border, backgroundColor: theme.backgroundElement }]}>
          <View style={styles.resultHeader}>
            <ThemedText
              style={[
                styles.mark,
                { color: judged.level === 'good' ? theme.success : judged.level === 'close' ? theme.gold : theme.accent },
              ]}>
              {judged.mark} {Math.round(result.score * 100)} 分
            </ThemedText>
            <ThemedText type="smallBold">{judged.label}</ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            辨識到：「{result.heard}」
          </ThemedText>
          <PronunciationDiff target={result.target} matched={result.matched} />
        </View>
      )}

      <View style={styles.buttons}>
        <View style={styles.button}>
          <SecondaryButton label="跳過" onPress={goNext} />
        </View>
        <View style={styles.button}>
          <PrimaryButton label={index + 1 >= items.length ? '看結果' : '下一題'} onPress={goNext} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  notice: {
    borderWidth: 1.5,
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  tabular: {
    fontVariant: ['tabular-nums'],
  },
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    alignItems: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
  },
  word: {
    fontSize: 40,
    lineHeight: 52,
    fontWeight: 700,
  },
  sentence: {
    fontSize: 20,
    lineHeight: 32,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    marginTop: Spacing.two,
  },
  mic: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micIcon: {
    fontSize: 32,
    lineHeight: 40,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  result: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  mark: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: 700,
  },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  button: {
    flex: 1,
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
  big: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: 700,
  },
  centerText: {
    textAlign: 'center',
  },
});
