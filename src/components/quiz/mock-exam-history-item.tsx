import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import type { JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { deleteMockExamRecord, type MockExamRecord } from '@/stores/mock-exam-store';

type MockExamHistoryItemProps = {
  level: JlptLevel;
  record: MockExamRecord;
  /** 打開這次考試，重看題目和解說 */
  onOpen: (record: MockExamRecord) => void;
};

export function formatExamDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 「最近成績」的一次考試：點了重看題目，旁邊的「刪除」要再確認一次才刪 */
export function MockExamHistoryItem({ level, record, onOpen }: MockExamHistoryItemProps) {
  const theme = useTheme();
  const [confirming, setConfirming] = useState(false);
  const date = formatExamDate(record.date);

  const summary = (
    <>
      <View style={styles.scoreRow}>
        <ThemedText type="small" themeColor="textSecondary" style={styles.tabular}>
          {date}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.tabular}>
          {record.total} / 180
        </ThemedText>
        <ThemedText
          type="smallBold"
          style={{ color: record.passed ? theme.success : theme.accent }}>
          {record.passed ? '合格' : '不合格'}
        </ThemedText>
      </View>
      {record.items && (
        <ThemedText type="small" style={{ color: theme.accent }}>
          查看題目和解說 ›
        </ThemedText>
      )}
    </>
  );

  return (
    <View style={[styles.item, { borderTopColor: theme.border }]}>
      <View style={styles.row}>
        {record.items ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`查看 ${date} 的模擬考題目和解說`}
            onPress={() => onOpen(record)}
            style={({ pressed }) => [styles.main, pressed && styles.pressed]}>
            {summary}
          </Pressable>
        ) : (
          <View style={styles.main}>{summary}</View>
        )}
        {!confirming && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`刪除 ${date} 的模擬考紀錄`}
            onPress={() => setConfirming(true)}
            style={({ pressed }) => [
              styles.delete,
              { borderColor: theme.border },
              pressed && styles.pressed,
            ]}>
            <ThemedText type="small" themeColor="textSecondary">
              刪除
            </ThemedText>
          </Pressable>
        )}
      </View>
      {confirming && (
        <View style={[styles.confirm, { backgroundColor: theme.backgroundSelected }]}>
          <ThemedText type="small" style={styles.confirmText}>
            刪除這次紀錄？題目和答案也會一起刪掉（錯題本不受影響）。
          </ThemedText>
          <View style={styles.confirmButtons}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setConfirming(false)}
              style={({ pressed }) => [
                styles.delete,
                { borderColor: theme.border },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="small">取消</ThemedText>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`確定刪除 ${date} 的模擬考紀錄`}
              onPress={() => deleteMockExamRecord(level, record.date)}
              style={({ pressed }) => [
                styles.delete,
                { borderColor: theme.accent, backgroundColor: theme.accent },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
                確定刪除
              </ThemedText>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  main: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    justifyContent: 'center',
    gap: Spacing.half,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  delete: {
    minHeight: 44,
    minWidth: 56,
    paddingHorizontal: Spacing.two,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirm: {
    borderRadius: Spacing.two,
    padding: Spacing.two,
    gap: Spacing.two,
  },
  confirmText: {
    flexShrink: 1,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  tabular: {
    fontVariant: ['tabular-nums'],
  },
});
