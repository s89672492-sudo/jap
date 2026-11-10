import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, IconBadge, type IconName, type IconTone } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type QuizMode =
  | 'vocab'
  | 'reading'
  | 'grammar'
  | 'listening'
  | 'exam'
  | 'timed'
  | 'speaking'
  | 'spelling'
  | 'review';

type ModeInfo = { value: QuizMode; icon: IconName; title: string; note: string };

export const QUIZ_MODES: ModeInfo[] = [
  { value: 'vocab', icon: 'meaning', title: '單字', note: '看日文，選中文意思' },
  { value: 'reading', icon: 'kana', title: '讀音', note: '看漢字，選正確讀音' },
  { value: 'grammar', icon: 'grammar', title: '文法', note: 'JLPT 式文法填空' },
  { value: 'listening', icon: 'listening', title: '聽力', note: '聽發音，選出單字' },
  { value: 'exam', icon: 'exam', title: '試題', note: '題型練習、完整模擬考' },
  { value: 'timed', icon: 'timed', title: '限時', note: '60 秒內答越多越好' },
  { value: 'speaking', icon: 'speaking', title: '口說', note: '唸出單字，檢查發音' },
  { value: 'spelling', icon: 'spelling', title: '拼寫', note: '看中文，用假名方塊拼讀音' },
  { value: 'review', icon: 'review', title: '錯題', note: '複習答錯過的題目' },
];

/** 選單上的分組：同一類的練習排在一起、用同一個顏色 */
const GROUPS: { title: string; tone: IconTone; modes: QuizMode[] }[] = [
  { title: '單字', tone: 'primary', modes: ['vocab', 'reading', 'spelling', 'timed'] },
  { title: '聽和說', tone: 'success', modes: ['listening', 'speaking'] },
  { title: '文法和考試', tone: 'gold', modes: ['grammar', 'exam'] },
  { title: '複習', tone: 'accent', modes: ['review'] },
];

type QuizModeMenuProps = {
  onPick: (mode: QuizMode) => void;
  /** 做到一半的模式（切回來可以接著做），列上會標示 */
  inProgress: ReadonlySet<QuizMode>;
};

/** 測驗頁的入口：各種模式依類別分組，一列一種，點了才開始答題 */
export function QuizModeMenu({ onPick, inProgress }: QuizModeMenuProps) {
  const theme = useTheme();

  return (
    <View style={styles.menu}>
      {GROUPS.map((group) => (
        <View key={group.title} style={styles.group}>
          <ThemedText type="smallBold" themeColor="textSecondary" style={styles.groupTitle}>
            {group.title}
          </ThemedText>
          <View
            style={[
              styles.list,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
                boxShadow: `0 2px 10px ${theme.shadow}`,
              },
            ]}>
            {group.modes.map((value, index) => {
              const mode = QUIZ_MODES.find((m) => m.value === value)!;
              return (
                <Pressable
                  key={mode.value}
                  accessibilityRole="button"
                  accessibilityLabel={`${mode.title}測驗：${mode.note}${inProgress.has(mode.value) ? '（做到一半）' : ''}`}
                  onPress={() => onPick(mode.value)}
                  style={({ pressed }) => [
                    styles.row,
                    index > 0 && { borderTopWidth: 1, borderTopColor: theme.border },
                    pressed && { backgroundColor: theme.backgroundSelected },
                  ]}>
                  <IconBadge name={mode.icon} tone={group.tone} size={44} />
                  <View style={styles.text}>
                    <ThemedText style={styles.title}>{mode.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
                      {mode.note}
                    </ThemedText>
                  </View>
                  {inProgress.has(mode.value) && (
                    <View style={[styles.resume, { backgroundColor: theme.accentSoft }]}>
                      <ThemedText style={[styles.resumeText, { color: theme.accent }]}>
                        接著做
                      </ThemedText>
                    </View>
                  )}
                  <Icon name="chevron" size={20} color={theme.textSecondary} />
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    gap: Spacing.three,
  },
  group: {
    gap: Spacing.two,
  },
  groupTitle: {
    paddingHorizontal: Spacing.one,
  },
  list: {
    borderWidth: 1,
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
    minHeight: 68,
    paddingVertical: Spacing.two + 2,
    paddingHorizontal: Spacing.three - 4,
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: 700,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
  },
  resume: {
    borderRadius: Radius.tag,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
  },
  resumeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 700,
  },
});
