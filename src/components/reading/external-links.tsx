import * as WebBrowser from 'expo-web-browser';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { READING_LINKS } from '@/data/reading/links';
import type { JlptLevel } from '@/data/vocab';
import { useTheme } from '@/hooks/use-theme';

type ExternalLinksProps = {
  level: JlptLevel;
};

/** 適合目前等級的線上閱讀網站，點了用瀏覽器開啟 */
export function ExternalLinks({ level }: ExternalLinksProps) {
  const theme = useTheme();
  const links = READING_LINKS.filter((link) => link.levels.includes(level));

  return (
    <View style={styles.list}>
      {links.map((link) => (
        <Pressable
          key={link.url}
          accessibilityRole="link"
          accessibilityLabel={`${link.name}，在瀏覽器開啟`}
          onPress={() => WebBrowser.openBrowserAsync(link.url).catch(() => {})}
          style={({ pressed }) => [
            styles.card,
            { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            pressed && styles.pressed,
          ]}>
          <View style={styles.text}>
            <ThemedText type="smallBold">{link.name}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {link.description}
            </ThemedText>
          </View>
          <ThemedText style={{ color: theme.primary }}>↗</ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.two,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 56,
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  text: {
    flex: 1,
    gap: Spacing.half,
  },
  pressed: {
    opacity: 0.7,
  },
});
