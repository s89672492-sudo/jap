import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ExamQuestionView } from './exam-question-view';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import { EXAM_SUBCATEGORY_LABELS, TYPE_DEFAULTS, type ExamSubcategory } from '@/data/exam';
import type { JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { compareWithPrevious, MIN_ITEMS_FOR_WEAKNESS } from '@/lib/exam-analysis';
import type { MockExamResult } from '@/lib/mock-exam';
import { MOCK_EXAM_MODE_LABELS } from '@/lib/mock-exam-session';
import type { ExamRoundQuestion } from '@/lib/quiz';
import { useMockExamHistory, type MockExamRecord } from '@/stores/mock-exam-store';

import { WeaknessAnalysis } from './mock-exam/weakness-analysis';

type MockExamReportProps = {
  level: JlptLevel;
  result: MockExamResult;
  items: ExamRoundQuestion[];
  answers: Record<string, string>;
  /** 重看以前的考試時，考試的時間（ISO 字串） */
  date?: string;
  /** 這次考試的紀錄（模式、離開次數、作答時間；舊紀錄可能沒有） */
  record?: MockExamRecord;
  onRetry: () => void;
  onBack: () => void;
};

type ReviewFilter = 'wrong' | 'all';

const FILTER_OPTIONS: { value: ReviewFilter; label: string }[] = [
  { value: 'wrong', label: '只看錯題' },
  { value: 'all', label: '全部題目' },
];

/** 模擬考成績單：合格判定、各科分數、各題型正確率、逐題檢討 */
export function MockExamReport({
  level,
  result,
  items,
  answers,
  date,
  record,
  onRetry,
  onBack,
}: MockExamReportProps) {
  const theme = useTheme();
  const [filter, setFilter] = useState<ReviewFilter>('wrong');

  const history = useMockExamHistory()[level] ?? [];
  // 各大問的答對率（依出題順序）
  const byType = new Map<ExamSubcategory, { correct: number; total: number }>();
  for (const item of items) {
    const sub = item.question.subcategory ?? TYPE_DEFAULTS[item.question.type].subcategory;
    const entry = byType.get(sub) ?? { correct: 0, total: 0 };
    entry.total++;
    if (answers[item.question.id] === item.answer) entry.correct++;
    byType.set(sub, entry);
  }
  // 這次考試最弱的大問（題數太少的不算）
  const weak = [...byType.entries()]
    .map(([subcategory, { correct, total }]) => ({
      subcategory,
      label: EXAM_SUBCATEGORY_LABELS[subcategory],
      correct,
      total,
      rate: total === 0 ? 0 : correct / total,
    }))
    .filter((s) => s.total >= Math.min(MIN_ITEMS_FOR_WEAKNESS, 3) && s.rate < 0.8)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 3);
  const comparison = record ? compareWithPrevious(record, history) : null;
  const answeredCount = (record?.items ?? []).filter((item) => (item.ms ?? 0) > 0).length;
  const unanswered = items.filter((item) => answers[item.question.id] === undefined).length;
  const totalMs = (record?.items ?? []).reduce((sum, item) => sum + (item.ms ?? 0), 0);
  const details = [
    record?.mode ? `${MOCK_EXAM_MODE_LABELS[record.mode]}模式` : null,
    `未作答 ${unanswered} 題`,
    totalMs > 0 ? `作答時間約 ${Math.max(1, Math.round(totalMs / 60000))} 分鐘` : null,
    totalMs > 0 && answeredCount > 0
      ? `每題平均 ${Math.round(totalMs / answeredCount / 1000)} 秒`
      : null,
    record?.leaveCount !== undefined ? `離開考試畫面 ${record.leaveCount} 次` : null,
  ].filter(Boolean);
  const reviewItems = items.filter(
    (item) => filter === 'all' || answers[item.question.id] !== item.answer,
  );

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.verdict,
          {
            borderColor: result.passed ? theme.success : theme.accent,
            backgroundColor: theme.backgroundElement,
          },
        ]}>
        <ThemedText type="small" themeColor="textSecondary">
          {date ? `${new Date(date).toLocaleString()} 的模擬考（推估）` : '模擬考結果（推估）'}
        </ThemedText>
        <ThemedText
          style={[styles.verdictText, { color: result.passed ? theme.success : theme.accent }]}>
          {result.passed ? '合格' : '不合格'}
        </ThemedText>
        <ThemedText style={styles.total}>
          {result.total}
          <ThemedText themeColor="textSecondary"> / 180</ThemedText>
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          合格點 {result.passMark} 分，且每科都要達到基準點
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          {details.join('・')}
        </ThemedText>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        <ThemedText type="smallBold" style={{ color: theme.accent }}>
          各科分數
        </ThemedText>
        {result.sections.map(({ section, score, correct, total, passed }) => (
          <View key={section.id} style={styles.sectionRow}>
            <View style={styles.sectionHead}>
              <ThemedText type="smallBold" style={styles.flex}>
                {section.label}
              </ThemedText>
              <ThemedText
                type="smallBold"
                style={[styles.tabular, { color: passed ? theme.text : theme.accent }]}>
                {score} / {section.max}
              </ThemedText>
            </View>
            <View style={[styles.track, { backgroundColor: theme.backgroundSelected }]}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${(score / section.max) * 100}%`,
                    backgroundColor: passed ? theme.success : theme.accent,
                  },
                ]}
              />
              {/* 基準點的位置 */}
              <View
                style={[
                  styles.minMark,
                  { left: `${(section.min / section.max) * 100}%`, backgroundColor: theme.text },
                ]}
              />
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              答對 {correct} / {total} 題・基準點 {section.min} 分{passed ? '' : '（未達基準點）'}
            </ThemedText>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        <ThemedText type="smallBold" style={{ color: theme.accent }}>
          各題型正確率
        </ThemedText>
        {[...byType.entries()].map(([type, { correct, total }]) => {
          const rate = total === 0 ? 0 : correct / total;
          return (
            <View key={type} style={styles.typeRow}>
              <ThemedText type="small" style={styles.typeLabel}>
                {EXAM_SUBCATEGORY_LABELS[type]}
              </ThemedText>
              <View
                style={[styles.track, styles.flex, { backgroundColor: theme.backgroundSelected }]}>
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${rate * 100}%`,
                      backgroundColor: rate >= 0.6 ? theme.success : theme.gold,
                    },
                  ]}
                />
              </View>
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={[styles.tabular, styles.typeCount]}>
                {correct}/{total}
              </ThemedText>
            </View>
          );
        })}
        <ThemedText type="small" themeColor="textSecondary">
          正確率低於六成的題型（黃色）建議優先加強。答錯的題目已加入錯題本。
        </ThemedText>
      </View>

      {comparison && (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          ]}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            和上一次比較
          </ThemedText>
          <ThemedText type="smallBold">
            總分 {comparison.totalDiff > 0 ? '+' : ''}
            {comparison.totalDiff} 分
          </ThemedText>
          {comparison.sections.map((s) => (
            <ThemedText key={s.label} type="small" themeColor="textSecondary">
              ・{s.label}：{s.diff > 0 ? '+' : ''}
              {s.diff}
            </ThemedText>
          ))}
        </View>
      )}

      <View
        style={[
          styles.card,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        <ThemedText type="smallBold" style={{ color: theme.accent }}>
          這次最弱的題型
        </ThemedText>
        <WeaknessAnalysis weak={weak} />
      </View>

      <ThemedText type="smallBold">逐題檢討</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        綠色是正確答案，紅色是你選的答案。這次的題目和你的答案已經存下來，之後可以在模擬考說明頁的「最近成績」再打開來複習。
      </ThemedText>
      <SegmentedControl options={FILTER_OPTIONS} value={filter} onChange={setFilter} />
      {reviewItems.length === 0 && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.center}>
          全部答對，太厲害了！
        </ThemedText>
      )}
      {reviewItems.map((item) => {
        const number = items.indexOf(item) + 1;
        const mine = answers[item.question.id];
        const correct = mine === item.answer;
        return (
          <View
            key={item.question.id}
            style={[
              styles.card,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}>
            <View style={styles.sectionHead}>
              <ThemedText
                type="smallBold"
                style={{ color: correct ? theme.success : theme.accent }}>
                第 {number} 題 {correct ? '○' : '×'}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {
                  EXAM_SUBCATEGORY_LABELS[
                    item.question.subcategory ?? TYPE_DEFAULTS[item.question.type].subcategory
                  ]
                }
              </ThemedText>
            </View>
            {!mine && (
              <ThemedText type="small" style={{ color: theme.accent }}>
                這題沒有作答
              </ThemedText>
            )}
            <ExamQuestionView
              item={item}
              picked={mine ?? ''}
              getState={(option) => {
                if (option === item.answer) return 'correct';
                if (option === mine) return 'wrong';
                return 'idle';
              }}
              onPick={() => {}}
            />
          </View>
        );
      })}

      <PrimaryButton label="再考一次" onPress={onRetry} />
      <SecondaryButton label="回到模擬考說明" onPress={onBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  verdict: {
    borderWidth: 2,
    borderRadius: Spacing.three,
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.one,
  },
  verdictText: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 700,
    letterSpacing: 6,
  },
  total: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 700,
    fontVariant: ['tabular-nums'],
  },
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  sectionRow: {
    gap: Spacing.one,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
    minWidth: 0,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  fill: {
    height: '100%',
  },
  minMark: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  typeLabel: {
    width: 72,
  },
  typeCount: {
    width: 36,
    textAlign: 'right',
  },
  tabular: {
    fontVariant: ['tabular-nums'],
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  center: {
    textAlign: 'center',
  },
});
