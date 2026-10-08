import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Kana, KanaScript } from '@/data/kana';
import { useTheme } from '@/hooks/use-theme';

type KanaDetailCardProps = {
  kana: Kana | null;
  script: KanaScript;
};

/** 顯示目前選取的假名：大字 + 羅馬拼音 + 另一種寫法 */
export function KanaDetailCard({ kana, script }: KanaDetailCardProps) {
  const theme = useTheme();
  const otherScript: KanaScript = script === 'hiragana' ? 'katakana' : 'hiragana';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
      <View style={[styles.stripe, { backgroundColor: theme.accent }]} />
      {kana ? (
        <View style={styles.body}>
          <ThemedText style={styles.bigKana} allowFontScaling={false}>
            {kana[script]}
          </ThemedText>
          <View style={styles.info}>
            <ThemedText type="smallBold" style={[styles.label, { color: theme.accent }]}>
              線索
            </ThemedText>
            <ThemedText style={styles.romaji}>{kana.romaji}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {otherScript === 'katakana' ? '片假名' : '平假名'}：{kana[otherScript]}
            </ThemedText>
          </View>
        </View>
      ) : (
        <View style={styles.body}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.placeholder}>
            點選下方任一個假名，查看它的讀音和另一種寫法。
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: Spacing.three,
    overflow: 'hidden',
    minHeight: 104,
  },
  stripe: {
    width: 6,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    gap: Spacing.four,
  },
  bigKana: {
    fontSize: 56,
    lineHeight: 68,
    fontWeight: 700,
    minWidth: 64,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    gap: Spacing.half,
  },
  label: {
    letterSpacing: 2,
  },
  romaji: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: 700,
  },
  placeholder: {
    flex: 1,
  },
});
