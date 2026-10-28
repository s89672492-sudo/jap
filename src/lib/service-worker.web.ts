/**
 * 註冊 public/sw.js：把網站檔案存在瀏覽器裡，沒有網路時也能重新開啟。
 * 開發模式（npx expo start）不註冊，避免改了程式卻看到舊版本。
 */
export function registerServiceWorker() {
  if (__DEV__ || !('serviceWorker' in navigator)) return;
  // 部署在 GitHub Pages 的 /jap/ 底下時，baseUrl 會在打包時填入
  const base = process.env.EXPO_BASE_URL ?? '';
  // 每次上架的版本號（GitHub 打包時填入）：網址不同，瀏覽器就會重新安裝 service worker，
  // 在背景把新版本的程式和各等級資料存起來，離線時也不會缺檔或新舊混用
  const version = process.env.EXPO_PUBLIC_BUILD_ID ?? 'local';
  navigator.serviceWorker
    .register(`${base}/sw.js?v=${version}`, { scope: `${base}/` })
    .catch(() => {});
}
