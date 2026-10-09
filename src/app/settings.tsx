import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClearMistakes } from '@/components/settings/clear-mistakes';
import { SettingsSection } from '@/components/settings/settings-section';
import { ThemedText } from '@/components/themed-text';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SpeakButton } from '@/components/ui/speak-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import {
  updateSettings,
  useSettings,
  type RoundSize,
  type SpeechSpeed,
  type ThemeMode,
} from '@/stores/settings-store';

const SPEED_OPTIONS: { value: SpeechSpeed; label: string }[] = [
  { value: 'slow', label: '慢' },
  { value: 'normal', label: '普通' },
  { value: 'fast', label: '快' },
];

const ROUND_OPTIONS: { value: `${RoundSize}`; label: string }[] = [
  { value: '10', label: '10 題' },
  { value: '20', label: '20 題' },
  { value: '30', label: '30 題' },
];

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: '跟隨系統' },
  { value: 'light', label: '淺色' },
  { value: 'dark', label: '深色' },
];

const SAMPLE_SENTENCE = 'しんじつは いつも ひとつ';

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const settings = useSettings();

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.three,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
          paddingLeft: insets.left + Spacing.three,
          paddingRight: insets.right + Spacing.three,
        },
      ]}>
      <View style={styles.inner}>
        <ThemedText type="subtitle" style={styles.title}>
          設定
        </ThemedText>

        <SettingsSection title="發音速度" description="單字、五十音和聽力測驗的日文語音速度。">
          <SegmentedControl
            options={SPEED_OPTIONS}
            value={settings.speechSpeed}
            onChange={(speechSpeed) => updateSettings({ speechSpeed })}
          />
          <View style={styles.sampleRow}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.sampleText}>
              試聽：{SAMPLE_SENTENCE}
            </ThemedText>
            <SpeakButton text={SAMPLE_SENTENCE} />
          </View>
        </SettingsSection>

        <SettingsSection title="每輪題數" description="單字測驗、模擬試題、聽力測驗和錯題本每一輪的題數。">
          <SegmentedControl
            options={ROUND_OPTIONS}
            value={`${settings.roundSize}`}
            onChange={(value) => updateSettings({ roundSize: Number(value) as RoundSize })}
          />
        </SettingsSection>

        <SettingsSection title="外觀">
          <SegmentedControl
            options={THEME_OPTIONS}
            value={settings.themeMode}
            onChange={(themeMode) => updateSettings({ themeMode })}
          />
        </SettingsSection>

        <SettingsSection title="錯題本">
          <ClearMistakes />
        </SettingsSection>

        <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
          設定、選過的等級和錯題本都存在這支手機裡；換手機或清除瀏覽器資料後會重新開始。
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
  },
  title: {
    letterSpacing: 4,
  },
  sampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  sampleText: {
    flex: 1,
  },
  note: {
    fontSize: 12,
    textAlign: 'center',
  },
});
