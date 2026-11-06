import { useEffect, useState } from 'react';

import type { TravelHeard, TravelKanji, TravelPhrase } from '@/data/travel';

export type TravelData = {
  phrases: TravelPhrase[];
  heard: TravelHeard[];
  kanji: TravelKanji[];
};

let cache: TravelData | null = null;
let pending: Promise<TravelData> | null = null;

/** 生活旅行用語：打開那一頁時才載入（不放在首頁一開始就要下載的檔案裡） */
export function loadTravelData(): Promise<TravelData> {
  pending ??= import('@/data/travel').then((m) => {
    cache = { phrases: m.TRAVEL_PHRASES, heard: m.TRAVEL_HEARD, kanji: m.TRAVEL_KANJI };
    return cache;
  });
  return pending;
}

export function useTravelData(): TravelData | null {
  const [data, setData] = useState<TravelData | null>(cache);
  useEffect(() => {
    if (cache) return;
    let alive = true;
    loadTravelData().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
  }, []);
  return data;
}
