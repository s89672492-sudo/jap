import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_EXAM_MODE_LABELS } from '@/lib/mock-exam-session';
import { useMockExamDraft } from '@/stores/mock-exam-draft-store';

/**
 * 模擬考進行中時蓋住這一頁（單字、文法、文章），避免考試中查到答案。
 * 原本的畫面只是隱藏，考完回來還在原本的地方。
 * 這只能防止在 App 裡查答案，無法阻止用其他 App 或書本查詢。
 */
export function ExamLock({ what, children }: { what: string; children: ReactNode }) {
  const draft = useMockExamDraft();
  return (
    <>
      <View style={[styles.fill, draft && styles.hidden]}>{children}</View>
      {draft && <LockNotice what={what} />}
    </>
  );
}

function LockNotice({ what }: { what: string }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const draft = useMockExamDraft();
  if (!draft) return null;
  const sitting = draft.sittings[draft.sittingIndex];
  return (
    <View
      style={[
        styles.notice,
        {
          paddingTop: insets.top + Spacing.four,
          paddingLeft: insets.left + Spacing.three,
          paddingRight: insets.right + Spacing.three,
        },
      ]}>
      <View
        style={[
          styles.card,
          { backgroundColor: theme.backgroundElement, borderColor: theme.accent },
        ]}>
        <ThemedText type="subtitle" style={styles.center}>
          🔒 模擬考進行中
        </ThemedText>
        <ThemedText type="smallBold" style={styles.center}>
          {`${draft.level}・${MOCK_EXAM_MODE_LABELS[draft.mode]}・第 ${draft.sittingIndex + 1} 節　${sitting.label}`}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          考試期間暫停{what}
          ，避免看到答案。離開考試畫面的次數會記在成績單上；計時不會因為離開而暫停。
        </ThemedText>
        <PrimaryButton label="回到考試" onPress={() => router.navigate('/quiz')} />
      </View>
    </View>
  );
}

/** 首頁等處的提醒：有一場考試還沒考完 */
export function ExamInProgressBanner() {
  const theme = useTheme();
  const draft = useMockExamDraft();
  if (!draft) return null;
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.accent },
      ]}>
      <ThemedText type="smallBold" style={{ color: theme.accent }}>
        🔒 有一場模擬考還沒考完
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {draft.level}・{MOCK_EXAM_MODE_LABELS[draft.mode]}・第 {draft.sittingIndex + 1} /{' '}
        {draft.sittings.length} 節{draft.status === 'break' ? '（休息中）' : '（計時中）'}
      </ThemedText>
      <PrimaryButton label="繼續考試" onPress={() => router.navigate('/quiz')} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  hidden: {
    display: 'none',
  },
  notice: {
    flex: 1,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: MaxContentWidth,
    borderWidth: 2,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  center: {
    textAlign: 'center',
  },
});
