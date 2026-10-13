import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { TEACHER_MODELS, type TeacherModelKey } from '@/lib/local-llm-models';

type InterruptedNoticeProps = {
  from: TeacherModelKey;
  /** 自動改用的較小模型；已經是最小的就是 null */
  to: TeacherModelKey | null;
  onDismiss: () => void;
};

/** 上次載入或回答時頁面被瀏覽器重新整理（通常是記憶體不足）的說明 */
export function InterruptedNotice({ from, to, onDismiss }: InterruptedNoticeProps) {
  const theme = useTheme();
  const fromLabel = TEACHER_MODELS[from].label;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.accent },
      ]}>
      <ThemedText type="smallBold" style={{ color: theme.accent }}>
        上次「{fromLabel}」模型沒有跑完
      </ThemedText>
      <ThemedText type="small">
        頁面被瀏覽器自動重新整理了，通常是這台裝置的記憶體不夠執行這個模型。
        {to
          ? `已經幫你改選較小的「${TEACHER_MODELS[to].label}」模型。`
          : '請關掉其他分頁和 App 後再試一次。'}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {`「${fromLabel}」模型已下載的檔案可能還佔用手機空間。不打算再用的話，可以切回「${fromLabel}」，按下方的「刪除這個模型」釋放空間。`}
      </ThemedText>
      <Pressable
        accessibilityRole="button"
        onPress={onDismiss}
        style={({ pressed }) => [styles.dismiss, pressed && styles.pressed]}>
        <ThemedText type="smallBold" style={{ color: theme.primary }}>
          知道了
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  dismiss: {
    minHeight: 44,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.three,
  },
  pressed: {
    opacity: 0.6,
  },
});
