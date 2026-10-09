import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * 只用於網頁版：自訂每個頁面的 <head>。
 * 加上 manifest 和 iPhone 的設定，讓手機「加入主畫面」後像 App 一樣全螢幕開啟。
 * 連結用相對路徑，部署在 GitHub Pages 的 /jap/ 底下也能找到檔案。
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="zh-Hant">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <link rel="manifest" href="manifest.json" />
        <link rel="apple-touch-icon" href="icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="偵探日語" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#F5EFE0" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0B1426" media="(prefers-color-scheme: dark)" />
        <ScrollViewStyleReset />
        {/* 載入前先用 App 的底色，避免閃白 */}
        <style dangerouslySetInnerHTML={{ __html: backgroundStyle }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const backgroundStyle = `
body { background-color: #F5EFE0; }
@media (prefers-color-scheme: dark) {
  body { background-color: #0B1426; }
}`;
