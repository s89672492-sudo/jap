import { useEffect, useState, type ReactElement, type ReactNode } from 'react';
import { FlatList, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Pager } from '@/components/ui/pager';
import { Spacing } from '@/constants/theme';

type PagedListProps<T> = {
  items: T[];
  pageSize: number;
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ReactElement;
  /** 這個值改變時（例如換等級、換搜尋字）回到第一頁 */
  resetKey: string;
  /** 放在分頁按鈕上方，例如篩選按鈕 */
  header?: ReactNode;
  /** 沒有資料時顯示的文字 */
  emptyText: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

/** 分頁列表：一次只顯示一頁，上下都有分頁按鈕，換頁時從頂端開始 */
export function PagedList<T>({
  items,
  pageSize,
  keyExtractor,
  renderItem,
  resetKey,
  header,
  emptyText,
  contentContainerStyle,
}: PagedListProps<T>) {
  const [page, setPage] = useState(0);
  useEffect(() => {
    setPage(0);
  }, [resetKey]);

  const pageCount = Math.ceil(items.length / pageSize);
  // 收藏被取消而少了一頁時，停在最後一頁
  const current = Math.min(page, Math.max(pageCount - 1, 0));
  const pageItems = items.slice(current * pageSize, (current + 1) * pageSize);
  const pager = <Pager page={current} pageCount={pageCount} onChange={setPage} />;

  return (
    <FlatList
      key={`${resetKey}-${current}`}
      data={pageItems}
      keyExtractor={keyExtractor}
      renderItem={({ item }) => renderItem(item)}
      ListHeaderComponent={
        header || pageCount > 1 ? (
          <View style={styles.header}>
            {header}
            {pager}
          </View>
        ) : null
      }
      ListFooterComponent={pageCount > 1 ? <View style={styles.footer}>{pager}</View> : null}
      ListEmptyComponent={
        <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
          {emptyText}
        </ThemedText>
      }
      ItemSeparatorComponent={Separator}
      contentContainerStyle={contentContainerStyle}
      // 打字時可以直接點結果，往下滑就收起鍵盤
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
  },
  footer: {
    marginTop: Spacing.three,
  },
  empty: {
    textAlign: 'center',
    paddingVertical: Spacing.five,
  },
  separator: {
    height: Spacing.two,
  },
});
