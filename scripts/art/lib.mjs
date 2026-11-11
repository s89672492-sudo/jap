// 閱讀插圖的共用零件：人物、對話框、蒸氣、星星。全部是 SVG 字串，動畫用 CSS keyframes（2 秒一輪）。
export const W = 640, H = 360, LOOP = 2000;

export const CSS = `
[class]{animation-duration:2s;animation-iteration-count:infinite;animation-timing-function:ease-in-out;transform-box:fill-box}
text{font-family:'WenQuanYi Zen Hei','Noto Sans CJK JP',sans-serif;font-weight:700}
.bob{animation-name:bob}@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
.bob2{animation-name:bob2;animation-duration:1s}@keyframes bob2{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.sway{animation-name:sway;transform-origin:50% 0}@keyframes sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
.wave{animation-name:wave;animation-duration:1s;transform-origin:50% 100%}@keyframes wave{0%,100%{transform:rotate(-16deg)}50%{transform:rotate(18deg)}}
.stretch{animation-name:stretch;transform-origin:50% 100%}@keyframes stretch{0%,100%{transform:rotate(0)}50%{transform:rotate(-22deg)}}
.stretchR{animation-name:stretchR;transform-origin:50% 100%}@keyframes stretchR{0%,100%{transform:rotate(0)}50%{transform:rotate(22deg)}}
.blink{animation-name:blink;transform-origin:50% 50%}@keyframes blink{0%,42%,50%,100%{transform:scaleY(1)}46%{transform:scaleY(.1)}}
.pop{animation-name:pop;transform-origin:50% 50%}@keyframes pop{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
.spin{animation-name:spin;animation-timing-function:linear;transform-origin:50% 50%}@keyframes spin{to{transform:rotate(360deg)}}
.spinSlow{animation-name:spinSlow;animation-timing-function:linear;transform-origin:50% 50%}@keyframes spinSlow{to{transform:rotate(45deg)}}
.shake{animation-name:shake;animation-duration:.5s;transform-origin:50% 100%}@keyframes shake{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
.steam{animation-name:steam;animation-timing-function:linear}@keyframes steam{0%{transform:translateY(8px);opacity:0}30%{opacity:.9}100%{transform:translateY(-22px);opacity:0}}
.twinkle{animation-name:twinkle;animation-duration:1s;transform-origin:50% 50%}@keyframes twinkle{0%,100%{transform:scale(.5);opacity:.3}50%{transform:scale(1.15);opacity:1}}
.rise{animation-name:rise;animation-timing-function:linear}@keyframes rise{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-34px);opacity:0}}
.scrollL{animation-name:scrollL;animation-timing-function:linear}@keyframes scrollL{to{transform:translateX(-160px)}}
.scrollFast{animation-name:scrollFast;animation-timing-function:linear;animation-duration:1s}@keyframes scrollFast{to{transform:translateX(-120px)}}
.legA{animation-name:legA;animation-duration:1s;transform-origin:50% 0}@keyframes legA{0%,100%{transform:rotate(22deg)}50%{transform:rotate(-22deg)}}
.legB{animation-name:legB;animation-duration:1s;transform-origin:50% 0}@keyframes legB{0%,100%{transform:rotate(-22deg)}50%{transform:rotate(22deg)}}
.brush{animation-name:brush;animation-duration:.5s}@keyframes brush{0%,100%{transform:translateX(-5px)}50%{transform:translateX(5px)}}
.munch{animation-name:munch;animation-duration:.5s;transform-origin:50% 0}@keyframes munch{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.45)}}
.fly{animation-name:fly;animation-timing-function:linear}@keyframes fly{0%{transform:translate(0,0)}50%{transform:translate(40px,-8px)}100%{transform:translate(80px,0)}}
.flap{animation-name:flap;animation-duration:.5s;transform-origin:50% 100%}@keyframes flap{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.3)}}
.d1{animation-delay:-.4s}.d2{animation-delay:-.9s}.d3{animation-delay:-1.4s}
`;

