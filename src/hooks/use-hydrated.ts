import { useState, useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * 畫面是否已經載入到裝置上。網頁版預先產生的 HTML（和載入時的第一次畫面）是 false，
 * 之後是 true；手機 App 一開始就是 true。隨機出題、今天日期等只在裝置上決定的值，
 * 等這個變 true 再算，網頁版才不會出現兩份不一樣的畫面。
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

/**
 * deps 和上一次畫面不同時回傳 true（第一次回傳 false）。
 * 用在畫面計算中重設狀態（例如換等級時回到第一題），取代在 useEffect 裡 setState。
 * https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
 */
export function useDepsChanged(deps: readonly unknown[]): boolean {
  const [previous, setPrevious] = useState(deps);
  const changed =
    previous.length !== deps.length || previous.some((value, i) => !Object.is(value, deps[i]));
  if (changed) setPrevious(deps);
  return changed;
}
