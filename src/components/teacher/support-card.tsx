import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { CheckStatus, SupportReport } from '@/lib/local-llm-models';

const ICONS: Record<CheckStatus, string> = { pass: '✓', warn: '!', fail: '✕' };

/** 裝置相容性檢查結果：逐項列出 WebGPU、記憶體、儲存空間等 */
export function SupportCard({ report }: { report: SupportReport | null }) {
  const theme = useTheme();
  const colors: Record<CheckStatus, string> = {
    pass: theme.success,
    warn: theme.gold,
    fail: theme.accent,
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
      ]}>
      <ThemedText type="smallBold" style={{ color: theme.accent }}>
        裝置檢查
      </ThemedText>
      {!report ? (
        <ThemedText type="small" themeColor="textSecondary">
          正在檢查這台裝置能不能執行 AI…
        </ThemedText>
      ) : (
        <>
          <ThemedText type="smallBold">
            {report.ok ? '這台裝置可以在本地執行 AI 老師' : '這台裝置目前無法執行 AI 老師'}
          </ThemedText>
          {report.checks.map((check) => (
            <View key={check.label} style={styles.row}>
              <View style={[styles.badge, { backgroundColor: colors[check.status] }]}>
                <ThemedText type="smallBold" style={styles.badgeText}>
                  {ICONS[check.status]}
                </ThemedText>
              </View>
              <View style={styles.rowText}>
                <ThemedText type="smallBold">{check.label}</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {check.detail}
                </ThemedText>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
});
