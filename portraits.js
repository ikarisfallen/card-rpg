'use strict';

// Flat, faceless portraits of everyday people for the backs of Relationship cards.
// makePortraits(n) draws a fresh random set: gender balanced, with skin tones spread
// evenly, and random hair, clothes and small accessories. Drawn in a 100×100 viewBox.

const makePortraits = (() => {
  const SKIN = ['#f3d2b8', '#e5b48f', '#c98d63', '#a46a43', '#7c4a2b', '#59341f'];
  const HAIR = ['#141010', '#2b1b12', '#4a2e1c', '#7a4a26', '#8c2a1c', '#d8b56a', '#f0e2b6', '#9a9a9a'];
  const CLOTHES = ['#26262e', '#3b4a63', '#5e2a4a', '#2f4a3a', '#7a2e3a', '#8a6d3b', '#4a3566', '#6e6e73', '#b39a6b', '#c76d7e', '#2e5f6b', '#d4a52c'];
  const BG = ['#5b7189', '#7a2e3a', '#3d4f6b', '#34433a', '#4a3566', '#8a6d3b', '#5c2a2a', '#3f6e6a', '#6b5636', '#2c3e57', '#4d4d4d', '#6d3f5f'];

  const pick = list => list[randInt(list.length)];
  const chance = p => randInt(1000) < p * 1000;

  // Lighten (amt > 0) or darken (amt < 0) a #rrggbb colour.
  function shade(hex, amt) {
    const n = parseInt(hex.slice(1), 16);
    const mix = c => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt);
    const r = mix(n >> 16), g = mix((n >> 8) & 255), b = mix(n & 255);
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  }

  // ---- Clothes ----
  const shoulders = c => `<path d="M8 100 C8 81 27 72 50 72 C73 72 92 81 92 100 Z" fill="${c}"/>`;
  const shirtV = (c = '#f4f1ea') => `<path d="M42 72 L50 87 L58 72 Z" fill="${c}"/>`;
  const necklineV = c => `<path d="M40 72 L50 85 L60 72 Z" fill="${c}"/>`;
  const scoop = c => `<path d="M38 73 Q50 88 62 73 Z" fill="${c}"/>`;
  const tie = c => `<path d="M48.6 75 L51.4 75 L53.2 90 L50 95 L46.8 90 Z" fill="${c}"/><path d="M47.6 72.5 L52.4 72.5 L51.4 76 L48.6 76 Z" fill="${shade(c, -0.25)}"/>`;
  const lapels = c => `<path d="M42 72 L50 90 L45 100 L30 77 Q35 73 42 72 Z" fill="${c}"/><path d="M58 72 L50 90 L55 100 L70 77 Q65 73 58 72 Z" fill="${c}"/>`;
  const bowtie = c => `<path d="M43.5 73 L50 76.5 L43.5 80 Z M56.5 73 L50 76.5 L56.5 80 Z" fill="${c}"/><circle cx="50" cy="76.5" r="1.8" fill="${shade(c, -0.3)}"/>`;
  const vest = c => `<path d="M38 74 L50 92 L62 74 L66 100 L34 100 Z" fill="${c}"/>`;
  const collar = () => `<path d="M40 72 Q45 79 50 74 Q55 79 60 72 Q55 72 50 73 Q45 72 40 72 Z" fill="#f4f1ea"/>`;
  const turtleneck = c => `<rect x="41.5" y="61" width="17" height="14" rx="4" fill="${shade(c, 0.1)}"/><path d="M41.5 66 H58.5 M41.5 70 H58.5" stroke="${shade(c, -0.2)}" stroke-width="0.8"/>`;
  const pearls = () => Array.from({ length: 9 }, (_, i) => {
    const x = 41 + i * 2.25;
    return `<circle cx="${x}" cy="${80 - ((x - 50) ** 2) / 22}" r="1.25" fill="#f6f1e3"/>`;
  }).join('');

  const OUTFITS = {
    suit: (c, skin) => shoulders(c) + shirtV() + tie(pick(CLOTHES)) + lapels(shade(c, -0.18)),
    vest: c => shoulders('#efece4') + vest(c) + bowtie('#1a1a1a'),
    openCollar: (c, skin) => shoulders(c) + necklineV(skin) + lapels(shade(c, -0.15)),
    turtleneck: c => shoulders(c) + turtleneck(c),
    blouse: c => shoulders(c) + collar(),
    dress: (c, skin) => shoulders(c) + scoop(skin) + (chance(0.4) ? pearls() : ''),
    blazer: (c, skin) => shoulders(c) + shirtV() + lapels(shade(c, -0.18)),
  };
  const MEN_OUTFITS = ['suit', 'vest', 'openCollar', 'turtleneck', 'blazer'];
  const WOMEN_OUTFITS = ['blouse', 'dress', 'blazer', 'turtleneck', 'openCollar'];

  // ---- Hair: [behind the head, in front of it] ----
  const front = c => `<path d="M36 40 C34 26 41 22 50 22 C59 22 66 26 64 40 C62 32 57 29 50 29 C43 29 38 32 36 40 Z" fill="${c}"/>`;
  const curls = (c, r = 5, rx = 15, ry = 16) => {
    const dots = [];
    for (let a = 165; a >= 15; a -= 12) {
      const t = a * Math.PI / 180;
      dots.push(`<circle cx="${(50 + rx * Math.cos(t)).toFixed(1)}" cy="${(39 - ry * Math.sin(t)).toFixed(1)}" r="${r}" fill="${c}"/>`);
    }
    return dots.join('');
  };
  const HAIR_STYLES = {
    short: c => ['', front(c)],
    cropped: c => ['', `<path d="M37 36 C37 27 43 24 50 24 C57 24 63 27 63 36 C60 31 55 29.5 50 29.5 C45 29.5 40 31 37 36 Z" fill="${c}"/>`],
    sidePart: c => ['', front(c) + `<path d="M43 24 Q46 27 46.5 30.5" stroke="${shade(c, 0.35)}" stroke-width="0.9" fill="none"/>`],
    balding: c => ['', `<path d="M36 35 C34 40 35 46 36.5 48.5 L38.5 48.5 L38.5 37 Z M64 35 C66 40 65 46 63.5 48.5 L61.5 48.5 L61.5 37 Z" fill="${c}"/>`],
    curly: c => ['', front(c) + curls(c)],
    afro: c => [`<circle cx="50" cy="36" r="23" fill="${c}"/>`, front(c)],
    long: c => [`<path d="M34 46 C29 28 38 20 50 20 C63 20 71 28 67 46 C70 56 66 64 71 72 C64 75 58 72 56 69 L44 69 C42 72 36 75 29 72 C34 64 30 56 34 46 Z" fill="${c}"/>`,
      `<path d="M36 41 C35 27 46 21 57 23 C64 25 66 31 65 37 C60 30 52 29 46 33 C42 36 39 40 36 45 Z" fill="${c}"/>`],
    bob: c => [`<path d="M33 42 C32 26 40 21 50 21 C60 21 68 26 67 42 L68 58 C61 60 57 58 56 56 L44 56 C43 58 39 60 32 58 Z" fill="${c}"/>`,
      `<path d="M36 37 C36 27 43 23 50 23 C57 23 64 27 64 37 C58 34 42 34 36 37 Z" fill="${c}"/>`],
    bun: c => [`<circle cx="50" cy="21" r="7" fill="${c}"/>`, front(c)],
    waves: c => [`<path d="M34 44 C31 27 40 21 50 21 C61 21 69 27 66 44 C68 52 66 58 62 61 C60 56 61 50 60 46 L40 46 C39 50 40 56 38 61 C34 58 32 52 34 44 Z" fill="${c}"/>`,
      `<path d="M36 42 C35 28 42 22 52 22 C62 22 66 28 65 38 C58 31 48 30 43 35 C40 38 38 41 36 46 Z" fill="${c}"/>`],
    longCurly: c => [`<path d="M33 46 C29 28 38 20 50 20 C63 20 71 28 67 46 C69 56 67 64 69 70 L31 70 C33 64 31 56 33 46 Z" fill="${c}"/>` + curls(c, 5.5, 18, 18), front(c)],
  };
  const MEN_HAIR = ['short', 'cropped', 'sidePart', 'balding', 'curly', 'afro'];
  const WOMEN_HAIR = ['long', 'bob', 'bun', 'waves', 'longCurly', 'afro', 'curly'];

  // ---- Face extras (faces stay blank) ----
  const glasses = c => `<g fill="none" stroke="${c}" stroke-width="1.6"><circle cx="44.5" cy="42" r="4"/><circle cx="55.5" cy="42" r="4"/><path d="M48.5 42 H51.5"/></g>`;
  const mustache = c => `<path d="M42.5 52 Q46 48.5 50 50.5 Q54 48.5 57.5 52 Q54 51 50 52 Q46 51 42.5 52 Z" fill="${c}"/>`;
  const beard = c => `<path d="M36 44 C36 57 42 61.5 50 61.5 C58 61.5 64 57 64 44 C62 51 58 53 54 52.5 Q50 51 46 52.5 C42 53 38 51 36 44 Z" fill="${c}"/>`;
  const lips = c => `<path d="M46.8 52.6 Q50 50.8 53.2 52.6 Q50 55.4 46.8 52.6 Z" fill="${c}"/>`;
  const earrings = c => `<circle cx="36" cy="49.5" r="1.7" fill="${c}"/><circle cx="64" cy="49.5" r="1.7" fill="${c}"/>`;

  function person(woman, skin) {
    const neck = shade(skin, -0.14);
    const hairColor = pick(HAIR);
    const [hairBack, hairFront] = HAIR_STYLES[pick(woman ? WOMEN_HAIR : MEN_HAIR)](hairColor);
    const outfitName = pick(woman ? WOMEN_OUTFITS : MEN_OUTFITS);
    const outfit = OUTFITS[outfitName](pick(CLOTHES), neck);

    let face = '';
    if (!woman && chance(0.25)) face += beard(hairColor);
    else if (!woman && chance(0.3)) face += mustache(hairColor);
    if (woman && chance(0.5)) face += lips(pick(['#b5172b', '#8c2a3a', '#c2263c']));
    if (woman && chance(0.6)) face += earrings(pick(['#f6f1e3', '#e3b843']));
    if (chance(0.25)) face += glasses(pick(['#1a1a1a', '#7a1020', '#5a3b22']));

    return `${hairBack}
      ${outfitName === 'turtleneck' ? '' : `<rect x="43" y="54" width="14" height="22" rx="4" fill="${neck}"/>`}
      ${outfit}
      <ellipse cx="36" cy="44" rx="3" ry="4.5" fill="${neck}"/><ellipse cx="64" cy="44" rx="3" ry="4.5" fill="${neck}"/>
      <ellipse cx="50" cy="42" rx="14" ry="17" fill="${skin}"/>
      ${face}${hairFront}`;
  }

  return function makePortraits(n) {
    // Half women, half men; every skin tone used before any repeats.
    const genders = shuffle(Array.from({ length: n }, (_, i) => i % 2 === 0));
    const skins = [];
    while (skins.length < n) skins.push(...shuffle(SKIN));
    const bgs = shuffle(BG);
    return genders.map((woman, i) => {
      const art = person(woman, skins[i]);
      return {
        bg: bgs[i % bgs.length],
        svg: `<svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMax meet" aria-hidden="true">${art}</svg>`,
      };
    });
  };
})();
