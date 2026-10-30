import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MockExamHistoryItem } from './mock-exam-history-item';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import type { JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_EXAM_CONFIG, type MockSitting } from '@/lib/mock-exam';
import { MOCK_EXAM_MODE_LABELS, sittingSeconds, type MockExamMode } from '@/lib/mock-exam-session';
import {
  clearMockExamSeen,
  useMockExamHistory,
  useMockExamSeenCount,
  type MockExamRecord,
} from '@/stores/mock-exam-store';

type MockExamIntroProps = {
  level: JlptLevel;
  /** 預覽用的考科（題數、時間） */
  sittings: MockSitting[];
  onStart: (mode: MockExamMode) => void;
  /** 打開以前的考試紀錄，重看題目和解說 */
  onOpenRecord: (record: MockExamRecord) => void;
};

const MODE_OPTIONS: { value: MockExamMode; label: string }[] = [
  { value: 'official', label: '正式時間' },
  { value: 'practice', label: '練習' },
];

/** 模擬考開始前的說明：考科、時間、合格標準、最近成績 */
export function MockExamIntro({ level, sittings, onStart, onOpenRecord }: MockExamIntroProps) {
  const theme = useTheme();
  const config = MOCK_EXAM_CONFIG[level];
  const history = useMockExamHistory()[level] ?? [];
  const seenCount = useMockExamSeenCount(level);
  const [confirmClear, setConfirmClear] = useState(false);
  const [mode, setMode] = useState<MockExamMode>('official');
  const totalQuestions = sittings.reduce((sum, s) => sum + s.questions.length, 0);
  const totalMinutes = sittings.reduce((sum, s) => sum + sittingSeconds(s, mode) / 60, 0);

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
          照 JLPT 的考科順序作答，共 {totalQuestions} 題、{totalMinutes}{' '}
          分鐘。每一節有時間限制，時間到會自動交卷；作答中不顯示對錯，同一節內可以跳題、改答案、標記稍後檢查。
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          作答進度會自動存在手機裡，重新整理或關掉 App
          後可以接著考；時間照截止時間計算，不會因為重新整理而增加。考試期間會暫停單字、閱讀和其他練習，離開考試畫面的次數會記在成績單。
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          每次換題：漢字讀法、表記、文脈語彙、文法從數千題的題庫裡挑，優先出沒考過的，錯題本裡的題目會再考一次。讀解、聽解、言い換え、句子重組目前是固定題目。
          {seenCount > 0 ? `已考過 ${seenCount} 題。` : ''}
        </ThemedText>
        {seenCount > 0 &&
          (confirmClear ? (
            <View style={[styles.confirm, { backgroundColor: theme.backgroundSelected }]}>
              <ThemedText type="small">
                清除「已考過」的紀錄？之後考過的題目也可能再出現。成績紀錄和錯題本不會刪除。
              </ThemedText>
              <View style={styles.confirmButtons}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setConfirmClear(false)}
                  style={({ pressed }) => [
                    styles.smallButton,
                    { borderColor: theme.border },
                    pressed && styles.pressed,
                  ]}>
                  <ThemedText type="small">取消</ThemedText>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    clearMockExamSeen(level);
                    setConfirmClear(false);
                  }}
                  style={({ pressed }) => [
                    styles.smallButton,
                    { borderColor: theme.accent, backgroundColor: theme.accent },
                    pressed && styles.pressed,
                  ]}>
                  <ThemedText type="smallBold" style={{ color: theme.onPrimary }}>
                    確定清除
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => setConfirmClear(true)}
              style={({ pressed }) => [
                styles.smallButton,
                styles.alignStart,
                { borderColor: theme.border },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="small" themeColor="textSecondary">
                清除已考過的題目紀錄
              </ThemedText>
            </Pressable>
          ))}
        <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={setMode} />
        <ThemedText type="small" themeColor="textSecondary">
          {mode === 'official'
            ? '正式時間：每節照 JLPT 官方時間。這份模擬考的題數比正式考試少，所以時間會比較寬鬆。'
            : '練習：依這份考卷的題數換算時間（語彙每題 45 秒、文法 60 秒、讀解 2〜4 分鐘、聽解 90 秒）。'}
        </ThemedText>
        {sittings.map((sitting, i) => (
          <View key={sitting.label} style={[styles.row, { borderTopColor: theme.border }]}>
            <ThemedText type="smallBold" style={styles.rowLabel}>
              第 {i + 1} 節　{sitting.label}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {sitting.questions.length} 題・{sittingSeconds(sitting, mode) / 60} 分鐘
              {mode === 'practice' ? `（正式考試 ${sitting.officialMinutes} 分鐘）` : ''}
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
            點一次考試，可以重看每一題、你的答案和解說（保留最近 10 次）；不要的紀錄可以按「刪除」。
          </ThemedText>
          {history.map((record) => (
            <MockExamHistoryItem
              key={record.date}
              level={level}
              record={record}
              onOpen={onOpenRecord}
            />
          ))}
        </View>
      )}

      <PrimaryButton
        label={`開始模擬考（${MOCK_EXAM_MODE_LABELS[mode]}）`}
        onPress={() => onStart(mode)}
      />
      <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
        題目為依 JLPT 題型自編的原創練習題，以及用 App
        裡的單字、文法例句自動出的題，不是官方歷屆試題。
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
  confirm: {
    borderRadius: Spacing.two,
    padding: Spacing.two,
    gap: Spacing.two,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
  smallButton: {
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignStart: {
    alignSelf: 'flex-start',
  },
  pressed: {
    opacity: 0.7,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
  },
});
