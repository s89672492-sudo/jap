import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import type { JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_EXAM_CONFIG, type MockSitting } from '@/lib/mock-exam';
import { useMockExamHistory } from '@/stores/mock-exam-store';

type MockExamIntroProps = {
  level: JlptLevel;
  /** 預覽用的考科（題數、時間） */
  sittings: MockSitting[];
  onStart: () => void;
};

/** 模擬考開始前的說明：考科、時間、合格標準、最近成績 */
export function MockExamIntro({ level, sittings, onStart }: MockExamIntroProps) {
  const theme = useTheme();
  const config = MOCK_EXAM_CONFIG[level];
  const history = useMockExamHistory()[level] ?? [];
  const totalQuestions = sittings.reduce((sum, s) => sum + s.questions.length, 0);
  const totalMinutes = sittings.reduce((sum, s) => sum + s.seconds / 60, 0);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.backgroundElement, borderColor: theme.border },
        ]}>
        <ThemedText type="smallBold" style={{ color: theme.accent }}>
          {level} 完整模擬考
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          照 JLPT 的考科順序作答，共 {totalQuestions} 題、約 {totalMinutes}{' '}
          分鐘。每一節有時間限制，時間到會自動交卷；作答中不顯示對錯，同一節內可以回頭改答案。
        </ThemedText>
        {sittings.map((sitting, i) => (
          <View key={sitting.label} style={[styles.row, { borderTopColor: theme.border }]}>
            <ThemedText type="smallBold" style={styles.rowLabel}>
              第 {i + 1} 節　{sitting.label}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {sitting.questions.length} 題・{sitting.seconds / 60} 分鐘（正式考試{' '}
              {sitting.officialMinutes} 分鐘）
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
          合格標準（JLPT 官方）
        </ThemedText>
        <ThemedText type="small">
          總分 {config.passMark} / 180 分以上，而且每一科都要達到基準點：
        </ThemedText>
        {config.sections.map((section) => (
          <ThemedText key={section.id} type="small" themeColor="textSecondary">
            ・{section.label}：0〜{section.max} 分，基準點 {section.min} 分
          </ThemedText>
        ))}
        <ThemedText type="small" themeColor="textSecondary">
          分數依答對比例換算，正式考試用的是等化後的分數，結果僅供參考。
        </ThemedText>
      </View>

      {history.length > 0 && (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
          ]}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            最近成績
          </ThemedText>
          {history.slice(0, 5).map((record) => (
            <View key={record.date} style={styles.historyRow}>
              <ThemedText type="small" themeColor="textSecondary" style={styles.tabular}>
                {record.date.slice(0, 10)}
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
          ))}
        </View>
      )}

      <PrimaryButton label="開始模擬考" onPress={onStart} />
      <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
        考試中切換到其他測驗模式或等級，這次模擬考會中斷。題目為依 JLPT 題型自編的原創題。
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  row: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.two,
    gap: Spacing.half,
  },
  rowLabel: {
    flexShrink: 1,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  tabular: {
    fontVariant: ['tabular-nums'],
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
  },
});
