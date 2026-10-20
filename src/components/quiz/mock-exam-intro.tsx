import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Spacing } from '@/constants/theme';
import type { JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_EXAM_CONFIG, type MockSitting } from '@/lib/mock-exam';
import {
  useMockExamHistory,
  useMockExamSeenCount,
  type MockExamRecord,
} from '@/stores/mock-exam-store';

type MockExamIntroProps = {
  level: JlptLevel;
  /** 預覽用的考科（題數、時間） */
  sittings: MockSitting[];
  onStart: () => void;
  /** 打開以前的考試紀錄，重看題目和解說 */
  onOpenRecord: (record: MockExamRecord) => void;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** 模擬考開始前的說明：考科、時間、合格標準、最近成績 */
export function MockExamIntro({ level, sittings, onStart, onOpenRecord }: MockExamIntroProps) {
  const theme = useTheme();
  const config = MOCK_EXAM_CONFIG[level];
  const history = useMockExamHistory()[level] ?? [];
  const seenCount = useMockExamSeenCount(level);
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
        <ThemedText type="small" themeColor="textSecondary">
          每次換題：漢字讀法、表記、文脈語彙、文法從數千題的題庫裡挑，優先出沒考過的，錯題本裡的題目會再考一次。讀解、聽解、言い換え、句子重組目前是固定題目。
          {seenCount > 0 ? `已考過 ${seenCount} 題。` : ''}
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
          <ThemedText type="small" themeColor="textSecondary">
            點一次考試，可以重看每一題、你的答案和解說（保留最近 10 次）。
          </ThemedText>
          {history.map((record) => {
            const row = (
              <>
                <View style={styles.historyRow}>
                  <ThemedText type="small" themeColor="textSecondary" style={styles.tabular}>
                    {formatDate(record.date)}
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
            return record.items ? (
              <Pressable
                key={record.date}
                accessibilityRole="button"
                accessibilityLabel={`查看 ${formatDate(record.date)} 的模擬考題目和解說`}
                onPress={() => onOpenRecord(record)}
                style={({ pressed }) => [
                  styles.historyItem,
                  { borderTopColor: theme.border },
                  pressed && styles.pressed,
                ]}>
                {row}
              </Pressable>
            ) : (
              <View
                key={record.date}
                style={[styles.historyItem, { borderTopColor: theme.border }]}>
                {row}
              </View>
            );
          })}
        </View>
      )}

      <PrimaryButton label="開始模擬考" onPress={onStart} />
      <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
        考試中切換等級，這次模擬考會中斷。題目為依 JLPT 題型自編的原創題，以及用 App
        裡的單字、文法例句自動出的題。
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
  historyItem: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.two,
    minHeight: 44,
    justifyContent: 'center',
    gap: Spacing.half,
  },
  pressed: {
    opacity: 0.7,
  },
  tabular: {
    fontVariant: ['tabular-nums'],
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
  },
});
