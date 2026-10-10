import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PronunciationDiffProps = {
  /** 已正規化的目標文字 */
  target: string;
  /** 每個字有沒有被唸到 */
  matched: boolean[];
};

/** 逐字顯示目標：唸到的字是一般顏色，漏掉或唸錯的字用紅底標出 */
export function PronunciationDiff({ target, matched }: PronunciationDiffProps) {
  const theme = useTheme();
  const missed = matched.filter((m) => !m).length;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.line}>
        {Array.from(target).map((ch, i) => (
          <ThemedText
            key={i}
            style={[
              styles.line,
              !matched[i] && { color: theme.onPrimary, backgroundColor: theme.accent },
            ]}>
            {ch}
          </ThemedText>
        ))}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {missed === 0 ? '每個字都有唸到！' : `紅色的 ${missed} 個字沒唸到或唸錯了`}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.one,
  },
  line: {
    fontSize: 20,
    lineHeight: 32,
    letterSpacing: 1,
  },
});
