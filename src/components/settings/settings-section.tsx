import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SettingsSectionProps = PropsWithChildren<{
  title: string;
  description?: string;
}>;

/** 設定頁的一個區塊：標題、說明和控制項 */
export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  const theme = useTheme();

  return (
    <View
      style={[styles.section, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      <View style={styles.heading}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {description && (
          <ThemedText type="small" themeColor="textSecondary">
            {description}
          </ThemedText>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  heading: {
    gap: Spacing.half,
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
  },
});
