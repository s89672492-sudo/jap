import { StyleSheet, View } from 'react-native';

import { JapaneseText } from '@/components/ui/japanese-text';
import { FuriganaText } from '@/components/vocab/furigana-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useSettings } from '@/stores/settings-store';

/**
 * 讀解題的文章，用案件檔案的紙張樣式顯示。
 * 有注音版本（新題目）時一行一行加注音；舊題目依注音表查。
 */
export function PassageCard({ passage, furigana }: { passage: string; furigana?: string }) {
  const theme = useTheme();
  const settings = useSettings();
  const annotated = settings.furigana ? furigana : undefined;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
      <View style={[styles.stripe, { backgroundColor: theme.gold }]} />
      {annotated ? (
        <View style={styles.lines}>
          {annotated
            .split('\n')
            .map((line, i) =>
              line.trim() === '' ? (
                <View key={i} style={styles.blank} />
              ) : (
                <FuriganaText key={i} annotated={line} fontSize={17} />
              ),
            )}
        </View>
      ) : (
        <JapaneseText text={passage} fontSize={17} style={styles.text} />
      )}
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
  lines: {
    gap: Spacing.two,
  },
  blank: {
    height: Spacing.one,
  },
});
