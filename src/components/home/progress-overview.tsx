import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { LevelProgressList, MasteryLegend } from './level-progress-list';

import { CaseCard } from '@/components/detective/case-card';
import { ThemedText } from '@/components/themed-text';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { StackedBar } from '@/components/ui/stacked-bar';
import { Spacing } from '@/constants/theme';
import { JLPT_LEVELS } from '@/data/vocab';
import type { LearningProgress } from '@/hooks/use-learning-progress';
import { useTheme } from '@/hooks/use-theme';
import { accuracy, percent, recentDays } from '@/lib/progress';
import type { Mastery } from '@/lib/srs';

/** 學習進度總覽：各等級單字掌握度、文法進度、最近 7 天練習量、答對率、待複習數量 */
export function ProgressOverview({ progress }: { progress: LearningProgress }) {
  const theme = useTheme();
  const { levels, log, now, today } = progress;

  const totals = JLPT_LEVELS.reduce(
    (sum, level) => {
      const p = levels[level];
      for (const key of Object.keys(sum.words) as Mastery[]) sum.words[key] += p.words[key];
      sum.dueWords += p.dueWords;
      sum.dueGrammar += p.dueGrammar;
      sum.dueMistakes += p.dueMistakes;
      sum.mistakes += p.mistakes;
      return sum;
    },
    {
      words: { new: 0, learning: 0, reviewing: 0, mastered: 0 } as Record<Mastery, number>,
      dueWords: 0,
      dueGrammar: 0,
      dueMistakes: 0,
      mistakes: 0,
    },
  );

  const week = recentDays(log, now);
  const maxDay = Math.max(1, ...week.map((d) => d.n));
  const weekTotal = week.reduce((sum, d) => sum + d.n, 0);
  const activeDays = week.filter((d) => d.n > 0).length;

  return (
    <View style={styles.container}>
      <CaseCard label="FILE 01" title="單字掌握度">
        <MasteryLegend counts={totals.words} />
        <LevelProgressList levels={levels} legend={false} />
        <ThemedText type="small" themeColor="textSecondary">
          學習中：複習間隔不到 7 天；複習中：7〜20 天；已熟練：21 天以上。
        </ThemedText>
      </CaseCard>

      <CaseCard label="FILE 02" title="文法進度">
        <View style={styles.list}>
          {JLPT_LEVELS.map((level) => {
            const p = levels[level];
            return (
              <View key={level} style={styles.barRow}>
                <View style={styles.rowHead}>
                  <ThemedText type="smallBold">{level}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    練過 {p.grammarPracticed} / {p.grammarTotal}・熟練 {p.grammarMastered}
                  </ThemedText>
                </View>
                <StackedBar
                  total={p.grammarTotal}
                  segments={[
                    { value: p.grammarMastered, color: theme.success },
                    { value: p.grammarPracticed - p.grammarMastered, color: theme.primary },
                  ]}
                  accessibilityLabel={`${level} 文法：練過 ${p.grammarPracticed}，熟練 ${p.grammarMastered}，共 ${p.grammarTotal}`}
                />
              </View>
            );
          })}
        </View>
      </CaseCard>

      <CaseCard label="FILE 03" title="最近 7 天練習量">
        <ThemedText type="small" themeColor="textSecondary">
          共 {weekTotal} 題・有練習 {activeDays} 天
        </ThemedText>
        <View
          style={styles.chart}
          accessible
          accessibilityLabel={week.map((d) => `${d.label} ${d.n} 題`).join('、')}>
          {week.map((day) => (
            <View key={day.date} style={styles.column}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.columnValue}>
                {day.n}
              </ThemedText>
              <View style={styles.columnTrack}>
                {day.n > 0 && (
                  <View style={[styles.columnBar, { height: `${(day.n / maxDay) * 100}%` }]}>
                    <View style={{ flex: day.n - day.c, backgroundColor: theme.accent }} />
                    <View style={{ flex: day.c, backgroundColor: theme.success }} />
                  </View>
                )}
              </View>
              <ThemedText
                type="small"
                style={[
                  styles.columnLabel,
                  { color: day.date === today ? theme.accent : theme.textSecondary },
                ]}>
                {day.label}
              </ThemedText>
            </View>
          ))}
        </View>
        <View style={styles.legend}>
          <LegendDot color={theme.success} label="答對" />
          <LegendDot color={theme.accent} label="答錯" />
        </View>
      </CaseCard>

      <CaseCard label="FILE 04" title="答對率">
        <View style={styles.stats}>
          <Stat label="今天" value={percent(accuracy(log[today] ? [log[today]] : []))} />
          <Stat label="近 7 天" value={percent(accuracy(week))} />
          <Stat label="全部紀錄" value={percent(accuracy(Object.values(log)))} />
        </View>
      </CaseCard>

      <CaseCard label="FILE 05" title="待複習數量">
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.cellLabel}>
              等級
            </ThemedText>
            {['單字', '文法', '錯題'].map((head) => (
              <ThemedText key={head} type="small" themeColor="textSecondary" style={styles.cell}>
                {head}
              </ThemedText>
            ))}
          </View>
          {JLPT_LEVELS.map((level) => {
            const p = levels[level];
            return (
              <View key={level} style={styles.tableRow}>
                <ThemedText type="smallBold" style={styles.cellLabel}>
                  {level}
                </ThemedText>
                {[p.dueWords, p.dueGrammar, p.dueMistakes].map((value, i) => (
                  <ThemedText
                    key={i}
                    type={value > 0 ? 'smallBold' : 'small'}
                    style={[styles.cell, value > 0 ? { color: theme.accent } : null]}>
                    {value}
                  </ThemedText>
                ))}
              </View>
            );
          })}
          <View style={[styles.tableRow, styles.totalRow, { borderTopColor: theme.border }]}>
            <ThemedText type="smallBold" style={styles.cellLabel}>
              合計
            </ThemedText>
            {[totals.dueWords, totals.dueGrammar, totals.dueMistakes].map((value, i) => (
              <ThemedText key={i} type="smallBold" style={styles.cell}>
                {value}
              </ThemedText>
            ))}
          </View>
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          錯題本共 {totals.mistakes} 題。單字、文法在測驗和單字卡會優先出到期的；錯題請到「推理測驗
          › 錯題」複習。
        </ThemedText>
        {totals.mistakes > 0 && (
          <SecondaryButton
            label="複習錯題"
            onPress={() => router.navigate({ pathname: '/quiz', params: { mode: 'review' } })}
          />
        )}
      </CaseCard>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="default" style={styles.statValue} numberOfLines={1}>
        {value}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
        {label}
      </ThemedText>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <ThemedText type="small" themeColor="textSecondary">
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
  },
  list: {
    gap: Spacing.three,
    paddingTop: Spacing.two,
  },
  barRow: {
    gap: Spacing.one,
  },
  rowHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chart: {
    flexDirection: 'row',
    gap: Spacing.one,
    paddingTop: Spacing.two,
  },
  column: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    gap: Spacing.half,
  },
  columnValue: {
    fontSize: 12,
  },
  columnTrack: {
    height: 100,
    width: '100%',
    maxWidth: 28,
    justifyContent: 'flex-end',
  },
  columnBar: {
    width: '100%',
    minHeight: 3,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    overflow: 'hidden',
  },
  columnLabel: {
    fontSize: 12,
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  stat: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 700,
  },
  table: {
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  tableRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  totalRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.one,
  },
  cellLabel: {
    flex: 1,
  },
  cell: {
    flex: 1,
    textAlign: 'right',
  },
});
