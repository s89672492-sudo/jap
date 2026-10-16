import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { JapaneseText } from '@/components/ui/japanese-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** selected：模擬考作答中選了這個，但還不顯示對錯 */
export type AnswerState = 'idle' | 'selected' | 'correct' | 'wrong' | 'dimmed';

type AnswerOptionProps = {
  label: string;
  state: AnswerState;
  disabled: boolean;
  onPress: () => void;
  /** 日文選項：開啟注音時漢字上方顯示讀音（會洩漏答案的題型不要開） */
  japanese?: boolean;
};

/** 測驗選項按鈕；作答後用顏色標示對錯 */
export function AnswerOption({
  label,
  state,
  disabled,
  onPress,
  japanese = false,
}: AnswerOptionProps) {
  const theme = useTheme();

  const filled = { correct: theme.success, wrong: theme.accent, selected: theme.primary } as const;
  const fill =
    state === 'correct' || state === 'wrong' || state === 'selected' ? filled[state] : null;
  const borderColor = fill ?? theme.border;
  const backgroundColor = fill ?? theme.backgroundElement;
  const textColor = fill ? theme.onPrimary : theme.text;
  const mark =
    state === 'correct' ? '○ ' : state === 'wrong' ? '× ' : state === 'selected' ? '● ' : '';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, selected: state === 'selected' }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { borderColor, backgroundColor },
        state === 'dimmed' && styles.dimmed,
        pressed && styles.pressed,
      ]}>
      {japanese ? (
        <View style={styles.japanese}>
          {mark ? (
            <ThemedText style={[styles.label, { color: textColor }]}>{mark}</ThemedText>
          ) : null}
          {/* 包一層可縮小的容器，長選項才會換行而不是超出畫面 */}
          <View style={styles.japaneseText}>
            <JapaneseText
              text={label}
              fontSize={18}
              fontWeight={600}
              center
              color={textColor}
              style={[styles.label, { color: textColor }]}
            />
          </View>
        </View>
      ) : (
        <ThemedText style={[styles.label, { color: textColor }]}>
          {mark}
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    minHeight: 56,
    borderWidth: 2,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    fontWeight: 600,
    textAlign: 'center',
  },
  japanese: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  japaneseText: {
    flexShrink: 1,
    minWidth: 0,
  },
  dimmed: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
});