const SKIN = '#FFE0C4', LINE = '#4A3428';

/** 眼睛：open（會眨）、happy（笑眼）、closed、wide */
function eyes(kind) {
  if (kind === 'happy') return `<path d="M-19 2q7-9 14 0M5 2q7-9 14 0" fill="none" stroke="${LINE}" stroke-width="3.2" stroke-linecap="round"/>`;
  if (kind === 'closed') return `<path d="M-19 0q7 6 14 0M5 0q7 6 14 0" fill="none" stroke="${LINE}" stroke-width="3.2" stroke-linecap="round"/>`;
  const r = kind === 'wide' ? 6.5 : 5.5;
  return `<g class="blink"><ellipse cx="-12" cy="0" rx="${r}" ry="${r + 1}" fill="${LINE}"/><ellipse cx="12" cy="0" rx="${r}" ry="${r + 1}" fill="${LINE}"/><circle cx="-10" cy="-2.5" r="2" fill="#fff"/><circle cx="14" cy="-2.5" r="2" fill="#fff"/></g>`;
}
function mouth(kind) {
  if (kind === 'open') return `<ellipse cx="0" cy="15" rx="7" ry="8" fill="#C0392B"/><ellipse cx="0" cy="19" rx="4" ry="3" fill="#FF8A80"/>`;
  if (kind === 'yawn') return `<ellipse class="pop" cx="0" cy="16" rx="8" ry="10" fill="#C0392B"/>`;
  if (kind === 'munch') return `<ellipse class="munch" cx="0" cy="14" rx="6" ry="6" fill="#C0392B"/>`;
  if (kind === 'o') return `<ellipse cx="0" cy="15" rx="4" ry="5" fill="#C0392B"/>`;
  return `<path d="M-8 12q8 9 16 0" fill="none" stroke="${LINE}" stroke-width="3" stroke-linecap="round"/>`;
}

/**
 * 大頭人物（頭頂在 y≈-150，腳在 y=0）。
 * hair: 髮色；top: 上衣；bottom: 下身；long: 長髮；arms: 'down'|'up'|'wave'|'hold'|'stretch'；walk: 走路
 */
