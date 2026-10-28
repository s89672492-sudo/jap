import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TaskRowProps = {
  icon: string;
  title: string;
  /** 標題下方的說明，例如文章標題 */
  note?: string;
  /** 右邊的數字或狀態，例如「12 個」「✓ 完成」 */
  value: string;
  done?: boolean;
  onPress?: () => void;
};

/** 今日任務的一列：整列都可以按，前往對應的練習 */
export function TaskRow({ icon, title, note, value, done = false, onPress }: TaskRowProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${title}：${value}${note ? `，${note}` : ''}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderColor: theme.border, backgroundColor: theme.background },
        pressed && styles.pressed,
      ]}>
      <ThemedText style={styles.icon}>{icon}</ThemedText>
      <View style={styles.text}>
        <ThemedText type="smallBold">{title}</ThemedText>
        {note ? (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {note}
          </ThemedText>
        ) : null}
      </View>
      <ThemedText
        type="smallBold"
        style={[styles.value, { color: done ? theme.success : theme.accent }]}>
        {value}
      </ThemedText>
      {onPress ? (
        <ThemedText type="smallBold" themeColor="textSecondary">
          ›
        </ThemedText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 52,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderRadius: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  icon: {
    fontSize: 20,
    lineHeight: 26,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  value: {
    flexShrink: 0,
  },
});
