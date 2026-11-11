import { frame, panel, person, bubble, steam, star, note, sun, cloud, bird } from './lib.mjs';
const girl = (o) => person({ hair: '#7A4A2B', top: '#FF9F43', bottom: '#7E57C2', ...o });

// 1：六點起床 → 刷牙 → 做早餐
const wake = `
<rect width="330" height="330" fill="#EDE7F6"/><rect y="250" width="330" height="80" fill="#D1C4E9"/>
<rect x="150" y="30" width="150" height="120" rx="12" fill="#FFF3E0" stroke="#fff" stroke-width="8"/>
<g clip-path="inset(0)">${sun(225, 120, 30)}</g>
<rect x="150" y="30" width="150" height="120" rx="12" fill="none" stroke="#fff" stroke-width="8"/><rect x="221" y="30" width="8" height="120" fill="#fff"/>
<path class="sway" d="M138 22h40q10 70-12 140h-28z" fill="#FF8FA3"/><path class="sway d2" d="M312 22h-40q-10 70 12 140h28z" fill="#FF8FA3"/>
${bird(160, 60)}
<g transform="translate(60 70)"><g class="shake"><circle r="30" fill="#EF5350"/><circle r="23" fill="#fff"/><rect x="-2" y="-18" width="4" height="20" rx="2" fill="#333"/><rect x="-2" y="-2" width="4" height="16" rx="2" fill="#333" transform="rotate(180)"/><circle cx="-22" cy="-26" r="9" fill="#EF5350"/><circle cx="22" cy="-26" r="9" fill="#EF5350"/></g>
<text class="twinkle" x="-48" y="-30" font-size="16" fill="#EF5350">ジ</text><text class="twinkle d1" x="34" y="-34" font-size="16" fill="#EF5350">リ</text></g>
<rect x="20" y="236" width="290" height="60" rx="14" fill="#90CAF9"/><rect x="20" y="210" width="16" height="96" rx="6" fill="#A1887F"/><rect x="296" y="226" width="16" height="80" rx="6" fill="#A1887F"/>
<rect x="44" y="222" width="80" height="30" rx="14" fill="#fff"/>
${girl({ x: 196, y: 318, s: 1.15, eye: 'closed', m: 'yawn', arms: 'stretch', cls: 'bob' })}
<path d="M20 262h290v34q0 14-14 14h-262q-14 0-14-14z" fill="#64B5F6"/>
${bubble({ x: 78, y: 150, text: 'ふぁ〜', size: 22, tail: 1 })}
<rect x="18" y="286" width="96" height="34" rx="17" fill="#fff"/><text x="66" y="310" font-size="20" text-anchor="middle" fill="#333">6:00</text>`;

const brushing = `
<rect width="270" height="158" fill="#E1F5FE"/><rect y="118" width="270" height="40" fill="#B3E5FC"/>
<rect x="20" y="14" width="86" height="76" rx="10" fill="#fff" stroke="#B0BEC5" stroke-width="5"/><path d="M34 40l22-16M40 58l30-24" stroke="#E1F5FE" stroke-width="5" stroke-linecap="round"/>
<rect x="10" y="100" width="110" height="60" rx="8" fill="#fff"/><rect x="56" y="84" width="8" height="18" fill="#B0BEC5"/>
${girl({ x: 186, y: 152, s: 0.8, eye: 'happy', m: 'smile', arms: 'hold', cls: 'bob2' })}
<g class="brush"><rect x="176" y="72" width="44" height="7" rx="3.5" fill="#42A5F5"/><rect x="170" y="68" width="13" height="13" rx="3" fill="#fff" stroke="#B0BEC5" stroke-width="1.5"/></g>
<circle class="rise" cx="146" cy="76" r="6" fill="#fff"/><circle class="rise d1" cx="226" cy="66" r="8" fill="#fff"/><circle class="rise d2" cx="138" cy="100" r="5" fill="#fff"/>
${star(240, 24, 9, '#4FC3F7')}${star(128, 22, 7, '#4FC3F7', 'twinkle d1')}`;

