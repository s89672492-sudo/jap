import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { OVERLAY_OPACITY, useBackground } from '@/stores/background-store';

/**
 * 使用者在設定頁選的背景圖（只存在自己的手機）。
 * 放在每個畫面最底層；圖片上蓋一層紙張色，讓文字保持清楚。沒有設定時不顯示。
 */
export function AppBackground() {
  const theme = useTheme();
  const { image, overlay } = useBackground();
  if (!image) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image source={{ uri: image }} style={StyleSheet.absoluteFill} contentFit="cover" />
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: theme.background, opacity: OVERLAY_OPACITY[overlay] },
        ]}
      />
    </View>
  );
}
