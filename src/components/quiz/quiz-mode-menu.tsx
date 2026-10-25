import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type QuizMode =
  | 'vocab'
  | 'reading'
  | 'grammar'
  | 'listening'
  | 'exam'
  | 'timed'
  | 'speaking'
  | 'review';

export const QUIZ_MODES: { value: QuizMode; icon: string; title: string; note: string }[] = [
  { value: 'vocab', icon: '📝', title: '單字', note: '看日文，選中文意思' },
  { value: 'reading', icon: '🔤', title: '讀音', note: '看漢字，選正確讀音' },
  { value: 'grammar', icon: '🧩', title: '文法', note: 'JLPT 式文法填空' },
  { value: 'listening', icon: '🎧', title: '聽力', note: '聽發音，選出單字' },
  { value: 'exam', icon: '📋', title: '試題', note: '題型練習、完整模擬考' },
  { value: 'timed', icon: '⏱️', title: '限時', note: '60 秒內答越多越好' },
  { value: 'speaking', icon: '🎤', title: '口說', note: '唸出單字，檢查發音' },
  { value: 'review', icon: '🔁', title: '錯題', note: '複習答錯過的題目' },
];

type QuizModeMenuProps = {
  onPick: (mode: QuizMode) => void;
  /** 做到一半的模式（切回來可以接著做），卡片上會標示 */
  inProgress: ReadonlySet<QuizMode>;
};

/** 測驗頁的入口：八種模式排成兩欄卡片，點了才開始答題 */
export function QuizModeMenu({ onPick, inProgress }: QuizModeMenuProps) {
  const theme = useTheme();

  return (
    <View style={styles.grid}>
      {QUIZ_MODES.map((mode) => (
        <Pressable
          key={mode.value}
          accessibilityRole="button"
          accessibilityLabel={`${mode.title}測驗：${mode.note}`}
          onPress={() => onPick(mode.value)}
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            pressed && styles.pressed,
          ]}>
          <ThemedText style={styles.icon}>{mode.icon}</ThemedText>
          <ThemedText type="smallBold" style={styles.title}>
            {mode.title}
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
            {mode.note}
          </ThemedText>
          {inProgress.has(mode.value) && (
            <ThemedText type="small" style={[styles.badge, { color: theme.accent }]}>
              回到上次進度 ›
            </ThemedText>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: Spacing.three,
  },
  card: {
    // 兩欄，中間留一點空
    width: '48%',
    minHeight: 120,
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  icon: {
    fontSize: 28,
    lineHeight: 36,
  },
  title: {
    fontSize: 17,
    letterSpacing: 2,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
  },
  badge: {
    fontSize: 12,
    marginTop: 'auto',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
