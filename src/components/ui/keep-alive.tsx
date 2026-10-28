import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { stopSpeaking } from '@/lib/speech';

const ActiveContext = createContext(true);

/** 這個模式目前是否顯示在畫面上（被 KeepAlive 隱藏時為 false） */
export function useModeActive(): boolean {
  return useContext(ActiveContext);
}

type KeepAliveProps = {
  active: boolean;
  children: ReactNode;
  /** 顯示時套用的樣式（例如 flex: 1 讓列表撐滿） */
  style?: StyleProp<ViewStyle>;
};

/**
 * 切換模式時不重新建立畫面：打開過的模式只是隱藏起來，切回來可以接著做（測驗進度、單字卡、模擬考…）。
 * 第一次切到這個模式時才建立。隱藏時停止朗讀，裡面的元件可以用 useModeActive() 暫停計時或錄音。
 */
export function KeepAlive({ active, children, style }: KeepAliveProps) {
  const [visited, setVisited] = useState(active);
  const wasActive = useRef(active);
  if (active && !visited) setVisited(true);

  useEffect(() => {
    if (!active && wasActive.current) stopSpeaking();
    wasActive.current = active;
  }, [active]);

  if (!active && !visited) return null;
  return (
    <ActiveContext.Provider value={active}>
      <View style={active ? style : styles.hidden}>{children}</View>
    </ActiveContext.Provider>
  );
}

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
});
