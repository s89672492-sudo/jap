import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ExampleSentence } from '@/components/vocab/example-sentence';
import { Spacing } from '@/constants/theme';
import type { VocabWord } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { shuffle } from '@/lib/quiz';
import { speakAndWait, stopSpeaking } from '@/lib/speech';

type AutoPlayerProps = {
  /** 要播放的單字（已依等級、詞性篩選） */
  words: VocabWord[];
};

type Options = {
  example: boolean;
  chinese: boolean;
  random: boolean;
  slow: boolean;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 自動播放單字：唸日文 → 停一下讓你回想 → 顯示意思（可唸中文）→ 唸例句 → 下一個。
 * 離開這個畫面或切到別的分頁會自動暫停。
 */
export function AutoPlayer({ words }: AutoPlayerProps) {
  const theme = useTheme();
  const [options, setOptions] = useState<Options>({ example: true, chinese: false, random: false, slow: false });
  const [order, setOrder] = useState<VocabWord[]>(words);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);
  /** 每次開始播放都換一個編號；舊的播放迴圈看到編號變了就停下來 */
  const runId = useRef(0);

  // 換等級、詞性或切換隨機時重新排順序，回到第一個（隨機順序等畫面載入後才洗牌）
  useEffect(() => {
    runId.current += 1;
    stopSpeaking();
    setPlaying(false);
    setOrder(options.random ? shuffle(words) : words);
    setIndex(0);
    setRevealed(false);
  }, [words, options.random]);

  const stop = useCallback(() => {
    runId.current += 1;
    stopSpeaking();
    setPlaying(false);
  }, []);

  // 離開畫面時暫停
  useFocusEffect(useCallback(() => stop, [stop]));
  useEffect(() => stop, [stop]);

  const play = async (from: number) => {
    const id = ++runId.current;
    const alive = () => runId.current === id;
    const gap = options.slow ? 2200 : 1000;
    setPlaying(true);
    for (let i = from; i < order.length && alive(); i++) {
      const word = order[i];
      setIndex(i);
      setRevealed(false);
      await speakAndWait(word.reading);
      if (!alive()) return;
      await wait(gap);
      if (!alive()) return;
      setRevealed(true);
      if (options.chinese) {
        await speakAndWait(word.meaning, 'zh-TW');
        if (!alive()) return;
      }
      if (options.example && word.example) {
        await wait(400);
        if (!alive()) return;
        await speakAndWait(word.example.ja);
        if (!alive()) return;
      }
      await wait(gap);
    }
    if (alive()) setPlaying(false);
  };

  const toggle = () => (playing ? stop() : play(index));

  const jump = (next: number) => {
    const target = Math.min(Math.max(next, 0), order.length - 1);
    const wasPlaying = playing;
    stop();
    setIndex(target);
    setRevealed(false);
    // 播放中按上一個／下一個就從那個單字繼續播
    if (wasPlaying) setTimeout(() => play(target), 50);
  };

  const setOption = (key: keyof Options) => {
    stop();
    setOptions((current) => ({ ...current, [key]: !current[key] }));
  };

  const word = order[index];
  if (!word) {
    return (
      <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
        這個分類沒有單字
      </ThemedText>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.tabular}>
          {index + 1} / {order.length}
        </ThemedText>
        <ThemedText type="small" style={{ color: playing ? theme.accent : theme.textSecondary }}>
          {playing ? '● 播放中' : '已暫停'}
        </ThemedText>
      </View>
      <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
        <View
          style={[styles.trackFill, { backgroundColor: theme.accent, width: `${((index + 1) / order.length) * 100}%` }]}
        />
      </View>

      <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.reading}>
          {revealed && word.reading !== word.word ? word.reading : ' '}
        </ThemedText>
        <ThemedText style={styles.word} adjustsFontSizeToFit numberOfLines={1}>
          {word.word}
        </ThemedText>
        <ThemedText style={[styles.meaning, { color: revealed ? theme.accent : 'transparent' }]}>
          {word.meaning}
        </ThemedText>
        {revealed && <ExampleSentence word={word} />}
      </View>

      <View style={styles.controls}>
        <ControlButton label="⏮" hint="上一個" onPress={() => jump(index - 1)} disabled={index === 0} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={playing ? '暫停' : '播放'}
          onPress={toggle}
          style={({ pressed }) => [
            styles.play,
            { backgroundColor: theme.primary, borderColor: theme.gold },
            pressed && styles.pressed,
          ]}>
          <ThemedText style={[styles.playIcon, { color: theme.onPrimary }]}>{playing ? '❚❚' : '▶'}</ThemedText>
        </Pressable>
        <ControlButton
          label="⏭"
          hint="下一個"
          onPress={() => jump(index + 1)}
          disabled={index >= order.length - 1}
        />
      </View>

      <View style={styles.chips}>
        <Chip label="唸例句" active={options.example} onPress={() => setOption('example')} />
        <Chip label="唸中文" active={options.chinese} onPress={() => setOption('chinese')} />
        <Chip label="隨機順序" active={options.random} onPress={() => setOption('random')} />
        <Chip label="慢慢來" active={options.slow} onPress={() => setOption('slow')} />
      </View>
      <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
        每個單字會先唸日文，停一下讓你回想，再顯示意思。手機螢幕關掉或切到別的分頁時會暫停。
      </ThemedText>
    </View>
  );
}

function ControlButton({
  label,
  hint,
  onPress,
  disabled,
}: {
  label: string;
  hint: string;
  onPress: () => void;
  disabled: boolean;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={hint}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.control,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <ThemedText style={[styles.controlIcon, { color: theme.primary }]}>{label}</ThemedText>
    </Pressable>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { borderColor: active ? theme.primary : theme.border, backgroundColor: active ? theme.primary : theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <ThemedText type="smallBold" style={{ color: active ? theme.onPrimary : theme.textSecondary }}>
        {active ? '✓ ' : ''}
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  center: {
    textAlign: 'center',
    paddingVertical: Spacing.five,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabular: {
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
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    alignItems: 'center',
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    minHeight: 240,
  },
  reading: {
    fontSize: 18,
  },
  word: {
    fontSize: 48,
    lineHeight: 60,
    fontWeight: 700,
  },
  meaning: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: 700,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.four,
  },
  control: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlIcon: {
    fontSize: 22,
    lineHeight: 28,
  },
  play: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: 700,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
  },
  chip: {
    minHeight: 44,
    borderWidth: 1.5,
    borderRadius: 22,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
  },
  note: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.75,
  },
});