const cooking = `
<rect width="270" height="158" fill="#FFF3E0"/><rect y="112" width="270" height="46" fill="#FFCC80"/>
<rect x="10" y="78" width="150" height="80" rx="8" fill="#ECEFF1"/><rect x="10" y="78" width="150" height="12" fill="#B0BEC5"/>
<g class="bob2"><rect x="30" y="64" width="78" height="12" rx="6" fill="#37474F"/><rect x="104" y="66" width="40" height="7" rx="3.5" fill="#37474F"/><ellipse cx="68" cy="64" rx="24" ry="8" fill="#fff"/><circle cx="68" cy="62" r="8" fill="#FFB300"/></g>
${steam(50, 52, 3, 18)}
<text class="twinkle" x="120" y="46" font-size="16" fill="#FF7043">ジュー</text>
${girl({ x: 210, y: 152, s: 0.8, eye: 'happy', m: 'open', arms: 'wave', cls: 'bob' })}
${note(160, 40)}${note(248, 30, 'rise d2', '#7E57C2')}`;

const s1 = frame(
  panel(10, 10, 330, 340, '#EDE7F6', wake, 'p1') + panel(352, 10, 278, 164, '#E1F5FE', brushing, 'p2') + panel(352, 186, 278, 164, '#FFF3E0', cooking, 'p3'),
  '#FFF8E7');

// 2：早餐是麵包、蛋、牛奶；星期天吃飯和味噌湯
const s2 = frame(`
<rect width="640" height="360" fill="#FFF3D6"/>
<rect x="30" y="24" width="150" height="110" rx="12" fill="#B3E5FC" stroke="#fff" stroke-width="8"/>${cloud(80, 70, 0.8, 'fly')}${sun(150, 56, 16)}
<rect x="101" y="24" width="8" height="110" fill="#fff"/>

${person({ x: 200, y: 392, s: 1.55, hair: '#7A4A2B', top: '#FF9F43', bottom: '#7E57C2', eye: 'happy', m: 'munch', arms: 'hold', cls: 'bob2' })}
<g class="bob2"><path d="M176 250h48q10 0 10 10v22h-68v-22q0-10 10-10z" fill="#E0A458"/><path d="M180 256h40q6 0 6 6v16h-52v-16q0-6 6-6z" fill="#FFE0A3"/><path d="M186 250q14 12 28 0z" fill="#FFF3D6"/></g>
<rect x="0" y="284" width="640" height="76" fill="#E8B77A"/><rect x="0" y="284" width="640" height="10" fill="#D49A55"/>
<ellipse cx="350" cy="322" rx="62" ry="18" fill="#fff"/><ellipse cx="350" cy="318" rx="34" ry="12" fill="#FFFDE7"/><circle cx="350" cy="316" r="11" fill="#FFB300"/>
${steam(332, 292, 3, 18)}
<g transform="translate(40 40)"><path d="M430 236h44l-5 64h-34z" fill="#fff" stroke="#CFD8DC" stroke-width="4"/><path d="M434 258h36l-3 40h-30z" fill="#F5F5F5"/></g><text x="492" y="326" font-size="13" text-anchor="middle" fill="#42A5F5">ミルク</text>
<g transform="translate(-10 26)"><ellipse cx="80" cy="300" rx="50" ry="14" fill="#fff"/><path d="M52 296h56l-6-22h-44z" fill="#E0A458"/><path d="M57 292h46l-4-14h-38z" fill="#FFE0A3"/></g>
${bubble({ x: 96, y: 170, text: 'おいしい!', size: 20, tail: 1 })}
<g class="pop"><path d="M392 30h216q18 0 18 18v120q0 18-18 18h-150l-26 26 4-26h-44q-18 0-18-18v-120q0-18 18-18z" fill="#fff" stroke="#333" stroke-width="3"/></g>
<rect x="396" y="42" width="110" height="30" rx="15" fill="#EF5350"/><text x="451" y="64" font-size="18" text-anchor="middle" fill="#fff">にちようび</text>
<path d="M410 120q0 44 44 44t44-44z" fill="#ECEFF1" stroke="#90A4AE" stroke-width="3"/><path d="M414 120q10-26 40-26t40 26z" fill="#fff" stroke="#B0BEC5" stroke-width="3"/>
<path d="M522 120q0 44 42 44t42-44z" fill="#D84315"/><ellipse cx="564" cy="120" rx="42" ry="9" fill="#8D4E2A"/><rect x="552" y="114" width="10" height="8" fill="#fff"/><circle cx="578" cy="120" r="4" fill="#66BB6A"/>
${steam(438, 92, 2, 22)}${steam(550, 104, 2, 24)}
${star(590, 60, 10)}${star(36, 170, 9, '#FFB300', 'twinkle d1')}${note(250, 130, 'rise d1')}
`, '#FFF3D6');

