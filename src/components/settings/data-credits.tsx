import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { SecondaryButton } from '@/components/ui/secondary-button';
import { Spacing } from '@/constants/theme';

const DECK_URL = 'https://github.com/5mdld/anki-jlpt-decks';
const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hant';

const OWN_CONTENT =
  '單字解釋、例句、文法說明、閱讀文章、模擬考題目、同義詞和反義詞、生活旅行用語，' +
  '都是本 App 自行編寫的練習內容，不是 JLPT 官方試題。';

const FREQUENCY_CREDIT =
  '「真題頻率」標籤（真題高頻、中頻、低頻）取自 egg rolls 製作的《JLPT 10k》Anki 牌組，' +
  '採用 CC BY-NC 4.0 授權。本 App 只使用其中的頻率分類，依寫法和讀音對應到本 App 的單字，' +
  '對不上的單字不加標籤；沒有使用牌組的解釋、例句、音檔或音調。' +
  '依授權條款，這部分不得用於商業用途。';

/** 設定頁「資料來源與授權」：自編內容的說明和外部資料的署名（CC BY-NC 4.0 要求註明作者、連結和修改） */
export function DataCredits() {
  const open = (url: string) => WebBrowser.openBrowserAsync(url).catch(() => {});
  return (
    <View style={styles.container}>
      <ThemedText type="small" themeColor="textSecondary">
        {OWN_CONTENT}
      </ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        {FREQUENCY_CREDIT}
      </ThemedText>
      <SecondaryButton label="查看《JLPT 10k》牌組" onPress={() => open(DECK_URL)} />
      <SecondaryButton label="查看 CC BY-NC 4.0 授權條款" onPress={() => open(LICENSE_URL)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.two,
  },
});
