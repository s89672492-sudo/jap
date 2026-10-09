import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { speakJapanese } from '@/lib/speech';
import { useTheme } from '@/hooks/use-theme';

type SpeakButtonProps = {
  /** 要唸出的日文 */
  text: string;
  size?: 'small' | 'large';
};

/** 喇叭按鈕：點一下唸出日文。觸控區域至少 44x44 */
export function SpeakButton({ text, size = 'small' }: SpeakButtonProps) {
  const theme = useTheme();
  const dimension = size === 'large' ? 52 : 44;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`播放發音：${text}`}
      hitSlop={6}
      onPress={() => speakJapanese(text)}
      style={({ pressed }) => [
        styles.button,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: theme.primary,
          borderColor: theme.gold,
        },
        pressed && styles.pressed,
      ]}>
      <SymbolView
        name={{ ios: 'speaker.wave.2.fill', android: 'volume_up', web: 'volume_up' }}
        size={size === 'large' ? 24 : 20}
        tintColor={theme.onPrimary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
});
