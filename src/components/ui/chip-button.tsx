import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChipButtonProps = {
  label: string;
  onPress: () => void;
  /** 實心藍底（例如目前的等級） */
  filled?: boolean;
  accessibilityLabel?: string;
};

/** 小膠囊按鈕：標題旁的等級、單字卡上方的小工具。看起來小，觸控範圍仍有 44 */
export function ChipButton({
  label,
  onPress,
  filled = false,
  accessibilityLabel,
}: ChipButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.chip,
        filled
          ? { backgroundColor: theme.primary, borderColor: theme.primary }
          : { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        pressed && styles.pressed,
      ]}>
      <ThemedText
        type="smallBold"
        numberOfLines={1}
        style={[styles.label, { color: filled ? theme.onPrimary : theme.text }]}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 36,
    paddingHorizontal: Spacing.three,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
