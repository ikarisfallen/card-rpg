'use strict';

// Table engine: a pannable/zoomable world of draggable pieces (cards, dice, tokens, pawns).
// Game-specific setup lives in deal.js.

// ---------------------------------------------------------------------------
// World + view (pan / zoom)
// ---------------------------------------------------------------------------

const table = document.getElementById('table');
const world = document.getElementById('world');
const view = { x: 0, y: 0, zoom: 1 };
const worldSize = { w: 1000, h: 1000 };
const MIN_ZOOM = 0.25, MAX_ZOOM = 2.5;

const pieces = [];
let zTop = 10;

function applyView() {
  world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`;
}

function toWorld(clientX, clientY) {
  return { x: (clientX - view.x) / view.zoom, y: (clientY - view.y) / view.zoom };
}

function fitView() {
  // Keep the table clear of the button bars at the top, however many rows they take.
  const bars = ['hud', 'theme-hud'].map(id => document.getElementById(id)).filter(Boolean);
  const pad = 20, hud = Math.max(90, ...bars.map(b => b.getBoundingClientRect().bottom + 10));
  const side = document.getElementById('sim-panel');
  const right = side && !side.hidden ? side.offsetWidth + 24 : 0; // and of the simulator sidebar
  const W = table.clientWidth - right, H = table.clientHeight;
  view.zoom = Math.min((W - pad * 2) / worldSize.w, (H - hud - pad) / worldSize.h);
  view.x = (W - worldSize.w * view.zoom) / 2;
  view.y = hud + (H - hud - pad - worldSize.h * view.zoom) / 2;
  applyView();
}

// ---- Following the action ----
// While `touched.on` (one simulator step), every piece that's added, moved, snapped, flipped or
// pulsed is noted, where it was and where it ends up; followAction() then frames them all.
const touched = { on: false, rects: [] };
function noteTouch(piece) {
  if (touched.on && piece) touched.rects.push({ x: piece.x, y: piece.y, w: piece.w, h: piece.h });
}

// The camera glides to show world rectangle `r` (with some table around it), as large as fits
// beside the button bars and the simulator, but never past MAX_FOLLOW_ZOOM or wider than Fit.
const MAX_FOLLOW_ZOOM = 1, FOLLOW_MIN = { w: 1000, h: 650 }, FOLLOW_PAD = 40;
function frameRect(r) {
  const bars = ['hud', 'theme-hud'].map(id => document.getElementById(id)).filter(Boolean);
  const top = Math.max(90, ...bars.map(b => b.getBoundingClientRect().bottom + 10));
  const side = document.getElementById('sim-panel');
  const right = side && !side.hidden ? side.offsetWidth + 24 : 0;
  const W = table.clientWidth - right, H = table.clientHeight - top;
  const fitZoom = Math.min((W - 40) / worldSize.w, (H - 20) / worldSize.h);
  // Grow a small target to FOLLOW_MIN round its centre, so a lone die still shows where it is.
  const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
  const w = Math.max(r.w, FOLLOW_MIN.w), h = Math.max(r.h, FOLLOW_MIN.h);
  const z = Math.min(MAX_FOLLOW_ZOOM, (W - FOLLOW_PAD * 2) / w, (H - FOLLOW_PAD * 2) / h);
  world.classList.add('camera-move');
  clearTimeout(frameRect.timer);
  frameRect.timer = setTimeout(() => world.classList.remove('camera-move'), 650);
  if (z <= fitZoom) { fitView(); return; } // it's most of the table anyway
  view.zoom = z;
  view.x = W / 2 - cx * z;
  view.y = top + H / 2 - cy * z;
  applyView();
}

// Frame everything noted since the step began (nothing noted: the camera stays put), plus
// whatever the game wants kept in view meanwhile (window.followAlso, e.g. the Fate card during a roll).
function followAction() {
  const rs = touched.rects;
  touched.rects = [];
  if (!rs.length) return;
  if (window.followAlso) rs.push(...window.followAlso());
  const x = Math.min(...rs.map(r => r.x)), y = Math.min(...rs.map(r => r.y));
  const x2 = Math.max(...rs.map(r => r.x + r.w)), y2 = Math.max(...rs.map(r => r.y + r.h));
  frameRect({ x, y, w: x2 - x, h: y2 - y });
}

function zoomAt(clientX, clientY, factor) {
  const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.zoom * factor));
  view.x = clientX - (clientX - view.x) * (z / view.zoom);
  view.y = clientY - (clientY - view.y) * (z / view.zoom);
  view.zoom = z;
  applyView();
}

function clearWorld() {
  closeDieMenu();
  drags.clear();
  pieces.length = 0;
  zones.length = 0;
  world.innerHTML = '';
  zTop = 10;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html != null) node.innerHTML = html;
  return node;
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function randInt(n) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % n;
}

function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Non-interactive scenery (labels, the board mat). Touching it pans the table.
function addStatic(node, x, y) {
  node.classList.add('static');
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  world.appendChild(node);
  return node;
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function addPiece({ kind, className = '', w, h, lift, x = 0, y = 0, rot = 0 }) {
  const node = el('div', `piece ${kind} ${className}`);
  node.style.width = `${w}px`;
  node.style.height = `${h}px`;
  lift.classList.add('lift');
  node.appendChild(lift);
  world.appendChild(node);
  const piece = { el: node, lift, kind, x, y, w, h, rot, heldBy: null, children: [], parent: null };
  node._piece = piece;
  node.style.zIndex = ++zTop;
  pieces.push(piece);
  setPos(piece);
  noteTouch(piece);
  return piece;
}

function setPos(piece) {
  piece.el.style.transform = `translate3d(${piece.x}px, ${piece.y}px, 0) rotate(${piece.rot}deg)`;
}

function moveBy(piece, dx, dy) {
  piece.x += dx;
  piece.y += dy;
  setPos(piece);
  piece.children.forEach(c => moveBy(c, dx, dy));
}

// A child (e.g. a name card tucked under a concept card) travels with its parent.
function attach(parent, child) {
  if (child.parent === parent) return;
  detach(child);
  child.parent = parent;
  parent.children.push(child);
}

function detach(child) {
  if (!child.parent) return;
  child.parent.children = child.parent.children.filter(c => c !== child);
  child.parent = null;
}

// Bring a piece to the top, keeping its tucked children just underneath it.
function raise(piece) {
  piece.children.forEach(raise);
  piece.el.style.zIndex = ++zTop;
}

function removePiece(piece) {
  piece.children.slice().forEach(removePiece);
  leaveZone(piece);
  detach(piece);
  piece.el.remove();
  const i = pieces.indexOf(piece);
  if (i >= 0) pieces.splice(i, 1);
}

// Slide a piece to a spot (programmatic moves, e.g. the simulator).
function glide(piece, x, y) {
  animateOnce(piece, 'animating', 450);
  raise(piece);
  noteTouch(piece);
  moveBy(piece, x - piece.x, y - piece.y);
  noteTouch(piece);
  if (window.onPieceMoved) window.onPieceMoved();
}

function clampToWorld(piece) {
  const nx = Math.min(Math.max(piece.x, 0), worldSize.w - piece.w);
  const ny = Math.min(Math.max(piece.y, 0), worldSize.h - piece.h);
  if (nx !== piece.x || ny !== piece.y) moveBy(piece, nx - piece.x, ny - piece.y);
}

// Plays a CSS animation class once; used for programmatic moves/rotations.
function animateOnce(piece, cls, ms) {
  piece.el.classList.add(cls);
  clearTimeout(piece[`_${cls}`]);
  piece[`_${cls}`] = setTimeout(() => piece.el.classList.remove(cls), ms);
}

// ---- Cards ----

function createCard({ className = '', w, h, front, back, faceUp = true, rot = 0, x, y }) {
  const lift = el('div', null, `
    <div class="card-inner">
      <div class="card-face card-front">${front}</div>
      <div class="card-face card-back">${back}</div>
    </div>`);
  const piece = addPiece({ kind: 'card', className, w, h, lift, x, y, rot });
  piece.faceUp = faceUp;
  piece.el.classList.toggle('face-down', !faceUp);
  return piece;
}

function flipCard(piece) {
  setFaceUp(piece, !piece.faceUp);
}

function setFaceUp(piece, up) {
  noteTouch(piece);
  piece.faceUp = up;
  piece.el.classList.toggle('face-down', !up);
}

function rotateCard(piece) {
  animateOnce(piece, 'animating', 450);
  piece.rot = (piece.rot + 180) % 360;
  setPos(piece);
  tableChanged();
}

// Lets the game react (e.g. re-read names) after a drop, flip or turn.
function tableChanged() {
  if (window.onTableChange) window.onTableChange();
  if (window.onPieceMoved) window.onPieceMoved();
}

// ---- Snap zones ----
// A zone accepts cards of one kind (piece.cardKind). Dropping a card near it slides the
// card in and orients it. A main zone can own a `nameZone`: a tucked slot just above it
// where a face-down card sits under the main card with one name peeking out.

const zones = [];
const SNAP_DIST = 120;

function addZone(zone) {
  zone.occupant = null;
  zones.push(zone);
  return zone;
}

function findZone(piece) {
  if (!piece.cardKind) return null;
  const cx = piece.x + piece.w / 2, cy = piece.y + piece.h / 2;
  let best = null, bestD = SNAP_DIST;
  for (const z of zones) {
    if (z.tucked || z.accepts !== piece.cardKind) continue;
    const d = Math.hypot(z.x + z.w / 2 - cx, z.y + z.h / 2 - cy);
    if (d < bestD) { best = z; bestD = d; }
  }
  // Dropping onto a filled slot tucks the card underneath as its name card instead.
  const name = best && best.nameZone;
  if (name && best.occupant && best.occupant !== piece && (!name.occupant || name.occupant === piece)) return name;
  return best;
}

function leaveZone(piece) {
  if (piece.zone && piece.zone.occupant === piece) piece.zone.occupant = null;
  piece.zone = null;
  piece.children.forEach(leaveZone);
}

function snapTo(piece, zone, animate = true) {
  noteTouch(piece);
  leaveZone(piece);
  if (animate) animateOnce(piece, 'animating', 450);
  zone.occupant = piece;
  piece.zone = zone;

  if (zone.tucked) {
    setFaceUp(piece, false);
    piece.rot = piece.rot === 180 ? 180 : 0; // keep whichever name the player turned up
  } else {
    setFaceUp(piece, !zone.faceDown); // e.g. a portrait slot shows the card's back
    piece.rot = zone.rot || 0;
  }
  moveBy(piece, zone.x - piece.x, zone.y - piece.y);
  noteTouch(piece);

  if (zone.tucked) {
    const parent = zone.parentZone.occupant;
    if (parent) {
      attach(parent, piece);
      raise(parent);
    }
  } else if (zone.nameZone) {
    const name = zone.nameZone;
    // A card carried in with its own tucked name card claims the name slot for it.
    if (!name.occupant && piece.children.length) {
      name.occupant = piece.children[0];
      piece.children[0].zone = name;
    }
    if (name.occupant && name.occupant !== piece) {
      attach(piece, name.occupant);
      raise(piece);
    }
  }

  // A slot tucked beneath another (a portrait under the Asset) keeps that stack on top.
  if (zone.under) {
    [zone.under.occupant, zone.under.nameZone && zone.under.nameZone.occupant]
      .forEach(p => p && raise(p.parent || p));
  }
}

function highlightZone(d, zone) {
  if (d.hot === zone) return;
  if (d.hot && d.hot.el) d.hot.el.classList.remove('hot');
  if (zone && zone.el) zone.el.classList.add('hot');
  d.hot = zone;
}

// ---- Dice ----
// A die is either 'pips' (classic) or 'approach' (faces are the six approach symbols).

const PIP_LAYOUT = {
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function buildDieFace(container, faces) {
  container.classList.add('die-face');
  if (faces) container.appendChild(el('span', 'die-symbol'));
  else for (let i = 0; i < 9; i++) container.appendChild(el('span', 'pip'));
  return container;
}

// `faceHtml` (optional) draws a face from its symbol, for dice with more than one symbol per face.
function renderDieFace(container, faces, value, faceHtml = null) {
  if (faces) {
    const symbol = container.querySelector('.die-symbol');
    if (!faceHtml && typeof approachFace === 'function' && faces === APPROACHES) faceHtml = approachFace; // an approach die: its name too
    if (faceHtml) symbol.innerHTML = faceHtml(faces[value - 1]);
    else symbol.textContent = faces[value - 1];
    return;
  }
  const on = PIP_LAYOUT[value];
  container.querySelectorAll('.pip').forEach((pip, i) => pip.classList.toggle('on', on.includes(i)));
}

function createDie({ className = '', size = 80, faces = null, faceHtml = null, value, x, y }) {
  const lift = buildDieFace(el('div', className), faces);
  const piece = addPiece({ kind: 'die', className, w: size, h: size, lift, x, y });
  piece.faces = faces;
  piece.faceHtml = faceHtml;
  piece.dieClass = className;
  setDieValue(piece, value || randInt(6) + 1);
  return piece;
}

function setDieValue(piece, value) {
  piece.value = value;
  renderDieFace(piece.lift, piece.faces, value, piece.faceHtml);
}

function rollDie(piece) {
  if (piece.rolling) return;
  piece.rolling = true;
  piece.el.classList.add('rolling');

  // Flicker through random faces, slowing down, then land on the real result.
  const delays = [40, 45, 50, 60, 70, 85, 105, 130];
  let i = 0;
  const step = () => {
    if (i < delays.length) {
      let v;
      do { v = randInt(6) + 1; } while (v === piece.value);
      setDieValue(piece, v);
      setTimeout(step, delays[i++]);
    } else {
      setDieValue(piece, randInt(6) + 1);
      piece.el.classList.remove('rolling');
      piece.rolling = false;
    }
  };
  step();
}

// ---- Tokens & pawns ----

function createToken({ className = '', size = 56, label, html, x, y }) {
  return addPiece({ kind: 'token', className, w: size, h: size, lift: el('div', null, html ?? esc(label)), x, y });
}

// A pawn seen from above at a slant, like a chess pawn: a round head on a collar, a flared body, and
// a two-step base whose ellipses read as sitting in a round spot. Lit from the upper left.
function createPawn({ color, label, x, y }) {
  const id = `pawn-${++createPawn.n}`;
  const light = `color-mix(in srgb, ${color} 45%, #fff)`, dark = `color-mix(in srgb, ${color} 65%, #000)`;
  const lift = el('div', null, `
    <svg viewBox="0 0 80 96" aria-hidden="true">
      <defs>
        <linearGradient id="${id}-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="${light}"/><stop offset="0.45" stop-color="${color}"/><stop offset="1" stop-color="${dark}"/>
        </linearGradient>
        <linearGradient id="${id}-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${light}"/><stop offset="1" stop-color="${color}"/>
        </linearGradient>
        <radialGradient id="${id}-head" cx="0.35" cy="0.32" r="0.75">
          <stop offset="0" stop-color="${light}"/><stop offset="0.55" stop-color="${color}"/><stop offset="1" stop-color="${dark}"/>
        </radialGradient>
      </defs>
      <g stroke="rgba(0,0,0,.35)" stroke-width="1">
        <path fill="url(#${id}-side)" d="M5 74v5a35 14 0 0 0 70 0v-5z"/>
        <ellipse fill="url(#${id}-top)" cx="40" cy="74" rx="35" ry="14"/>
        <path fill="url(#${id}-side)" d="M13 63v4a27 11 0 0 0 54 0v-4z"/>
        <ellipse fill="url(#${id}-top)" cx="40" cy="63" rx="27" ry="11"/>
        <path fill="url(#${id}-side)" d="M27 62L33 39h14l6 23a13 6 0 0 1-26 0z"/>
        <path fill="url(#${id}-side)" d="M28 36v3a12 5 0 0 0 24 0v-3z"/>
        <ellipse fill="url(#${id}-top)" cx="40" cy="36" rx="12" ry="5"/>
        <circle fill="url(#${id}-head)" cx="40" cy="23" r="15"/>
      </g>
      <ellipse cx="34" cy="16" rx="5" ry="3.5" fill="rgba(255,255,255,.45)"/>
      <text x="40" y="25" text-anchor="middle" dominant-baseline="middle">${esc(label)}</text>
    </svg>`);
  return addPiece({ kind: 'pawn', w: 80, h: 96, lift, x, y });
}
createPawn.n = 0;

function pulse(piece) {
  noteTouch(piece);
  piece.el.classList.remove('pulse');
  void piece.el.offsetWidth; // restart the animation
  animateOnce(piece, 'pulse', 280);
}

// A piece can claim taps on part of itself (e.g. a line on an element card) by
// returning true from piece.tapHandler(target).
function onTap(piece, target) {
  if (piece.tapHandler && target && piece.tapHandler(target)) return;
  if (piece.kind === 'card') flipCard(piece);
  else if (piece.kind === 'die') openDieMenu(piece);
  else pulse(piece);
}

// ---------------------------------------------------------------------------
// Pointer handling
//   - finger/mouse on a piece: drag it (each finger can hold its own piece)
//   - tap a piece: card flips, die opens its menu; long-press a card rotates it 180°
//   - finger on empty table: pan; two fingers: pinch-zoom; mouse wheel: zoom
// ---------------------------------------------------------------------------

const drags = new Map(); // pointerId -> drag state
const pans = new Map();  // pointerId -> last client position
let pinch = null;
const LONG_PRESS_MS = 550;

table.addEventListener('pointerdown', e => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  if (e.target.closest('button')) return;
  const node = e.target.closest('.piece');
  if (node && !node._piece.locked) startDrag(e, node._piece);
  else startPan(e); // empty table, or a locked piece (only the game moves or flips it)
});

