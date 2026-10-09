import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type LevelTagProps = {
  /** 單字或文法的 id，開頭就是等級（例如 n3-120、n2-g15） */
  id: string;
};

/** 小標籤：顯示 N5～N1 */
export function LevelTag({ id }: LevelTagProps) {
  const theme = useTheme();

  return (
    <View style={[styles.tag, { backgroundColor: theme.primary }]}>
      <ThemedText type="small" style={[styles.text, { color: theme.onPrimary }]}>
        {id.slice(0, 2).toUpperCase()}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.one + 2,
  },
  text: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: 700,
  },
});
