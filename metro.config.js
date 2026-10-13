// Metro 設定：沿用 Expo 預設，只在打包網頁版時保留日文、中文原字。
// 預設會把非英文字轉成 \uXXXX（每個字 6 bytes，原字只要 3 bytes），網頁版 JS 會大一倍；
// 手機 App 維持預設，避免影響 Expo Go。
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

if (process.env.WEB_KEEP_UNICODE === '1') {
  const minifierConfig = config.transformer.minifierConfig ?? {};
  config.transformer.minifierConfig = {
    ...minifierConfig,
    output: { ...minifierConfig.output, ascii_only: false },
  };
}

module.exports = config;
