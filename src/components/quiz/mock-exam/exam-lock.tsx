import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { PinInput } from '@/components/ui/pin-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_EXAM_MODE_LABELS, relockReview, unlockReview } from '@/lib/mock-exam-session';
import {
  getMockExamDraft,
  saveMockExamDraft,
  useMockExamDraft,
} from '@/stores/mock-exam-draft-store';
import { useHasExamPin, verifyExamPin } from '@/stores/exam-pin-store';

/** 連續錯幾次後要等一下 */
const MAX_TRIES = 5;
const COOLDOWN_MS = 30_000;
// 記在記憶體裡，換頁也不會重來（重新打開 App 才會）
let wrongTries = 0;
let blockedUntil = 0;

/**
 * 模擬考進行中時蓋住這一頁（單字、文法、文章），避免考試中查到答案。
 * 原本的畫面只是隱藏，考完回來還在原本的地方。
 * 在設定裡設了密碼的話，輸入密碼可以解鎖（這場考試接下來都能看，成績單會記下解鎖次數）。
 * 這只能防止在 App 裡查答案，無法阻止用其他 App 或書本查詢。
 * inline：放在捲動內容裡的小區塊（首頁），解鎖提示放在上方而不是浮在畫面底部。
 */
export function ExamLock({
  what,
  inline = false,
  children,
}: {
  what: string;
  inline?: boolean;
  children: ReactNode;
}) {
  const draft = useMockExamDraft();
  const locked = draft !== null && !draft.unlocked;
  return (
    <>
      {draft?.unlocked && inline && <UnlockedBar />}
      <View style={[styles.fill, locked && styles.hidden]}>{children}</View>
      {draft?.unlocked && !inline && <UnlockedBar floating />}
      {locked && <LockNotice what={what} />}
    </>
  );
}

/** 已解鎖時的提示和「重新鎖上」 */
function UnlockedBar({ floating = false }: { floating?: boolean }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const relock = () => {
    const current = getMockExamDraft();
    if (current) saveMockExamDraft(relockReview(current, Date.now()));
  };
  return (
    <View
      pointerEvents="box-none"
      style={
        floating
          ? [styles.floating, { bottom: insets.bottom + BottomTabInset + Spacing.two }]
          : undefined
      }>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.gold,
            boxShadow: `0 3px 10px ${theme.shadow}`,
          },
        ]}>
        <ThemedText type="small" style={styles.flex}>
          🔓 考試中已用密碼解鎖
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="重新鎖上複習頁面"
          onPress={relock}
          hitSlop={6}
          style={({ pressed }) => [
            styles.relock,
            { borderColor: theme.accent },
            pressed && styles.pressed,
          ]}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            重新鎖上
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

/** 輸入密碼解鎖；沒設密碼時說明要到設定裡設 */
function PinUnlock() {
  const theme = useTheme();
  const hasPin = useHasExamPin();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!hasPin) {
    return (
      <ThemedText type="small" themeColor="textSecondary">
        想在考試中打開，要先在考試開始前到「設定 → 考試鎖密碼」設定密碼。
      </ThemedText>
    );
  }

  const unlock = () => {
    const now = Date.now();
    if (now < blockedUntil) {
      setError(`錯太多次了，請 ${Math.ceil((blockedUntil - now) / 1000)} 秒後再試`);
      return;
    }
    if (!verifyExamPin(pin)) {
      wrongTries += 1;
      setPin('');
      if (wrongTries >= MAX_TRIES) {
        wrongTries = 0;
        blockedUntil = now + COOLDOWN_MS;
        setError(`密碼不對。錯太多次了，請 ${COOLDOWN_MS / 1000} 秒後再試`);
      } else setError('密碼不對，請再試一次');
      return;
    }
    wrongTries = 0;
    setPin('');
    setError(null);
    const current = getMockExamDraft();
    if (current) saveMockExamDraft(unlockReview(current, now));
  };

  return (
    <View style={styles.pinBox}>
      <ThemedText type="smallBold">輸入密碼解鎖</ThemedText>
      <PinInput value={pin} onChange={setPin} label="考試鎖密碼" onSubmit={unlock} />
      {error && (
        <ThemedText type="small" style={{ color: theme.accent }} accessibilityLiveRegion="polite">
          {error}
        </ThemedText>
      )}
      <SecondaryButton label="🔓 解鎖" onPress={unlock} />
      <ThemedText type="small" themeColor="textSecondary">
        解鎖後這場考試都可以看，成績單會記下解鎖的次數。
      </ThemedText>
    </View>
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
        <PinUnlock />
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
  flex: {
    flex: 1,
  },
  floating: {
    position: 'absolute',
    left: Spacing.three,
    right: Spacing.three,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderWidth: 2,
    borderRadius: Spacing.three,
    paddingVertical: Spacing.one,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.one,
  },
  relock: {
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  pressed: {
    opacity: 0.6,
  },
  pinBox: {
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
});
