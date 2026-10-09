import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';
import { clearMistakes, useMistakes } from '@/stores/mistakes-store';

/** 清除錯題本：按第一次先確認，避免誤按 */
export function ClearMistakes() {
  const mistakes = useMistakes();
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);

  if (confirming) {
    return (
      <View style={styles.container}>
        <ThemedText type="smallBold">
          確定要清除全部 {mistakes.size} 題錯題嗎？清除後無法復原。
        </ThemedText>
        <View style={styles.row}>
          <View style={styles.button}>
            <PrimaryButton label="取消" onPress={() => setConfirming(false)} />
          </View>
          <View style={styles.button}>
            <SecondaryButton
              label="清除"
              onPress={() => {
                clearMistakes();
                setConfirming(false);
                setCleared(true);
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        {mistakes.size > 0
          ? `目前錯題本有 ${mistakes.size} 題（所有等級合計）。`
          : cleared
            ? '錯題本已清除。'
            : '錯題本是空的。'}
      </ThemedText>
      {mistakes.size > 0 && (
        <SecondaryButton
          label="清除錯題本"
          onPress={() => {
            setCleared(false);
            setConfirming(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  button: {
    flex: 1,
  },
});
