import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { JapaneseText } from '@/components/ui/japanese-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type AnswerState = 'idle' | 'correct' | 'wrong' | 'dimmed';

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

  const borderColor =
    state === 'correct' ? theme.success : state === 'wrong' ? theme.accent : theme.border;
  const backgroundColor =
    state === 'correct'
      ? theme.success
      : state === 'wrong'
        ? theme.accent
        : theme.backgroundElement;
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
      {japanese ? (
        <View style={styles.japanese}>
          {mark ? (
            <ThemedText style={[styles.label, { color: textColor }]}>{mark}</ThemedText>
          ) : null}
          <JapaneseText
            text={label}
            fontSize={18}
            fontWeight={600}
            center
            color={textColor}
            style={[styles.label, { color: textColor }]}
          />
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
  dimmed: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
});