function startDrag(e, piece) {
  if (piece.heldBy != null) return; // already held by another finger
  e.preventDefault();
  try { piece.el.setPointerCapture(e.pointerId); } catch { /* moves still reach window listeners */ }

  piece.heldBy = e.pointerId;
  if (!piece.parent) raise(piece); // a tucked card stays tucked until it's actually dragged out
  piece.el.classList.add('held');

  const w = toWorld(e.clientX, e.clientY);
  const d = {
    piece,
    target: e.target,
    offX: w.x - piece.x,
    offY: w.y - piece.y,
    startX: e.clientX,
    startY: e.clientY,
    lastX: e.clientX,
    lastT: e.timeStamp,
    moved: false,
    longPressed: false,
    tilt: 0,
    idleTimer: 0,
    pressTimer: 0,
  };
  if (piece.kind === 'card') {
    d.pressTimer = setTimeout(() => {
      if (d.moved) return;
      d.longPressed = true;
      rotateCard(piece);
    }, LONG_PRESS_MS);
  }
  drags.set(e.pointerId, d);
}

function startPan(e) {
  e.preventDefault();
  try { table.setPointerCapture(e.pointerId); } catch { /* ignore */ }
  pans.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pans.size === 2) {
    const [a, b] = [...pans.values()];
    pinch = {
      dist: Math.hypot(a.x - b.x, a.y - b.y) || 1,
      mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      view: { ...view },
    };
  }
}

