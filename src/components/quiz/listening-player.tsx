import { SymbolView } from 'expo-symbols';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { JapaneseText } from '@/components/ui/japanese-text';
import { Spacing } from '@/constants/theme';
import type { ScriptLine } from '@/data/exam';
import { useTheme } from '@/hooks/use-theme';
import { listeningSegments, playSegments } from '@/lib/audio-manager';
import type { ExamRoundQuestion } from '@/lib/quiz';

type ListeningPlayerProps = {
  item: ExamRoundQuestion;
  /** 作答後顯示逐字稿 */
  showTranscript: boolean;
  /** 可以再聽一次（練習）；正式模式只播一次 */
  allowReplay?: boolean;
  /** 這一題已經完整播放過了（正式模式不再播放） */
  played?: boolean;
  /** 完整播完時呼叫（中途停止不算） */
  onPlayed?: () => void;
};

const SPEAKER_LABELS: Record<ScriptLine['speaker'], string> = {
  narrator: '旁白',
  man: '男',
  woman: '女',
};

/**
 * 聽解題的播放器：換題時自動播放（依各大題的流程，見 lib/audio-manager.ts）。
 * 練習時可以再聽一次；正式模式播完就不能重播。作答後顯示逐字稿。
 */
export function ListeningPlayer({
  item,
  showTranscript,
  allowReplay = true,
  played = false,
  onPlayed,
}: ListeningPlayerProps) {
  const theme = useTheme();
  const [playing, setPlaying] = useState(false);
  const stop = useRef<(() => void) | null>(null);
  const script = item.question.script ?? [];

  // 播完時用最新的 onPlayed（播放途中畫面可能重畫過）
  const onPlayedRef = useRef(onPlayed);
  useEffect(() => {
    onPlayedRef.current = onPlayed;
  });

  const play = () => {
    stop.current?.();
    setPlaying(true);
    stop.current = playSegments(listeningSegments(item), () => {
      setPlaying(false);
      onPlayedRef.current?.();
    });
  };

  const autoPlay = useEffectEvent(() => {
    if (allowReplay || !played) play();
  });
  useEffect(() => {
    // 換題時自動播放（放到下一輪，不在 effect 裡直接更新畫面）；離開這一題時停止
    const timer = setTimeout(autoPlay, 0);
    return () => {
      clearTimeout(timer);
      stop.current?.();
      stop.current = null;
    };
  }, [item.question.id]);

  const canPlay = !playing && (allowReplay || !played);
  const status = playing
    ? '播放中…'
    : allowReplay
      ? '男生聲音較低、女生聲音較高'
      : played
        ? '已播放（正式模式只播一次）'
        : '還沒播完，可以再播一次';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
      <View style={styles.playRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={allowReplay ? '再聽一次' : '播放'}
          accessibilityState={{ disabled: !canPlay }}
          disabled={!canPlay}
          onPress={play}
          style={({ pressed }) => [
            styles.playButton,
            {
              backgroundColor: canPlay ? theme.primary : theme.backgroundSelected,
              borderColor: theme.gold,
            },
            pressed && styles.pressed,
          ]}>
          <SymbolView
            name={{
              ios: 'speaker.wave.3.fill',
              android: 'volume_up',
              web: 'volume_up',
            }}
            size={30}
            tintColor={canPlay ? theme.onPrimary : theme.textSecondary}
          />
        </Pressable>
        <View style={styles.playText}>
          <ThemedText type="smallBold">{allowReplay ? '再聽一次' : '播放'}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary" accessibilityLiveRegion="polite">
            {status}
          </ThemedText>
        </View>
      </View>

      {showTranscript && script.length > 0 && (
        <View style={[styles.transcript, { borderTopColor: theme.border }]}>
          <ThemedText type="smallBold" style={{ color: theme.gold }}>
            逐字稿
          </ThemedText>
          {script.map((line, i) => (
            <View key={i} style={styles.line}>
              <ThemedText
                type="smallBold"
                style={[
                  styles.speaker,
                  {
                    color: line.speaker === 'narrator' ? theme.textSecondary : theme.accent,
                  },
                ]}>
                {SPEAKER_LABELS[line.speaker]}
              </ThemedText>
              <View style={styles.lineText}>
                <JapaneseText text={line.text} fontSize={14} />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  playRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  playText: {
    flex: 1,
    gap: Spacing.half,
  },
  transcript: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.three,
    gap: Spacing.two,
  },
  line: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  speaker: {
    width: 32,
  },
  lineText: {
    flex: 1,
  },
});