// 3：七點半出門走到車站 → 電車上看書
const street = `
<rect width="300" height="340" fill="#B3E5FC"/>${cloud(70, 60, 1, 'fly')}${cloud(220, 40, 0.7, 'fly d2')}${sun(250, 90, 22)}
<g class="scrollL">${[0, 160, 320, 480].map((dx, i) => `<g transform="translate(${dx} 0)"><rect x="10" y="150" width="70" height="110" fill="${['#FFCC80', '#C5E1A5', '#F8BBD0', '#FFCC80'][i]}"/><path d="M0 152l45-40 45 40z" fill="${['#E57373', '#8D6E63', '#7986CB', '#E57373'][i]}"/><rect x="30" y="180" width="26" height="26" fill="#fff"/><rect x="100" y="236" width="8" height="26" fill="#8D6E63"/><circle cx="104" cy="222" r="24" fill="#66BB6A"/></g>`).join('')}</g>
<rect y="258" width="300" height="82" fill="#BDBDBD"/><g class="scrollFast">${[0, 120, 240, 360].map((dx) => `<rect x="${dx + 10}" y="296" width="60" height="8" rx="4" fill="#fff"/>`).join('')}</g>
${person({ x: 150, y: 300, s: 1.3, hair: '#7A4A2B', top: '#FF9F43', bottom: '#7E57C2', eye: 'open', m: 'smile', arms: 'down', walk: true, cls: 'bob2' })}
<g class="bob2"><rect x="168" y="236" width="42" height="34" rx="6" fill="#8D6E63"/><rect x="180" y="226" width="18" height="14" rx="7" fill="none" stroke="#5D4037" stroke-width="4"/></g>
<rect x="14" y="16" width="92" height="34" rx="17" fill="#fff"/><text x="60" y="40" font-size="20" text-anchor="middle" fill="#333">7:30</text>
${note(214, 150, 'rise')}`;

const train = `
<rect width="300" height="340" fill="#E8EAF6"/>
<rect x="16" y="30" width="268" height="120" rx="14" fill="#B3E5FC" stroke="#90A4AE" stroke-width="6"/>
<clipPath id="win"><rect x="19" y="33" width="262" height="114" rx="11"/></clipPath><g clip-path="url(#win)"><g class="scrollFast">${[0, 120, 240, 360].map((dx) => `<rect x="${dx + 20}" y="${dx % 240 ? 90 : 70}" width="50" height="80" fill="#C5CAE9"/><rect x="${dx + 80}" y="100" width="34" height="60" fill="#9FA8DA"/>`).join('')}</g><rect x="19" y="130" width="262" height="20" fill="#81C784"/></g>
<rect x="146" y="30" width="6" height="120" fill="#90A4AE"/>
<g class="sway"><rect x="60" y="0" width="5" height="34" fill="#90A4AE"/><circle cx="62" cy="44" r="12" fill="none" stroke="#fff" stroke-width="6"/></g><g class="sway d2"><rect x="230" y="0" width="5" height="34" fill="#90A4AE"/><circle cx="232" cy="44" r="12" fill="none" stroke="#fff" stroke-width="6"/></g>
<rect y="236" width="300" height="104" fill="#5C6BC0"/><rect y="226" width="300" height="20" rx="8" fill="#7986CB"/>
${person({ x: 150, y: 372, s: 1.35, hair: '#7A4A2B', top: '#FF9F43', bottom: '#7E57C2', eye: 'open', m: 'smile', arms: 'hold', cls: 'bob2' })}
<g class="bob2" ><g transform="translate(0 54)"><path d="M108 210h40v54h-40z" fill="#EF5350"/><path d="M152 210h40v54h-40z" fill="#E53935"/><path d="M112 214h34v46h-34zM154 214h34v46h-34z" fill="#fff"/><path d="M118 226h22M118 236h22M118 246h16M160 226h22M160 236h22M160 246h16" stroke="#BDBDBD" stroke-width="3"/></g></g>
${bubble({ x: 236, y: 176, text: 'ふむふむ', size: 16, tail: -1 })}
<text class="twinkle" x="20" y="212" font-size="16" fill="#3949AB">ガタン</text><text class="twinkle d1" x="238" y="246" font-size="16" fill="#C5CAE9">ゴトン</text>`;

const s3 = frame(panel(10, 10, 304, 340, '#B3E5FC', street, 'q1') + panel(326, 10, 304, 340, '#E8EAF6', train, 'q2')
  + `<g class="pop"><circle cx="320" cy="180" r="24" fill="#FFD54F" stroke="#fff" stroke-width="5"/><path d="M310 180h16m-7-8l8 8-8 8" fill="none" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g>`, '#FFF8E7');

export default { 'n5-r01-1': s1, 'n5-r01-2': s2, 'n5-r01-3': s3 };