window.addEventListener('pointermove', e => {
  if (drags.has(e.pointerId)) moveDrag(e, drags.get(e.pointerId));
  else if (pans.has(e.pointerId)) movePan(e);
});

function moveDrag(e, d) {
  // Fingers wobble; don't treat a slightly imprecise tap as a drag.
  const slop = e.pointerType === 'mouse' ? 4 : 12;
  if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < slop) return;
  if (!d.moved) {
    d.moved = true;
    clearTimeout(d.pressTimer);
    d.piece.el.classList.remove('animating');
    if (d.piece.parent) {
      detach(d.piece); // dragging a tucked card pulls it free of its parent
      raise(d.piece);
    }
    leaveZone(d.piece);
  }

  const { piece } = d;
  const w = toWorld(e.clientX, e.clientY);
  moveBy(piece, w.x - d.offX - piece.x, w.y - d.offY - piece.y);
  highlightZone(d, findZone(piece));

  // Lean the held piece slightly in the direction it's being dragged.
  const dt = Math.max(1, e.timeStamp - d.lastT);
  const vx = (e.clientX - d.lastX) / dt;
  d.tilt = d.tilt * 0.75 + Math.max(-10, Math.min(10, vx * 8)) * 0.25;
  d.lastX = e.clientX;
  d.lastT = e.timeStamp;
  piece.el.style.setProperty('--tilt', `${d.tilt.toFixed(2)}deg`);

  clearTimeout(d.idleTimer);
  d.idleTimer = setTimeout(() => {
    d.tilt = 0;
    piece.el.style.setProperty('--tilt', '0deg');
  }, 90);
}

