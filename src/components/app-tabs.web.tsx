import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from './themed-text';
import { Icon, type IconName } from './ui/icon';

import { MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** 網頁版分頁列：固定在底部，模仿手機上的原生分頁，讓手機瀏覽器預覽更接近 Expo Go */
export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icon="home">事務所</TabButton>
          </TabTrigger>
          <TabTrigger name="vocab" href="/vocab" asChild>
            <TabButton icon="vocab">單字</TabButton>
          </TabTrigger>
          <TabTrigger name="reading" href="/reading" asChild>
            <TabButton icon="reading">閱讀</TabButton>
          </TabTrigger>
          <TabTrigger name="quiz" href="/quiz" asChild>
            <TabButton icon="quiz">測驗</TabButton>
          </TabTrigger>
          <TabTrigger name="settings" href="/settings" asChild>
            <TabButton icon="settings">設定</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  icon,
  ...props
}: TabTriggerSlotProps & { icon: IconName }) {
  const theme = useTheme();
  const color = isFocused ? theme.accent : theme.textSecondary;

  return (
    <Pressable {...props} style={({ pressed }) => [styles.tabButton, pressed && styles.pressed]}>
      {/* 目前的分頁：圖示底下有一塊淡色底，文字變成強調色 */}
      <View
        style={[
          styles.indicator,
          { backgroundColor: isFocused ? theme.accentSoft : 'transparent' },
        ]}>
        <Icon name={icon} size={22} color={color} />
      </View>
      <ThemedText type="smallBold" numberOfLines={1} style={[styles.tabLabel, { color }]}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      {...props}
      style={[
        styles.tabListContainer,
        {
          backgroundColor: theme.backgroundElement,
          borderTopColor: theme.border,
          paddingBottom: insets.bottom,
        },
      ]}>
      <View style={styles.innerContainer}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  tabButton: {
    flex: 1,
    minHeight: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  indicator: {
    // 五個分頁在 320 寬的小螢幕上也要排得下
    width: 52,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