export function person({ x, y, s = 1, hair = '#7A4A2B', top = '#FF9F43', bottom = '#7E57C2', long = true, eye = 'open', m = 'smile', arms = 'down', walk = false, cls = '', bun = false, flip = false }) {
  const armL = { down: `<rect x="-36" y="-70" width="13" height="40" rx="6.5" fill="${top}"/><circle cx="-29.5" cy="-28" r="7" fill="${SKIN}"/>`,
    up: `<g class="stretch"><rect x="-38" y="-108" width="13" height="42" rx="6.5" fill="${top}"/><circle cx="-31.5" cy="-110" r="7" fill="${SKIN}"/></g>`,
    wave: `<rect x="-36" y="-70" width="13" height="40" rx="6.5" fill="${top}"/><circle cx="-29.5" cy="-28" r="7" fill="${SKIN}"/>`,
    hold: `<rect x="-34" y="-66" width="13" height="30" rx="6.5" fill="${top}" transform="rotate(-50 -27 -62)"/>` }[arms === 'stretch' ? 'up' : arms];
  const armR = { down: `<rect x="23" y="-70" width="13" height="40" rx="6.5" fill="${top}"/><circle cx="29.5" cy="-28" r="7" fill="${SKIN}"/>`,
    up: `<g class="stretchR"><rect x="25" y="-108" width="13" height="42" rx="6.5" fill="${top}"/><circle cx="31.5" cy="-110" r="7" fill="${SKIN}"/></g>`,
    wave: `<g class="wave"><rect x="24" y="-104" width="13" height="42" rx="6.5" fill="${top}"/><circle cx="30.5" cy="-106" r="7.5" fill="${SKIN}"/></g>`,
    hold: `<rect x="21" y="-66" width="13" height="30" rx="6.5" fill="${top}" transform="rotate(50 27 -62)"/>` }[arms === 'stretch' ? 'up' : arms];
  const legs = walk
    ? `<g class="legA"><rect x="-15" y="-30" width="12" height="28" rx="6" fill="#3B3355"/><ellipse cx="-8" cy="-1" rx="10" ry="5" fill="#2B2540"/></g><g class="legB"><rect x="3" y="-30" width="12" height="28" rx="6" fill="#3B3355"/><ellipse cx="10" cy="-1" rx="10" ry="5" fill="#2B2540"/></g>`
    : `<rect x="-15" y="-30" width="12" height="28" rx="6" fill="#3B3355"/><rect x="3" y="-30" width="12" height="28" rx="6" fill="#3B3355"/><ellipse cx="-10" cy="-1" rx="10" ry="5" fill="#2B2540"/><ellipse cx="10" cy="-1" rx="10" ry="5" fill="#2B2540"/>`;
  return `<g transform="translate(${x} ${y}) scale(${flip ? -s : s} ${s})"><ellipse cx="0" cy="3" rx="34" ry="6" fill="rgba(0,0,0,.12)"/><g class="${cls}">
  ${legs}
  ${long ? `<path d="M-46 -112q-8 50 6 74h80q14-24 6-74z" fill="${hair}"/>` : ''}
  ${armL}
  <path d="M-24 -74h48l6 34q-30 8-60 0z" fill="${top}"/>
  <path d="M-30 -42q30 9 60 0l5 16q-35 9-70 0z" fill="${bottom}"/>
  ${armR}
  ${bun ? `<circle cx="0" cy="-160" r="15" fill="${hair}"/>` : ''}
  <circle cx="0" cy="-112" r="42" fill="${SKIN}"/>
  <path d="M-43 -112q-4-48 43-48t43 48q-10-22-30-26-26 14-56 26z" fill="${hair}"/>
  <g transform="translate(0 -108)">${eyes(eye)}<ellipse cx="-25" cy="12" rx="8" ry="5" fill="#FFAFA3" opacity=".8"/><ellipse cx="25" cy="12" rx="8" ry="5" fill="#FFAFA3" opacity=".8"/>${mouth(m)}</g>
  </g></g>`;
}

/** 對話框：尾巴朝下左（tail=-1）或下右（1） */
export function bubble({ x, y, text, w = 0, size = 22, tail = -1, cls = 'pop', fill = '#fff', color = '#333' }) {
  const width = w || text.length * size + 34;
  const h = size + 22;
  const tx = tail * width * 0.22;
  return `<g transform="translate(${x} ${y})"><g class="${cls}"><path d="M${tx - 9} ${h / 2 - 2}l${tail * 16} 20 ${-tail * 16 + 18}-20z" fill="${fill}" stroke="#333" stroke-width="3" stroke-linejoin="round"/><rect x="${-width / 2}" y="${-h / 2}" width="${width}" height="${h}" rx="${h / 2}" fill="${fill}" stroke="#333" stroke-width="3"/><rect x="${tx - 8}" y="${h / 2 - 6}" width="16" height="6" fill="${fill}"/><text x="0" y="${size * 0.36}" font-size="${size}" text-anchor="middle" fill="${color}">${text}</text></g></g>`;
}

export const steam = (x, y, n = 3, gap = 16) =>
  Array.from({ length: n }, (_, i) => `<path class="steam d${i % 4}" d="M${x + i * gap} ${y}q-7-9 0-18t0-18" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".9"/>`).join('');

export const star = (x, y, r = 9, fill = '#FFD54F', cls = 'twinkle') =>
  `<g transform="translate(${x} ${y})"><path class="${cls}" d="M0 ${-r}l${r * 0.3} ${r * 0.7} ${r * 0.7} ${r * 0.3}-${r * 0.7} ${r * 0.3}-${r * 0.3} ${r * 0.7}-${r * 0.3}-${r * 0.7}-${r * 0.7}-${r * 0.3} ${r * 0.7}-${r * 0.3}z" fill="${fill}"/></g>`;