function movePan(e) {
  const prev = pans.get(e.pointerId);
  pans.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (pinch && pans.size >= 2) {
    const [a, b] = [...pans.values()];
    const dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const s = pinch.view;
    const z = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, s.zoom * dist / pinch.dist));
    // Keep the world point that was under the starting midpoint under the current midpoint.
    const wx = (pinch.mid.x - s.x) / s.zoom, wy = (pinch.mid.y - s.y) / s.zoom;
    view.zoom = z;
    view.x = mid.x - wx * z;
    view.y = mid.y - wy * z;
  } else {
    view.x += e.clientX - prev.x;
    view.y += e.clientY - prev.y;
  }
  applyView();
}

function endPointer(e, cancelled) {
  if (pans.delete(e.pointerId)) {
    if (pans.size < 2) pinch = null;
    return;
  }
  const d = drags.get(e.pointerId);
  if (!d) return;
  drags.delete(e.pointerId);
  clearTimeout(d.idleTimer);
  clearTimeout(d.pressTimer);

  const { piece } = d;
  piece.heldBy = null;
  piece.el.classList.remove('held');
  piece.el.style.removeProperty('--tilt');
  highlightZone(d, null);

  const zone = d.moved && !cancelled && findZone(piece);
  if (zone) snapTo(piece, zone);
  else clampToWorld(piece);

  if (!d.moved && !d.longPressed && !cancelled) onTap(piece, d.target);
  tableChanged();
}

