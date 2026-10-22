'use strict';

// Flat, faceless portraits for the backs of Relationship cards, in the style of the card set
// they come from: makePortraits(n, setKey) draws a fresh random set, gender balanced, with skin
// tones spread evenly. Drawn in a 100×100 viewBox, head centred at (50, 42).
//   bladerunner   trench coats, see-through raincoats, neon and rain
//   ghostbusters  jumpsuits with pack straps, lab coats, New Yorkers, and the odd ghost
//   starwars      pilots, smugglers, robed Jedi, senators, troopers, aliens, under the stars
//   lotr          dwarves, elves, wizards, hobbits and warriors
//   marvel        armoured suits, masks, capes, Asgardians, sorcerers, against comic-book rays
// Anything else gets everyday people.

const makePortraits = (() => {
  const SKIN = ['#f3d2b8', '#e5b48f', '#c98d63', '#a46a43', '#7c4a2b', '#59341f'];
  const HAIR = ['#141010', '#2b1b12', '#4a2e1c', '#7a4a26', '#8c2a1c', '#d8b56a', '#f0e2b6', '#9a9a9a'];
  const CLOTHES = ['#26262e', '#3b4a63', '#5e2a4a', '#2f4a3a', '#7a2e3a', '#8a6d3b', '#4a3566', '#6e6e73', '#b39a6b', '#c76d7e', '#2e5f6b', '#d4a52c'];
  const BG = ['#5b7189', '#7a2e3a', '#3d4f6b', '#34433a', '#4a3566', '#8a6d3b', '#5c2a2a', '#3f6e6a', '#6b5636', '#2c3e57', '#4d4d4d', '#6d3f5f'];

  const pick = list => list[randInt(list.length)];
  const chance = p => randInt(1000) < p * 1000;
  const rnd = (a, b) => a + randInt(Math.round((b - a) * 10) + 1) / 10;

  // Lighten (amt > 0) or darken (amt < 0) a #rrggbb colour.
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const mix = c => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt);
    const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  }

  // ---- Body parts ----
  const neckRect = c => `<rect x="43" y="54" width="14" height="22" rx="4" fill="${c}"/>`;
  const headShape = c => `<ellipse cx="50" cy="42" rx="14" ry="17" fill="${c}"/>`;
  const EARS = {
    normal: c => `<ellipse cx="36" cy="44" rx="3" ry="4.5" fill="${c}"/><ellipse cx="64" cy="44" rx="3" ry="4.5" fill="${c}"/>`,
    elf: c => `<path d="M37.5 39 L26 28 L34.5 49 Z M62.5 39 L74 28 L65.5 49 Z" fill="${c}"/>`,
    hobbit: c => `<path d="M37 40 L31 34 L34 49 Z M63 40 L69 34 L66 49 Z" fill="${c}"/>`,
    none: () => '',
  };
  // One figure, back to front: the background art, what's behind the head (hair, a hood, a cape),
  // the neck, the clothes, the ears and head, the face, then what's in front (hair, a hat, a collar).
  function figure({ decor = '', back = '', skin, neck = true, outfit = '', ears = 'normal', head = true, face = '', front = '' }) {
    const n = skin ? shade(skin, -0.14) : '';
    return decor + back + (neck && skin ? neckRect(n) : '') + outfit + (head && skin ? EARS[ears](n) + headShape(skin) : '') + face + front;
  }

  // ---- Clothes ----
  const shoulders = c => `<path d="M8 100 C8 81 27 72 50 72 C73 72 92 81 92 100 Z" fill="${c}"/>`;
  const broad = c => `<path d="M4 100 C4 79 22 70 50 70 C78 70 96 79 96 100 Z" fill="${c}"/>`;
  const shirtV = (c = '#f4f1ea') => `<path d="M42 72 L50 87 L58 72 Z" fill="${c}"/>`;
  const necklineV = c => `<path d="M40 72 L50 85 L60 72 Z" fill="${c}"/>`;
  const scoop = c => `<path d="M38 73 Q50 88 62 73 Z" fill="${c}"/>`;
  const tie = c => `<path d="M48.6 75 L51.4 75 L53.2 90 L50 95 L46.8 90 Z" fill="${c}"/><path d="M47.6 72.5 L52.4 72.5 L51.4 76 L48.6 76 Z" fill="${shade(c, -0.25)}"/>`;
  const lapels = c => `<path d="M42 72 L50 90 L45 100 L30 77 Q35 73 42 72 Z" fill="${c}"/><path d="M58 72 L50 90 L55 100 L70 77 Q65 73 58 72 Z" fill="${c}"/>`;
  const bowtie = c => `<path d="M43.5 73 L50 76.5 L43.5 80 Z M56.5 73 L50 76.5 L56.5 80 Z" fill="${c}"/><circle cx="50" cy="76.5" r="1.8" fill="${shade(c, -0.3)}"/>`;
  const vest = c => `<path d="M38 74 L50 92 L62 74 L66 100 L34 100 Z" fill="${c}"/>`;
  const openVest = c => `<path d="M30 76 Q36 73 42 72 L46 100 L26 100 Z M70 76 Q64 73 58 72 L54 100 L74 100 Z" fill="${c}"/>`;
  const collar = () => `<path d="M40 72 Q45 79 50 74 Q55 79 60 72 Q55 72 50 73 Q45 72 40 72 Z" fill="#f4f1ea"/>`;
  const turtleneck = c => `<rect x="41.5" y="61" width="17" height="14" rx="4" fill="${shade(c, 0.1)}"/><path d="M41.5 66 H58.5 M41.5 70 H58.5" stroke="${shade(c, -0.2)}" stroke-width="0.8"/>`;
  const zipper = c => `<path d="M50 74 V100" stroke="${c}" stroke-width="1.2"/>`;
  const pearls = () => Array.from({ length: 9 }, (_, i) => {
    const x = 41 + i * 2.25;
    return `<circle cx="${x}" cy="${80 - ((x - 50) ** 2) / 22}" r="1.25" fill="#f6f1e3"/>`;
  }).join('');
  // Chain mail: rows of small rings over a grey base.
  const mail = (c = '#8d939a') => broad(c) + Array.from({ length: 5 }, (_, r) => Array.from({ length: 12 }, (_, i) => `<circle cx="${10 + i * 7.3 + (r % 2) * 3.6}" cy="${78 + r * 5}" r="1.6" fill="none" stroke="${shade(c, -0.3)}" stroke-width="0.6"/>`).join('')).join('');

  const OUTFITS = {
    suit: c => shoulders(c) + shirtV() + tie(pick(CLOTHES)) + lapels(shade(c, -0.18)),
    vest: c => shoulders('#efece4') + vest(c) + bowtie('#1a1a1a'),
    openCollar: (c, skin) => shoulders(c) + necklineV(skin) + lapels(shade(c, -0.15)),
    turtleneck: c => shoulders(c) + turtleneck(c),
    blouse: c => shoulders(c) + collar(),
    dress: (c, skin) => shoulders(c) + scoop(skin) + (chance(0.4) ? pearls() : ''),
    blazer: c => shoulders(c) + shirtV() + lapels(shade(c, -0.18)),
  };
  const MEN_OUTFITS = ['suit', 'vest', 'openCollar', 'turtleneck', 'blazer'];
  const WOMEN_OUTFITS = ['blouse', 'dress', 'blazer', 'turtleneck', 'openCollar'];

  // ---- Hair: [behind the head, in front of it] ----
  const frontHair = c => `<path d="M36 40 C34 26 41 22 50 22 C59 22 66 26 64 40 C62 32 57 29 50 29 C43 29 38 32 36 40 Z" fill="${c}"/>`;
  const curls = (c, r = 5, rx = 15, ry = 16) => {
    const dots = [];
    for (let a = 165; a >= 15; a -= 12) {
      const t = a * Math.PI / 180;
      dots.push(`<circle cx="${(50 + rx * Math.cos(t)).toFixed(1)}" cy="${(39 - ry * Math.sin(t)).toFixed(1)}" r="${r}" fill="${c}"/>`);
    }
    return dots.join('');
  };
  const HAIR_STYLES = {
    short: c => ['', frontHair(c)],
    cropped: c => ['', `<path d="M37 36 C37 27 43 24 50 24 C57 24 63 27 63 36 C60 31 55 29.5 50 29.5 C45 29.5 40 31 37 36 Z" fill="${c}"/>`],
    sidePart: c => ['', frontHair(c) + `<path d="M43 24 Q46 27 46.5 30.5" stroke="${shade(c, 0.35)}" stroke-width="0.9" fill="none"/>`],
    balding: c => ['', `<path d="M36 35 C34 40 35 46 36.5 48.5 L38.5 48.5 L38.5 37 Z M64 35 C66 40 65 46 63.5 48.5 L61.5 48.5 L61.5 37 Z" fill="${c}"/>`],
    curly: c => ['', frontHair(c) + curls(c)],
    afro: c => [`<circle cx="50" cy="36" r="23" fill="${c}"/>`, frontHair(c)],
    slicked: c => ['', `<path d="M36 38 C35 26 42 21 50 21 C58 21 65 26 64 38 C61 30 56 27 50 27 C44 27 39 30 36 38 Z" fill="${c}"/><path d="M41 25 Q50 22 59 25" stroke="${shade(c, 0.4)}" stroke-width="0.8" fill="none"/>`],
    long: c => [`<path d="M34 46 C29 28 38 20 50 20 C63 20 71 28 67 46 C70 56 66 64 71 72 C64 75 58 72 56 69 L44 69 C42 72 36 75 29 72 C34 64 30 56 34 46 Z" fill="${c}"/>`,
      `<path d="M36 41 C35 27 46 21 57 23 C64 25 66 31 65 37 C60 30 52 29 46 33 C42 36 39 40 36 45 Z" fill="${c}"/>`],
    straight: c => [`<path d="M33 44 C31 26 40 20 50 20 C60 20 69 26 67 44 L69 78 L58 78 L57 60 L43 60 L42 78 L31 78 Z" fill="${c}"/>`,
      `<path d="M36 40 C36 27 43 22 50 22 C57 22 64 27 64 40 C60 32 55 29 50 29 C45 29 40 32 36 40 Z" fill="${c}"/>`],
    bob: c => [`<path d="M33 42 C32 26 40 21 50 21 C60 21 68 26 67 42 L68 58 C61 60 57 58 56 56 L44 56 C43 58 39 60 32 58 Z" fill="${c}"/>`,
      `<path d="M36 37 C36 27 43 23 50 23 C57 23 64 27 64 37 C58 34 42 34 36 37 Z" fill="${c}"/>`],
    bun: c => [`<circle cx="50" cy="21" r="7" fill="${c}"/>`, frontHair(c)],
    sideBuns: c => [`<circle cx="31" cy="42" r="8" fill="${c}"/><circle cx="69" cy="42" r="8" fill="${c}"/>`, frontHair(c)],
    braid: c => [`<path d="M60 50 Q72 60 66 84" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"/>`, frontHair(c)],
    waves: c => [`<path d="M34 44 C31 27 40 21 50 21 C61 21 69 27 66 44 C68 52 66 58 62 61 C60 56 61 50 60 46 L40 46 C39 50 40 56 38 61 C34 58 32 52 34 44 Z" fill="${c}"/>`,
      `<path d="M36 42 C35 28 42 22 52 22 C62 22 66 28 65 38 C58 31 48 30 43 35 C40 38 38 41 36 46 Z" fill="${c}"/>`],
    longCurly: c => [`<path d="M33 46 C29 28 38 20 50 20 C63 20 71 28 67 46 C69 56 67 64 69 70 L31 70 C33 64 31 56 33 46 Z" fill="${c}"/>` + curls(c, 5.5, 18, 18), frontHair(c)],
    spiky: c => ['', `<path d="M35 40 L33 26 L39 31 L40 19 L45 28 L50 16 L54 27 L60 19 L60 30 L67 26 L65 40 C61 32 56 29 50 29 C44 29 39 32 35 40 Z" fill="${c}"/>`],
    none: () => ['', ''],
  };
  const MEN_HAIR = ['short', 'cropped', 'sidePart', 'balding', 'curly', 'afro'];
  const WOMEN_HAIR = ['long', 'bob', 'bun', 'waves', 'longCurly', 'afro', 'curly'];
  const hair = (style, c) => HAIR_STYLES[style](c);

  // ---- Face extras (faces stay blank) ----
  const glasses = c => `<g fill="none" stroke="${c}" stroke-width="1.6"><circle cx="44.5" cy="42" r="4"/><circle cx="55.5" cy="42" r="4"/><path d="M48.5 42 H51.5"/></g>`;
  const mustache = c => `<path d="M42.5 52 Q46 48.5 50 50.5 Q54 48.5 57.5 52 Q54 51 50 52 Q46 51 42.5 52 Z" fill="${c}"/>`;
  const beard = c => `<path d="M36 44 C36 57 42 61.5 50 61.5 C58 61.5 64 57 64 44 C62 51 58 53 54 52.5 Q50 51 46 52.5 C42 53 38 51 36 44 Z" fill="${c}"/>`;
  const goatee = c => `<path d="M45 53 Q50 51 55 53 L53 61 Q50 63 47 61 Z" fill="${c}"/>` + mustache(c);
  // A long beard down over the chest (dwarves, wizards), braided or not.
  const longBeard = (c, braids = false) => `<path d="M36 44 C35 60 38 78 44 92 L50 98 L56 92 C62 78 65 60 64 44 C62 51 58 53 54 52.5 Q50 51 46 52.5 C42 53 38 51 36 44 Z" fill="${c}"/>`
    + (braids ? `<path d="M44 70 L46 92 M56 70 L54 92" stroke="${shade(c, -0.3)}" stroke-width="1.2"/><circle cx="46" cy="90" r="1.8" fill="#c9a646"/><circle cx="54" cy="90" r="1.8" fill="#c9a646"/>` : '')
    + mustache(shade(c, -0.1));
  const lips = c => `<path d="M46.8 52.6 Q50 50.8 53.2 52.6 Q50 55.4 46.8 52.6 Z" fill="${c}"/>`;
  const earrings = c => `<circle cx="36" cy="49.5" r="1.7" fill="${c}"/><circle cx="64" cy="49.5" r="1.7" fill="${c}"/>`;
  const people = woman => {
    let f = '';
    if (woman && chance(0.5)) f += lips(pick(['#b5172b', '#8c2a3a', '#c2263c']));
    if (woman && chance(0.5)) f += earrings(pick(['#f6f1e3', '#e3b843']));
    return f;
  };
  const whiskers = (woman, c) => (woman ? '' : chance(0.3) ? beard(c) : chance(0.3) ? mustache(c) : '');

  // ---- Backgrounds ----
  const stars = () => Array.from({ length: 16 }, () => `<circle cx="${rnd(2, 98)}" cy="${rnd(2, 70)}" r="${pick([0.5, 0.7, 1])}" fill="#fff" opacity="${pick([0.5, 0.7, 0.9])}"/>`).join('');
  const rain = () => `<g stroke="#bfe4ff" stroke-width="0.5" opacity="0.35">${Array.from({ length: 14 }, () => { const x = rnd(0, 100), y = rnd(0, 60); return `<path d="M${x} ${y} l-3 9"/>`; }).join('')}</g>`;
  const neon = () => `<circle cx="${rnd(12, 88)}" cy="${rnd(8, 30)}" r="20" fill="${pick(['#ff3fa4', '#3ff2ff', '#ffb13f', '#a05cff'])}" opacity="0.28"/>`;
  const rays = c => `<g fill="${c}" opacity="0.16">${Array.from({ length: 12 }, (_, i) => { const a = i * 30 * Math.PI / 180, b = (i * 30 + 12) * Math.PI / 180; return `<path d="M50 42 L${(50 + 90 * Math.cos(a)).toFixed(1)} ${(42 + 90 * Math.sin(a)).toFixed(1)} L${(50 + 90 * Math.cos(b)).toFixed(1)} ${(42 + 90 * Math.sin(b)).toFixed(1)} Z"/>`; }).join('')}</g>`;
  const slime = () => `<path d="M0 0 H100 V6 Q92 6 90 12 Q88 18 86 10 Q82 5 74 7 Q70 9 68 16 Q66 22 64 9 Q60 4 50 6 Q40 4 38 12 Q36 19 34 8 Q28 3 20 6 Q14 8 13 15 Q11 20 9 7 Q6 4 0 6 Z" fill="#7ed957" opacity="0.55"/>`;
  const hills = c => `<path d="M0 80 L18 58 L30 70 L46 48 L62 68 L76 54 L100 76 V100 H0 Z" fill="${c}" opacity="0.35"/>`;

  // ======================================================================
  // Set styles: each returns one portrait's art (`woman`, `skin` chosen by makePortraits).
  // ======================================================================

  const everyday = (woman, skin) => {
    const hc = pick(HAIR);
    const [b, f] = hair(pick(woman ? WOMEN_HAIR : MEN_HAIR), hc);
    const outfitName = pick(woman ? WOMEN_OUTFITS : MEN_OUTFITS);
    const face = whiskers(woman, hc) + people(woman) + (chance(0.25) ? glasses(pick(['#1a1a1a', '#7a1020', '#5a3b22'])) : '');
    return figure({ back: b, skin, neck: outfitName !== 'turtleneck', outfit: OUTFITS[outfitName](pick(CLOTHES), shade(skin, -0.14)), face, front: f });
  };

  // ---- Blade Runner: rain, neon, trench coats, see-through raincoats, the odd replicant glint ----
  const BR_BG = ['#1d2b3a', '#2a1d3a', '#14303a', '#3a1d2c', '#1e2a2a', '#2b2340'];
  const bladerunner = (woman, skin) => {
    const hc = pick(HAIR), c = pick(['#5a4a3a', '#3a3a40', '#6b5a3a', '#2a2a2e', '#4a3a2e']);
    const style = woman ? pick(['waves', 'bob', 'spiky', 'long', 'bun']) : pick(['slicked', 'cropped', 'short', 'sidePart', 'spiky']);
    const [b, f] = hair(style, style === 'spiky' ? pick(['#f1ead8', '#e8d07a', hc]) : hc);
    const highCollar = col => `<path d="M33 66 L42 76 L45 58 Z M67 66 L58 76 L55 58 Z" fill="${col}"/>`;
    const outfits = [
      () => [shoulders(c) + shirtV(pick(['#e9e4da', '#9aa0a8'])) + tie('#2a2a2a') + lapels(shade(c, -0.2)), highCollar(shade(c, -0.1))], // trench coat
      () => [shoulders(pick(CLOTHES)) + shoulders('rgba(225,240,255,0.42)') + `<path d="M50 74 V100" stroke="rgba(255,255,255,0.6)" stroke-width="0.8"/>`, highCollar('rgba(225,240,255,0.5)')], // see-through raincoat
      () => [shoulders('#1b1b1f') + zipper('#8a8a92') + lapels('#2a2a30'), ''], // leather jacket
      () => [`<path d="M5 100 C5 77 20 69 34 71 L50 74 L66 71 C80 69 95 77 95 100 Z" fill="${pick(['#3a2a4a', '#1f1f28', '#5a2a3a'])}"/>` + necklineV(shade(skin, -0.14)), ''], // 80s shoulder pads
    ];
    const [outfit, collarFront] = pick(outfits)();
    let face = whiskers(woman, hc) + people(woman);
    if (style === 'spiky' && woman) face += '<rect x="36" y="37" width="28" height="9" rx="4.5" fill="#15151f" opacity="0.85"/>'; // dark eye band
    if (chance(0.3)) face += '<circle cx="44.5" cy="42" r="1.2" fill="#ff6a3a"/><circle cx="55.5" cy="42" r="1.2" fill="#ff6a3a"/>'; // the eye shine
    return figure({ decor: neon() + rain(), back: b, skin, outfit, face, front: f + collarFront });
  };

  // ---- Ghostbusters: jumpsuits and pack straps, lab coats, New Yorkers, and ghosts ----
  const GB_BG = ['#5a6b7a', '#6b5a4a', '#3f5a4f', '#7a6a5a', '#4a5566', '#5c4a5f'];
  const ghost = () => {
    const g = pick(['#8fe08a', '#9ad7f0', '#c9a4f0']);
    return `<path d="M24 100 L24 46 C24 24 36 16 50 16 C64 16 76 24 76 46 L76 100 L70 92 L64 100 L57 92 L50 100 L43 92 L36 100 L30 92 Z" fill="${g}" opacity="0.88"/>`
      + `<path d="M24 64 Q12 58 10 70 Q18 68 24 74 Z M76 64 Q88 58 90 70 Q82 68 76 74 Z" fill="${g}" opacity="0.88"/>`
      + '<ellipse cx="43" cy="42" rx="4" ry="5.5" fill="#1b2a1b" opacity="0.8"/><ellipse cx="57" cy="42" rx="4" ry="5.5" fill="#1b2a1b" opacity="0.8"/><ellipse cx="50" cy="56" rx="5" ry="3.5" fill="#1b2a1b" opacity="0.7"/>';
  };
  const ghostbusters = (woman, skin) => {
    const kind = chance(0.18) ? 'ghost' : pick(['buster', 'buster', 'scientist', 'citizen']);
    if (kind === 'ghost') return slime() + ghost();
    const hc = pick(HAIR);
    const [b, f] = hair(pick(woman ? WOMEN_HAIR : MEN_HAIR), hc);
    let outfit, face = whiskers(woman, hc) + people(woman);
    if (kind === 'buster') {
      const suit = pick(['#b9a77c', '#8f8f86', '#a89a72']);
      outfit = shoulders(suit) + zipper(shade(suit, -0.35))
        + '<path d="M24 76 L31 100 M76 76 L69 100" stroke="#2b2b2b" stroke-width="5"/>' // proton pack straps
        + `<rect x="34" y="82" width="11" height="4" rx="1" fill="#f4f1ea"/>` // name tag
        + '<circle cx="61" cy="86" r="4.5" fill="#fff" stroke="#c62828" stroke-width="1.4"/><path d="M57.8 82.8 L64.2 89.2" stroke="#c62828" stroke-width="1.4"/>'; // the no-ghost badge
    } else if (kind === 'scientist') {
      outfit = shoulders('#f2f2ee') + shirtV(pick(['#c9d6e6', '#efe6c8'])) + tie(pick(CLOTHES)) + lapels('#e2e2dc');
      if (chance(0.6)) face += glasses('#1a1a1a');
    } else outfit = OUTFITS[pick(woman ? WOMEN_OUTFITS : MEN_OUTFITS)](pick(CLOTHES), shade(skin, -0.14));
    return figure({ decor: chance(0.35) ? slime() : '', back: b, skin, outfit, face, front: f });
  };

  // ---- Star Wars: pilots, smugglers, Jedi, senators, troopers and aliens, under the stars ----
  const SW_BG = ['#0e1530', '#1a1030', '#0b1f2a', '#24122a', '#101820', '#1d1a33'];
  const ALIEN_SKIN = ['#6fa86a', '#5a8ad6', '#c0504a', '#a58ad6', '#d9a441', '#4fb3a8'];
  const pilotHelmet = () => '<path d="M32 46 C30 24 40 17 50 17 C60 17 70 24 68 46 L64 47 C63 35 58 30 50 30 C42 30 37 35 36 47 Z" fill="#ececec"/><path d="M50 17 V30" stroke="#c62828" stroke-width="3"/><path d="M33 40 H38 M62 40 H67" stroke="#c62828" stroke-width="2.5"/>';
  const hood = c => [`<path d="M28 60 C26 30 36 16 50 16 C64 16 74 30 72 60 L66 76 L34 76 Z" fill="${c}"/>`,
    `<path d="M33 56 C31 34 39 22 50 22 C61 22 69 34 67 56 L64 48 C63 36 58 28 50 28 C42 28 37 36 36 48 Z" fill="${shade(c, -0.15)}"/>`];
  const starwars = (woman, skin) => {
    const decor = stars();
    const kind = pick(['pilot', 'smuggler', 'jedi', 'senator', 'trooper', 'alien', 'alien', 'wookiee']);
    const hc = pick(HAIR);
    if (kind === 'trooper') {
      return decor + broad('#ececec') + '<path d="M30 80 H70 M36 88 H64" stroke="#2a2a2a" stroke-width="2"/>'
        + '<path d="M34 46 C32 24 41 18 50 18 C59 18 68 24 66 46 L64 58 Q50 66 36 58 Z" fill="#f2f2f2"/>'
        + '<path d="M38 40 Q44 36 48 41 L46 46 Q41 46 38 40 Z M62 40 Q56 36 52 41 L54 46 Q59 46 62 40 Z" fill="#1a1a1a"/><path d="M45 54 H55 L53 58 H47 Z" fill="#555"/>';
    }
    if (kind === 'wookiee') {
      const fur = pick(['#6b4a2b', '#8a6340', '#4a3420']);
      // A shaggy head (a ring of fur tufts), a darker brow over a lighter muzzle, and a bandolier.
      const tufts = Array.from({ length: 22 }, (_, i) => {
        const t = i / 22 * Math.PI * 2, r = i % 2 ? 25 : 21;
        return `${(50 + r * Math.cos(t)).toFixed(1)} ${(46 + r * 1.15 * Math.sin(t)).toFixed(1)}`;
      }).join(' L');
      return decor + broad(fur) + `<path d="M8 100 C10 84 20 76 32 73 L30 82 L24 86 L20 100 Z M92 100 C90 84 80 76 68 73 L70 82 L76 86 L80 100 Z" fill="${shade(fur, -0.15)}"/>`
        + '<path d="M22 78 L78 98" stroke="#3a2a1a" stroke-width="5"/><rect x="40" y="83" width="5" height="7" fill="#9a8a6a" transform="rotate(20 42 86)"/><rect x="52" y="87" width="5" height="7" fill="#9a8a6a" transform="rotate(20 54 90)"/>'
        + `<path d="M${tufts} Z" fill="${fur}"/>`
        + `<path d="M34 40 Q50 33 66 40 L65 47 Q50 42 35 47 Z" fill="${shade(fur, -0.35)}"/>` // brow
        + `<ellipse cx="50" cy="57" rx="10" ry="9" fill="${shade(fur, 0.25)}"/><ellipse cx="50" cy="51" rx="3.4" ry="2.2" fill="#2a1a10"/>`; // muzzle and nose
    }
    let s = skin, ears = 'normal', back = '', front = '', outfit = '', face = '';
    let [b, f] = hair(woman ? pick(['long', 'bun', 'braid', 'bob', 'sideBuns']) : pick(['short', 'cropped', 'curly', 'sidePart']), hc);
    if (kind === 'pilot') {
      outfit = shoulders('#d9661f') + '<path d="M38 74 L44 100 M62 74 L56 100" stroke="#f0f0f0" stroke-width="5"/><rect x="45" y="84" width="10" height="7" rx="1.5" fill="#9a9a9a"/>';
      if (chance(0.6)) { b = ''; f = pilotHelmet(); }
    } else if (kind === 'smuggler') {
      outfit = shoulders('#ece6d6') + openVest(pick(['#1f1f22', '#3a2a1e', '#2a3340'])) + necklineV(shade(skin, -0.14));
    } else if (kind === 'jedi') {
      const robe = pick(['#6b4a2b', '#4a3420', '#7a6a50']);
      outfit = shoulders(robe) + '<path d="M38 72 L50 88 L62 72 L58 72 L50 82 L42 72 Z" fill="#e8dcc0"/>';
      if (chance(0.45)) { const [hb, hf] = hood(robe); back = hb; f = hf; b = ''; }
      if (!woman && chance(0.4)) face += beard(hc);
    } else if (kind === 'senator') {
      outfit = shoulders(pick(['#f4f1ea', '#7a2e3a', '#2e3a6b'])) + collar() + (chance(0.5) ? pearls() : '');
      [b, f] = hair(woman ? pick(['sideBuns', 'bun', 'braid']) : 'sidePart', hc);
      face += people(woman);
    } else { // alien
      s = pick(ALIEN_SKIN);
      outfit = shoulders(pick(CLOTHES)) + necklineV(shade(s, -0.14));
      if (chance(0.6)) { // head-tails
        const t = shade(s, -0.08);
        back = `<path d="M38 36 C28 44 26 62 30 84 L37 84 C35 64 38 50 44 40 Z M62 36 C72 44 74 62 70 84 L63 84 C65 64 62 50 56 40 Z" fill="${t}"/>`;
        b = ''; f = `<path d="M36 36 C38 24 44 21 50 21 C56 21 62 24 64 36 C58 31 42 31 36 36 Z" fill="${t}"/>`; ears = 'none';
      } else { b = ''; f = `<path d="M40 26 L36 14 L44 24 Z M60 26 L64 14 L56 24 Z" fill="${shade(s, -0.2)}"/>`; } // horns
    }
    if (kind !== 'alien' && kind !== 'senator') face += people(woman);
    return figure({ decor, back: back + b, skin: s, outfit, ears, face, front: f + front });
  };

  // ---- Lord of the Rings: dwarves, elves, wizards, hobbits and warriors ----
  const LOTR_BG = ['#3e4a2f', '#5a4a2e', '#2f3e3a', '#6b5636', '#3a3a4a', '#4a2f2f'];
  const lotr = (woman, skin) => {
    const decor = hills(pick(['#1f2a1a', '#2a2418', '#1a2228']));
    const kind = pick(['dwarf', 'elf', 'wizard', 'hobbit', 'warrior']);
    const hc = pick(HAIR);
    if (kind === 'dwarf') {
      const bc = pick(['#7a3a1c', '#4a2e1c', '#2b1b12', '#9a9a9a', '#c06a2a']);
      const helm = chance(0.5)
        ? '<path d="M34 38 C34 22 42 18 50 18 C58 18 66 22 66 38 Z" fill="#8d939a"/><rect x="31" y="35" width="38" height="5" rx="2" fill="#6b7178"/><path d="M48 18 H52 V44 H48 Z" fill="#6b7178"/>'
        : frontHair(bc);
      return figure({ decor, skin, outfit: mail() + '<rect x="24" y="90" width="52" height="6" fill="#5a3a1e"/><rect x="46" y="89" width="8" height="8" rx="1" fill="#c9a646"/>', face: longBeard(bc, chance(0.6)), front: helm });
    }
    if (kind === 'elf') {
      const ec = pick(['#f0e2b6', '#e8d07a', '#141010', '#d8d8d8', '#7a4a26']);
      const [b, f] = hair('straight', ec);
      const robe = pick(['#3f6e4a', '#6b7a8a', '#4a5a3a', '#8a7a5a']);
      const circlet = chance(0.6) ? '<path d="M36 33 Q50 28 64 33" stroke="#e3c35a" stroke-width="1.6" fill="none"/><circle cx="50" cy="30" r="1.8" fill="#bfe4ff"/>' : '';
      return figure({ decor, back: b, skin, ears: 'elf', outfit: shoulders(robe) + necklineV(shade(skin, -0.14)) + '<path d="M44 76 L48 72 L52 76 L48 80 Z" fill="#e3c35a"/>', face: people(woman), front: f + circlet });
    }
    if (kind === 'wizard') {
      const robe = pick(['#8d8d92', '#e8e8e2', '#4a3a6b', '#6b4a2b']);
      const bc = pick(['#d8d8d8', '#f4f1ea', '#9a9a9a']);
      const hat = `<path d="M24 34 Q50 26 76 34 Q50 40 24 34 Z" fill="${shade(robe, -0.15)}"/><path d="M34 32 Q40 18 52 4 Q56 16 66 32 Q50 28 34 32 Z" fill="${robe}"/>`;
      const [b] = hair('straight', bc);
      return figure({ decor, back: b, skin, outfit: shoulders(robe) + '<path d="M50 74 V100" stroke="' + shade(robe, -0.3) + '" stroke-width="1"/>', face: woman ? people(true) : longBeard(bc), front: hat });
    }
    if (kind === 'hobbit') {
      const [b, f] = hair('curly', pick(['#4a2e1c', '#7a4a26', '#2b1b12', '#d8b56a']));
      return figure({ decor, back: b, skin, ears: 'hobbit', outfit: shoulders('#efe6cf') + vest(pick(['#6b4a2b', '#7a6a2a', '#3f5a3a', '#8a3a2a'])) + '<circle cx="47" cy="84" r="1.2" fill="#c9a646"/><circle cx="53" cy="84" r="1.2" fill="#c9a646"/>', face: people(woman), front: f });
    }
    // warrior: mail, a cloak at the shoulders, a helmet or long hair
    const cloak = pick(['#2f4a3a', '#5a2a2a', '#3a3a4a', '#6b5636']);
    const [b, f] = hair(woman ? 'braid' : pick(['long', 'straight', 'short']), hc);
    const helm = !woman && chance(0.45) ? '<path d="M34 40 C34 22 42 18 50 18 C58 18 66 22 66 40 L62 40 C62 30 57 26 50 26 C43 26 38 30 38 40 Z" fill="#a8a8a0"/><path d="M50 6 L53 18 L47 18 Z" fill="#c9a646"/>' : '';
    return figure({ decor, back: `<path d="M8 100 C8 80 24 70 50 70 C76 70 92 80 92 100 Z" fill="${cloak}"/>` + (helm ? '' : b), skin, outfit: mail() + `<path d="M8 100 C10 84 18 76 30 73 L34 100 Z M92 100 C90 84 82 76 70 73 L66 100 Z" fill="${cloak}"/><circle cx="34" cy="76" r="2.5" fill="#c9a646"/>`, face: whiskers(woman, hc) + people(woman), front: helm || f });
  };

  // ---- Marvel: suits of armour, masks, capes, Asgardians, sorcerers and spies ----
  const MARVEL_BG = ['#c62828', '#1565c0', '#6a1b9a', '#f9a825', '#2e7d32', '#00838f'];
  const marvel = (woman, skin) => {
    const decor = rays('#fff');
    const kind = pick(['armour', 'patriot', 'spider', 'asgardian', 'wakandan', 'sorcerer', 'spy', 'scientist']);
    const hc = pick(HAIR);
    if (kind === 'armour') {
      return decor + broad('#b71c1c') + '<path d="M30 76 L40 72 L44 100 L32 100 Z M70 76 L60 72 L56 100 L68 100 Z" fill="#f2b632"/><circle cx="50" cy="86" r="5" fill="#dff6ff" stroke="#9adcff" stroke-width="2"/>'
        + '<path d="M34 46 C32 24 41 18 50 18 C59 18 68 24 66 46 L63 58 Q50 64 37 58 Z" fill="#b71c1c"/><path d="M39 32 C40 27 45 25 50 25 C55 25 60 27 61 32 L60 50 Q50 58 40 50 Z" fill="#f2b632"/>'
        + '<path d="M41 39 H47 M53 39 H59" stroke="#dff6ff" stroke-width="2"/>';
    }
    if (kind === 'spider') {
      const web = '#1a1a1a';
      return decor + shoulders('#c62828') + `<path d="M8 100 C8 90 14 82 22 78 L30 100 Z M92 100 C92 90 86 82 78 78 L70 100 Z" fill="#1e4fa8"/><path d="M50 74 V100 M38 76 L44 100 M62 76 L56 100" stroke="${web}" stroke-width="0.6"/>`
        + `<rect x="43" y="54" width="14" height="22" rx="4" fill="#b71c1c"/><ellipse cx="50" cy="42" rx="14.5" ry="17.5" fill="#c62828"/>`
        + `<path d="M50 25 V59 M36 42 H64 M38 31 L62 53 M62 31 L38 53" stroke="${web}" stroke-width="0.5"/>`
        + `<path d="M39 38 Q45 33 48 41 Q44 46 39 38 Z M61 38 Q55 33 52 41 Q56 46 61 38 Z" fill="#f4f8ff" stroke="${web}" stroke-width="1"/>`;
    }
    let back = '', outfit = '', face = people(woman), front = '';
    let [b, f] = hair(pick(woman ? WOMEN_HAIR : MEN_HAIR), hc);
    if (kind === 'patriot') {
      outfit = shoulders('#1e3f8a') + '<path d="M50 78 L52.4 84.5 L59 84.5 L53.7 88.5 L55.7 95 L50 91 L44.3 95 L46.3 88.5 L41 84.5 L47.6 84.5 Z" fill="#f4f1ea"/>';
      if (chance(0.5)) { b = ''; f = '<path d="M35 46 C33 24 41 19 50 19 C59 19 67 24 65 46 L62 46 C62 34 57 29 50 29 C43 29 38 34 38 46 Z" fill="#1e3f8a"/><path d="M34 36 L28 30 L35 33 Z M66 36 L72 30 L65 33 Z" fill="#f4f1ea"/>'; }
    } else if (kind === 'asgardian') {
      back = '<path d="M14 100 C14 80 26 70 50 70 C74 70 86 80 86 100 Z" fill="#b71c1c"/>';
      outfit = broad('#5a5f68') + [38, 62].map(x => [80, 92].map(y => `<circle cx="${x}" cy="${y}" r="4" fill="#c0c6ce" stroke="#3a3f48" stroke-width="1"/>`).join('')).join('');
      [b, f] = hair(pick(['long', 'straight', 'braid']), pick(['#e8d07a', '#d8b56a', '#141010', '#8c2a1c']));
      if (chance(0.35)) f += '<path d="M36 34 C36 24 43 21 50 21 C57 21 64 24 64 34 Z" fill="#c0c6ce"/><path d="M36 30 Q26 22 24 30 Q30 28 36 34 Z M64 30 Q74 22 76 30 Q70 28 64 34 Z" fill="#f4f1ea"/>';
      if (!woman && chance(0.5)) face += beard(pick(['#e8d07a', '#8c2a1c', '#4a2e1c']));
    } else if (kind === 'wakandan') {
      outfit = shoulders(woman ? '#a3242e' : '#1b1b22') + (woman ? '<path d="M30 78 L40 72 L44 86 Z M70 78 L60 72 L56 86 Z" fill="#d4a52c"/>' : '<path d="M30 80 L50 90 L70 80" stroke="#8a6adf" stroke-width="1.2" fill="none"/>')
        + Array.from({ length: 7 }, (_, i) => `<path d="M${41 + i * 3} ${74 + Math.abs(3 - i) * -0.8 + 3} l1.5 4 l1.5 -4 Z" fill="#e8e4d8"/>`).join('');
      if (woman) { b = ''; f = '<path d="M37 34 Q50 24 63 34" stroke="#d4a52c" stroke-width="1.2" fill="none"/>'; face += '<rect x="44" y="62" width="12" height="3" rx="1.5" fill="#d4a52c"/><rect x="44" y="66" width="12" height="3" rx="1.5" fill="#d4a52c"/>'; }
    } else if (kind === 'sorcerer') {
      back = '<path d="M26 74 L22 40 Q30 50 36 62 Z M74 74 L78 40 Q70 50 64 62 Z" fill="#b71c1c"/>';
      outfit = shoulders('#1e3f8a') + '<path d="M8 100 C10 84 18 76 30 73 L36 100 Z M92 100 C90 84 82 76 70 73 L64 100 Z" fill="#b71c1c"/><circle cx="50" cy="80" r="3.5" fill="#d4a52c" stroke="#3ccf6a" stroke-width="1"/>';
      if (!woman) { face += goatee(hc); [b, f] = hair('slicked', hc); f += '<path d="M36 36 L38 30 M64 36 L62 30" stroke="#d8d8d8" stroke-width="2.5"/>'; }
    } else if (kind === 'spy') {
      outfit = shoulders('#151518') + zipper('#55555c') + '<rect x="24" y="92" width="52" height="4" fill="#2a2a30"/><circle cx="50" cy="94" r="2.5" fill="#c62828"/>';
      if (woman) [b, f] = hair(pick(['waves', 'bob', 'long']), pick(['#b33a1c', '#d8b56a', '#141010']));
    } else { // scientist
      outfit = shoulders(pick(['#5a3a7a', '#3a4a6b', '#6e6e73'])) + collar();
      if (chance(0.6)) face += glasses('#1a1a1a');
      face += whiskers(woman, hc);
    }
    return figure({ decor, back: back + b, skin, outfit, face, front: f + front });
  };

  const STYLES = {
    bladerunner: { draw: bladerunner, bg: BR_BG },
    ghostbusters: { draw: ghostbusters, bg: GB_BG },
    starwars: { draw: starwars, bg: SW_BG },
    lotr: { draw: lotr, bg: LOTR_BG },
    marvel: { draw: marvel, bg: MARVEL_BG },
  };

  return function makePortraits(n, setKey = null) {
    const style = STYLES[setKey] || { draw: everyday, bg: BG };
    // Half women, half men; every skin tone used before any repeats.
    const genders = shuffle(Array.from({ length: n }, (_, i) => i % 2 === 0));
    const skins = [];
    while (skins.length < n) skins.push(...shuffle(SKIN));
    const bgs = [];
    while (bgs.length < n) bgs.push(...shuffle(style.bg));
    return genders.map((woman, i) => ({
      bg: bgs[i],
      svg: `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${style.draw(woman, skins[i])}</svg>`,
    }));
  };
})();
