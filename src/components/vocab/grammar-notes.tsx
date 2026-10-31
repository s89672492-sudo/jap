import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { GrammarMistake, GrammarSimilar } from '@/data/grammar';
import { useTheme } from '@/hooks/use-theme';

type GrammarNotesProps = {
  similar?: GrammarSimilar[];
  mistakes?: GrammarMistake[];
};

/**
 * 文法卡下方的「相似文法・常見錯誤」：預設收起來（卡片不會變太長），點了才展開。
 */
export function GrammarNotes({ similar = [], mistakes = [] }: GrammarNotesProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  if (similar.length === 0 && mistakes.length === 0) return null;

  const label = [similar.length > 0 && '相似文法', mistakes.length > 0 && '常見錯誤']
    .filter(Boolean)
    .join('・');

  return (
    <View style={[styles.wrap, { borderTopColor: theme.border }]}>
      <Pressable
        accessibilityRole="button"
        aria-expanded={open}
        accessibilityLabel={`${label}，${open ? '收起' : '展開'}`}
        onPress={() => setOpen((v) => !v)}
        style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}>
        <ThemedText type="smallBold" style={{ color: theme.primary }}>
          {label} {open ? '▴' : '▾'}
        </ThemedText>
      </Pressable>
      {open && (
        <View style={styles.body}>
          {similar.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                相似文法
              </ThemedText>
              {similar.map((s) => (
                <View key={s.pattern} style={styles.item}>
                  <ThemedText type="smallBold">{s.pattern}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {s.diff}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
          {mistakes.length > 0 && (
            <View style={styles.section}>
              <ThemedText type="smallBold" themeColor="textSecondary">
                常見錯誤
              </ThemedText>
              {mistakes.map((m) => (
                <View
                  key={m.wrong}
                  style={[styles.mistake, { backgroundColor: theme.backgroundSelected }]}>
                  <ThemedText type="small">
                    <ThemedText type="smallBold" style={{ color: theme.accent }}>
                      ✗{' '}
                    </ThemedText>
                    {m.wrong}
                  </ThemedText>
                  <ThemedText type="small">
                    <ThemedText type="smallBold" style={{ color: theme.success }}>
                      ○{' '}
                    </ThemedText>
                    {m.right}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {m.why}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  toggle: {
    minHeight: 44,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  body: {
    gap: Spacing.three,
    paddingBottom: Spacing.one,
  },
  section: {
    gap: Spacing.two,
  },
  item: {
    gap: Spacing.half,
  },
  mistake: {
    borderRadius: Spacing.two,
    padding: Spacing.two,
    gap: Spacing.half,
  },
});
