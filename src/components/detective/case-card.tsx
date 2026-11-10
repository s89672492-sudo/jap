import type { PropsWithChildren, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CaseCardProps = PropsWithChildren<{
  /** 檔案夾標籤上的字，例如 "CASE 001" */
  label: string;
  title: string;
  /** 標題右邊的按鈕（例如切換等級） */
  action?: ReactNode;
}>;

/**
 * 案件檔案風格的卡片：左上角有一塊突出的紅色檔案夾標籤，下面是紙張底色的內容。
 * 標籤和卡片的左上角對齊，看起來像資料夾的索引標籤。
 */
export function CaseCard({ label, title, action, children }: CaseCardProps) {
  const theme = useTheme();

  return (
    <View style={styles.wrap}>
      <View style={[styles.tab, { backgroundColor: theme.accent }]}>
        <ThemedText style={[styles.tabText, { color: theme.onPrimary }]}>{label}</ThemedText>
      </View>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.border,
            boxShadow: `0 2px 10px ${theme.shadow}`,
          },
        ]}>
        <View style={[styles.spine, { backgroundColor: theme.accent }]} />
        <View style={styles.body}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
  },
  tab: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: Radius.row,
    borderTopRightRadius: Radius.row,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.one,
    paddingBottom: Spacing.one,
  },
  tabText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 700,
    letterSpacing: 1.5,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: Radius.card,
    // 左上角接著標籤，不做圓角
    borderTopLeftRadius: 0,
    overflow: 'hidden',
  },
  spine: {
    width: 5,
  },
  body: {
    flex: 1,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    fontSize: 19,
    lineHeight: 26,
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
