import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type SymbolName = Extract<SymbolViewProps['name'], object>;

/**
 * App 裡用到的圖示（iPhone 用 SF Symbols，Android 和網頁用 Material Symbols）。
 * 用同一套線條圖示取代表情符號，各平台看起來才一致。
 */
const ICONS = {
  home: { ios: 'house.fill', android: 'home', web: 'home' },
  vocab: { ios: 'book.closed.fill', android: 'menu_book', web: 'menu_book' },
  reading: { ios: 'doc.text.fill', android: 'article', web: 'article' },
  quiz: { ios: 'questionmark.circle.fill', android: 'quiz', web: 'quiz' },
  settings: { ios: 'gearshape.fill', android: 'settings', web: 'settings' },
  // 測驗模式
  meaning: { ios: 'character.book.closed.fill', android: 'translate', web: 'translate' },
  kana: { ios: 'textformat.abc', android: 'abc', web: 'abc' },
  grammar: { ios: 'puzzlepiece.fill', android: 'extension', web: 'extension' },
  listening: { ios: 'headphones', android: 'headphones', web: 'headphones' },
  exam: { ios: 'list.clipboard.fill', android: 'assignment', web: 'assignment' },
  timed: { ios: 'timer', android: 'timer', web: 'timer' },
  speaking: { ios: 'mic.fill', android: 'mic', web: 'mic' },
  spelling: { ios: 'square.grid.2x2.fill', android: 'grid_view', web: 'grid_view' },
  review: { ios: 'arrow.counterclockwise', android: 'replay', web: 'replay' },
  // 首頁、閱讀
  due: { ios: 'clock.arrow.circlepath', android: 'history', web: 'history' },
  article: { ios: 'book.fill', android: 'auto_stories', web: 'auto_stories' },
  done: { ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' },
  streak: { ios: 'flame.fill', android: 'local_fire_department', web: 'local_fire_department' },
  travel: { ios: 'airplane', android: 'flight', web: 'flight' },
  chart: { ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar_chart' },
  calendar: { ios: 'calendar', android: 'calendar_today', web: 'calendar_today' },
  chevron: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  pause: { ios: 'pause.fill', android: 'pause', web: 'pause' },
  flag: { ios: 'flag.fill', android: 'flag', web: 'flag' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  tip: { ios: 'lightbulb.fill', android: 'lightbulb', web: 'lightbulb' },
  lock: { ios: 'lock.fill', android: 'lock', web: 'lock' },
} as const satisfies Record<string, SymbolName>;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 20, color }: IconProps) {
  const theme = useTheme();
  return <SymbolView name={ICONS[name]} size={size} tintColor={color ?? theme.text} />;
}

export type IconTone = 'primary' | 'accent' | 'gold' | 'success';

type IconBadgeProps = {
  name: IconName;
  tone?: IconTone;
  /** 外框邊長；圖示約佔一半 */
  size?: number;
  style?: StyleProp<ViewStyle>;
};

/** 圖示放在淡色圓角方塊裡（清單列、選單卡片的開頭） */
export function IconBadge({ name, tone = 'primary', size = 40, style }: IconBadgeProps) {
  const theme = useTheme();
  const colors = {
    primary: [theme.primarySoft, theme.primaryIcon],
    accent: [theme.accentSoft, theme.accentIcon],
    gold: [theme.goldSoft, theme.goldIcon],
    success: [theme.successSoft, theme.successIcon],
  } as const;
  const [background, foreground] = colors[tone];
  return (
    <View
      style={[
        styles.badge,
        { width: size, height: size, backgroundColor: background, borderRadius: Radius.row },
        style,
      ]}>
      <Icon name={name} size={Math.round(size * 0.6)} color={foreground} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
