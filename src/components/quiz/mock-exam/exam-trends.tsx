import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import type { JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { passOutlook, MIN_EXAMS_FOR_OUTLOOK } from '@/lib/exam-analysis';
import { MOCK_EXAM_CONFIG } from '@/lib/mock-exam';
import type { MockExamRecord } from '@/stores/mock-exam-store';

type Range = '5' | '10';
const RANGE_OPTIONS: { value: Range; label: string }[] = [
  { value: '5', label: '最近 5 次' },
  { value: '10', label: '最近 10 次' },
];

/**
 * 歷次模擬考趨勢：總分長條（由舊到新）、合格點的位置、各科和第一次比的變化、合格傾向。
 * 分數都是推估分數；資料不足時不估算合格傾向。
 */
export function ExamTrends({ level, records }: { level: JlptLevel; records: MockExamRecord[] }) {
  const theme = useTheme();
  const [range, setRange] = useState<Range>('5');
  const shown = records.slice(0, Number(range)).reverse();
  const passMark = MOCK_EXAM_CONFIG[level].passMark;
  const outlook = passOutlook(records);
  const first = shown[0];
  const last = shown[shown.length - 1];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
      <ThemedText type="smallBold" style={{ color: theme.accent }}>
        成績趨勢（推估分數）
      </ThemedText>
      <SegmentedControl options={RANGE_OPTIONS} value={range} onChange={setRange} />
      <View
        style={styles.plot}
        accessible
        accessibilityLabel={shown
          .map((r) => `${r.total} 分${r.passed ? '合格' : '不合格'}`)
          .join('、')}>
        {/* 合格點的位置（和長條用同一個比例） */}
        <View
          style={[styles.passLine, { bottom: (passMark / 180) * BAR_MAX, borderColor: theme.gold }]}
        />
        {shown.map((record) => (
          <View key={record.date} style={styles.column}>
            <ThemedText type="small" style={styles.columnValue}>
              {record.total}
            </ThemedText>
            <View
              style={[
                styles.bar,
                {
                  height: Math.max(3, (record.total / 180) * BAR_MAX),
                  backgroundColor: record.passed ? theme.success : theme.accent,
                },
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.labels}>
        {shown.map((record) => (
          <ThemedText
            key={record.date}
            type="small"
            themeColor="textSecondary"
            style={styles.columnLabel}>
            {new Date(record.date).getMonth() + 1}/{new Date(record.date).getDate()}
          </ThemedText>
        ))}
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        綠色：合格；紅色：不合格；金色虛線：合格點 {passMark} 分。
      </ThemedText>
      {shown.length >= 2 && first && last && (
        <View style={styles.changes}>
          <ThemedText type="smallBold">
            這段期間：總分 {signed(last.total - first.total)}
          </ThemedText>
          {last.sections.map((s) => {
            const before = first.sections.find((x) => x.label === s.label)?.score;
            return before === undefined ? null : (
              <ThemedText key={s.label} type="small" themeColor="textSecondary">
                ・{s.label}：{before} → {s.score}（{signed(s.score - before)}）
              </ThemedText>
            );
          })}
        </View>
      )}
      <ThemedText type="smallBold">合格傾向</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {outlook.enough
          ? `最近 ${outlook.exams} 次中有 ${outlook.passed} 次達到合格標準，平均 ${outlook.average} 分（${outlook.trend >= 0 ? '比最早那次進步' : '比最早那次退步'} ${Math.abs(outlook.trend)} 分）。這是整理自己的推估分數，不是統計上的合格機率。`
          : `資料不足，暫不估算（至少要考 ${MIN_EXAMS_FOR_OUTLOOK} 次，目前 ${outlook.have} 次）。`}
      </ThemedText>
    </View>
  );
}

/** 長條最高的高度（180 分） */
const BAR_MAX = 110;

const signed = (n: number) => (n > 0 ? `+${n}` : `${n}`);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  plot: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.one,
    height: BAR_MAX + 22,
    marginTop: Spacing.two,
  },
  passLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  column: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: Spacing.half,
  },
  columnValue: {
    fontSize: 12,
    lineHeight: 16,
  },
  bar: {
    width: '70%',
    maxWidth: 28,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  labels: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  columnLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 11,
    textAlign: 'center',
  },
  changes: {
    gap: Spacing.half,
  },
});
