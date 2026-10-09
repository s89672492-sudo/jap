import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { toggleBookmark, useBookmarks } from '@/stores/bookmarks-store';

type BookmarkButtonProps = {
  /** 單字或文法的 id */
  id: string;
};

/** 星號收藏按鈕，觸控區域 44x44 */
export function BookmarkButton({ id }: BookmarkButtonProps) {
  const theme = useTheme();
  const saved = useBookmarks().has(id);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? '取消收藏' : '加入收藏'}
      accessibilityState={{ selected: saved }}
      hitSlop={6}
      onPress={() => toggleBookmark(id)}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      {/* 用文字星號，三個平台顯示一致 */}
      <ThemedText style={[styles.star, { color: saved ? theme.gold : theme.textSecondary }]}>
        {saved ? '★' : '☆'}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  star: {
    fontSize: 26,
    lineHeight: 32,
  },
  pressed: {
    opacity: 0.6,
  },
});