export const note = (x, y, cls = 'rise', fill = '#E91E63') =>
  `<g transform="translate(${x} ${y})"><g class="${cls}"><ellipse cx="0" cy="10" rx="7" ry="5" fill="${fill}"/><rect x="5" y="-12" width="3" height="22" fill="${fill}"/><path d="M5 -12q12 2 12 12-4-6-12-5z" fill="${fill}"/></g></g>`;

export const sun = (x, y, r = 34) =>
  `<g transform="translate(${x} ${y})"><g class="spinSlow">${Array.from({ length: 8 }, (_, i) => `<rect x="-4" y="${-r - 20}" width="8" height="14" rx="4" fill="#FFC107" transform="rotate(${i * 45})"/>`).join('')}</g><circle r="${r}" fill="#FFD54F"/><circle r="${r - 8}" fill="#FFE082"/></g>`;

export const cloud = (x, y, s = 1, cls = '') =>
  `<g transform="translate(${x} ${y}) scale(${s})"><g class="${cls}"><ellipse cx="0" cy="0" rx="30" ry="14" fill="#fff"/><ellipse cx="-16" cy="-8" rx="16" ry="12" fill="#fff"/><ellipse cx="10" cy="-12" rx="20" ry="15" fill="#fff"/></g></g>`;

export const bird = (x, y, cls = 'fly') =>
  `<g class="${cls}"><g transform="translate(${x} ${y})"><ellipse cx="0" cy="0" rx="9" ry="6" fill="#5C6BC0"/><circle cx="8" cy="-3" r="5" fill="#5C6BC0"/><path d="M12 -3l7 2-7 2z" fill="#FFB300"/><path class="flap" d="M-6 -2q4-14 10 0z" fill="#3949AB"/></g></g>`;

/** 畫面外框：圓角 + 白邊 */
export function frame(inner, bg) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><style>${CSS}</style><defs><clipPath id="clip"><rect width="${W}" height="${H}"/></clipPath></defs><g clip-path="url(#clip)"><rect width="${W}" height="${H}" fill="${bg}"/>${inner}</g></svg>`;
}
/** 小分格：在 (x,y,w,h) 裡畫內容，內容座標從分格左上角算 */
export function panel(x, y, w, h, bg, inner, id) {
  return `<clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18"/></clipPath><g clip-path="url(#${id})"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${bg}"/><g transform="translate(${x} ${y})">${inner}</g></g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="none" stroke="#fff" stroke-width="6"/>`;
}

