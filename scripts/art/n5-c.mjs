import { full, T, A, room, outdoor, win, table, tree, house, label, mark, snow, rain, nightStars, moon, fridge, cake, fishDish, cat, dog, fuji, bowl, milk, key, apple, zzz, hearts,
  me, mom, dad, boy, girl2, grandpa, friend, doctor, person, bubble, steam, star, note, sun, cloud, bird } from './lib.mjs';
const S = {};
const bed = (x, y, inner = '') => T(x, y, `<rect x="-170" y="-50" width="340" height="50" rx="10" fill="#8D6E63"/><rect x="-170" y="-80" width="30" height="80" rx="8" fill="#6D4C41"/><rect x="-136" y="-74" width="70" height="30" rx="12" fill="#fff"/>${inner}<path d="M-70 -70h230q10 0 10 10v20h-240z" fill="#90CAF9"/><path d="M-70 -70h230" stroke="#64B5F6" stroke-width="8"/>`);
const head = (x, y, P, o = {}) => `<svg x="${x - 60}" y="${y - 110}" width="120" height="100" viewBox="-60 -170 120 100" overflow="hidden">${P({ x: 0, y: 0, s: 1, ...o })}</svg>`;
const tub = (x, y, w = 300, inner = '') => T(x, y, `${inner}<rect x="${-w / 2}" y="-60" width="${w}" height="70" rx="20" fill="#fff" stroke="#78909C" stroke-width="4"/><rect x="${-w / 2 + 10}" y="-54" width="${w - 20}" height="22" rx="10" fill="#81D4FA"/>${A('float', `<path d="M${-w / 2 + 20} -50q14-8 28 0t28 0 28 0 28 0" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/>`)}`);
const drop = (x, y, cls = 'fall') => `<path class="${cls}" d="M${x} ${y}q-6 10 0 14 6-4 0-14z" fill="#4FC3F7"/>`;
const store = (x, y, s = 1, night = false) => T(x, y, `<rect x="-130" y="-150" width="260" height="150" fill="${night ? '#FFF9C4' : '#FAFAFA'}"/><rect x="-140" y="-176" width="280" height="36" rx="6" fill="#43A047"/><rect x="-140" y="-150" width="280" height="8" fill="#FB8C00"/><text y="-150" font-size="22" text-anchor="middle" fill="#fff">コンビニ</text><rect x="-30" y="-90" width="60" height="90" fill="#B3E5FC"/><rect x="-1" y="-90" width="3" height="90" fill="#fff"/><rect x="-116" y="-110" width="70" height="70" fill="#B3E5FC"/><rect x="46" y="-110" width="70" height="70" fill="#B3E5FC"/>`, s);
const onigiri = (x, y, s = 1) => T(x, y, `<path d="M0 -24q8 0 22 30 4 12-10 12h-24q-14 0-10-12 14-30 22-30z" fill="#fff" stroke="#E0E0E0" stroke-width="2"/><rect x="-10" y="2" width="20" height="16" rx="2" fill="#263238"/>`, s);
const mount = (x, y, s = 1, snowy = true) => T(x, y, `<path d="M-200 0l150-190q50-20 100 0l150 190z" fill="#5C6BC0"/>${snowy ? `<path d="M-50 -190q50-20 100 0l34 44-30-14-26 20-28-22-28 22-26-20-30 14z" fill="#fff"/>` : ''}`, s);

