import { full, T, A, room, outdoor, win, table, tree, house, label, mark, snow, rain, cake, bowl, fridge, cat, dog, umbrella, hearts,
  me, mom, dad, boy, girl2, grandpa, friend, teacher, person, bubble, steam, star, note, sun, cloud, bird } from './lib.mjs';
const S = {};
const sticks = (x, y, s = 1, rot = -30) => T(x, y, `<g transform="rotate(${rot})"><rect x="-4" y="-70" width="5" height="70" rx="2" fill="#8D6E63"/><rect x="5" y="-70" width="5" height="70" rx="2" fill="#A1887F"/></g>`, s);
const no = (x, y, r = 46) => T(x, y, `<circle r="${r}" fill="none" stroke="#E53935" stroke-width="8"/><path d="M${-r * 0.7} ${-r * 0.7}L${r * 0.7} ${r * 0.7}" stroke="#E53935" stroke-width="8"/>`);
const ok = (x, y, r = 30) => T(x, y, A('pop', `<circle r="${r}" fill="none" stroke="#43A047" stroke-width="8"/>`));
const pond = (x, y, w = 200, h = 40) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="#4FC3F7"/>${A('float', `<ellipse cx="${x - w * 0.3}" cy="${y - 6}" rx="${w * 0.2}" ry="4" fill="#fff" opacity=".6"/><ellipse cx="${x + w * 0.35}" cy="${y + 10}" rx="${w * 0.18}" ry="4" fill="#fff" opacity=".6"/>`)}`;
const duck = (x, y, s = 1, c = '#fff') => T(x, y, A('bob', `<ellipse rx="22" ry="13" fill="${c}"/><circle cx="18" cy="-16" r="10" fill="${c}"/><path d="M26 -17l12 3-12 4z" fill="#FB8C00"/><circle cx="20" cy="-18" r="2" fill="#333"/>`), s);
const book = (x, y, c = '#EF5350', s = 1) => T(x, y, `<rect x="-14" y="-20" width="28" height="40" rx="3" fill="${c}"/><rect x="-10" y="-14" width="20" height="5" fill="#fff" opacity=".8"/>`, s);
const shelf = (x, y, w = 180, rows = 3) => `<rect x="${x}" y="${y}" width="${w}" height="${rows * 54 + 8}" fill="#A1672E"/>${Array.from({ length: rows }, (_, r) => `<rect x="${x + 8}" y="${y + 8 + r * 54}" width="${w - 16}" height="46" fill="#5D4037"/>${Array.from({ length: Math.floor((w - 24) / 16) }, (_, i) => `<rect x="${x + 12 + i * 16}" y="${y + 12 + r * 54 + ((i * 7 + r * 3) % 4) * 2}" width="12" height="${42 - ((i * 7 + r * 3) % 4) * 2}" fill="${['#EF5350', '#42A5F5', '#66BB6A', '#FFB300', '#AB47BC', '#26A69A'][(i + r * 2) % 6]}"/>`).join('')}`).join('')}`;
const foot = (x, y, r = 0) => `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="6" ry="10" fill="#90A4AE"/><ellipse cy="-14" rx="5" ry="4" fill="#90A4AE"/></g>`;

// ── r07 はしの使い方 ──
S['n5-r07-1'] = full(`${room('#FFF3E0', '#D7A86E')}${table(120, 250, 400)}
${bowl(250, 248, 'rice', 1.5)}${steam(232, 170, 3, 18)}${bowl(400, 248, 'miso', 1.2)}
${T(330, 140, A('bob', `<g transform="rotate(-25)"><rect x="-8" y="-80" width="8" height="150" rx="3" fill="#8D6E63"/><rect x="8" y="-80" width="8" height="150" rx="3" fill="#A1887F"/></g>`))}
${me({ x: 90, y: 350, s: 1.15, eye: 'happy', m: 'munch', arms: 'hold', cls: 'bob' })}${dad({ x: 560, y: 350, s: 1.15, eye: 'happy', m: 'munch', cls: 'bob d2' })}
${label(330, 40, 'はし = 二本', '#8D6E63', '#fff')}${star(470, 90, 10)}${star(200, 100, 8, '#FFB300', 'twinkle d2')}`);
S['n5-r07-2'] = full(`${room('#E8F5E9', '#D7A86E')}${table(60, 250, 300)}${bowl(210, 248, 'rice', 1.2)}
${boy({ x: 130, y: 346, s: 0.9, eye: 'wide', m: 'o', arms: 'hold', cls: 'shake' })}${T(170, 200, A('shake', `<g transform="rotate(40)"><rect x="-3" y="-34" width="4" height="60" fill="#8D6E63"/></g><g transform="rotate(-50)"><rect x="-3" y="-34" width="4" height="60" fill="#A1887F"/></g>`))}
${mom({ x: 290, y: 350, s: 1.1, eye: 'happy', arms: 'wave', cls: 'bob' })}${label(110, 40, 'むずかしい…', '#90A4AE', '#fff')}
<path d="M360 180h60" stroke="#FB8C00" stroke-width="8" stroke-dasharray="4 12" stroke-linecap="round"/><path d="M420 164l28 16-28 16z" fill="#FB8C00"/>
${boy({ x: 540, y: 350, s: 1.2, eye: 'happy', m: 'open', arms: 'up', cls: 'bob2' })}${sticks(600, 170, 1, -20)}${label(530, 40, 'じょうず!', '#43A047', '#fff')}${star(460, 110, 12)}${star(610, 90, 9, '#FFB300', 'twinkle d2')}`, '#E8F5E9');
S['n5-r07-3'] = full(`<rect width="640" height="360" fill="#FFF8E7"/><rect x="316" width="8" height="360" fill="#fff"/><rect y="280" width="640" height="80" fill="#F0DDBB"/>
${bowl(160, 270, 'rice', 2)}${T(160, 190, A('shake', `<rect x="-12" y="-80" width="7" height="90" rx="3" fill="#8D6E63"/><rect x="6" y="-80" width="7" height="90" rx="3" fill="#A1887F"/>`))}${no(160, 190, 76)}
${me({ x: 420, y: 350, s: 1.05, eye: 'open', m: 'open', arms: 'wave' })}${friend({ x: 580, y: 350, s: 1.05, eye: 'wide', m: 'o', cls: 'shake' })}
${T(490, 200, A('shake', `<g transform="rotate(75)"><rect x="-8" y="-50" width="6" height="80" rx="3" fill="#8D6E63"/><rect x="4" y="-50" width="6" height="80" rx="3" fill="#A1887F"/></g>`))}${no(490, 200, 62)}
${label(160, 36, 'ルール', '#E53935', '#fff')}${label(480, 36, 'ルール', '#E53935', '#fff')}`);
S['n5-r07-4'] = full(`${room('#E3F2FD', '#D7A86E')}${table(140, 250, 360)}${bowl(240, 248, 'rice', 1.2)}${bowl(400, 248, 'rice', 1.2)}
${me({ x: 90, y: 350, s: 1.15, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob' })}
${person({ x: 550, y: 350, s: 1.2, hair: '#F2C14E', top: '#5C6BC0', bottom: '#455A64', eye: 'happy', m: 'open', arms: 'up', cls: 'bob2' })}${sticks(610, 170, 1, -20)}
${bubble({ x: 200, y: 110, text: 'こう もつよ', size: 20, tail: 1 })}${bubble({ x: 440, y: 90, text: 'できた!', size: 22, tail: -1 })}${star(330, 60, 12)}${star(600, 60, 9, '#FFB300', 'twinkle d2')}${hearts(320, 180)}`);

// ── r08 公園の鳥 ──
S['n5-r08-1'] = full(`${outdoor('#B3E5FC', '#A5D6A7', 230)}${sun(570, 56, 22)}${cloud(140, 50, 1, 'float')}${cloud(380, 80, 0.7, 'float d2')}
${tree(70, 250, 1.4, '#43A047', 'sway')}${tree(190, 240, 1.0, '#66BB6A', 'sway d1')}${tree(560, 250, 1.3, '#43A047', 'sway d2')}${tree(470, 236, 0.9, '#81C784', 'sway d3')}
${pond(330, 300, 190, 40)}${house(330, 226, 0.7)}
${T(110, 330, `<rect x="-3" y="-60" width="6" height="60" fill="#8D6E63"/><rect x="-44" y="-84" width="88" height="34" rx="6" fill="#fff" stroke="#8D6E63" stroke-width="4"/><text y="-60" font-size="18" text-anchor="middle" fill="#2E7D32">こうえん</text>`)}
${bird(260, 110)}${bird(440, 140, 'fly d2')}`, '#B3E5FC');
S['n5-r08-2'] = full(`${outdoor('#FFE0B2', '#A5D6A7', 250)}${sun(80, 70, 26)}${tree(560, 262, 1.7, '#43A047', 'sway')}
${T(520, 130, A('peck', `<ellipse rx="12" ry="9" fill="#FFB300"/><circle cx="10" cy="-8" r="6" fill="#FFB300"/><path d="M15 -8l8 2-8 3z" fill="#E65100"/>`))}${T(600, 160, A('peck d2', `<ellipse rx="12" ry="9" fill="#EF5350"/><circle cx="-10" cy="-8" r="6" fill="#EF5350"/><path d="M-15 -8l-8 2 8 3z" fill="#E65100"/>`))}
${note(480, 110)}${note(630, 120, 'rise d2', '#1E88E5')}${note(560, 70, 'rise d3', '#43A047')}
${pond(330, 320, 150, 28)}${duck(300, 310, 1)}${duck(380, 322, 0.8)}
${me({ x: 110, y: 350, s: 1.05, eye: 'happy', walk: true, cls: 'bob2' })}${dog(200, 350, 1)}<path d="M140 280q30 30 50 44" stroke="#E53935" stroke-width="3" fill="none"/>`, '#FFE0B2');
S['n5-r08-3'] = full(`${outdoor('#B3E5FC', '#A5D6A7', 230)}${tree(600, 240, 1.2, '#43A047', 'sway')}${pond(400, 300, 230, 56)}
${T(420, 290, `<rect x="-5" y="-40" width="5" height="50" fill="#FB8C00"/><rect x="8" y="-40" width="5" height="50" fill="#FB8C00"/><ellipse cy="-70" rx="46" ry="34" fill="#ECEFF1"/><path d="M-40 -70q-30 10-36 30 30 0 46-14z" fill="#B0BEC5"/>${A('peck', `<path d="M30 -90q20-50 10-80" stroke="#ECEFF1" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="40" cy="-172" r="15" fill="#ECEFF1"/><circle cx="46" cy="-176" r="3" fill="#333"/><path d="M52 -170l44 6-44 8z" fill="#FFB300"/><g transform="translate(100 -160)"><ellipse rx="14" ry="6" fill="#42A5F5"/><path d="M12 0l10-7v14z" fill="#42A5F5"/></g>`)}`)}
${me({ x: 110, y: 350, s: 1.15, eye: 'wide', m: 'o', arms: 'hold', cls: 'bob' })}${T(160, 250, `<rect x="-22" y="-15" width="44" height="30" rx="5" fill="#455A64"/><circle r="9" fill="#90CAF9"/>${A('glow', `<path d="M24 -24l14-10M30 -6h18M24 12l14 10" stroke="#FFD54F" stroke-width="4" stroke-linecap="round"/>`)}`)}
${mark(60, 150, '!')}${bubble({ x: 210, y: 80, text: 'おおきい!', size: 22, tail: 1 })}`, '#B3E5FC');

// ── r09 新しい図書館 ──
S['n5-r09-1'] = full(`${outdoor('#B3E5FC', '#CFD8DC', 280)}${sun(580, 50, 20)}${cloud(100, 50, 1, 'float')}
<rect x="250" y="80" width="340" height="200" fill="#FFF8E1"/><rect x="230" y="64" width="380" height="30" rx="6" fill="#5C6BC0"/><text x="420" y="130" font-size="28" text-anchor="middle" fill="#3949AB">としょかん</text>
${[280, 350, 500, 550].map((x) => `<rect x="${x}" y="150" width="40" height="60" fill="#B3E5FC"/>`).join('')}<rect x="395" y="190" width="50" height="90" fill="#8D6E63"/>
${T(80, 280, `<rect x="-50" y="-70" width="100" height="70" fill="#ECEFF1"/><rect x="-60" y="-86" width="120" height="20" fill="#EF5350"/><text y="-36" font-size="20" text-anchor="middle" fill="#333">えき</text>`)}
<path d="M140 320h90" stroke="#FB8C00" stroke-width="6" stroke-dasharray="4 12" stroke-linecap="round"/>${label(186, 300, '5分', '#FB8C00', '#fff', 16)}
${me({ x: 300, y: 352, s: 0.95, eye: 'happy', walk: true, cls: 'bob2' })}${T(600, 110, A('pop', `<circle r="30" fill="#FDD835"/><text y="8" font-size="20" text-anchor="middle" fill="#C62828">NEW</text>`))}${star(230, 40, 10)}${star(480, 40, 9, '#FFB300', 'twinkle d2')}`, '#B3E5FC');
S['n5-r09-2'] = full(`${room('#FFF8E1', '#D7A86E', 280)}${shelf(20, 60, 200, 4)}${shelf(240, 60, 150, 4)}
<rect x="430" y="60" width="190" height="220" rx="14" fill="#FCE4EC"/>${label(525, 84, 'こどものへや', '#EC407A', '#fff', 15)}${boy({ x: 480, y: 276, s: 0.6, eye: 'happy' })}${girl2({ x: 570, y: 276, s: 0.6, eye: 'happy', cls: 'bob' })}${book(525, 230, '#42A5F5', 0.9)}
${me({ x: 320, y: 354, s: 1.1, eye: 'happy', arms: 'hold', cls: 'bob' })}
${T(320, 290, A('bob', [0, 1, 2, 3, 4].map((i) => `<rect x="-34" y="${-i * 11}" width="68" height="10" rx="2" fill="${['#EF5350', '#42A5F5', '#66BB6A', '#FFB300', '#AB47BC'][i]}"/>`).join('')))}
${label(120, 36, '一回 10さつ', '#3949AB', '#fff')}${label(330, 36, '2週間', '#FB8C00', '#fff')}`);
S['n5-r09-3'] = full(`<rect width="640" height="360" fill="#ECEFF1"/><rect y="176" width="640" height="10" fill="#8D6E63"/><rect y="186" width="640" height="174" fill="#FFF8E1"/>
${label(50, 24, '2かい', '#5C6BC0', '#fff', 16)}${label(50, 210, '1かい', '#5C6BC0', '#fff', 16)}
${friend({ x: 300, y: 172, s: 0.8, eye: 'happy', m: 'munch' })}${T(350, 120, A('bob', `<rect x="-10" y="-16" width="20" height="30" rx="4" fill="#FFB74D"/><rect x="-2" y="-28" width="3" height="16" fill="#E53935"/>`))}${ok(430, 100, 30)}${T(160, 172, `<rect x="-50" y="-36" width="100" height="6" fill="#A1672E"/><rect x="-44" y="-30" width="6" height="30" fill="#A1672E"/><rect x="38" y="-30" width="6" height="30" fill="#A1672E"/>`)}
${girl2({ x: 120, y: 352, s: 0.85, eye: 'happy', m: 'open', arms: 'wave', cls: 'shake' })}${T(190, 250, A('pop', `<path d="M0 -14l22-8M0 0h26M0 14l22 8" stroke="#EF5350" stroke-width="5" stroke-linecap="round"/>`))}${no(120, 270, 60)}
${boy({ x: 380, y: 352, s: 0.85, eye: 'happy', m: 'munch' })}${T(424, 300, `<path d="M-14 0h28l-6 18h-16z" fill="#FFB300"/><circle cy="-6" r="12" fill="#fff"/>`)}${no(390, 270, 60)}
${T(560, 280, A('pop', `<circle r="34" fill="#fff" stroke="#333" stroke-width="3"/><text y="6" font-size="17" text-anchor="middle" fill="#3949AB">しーっ</text>`))}`, '#ECEFF1');
S['n5-r09-4'] = full(`${room('#E8F5E9', '#D7A86E', 280)}${shelf(20, 70, 140, 3)}${shelf(480, 70, 140, 3)}
${T(320, 110, A('pop', `<circle r="60" fill="#FDD835"/><text y="-4" font-size="28" text-anchor="middle" fill="#C62828">0円</text><text y="26" font-size="18" text-anchor="middle" fill="#C62828">ただ</text>`))}
${grandpa({ x: 200, y: 352, s: 1.0, eye: 'happy', arms: 'hold', cls: 'bob' })}${mom({ x: 300, y: 354, s: 1.0, eye: 'happy', cls: 'bob d1' })}${boy({ x: 390, y: 352, s: 0.8, eye: 'happy', m: 'open', arms: 'up', cls: 'bob2' })}${me({ x: 470, y: 354, s: 1.0, eye: 'happy', arms: 'hold', cls: 'bob d2' })}
${book(200, 290, '#EF5350')}${book(470, 292, '#42A5F5')}${label(320, 210, 'だれでも OK', '#43A047', '#fff')}${hearts(560, 250)}${star(100, 40, 10)}${star(540, 40, 9, '#FFB300', 'twinkle d2')}`);

// ── r10 なくなったケーキ ──
S['n5-r10-1'] = full(`<rect width="640" height="360" fill="#FFF3E0"/><rect x="316" width="8" height="360" fill="#fff"/><rect x="324" width="316" height="360" fill="#303F9F"/><rect y="290" width="640" height="70" fill="#D7A86E"/>
${win(30, 30, 90, 70, '#B3E5FC', sun(75, 64, 12))}${label(240, 36, 'ごご', '#FB8C00', '#fff')}
${T(0, 0, fridge(170, 290, true))}${T(196, 180, A('bob', cake(0, 0, 0.7)))}${mom({ x: 70, y: 350, s: 1.0, eye: 'happy', arms: 'hold', cls: 'bob' })}
${win(350, 30, 90, 70, '#1A237E', star(395, 64, 8))}${label(560, 36, 'よる', '#5C6BC0', '#fff')}
${fridge(500, 290, true)}${mark(526, 190, '?', '#FDD835', 44)}${mom({ x: 400, y: 350, s: 1.0, eye: 'wide', m: 'o', arms: 'up', cls: 'shake' })}${bubble({ x: 470, y: 130, text: 'ない!', size: 22, tail: 1 })}`);
S['n5-r10-2'] = full(`<rect width="640" height="360" fill="#FFF8E7"/>
${[['#E3F2FD', dad({ x: 100, y: 300, s: 0.9, m: 'open', arms: 'wave', cls: 'bob' }), 'そとで くるまを…', T(100, 110, `<rect x="-50" y="-16" width="100" height="30" rx="10" fill="#EF5350"/><rect x="-30" y="-34" width="60" height="22" rx="8" fill="#B3E5FC"/><circle cx="-28" cy="16" r="10" fill="#333"/><circle cx="28" cy="16" r="10" fill="#333"/>` + A('pop', `<circle cx="-56" cy="-30" r="7" fill="#fff" opacity=".9"/><circle cx="56" cy="-20" r="5" fill="#fff" opacity=".9"/><circle cx="40" cy="-44" r="6" fill="#fff" opacity=".9"/>`))],
  ['#E8F5E9', boy({ x: 100, y: 300, s: 0.9, m: 'open', arms: 'hold', cls: 'bob d1' }), 'あまいものは きらい', book(70, 110, '#42A5F5', 1.2) + T(140, 110, `<g transform="scale(.5)">${cake(0, 30, 1)}</g><circle r="34" fill="none" stroke="#E53935" stroke-width="6"/><path d="M-24 -24l48 48" stroke="#E53935" stroke-width="6"/>`)],
  ['#FCE4EC', girl2({ x: 100, y: 300, s: 0.85, eye: 'open', m: 'o', cls: 'shake' }), 'しらない…', mark(100, 130, '?', '#EC407A', 50) + T(150, 170, A('up', `<path d="M0 0q-6 10 0 14 6-4 0-14z" fill="#4FC3F7"/>`))]].map(([bg, p, t, extra], i) => `<svg x="${12 + i * 210}" y="12" width="198" height="336" viewBox="0 0 198 336"><rect width="198" height="336" rx="16" fill="${bg}"/>${extra}${p}<rect x="8" y="16" width="182" height="34" rx="12" fill="#fff"/><text x="99" y="39" font-size="16" text-anchor="middle" fill="#333">${t}</text></svg>`).join('')}`);
S['n5-r10-3'] = full(`${room('#FCE4EC', '#D7A86E')}
${T(430, 420, `${girl2({ x: 0, y: 0, s: 2.6, eye: 'wide', m: 'smile' })}`)}
${T(480, 190, A('glow', `<ellipse rx="16" ry="9" fill="#fff" stroke="#F8BBD0" stroke-width="2"/><ellipse cx="14" cy="10" rx="8" ry="5" fill="#fff"/>`))}
${T(470, 186, A('bob', `<circle r="54" fill="#E3F2FD" opacity=".5" stroke="#455A64" stroke-width="10"/><rect x="-80" y="40" width="50" height="14" rx="7" fill="#455A64" transform="rotate(-40 -50 46)"/>`))}
${me({ x: 110, y: 352, s: 1.2, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob' })}${bubble({ x: 150, y: 80, text: 'わかった!', size: 22, tail: -1 })}${mark(250, 150, '!')}${label(560, 60, 'クリーム', '#fff', '#EC407A')}${star(60, 60, 10)}`);

// ── r11 だれの傘 ──
const classroom = `<rect width="640" height="360" fill="#FFF8E1"/><rect y="280" width="640" height="80" fill="#D7A86E"/><rect x="180" y="30" width="300" height="110" rx="6" fill="#2E7D32" stroke="#8D6E63" stroke-width="8"/>`;
S['n5-r11-1'] = full(`${classroom}${win(20, 40, 120, 100, '#90A4AE', `<svg x="20" y="40" width="120" height="100" viewBox="0 0 640 360">${rain(20)}</svg>`)}
<text x="330" y="96" font-size="26" text-anchor="middle" fill="#fff">だれの かさ?</text>
${teacher({ x: 250, y: 352, s: 1.2, m: 'open', arms: 'hold', cls: 'bob' })}${T(420, 330, A('sway', umbrella(0, 0, 1.2, '#1E88E5')))}
${mark(500, 180, '?', '#1E88E5', 60)}${T(560, 300, `<rect x="-50" y="-60" width="100" height="8" fill="#A1672E"/><rect x="-44" y="-52" width="6" height="52" fill="#8D6E63"/><rect x="38" y="-52" width="6" height="52" fill="#8D6E63"/>`)}${label(560, 170, 'なまえ なし', '#90A4AE', '#fff', 15)}`, '#FFF8E1');
S['n5-r11-2'] = full(`${classroom}
${[[110, boy, 'ながい', 0], [320, friend, 'あたらしい', 1], [530, girl2, 'きいろい はな', 2]].map(([x, P, t, i]) => `${P({ x, y: 352, s: 1.05, m: 'open', arms: 'up', cls: `bob2 d${i}` })}${bubble({ x, y: 170, text: t, size: 17, tail: -1 })}`).join('')}
<text x="330" y="96" font-size="26" text-anchor="middle" fill="#fff">「わたしのです」×3</text>
${T(40, 250, umbrella(0, 0, 0.6, '#1E88E5'))}${T(250, 250, umbrella(0, 0, 0.6, '#1E88E5'))}${star(292, 204, 7)}${T(455, 250, umbrella(0, 0, 0.6, '#1E88E5'))}<circle cx="600" cy="230" r="7" fill="#FDD835"/><circle cx="614" cy="244" r="6" fill="#FDD835"/>`, '#FFF8E1');
S['n5-r11-3'] = full(`${classroom}
${T(400, 300, A('sway', `<path d="M-150 -90q150-150 300 0-37-26-75 0-37-26-75 0-37-26-75 0-37-26-75 0z" fill="#1565C0"/>${[[-90, -130], [-30, -150], [40, -146], [96, -124], [0, -116], [-56, -110], [64, -104]].map(([dx, dy], i) => `<g transform="translate(${dx} ${dy})" class="twinkle d${i % 4}">${[0, 72, 144, 216, 288].map((r) => `<ellipse cx="0" cy="-6" rx="3.5" ry="6" fill="#FDD835" transform="rotate(${r})"/>`).join('')}<circle r="3" fill="#FB8C00"/></g>`).join('')}<rect x="-3" y="-90" width="6" height="90" fill="#8D6E63"/><path d="M0 0q0 16 14 16" stroke="#8D6E63" stroke-width="6" fill="none"/><rect x="-60" y="-70" width="24" height="14" fill="#90CAF9" opacity=".8"/>`))}
${teacher({ x: 130, y: 352, s: 1.2, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob' })}${girl2({ x: 590, y: 352, s: 0.9, eye: 'happy', m: 'open', arms: 'up', cls: 'bob2' })}
<text x="330" y="80" font-size="22" text-anchor="middle" fill="#fff">ふるくて みじかい</text><text x="330" y="116" font-size="22" text-anchor="middle" fill="#FDD835">きいろい はな!</text>${mark(240, 200, '!')}`, '#FFF8E1');

// ── r12 雪の日の手紙 ──
const snowTown = `${outdoor('#CFD8DC', '#fff', 250)}`;
const letter = (x, y, s = 1) => T(x, y, `<rect x="-30" y="-20" width="60" height="40" rx="4" fill="#fff" stroke="#EF9A9A" stroke-width="3"/><path d="M-30 -20l30 22 30-22" fill="none" stroke="#EF9A9A" stroke-width="3"/><path d="M0 6q-8-10-14-2t14 14q20-6 14-14t-14 2z" fill="#EF5350" transform="translate(0 2) scale(.5)"/>`, s);
S['n5-r12-1'] = full(`${snowTown}${house(200, 262, 1.7, '#FFCC80', '#fff')}${T(300, 290, A('glow', letter(0, 0, 1.2)))}
${T(480, 150, `<rect x="-120" y="-70" width="240" height="140" rx="10" fill="#fff" stroke="#EF9A9A" stroke-width="4"/><text y="-22" font-size="20" text-anchor="middle" fill="#E53935">おたんじょうび</text><text y="10" font-size="20" text-anchor="middle" fill="#E53935">おめでとう</text><text y="46" font-size="15" text-anchor="middle" fill="#90A4AE">なまえ: ？</text>`)}
${person({ x: 110, y: 352, s: 1.1, hair: '#455A64', top: '#5C6BC0', bottom: '#37474F', eye: 'wide', m: 'o', cls: 'bob' })}${mark(60, 170, '?', '#3949AB')}${snow(26)}`, '#CFD8DC');
S['n5-r12-2'] = full(`${snowTown}${house(110, 250, 1.3, '#FFCC80', '#fff')}${house(540, 250, 1.3, '#B3E5FC', '#fff')}${label(110, 100, 'やまださん', '#fff', '#333', 15)}${label(540, 100, 'となり', '#fff', '#333', 15)}
${[[500, 290, -70], [460, 310, -80], [418, 296, -75], [376, 318, -80], [334, 302, -75], [292, 322, -80], [250, 306, -75], [208, 320, -70]].map(([x, y, r], i) => `<g class="pop d${i % 4}">${foot(x, y, r)}</g>`).join('')}
${T(180, 300, letter(0, 0, 0.7))}${T(360, 240, A('bob', `<circle r="38" fill="#E3F2FD" opacity=".5" stroke="#455A64" stroke-width="8"/><rect x="26" y="30" width="40" height="11" rx="5" fill="#455A64" transform="rotate(40 26 30)"/>`))}${label(360, 180, 'ちいさい あしあと', '#3949AB', '#fff', 16)}${snow(18)}`, '#CFD8DC');
S['n5-r12-3'] = full(`${room('#E3F2FD', '#D7A86E')}${win(40, 30, 130, 100, '#CFD8DC', `<svg x="40" y="30" width="130" height="100" viewBox="0 0 640 360">${snow(16)}</svg>`)}
${grandpa({ x: 240, y: 352, s: 1.35, eye: 'happy', cls: 'bob' })}${mom({ x: 390, y: 352, s: 1.1, eye: 'happy', cls: 'bob d1' })}${boy({ x: 530, y: 352, s: 0.75, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob2' })}
${label(240, 100, 'せが たかい', '#8D6E63', '#fff', 15)}${label(390, 140, 'おかあさん', '#EC407A', '#fff', 15)}${label(530, 190, '6さい', '#43A047', '#fff', 17)}
${T(590, 330, `<circle r="14" fill="#EF5350"/><path d="M-14 0a14 14 0 0 1 28 0z" fill="#fff"/>`)}${hearts(600, 240)}`);
S['n5-r12-4'] = full(`${snowTown}${house(520, 262, 1.6, '#B3E5FC', '#fff', true)}
${person({ x: 250, y: 352, s: 1.15, hair: '#455A64', top: '#5C6BC0', bottom: '#37474F', eye: 'happy', m: 'smile', arms: 'hold', walk: true, cls: 'bob2' })}${T(290, 280, letter(0, 0, 0.6))}
${boy({ x: 440, y: 350, s: 0.75, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob2 d2' })}${bubble({ x: 150, y: 110, text: 'わかりました', size: 20, tail: 1 })}${hearts(360, 200)}${snow(20)}${star(60, 60, 9, '#FFD54F')}`, '#CFD8DC');

// ── r13 友だちの誕生日 ──
const hat = (x, y, s = 1) => T(x, y, `<path d="M-30 0a30 26 0 0 1 60 0z" fill="#1E88E5"/><rect x="-34" y="-3" width="84" height="9" rx="4" fill="#1565C0"/>`, s);
S['n5-r13-1'] = full(`${outdoor('#FFCC80', '#CFD8DC', 280)}${T(560, 90, `<circle r="36" fill="#FF7043" class="glow"/>`)}${cloud(120, 60, 1, 'float')}
${house(480, 290, 2, '#FFE0B2', '#E57373', true)}${label(480, 100, 'きむらさんの いえ', '#fff', '#333', 15)}
${me({ x: 110, y: 352, s: 1.0, eye: 'happy', walk: true, arms: 'hold', cls: 'bob2' })}${girl2({ x: 210, y: 352, s: 1.0, eye: 'happy', walk: true, cls: 'bob2 d1' })}${boy({ x: 300, y: 352, s: 1.0, eye: 'happy', m: 'open', walk: true, arms: 'wave', cls: 'bob2 d2' })}
${T(110, 290, A('bob', `<rect x="-20" y="-16" width="40" height="32" rx="4" fill="#EF5350"/><rect x="-4" y="-16" width="8" height="32" fill="#FDD835"/><path d="M0 -16q-14-16-18-4t18 4q14-16 18-4t-18 4z" fill="#FDD835"/>`))}${label(90, 40, 'きんようび', '#FB8C00', '#fff')}${note(260, 190)}`, '#FFCC80');
S['n5-r13-2'] = full(`${room('#E3F2FD', '#D7A86E')}
${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${40 + i * 80} 20l20 34 20-34z" fill="${['#EF5350', '#FDD835', '#42A5F5', '#66BB6A'][i % 4]}" class="sway d${i % 4}"/>`).join('')}<path d="M0 20h640" stroke="#8D6E63" stroke-width="3"/>
${me({ x: 180, y: 352, s: 1.2, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob' })}${friend({ x: 440, y: 352, s: 1.25, eye: 'happy', m: 'open', arms: 'up', cls: 'bob2' })}
${T(440, 144, A('bob2', hat(0, 0, 1.5)))}${bubble({ x: 300, y: 100, text: 'ありがとう!', size: 22, tail: -1 })}${hearts(560, 150)}${star(80, 100, 10)}${star(590, 80, 9, '#FFB300', 'twinkle d2')}
${T(290, 330, `<rect x="-26" y="-22" width="52" height="22" rx="4" fill="#EF5350"/><path d="M-30 -22h60l-8-14h-44z" fill="#C62828"/>`)}`);
S['n5-r13-3'] = full(`${room('#FFF3E0', '#D7A86E')}${table(80, 250, 480)}
${T(320, 248, cake(0, 0, 1.4))}${[-22, 0, 22].map((dx, i) => `<rect x="${320 + dx - 2}" y="150" width="4" height="22" fill="#42A5F5"/>${A(`glow d${i}`, `<path d="M${320 + dx} 136q-6 10 0 14 6-4 0-14z" fill="#FFB300"/>`)}`).join('')}
${bowl(170, 248, 'rice', 1.1)}${T(170, 214, `<ellipse rx="26" ry="8" fill="#A1672E"/>`)}${T(470, 248, `<ellipse rx="40" ry="8" fill="#fff"/><ellipse cy="-10" rx="30" ry="12" fill="#66BB6A"/><circle cx="-10" cy="-14" r="6" fill="#EF5350"/><circle cx="12" cy="-12" r="5" fill="#FDD835"/>`)}
${me({ x: 60, y: 354, s: 1.0, eye: 'happy', m: 'open', arms: 'up', cls: 'bob' })}${girl2({ x: 590, y: 354, s: 1.0, eye: 'happy', m: 'open', arms: 'up', cls: 'bob d2' })}
${note(120, 130)}${note(520, 120, 'rise d2', '#1E88E5')}${note(260, 90, 'rise d3', '#43A047')}${note(400, 100, 'rise d1', '#FB8C00')}
${label(170, 180, 'カレー', '#FB8C00', '#fff', 15)}${label(470, 200, 'サラダ', '#43A047', '#fff', 15)}`);
S['n5-r13-4'] = full(`<rect width="640" height="360" fill="#1A237E"/>${[...Array(14)].map((_, i) => star(30 + i * 45, 30 + ((i * 53) % 110), 5 + (i % 3) * 2, '#FFF59D', `twinkle d${i % 4}`)).join('')}
<path d="M0 290h640v70h-640z" fill="#283593"/>${house(500, 300, 1.8, '#3949AB', '#5C6BC0', true)}
${T(120, 110, `<circle r="50" fill="#fff"/><circle r="50" fill="none" stroke="#9FA8DA" stroke-width="6"/><path d="M0 0v-30" stroke="#333" stroke-width="5" stroke-linecap="round"/><path d="M0 0l-24 0" stroke="#E53935" stroke-width="6" stroke-linecap="round"/><text y="74" font-size="18" text-anchor="middle" fill="#fff">9じ</text>`)}
${me({ x: 290, y: 352, s: 1.15, eye: 'happy', m: 'smile', walk: true, cls: 'bob2' })}${note(360, 220)}${hearts(220, 230)}${bubble({ x: 360, y: 150, text: 'たのしかった!', size: 20, tail: 1 })}`, '#1A237E');
export default S;