window.addEventListener('pointerup', e => endPointer(e, false));
window.addEventListener('pointercancel', e => endPointer(e, true));

table.addEventListener('wheel', e => {
  e.preventDefault();
  zoomAt(e.clientX, e.clientY, Math.exp(-e.deltaY * 0.0015));
}, { passive: false });

// Long-press on touch fires contextmenu; native drag/selection would fight our handlers.
for (const type of ['contextmenu', 'dragstart', 'selectstart']) {
  document.addEventListener(type, e => e.preventDefault());
}

// ---------------------------------------------------------------------------
// Die menu
// ---------------------------------------------------------------------------

const menu = document.getElementById('die-menu');
const backdrop = document.getElementById('menu-backdrop');
const menuFaces = menu.querySelector('.faces');
let menuDie = null;

menu.querySelector('.roll-btn').addEventListener('click', () => {
  const die = menuDie;
  closeDieMenu();
  rollDie(die);
});

function openDieMenu(die) {
  menuDie = die;
  menuFaces.innerHTML = '';
  for (let v = 1; v <= 6; v++) {
    const btn = el('button', 'face-btn');
    btn.type = 'button';
    btn.classList.toggle('current', v === die.value);
    btn.setAttribute('aria-label', `Set to ${die.faces ? die.faces[v - 1] : v}`);
    const face = buildDieFace(el('div', die.dieClass), die.faces);
    renderDieFace(face, die.faces, v, die.faceHtml);
    btn.appendChild(face);
    btn.addEventListener('click', () => {
      closeDieMenu();
      setDieValue(die, v);
      pulse(die);
    });
    menuFaces.appendChild(btn);
  }

  backdrop.hidden = false;
  menu.hidden = false;

  // Put the menu beside the die (right side preferred) so the finger doesn't cover it.
  const r = die.el.getBoundingClientRect();
  const mw = menu.offsetWidth, mh = menu.offsetHeight;
  const W = window.innerWidth, H = window.innerHeight, gap = 20, margin = 12;
  let x = r.right + gap;
  if (x + mw > W - margin) x = r.left - gap - mw;
  if (x < margin) x = Math.max(margin, Math.min(W - mw - margin, r.left + r.width / 2 - mw / 2));
  let y = r.top + r.height / 2 - mh / 2;
  y = Math.max(margin, Math.min(H - mh - margin, y));
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
}

function closeDieMenu() {
  menuDie = null;
  menu.hidden = true;
  backdrop.hidden = true;
}

backdrop.addEventListener('pointerdown', e => {
  e.preventDefault();
  closeDieMenu();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDieMenu();
});

// ---------------------------------------------------------------------------
// HUD
// ---------------------------------------------------------------------------

document.getElementById('fit-btn').addEventListener('click', fitView);
document.getElementById('zoom-in-btn').addEventListener('click', () => zoomAt(innerWidth / 2, innerHeight / 2, 1.25));
document.getElementById('zoom-out-btn').addEventListener('click', () => zoomAt(innerWidth / 2, innerHeight / 2, 0.8));
