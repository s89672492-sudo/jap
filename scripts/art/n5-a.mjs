import { full, T, A, room, outdoor, win, table, tree, house, label, mark, snow, rain, nightStars, moon, cake, bowl, apple, fuji, trainSide, hearts, zzz,
  me, mom, dad, boy, girl2, grandpa, friend, person, bubble, steam, star, note, sun, cloud, bird } from './lib.mjs';
const S = {};

// ── r02 お正月 ──
S['n5-r02-1'] = full(`${room('#FFEBEE', '#D7A86E')}
<rect x="250" y="20" width="140" height="56" rx="10" fill="#E53935"/><text x="320" y="58" font-size="30" text-anchor="middle" fill="#fff">1月1日</text>
${T(70, 262, `<rect x="-26" y="-30" width="52" height="30" fill="#8D6E63"/>${A('sway', `<rect x="-20" y="-120" width="12" height="92" fill="#66BB6A"/><rect x="-4" y="-150" width="12" height="122" fill="#43A047"/><rect x="12" y="-100" width="12" height="72" fill="#66BB6A"/>`)}<path d="M-30 -30h60v-10h-60z" fill="#E53935"/>`)}
${T(560, 262, `<ellipse cx="0" cy="-10" rx="44" ry="20" fill="#fff"/><ellipse cx="0" cy="-36" rx="30" ry="15" fill="#fff"/><circle cx="0" cy="-56" r="11" fill="#FB8C00"/><rect x="-50" y="-4" width="100" height="8" fill="#E53935"/>`)}
${dad({ x: 190, y: 330, s: 1.15, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob' })}${mom({ x: 320, y: 336, s: 1.1, eye: 'happy', cls: 'bob d1' })}${me({ x: 440, y: 334, s: 1.05, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob d2' })}
${bubble({ x: 320, y: 120, text: 'あけましておめでとう!', size: 20, tail: -1 })}
${star(120, 70, 12)}${star(520, 110, 10, '#F06292', 'twinkle d1')}${star(40, 140, 8, '#FFB300', 'twinkle d2')}${star(600, 50, 9, '#FFD54F', 'twinkle d3')}`);
S['n5-r02-2'] = full(`${room('#FFF8E1', '#D7A86E')}${table(60, 250, 520)}
${T(200, 248, `<rect x="-90" y="-60" width="180" height="60" rx="8" fill="#212121"/><rect x="-82" y="-52" width="164" height="44" fill="#B71C1C"/>${[[-55, '#FFB300'], [-18, '#F48FB1'], [18, '#66BB6A'], [55, '#FF7043']].map(([dx, c]) => `<circle cx="${dx}" cy="-30" r="15" fill="${c}"/>`).join('')}`)}
${T(400, 248, `<ellipse cx="0" cy="-4" rx="50" ry="10" fill="#fff"/>${A('pop', `<rect x="-30" y="-36" width="60" height="30" rx="12" fill="#FFF"/><ellipse cx="0" cy="-36" rx="24" ry="10" fill="#FFF8E1"/>`)}`)}${steam(384, 196, 3, 16)}
${boy({ x: 520, y: 344, s: 1.1, eye: 'wide', m: 'open', arms: 'up', cls: 'bob2' })}
${T(520, 150, A('bob', `<rect x="-26" y="-36" width="52" height="72" rx="4" fill="#fff" stroke="#E53935" stroke-width="4"/><rect x="-10" y="-22" width="20" height="44" fill="#E53935"/><text x="0" y="-44" font-size="14" text-anchor="middle" fill="#E53935">お年玉</text>`))}
${grandpa({ x: 90, y: 344, s: 1.1, eye: 'happy', arms: 'wave', cls: 'bob' })}
${label(200, 150, 'おせち料理', '#E53935', '#fff')}${label(400, 170, 'もち', '#fff', '#333')}${star(590, 90, 10)}${star(460, 110, 8, '#FFB300', 'twinkle d2')}`);
S['n5-r02-3'] = full(`${outdoor('#BBDEFB', '#ECEFF1', 280)}${sun(560, 60, 24)}${cloud(120, 60, 1, 'float')}
${T(320, 280, `<rect x="-110" y="-150" width="18" height="150" fill="#E53935"/><rect x="92" y="-150" width="18" height="150" fill="#E53935"/><rect x="-140" y="-170" width="280" height="20" rx="6" fill="#C62828"/><rect x="-120" y="-130" width="240" height="14" fill="#E53935"/>`)}
${T(320, 280, `<rect x="-50" y="-70" width="100" height="70" fill="#D7A86E"/><path d="M-70 -66l70-34 70 34z" fill="#5D4037"/><rect x="-22" y="-20" width="44" height="20" fill="#8D6E63"/>`, 0.8)}
${dad({ x: 150, y: 346, s: 1.05, eye: 'closed', arms: 'hold', cls: 'bob' })}${mom({ x: 500, y: 346, s: 1.05, eye: 'closed', arms: 'hold', cls: 'bob d1' })}${me({ x: 330, y: 352, s: 1.1, eye: "closed", m: "o", arms: "hold", cls: "bob d2" })}
${bubble({ x: 96, y: 150, text: 'さむい〜', size: 20, tail: 1 })}
${T(260, 250, A('up', `<ellipse rx="10" ry="6" fill="#fff" opacity=".8"/>`))}${T(160, 240, A('up d2', `<ellipse rx="10" ry="6" fill="#fff" opacity=".8"/>`))}
${snow(10)}${T(420, 300, A('shake', `<path d="M0 -40v40M-8 -40h16" stroke="#8D6E63" stroke-width="5"/><circle cy="-48" r="9" fill="#FFB300"/>`))}`, '#BBDEFB');