// ── r14 かぜをひいた日 ──
S['n5-r14-1'] = full(`${room('#E3F2FD', '#D7A86E')}${win(460, 30, 130, 100, '#FFE0B2', sun(525, 80, 14))}
${bed(240, 320, head(-100, -34, me, { eye: 'closed', m: 'o' }))}
${T(520, 220, A('pop', `<rect x="-60" y="-18" width="120" height="36" rx="18" fill="#fff" stroke="#B0BEC5" stroke-width="3"/><rect x="-50" y="-6" width="70" height="12" rx="6" fill="#EF5350"/><text x="36" y="6" font-size="14" text-anchor="middle" fill="#E53935">38°</text>`))}
${T(60, 170, A('shake', `<path d="M0 -16l6 12 12 4-12 4-6 12-6-12-12-4 12-4z" fill="#EF5350"/>`))}${T(30, 220, A('shake d2', `<path d="M0 -12l5 9 9 3-9 3-5 9-5-9-9-3 9-3z" fill="#FB8C00"/>`))}
${label(110, 60, 'あたまが いたい', '#EF5350', '#fff', 16)}${label(300, 100, 'のどが いたい', '#FB8C00', '#fff', 16)}`);
S['n5-r14-2'] = full(`${room('#E0F2F1', '#CFD8DC')}<rect x="40" y="30" width="110" height="90" rx="8" fill="#fff" stroke="#B0BEC5" stroke-width="4"/><path d="M95 50v50M70 75h50" stroke="#EF5350" stroke-width="14"/>
${doctor({ x: 220, y: 352, s: 1.25, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob' })}${me({ x: 470, y: 352, s: 1.15, eye: 'closed', m: 'o', cls: 'bob d2' })}
${T(470, 256, `<rect x="-28" y="-10" width="56" height="26" rx="8" fill="#fff" stroke="#B0BEC5" stroke-width="2"/>`)}
${T(340, 250, A('bob', `<rect x="-26" y="-34" width="52" height="68" rx="6" fill="#fff" stroke="#90A4AE" stroke-width="3"/><text y="-8" font-size="16" text-anchor="middle" fill="#3949AB">くすり</text><ellipse cx="-8" cy="14" rx="10" ry="5" fill="#EF5350"/><ellipse cx="10" cy="20" rx="10" ry="5" fill="#42A5F5"/>`))}
${bubble({ x: 330, y: 90, text: 'よく ねてください', size: 19, tail: 1 })}${label(560, 60, 'びょういん', '#26A69A', '#fff')}`);
S['n5-r14-3'] = full(`${room('#303F9F', '#8D6E63')}${win(40, 30, 120, 90, '#1A237E', star(80, 60, 6, '#FFF59D') + star(130, 90, 5, '#FFF59D', 'twinkle d2'))}
${bed(230, 320, head(-100, -34, me, { eye: 'closed', m: 'smile' }))}${zzz(190, 190)}
${girl2({ x: 520, y: 352, s: 1.2, eye: 'happy', arms: 'hold', cls: 'bob' })}
${T(430, 280, A('bob', `${apple(-14, 0, 1.3)}${apple(16, 4, 1.1)}<rect x="40" y="-40" width="26" height="50" rx="4" fill="#FFB74D"/><text x="53" y="-10" font-size="10" text-anchor="middle" fill="#fff">ジュース</text>`))}${hearts(590, 150)}${label(520, 130, 'あね', '#EC407A', '#fff')}`, '#303F9F');
S['n5-r14-4'] = full(`${outdoor('#B3E5FC', '#CFD8DC', 280)}${sun(80, 70, 28)}${cloud(300, 50, 1, 'float')}
${[[420, 180], [500, 220], [570, 160]].map(([x, h]) => `<rect x="${x}" y="${280 - h}" width="64" height="${h}" fill="#90A4AE"/>${Array.from({ length: Math.floor(h / 34) }, (_, i) => `<rect x="${x + 10}" y="${280 - h + 12 + i * 32}" width="16" height="16" fill="#E3F2FD"/><rect x="${x + 38}" y="${280 - h + 12 + i * 32}" width="16" height="16" fill="#E3F2FD"/>`).join('')}`).join('')}
${me({ x: 230, y: 352, s: 1.25, eye: 'happy', m: 'open', arms: 'wave', walk: true, cls: 'bob2' })}
${T(230, 268, `<rect x="-46" y="-12" width="92" height="24" rx="12" fill="#EF5350"/><rect x="18" y="4" width="20" height="46" rx="8" fill="#E53935"/>`)}
${bubble({ x: 380, y: 110, text: 'げんき!', size: 22, tail: -1 })}${star(150, 150, 10)}${star(330, 200, 9, '#FFB300', 'twinkle d2')}${label(110, 300, 'あたたかい ふく', '#EF5350', '#fff', 15)}`, '#B3E5FC');

