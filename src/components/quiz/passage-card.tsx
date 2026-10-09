import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** 讀解題的文章，用案件檔案的紙張樣式顯示 */
export function PassageCard({ passage }: { passage: string }) {
  const theme = useTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={[styles.stripe, { backgroundColor: theme.gold }]} />
      <ThemedText style={styles.text}>{passage}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    paddingTop: Spacing.three + 6,
    overflow: 'hidden',
  },
  stripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  text: {
    fontSize: 17,
    lineHeight: 30,
  },
});
