import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PagerProps = {
  /** 從 0 開始 */
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
};

/** 分頁按鈕：第一頁、上一頁、目前頁數、下一頁、最後一頁。每個按鈕至少 44x44 */
export function Pager({ page, pageCount, onChange }: PagerProps) {
  const theme = useTheme();
  if (pageCount <= 1) return null;

  const isFirst = page === 0;
  const isLast = page >= pageCount - 1;

  const button = (label: string, target: number, disabled: boolean, accessibilityLabel: string) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={() => onChange(target)}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <ThemedText type="smallBold" style={{ color: theme.primary }}>
        {label}
      </ThemedText>
    </Pressable>
  );

  return (
    <View style={styles.row}>
      {button('«', 0, isFirst, '第一頁')}
      {button('上一頁', page - 1, isFirst, '上一頁')}
      <ThemedText type="smallBold" themeColor="textSecondary" style={styles.label}>
        {page + 1} / {pageCount}
      </ThemedText>
      {button('下一頁', page + 1, isLast, '下一頁')}
      {button('»', pageCount - 1, isLast, '最後一頁')}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  button: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: Spacing.two,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  disabled: {
    opacity: 0.35,
  },
  pressed: {
    opacity: 0.7,
  },
});
