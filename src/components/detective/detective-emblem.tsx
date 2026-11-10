import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { BowTie } from './bow-tie';

import { useTheme } from '@/hooks/use-theme';

/** 主視覺：金框放大鏡徽章 + 紅領結；size 是徽章的直徑 */
export function DetectiveEmblem({ size = 120 }: { size?: number }) {
  const theme = useTheme();

  return (
    <View style={styles.container} accessibilityElementsHidden>
      <View
        style={[
          styles.badge,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: Math.max(2, Math.round(size / 30)),
            backgroundColor: theme.primary,
            borderColor: theme.gold,
          },
        ]}>
        <SymbolView
          name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          size={Math.round(size * 0.47)}
          weight="bold"
          tintColor={theme.gold}
        />
      </View>
      <View style={{ marginTop: -Math.round(size * 0.12) }}>
        <BowTie size={Math.round(size * 0.53)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