// ── r03 土曜日の買い物 ──
S['n5-r03-1'] = full(`${outdoor('#B3E5FC', '#CFD8DC', 280)}${sun(70, 60, 22)}${cloud(480, 50, 1, 'float')}
<rect x="170" y="70" width="420" height="210" fill="#FFF8E1"/><rect x="170" y="70" width="420" height="50" fill="#43A047"/><text x="380" y="106" font-size="30" text-anchor="middle" fill="#fff">スーパー</text>
<rect x="330" y="180" width="100" height="100" fill="#B3E5FC"/><rect x="378" y="180" width="4" height="100" fill="#fff"/>
${[200, 260, 450, 510].map((x, i) => `<rect x="${x}" y="150" width="50" height="60" fill="#fff"/><circle cx="${x + 14}" cy="180" r="8" fill="${['#E53935', '#FB8C00', '#66BB6A', '#FDD835'][i]}"/><circle cx="${x + 34}" cy="186" r="8" fill="${['#FB8C00', '#66BB6A', '#E53935', '#E53935'][i]}"/>`).join('')}
${A('scrollL', [600, 760].map((x, i) => person({ x, y: 340, s: 0.7, hair: '#263238', top: ['#90A4AE', '#FFB74D'][i], bottom: '#455A64', long: i === 1, walk: true, flip: true })).join(''))}
${mom({ x: 120, y: 346, s: 1.1, eye: 'happy', walk: true, cls: 'bob2' })}${me({ x: 230, y: 348, s: 1.05, eye: 'happy', m: 'open', arms: 'wave', walk: true, cls: 'bob2' })}
${label(70, 130, 'どようび', '#EF5350', '#fff')}${note(280, 190)}`, '#B3E5FC');
S['n5-r03-2'] = full(`${room('#FFFDE7', '#ECEFF1', 276)}
${[[40, '#E53935', 'トマト'], [200, '#FFE0B2', 'たまねぎ']].map(([x, c, t]) => `<rect x="${x}" y="110" width="140" height="130" rx="8" fill="#fff" stroke="#CFD8DC" stroke-width="4"/>${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${x + 30 + (i % 3) * 40}" cy="${150 + Math.floor(i / 3) * 44}" r="16" fill="${c}"/>`).join('')}${label(x + 70, 96, t, '#43A047', '#fff', 15)}`).join('')}
<rect x="440" y="110" width="170" height="130" rx="8" fill="#fff" stroke="#CFD8DC" stroke-width="4"/>${[0, 1, 2, 3, 4, 5].map((i) => apple(474 + (i % 3) * 50, 160 + Math.floor(i / 3) * 46, 1.1)).join('')}
${T(560, 70, A('pop', `<rect x="-58" y="-24" width="116" height="44" rx="8" fill="#FDD835"/><text y="8" font-size="24" text-anchor="middle" fill="#C62828">1000円</text>`))}
${mom({ x: 300, y: 350, s: 1.2, eye: 'happy', arms: 'hold', cls: 'bob' })}
${T(300, 300, A('bob', `<path d="M-40 -30h80l-10 44h-60z" fill="#42A5F5" opacity=".9"/><circle cx="-14" cy="-36" r="12" fill="#E53935"/><circle cx="12" cy="-38" r="12" fill="#FFE0B2"/><rect x="-6" y="-52" width="30" height="14" rx="4" fill="#EF9A9A"/>`))}
${me({ x: 470, y: 350, s: 1.05, eye: 'wide', m: 'o', arms: 'up', cls: 'bob2' })}${bubble({ x: 420, y: 60, text: 'たかい!', size: 22, tail: 1 })}`);
S['n5-r03-3'] = full(`${room('#FFF3E0', '#E8B77A')}${win(40, 30, 120, 90, '#1A237E', nightStars(4, 60).replace(/translate\((\d+)/g, (m, n) => `translate(${40 + (n % 110)}`))}
<rect x="330" y="150" width="290" height="112" fill="#ECEFF1"/><rect x="330" y="150" width="290" height="14" fill="#B0BEC5"/>
${T(470, 150, `${A('bob2', `<path d="M-60 -56h120v46q0 10-10 10h-100q-10 0-10-10z" fill="#E53935"/><rect x="-74" y="-50" width="16" height="10" rx="5" fill="#B71C1C"/><rect x="58" y="-50" width="16" height="10" rx="5" fill="#B71C1C"/><ellipse cx="0" cy="-56" rx="60" ry="12" fill="#8D4E2A"/><circle cx="-24" cy="-58" r="7" fill="#FB8C00"/><circle cx="10" cy="-56" r="7" fill="#FFE0B2"/><circle cx="32" cy="-60" r="6" fill="#A1672E"/>`)}`)}${steam(436, 70, 4, 22)}
${mom({ x: 560, y: 352, s: 1.15, eye: 'happy', arms: 'hold', cls: 'bob' })}${me({ x: 360, y: 352, s: 1.15, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob d1' })}
${bubble({ x: 240, y: 110, text: 'おいしい!', size: 22, tail: 1 })}${label(470, 40, 'カレー', '#FB8C00', '#fff')}
${T(110, 250, `<rect x="-70" y="-56" width="140" height="56" rx="10" fill="#fff"/><text y="-34" font-size="15" text-anchor="middle" fill="#666">ぜんぶで</text><text y="-10" font-size="22" text-anchor="middle" fill="#E53935">3000円</text>`)}${note(300, 200)}${hearts(600, 120)}`);

// ── r04 四つの季節 ──
const quad = (x, y, bg, inner, t, tc) => `<svg x="${x}" y="${y}" width="304" height="164" viewBox="0 0 304 164"><rect width="304" height="164" rx="16" fill="${bg}"/>${inner}${label(52, 28, t, '#fff', tc, 17)}</svg>`;
const petals = (c, n = 8) => Array.from({ length: n }, (_, i) => `<ellipse class="fall" style="animation-delay:-${(i * 0.27) % 2}s" cx="${20 + i * 36}" cy="${-10 - (i % 3) * 6}" rx="5" ry="3.5" fill="${c}"/>`).join('');
S['n5-r04-1'] = full(
  quad(10, 10, '#FCE4EC', `${tree(230, 150, 0.9, '#F48FB1', 'sway')}${petals('#F06292')}${me({ x: 110, y: 160, s: 0.7, eye: 'happy' })}`, 'はる', '#EC407A') +
  quad(326, 10, '#B3E5FC', `${sun(250, 44, 20)}<rect y="120" width="304" height="44" fill="#4FC3F7"/>${A('float', `<path d="M0 124q19-12 38 0t38 0 38 0 38 0 38 0 38 0 38 0 38 0v10h-304z" fill="#fff" opacity=".7"/>`)}${boy({ x: 120, y: 160, s: 0.7, eye: 'happy', m: 'open', arms: 'up', cls: 'bob2' })}`, 'なつ', '#039BE5') +
  quad(10, 186, '#FFE0B2', `${tree(230, 150, 0.9, '#FF7043', 'sway')}${tree(40, 156, 0.6, '#FFB300', 'sway d2')}${petals('#E64A19', 6)}${girl2({ x: 130, y: 160, s: 0.7, eye: 'happy' })}`, 'あき', '#E64A19') +
  quad(326, 186, '#E3F2FD', `<rect y="130" width="304" height="34" fill="#fff"/>${T(230, 132, `<circle r="26" cy="-22" fill="#fff" stroke="#CFD8DC" stroke-width="2"/><circle r="17" cy="-60" fill="#fff" stroke="#CFD8DC" stroke-width="2"/><circle cx="-6" cy="-63" r="2.5" fill="#333"/><circle cx="6" cy="-63" r="2.5" fill="#333"/><path d="M0 -58l12 3-12 3z" fill="#FB8C00"/>`)}${snow(12)}${friend({ x: 110, y: 160, s: 0.7, eye: 'happy', arms: 'wave' })}`, 'ふゆ', '#1E88E5'), '#FFF8E7');
S['n5-r04-2'] = full(`<rect width="320" height="360" fill="#FCE4EC"/><rect x="320" width="320" height="360" fill="#81D4FA"/>
<rect y="290" width="320" height="70" fill="#C5E1A5"/>${tree(80, 300, 1.5, '#F48FB1', 'sway')}${tree(260, 296, 1.1, '#F8BBD0', 'sway d2')}${petals('#F06292', 9)}
${me({ x: 180, y: 346, s: 1.05, eye: 'happy', m: 'open', arms: 'up', cls: 'bob' })}${label(70, 36, '3月・4月', '#EC407A', '#fff')}${bubble({ x: 220, y: 130, text: 'きれい!', size: 20, tail: -1 })}
${sun(560, 70, 30)}<rect x="320" y="250" width="320" height="110" fill="#29B6F6"/>${A('float', `<path d="M320 252q20-14 40 0t40 0 40 0 40 0 40 0 40 0 40 0 40 0v14h-320z" fill="#fff" opacity=".8"/>`)}<path d="M320 310q160-40 320 0v50h-320z" fill="#FFE082"/>
${T(590, 300, `<rect x="-3" y="-80" width="6" height="80" fill="#8D6E63"/>${A('sway', `<path d="M-50 -80q50-50 100 0z" fill="#EF5350"/><path d="M-16 -80q16-50 32 0z" fill="#fff"/>`)}`)}
${boy({ x: 430, y: 340, s: 1.05, eye: 'happy', m: 'open', arms: 'up', cls: 'bob2' })}${bubble({ x: 420, y: 120, text: 'あつい〜', size: 20, tail: -1 })}${T(500, 190, A('up', `<path d="M0 0q-8 12 0 16 8-4 0-16z" fill="#4FC3F7"/>`))}
<rect x="316" width="8" height="360" fill="#fff"/>`);
S['n5-r04-3'] = full(`<rect width="320" height="360" fill="#FFE0B2"/><rect x="320" width="320" height="360" fill="#CFD8DC"/>
<rect y="290" width="320" height="70" fill="#D7A86E"/>${tree(70, 300, 1.5, '#FF7043', 'sway')}${tree(250, 296, 1.2, '#FFB300', 'sway d2')}${petals('#E64A19', 9)}
${girl2({ x: 170, y: 346, s: 1.05, eye: 'happy', arms: 'wave', cls: 'bob' })}${label(60, 36, 'すずしい', '#E64A19', '#fff')}
<svg x="320" y="0" width="320" height="360" viewBox="0 0 320 360"><rect y="280" width="320" height="80" fill="#fff"/>${house(80, 290, 1, '#B0BEC5', '#fff')}${house(250, 286, 0.8, '#B0BEC5', '#fff')}${snow(22)}${friend({ x: 170, y: 346, s: 1.05, eye: 'closed', m: 'o', arms: 'hold', cls: 'bob2' })}${label(250, 36, 'さむい', '#1E88E5', '#fff')}</svg>
<rect x="316" width="8" height="360" fill="#fff"/>`);
S['n5-r04-4'] = full(`${room('#FFE0B2', '#C98B4E', 276)}${win(40, 30, 150, 110, '#FFCC80', tree(115, 150, 0.8, '#FF7043', 'sway') + petals('#E64A19', 3))}
${table(170, 250, 440)}
${T(300, 250, `<ellipse rx="56" ry="10" fill="#fff"/>${A('bob2', `<ellipse cx="0" cy="-16" rx="40" ry="16" fill="#8E24AA"/><path d="M-30 -22q30-16 60 0" stroke="#F3E5F5" stroke-width="4" fill="none"/>`)}`)}${steam(284, 206, 3, 16)}
${bowl(430, 248, 'rice', 1.2)}${T(430, 200, `${[-12, 4, 18].map((dx) => `<ellipse cx="${dx}" cy="0" rx="9" ry="6" fill="#FFB300"/>`).join('')}`)}
${T(540, 248, `<ellipse rx="40" ry="8" fill="#fff"/><circle cx="-10" cy="-14" r="14" fill="#FB8C00"/><circle cx="14" cy="-12" r="12" fill="#FB8C00"/><rect x="-12" y="-32" width="4" height="8" fill="#5D4037"/>`)}
${me({ x: 110, y: 352, s: 1.25, eye: 'happy', m: 'open', arms: 'up', cls: 'bob' })}${bubble({ x: 250, y: 110, text: 'あきがいちばん!', size: 20, tail: -1 })}${hearts(40, 190)}${star(600, 60, 10, '#FF7043')}`);

// ── r05 日本の電車 ──
S['n5-r05-1'] = full(`${outdoor('#B3E5FC', '#B0BEC5', 300)}${cloud(100, 50, 1, 'float')}${sun(580, 50, 20)}
${[[30, 150, '#90A4AE'], [130, 190, '#B0BEC5'], [240, 130, '#78909C'], [360, 170, '#90A4AE'], [470, 120, '#B0BEC5'], [570, 180, '#78909C']].map(([x, h, c]) => `<rect x="${x}" y="${300 - h}" width="70" height="${h}" fill="${c}"/>${Array.from({ length: Math.floor(h / 30) }, (_, i) => `<rect x="${x + 12}" y="${300 - h + 12 + i * 28}" width="16" height="14" fill="#E3F2FD"/><rect x="${x + 42}" y="${300 - h + 12 + i * 28}" width="16" height="14" fill="#E3F2FD"/>`).join('')}`).join('')}
<rect y="232" width="640" height="14" fill="#78909C"/>${[40, 200, 360, 520].map((x) => `<rect x="${x}" y="246" width="16" height="60" fill="#90A4AE"/>`).join('')}
${A('drift', trainSide(820, 230, 1.1, '#66BB6A') + trainSide(1160, 230, 1.1, '#66BB6A'))}
<rect y="300" width="640" height="60" fill="#CFD8DC"/>
${A('scrollL', [660, 780].map((x, i) => person({ x, y: 352, s: 0.75, hair: '#263238', top: ['#546E7A', '#EC407A'][i], bottom: '#37474F', long: i === 1, walk: true, flip: true })).join(''))}
${dad({ x: 110, y: 352, s: 0.9, walk: true, cls: 'bob2' })}${boy({ x: 220, y: 352, s: 0.8, eye: 'happy', walk: true, cls: 'bob2' })}
${label(80, 30, 'とうきょう', '#fff', '#333')}`, '#B3E5FC');
S['n5-r05-2'] = full(`<rect width="640" height="360" fill="#E8EAF6"/><rect x="20" y="24" width="600" height="96" rx="12" fill="#B3E5FC" stroke="#90A4AE" stroke-width="6"/>
<clipPath id="tw"><rect x="23" y="27" width="594" height="90" rx="9"/></clipPath><g clip-path="url(#tw)">${A('scrollFast', [0, 120, 240, 360, 480, 600, 720].map((x, i) => `<rect x="${x + 20}" y="${i % 2 ? 60 : 44}" width="60" height="80" fill="#9FA8DA"/>`).join(''))}</g>
${[100, 220, 340, 460, 560].map((x, i) => A(`sway d${i % 4}`, `<rect x="${x}" y="0" width="5" height="40" fill="#90A4AE"/><circle cx="${x + 2}" cy="52" r="12" fill="none" stroke="#fff" stroke-width="6"/>`)).join('')}
${[[60, '#546E7A', false], [170, '#EC407A', true], [280, '#26A69A', false], [390, '#FFB74D', true], [500, '#7E57C2', false], [600, '#42A5F5', true]].map(([x, c, l], i) => person({ x, y: 356, s: 1.05, hair: ['#263238', '#5D4037', '#424242'][i % 3], top: c, bottom: '#37474F', long: l, eye: i % 2 ? 'closed' : 'open', m: 'smile', cls: `bob2 d${i % 4}` })).join('')}
${me({ x: 330, y: 360, s: 1.2, eye: 'open', arms: 'hold', cls: 'bob2' })}
${T(110, 150, A('pop', `<circle r="34" fill="#fff" stroke="#333" stroke-width="3"/><text y="10" font-size="17" text-anchor="middle" fill="#3949AB">しーっ</text>`))}
${T(540, 150, `<circle r="30" fill="#fff" stroke="#E53935" stroke-width="6"/><rect x="-9" y="-16" width="18" height="32" rx="4" fill="#455A64"/><path d="M-20 -20l40 40" stroke="#E53935" stroke-width="6"/>`)}`, '#E8EAF6');
S['n5-r05-3'] = full(`<rect width="640" height="360" fill="#ECEFF1"/><rect y="290" width="640" height="70" fill="#B0BEC5"/><rect y="290" width="640" height="10" fill="#FDD835"/>
<rect x="20" y="20" width="250" height="110" rx="10" fill="#263238"/><text x="145" y="56" font-size="20" text-anchor="middle" fill="#FFB300">9:00 とうきょう</text>${A('glow', `<text x="145" y="100" font-size="26" text-anchor="middle" fill="#EF5350">おくれています</text>`)}
<rect x="330" y="80" width="290" height="210" fill="#FFF8E1"/><rect x="330" y="80" width="290" height="44" fill="#FB8C00"/><text x="475" y="110" font-size="24" text-anchor="middle" fill="#fff">ショップ・レストラン</text>
${T(400, 290, `<rect x="-50" y="-120" width="100" height="120" fill="#fff"/><circle cx="-20" cy="-80" r="12" fill="#FFB300"/><circle cx="16" cy="-80" r="12" fill="#EF5350"/><rect x="-30" y="-50" width="60" height="16" rx="6" fill="#A1672E"/>`)}${T(550, 290, `<rect x="-50" y="-120" width="100" height="120" fill="#fff"/>${bowl(0, -30, 'soup', 1)}`)}${steam(536, 200, 3, 14)}
<clipPath id="rw"><rect x="0" y="130" width="300" height="160"/></clipPath><g clip-path="url(#rw)"><rect y="130" width="300" height="160" fill="#90A4AE" opacity=".4"/>${rain(22)}</g>
${me({ x: 160, y: 350, s: 1.15, eye: 'open', m: 'o', cls: 'bob' })}${bubble({ x: 250, y: 190, text: 'べんり!', size: 20, tail: -1 })}${mark(96, 190, '?', '#3949AB')}`, '#ECEFF1');

// ── r06 夜の空の月 ──
S['n5-r06-1'] = full(`<rect width="640" height="360" fill="#1A237E"/>${nightStars(16, 200)}
${[[90, 0.3], [220, 0.6], [350, 0.85], [500, 1]].map(([x, ph], i) => T(x, 90, A(`bob d${i}`, moon(0, 0, 34 + i * 4, ph))).replace('class="glow"', 'class="glow"')).join('')}
<path d="M40 150h470" stroke="#9FA8DA" stroke-width="4" stroke-dasharray="6 10"/><path d="M500 140l20 10-20 10z" fill="#9FA8DA"/>
<path d="M0 300q160-50 320 0t320 0v60h-640z" fill="#283593"/>${house(520, 316, 0.9, '#3949AB', '#5C6BC0', true)}
${me({ x: 200, y: 350, s: 1.15, eye: 'wide', m: 'open', arms: 'wave', cls: 'bob' })}${boy({ x: 330, y: 350, s: 0.95, eye: 'wide', m: 'o', cls: 'bob d1' })}
${bubble({ x: 110, y: 220, text: 'まるい!', size: 20, tail: 1 })}`, '#1A237E');
S['n5-r06-2'] = full(`<rect width="640" height="360" fill="#0D1B4C"/>${nightStars(12, 340)}
${T(110, 180, `${A('spinSlow', Array.from({ length: 12 }, (_, i) => `<rect x="-5" y="-110" width="10" height="26" rx="5" fill="#FFB300" transform="rotate(${i * 30})"/>`).join(''))}<circle r="70" fill="#FFC107"/><circle r="56" fill="#FFD54F"/><path d="M-22 -8q8-10 16 0M8 -8q8-10 16 0" stroke="#E65100" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M-18 16q18 16 36 0" stroke="#E65100" stroke-width="4" fill="none" stroke-linecap="round"/>`)}
${[0, 1, 2].map((i) => A(`glow d${i}`, `<path d="M190 ${150 + i * 30}L430 ${150 + i * 30}" stroke="#FFF59D" stroke-width="6" stroke-dasharray="14 12" stroke-linecap="round"/>`)).join('')}<path d="M424 166l26 14-26 14z" fill="#FFF59D"/>
${T(520, 180, `<circle r="74" fill="#FFF59D" class="glow"/><circle r="60" fill="#CFD8DC"/><path d="M0 -60a60 60 0 0 0 0 120z" fill="#FFF176"/><circle cx="-24" cy="-14" r="10" fill="#FDD835"/><circle cx="-10" cy="24" r="8" fill="#FDD835"/><circle cx="26" cy="-8" r="9" fill="#B0BEC5"/>`)}
${label(110, 300, 'たいよう', '#FFB300', '#fff')}${label(520, 300, 'つき', '#FFF176', '#333')}${label(320, 110, 'ひかり', 'rgba(255,255,255,.2)', '#FFF59D')}`, '#0D1B4C');
S['n5-r06-3'] = full(`<rect width="640" height="360" fill="#0D1B4C"/>${nightStars(14, 340)}
${T(120, 250, `<circle r="90" fill="#42A5F5"/><path d="M-60 -40q30-30 60-10t10 40-50 20-20-50zM20 30q30-10 40 20t-30 30-10-50z" fill="#66BB6A"/>${A('float', `<ellipse cx="-20" cy="-70" rx="30" ry="8" fill="#fff" opacity=".8"/>`)}`)}
${T(500, 110, `<circle r="64" fill="#CFD8DC"/><circle cx="-24" cy="-16" r="12" fill="#B0BEC5"/><circle cx="20" cy="18" r="16" fill="#B0BEC5"/><circle cx="18" cy="-30" r="7" fill="#B0BEC5"/>`)}
<path d="M210 220q120-110 230-100" fill="none" stroke="#9FA8DA" stroke-width="4" stroke-dasharray="6 10"/>
${T(330, 140, A('bob', `<g transform="rotate(50)"><path d="M0 -40q18 20 18 50h-36q0-30 18-50z" fill="#ECEFF1"/><circle cy="-6" r="8" fill="#42A5F5"/><path d="M-18 6l-12 18h12zM18 6l12 18h-12z" fill="#EF5350"/>${A('glow', `<path d="M-10 12q10 30 20 0z" fill="#FFB300"/>`)}</g>`))}
${T(560, 240, `<circle r="26" fill="#fff" stroke="#E53935" stroke-width="5"/><path d="M0 -14q-10 14 0 22 10-8 0-22z" fill="#42A5F5"/><path d="M-18 -18l36 36" stroke="#E53935" stroke-width="5"/>`)}${label(560, 290, 'みず ×', 'rgba(255,255,255,.15)', '#fff', 15)}
${me({ x: 290, y: 356, s: 1.0, eye: 'happy', m: 'open', arms: 'up', cls: 'bob' })}${bubble({ x: 420, y: 250, text: 'いきたい!', size: 20, tail: -1 })}`, '#0D1B4C');
export default S;
