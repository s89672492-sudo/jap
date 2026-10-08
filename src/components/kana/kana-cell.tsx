import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { Kana, KanaScript } from '@/data/kana';
import { useTheme } from '@/hooks/use-theme';

type KanaCellProps = {
  kana: Kana | null;
  script: KanaScript;
  selected: boolean;
  onPress: (kana: Kana) => void;
};

/** 五十音表的一格；kana 為 null 時顯示空白佔位，保持格線對齊 */
export function KanaCell({ kana, script, selected, onPress }: KanaCellProps) {
  const theme = useTheme();

  if (!kana) {
    return <View style={styles.cell} />;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${kana[script]}，${kana.romaji}`}
      accessibilityState={{ selected }}
      onPress={() => onPress(kana)}
      style={({ pressed }) => [
        styles.cell,
        styles.filled,
        {
          backgroundColor: selected ? theme.primary : theme.backgroundElement,
          borderColor: selected ? theme.gold : theme.border,
        },
        pressed && styles.pressed,
      ]}>
      <ThemedText
        style={[styles.kana, { color: selected ? theme.onPrimary : theme.text }]}
        allowFontScaling={false}>
        {kana[script]}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.romaji, { color: selected ? theme.gold : theme.textSecondary }]}
        allowFontScaling={false}>
        {kana.romaji}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    minHeight: 44,
  },
  filled: {
    borderWidth: 1,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kana: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: 600,
  },
  romaji: {
    fontSize: 11,
    lineHeight: 14,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
});
