import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { ScriptLine } from '@/data/exam';
import { useTheme } from '@/hooks/use-theme';
import { speakScript, stopSpeaking } from '@/lib/speech';

type ListeningPlayerProps = {
  /** 用來判斷是不是換了新題目 */
  questionId: string;
  script: ScriptLine[];
  question: string;
  /** 作答後顯示逐字稿 */
  showTranscript: boolean;
};

const SPEAKER_LABELS: Record<ScriptLine['speaker'], string> = {
  narrator: '旁白',
  man: '男',
  woman: '女',
};

/** 聽解題的播放器：換題時自動播放，可以再聽一次，作答後顯示逐字稿 */
export function ListeningPlayer({ questionId, script, question, showTranscript }: ListeningPlayerProps) {
  const theme = useTheme();

  useEffect(() => {
    speakScript(script, question);
    // 離開這一題（換題、切換題型或分頁）時停止播放
    return () => stopSpeaking();
    // 只在換題時自動播放
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  return (
    <View
      style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={styles.playRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="再聽一次"
          onPress={() => speakScript(script, question)}
          style={({ pressed }) => [
            styles.playButton,
            { backgroundColor: theme.primary, borderColor: theme.gold },
            pressed && styles.pressed,
          ]}>
          <SymbolView
            name={{ ios: 'speaker.wave.3.fill', android: 'volume_up', web: 'volume_up' }}
            size={30}
            tintColor={theme.onPrimary}
          />
        </Pressable>
        <View style={styles.playText}>
          <ThemedText type="smallBold">再聽一次</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            男生聲音較低、女生聲音較高
          </ThemedText>
        </View>
      </View>

      {showTranscript && (
        <View style={[styles.transcript, { borderTopColor: theme.border }]}>
          <ThemedText type="smallBold" style={{ color: theme.gold }}>
            逐字稿
          </ThemedText>
          {script.map((line, i) => (
            <View key={i} style={styles.line}>
              <ThemedText
                type="smallBold"
                style={[styles.speaker, { color: line.speaker === 'narrator' ? theme.textSecondary : theme.accent }]}>
                {SPEAKER_LABELS[line.speaker]}
              </ThemedText>
              <ThemedText type="small" style={styles.lineText}>
                {line.text}
              </ThemedText>
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