// ── r15 日本のおふろ ──
const tiles = `<rect width="640" height="360" fill="#E0F7FA"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${i * 80} 0v250" stroke="#B2EBF2" stroke-width="2"/>`).join('')}${[60, 120, 180].map((y) => `<path d="M0 ${y}h640" stroke="#B2EBF2" stroke-width="2"/>`).join('')}<rect y="250" width="640" height="110" fill="#B0BEC5"/>`;
S['n5-r15-1'] = full(`${tiles}${win(480, 30, 120, 90, '#1A237E', moon(560, 70, 16, 1) + star(510, 60, 5, '#FFF59D'))}
${tub(300, 320, 380, head(0, -40, dad, { eye: 'closed', m: 'smile' }))}${steam(200, 180, 5, 50)}
${T(300, 196, A('bob', `<rect x="-22" y="-8" width="44" height="14" rx="5" fill="#fff"/>`))}${note(420, 180)}${note(160, 150, 'rise d2', '#1E88E5')}
${label(120, 50, 'まいばん', '#5C6BC0', '#fff')}${bubble({ x: 470, y: 180, text: 'きもちいい〜', size: 19, tail: 1 })}`, '#E0F7FA');
S['n5-r15-2'] = full(`${tiles}<rect x="316" width="8" height="360" fill="#fff"/>
${T(160, 320, `<rect x="-36" y="-24" width="72" height="24" rx="6" fill="#FFB74D"/>`)}${T(160, 300, head(0, 0, boy, { eye: 'closed', m: 'smile' }))}
${T(160, 150, A('pop', [[-30, 0, 14], [0, -14, 18], [30, 2, 13], [-12, 16, 10], [18, 20, 9]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#B3E5FC" stroke-width="2"/>`).join('')))}
<rect x="56" y="60" width="8" height="80" fill="#90A4AE"/><circle cx="76" cy="62" r="14" fill="#90A4AE"/>${[0, 1, 2, 3].map((i) => drop(70 + i * 8, 80 + i * 6, `fall d${i}`)).join('')}
${label(160, 30, '① あらう', '#1E88E5', '#fff')}
${tub(480, 320, 260, head(0, -40, boy, { eye: 'happy', m: 'open' }))}${steam(420, 190, 4, 40)}${label(480, 30, '② はいる', '#43A047', '#fff')}
${T(320, 180, `<circle r="24" fill="#FB8C00"/><path d="M-10 0h14M0 -10l12 10-12 10" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>`)}`, '#E0F7FA');
S['n5-r15-3'] = full(`${tiles}${tub(320, 330, 520, head(-180, -40, dad, { eye: 'happy' }) + head(-60, -40, mom, { eye: 'happy' }) + head(60, -40, me, { eye: 'happy' }) + head(180, -40, boy, { eye: 'happy', m: 'open' }))}${steam(120, 150, 6, 80)}
${[[100, 110], [320, 90], [540, 110]].map(([x, y], i) => star(x, y, 12, '#4FC3F7', `twinkle d${i}`)).join('')}
${label(320, 30, 'おなじ おゆ → きれいに', '#1E88E5', '#fff')}`, '#E0F7FA');
S['n5-r15-4'] = full(`${tiles}
<path d="M40 250l160-170q40-14 80 0l160 170z" fill="#7986CB" opacity=".8"/><path d="M200 80q40-14 80 0l26 28-22-10-22 14-22-14-22 14-22-14z" fill="#fff"/>
<rect x="20" y="230" width="600" height="120" rx="30" fill="#B0BEC5"/><rect x="34" y="236" width="572" height="50" rx="22" fill="#81D4FA"/>${A('float', `<path d="M60 256q20-10 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0 40 0" stroke="#fff" stroke-width="4" fill="none" opacity=".8"/>`)}
${head(210, 280, dad, { eye: 'closed', m: 'smile' })}${head(380, 284, me, { eye: 'happy', m: 'open' })}
${T(210, 160, A('bob', `<rect x="-22" y="-8" width="44" height="14" rx="5" fill="#fff"/>`))}${steam(100, 200, 3, 30)}${steam(470, 200, 4, 34)}
${T(550, 90, `<rect x="-50" y="-50" width="100" height="100" rx="10" fill="#1E88E5"/><text y="16" font-size="54" text-anchor="middle" fill="#fff">ゆ</text>`)}${label(110, 40, 'せんとう', '#fff', '#1E88E5')}${note(300, 150)}`, '#E0F7FA');

// ── r16 日本のコンビニ ──
S['n5-r16-1'] = full(`${outdoor('#B3E5FC', '#CFD8DC', 280)}${sun(580, 50, 20)}${cloud(250, 40, 0.9, 'float')}
${store(170, 280, 0.8)}${store(470, 280, 0.8)}
${T(60, 280, `<rect x="-40" y="-60" width="80" height="60" fill="#ECEFF1"/><rect x="-46" y="-74" width="92" height="18" fill="#EF5350"/><text y="-28" font-size="18" text-anchor="middle" fill="#333">えき</text>`)}${T(590, 280, `<rect x="-36" y="-80" width="72" height="80" fill="#FFE0B2"/><path d="M-44 -80l44-30 44 30z" fill="#8D6E63"/><text y="-36" font-size="14" text-anchor="middle" fill="#333">がっこう</text>`)}
${T(320, 110, A('pop', `<circle r="46" fill="#FDD835"/><text y="-2" font-size="30" text-anchor="middle" fill="#C62828">24</text><text y="22" font-size="14" text-anchor="middle" fill="#C62828">じかん</text>`))}${T(320, 110, A('spinSlow', `<path d="M0 -58a58 58 0 0 1 50 29" stroke="#FB8C00" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M0 58a58 58 0 0 1 -50 -29" stroke="#FB8C00" stroke-width="6" fill="none" stroke-linecap="round"/>`))}
${me({ x: 320, y: 352, s: 0.9, eye: 'happy', walk: true, cls: 'bob2' })}`, '#B3E5FC');
S['n5-r16-2'] = full(`${room('#FAFAFA', '#ECEFF1', 280)}
${[[30, 'おにぎり'], [230, 'べんとう'], [430, 'のみもの']].map(([x, t], k) => `<rect x="${x}" y="50" width="180" height="170" rx="8" fill="#fff" stroke="#CFD8DC" stroke-width="4"/><rect x="${x}" y="132" width="180" height="6" fill="#CFD8DC"/>${label(x + 90, 40, t, '#43A047', '#fff', 15)}${[0, 1, 2].map((i) => [0, 1].map((r) => k === 0 ? onigiri(x + 40 + i * 50, 108 + r * 84) : k === 1 ? T(x + 40 + i * 50, 118 + r * 84, `<rect x="-20" y="-22" width="40" height="26" rx="4" fill="#263238"/><rect x="-16" y="-18" width="16" height="18" fill="#fff"/><circle cx="8" cy="-12" r="5" fill="#EF5350"/><rect x="2" y="-6" width="12" height="6" fill="#FFB300"/>`) : T(x + 40 + i * 50, 122 + r * 84, `<rect x="-9" y="-44" width="18" height="44" rx="5" fill="${['#42A5F5', '#66BB6A', '#FB8C00'][(i + r) % 3]}"/><rect x="-5" y="-50" width="10" height="8" fill="#fff"/>`)).join('')).join('')}`).join('')}
${A('scrollL', [680, 800, 920].map((x, i) => person({ x, y: 352, s: 0.9, hair: '#263238', top: ['#546E7A', '#5C6BC0', '#78909C'][i], bottom: '#37474F', long: i === 1, walk: true, flip: true })).join(''))}
${dad({ x: 130, y: 352, s: 1.05, eye: 'happy', arms: 'hold', cls: 'bob2' })}${onigiri(170, 290, 1.1)}${label(560, 300, 'あさ', '#FB8C00', '#fff')}`);
S['n5-r16-3'] = full(`${room('#FFF8E1', '#ECEFF1', 280)}<rect x="60" y="210" width="520" height="80" fill="#90A4AE"/><rect x="60" y="210" width="520" height="12" fill="#78909C"/>
${person({ x: 470, y: 250, s: 1.0, hair: '#263238', top: '#43A047', bottom: '#37474F', eye: 'happy', m: 'open', arms: 'wave', cls: 'bob' })}<rect x="380" y="222" width="200" height="68" fill="#90A4AE"/>
${T(140, 130, A('bob', `<rect x="-26" y="-32" width="52" height="64" fill="#fff" stroke="#EF5350" stroke-width="4" stroke-dasharray="6 4"/><circle r="14" fill="#F48FB1"/>`))}${label(140, 60, 'きって', '#EF5350', '#fff', 15)}
${T(280, 130, A('bob d1', `<rect x="-40" y="-28" width="80" height="56" rx="3" fill="#fff" stroke="#B0BEC5" stroke-width="3"/><rect x="18" y="-22" width="16" height="18" fill="#EF9A9A"/><path d="M-32 0h40M-32 12h30" stroke="#B0BEC5" stroke-width="3"/>`))}${label(280, 60, 'はがき', '#5C6BC0', '#fff', 15)}
${T(300, 210, A('bob2', `<rect x="-44" y="-56" width="88" height="56" fill="#D7A86E"/><rect x="-6" y="-56" width="12" height="56" fill="#A1887F"/><rect x="-30" y="-40" width="34" height="18" fill="#fff"/>`))}${label(300, 300, 'にもつ', '#8D6E63', '#fff', 15)}
${me({ x: 150, y: 354, s: 1.1, eye: 'happy', m: 'open', arms: 'up', cls: 'bob d2' })}`);
S['n5-r16-4'] = full(`<rect width="640" height="360" fill="#1A237E"/>${nightStars(12, 120)}${moon(80, 60, 24, 0.6)}<rect y="280" width="640" height="80" fill="#37474F"/>
${T(240, 240, A('glow', `<ellipse rx="220" ry="150" fill="#FFF59D" opacity=".25"/>`))}${store(240, 280, 1, true)}
<path d="M110 280l-60 80h380l-60-80z" fill="#FFF59D" opacity=".35"/>
${me({ x: 470, y: 352, s: 1.05, eye: 'open', m: 'o', arms: 'hold', cls: 'bob' })}
${T(560, 150, `<rect x="-66" y="-70" width="132" height="140" rx="10" fill="#fff"/>${onigiri(-30, -34, 0.9)}<text x="26" y="-28" font-size="17" text-anchor="middle" fill="#E53935">150円</text><path d="M-56 0h112" stroke="#CFD8DC" stroke-width="2"/><text x="-30" y="30" font-size="12" text-anchor="middle" fill="#666">スーパー</text><text x="26" y="34" font-size="17" text-anchor="middle" fill="#43A047">120円</text>`)}
${label(470, 170, 'べんり', '#FDD835', '#333', 16)}${mark(516, 250, '?', '#FFF59D', 30)}`, '#1A237E');

// ── r17 富士山 ──
S['n5-r17-1'] = full(`${outdoor('#B3E5FC', '#A5D6A7', 290)}${sun(80, 60, 24)}${cloud(520, 60, 1, 'float')}${cloud(150, 150, 0.7, 'float d2')}
${mount(320, 292, 1.25)}${[[80, 0.45], [560, 0.35]].map(([x, s]) => T(x, 292, `<path d="M-200 0l200-190 200 190z" fill="#81C784"/>`, s)).join('')}
<path d="M560 60v232" stroke="#E53935" stroke-width="3"/><path d="M552 60h16M552 292h16" stroke="#E53935" stroke-width="3"/>${label(540, 180, '3776m', '#E53935', '#fff', 20)}
${T(320, 44, A('bob', `<path d="M0 -22l6 14h15l-12 9 5 15-14-9-14 9 5-15-12-9h15z" fill="#FDD835"/>`))}${label(320, 320, 'にほんで いちばん', '#fff', '#3949AB')}${bird(200, 90)}`, '#B3E5FC');
S['n5-r17-2'] = full(`${outdoor('#B3E5FC', '#B0BEC5', 300)}${sun(560, 56, 24)}${mount(150, 300, 0.55)}
${[[330, 150], [400, 200], [470, 240], [540, 170], [600, 120]].map(([x, h], k) => `<rect x="${x}" y="${300 - h}" width="60" height="${h}" fill="${['#90A4AE', '#78909C', '#B0BEC5'][k % 3]}"/>${Array.from({ length: Math.floor(h / 30) }, (_, i) => `<rect x="${x + 10}" y="${300 - h + 12 + i * 28}" width="14" height="14" fill="#E3F2FD"/><rect x="${x + 36}" y="${300 - h + 12 + i * 28}" width="14" height="14" fill="#E3F2FD"/>`).join('')}`).join('')}
<rect x="484" y="20" width="8" height="46" fill="#EF5350"/><path d="M470 66l18-10 18 10z" fill="#EF5350"/>
${me({ x: 280, y: 354, s: 1.0, eye: 'wide', m: 'open', arms: 'wave', cls: 'bob' })}<path d="M250 230q-40-30-70-60" stroke="#FB8C00" stroke-width="4" stroke-dasharray="6 8" fill="none"/>
${bubble({ x: 300, y: 130, text: 'みえる!', size: 20, tail: -1 })}${label(480, 330, 'とうきょう', '#fff', '#333', 16)}${cloud(300, 60, 0.7, 'float')}`, '#B3E5FC');
S['n5-r17-3'] = full(`<rect width="320" height="360" fill="#CFD8DC"/><rect x="320" width="320" height="360" fill="#81D4FA"/>
<svg x="0" y="0" width="316" height="360" viewBox="0 0 316 360"><rect y="300" width="316" height="60" fill="#fff"/>${mount(158, 302, 0.75)}${snow(18)}${label(60, 30, 'ふゆ', '#1E88E5', '#fff')}</svg>
<svg x="324" y="0" width="316" height="360" viewBox="0 0 316 360"><rect y="300" width="316" height="60" fill="#A5D6A7"/>${sun(260, 50, 20)}${mount(158, 302, 0.75, false)}
<path d="M70 300q50-40 60-90t30-70" stroke="#FFE0B2" stroke-width="5" fill="none" stroke-dasharray="3 7"/>
${[[84, 290, 0], [112, 256, 1], [128, 216, 2], [140, 178, 3]].map(([x, y, i]) => T(x, y, A(`bob2 d${i}`, person({ x: 0, y: 0, s: 0.3, hair: '#263238', top: ['#EF5350', '#FDD835', '#42A5F5', '#66BB6A'][i], bottom: '#37474F' })))).join('')}
${label(70, 30, '7月・8月', '#FB8C00', '#fff')}</svg><rect x="316" width="8" height="360" fill="#fff"/>`);
S['n5-r17-4'] = full(`<rect width="640" height="360" fill="#FFCC80"/><rect width="640" height="150" fill="#F8BBD0" opacity=".7"/>
${T(320, 250, `${A('spinSlow', Array.from({ length: 12 }, (_, i) => `<rect x="-5" y="-130" width="10" height="34" rx="5" fill="#FFF59D" transform="rotate(${i * 30})"/>`).join(''))}<circle r="76" fill="#FFF59D" class="glow"/><circle r="60" fill="#FFB300"/>`)}
${A('float', `<ellipse cx="120" cy="250" rx="130" ry="26" fill="#fff"/><ellipse cx="520" cy="246" rx="140" ry="28" fill="#fff"/>`)}<ellipse cx="320" cy="270" rx="200" ry="24" fill="#fff" opacity=".9"/>
<path d="M0 360v-60q160-50 320-30t320 20v70z" fill="#5D4037"/>
${dad({ x: 150, y: 330, s: 0.95, eye: 'happy', arms: 'up', cls: 'bob' })}${mom({ x: 250, y: 320, s: 0.9, eye: 'happy', arms: 'hold', cls: 'shake' })}${me({ x: 420, y: 322, s: 0.95, eye: 'wide', m: 'open', arms: 'up', cls: 'bob d2' })}
${bubble({ x: 520, y: 110, text: 'きれい!', size: 22, tail: -1 })}${label(110, 60, 'さむい〜', '#1E88E5', '#fff')}`, '#FFCC80');

// ── r18 水と雲 ──
const glass = (x, y, inner) => T(x, y, `<path d="M-60 -150h120l-12 150h-96z" fill="#E3F2FD" stroke="#90A4AE" stroke-width="5"/><path d="M-55 -100h110l-8 96h-94z" fill="#4FC3F7" opacity=".8"/>${inner}`);
const ice = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-18" y="-18" width="36" height="36" rx="6" fill="#E1F5FE" stroke="#81D4FA" stroke-width="3"/><path d="M-10 -8l8-4" stroke="#fff" stroke-width="3"/></g>`;
S['n5-r18-1'] = full(`${outdoor('#CFD8DC', '#ECEFF1', 240)}${tree(80, 250, 1.2, '#B0BEC5', 'sway')}${tree(570, 250, 1.1, '#B0BEC5', 'sway d2')}
<ellipse cx="330" cy="300" rx="200" ry="44" fill="#B3E5FC"/><ellipse cx="330" cy="296" rx="190" ry="38" fill="#E1F5FE"/><path d="M200 290l60 14-30 12M380 280l50 20M300 310l40-10" stroke="#81D4FA" stroke-width="3" fill="none"/>
${[[240, 284], [420, 300], [330, 276]].map(([x, y], i) => star(x, y, 9, '#fff', `twinkle d${i}`)).join('')}
${me({ x: 110, y: 352, s: 1.05, eye: 'closed', m: 'o', arms: 'hold', cls: 'shake' })}${T(110, 280, `<rect x="-42" y="-10" width="84" height="22" rx="11" fill="#EF5350"/>`)}
${T(520, 130, `<rect x="-12" y="-70" width="24" height="110" rx="12" fill="#fff" stroke="#90A4AE" stroke-width="3"/><circle cy="50" r="20" fill="#42A5F5"/><rect x="-5" y="10" width="10" height="40" fill="#42A5F5"/>`)}${label(520, 30, '0°', '#1E88E5', '#fff')}${label(330, 220, 'みず → こおり', '#fff', '#1E88E5')}${snow(12)}`, '#CFD8DC');
S['n5-r18-2'] = full(`${room('#E8F5E9', '#D7A86E')}${table(120, 250, 400)}
${glass(320, 248, A('bob', ice(-16, -104, 1) + ice(22, -98, 0.9)))}
${T(210, 60, A('fall', ice(0, 0, 0.8)))}
${me({ x: 560, y: 352, s: 1.15, eye: 'wide', m: 'open', arms: 'wave', cls: 'bob' })}${bubble({ x: 470, y: 90, text: 'うく!', size: 22, tail: 1 })}
${label(130, 150, 'こおり', '#81D4FA', '#fff')}<path d="M170 160l100 -20" stroke="#81D4FA" stroke-width="3"/>${label(130, 220, 'みず', '#1E88E5', '#fff')}<path d="M160 220l110 -10" stroke="#1E88E5" stroke-width="3"/>
${T(60, 80, `<path d="M-30 0h60M-20 -14h40" stroke="#90A4AE" stroke-width="4"/><text y="-24" font-size="16" text-anchor="middle" fill="#607D8B">かるい</text>`)}`);
S['n5-r18-3'] = full(`${outdoor('#B3E5FC', '#B0BEC5', 270)}${sun(90, 70, 30)}
<ellipse cx="320" cy="320" rx="150" ry="22" fill="#4FC3F7"/><ellipse cx="290" cy="316" rx="40" ry="5" fill="#fff" opacity=".6"/>
${[240, 290, 340, 390].map((x, i) => A(`up d${i}`, `<path d="M${x} 290q-10 -16 0 -30t0 -30" stroke="#81D4FA" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/>`)).join('')}
${[260, 320, 380].map((x, i) => A(`up d${(i + 2) % 4}`, `<path d="M${x} 200q-6 10 0 14 6-4 0-14z" fill="#4FC3F7"/>`)).join('')}
${T(330, 90, A('bob', cloud(0, 0, 1.8)))}${T(520, 70, A('float', cloud(0, 0, 1)))}
${boy({ x: 560, y: 352, s: 1.0, eye: 'wide', m: 'o', arms: 'wave', cls: 'bob' })}${label(330, 170, 'みず → くも', '#fff', '#1E88E5')}${mark(606, 210, '!', '#FB8C00', 34)}`, '#B3E5FC');
S['n5-r18-4'] = full(`<rect width="640" height="360" fill="#7986CB"/><rect y="300" width="640" height="60" fill="#A5D6A7"/><ellipse cx="150" cy="320" rx="120" ry="20" fill="#4FC3F7"/>
${T(150, 80, cloud(0, 0, 1.7))}${T(480, 80, cloud(0, 0, 1.7))}
<svg x="60" y="110" width="180" height="180" viewBox="0 0 640 360" preserveAspectRatio="none">${rain(16)}</svg><svg x="390" y="110" width="180" height="180" viewBox="0 0 640 360" preserveAspectRatio="none">${snow(16)}</svg>
${T(320, 200, A('spinSlow', `<path d="M0 -60a60 60 0 0 1 52 30" stroke="#FFF59D" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M52 -30l4 -24-22 8z" fill="#FFF59D"/><path d="M0 60a60 60 0 0 1 -52 -30" stroke="#FFF59D" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-52 30l-4 24 22-8z" fill="#FFF59D"/>`))}
${T(320, 200, drop(0, -10, 'glow'))}${T(480, 322, ice(0, 0, 1.1))}
${label(150, 30, 'あめ', '#1E88E5', '#fff')}${label(480, 30, 'ゆき', '#90A4AE', '#fff')}${label(320, 290, 'おもしろい!', '#FB8C00', '#fff')}`, '#E3F2FD');

// ── r19 父のかぎ ──
const bag = (x, y, s = 1) => T(x, y, `<rect x="-34" y="-40" width="68" height="44" rx="6" fill="#5D4037"/><path d="M-14 -40q0-18 14-18t14 18" stroke="#5D4037" stroke-width="6" fill="none"/><rect x="-8" y="-24" width="16" height="10" rx="2" fill="#FDD835"/>`, s);
S['n5-r19-1'] = full(`${room('#FFF3E0', '#D7A86E')}${win(40, 30, 120, 90, '#B3E5FC', sun(100, 76, 12))}${table(330, 250, 280)}
${dad({ x: 220, y: 352, s: 1.25, eye: 'wide', m: 'o', arms: 'up', cls: 'shake' })}${T(420, 248, A('shake', bag(0, 0, 1.2)))}
${T(540, 240, `<rect x="-30" y="-6" width="60" height="6" fill="#fff"/><rect x="-20" y="-24" width="22" height="18" rx="3" fill="#90CAF9"/>`)}
${T(360, 110, `<circle r="46" fill="#fff" stroke="#B0BEC5" stroke-width="4"/>${key(0, 4, 1.3)}`)}${mark(420, 80, '?', '#EF5350', 44)}${mark(300, 80, '?', '#FB8C00', 34)}
${bubble({ x: 140, y: 160, text: 'かぎが ない!', size: 20, tail: 1 })}${label(560, 40, 'げつようび', '#5C6BC0', '#fff', 16)}`);
S['n5-r19-2'] = full(`<rect width="640" height="360" fill="#1A237E"/>${nightStars(12, 140)}<rect y="290" width="640" height="70" fill="#37474F"/>
${T(120, 290, `<rect x="-100" y="-120" width="200" height="120" fill="#FFF9C4"/><rect x="-108" y="-142" width="216" height="30" rx="5" fill="#43A047"/><text y="-120" font-size="17" text-anchor="middle" fill="#fff">コンビニ</text><rect x="-24" y="-72" width="48" height="72" fill="#B3E5FC"/>`)}
<rect x="14" y="14" width="612" height="332" rx="30" fill="none" stroke="#9FA8DA" stroke-width="6" stroke-dasharray="4 14" stroke-linecap="round"/>
${dad({ x: 400, y: 352, s: 1.3, eye: 'happy', walk: true, cls: 'bob2' })}
${T(318, 300, A('bob', bag(0, 0, 1)))}${T(486, 286, A('bob', milk(0, 0, 1.1) + T(26, -6, key(0, 0, 0.8))))}
${label(290, 110, 'ひだり: かばん', '#8D6E63', '#fff', 15)}${label(510, 110, 'みぎ: ぎゅうにゅう+かぎ', '#FDD835', '#333', 15)}${label(400, 50, 'きのうの よる', 'rgba(255,255,255,.2)', '#fff', 16)}`, '#1A237E');
S['n5-r19-3'] = full(`${room('#FFF8E1', '#D7A86E')}${win(40, 30, 110, 80, '#1A237E', star(95, 66, 6, '#FFF59D'))}
${fridge(440, 300, true)}${T(470, 210, A('pop', milk(0, 0, 1) + T(24, 2, key(0, 0, 0.7))))}
${dad({ x: 270, y: 352, s: 1.25, eye: 'happy', arms: 'hold', cls: 'bob' })}
<path d="M320 230q60-30 110-20" stroke="#FB8C00" stroke-width="5" stroke-dasharray="5 9" fill="none" stroke-linecap="round"/><path d="M428 198l22 14-24 10z" fill="#FB8C00"/>
${label(140, 170, 'だいどころ', '#FB8C00', '#fff')}${mark(540, 130, '!', '#EF5350', 36)}`);
S['n5-r19-4'] = full(`${room('#FFF3E0', '#D7A86E')}${fridge(140, 300, true)}${T(160, 210, milk(0, 0, 1))}${T(196, 212, A('glow', key(0, 0, 1) + `<circle r="26" fill="none" stroke="#FDD835" stroke-width="4"/>`))}
${me({ x: 320, y: 352, s: 1.15, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob' })}${dad({ x: 500, y: 352, s: 1.3, eye: 'happy', m: 'open', arms: 'up', cls: 'bob2' })}
${bubble({ x: 470, y: 80, text: 'ありがとう、たんていさん', size: 17, tail: 1 })}${star(280, 120, 12)}${star(600, 150, 9, '#FFB300', 'twinkle d2')}${hearts(400, 180)}`);

// ── r20 なくなった魚 ──
const hairs = (x, y) => T(x, y, A('glow', [[-14, 0, 20], [0, 6, -30], [14, -2, 50], [6, -10, 0]].map(([dx, dy, r]) => `<path d="M${dx - 6} ${dy}h12" stroke="#fff" stroke-width="3" stroke-linecap="round" transform="rotate(${r} ${dx} ${dy})"/><path d="M${dx - 6} ${dy}h12" stroke="#B0BEC5" stroke-width="1" transform="rotate(${r} ${dx} ${dy})"/>`).join('')));
S['n5-r20-1'] = full(`${room('#FFE0B2', '#C98B4E')}${win(40, 30, 120, 90, '#FFAB91', `<circle cx="100" cy="90" r="20" fill="#FF7043"/>`)}${table(180, 250, 360)}
${fishDish(360, 248, 3)}${steam(320, 190, 4, 26)}
${mom({ x: 90, y: 352, s: 1.15, eye: 'happy', arms: 'hold', cls: 'bob' })}
${T(590, 290, `${[0, 1, 2, 3, 4].map((i) => `<rect x="${-50 + i * 4}" y="${-i * 34 - 34}" width="${100 - i * 4}" height="10" fill="#8D6E63"/>`).join('')}<path d="M-50 0l16-180" stroke="#6D4C41" stroke-width="6"/>`)}<path d="M560 150l26-24v16h20v16h-20v16z" fill="#FB8C00" class="bob"/>
${label(600, 80, '2かい', '#5C6BC0', '#fff', 15)}${label(360, 130, 'さかな 3びき', '#FB8C00', '#fff')}${label(330, 40, 'どようびの ゆうがた', '#fff', '#E64A19', 15)}`);
S['n5-r20-2'] = full(`${room('#FFE0B2', '#C98B4E')}${table(160, 250, 380)}${fishDish(330, 248, 2)}${hairs(450, 236)}
${T(450, 190, A('bob', `<circle r="38" fill="#E3F2FD" opacity=".5" stroke="#455A64" stroke-width="8"/><rect x="26" y="30" width="40" height="11" rx="5" fill="#455A64" transform="rotate(40 26 30)"/>`))}
${mom({ x: 80, y: 352, s: 1.1, eye: 'wide', m: 'o', arms: 'up', cls: 'shake' })}${me({ x: 590, y: 352, s: 1.05, eye: 'open', m: 'o', arms: 'hold', cls: 'bob' })}
${bubble({ x: 150, y: 110, text: '2ひきだけ!?', size: 20, tail: 1 })}${label(480, 110, 'しろい け', '#fff', '#333', 16)}${mark(390, 150, '?', '#EF5350', 40)}`);
S['n5-r20-3'] = full(`<rect width="420" height="360" fill="#B3E5FC"/><rect y="250" width="420" height="110" fill="#A5D6A7"/><rect x="420" width="220" height="360" fill="#FFE0B2"/><rect x="420" y="270" width="220" height="90" fill="#C98B4E"/><rect x="414" width="8" height="360" fill="#fff"/>
${sun(60, 60, 22)}${tree(360, 262, 1.2, '#43A047', 'sway')}
${boy({ x: 130, y: 350, s: 1.05, eye: 'happy', m: 'open', arms: 'up', cls: 'bob2' })}${dog(270, 350, 1.2)}${T(200, 200, A('bob2', `<circle r="14" fill="#EF5350"/><path d="M-14 0a14 14 0 0 1 28 0" fill="#fff"/>`))}
${label(130, 150, 'おとうと', '#43A047', '#fff', 15)}${label(280, 250, 'ポチ', '#A1672E', '#fff', 15)}${label(90, 300, 'にわ', '#fff', '#2E7D32', 15)}
${cat(530, 340, 1.4, '#fff')}${label(530, 220, 'シロ', '#fff', '#333', 16)}${mark(590, 250, '?', '#EF5350', 34)}`);
S['n5-r20-4'] = full(`${room('#FFE0B2', '#C98B4E')}
${T(440, 330, `<rect x="-70" y="-110" width="140" height="12" rx="4" fill="#8D6E63"/><rect x="-62" y="-98" width="10" height="98" fill="#6D4C41"/><rect x="52" y="-98" width="10" height="98" fill="#6D4C41"/><rect x="-70" y="-200" width="12" height="100" fill="#8D6E63"/><rect x="-70" y="-200" width="140" height="40" rx="6" fill="#A1887F"/>`)}
${cat(440, 330, 1.2, '#fff', 'happy')}${T(490, 320, `<path d="M0 0h30M4 -6l8 12M14 -6l8 12" stroke="#90A4AE" stroke-width="3"/>`)}
${bubble({ x: 540, y: 190, text: 'ニャー', size: 22, tail: -1 })}
${me({ x: 160, y: 352, s: 1.25, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob' })}${bubble({ x: 200, y: 70, text: 'シロでしょう!', size: 20, tail: -1 })}${mark(300, 170, '!')}${star(60, 110, 10)}${star(600, 80, 9, '#FFB300', 'twinkle d2')}`);
export default S;
