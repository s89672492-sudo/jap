// node render.mjs <scenes.mjs> ：每張圖輸出 16 張 PNG（2 秒一輪）到 frames/<id>/
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const pw = createRequire(import.meta.url)('playwright');
const scenes = (await import(path.resolve(process.argv[2]))).default;
const N = 16, LOOP = 2000;
const b = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await (await b.newContext({ viewport: { width: 640, height: 360 } })).newPage();
for (const [id, svg] of Object.entries(scenes)) {
  fs.mkdirSync(`frames/${id}`, { recursive: true });
  await p.setContent(`<body style="margin:0">${svg}</body>`);
  for (let i = 0; i < N; i++) {
    await p.evaluate((t) => { for (const a of document.getAnimations()) { a.pause(); const d = a.effect.getComputedTiming(); a.currentTime = ((t - (d.delay || 0)) % d.duration + d.duration) % d.duration + (d.delay || 0); } }, (i / N) * LOOP);
    await p.screenshot({ path: `frames/${id}/${String(i).padStart(2, '0')}.png` });
  }
  console.log(id);
}
await b.close();
