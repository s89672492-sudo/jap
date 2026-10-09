import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { pickBackgroundImage } from '@/lib/pick-background';
import {
  OVERLAY_OPACITY,
  setBackgroundImage,
  setOverlayStrength,
  useBackground,
  type OverlayStrength,
} from '@/stores/background-store';

const OVERLAY_OPTIONS: { value: OverlayStrength; label: string }[] = [
  { value: 'light', label: '淡' },
  { value: 'medium', label: '中' },
  { value: 'strong', label: '濃' },
];

/** 設定頁：從相簿選背景圖、調整遮罩濃度、移除背景 */
export function BackgroundPicker() {
  const theme = useTheme();
  const { image, overlay } = useBackground();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const choose = async () => {
    setError(null);
    setBusy(true);
    try {
      const picked = await pickBackgroundImage();
      if (picked) setBackgroundImage(picked);
    } catch {
      setError('圖片讀取失敗，請換一張圖片再試一次。');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      {image && (
        // 預覽：和實際畫面一樣蓋上紙張色遮罩
        <View style={[styles.preview, { borderColor: theme.border }]}>
          <Image source={{ uri: image }} style={StyleSheet.absoluteFill} contentFit="cover" />
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: theme.background, opacity: OVERLAY_OPACITY[overlay] },
            ]}
          />
          <ThemedText type="smallBold">預覽：文字會像這樣顯示</ThemedText>
        </View>
      )}

      {image && (
        <View style={styles.overlayRow}>
          <ThemedText type="small" themeColor="textSecondary">
            遮罩濃度（越濃文字越清楚）
          </ThemedText>
          <SegmentedControl options={OVERLAY_OPTIONS} value={overlay} onChange={setOverlayStrength} />
        </View>
      )}

      {error && (
        <ThemedText type="small" style={{ color: theme.accent }}>
          {error}
        </ThemedText>
      )}

      <PrimaryButton
        label={busy ? '處理中…' : image ? '換一張圖片' : '從相簿選擇圖片'}
        onPress={choose}
        disabled={busy}
      />
      {image && <SecondaryButton label="移除背景" onPress={() => setBackgroundImage(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.three,
  },
  preview: {
    height: 140,
    borderWidth: 1,
    borderRadius: Spacing.three,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayRow: {
    gap: Spacing.two,
  },
});
