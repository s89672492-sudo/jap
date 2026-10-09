import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SpeakButton } from '@/components/ui/speak-button';
import { Spacing } from '@/constants/theme';
import type { GrammarPoint } from '@/data/grammar';
import { useTheme } from '@/hooks/use-theme';

type GrammarCardProps = {
  item: GrammarPoint;
};

/** 文法卡：句型、中文意思、接續方式，下方是例句（句型以強調色標出） */
export const GrammarCard = memo(function GrammarCard({ item }: GrammarCardProps) {
  const theme = useTheme();
  const { ja, zh, highlight } = item.example;
  const index = ja.indexOf(highlight);

  return (
    <View
      style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={[styles.stripe, { backgroundColor: theme.gold }]} />
      <View style={styles.body}>
        <ThemedText style={styles.pattern}>{item.pattern}</ThemedText>
        <ThemedText type="smallBold" style={{ color: theme.accent }}>
          {item.meaning}
        </ThemedText>
        <View style={[styles.connection, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="small" themeColor="textSecondary">
            接續：{item.connection}
          </ThemedText>
        </View>
        <View style={[styles.exampleRow, { borderTopColor: theme.border }]}>
          <View style={styles.exampleText}>
            <ThemedText style={styles.ja}>
              {index >= 0 ? (
                <>
                  {ja.slice(0, index)}
                  <ThemedText style={[styles.ja, styles.highlight, { color: theme.accent }]}>
                    {highlight}
                  </ThemedText>
                  {ja.slice(index + highlight.length)}
                </>
              ) : (
                ja
              )}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {zh}
            </ThemedText>
          </View>
          <SpeakButton text={ja} />
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: Spacing.three,
    overflow: 'hidden',
  },
  stripe: {
    width: 6,
  },
  body: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  pattern: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: 700,
  },
  connection: {
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
  },
  exampleText: {
    flex: 1,
    gap: Spacing.half,
  },
  ja: {
    fontSize: 15,
    lineHeight: 22,
  },
  highlight: {
    fontWeight: 700,
  },
});
