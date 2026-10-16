/**
 * 註冊 public/sw.js：把網站檔案存在瀏覽器裡，沒有網路時也能重新開啟。
 * 開發模式（npx expo start）不註冊，避免改了程式卻看到舊版本。
 */
export function registerServiceWorker() {
  if (__DEV__ || !('serviceWorker' in navigator)) return;
  // 部署在 GitHub Pages 的 /jap/ 底下時，baseUrl 會在打包時填入
  const base = process.env.EXPO_BASE_URL ?? '';
  navigator.serviceWorker.register(`${base}/sw.js`, { scope: `${base}/` }).catch(() => {});
}
