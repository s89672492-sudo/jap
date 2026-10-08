import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { BowTie } from './bow-tie';

import { useTheme } from '@/hooks/use-theme';

/** 首頁主視覺：金框放大鏡徽章 + 紅領結 */
export function DetectiveEmblem() {
  const theme = useTheme();

  return (
    <View style={styles.container} accessibilityElementsHidden>
      <View style={[styles.badge, { backgroundColor: theme.primary, borderColor: theme.gold }]}>
        <SymbolView
          name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          size={56}
          weight="bold"
          tintColor={theme.gold}
        />
      </View>
      <View style={styles.bowTie}>
        <BowTie size={64} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  badge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bowTie: {
    marginTop: -14,
  },
});
