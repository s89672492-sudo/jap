import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { speakJapanese } from '@/lib/speech';
import { useJapaneseVoices, type JapaneseVoice } from '@/lib/voices';
import { updateSettings, useSettings } from '@/stores/settings-store';

const SAMPLE = 'はじめまして。今日もいっしょに日本語を勉強しましょう。';

const GENDER_LABELS = { male: '男聲', female: '女聲' } as const;

function describe(voice: JapaneseVoice) {
  const tags = [voice.natural ? '高品質' : '一般'];
  if (voice.gender) tags.push(GENDER_LABELS[voice.gender]);
  return tags.join('・');
}

/** 選日文聲音：點一下就換成那個聲音並試聽 */
export function VoicePicker() {
  const theme = useTheme();
  const { voice: chosen } = useSettings();
  const { voices, loaded } = useJapaneseVoices();
  const chosenExists = voices.some((v) => v.id === chosen);
  const hasNatural = voices.some((v) => v.natural);

  const pick = (id: string | null) => {
    updateSettings({ voice: id });
    speakJapanese(SAMPLE);
  };

  const options: { id: string | null; title: string; detail: string }[] = [
    {
      id: null,
      title: '自動（推薦）',
      detail: voices[0] ? `目前用：${voices[0].name}` : '使用系統預設的日文聲音',
    },
    ...voices.map((v) => ({ id: v.id, title: v.name, detail: describe(v) })),
  ];

  return (
    <View style={styles.container}>
      {!loaded && (
        <ThemedText type="small" themeColor="textSecondary">
          讀取聲音中…
        </ThemedText>
      )}
      {options.map((option) => {
        const selected = option.id === null ? !chosenExists : option.id === chosen;
        return (
          <Pressable
            key={option.id ?? 'auto'}
            role="radio"
            aria-checked={selected}
            accessibilityLabel={`${option.title}，${option.detail}，點一下試聽`}
            onPress={() => pick(option.id)}
            style={({ pressed }) => [
              styles.row,
              {
                borderColor: selected ? theme.accent : theme.border,
                backgroundColor: selected ? theme.backgroundSelected : theme.background,
              },
              pressed && styles.pressed,
            ]}>
            <View style={[styles.radio, { borderColor: selected ? theme.accent : theme.border }]}>
              {selected && <View style={[styles.dot, { backgroundColor: theme.accent }]} />}
            </View>
            <View style={styles.text}>
              <ThemedText type="smallBold" numberOfLines={2}>
                {option.title}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                {option.detail}
              </ThemedText>
            </View>
          </Pressable>
        );
      })}
      {loaded && !hasNatural && (
        <ThemedText type="small" themeColor="textSecondary">
          這支手機還沒有高品質的日文聲音。可以免費下載更自然的聲音：
          {'\n'}・iPhone：設定 › 輔助使用 › 朗讀內容 › 聲音 ›
          日文，下載「Kyoko（加強版）」或「O-ren（高級）」
          {'\n'}・Android：設定 › 文字轉語音 › Google 語音服務 › 安裝語音資料 › 日文
          {'\n'}下載完重新打開 App，就會自動換成新的聲音。
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 52,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderRadius: Spacing.two,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  pressed: {
    opacity: 0.7,
  },
});
