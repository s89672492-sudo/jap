import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaseCard } from '@/components/detective/case-card';
import { DetectiveEmblem } from '@/components/detective/detective-emblem';
import { ThemedText } from '@/components/themed-text';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
          paddingLeft: insets.left + Spacing.three,
          paddingRight: insets.right + Spacing.three,
        },
      ]}>
      <View style={styles.inner}>
        <View style={styles.hero}>
          <DetectiveEmblem />
          <ThemedText type="subtitle" style={styles.title}>
            偵探事務所
          </ThemedText>
          <View style={[styles.taglineBox, { borderColor: theme.gold }]}>
            <ThemedText type="smallBold" style={[styles.tagline, { color: theme.gold }]}>
              真相只有一個！
            </ThemedText>
          </View>
        </View>

        <CaseCard label="CASE 001" title="五十音之謎">
          <ThemedText type="small" themeColor="textSecondary">
            每位偵探的第一步：認得平假名和片假名。先從五十音表開始調查吧！
          </ThemedText>
        </CaseCard>

        <PrimaryButton label="開始調查五十音" onPress={() => router.navigate('/kana')} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.four,
  },
  title: {
    textAlign: 'center',
    letterSpacing: 4,
  },
  taglineBox: {
    borderWidth: 1.5,
    borderRadius: Spacing.five,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  tagline: {
    letterSpacing: 2,
  },
});
