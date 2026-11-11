import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, IconBadge, type IconName } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TaskRowProps = {
  icon: IconName;
  title: string;
  /** 標題下方的說明，例如文章標題 */
  note?: string;
  /** 右邊的數字或狀態，例如「12 個」；完成時不顯示，改蓋「完成」章 */
  value: string;
  done?: boolean;
  onPress?: () => void;
};

/** 今日任務的一列：整列都可以按，前往對應的練習；完成的蓋上「完成」章 */
export function TaskRow({ icon, title, note, value, done = false, onPress }: TaskRowProps) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${title}：${done ? '完成' : value}${note ? `，${note}` : ''}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderColor: theme.border, backgroundColor: theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <IconBadge name={icon} tone={done ? 'success' : 'primary'} size={44} />
      <View style={styles.text}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {note ? (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {note}
          </ThemedText>
        ) : null}
      </View>
      {done ? (
        <View style={[styles.stamp, { borderColor: theme.success }]}>
          <ThemedText style={[styles.stampText, { color: theme.success }]}>完成</ThemedText>
        </View>
      ) : (
        <ThemedText style={[styles.value, { color: theme.accentIcon }]}>{value}</ThemedText>
      )}
      {onPress ? <Icon name="chevron" size={18} color={theme.textSecondary} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
    minHeight: 60,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two + 2,
    borderWidth: 1,
    borderRadius: Radius.row,
  },
  pressed: {
    opacity: 0.7,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
  },
  value: {
    flexShrink: 0,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 700,
  },
  // 像蓋印章：外框、字距拉開、稍微歪一點
  stamp: {
    flexShrink: 0,
    borderWidth: 1.5,
    borderRadius: Radius.tag,
    paddingHorizontal: Spacing.two,
    paddingVertical: 1,
    transform: [{ rotate: '-4deg' }],
  },
  stampText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 700,
    letterSpacing: 2,
  },
});
