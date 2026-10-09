import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AnswerState = 'idle' | 'correct' | 'wrong' | 'dimmed';

type AnswerOptionProps = {
  label: string;
  state: AnswerState;
  disabled: boolean;
  onPress: () => void;
};

/** 測驗選項按鈕；作答後用顏色標示對錯 */
export function AnswerOption({ label, state, disabled, onPress }: AnswerOptionProps) {
  const theme = useTheme();

  const borderColor =
    state === 'correct' ? theme.success : state === 'wrong' ? theme.accent : theme.border;
  const backgroundColor =
    state === 'correct' ? theme.success : state === 'wrong' ? theme.accent : theme.backgroundElement;
  const textColor = state === 'correct' || state === 'wrong' ? theme.onPrimary : theme.text;
  const mark = state === 'correct' ? '○ ' : state === 'wrong' ? '× ' : '';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { borderColor, backgroundColor },
        state === 'dimmed' && styles.dimmed,
        pressed && styles.pressed,
      ]}>
      <ThemedText style={[styles.label, { color: textColor }]}>
        {mark}
        {label}
      </ThemedText>
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
  dimmed: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
});
