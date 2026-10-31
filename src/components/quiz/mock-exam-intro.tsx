import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { MockExamHistoryItem } from './mock-exam-history-item';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import type { JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';
import { PLANNED_PAPERS } from '@/data/exam/papers';
import {
  RANDOM_PAPER_ID,
  buildFixedPaper,
  findPaper,
  fixedPapers,
  latestPaperVersion,
} from '@/lib/exam-paper';
import { MOCK_EXAM_CONFIG, buildMockExam } from '@/lib/mock-exam';
import { MOCK_EXAM_MODE_LABELS, sittingSeconds, type MockExamMode } from '@/lib/mock-exam-session';
import {
  clearMockExamSeen,
  useMockExamHistory,
  useMockExamSeenCount,
  type MockExamRecord,
} from '@/stores/mock-exam-store';

type MockExamIntroProps = {
  level: JlptLevel;
  /** paperId：random（隨機組卷）或固定考卷的 id */
  onStart: (mode: MockExamMode, paperId: string) => void;
  /** 打開以前的考試紀錄，重看題目和解說 */
  onOpenRecord: (record: MockExamRecord) => void;
};

function PaperChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress?: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled: !onPress }}
      aria-checked={selected}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.paperChip,
        {
          borderColor: selected ? theme.primary : theme.border,
          backgroundColor: selected ? theme.primary : theme.background,
          opacity: onPress ? 1 : 0.55,
        },
        pressed && styles.pressed,
      ]}>
      <ThemedText
        type="smallBold"
        style={{ color: selected ? theme.onPrimary : onPress ? theme.text : theme.textSecondary }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const MODE_OPTIONS: { value: MockExamMode; label: string }[] = [
  { value: 'official', label: '正式時間' },
  { value: 'practice', label: '練習' },
];

/** 模擬考開始前的說明：考科、時間、合格標準、最近成績 */
export function MockExamIntro({ level, onStart, onOpenRecord }: MockExamIntroProps) {
  const theme = useTheme();
  const config = MOCK_EXAM_CONFIG[level];
  const history = useMockExamHistory()[level] ?? [];
  const seenCount = useMockExamSeenCount(level);
  const [confirmClear, setConfirmClear] = useState(false);
  const [mode, setMode] = useState<MockExamMode>('official');
  const [paperId, setPaperId] = useState(RANDOM_PAPER_ID);
  const papers = fixedPapers(level);
  const paper = findPaper(level, paperId);
  // 換等級時回到隨機組卷
  if (paperId !== RANDOM_PAPER_ID && !paper) setPaperId(RANDOM_PAPER_ID);
  // 預覽題數和時間（隨機考卷用固定的預覽種子）
  const sittings = useMemo(
    () => (paper ? buildFixedPaper(level, paper) : buildMockExam(level)),
    [level, paper],
  );
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
          {level === 'N5' || level === 'N4'
            ? '題庫現況：文字語彙、文法、讀解、聽解都照正式題型比例出題。聽解用手機內建語音播放（還沒有真人音檔），發話表現用文字說明情境（還沒有插圖）。'
            : '題庫現況：漢字讀法、表記、文脈語彙、文法形式有數千題可以挑；讀解、聽解、言い換え、句子重組的題數還少（正在擴充），所以這些題型常會重複，題數也比正式考試少。'}
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
        <ThemedText type="smallBold">考卷</ThemedText>
        <View style={styles.papers}>
          <PaperChip
            label="隨機組卷"
            selected={paperId === RANDOM_PAPER_ID}
            onPress={() => setPaperId(RANDOM_PAPER_ID)}
          />
          {Array.from({ length: PLANNED_PAPERS }, (_, i) => {
            const fixed = papers.find((p) => p.number === i + 1);
            return (
              <PaperChip
                key={i}
                label={fixed ? `第 ${i + 1} 回` : `第 ${i + 1} 回（準備中）`}
                selected={fixed !== undefined && paperId === fixed.id}
                onPress={fixed ? () => setPaperId(fixed.id) : undefined}
              />
            );
          })}
        </View>
        <ThemedText type="small" themeColor="textSecondary">
          {paper
            ? `${paper.title}（第 ${latestPaperVersion(paper).version} 版）：題目和選項順序每次都一樣，適合重考比較進步。`
            : '隨機組卷：依 JLPT 題型比例從題庫挑題，優先出錯題本和沒考過的題目，同一篇文章不會出兩次。'}
        </ThemedText>
        <ThemedText type="smallBold">時間</ThemedText>
        <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={setMode} />
        <ThemedText type="small" themeColor="textSecondary">
          {mode === 'official'
            ? '正式時間：每節照 JLPT 官方時間。這份模擬考的題數比正式考試少，所以時間會比較寬鬆。'
            : '練習：依這份考卷的題數換算時間（語彙每題 45 秒、文法 60 秒、讀解 2〜4 分鐘、聽解 75 秒）。'}
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
        onPress={() => onStart(mode, paperId)}
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
  papers: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  paperChip: {
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
