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
