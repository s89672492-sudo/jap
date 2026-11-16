import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PinInput } from '@/components/ui/pin-input';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { isValidPin, PIN_MAX, PIN_MIN } from '@/lib/exam-pin';
import { clearExamPin, saveExamPin, useHasExamPin, verifyExamPin } from '@/stores/exam-pin-store';
import { useMockExamDraft } from '@/stores/mock-exam-draft-store';

type Step = 'idle' | 'set' | 'change' | 'remove';

/**
 * 設定頁「考試鎖密碼」：考模擬考時單字、閱讀等複習頁面會鎖住，輸入這組密碼可以解鎖。
 * - 新設密碼只能在沒有考試進行中時（避免考到一半自己設一組再解鎖）。
 * - 更改要輸入舊密碼；忘記密碼可以直接清除（清除後考試中就無法解鎖，不會讓人偷看）。
 */
export function ExamPinSection() {
  const theme = useTheme();
  const hasPin = useHasExamPin();
  const examActive = useMockExamDraft() !== null;
  const [step, setStep] = useState<Step>('idle');
  const [oldPin, setOldPin] = useState('');
  const [pin, setPin] = useState('');
  const [again, setAgain] = useState('');
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const reset = (next: Step, msg: { text: string; ok: boolean } | null = null) => {
    setStep(next);
    setOldPin('');
    setPin('');
    setAgain('');
    setMessage(msg);
  };

  const fail = (text: string) => setMessage({ text, ok: false });

  const submitNew = async () => {
    if (step === 'change' && !verifyExamPin(oldPin)) return fail('舊密碼不對');
    if (!isValidPin(pin)) return fail(`密碼要是 ${PIN_MIN}〜${PIN_MAX} 位數字`);
    if (pin !== again) return fail('兩次輸入的密碼不一樣');
    try {
      await saveExamPin(pin);
      reset('idle', { text: step === 'change' ? '已更改密碼' : '已設定密碼', ok: true });
    } catch {
      fail('沒有存到手機，請再試一次');
    }
  };

  const remove = async () => {
    try {
      await clearExamPin();
      reset('idle', { text: '已清除密碼', ok: true });
    } catch {
      fail('沒有存到手機，請再試一次');
    }
  };

  const feedback = message && (
    <ThemedText
      type="small"
      accessibilityLiveRegion="polite"
      style={{ color: message.ok ? theme.success : theme.accent }}>
      {message.text}
    </ThemedText>
  );

  if (step === 'set' || step === 'change') {
    return (
      <View style={styles.container}>
        {step === 'change' && <PinInput value={oldPin} onChange={setOldPin} label="目前的密碼" />}
        <PinInput value={pin} onChange={setPin} label={`新密碼（${PIN_MIN}〜${PIN_MAX} 位數字）`} />
        <PinInput value={again} onChange={setAgain} label="再輸入一次新密碼" onSubmit={submitNew} />
        {feedback}
        <PrimaryButton label={step === 'change' ? '更改密碼' : '設定密碼'} onPress={submitNew} />
        <SecondaryButton label="取消" onPress={() => reset('idle')} />
      </View>
    );
  }

  if (step === 'remove') {
    return (
      <View style={styles.container}>
        <ThemedText type="small">
          清除後，考試中的複習頁面就無法解鎖，要等考完或放棄考試才會打開。確定要清除嗎？
        </ThemedText>
        {feedback}
        <PrimaryButton label="清除密碼" onPress={remove} />
        <SecondaryButton label="取消" onPress={() => reset('idle')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold">{hasPin ? '🔒 已設定密碼' : '還沒有設定密碼'}</ThemedText>
      {feedback}
      {hasPin ? (
        <>
          <SecondaryButton label="更改密碼" onPress={() => reset('change')} />
          <SecondaryButton label="清除密碼（忘記密碼時）" onPress={() => reset('remove')} />
        </>
      ) : examActive ? (
        <ThemedText type="small" themeColor="textSecondary">
          模擬考進行中不能新設密碼，請考完或放棄考試後再設定。
        </ThemedText>
      ) : (
        <PrimaryButton label="設定密碼" onPress={() => reset('set')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
});
