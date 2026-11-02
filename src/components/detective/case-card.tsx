import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CaseCardProps = PropsWithChildren<{
  /** 卡片左上角的小標，例如 "CASE 001" */
  label: string;
  title: string;
  /** 標題右邊的按鈕（例如切換等級） */
  action?: ReactNode;
}>;

/** 案件檔案風格的卡片：紙張底色 + 左側紅色標籤條 */
export function CaseCard({ label, title, action, children }: CaseCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
      <View style={[styles.stripe, { backgroundColor: theme.accent }]} />
      <View style={styles.body}>
        <ThemedText type="smallBold" style={[styles.label, { color: theme.accent }]}>
          {label}
        </ThemedText>
        {action ? (
          <View style={styles.titleRow}>
            <ThemedText type="default" style={[styles.title, styles.titleText]}>
              {title}
            </ThemedText>
            {action}
          </View>
        ) : (
          <ThemedText type="default" style={styles.title}>
            {title}
          </ThemedText>
        )}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: Spacing.three,
    overflow: 'hidden',
    alignSelf: 'stretch',
  },
  stripe: {
    width: 6,
  },
  body: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  label: {
    letterSpacing: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  titleText: {
    flex: 1,
    minWidth: 0,
  },
});