// ── 場景零件（第二批）：背景、家具、動物、天氣 ──
export const CSS2 = `
.fall{animation-name:fall;animation-timing-function:linear}@keyframes fall{from{transform:translateY(-20px)}to{transform:translateY(390px)}}
.rain{animation-name:rain;animation-timing-function:linear;animation-duration:.5s}@keyframes rain{from{transform:translate(0,-40px)}to{transform:translate(-20px,120px)}}
.float{animation-name:float}@keyframes float{0%,100%{transform:translateX(-8px)}50%{transform:translateX(8px)}}
.tail{animation-name:tail;animation-duration:1s;transform-origin:0 100%}@keyframes tail{0%,100%{transform:rotate(-14deg)}50%{transform:rotate(16deg)}}
.glow{animation-name:glow}@keyframes glow{0%,100%{opacity:.35}50%{opacity:.9}}
.peck{animation-name:peck;animation-duration:1s;transform-origin:0 100%}@keyframes peck{0%,60%,100%{transform:rotate(0)}30%{transform:rotate(24deg)}}
.drift{animation-name:drift;animation-timing-function:linear}@keyframes drift{from{transform:translateX(0)}to{transform:translateX(-640px)}}
.up{animation-name:up;animation-timing-function:linear}@keyframes up{0%{transform:translateY(0);opacity:0}20%{opacity:1}100%{transform:translateY(-70px);opacity:0}}
.d4{animation-delay:-.2s}.d5{animation-delay:-.6s}.d6{animation-delay:-1.1s}.d7{animation-delay:-1.7s}
`;
export const T = (x, y, inner, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${inner}</g>`;
export const A = (cls, inner) => `<g class="${cls}">${inner}</g>`;
export const full = (inner, bg = '#FFF8E7') => frame(`<style>${CSS2}</style>${inner}`, bg);

export const room = (wall = '#FFF3E0', floor = '#E8B77A', fy = 262) =>
  `<rect width="640" height="360" fill="${wall}"/><rect y="${fy}" width="640" height="${360 - fy}" fill="${floor}"/><rect y="${fy}" width="640" height="8" fill="rgba(0,0,0,.08)"/>`;
export const outdoor = (sky = '#B3E5FC', ground = '#A5D6A7', gy = 270) =>
  `<rect width="640" height="360" fill="${sky}"/><rect y="${gy}" width="640" height="${360 - gy}" fill="${ground}"/>`;
export const win = (x, y, w = 130, h = 100, glass = '#B3E5FC', inner = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${glass}"/>${inner}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="none" stroke="#fff" stroke-width="8"/><rect x="${x + w / 2 - 4}" y="${y}" width="8" height="${h}" fill="#fff"/>`;
export const table = (x, y, w = 300, color = '#C98B4E') =>
  `<rect x="${x}" y="${y}" width="${w}" height="16" rx="8" fill="${color}"/><rect x="${x + 16}" y="${y + 14}" width="14" height="${360 - y}" fill="${color}" opacity=".85"/><rect x="${x + w - 30}" y="${y + 14}" width="14" height="${360 - y}" fill="${color}" opacity=".85"/>`;
export const tree = (x, y, s = 1, leaf = '#66BB6A', cls = '') =>
  T(x, y, `<rect x="-7" y="-50" width="14" height="50" fill="#8D6E63"/>${A(cls, `<circle cx="0" cy="-74" r="36" fill="${leaf}"/><circle cx="-24" cy="-56" r="24" fill="${leaf}"/><circle cx="24" cy="-56" r="24" fill="${leaf}"/>`)}`, s);
export const house = (x, y, s = 1, wall = '#FFCC80', roof = '#E57373', lit = false) =>
  T(x, y, `<rect x="-50" y="-80" width="100" height="80" fill="${wall}"/><path d="M-62 -78l62-50 62 50z" fill="${roof}"/><rect x="-12" y="-40" width="24" height="40" rx="3" fill="#8D6E63"/><rect x="-40" y="-64" width="22" height="22" fill="${lit ? '#FFE082' : '#fff'}"/><rect x="18" y="-64" width="22" height="22" fill="${lit ? '#FFE082' : '#fff'}"/>`, s);
export const label = (x, y, text, bg = '#fff', color = '#333', size = 18) =>
  `<rect x="${x - (text.length * size + 26) / 2}" y="${y - size * 0.9}" width="${text.length * size + 26}" height="${size * 1.7}" rx="${size * 0.85}" fill="${bg}"/><text x="${x}" y="${y + size * 0.3}" font-size="${size}" text-anchor="middle" fill="${color}">${text}</text>`;
export const mark = (x, y, ch = '!', color = '#EF5350', size = 40) => T(x, y, A('pop', `<text font-size="${size}" text-anchor="middle" fill="${color}" stroke="#fff" stroke-width="5" paint-order="stroke">${ch}</text>`));
export const snow = (n = 26) => Array.from({ length: n }, (_, i) => `<circle class="fall" style="animation-delay:-${((i * 137) % 200) / 100}s" cx="${(i * 97) % 640}" cy="${((i * 53) % 40) - 20}" r="${3 + (i % 3)}" fill="#fff"/>`).join('');
export const rain = (n = 30) => Array.from({ length: n }, (_, i) => `<rect class="rain" style="animation-delay:-${((i * 71) % 50) / 100}s" x="${(i * 89) % 660}" y="${(i * 61) % 300}" width="3" height="18" rx="1.5" fill="#90CAF9" transform="skewX(-8)"/>`).join('');
export const nightStars = (n = 14, h = 180) => Array.from({ length: n }, (_, i) => star((i * 151) % 620 + 10, (i * 67) % h + 14, 4 + (i % 3) * 2, '#FFF59D', `twinkle d${i % 4}`)).join('');
export const moon = (x, y, r = 40, phase = 1) =>
  T(x, y, `<circle r="${r + 14}" fill="#FFF59D" class="glow"/><circle r="${r}" fill="#FFF176"/>${phase < 1 ? `<circle cx="${r * (1.1 - phase)}" cy="${-r * 0.1}" r="${r * 0.98}" fill="#1A237E"/>` : `<circle cx="-12" cy="-8" r="7" fill="#FDD835"/><circle cx="14" cy="10" r="9" fill="#FDD835"/>`}`);
export const fridge = (x, y, open = false) =>
  T(x, y, `<rect x="-50" y="-200" width="100" height="200" rx="10" fill="#ECEFF1" stroke="#B0BEC5" stroke-width="4"/>${open ? `<rect x="-42" y="-192" width="84" height="110" fill="#E3F2FD"/><rect x="-42" y="-140" width="84" height="5" fill="#B0BEC5"/><path d="M50 -200l56 14v118l-56 -14z" fill="#CFD8DC" stroke="#B0BEC5" stroke-width="4"/>${A('glow', `<rect x="-42" y="-192" width="84" height="110" fill="#FFFDE7" opacity=".5"/>`)}` : `<rect x="-50" y="-84" width="100" height="5" fill="#B0BEC5"/><rect x="30" y="-150" width="7" height="40" rx="3.5" fill="#90A4AE"/><rect x="30" y="-70" width="7" height="30" rx="3.5" fill="#90A4AE"/>`}`);
export const cake = (x, y, s = 1) =>
  T(x, y, `<ellipse cx="0" cy="0" rx="58" ry="12" fill="#fff"/><rect x="-44" y="-46" width="88" height="46" rx="8" fill="#FFF3E0"/><path d="M-44 -40q11 14 22 0t22 0 22 0 22 0v-8h-88z" fill="#fff"/><rect x="-44" y="-24" width="88" height="6" fill="#F48FB1"/>${[-28, 0, 28].map((dx, i) => `<circle cx="${dx}" cy="-52" r="8" fill="#E53935"/><rect x="${dx + 12}" y="-72" width="4" height="22" fill="#42A5F5"/>${A(`twinkle d${i}`, `<ellipse cx="${dx + 14}" cy="-78" rx="4" ry="7" fill="#FFB300"/>`)}`).join('')}`, s);
export const fishDish = (x, y, n = 1) =>
  T(x, y, `<ellipse cx="0" cy="0" rx="${40 + n * 22}" ry="13" fill="#fff" stroke="#CFD8DC" stroke-width="3"/>${Array.from({ length: n }, (_, i) => `<g transform="translate(${(i - (n - 1) / 2) * 44} -8)"><ellipse rx="20" ry="8" fill="#B0764A"/><path d="M18 0l12-8v16z" fill="#B0764A"/><circle cx="-12" cy="-2" r="2" fill="#fff"/><path d="M-4 -5v10M4 -6v12" stroke="#7A4A2B" stroke-width="2"/></g>`).join('')}`);
export const cat = (x, y, s = 1, color = '#fff', eye = 'open') =>
  T(x, y, `<ellipse cx="0" cy="2" rx="30" ry="5" fill="rgba(0,0,0,.12)"/>${A('tail', `<path d="M24 -14q30-6 22-40" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round"/><path d="M24 -14q30-6 22-40" fill="none" stroke="#BDBDBD" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>`)}<ellipse cx="0" cy="-20" rx="28" ry="22" fill="${color}" stroke="#BDBDBD" stroke-width="2"/><path d="M-28 -58l8-22 14 16zM28 -58l-8-22-14 16z" fill="${color}" stroke="#BDBDBD" stroke-width="2"/><circle cx="0" cy="-50" r="26" fill="${color}" stroke="#BDBDBD" stroke-width="2"/>${eye === 'happy' ? `<path d="M-15 -52q5-6 10 0M5 -52q5-6 10 0" fill="none" stroke="#333" stroke-width="2.5" stroke-linecap="round"/>` : A('blink', `<ellipse cx="-10" cy="-52" rx="4" ry="5" fill="#333"/><ellipse cx="10" cy="-52" rx="4" ry="5" fill="#333"/>`)}<path d="M-3 -44h6l-3 4z" fill="#F48FB1"/><path d="M-6 -38q3 4 6 0 3 4 6 0" fill="none" stroke="#333" stroke-width="2"/><path d="M-36 -46h14M-36 -40h14M22 -46h14M22 -40h14" stroke="#BDBDBD" stroke-width="1.5"/>`, s);
export const dog = (x, y, s = 1, color = '#A1672E') =>
  T(x, y, `<ellipse cx="0" cy="2" rx="38" ry="6" fill="rgba(0,0,0,.12)"/>${A('tail', `<path d="M30 -30q18-8 16-30" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round"/>`)}<rect x="-30" y="-44" width="62" height="32" rx="16" fill="${color}"/><rect x="-24" y="-18" width="10" height="18" rx="5" fill="${color}"/><rect x="16" y="-18" width="10" height="18" rx="5" fill="${color}"/>${A('bob2', `<circle cx="-30" cy="-58" r="24" fill="${color}"/><ellipse cx="-50" cy="-62" rx="9" ry="16" fill="#7A4A1E"/><ellipse cx="-12" cy="-66" rx="8" ry="15" fill="#7A4A1E"/><ellipse cx="-34" cy="-50" rx="12" ry="9" fill="#F5DEB3"/><circle cx="-34" cy="-54" r="4" fill="#333"/><circle cx="-40" cy="-64" r="3.5" fill="#333"/><circle cx="-24" cy="-64" r="3.5" fill="#333"/><path d="M-34 -48q0 8 5 8" fill="#F48FB1" stroke="#E57373" stroke-width="1.5"/>`)}`, s);
export const umbrella = (x, y, s = 1, color = '#42A5F5', inside = null) =>
  T(x, y, `<rect x="-3" y="-10" width="6" height="110" rx="3" fill="#795548"/><path d="M0 100q0 14 12 14" fill="none" stroke="#795548" stroke-width="6" stroke-linecap="round"/><path d="M-80 0q0-70 80-70t80 70q-13-14-27 0-13-14-26 0-14-14-27 0-13-14-27 0-13-14-26 0-14-14-27 0z" fill="${color}"/>${inside ? [-52, -18, 18, 52].map((dx, i) => `<g transform="translate(${dx} ${-22 - (i % 2) * 14})">${A(`twinkle d${i}`, `<circle r="6" fill="${inside}"/><circle r="2.5" fill="#F57F17"/>`)}</g>`).join('') : ''}`, s);
export const fuji = (x, y, s = 1, snowy = true) =>
  T(x, y, `<path d="M-200 0l150-190q50-16 100 0l150 190z" fill="#5C6BC0"/>${snowy ? `<path d="M-50 -190q50-16 100 0l40 50-26-14-24 22-28-24-30 24-26-22-46 14z" fill="#fff"/>` : `<path d="M-50 -190q50-16 100 0l14 18-64 6-64-6z" fill="#fff"/>`}`, s);
export const trainSide = (x, y, s = 1, color = '#66BB6A') =>
  T(x, y, `<rect x="-150" y="-80" width="300" height="80" rx="14" fill="#ECEFF1"/><rect x="-150" y="-34" width="300" height="14" fill="${color}"/>${[-120, -50, 20, 90].map((dx) => `<rect x="${dx}" y="-70" width="50" height="30" rx="5" fill="#81D4FA"/>`).join('')}<circle cx="-90" cy="2" r="12" fill="#455A64"/><circle cx="90" cy="2" r="12" fill="#455A64"/>`, s);
export const bowl = (x, y, kind = 'rice', s = 1) =>
  T(x, y, kind === 'rice' ? `<path d="M-30 -22q10-24 30-24t30 24z" fill="#fff" stroke="#CFD8DC" stroke-width="2"/><path d="M-34 -22q0 30 34 30t34-30z" fill="#5C6BC0"/>` : `<ellipse cx="0" cy="-22" rx="32" ry="7" fill="#8D4E2A"/><path d="M-32 -22q0 30 32 30t32-30z" fill="#D84315"/><rect x="-10" y="-27" width="9" height="7" fill="#fff"/><circle cx="12" cy="-22" r="3.5" fill="#66BB6A"/>`, s);
export const milk = (x, y, s = 1) => T(x, y, `<path d="M-16 -50l8-14h16l8 14z" fill="#E3F2FD"/><rect x="-16" y="-50" width="32" height="50" fill="#fff" stroke="#90CAF9" stroke-width="2"/><rect x="-16" y="-30" width="32" height="14" fill="#42A5F5"/>`, s);
export const key = (x, y, s = 1) => T(x, y, A('twinkle', `<circle cx="-12" cy="0" r="10" fill="none" stroke="#FFB300" stroke-width="6"/><rect x="-2" y="-3" width="30" height="6" fill="#FFB300"/><rect x="18" y="3" width="5" height="8" fill="#FFB300"/><rect x="26" y="3" width="5" height="6" fill="#FFB300"/>`), s);
export const apple = (x, y, s = 1) => T(x, y, `<circle cx="-6" cy="0" r="13" fill="#E53935"/><circle cx="6" cy="0" r="13" fill="#E53935"/><rect x="-1.5" y="-20" width="3" height="10" fill="#6D4C41"/><ellipse cx="7" cy="-17" rx="7" ry="3.5" fill="#66BB6A"/>`, s);
export const zzz = (x, y) => T(x, y, `${A('up', `<text font-size="22" fill="#5C6BC0">Z</text>`)}${A('up d2', `<text x="16" y="-10" font-size="16" fill="#7986CB">z</text>`)}`);
export const hearts = (x, y) => T(x, y, A('up', `<path d="M0 6q-12-10-6-18 6-4 6 4 0-8 6-4 6 8-6 18z" fill="#F06292"/>`) + A('up d2', `<path transform="translate(22 6) scale(.7)" d="M0 6q-12-10-6-18 6-4 6 4 0-8 6-4 6 8-6 18z" fill="#F48FB1"/>`));

// 人物
const P = (base) => (o) => person({ ...base, ...o });
export const me = P({ hair: '#7A4A2B', top: '#FF9F43', bottom: '#7E57C2' });
export const mom = P({ hair: '#4E342E', top: '#F48FB1', bottom: '#26A69A', bun: true, long: false });
export const dad = P({ hair: '#263238', top: '#42A5F5', bottom: '#546E7A', long: false });
export const boy = P({ hair: '#263238', top: '#66BB6A', bottom: '#1E88E5', long: false });
export const girl2 = P({ hair: '#3E2723', top: '#EC407A', bottom: '#FFCA28' });
export const grandpa = P({ hair: '#BDBDBD', top: '#8D6E63', bottom: '#5D4037', long: false });
export const friend = P({ hair: '#5D4037', top: '#26C6DA', bottom: '#37474F', long: false });
export const teacher = P({ hair: '#263238', top: '#7986CB', bottom: '#37474F', bun: true, long: false });
export const doctor = P({ hair: '#424242', top: '#FAFAFA', bottom: '#90A4AE', long: false });
