import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CaseCard } from '@/components/detective/case-card';
import { WeaknessAnalysis } from '@/components/quiz/mock-exam/weakness-analysis';
import { ThemedText } from '@/components/themed-text';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';
import type { JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { MIN_EXAMS_FOR_OUTLOOK, passOutlook, weakestTypes } from '@/lib/exam-analysis';
import { useMockExamHistory } from '@/stores/mock-exam-store';

/** 首頁「模擬考」：最近成績、合格傾向、待補強的題型 */
export function ExamSummary({ level }: { level: JlptLevel }) {
  const theme = useTheme();
  const history = useMockExamHistory()[level] ?? [];
  const last = history[0];
  const outlook = passOutlook(history);
  const weak = weakestTypes(history, 3);
  const openExam = () => router.navigate({ pathname: '/quiz', params: { mode: 'exam' } });

  return (
    <CaseCard label="EXAM" title={`模擬考・${level}`}>
      {last ? (
        <>
          <View style={styles.row}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.flex}>
              最近一次（推估分數）
            </ThemedText>
            <ThemedText type="smallBold">{last.total} / 180</ThemedText>
            <ThemedText
              type="smallBold"
              style={{ color: last.passed ? theme.success : theme.accent }}>
              {last.passed ? '合格' : '不合格'}
            </ThemedText>
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {outlook.enough
              ? `合格傾向：最近 ${outlook.exams} 次有 ${outlook.passed} 次達到合格標準，平均 ${outlook.average} 分。`
              : `合格傾向：資料不足，暫不估算（考滿 ${MIN_EXAMS_FOR_OUTLOOK} 次後顯示）。`}
          </ThemedText>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            待補強的題型
          </ThemedText>
          <WeaknessAnalysis weak={weak} />
        </>
      ) : (
        <ThemedText type="small" themeColor="textSecondary">
          還沒考過 {level} 模擬考。考一次就能看到成績趨勢和要加強的題型。
        </ThemedText>
      )}
      <SecondaryButton label={last ? '查看完整分析・再考一次' : '去考模擬考'} onPress={openExam} />
    </CaseCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
  },
});
