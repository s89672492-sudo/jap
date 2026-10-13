// 偵探日語的 service worker：把網站本身的檔案存起來，讓沒有網路時也能重新開啟。
// 只處理同一個網站的檔案；AI 模型（Hugging Face 等）由 WebLLM 自己存在 Cache Storage，這裡不碰。
const CACHE = 'jap-shell-v1';
const PAGES = ['./', 'vocab', 'reading', 'quiz', 'settings', 'teacher'];
const SCRIPT_PATTERN = /_expo\/static\/(?:js|css)\/[^"'\s)]+\.(?:js|css)/g;

const scopeUrl = (path) => new URL(path, self.registration.scope).href;

/** 抓下頁面，順便把頁面和主程式裡提到的 JS/CSS（包含 AI 老師才載入的分割檔）一起存起來 */
async function precache() {
  const cache = await caches.open(CACHE);
  const scripts = new Set();
  for (const page of PAGES) {
    try {
      const response = await fetch(scopeUrl(page), { cache: 'no-cache' });
      if (!response.ok) continue;
      const html = await response.clone().text();
      await cache.put(scopeUrl(page), response);
      for (const match of html.match(SCRIPT_PATTERN) ?? []) scripts.add(scopeUrl(match));
    } catch {}
  }
  for (const url of [...scripts]) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      if (url.endsWith('.js')) {
        const text = await response.clone().text();
        for (const match of text.match(SCRIPT_PATTERN) ?? []) {
          const chunk = scopeUrl(match);
          if (!scripts.has(chunk)) {
            scripts.add(chunk);
            const chunkResponse = await fetch(chunk).catch(() => null);
            if (chunkResponse?.ok) await cache.put(chunk, chunkResponse);
          }
        }
      }
      await cache.put(url, response);
    } catch {}
  }
  // 舊版本的 JS/CSS 已經用不到，刪掉免得越存越多
  for (const request of await cache.keys()) {
    if (/_expo\/static\//.test(request.url) && !scripts.has(request.url)) {
      await cache.delete(request);
    }
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('jap-shell-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

/** 頁面：先用網路拿最新的，離線時用存起來的 */
async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request.url.split('?')[0], response.clone());
    return response;
  } catch {
    return (
      (await cache.match(request, { ignoreSearch: true })) ??
      (await cache.match(scopeUrl('./'))) ??
      Response.error()
    );
  }
}

/** JS、CSS、圖片：檔名會隨內容改變，存過就直接用 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) cache.put(request, response.clone());
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
  } else if (/\/_expo\/static\/|\/assets\//.test(url.pathname)) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});
