'use strict';

// Gameplay simulator: plays a whole game on the table, one step per click, and explains
// each step. Players are simple bots. The rule values live in rules.js; anything the design
// hasn't settled yet is a placeholder, listed in the panel under "Rules used".

const RULES_TEXT = [
  'Three acts, one Situation each, each harder than the last (the difficulty for your player count is at the top of the Board). Each new act draws a new Location card.',
  'Every player takes Story Points as each act begins; how much depends on the act and the number of players (see the top of the Board).',
  'Each round, in initiative order, every player bets: <b>Main</b> on a free row, <b>Help</b> a row whose approach is on one of their Relationship cards (+1), give up their bet to <b>clear a Minus die</b> (and take 1 Story Point' + (SIM_RULES.clearSpotlight ? ' and bank ' + SIM_RULES.clearSpotlight + ' spotlight' : '') + '), or pass.' + (SIM_RULES.clearTiming === 'end' ? ' Clearing means putting your pawn in the <b>Clear seat</b> at the foot of the Minus box (one pawn per round): the die comes off at the <b>end of the round</b>, so this round\u2019s rolls still feel it. While you hold the seat, one failure can\u2019t lose the situation: you hold the line.' + (SIM_RULES.clearGoesFirst ? ' Whoever clears also <b>bets first next round</b>.' : '') : '') + '',
  ...(SIM_RULES.sceneModifier ? ['<b>Edge die:</b> each Situation\u2019s description names one Element line (like the Location\u2019s 🌉 crossing). That line\u2019s approach goes on the Edge die at the left of the Board\u2019s banner. ' + (SIM_RULES.sceneBy === 'approach' ? (SIM_RULES.sceneClaim ? 'Each round, the first Main player to go in with that approach takes the Edge die into their Main box: ' + sceneMod() + ' on their roll, and nobody else gets it that round. It goes back once everyone has gone.' : 'For the whole situation, a roll made with that approach gets ' + sceneMod() + '.') : 'For the whole situation, any character whose Concept or Asset shows that approach gets ' + sceneMod() + ' on whichever row they bet. Their badge is marked.')] : []),
  ...(SIM_RULES.freeApproach ? ['<b>Cost vs. Approaches:</b> rows have no set approach. The Main player picks the approach they go in with and sets that die in their box; Help, Concept, Asset, Trouble, Liability, the Minus dice and the Fate card all read it. Each row risks one resource (Intel, Reputation, Resources, Drive, Efficiency or Time). A failure costs 1 of it, but <b>0</b> with the approach that guards it and <b>2</b> with the one that squanders it (shown in the Risk box): 🕶️ guards Intel, 📢 guards Reputation, 🧠 Resources, 💪 Drive, 🐢 Efficiency, ⚡ Time.'] : []),
  '<b>One Fate card</b> is drawn for everyone. Each row reads its own approach\u2019s number.',
  ...(INVOKE_LINES ? ['When betting as Main, a player may <b>invoke</b> one unused line on an Element card (Location, Villain, Ally, MacGuffin) whose approach matches the row: +1. Each line can be invoked once per situation.'] : []),
  ...(SIM_RULES.troubleInvoke && SIM_RULES.compelOnly ? ['<b>➖ Troubles and ✖️ Liabilities</b> never count on their own, and you can’t bring up your own. After the bets, before the card is turned, when a Main player’s approach matches their Trouble or Liability' + (SIM_RULES.compelRiskMatch ? ', or their row risks the resource shown on their Trouble' : '') + ', ' + (SIM_RULES.compelByStoryteller && SIM_RULES.obstacle ? 'the <b>Storyteller</b> may <b>compel</b> it (once per round, for free)' : 'any other player may <b>compel</b> it, for free') + ': they say how it gets in the way. The Main player takes <b>−1</b> on the roll and ' + storyPts(SIM_RULES.troubleEdge) + ' from the pile (theirs once the roll is over), or refuses by paying 1 Story Point to the pile.' + (SIM_RULES.obstacle && !SIM_RULES.compelByStoryteller ? ' Watching for them is part of the <b>Storyteller</b>’s job: they may compel one each round.' : '') + ' Once per card per roll.'] : []),
  ...(SIM_RULES.troubleInvoke && !SIM_RULES.compelOnly ? ['<b>➖ Troubles</b> never count on their own. After the bets, before the card is turned, a Main player whose row shows one of their Trouble’s approaches may <b>invoke</b> it: −1 on the roll, and ' + storyPts(SIM_RULES.troubleEdge) + ' from the pile goes on their Trouble card. If they don’t, any other player may <b>compel</b> it by putting ' + SIM_RULES.troubleEdge + ' of their own Story Points there instead; the Main player can refuse by paying 1 Story Point to the pile, and then the compeller’s Story Points goes to the pile too. If the Edge die shows a Trouble approach too, take ' + SIM_RULES.sceneTroubleEdge + ' more Story Points from the pile. The Story Points on the Trouble card is theirs once the roll is over (not for this roll). Once per roll.'] : []),
  ...(SIM_RULES.banes ? ['<b>✖️ Liabilities:</b> a Main player who fails draws a Liability at random (like a Broken Leg) and explains how it happened. It shows two approaches and works like a Trouble' + (SIM_RULES.compelOnly ? '' : ' (invoke it for −1 and Story Points), but anyone can compel it <b>for free</b>: the Story Points comes from the pile. Refusing costs you 1 Story Point to the pile') + '. One Liability at a time: if you get another, keep either one. Get rid of it by giving up your bet for a round, or by spending ' + storyPts(SIM_RULES.baneRemoveEdge) + '.' + (SIM_RULES.baneClearAtActEnd === false ? ' Otherwise it stays, from act to act.' : ' All Liabilities go back in the deck at the end of each act.')] : []),
  ...(SIM_RULES.boonUpgrades ? ['<b>✔️ Asset upgrades:</b> beat the difficulty by ' + SIM_RULES.boonMargin + ' or more as Main and draw an Asset from the ones nobody holds: keep it or your old one.'] : []),
  ...(SIM_RULES.boonShield === 'heal' ? ['<b>Burn your Asset:</b> when you fail as Main, you may discard your Asset. You still lose the resource, but you draw no Liability, and you shake off the Liability you carry. An empty Asset slot fills again with your next Asset upgrade.'] : []),
  (SIM_RULES.maxStake ? 'A Main player may <b>stake</b> up to 2 spotlight tokens from their <b>Scored</b> pile. If the bet succeeds, the stake comes back plus <b>double</b> the stake on top (stake 2, get 6). Anything less than a success and the stake is lost for good.' : null),
  'After the card is turned, a Main player may spend ' + (SIM_RULES.maxEdgePerBet ? 'up to <b>' + storyPts(SIM_RULES.maxEdgePerBet) + '</b>' : 'any of their <b>Story Points</b>') + ' on their roll: +1 each' + (playerRule('endingEdgeCap') ? ' (up to ' + playerRule('endingEdgeCap') + ' in the Ending)' : '') + '.' + (SIM_RULES.helperEdge ? ' Helpers on the row may chip in their own Story Points too (still 2 per roll in all).' : ''),
  ...(SIM_RULES.maxEdgeHeld ? ['<b>Story Points limit:</b> nobody holds more than ' + storyPts(SIM_RULES.maxEdgeHeld) + '. Any more you would take stays in (or goes back to) the pile.'] : []),
  `Effort = ➕ Concept +1, ✔️ Asset +1, ${SIM_RULES.troubleInvoke ? '➖ Trouble −1 if invoked or compelled' : '➖ Trouble −1'}, ${SIM_RULES.sceneModifier ? `the Edge die ${sceneMod()} ${SIM_RULES.sceneBy === 'approach' ? 'if the roll uses its approach' : 'if their Concept or Asset shows its approach'}, ` : ''}${INVOKE_LINES ? 'invoked line +1, ' : ''}each helper +1, each Story Points spent +1, each Minus die showing the row\u2019s approach −1, plus the Fate number.`,
  ...(SIM_RULES.takeSpotlight ? ['<b>Taking spotlight:</b> spotlight tokens are neutral. Each situation starts with a stack in every row\u2019s Successes box, as many as it takes to win (the target). Scoring <b>takes</b> tokens from the row\u2019s stack into your <b>This scene</b> spot. The first row emptied completes the situation, and everyone\u2019s This scene tokens are scored. If the situation is lost, they go back to the pool unscored. Act bonuses' + (SIM_RULES.maxStake ? ', stake payouts' : '') + ' and cashed-in Story Points come from the pool.'] : []),
  'Beat the difficulty by N: the Main player ' + (SIM_RULES.takeSpotlight ? 'takes N spotlight tokens from the row\u2019s stack' : 'puts N spotlight tokens on the row\u2019s Successes') + (SIM_RULES.maxTokensPerRoll ? ' (at most ' + SIM_RULES.maxTokensPerRoll + (SIM_RULES.overflowToEdge ? '; each point over that is 1 Story Point instead' : '') + ')' : '') + (SIM_RULES.overflowAtRowLimit ? ', but never more than the row still needs to win: each point over that is 1 Story Point instead (for a helper too, when the row is already full)' : '') + '; each helper adds 1.' + (SIM_RULES.endEdgePerSpotlight ? ' At the end of the game, every ' + SIM_RULES.endEdgePerSpotlight + ' leftover Story Points buy 1 spotlight. Why? Story Points are your pull over how the story goes. Whatever you never spent is still pull: when the story is told afterwards, it buys your character a bigger part in it.' : '') + (SIM_RULES.helpTokensSafe ? ' A helper\u2019s token is <b>safe</b> (ringed): it counts toward the row like any other, and if the situation is lost it still scores.' : ''),
  ...(SIM_RULES.pushResource ? ['<b>Succeed at a cost:</b> after the Fate card, a Main player whose roll would miss may lower their die for the row’s resource ' + (SIM_RULES.maxPushPerRoll ? 'by ' + (SIM_RULES.maxPushPerRoll === 1 ? '1 point' : 'up to ' + SIM_RULES.maxPushPerRoll + ' points') + ', for +1 each' : 'by as many points as they like, +1 each') + '' + (SIM_RULES.pushToSucceed ? '' : ' (1 point at most)') + (SIM_RULES.pushToZero ? '. A die spent down to 0 leaves the sheet: that resource is used up.' : ', but never below 1.')] : []),
  ...(SIM_RULES.obstacle ? ['<b>The Obstacle:</b> each round one player is the <b>Storyteller</b> (the seat passes clockwise every round). Before anyone bets, they set the Obstacle die to an approach and put it in one row’s Obstacle box, and say how the other side saw it coming: going into that row with that approach ' + (SIM_RULES.obstacleCancels ? '<b>loses its bonuses</b> (Concept, Asset, Edge die and the row’s ✓) this round, so it only hurts a character leaning on that approach' : 'is <b>−1</b> this round') + '. The Storyteller still bets as usual.'] : []),
  ...(SIM_RULES.escalationChoice ? ['<b>Escalations:</b> when a Main player fails, they choose which of the Situation\u2019s two Escalations happens, and narrate it. The same one can happen again: that trouble just got really bad.'] : []),
  ...(SIM_RULES.minorFailure ? ['<b>Miss by 1: a minor failure.</b> The Main player and helpers each lose the row\u2019s resource (0, 1 or 2 by the approach), but nobody draws a Liability or takes Story Points, and the situation doesn\u2019t escalate.'] : []),
  (SIM_RULES.riskModifier ? 'On each row, the approach marked <b>✓</b> beside it is <b>+1</b> on the roll and the one marked <b>✗</b> is <b>\u22121</b>. ' : '') + (SIM_RULES.minorFailure ? 'Miss by 2 or more' : 'Miss by 2 or more (a miss by 1 costs nothing)') + (SIM_RULES.failLiabilityOnly ? ': the Main player takes a <b>Liability</b> (nobody loses any resources: those are only spent to succeed at a cost)' : ': the Main player and helpers each lose ' + (SIM_RULES.freeApproach && !SIM_RULES.riskModifier ? '0, 1 or 2 (by the approach)' : '1') + ' of the row\u2019s <b>Risk</b> resource' + (SIM_RULES.failPickLoss && SIM_RULES.banes ? ', except the Main player, who chooses: lose it, <b>or</b> take a Liability (only if they don’t already hold one)' : (SIM_RULES.banes ? ', and the Main player draws a Liability' : ''))) + '.' + (SIM_RULES.failEdgeMain || SIM_RULES.failEdgeHelpers !== false ? ' Helpers take 1 <b>Story Point</b>; the Main player takes ' + storyPts(SIM_RULES.failEdgeMain ?? 1) + '.' : '') + ' The next Escalation happens and its Minus die goes in the Minus box: <b>−1 to every roll using that approach</b>, on any row' + (SIM_RULES.minusNextRound ? ', from the <b>next round</b> on (this round\u2019s other rows roll against the box as it was when they bet)' : '') + '. With 2 Minus dice out, the next failure loses the situation (unless someone holds the Clear seat), and the tokens on the board go back unscored.',
  'A resource that drops to <b>0</b> costs you your next turn: flip your initiative token to <b>OUT</b>, and flip it back at the end of the round you sit out. On the turn after, the resource comes back at 1.',
  '<b># of players</b> tokens on one row defeats the situation: every token on the board is scored.',
  (SIM_RULES.spotlightShift ? '<b>Spotlight Shift:</b> the bonus below goes to whoever on the winning row (Main or helper) has the least scored spotlight; ties go to the Main, who then takes the helper share. ' : '') + 'Finishing a situation earns a bonus for the winning row, banked straight away: the Beginning <b>2</b> for the Main player; the Middle <b>3</b> for the Main player and <b>1</b> for each helper; the Ending <b>4</b> for the Main player and <b>2</b> for each helper.',
  'After the Ending, the most scored spotlight is the star. <b>Tiebreaker:</b> whoever won the Ending.',
  SIM_RULES.initiativeBy === 'standing'
    ? '<b>Initiative</b> is reset after every round: whoever has the least spotlight on the table (Scored plus their tokens on the Board) bets first. Ties: fewer Story Points goes first, then the youngest player (the simulator: whoever went earlier).'
    : '<b>Initiative</b> is reset after every round, Kingdomino-style: whoever placed the fewest spotlight tokens that round picks first. Ties: less spotlight overall goes first, then the earlier player.',
  ...(SIM_RULES.rowOrder === 'initiative' ? ['Rows roll in <b>initiative order</b>: a Main player takes their initiative token with their pawn, and the rows roll by those numbers. A helped row rolls on its Main\u2019s number.'] : []),
  ...(SIM_RULES.afterWin === 'safe' ? ['<b>The danger has passed:</b> once a row completes the situation, the rows still to roll still roll (successes ' + (SIM_RULES.takeSpotlight ? 'take' : 'place') + ' spotlight, which scores), but a miss costs nothing.'] : []),
  'Bots bet on their best row, ' + (SIM_RULES.maxStake ? 'stake about the margin they expect (one more when they’re behind), ' : '') + 'help when they can’t do better, clear a Minus die when both are out, invoke their Trouble when the Story Points is worth more than the −1, compel a rival who is ahead (or about to finish the situation) when it could cost them the roll, refuse a compel when the −1 hurts more than 1 Story Point, and spend Story Points (up to 2) to reach their stake, or else to dodge a failure.',
];

const ROW_NAMES = ['A', 'B', 'C'];
const COL = { main: matCol('main'), help: matCol('help'), approach: matCol('approach'), edge: matCol('edge'), successes: matCol('successes') };

let sim = null; // { gen, steps, auto }

// ---------------------------------------------------------------------------
// Reading the table
// ---------------------------------------------------------------------------

const same = (a, b) => noVS(a || '') === noVS(b || '');
const has = (list, approach) => (list || []).some(a => same(a, approach));
const signed = v => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0');
const pickOne = list => list[randInt(list.length)];

function tableReady() {
  return TABLE && TABLE.players.every(pl => pl.zones &&
    ['concept', 'trouble', 'boon'].every(k => pl.zones[k].occupant)) && TABLE.relZones.every(z => z.occupant);
}

function readPlayer(pl) {
  const n = TABLE.players.length;
  const concept = pl.zones.concept.occupant, trouble = pl.zones.trouble.occupant, boon = pl.zones.boon.occupant;
  // The cards on either side of this player on the ring (two players share just one).
  const zones = n === 2 ? [TABLE.relZones[0]] : [TABLE.relZones[pl.index], TABLE.relZones[(pl.index - 1 + n) % n]];
  const rels = zones.map(z => z.occupant.card);
  const name = [shownTuckedName(concept), shownTuckedName(trouble)].filter(Boolean).join(' ') || pl.letter;
  return { concept: concept.card, trouble: trouble.card, boon: boon ? boon.card : null, boonState: boon ? shownTuckedName(boon) : '', rels, name };
}

const who = pl => `<span class="chip" style="--c:${pl.color}">${pl.letter}</span> <b>${esc(pl.info.name)}</b>${pl.human ? ' (you)' : ''}`;
// Rows have no letters or shapes on the table (players say what they do, not "row B"), so the
// story names a row by its choice: “slip past the pickets…”, plus the approach going in.
const rowLabel = row => {
  const words = (row.action || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean);
  return `“${words.slice(0, 5).join(' ')}${words.length > 5 ? '…' : ''}”`;
};
const rowTag = row => `<b>${rowLabel(row)}</b>${row.approach ? ` ${row.approach}` : ''}`;
// What a failure on `row` costs, in words: "1 Time", "2 Resources", "nothing".
// What a failure costs (the Main player): a Liability with failLiabilityOnly, else the resource.
const failWords = row => (SIM_RULES.failLiabilityOnly ? 'a Liability' : lossWords(row));
const lossWords = (row, approach = row.approach) => { const n = riskCost(row.risk, approach); return n ? `${n} ${riskName(row.risk)}` : 'nothing'; };

// "Jax Starling, the Smuggler with a Fast Ship, with a price on their head, carrying a
// salvaged Plasma Blade. Their relationship with …" in plain words (the cards show the symbols).
function castLine(pl) {
  const n = TABLE.players.length;
  const { concept, trouble, boon, boonState, rels } = pl.info;
  const trim = t => t.replace(/\.\.\.|…/g, '').trim();
  const role = `the ${trim(concept.text).replace(/^(a|an|the)\s+/i, '')}`;
  const flaw = trim(trouble.text);
  const item = !boon ? '' : boonState ? `${lowerFirst(trim(boonState))} ${boon.text}` : boon.text;
  const article = !boon || (/s$/i.test(boon.text) && !/ss$/i.test(boon.text)) ? '' : (/^[aeiou]/i.test(item) ? 'an ' : 'a ');
  const partners = [TABLE.players[(pl.index + 1) % n], TABLE.players[(pl.index - 1 + n) % n]];
  const ties = rels.map((r, i) => `${i ? 'with' : 'Their relationship with'} ${who(partners[i])} is “${esc(trim(r.text))}”`);
  const carrying = boon ? `, carrying ${article}<b>${esc(item)}</b>` : ', with no Asset yet';
  return `${who(pl)}, <b>${esc(role)}</b> <b>${esc(flaw)}</b>${carrying}. ${ties.join('; ')}.`;
}

// The Asset in a character's slot right now (Assets can be earned and swapped during the game).
const boonOf = pl => (pl.zones.boon.occupant ? pl.zones.boon.occupant.card : null);
// Every Asset a player holds (SIM_RULES.stackCards: the slot's card plus the ones behind it).
const boonsOf = pl => [boonOf(pl), ...(SIM_RULES.stackCards ? pl.moreBoons || [] : [])].filter(Boolean);
// Every Liability piece (the extra ones stand in with the slot's card for its position).
function banesOf(pl) {
  const top = pl.zones.bane && pl.zones.bane.occupant;
  if (!top) return [];
  return [top, ...(SIM_RULES.stackCards ? (pl.moreBanes || []).map(card => ({ card, extra: true, el: top.el, x: top.x, y: top.y, w: top.w, h: top.h, children: [] })) : [])];
}
// Show a player's extra Assets / Liabilities as cards peeking out under the slot's card, each lower
// right under the slot's card (STACK_STEP).
function renderStacks(pl) {
  (pl.stackPieces || []).forEach(removePiece);
  pl.stackPieces = [];
  if (!SIM_RULES.stackCards) return;
  const show = (zone, cards) => {
    const top = zone.occupant;
    if (!top) return;
    cards.forEach((card, i) => { const piece = placePcCard(card, zone.x, zone.y + STACK_STEP * (i + 1), true); pl.stackPieces.push(piece); });
    raise(top); // the slot's card stays on top
  };
  show(pl.zones.boon, pl.moreBoons || []);
  if (pl.zones.bane) show(pl.zones.bane, pl.moreBanes || []);
}

// Remove one Liability: an extra one, or the slot's card (then the next extra one moves into the slot).
function dropBane(pl, piece) {
  if (piece.extra) { pl.moreBanes.splice(pl.moreBanes.indexOf(piece.card), 1); TABLE.bane.deck.push(piece.card); renderStacks(pl); return; }
  returnBane(piece);
  if (SIM_RULES.stackCards && pl.moreBanes && pl.moreBanes.length) {
    const zone = pl.zones.bane, card = pl.moreBanes.shift();
    snapTo(placePcCard(card, zone.x, zone.y, false), zone, false);
  }
  renderStacks(pl);
}

// `row`: the row being rolled (the Scene die counts if it's in that row's box); without one,
// a bet being sized up (the Scene counts if the die is still free this round).
function bonusParts(pl, approach, row = null) {
  const parts = [];
  const boon = boonOf(pl);
  if (has(pl.info.concept.approaches, approach)) parts.push(['➕ Concept', 1]);
  for (const b of boonsOf(pl)) if (has(b.approaches, approach)) parts.push([`✔️ ${b.text}`, 1]);
  if (!SIM_RULES.troubleInvoke && has(pl.info.trouble.approaches, approach)) parts.push(['➖ Trouble', -1]);
  // The Scene die: on a roll made with its approach ('approach'), or (old rule, 'character') on any
  // roll by a character whose Concept or Asset shows it.
  const sceneCounts = TABLE.scene && (SIM_RULES.sceneBy === 'approach'
    ? same(approach, TABLE.scene.approach) && (!SIM_RULES.sceneClaim || (row ? !!row.sceneDie : !TABLE.sceneRow))
    : has(pl.info.concept.approaches, TABLE.scene.approach) || (boon && has(boon.approaches, TABLE.scene.approach)));
  if (sceneCounts) {
    parts.push([`Edge die ${TABLE.scene.icon} ${TABLE.scene.text}`, SIM_RULES.sceneModifier]);
  }
  return parts;
}

const total = parts => parts.reduce((s, [, v]) => s + v, 0);

// When a row is resolved, the cards that counted line up across the bottom of the Board for
// everyone to see (and count): the Concept and Assets showing the approach, a compelled Trouble
// or Liability, and each helper's Relationship. They go back once the step is over.
function showUsedCards(row) {
  if (!TABLE.showcaseAt || !row.main) return [];
  const pl = row.main, a = row.approach, list = [];
  const add = p => { if (p && p.el && p.el.isConnected && !list.includes(p)) list.push(p); };
  const extras = kind => (pl.stackPieces || []).filter(p => p.card.kind === kind);
  const concept = pl.zones.concept.occupant;
  if (concept && has(concept.card.approaches, a)) add(concept);
  [pl.zones.boon.occupant, ...extras('boon')].forEach(p => p && has(p.card.approaches, a) && add(p));
  const hits = row.hits || [];
  if (hits.some(h => /Trouble/.test(h))) add(pl.zones.trouble.occupant);
  if (hits.some(h => /Liability/.test(h))) [pl.zones.bane && pl.zones.bane.occupant, ...extras('bane')].forEach(p => p && has(p.card.approaches, a) && add(p));
  row.helpers.forEach(h => { const rel = relFor(h, a); const z = (TABLE.relZones || []).find(z => z.occupant && z.occupant.card === rel); if (z) add(z.occupant); });
  const gap = 12, w = PC_CARD.w, x0 = TABLE.showcaseAt.x - (list.length * w + (list.length - 1) * gap) / 2;
  // Name cards (first / last name, an Asset's description) stay behind: unhook them while on show.
  list.forEach((p, i) => {
    p.showHome = { x: p.x, y: p.y, rot: p.rot, faceUp: p.faceUp };
    p.showChildren = p.children; p.children = [];
    p.rot = 0; setFaceUp(p, true); // a Relationship off the wheel reads upright
    glide(p, x0 + i * (w + gap), TABLE.showcaseAt.y); raise(p);
  });
  return list;
}
function returnUsedCards(list) {
  list.forEach(p => {
    if (p.el && p.el.isConnected && p.showHome) {
      p.rot = p.showHome.rot; setFaceUp(p, p.showHome.faceUp);
      glide(p, p.showHome.x, p.showHome.y);
    }
    if (p.showChildren) { p.children = p.showChildren; p.showChildren = null; }
  });
  // The slot's Asset / Liability back on top of any stacked under it.
  TABLE.players.forEach(pl => [pl.zones.boon.occupant, pl.zones.bane && pl.zones.bane.occupant].forEach(o => o && raise(o)));
}
// The row's risk as a bonus (SIM_RULES.riskModifier): +1 with the approach that guards its
// resource (✓ on the Situation card), -1 with the one that squanders it (✗), else 0.
function riskMod(row, approach) {
  const r = row && SIM_RULES.riskModifier && SIM_RULES.freeApproach && RISKS[row.risk];
  if (!r) return 0;
  return same(approach, r.good) ? 1 : same(approach, r.bad) ? -1 : 0;
}
const riskPart = (row, approach) => { const v = riskMod(row, approach); return v ? [[`${v > 0 ? '🔺' : '🔻'} ${riskName(row.risk)}`, v]] : []; };
const relFor = (pl, approach) => pl.info.rels.find(r => has(r.approaches, approach));

function setResource(pl, res, value) {
  if (SIM_RULES.loseTurnAtZero !== false && value <= 0 && pl.res[res] > 0) { // knocked out: lose next turn, token flipped to OUT
    pl.out = { res, skip: true };
    setOut(pl.initToken, true);
  }
  pl.res[res] = Math.max(0, value);
  const die = pl.dice[res];
  setDieValue(die, Math.max(1, pl.res[res]));
  die.el.classList.toggle('depleted', pl.res[res] === 0);
  // Spent down to 0 (pushToZero): the die leaves the sheet, that resource is used up.
  if (SIM_RULES.pushToZero) die.el.style.visibility = pl.res[res] === 0 ? 'hidden' : '';
  pulse(die);
}

// ---------------------------------------------------------------------------
// Moving things on the table
// ---------------------------------------------------------------------------

function cellSpot(row, col, w, h, dx = 0, dy = 0) {
  const c = TABLE.cell(row.index, col);
  return { x: c.x - w / 2 + dx, y: c.y - h / 2 + dy };
}

// Where bonus spotlight comes from: the player's own supply, or the shared pool (takeSpotlight).
const spotSupply = pl => (SIM_RULES.takeSpotlight ? TABLE.pool : pl.supply);

function placeToken(pl, row, help = false) {
  if (SIM_RULES.takeSpotlight) { // take one from the row's stack into This scene
    const stack = TABLE.rows[row.index].stack || [];
    const token = stack.pop();
    if (!token) return false;
    token.player = pl.letter;
    token.help = help && !!SIM_RULES.helpTokensSafe;
    token.el.classList.toggle('help-token', token.help);
    glide(token, pl.sceneAt.x, pl.sceneAt.y - pl.scene.length * SPOTLIGHT_STEP * 4);
    pl.scene.push(token);
    row.tokens.push(token);
    pl.roundGain = (pl.roundGain || 0) + 1;
    return true;
  }
  const token = pl.supply.pop();
  if (!token) return false;
  token.home = token.home || { x: token.x, y: token.y };
  // A helper's token is safe (SIM_RULES.helpTokensSafe): it scores even if the situation is lost.
  token.help = help && !!SIM_RULES.helpTokensSafe;
  token.el.classList.toggle('help-token', token.help);
  const n = row.tokens.length;
  const spot = cellSpot(row, COL.successes, token.w, token.h,
    -30 + (n % 3) * 30 + Math.floor(n / 6) * 5, -15 + (Math.floor(n / 3) % 2) * 30 - Math.floor(n / 6) * 5);
  glide(token, spot.x, spot.y);
  row.tokens.push(token);
  pl.roundGain = (pl.roundGain || 0) + 1;
  return true;
}

// The Edge limit: nobody holds more than SIM_RULES.maxEdgeHeld (0 = no limit).
const atEdgeLimit = pl => SIM_RULES.maxEdgeHeld > 0 && pl.edge.length >= SIM_RULES.maxEdgeHeld;
const edgeRoom = pl => (SIM_RULES.maxEdgeHeld > 0 ? Math.max(0, SIM_RULES.maxEdgeHeld - pl.edge.length) : Infinity);

// Hand a token to a player, or back to the pile if they're at the Edge limit.
function giveEdge(pl, token) {
  if (atEdgeLimit(pl)) {
    glide(token, TABLE.edge.home.x, TABLE.edge.home.y - TABLE.edge.supply.length * EDGE_STEP);
    TABLE.edge.supply.push(token);
    return false;
  }
  const k = pl.edge.length;
  glide(token, pl.edgeAt.x + Math.floor(k / STORY_STACK) * 56, pl.edgeAt.y - (k % STORY_STACK) * 3);
  pl.edge.push(token);
  return true;
}

function gainEdge(pl) {
  if (atEdgeLimit(pl)) return false;
  const token = TABLE.edge.supply.pop();
  if (!token) return false;
  giveEdge(pl, token);
  return true;
}

// Edge earned from a Trouble or Liability waits on that card until the roll is over, so it can't
// be spent to cancel its own -1.
function parkEdge(row, token, card = row.main.zones.trouble.occupant) {
  const k = row.troubleEdge.length;
  glide(token, card.x + card.w - EDGE_SIZE - 6 - k * 14, card.y + 6);
  raise(token);
  row.troubleEdge.push(token);
}

function spendEdge(pl) {
  const token = pl.edge.pop();
  if (!token) return false;
  const k = TABLE.edge.supply.length;
  glide(token, TABLE.edge.home.x, TABLE.edge.home.y - k * EDGE_STEP);
  TABLE.edge.supply.push(token);
  return true;
}

// Minus dice hit every roll that uses the approach they show, on any row.
// A die that went in this round (`fresh`) only counts from the next round.
const minusFor = (board, approach) => board.minus.filter(d => !d.fresh && same(d.faces[d.value - 1], approach)).length;
// The most Edge a Main player may spend on one roll (more in the Ending at some player counts).
const edgeCap = () => (TABLE.currentAct === 'Ending' && playerRule('endingEdgeCap')) || SIM_RULES.maxEdgePerBet || Infinity;

const minusList = board => board.minus.map(d => `➖${d.faces[d.value - 1]}`).join(' ');

// ---- The Obstacle (SIM_RULES.obstacle) ----
// Each round one player is the Storyteller; the seat passes clockwise every round. Before anyone
// bets, they set the Obstacle die to an approach and put it in one row's Obstacle box: going
// into that row with that approach is −1 (just that row). The Storyteller token sits by their
// pawn, with the Obstacle die on top of it while it isn't on the Board.
// What it costs `pl` going into `row` with `approach` (0 if it isn't there): 1, or with
// obstacleCancels, all their bonuses for that approach there (Concept, Asset, the Scene die, the ✓).
function obstacleFor(board, row, approach, pl) {
  if (!(board.obstacle && row && board.obstacle.row === row.index && same(approach, board.obstacle.approach))) return 0;
  if (!SIM_RULES.obstacleCancels) return 1;
  // Every bonus for that approach on that row: Concept, Asset, the Scene die and the row's ✓ +1.
  return bonusParts(pl, approach, row).reduce((sum, [, v]) => sum + Math.max(0, v), 0) + Math.max(0, riskMod(row, approach));
}

// The Storyteller token passes to `pl`, and the Obstacle die comes back onto it.
function parkObstacle(pl) {
  const { obstacleDie: die, storyToken: token } = TABLE;
  const { x, y } = pl.obstacleHome;
  if (token) glide(token, x - token.w / 2, y - token.h / 2);
  if (die) glide(die, x - die.w / 2, y - die.h / 2 - OBSTACLE_RIDE);
}

// A bot Storyteller reads the table like a GM: each other player's likeliest bet (their best
// row and approach), leaning towards the approach they've gone in with most this game.
function obstacleBotPick(opp, rows, board) {
  let best = null;
  TABLE.players.filter(p => p !== opp && !(p.out && p.out.skip)).forEach(p => {
    rows.forEach(r => APPROACHES.forEach(a => {
      const habit = Math.min((p.approachUses || {})[a] || 0, 4) * 0.5;
      const v = total(bonusParts(p, a)) + riskMod(r, a) - minusFor(board, a) - (riskCost(r.risk, a) - 1) * 0.5 + habit + Math.random() * 0.01;
      if (!best || v > best.v) best = { v, row: r, approach: a, target: p };
    }));
  });
  return best;
}

function* placeObstacle(rows, board) {
  const n = TABLE.players.length;
  const opp = TABLE.players[TABLE.oppSeat % n];
  TABLE.oppSeat++;
  TABLE.storyteller = opp; // they also watch for Troubles and Liabilities to compel (compelOnly)
  parkObstacle(opp);
  let row, approach, target = null;
  if (opp.human) {
    const habits = a => TABLE.players.filter(p => p !== opp && (p.approachUses || {})[a]).map(p => `${p.letter} ×${p.approachUses[a]}`).join(', ');
    const i = yield ask('You are the Storyteller', '<p>Before anyone bets, put the Obstacle on one row. Which row is the other side guarding?</p>',
      rows.map(r => ({ label: rowTag(r), hint: `${r.action} · risks ${riskName(r.risk)}`, value: r.index })));
    row = rows[i];
    approach = yield ask('Ready for which approach?', `<p>Going into ${rowTag(row)} with this approach will ${SIM_RULES.obstacleCancels ? '<b>lose its bonuses</b> (Concept, Asset, Edge die and the row’s ✓)' : 'be <b>−1</b>'} this round. Say how the other side saw it coming.</p>`,
      APPROACHES.map(a => ({ label: a, hint: habits(a) ? `used so far: ${habits(a)}` : 'nobody has used it yet', value: a })));
  } else {
    const pick = obstacleBotPick(opp, rows, board);
    if (!pick) return;
    ({ row, approach, target } = pick);
  }
  board.obstacle = { row: row.index, approach };
  const die = TABLE.obstacleDie;
  if (die) {
    setDieValue(die, APPROACHES.indexOf(approach) + 1);
    const c = TABLE.cell(row.index, matCol('obstacle'));
    glide(die, c.x - die.w / 2, c.y - die.h / 2);
  }
  const uses = target && (target.approachUses || {})[approach];
  yield {
    title: `${opp.letter} is the Storyteller`,
    html: `<p>${who(opp)} puts the <b>Obstacle</b> on ${rowTag(row)}: the other side is ready for ${approach}. Going in there ${approach} ${SIM_RULES.obstacleCancels ? '<b>gets no bonuses</b> (Concept, Asset, Edge die and the row’s ✓)' : 'is <b>−1</b>'} this round.${uses ? ` (${who(target)} has gone in ${approach} ${uses} time${uses === 1 ? '' : 's'}.)` : ''}</p>`,
  };
}

// Clearing a Minus die: remove the chosen one (bots take the one that hurts the most rows), and
// reward the player who gave up their bet for it with 1 Edge and SIM_RULES.clearSpotlight
// spotlight, banked straight away (banked, not placed, so they still tend to pick first next
// round). Returns the story.
function clearDie(pl, rows, board, die = null) {
  if (!board.minus.length) return `${who(pl)} finds no Minus die left to clear.`;
  const hurt = d => rows.filter(r => same(d.faces[d.value - 1], r.approach)).length;
  if (!die) die = board.minus.reduce((a, b) => (hurt(b) > hurt(a) ? b : a));
  const face = die.faces[die.value - 1];
  board.minus.splice(board.minus.indexOf(die), 1);
  removePiece(die);
  board.minus.forEach((d, k) => { const spot = TABLE.minusAt(k, 64); glide(d, spot.x, spot.y); }); // close the gap
  const edge = gainEdge(pl);
  let banked = 0;
  for (let i = 0; i < (SIM_RULES.clearSpotlight || 0); i++) { const t = spotSupply(pl).pop(); if (t) { bankToken(pl, t); banked++; } }
  const rewards = [edge ? '1 Story Point' : '', banked ? `${banked} spotlight banked straight into their Scored row` : ''].filter(Boolean);
  return `${who(pl)} clears the ➖${face} die from the Minus box${rewards.length ? `, and takes ${rewards.join(' and ')} for it` : ''}.`;
}

// A spotlight token safely scored: into the owner's Scored spotlight row.
function bankToken(pl, token) {
  token.el.classList.remove('staked');
  if (pl.scene) { const i = pl.scene.indexOf(token); if (i >= 0) pl.scene.splice(i, 1); }
  token.player = pl.letter;
  token.help = false;
  token.el.classList.remove('help-token');
  const k = pl.scored.length;
  token.home = token.home || { x: token.x, y: token.y };
  glide(token, pl.scoreAt.x + Math.floor(k / SCORE_STACK) * 70, pl.scoreAt.y - (k % SCORE_STACK) * 4);
  pl.scored.push(token);
  pl.score++;
}

// A lost stake: out of the game, onto the Lost stakes pile.
function loseToken(token) {
  token.el.classList.remove('staked');
  const k = TABLE.lost.length;
  glide(token, TABLE.lostAt.x + Math.floor(k / 8) * 40, TABLE.lostAt.y - (k % 8) * 3);
  TABLE.lost.push(token);
}

// The first unused element line with this approach, if any.
function freeLine(approach) {
  if (!INVOKE_LINES) return null;
  for (const piece of elementCards()) {
    const i = piece.card.lines.findIndex((line, j) => same(line.approach, approach) && !(piece.usedLines && piece.usedLines.has(j)));
    if (i >= 0) return { piece, i, text: piece.card.lines[i].text, from: piece.card.name };
  }
  return null;
}

function returnPawns() {
  TABLE.players.forEach(pl => {
    glide(pl.pawn, pl.pawnHome.x, pl.pawnHome.y);
    if (pl.initHome) { pl.initToken.el.classList.remove('on-board'); glide(pl.initToken, pl.initHome.x, pl.initHome.y); }
  });
}

function drawFate() {
  const { drawZone, discardZone } = TABLE.fate;
  const fates = pieces.filter(p => p.cardKind === 'fate');
  let pile = fates.filter(p => p.zone === drawZone);
  let reshuffled = false;
  if (!pile.length) {
    shuffle(fates).forEach(p => { snapTo(p, drawZone); raise(p); });
    pile = fates;
    reshuffled = true;
  }
  const top = pile.reduce((a, b) => (+a.el.style.zIndex > +b.el.style.zIndex ? a : b));
  raise(top);
  snapTo(top, discardZone);
  return { card: top.fate, reshuffled };
}

function setSituation(situation) {
  TABLE.situation = situation;
  const card = TABLE.situationCard;
  card.el.querySelector('.card-front').innerHTML = situationFront(situation);
  setFaceUp(card, true);
  pulse(card);
  TABLE.rows.forEach((row, i) => {
    const idx = APPROACHES.findIndex(a => same(a, situation.approaches[i]));
    if (row.approachDie && idx >= 0) setDieValue(row.approachDie, idx + 1);
  });
  updateSceneBoard(); // the Scene die follows the new Situation's key line
  if (narration) {
    narration.situation = situation;
    narration.result = null;
    narration.words = null;
    narration.el.querySelector('.narr-title').textContent = situation.name || 'Situation';
    renderNarration();
  }
}

// ---------------------------------------------------------------------------
// The game, as a sequence of explained steps
// ---------------------------------------------------------------------------

function* simGame() {
  const players = TABLE.players;
  TABLE.simUsed = true;
  TABLE.history = [];
  TABLE.shownAct = null;
  renderActTabs();
  // Earned Assets: nobody starts with one; every Asset goes into an off-table deck.
  if (SIM_RULES.boonsEarned) {
    players.forEach(pl => {
      const piece = pl.zones.boon.occupant;
      if (!piece) return;
      leaveZone(piece);
      [...piece.children].forEach(removePiece);
      removePiece(piece);
    });
    TABLE.boonDeck = shuffle(buildPcDeck('boon', DATA.boons, DATA.boonStates, '✔️', 1));
    updateSceneBoard();
  } else if (SIM_RULES.boonUpgrades || SIM_RULES.boonShield) {
    // Asset upgrades: the Assets nobody was dealt make an off-table deck to draw from.
    const dealt = new Set(players.map(pl => pl.zones.boon.occupant && pl.zones.boon.occupant.card.text));
    TABLE.boonDeck = shuffle(buildPcDeck('boon', DATA.boons, DATA.boonStates, '✔️', 1).filter(c => !dealt.has(c.text)));
  }
  players.forEach(pl => {
    pl.human = HUMAN_SEAT && pl.index === 0; // you play W
    pl.initHome = { x: pl.initToken.x, y: pl.initToken.y };
    pl.info = readPlayer(pl);
    pl.res = Object.fromEntries(Object.entries(pl.dice).map(([res, die]) => [res, die.value]));
    pl.resStart = { ...pl.res }; // buying back resources never goes above these
    pl.moreBoons = []; pl.moreBanes = []; renderStacks(pl);
    pl.score = 0;
    pl.out = null;
    pl.approachUses = {};
  });
  TABLE.oppSeat = 0; // the first Storyteller is the first player; the seat passes clockwise each round
  if (TABLE.obstacleDie) parkObstacle(players[0]);

  yield {
    title: 'A new story begins',
    html: `<p>${SIM_RULES.acts.length} acts, ${players.length} players, one Fate card per round. The cast:</p><ul class="sim-cast">${players.map(pl => `<li>${castLine(pl)}</li>`).join('')}</ul>`,
  };

  // Each act draws one of its own Situations. If an act runs out (several Middles from a small
  // set), it borrows an unused Middle, then any unused Situation, renamed for the act.
  const used = new Set();
  const prefix = /^(Beginning|Middle|Ending):\s*/;
  for (const [i, act] of SIM_RULES.acts.entries()) {
    const unused = DATA.situations.filter(s => !used.has(s));
    const mine = unused.filter(s => (s.name || '').startsWith(`${act}:`));
    const middles = unused.filter(s => (s.name || '').startsWith('Middle:'));
    const pick = pickOne(mine.length ? mine : middles.length ? middles : unused.length ? unused : DATA.situations);
    used.add(pick);
    const situation = (pick.name || '').startsWith(`${act}:`) ? pick : { ...pick, name: `${act}: ${(pick.name || '').replace(prefix, '')}` };
    yield* playSituation(situation, act, actLabel(i));
    if (playerRule('actEndHeal') && i < SIM_RULES.acts.length - 1) yield* healBetweenActs(players);
  }

  // Leftover Edge buys spotlight at the end: SIM_RULES.endEdgePerSpotlight Edge for 1.
  const rate = SIM_RULES.endEdgePerSpotlight;
  if (rate) {
    const bought = players.map(pl => {
      let n = 0;
      while (pl.edge.length >= rate && spotSupply(pl).length) {
        for (let i = 0; i < rate; i++) spendEdge(pl);
        bankToken(pl, spotSupply(pl).pop());
        n++;
      }
      return [pl, n];
    }).filter(([, n]) => n);
    yield {
      title: 'Cashing in Story Points',
      html: `<p>Every ${rate} leftover Story Points buy 1 spotlight. Why? Story Points are your pull over how the story goes. Whatever you never spent is still pull: when the story is told afterwards, it buys your character a bigger part in it.</p><p>${bought.length ? bought.map(([pl, n]) => `${who(pl)} +${n}`).join(' · ') : 'Nobody has enough left.'}</p>`,
    };
  }

  const ranked = [...players].sort((a, b) => b.score - a.score);
  let top = ranked.filter(pl => pl.score === ranked[0].score);
  // Tiebreaker: whoever won the last act, the Ending (if they're one of the tied players).
  let tiebreak = '';
  if (top.length > 1) {
    const finale = TABLE.history.find(h => h.act === SIM_RULES.acts[SIM_RULES.acts.length - 1]);
    // With a shared win, the tiebreak only settles it if exactly one tied player won the Ending.
    const enders = finale && finale.result && !finale.result.lost ? (finale.result.winners || [finale.result]).map(w => w.letter) : [];
    const tiedEnders = top.filter(pl => enders.includes(pl.letter));
    const winner = tiedEnders.length === 1 ? tiedEnders[0] : null;
    tiebreak = winner
      ? `<p>${top.map(who).join(' and ')} are tied on ${ranked[0].score}. The tiebreaker goes to ${who(winner)}, who won the Ending.</p>`
      : `<p>${top.map(who).join(' and ')} are tied on ${ranked[0].score}, and none of them won the Ending, so they share it.</p>`;
    if (winner) top = [winner];
  }
  yield {
    title: 'The end',
    html: `<p>Final spotlight: ${ranked.map(pl => `${who(pl)} ${pl.score}`).join(' · ')}</p>${tiebreak}
      <p class="sim-star">★ ${top.map(who).join(' and ')} ${top.length > 1 ? 'share' : 'is'} the star of the story!</p>
      <p>Tap the Act buttons next to \u201cSituation\u201d to flip back through the cards and re-enact the story.</p>`,
  };
}

function* playSituation(situation, act, label = act) {
  // Every act after the first takes place somewhere new.
  let newPlace = '';
  if (TABLE.history.length) {
    const loc = drawNewLocation();
    newPlace = `<p>The scene shifts: a new Location card is drawn, <b>the ${esc([shownTuckedName(loc), loc.card.name].filter(Boolean).join(' '))}</b>.</p>`;
  }
  setSituation(situation);
  highlightBoardAct(act);
  TABLE.currentAct = act;
  resetElementLines();
  const entry = { act, label, situation, result: null, words: narrationWords(), scene: TABLE.scene || null }; // remember this act's places, names and Scene die
  TABLE.history.push(entry);
  TABLE.shownAct = TABLE.history.length - 1;
  renderActTabs();
  const difficulty = playerRule('difficulty')[act] ?? 1;
  const target = actTarget(act);
  TABLE.target = target; // for the bots' reckoning during this act

  // Later acts hand everyone some Edge to face the higher difficulty.
  // ...plus, in a longer game, Story Points at the start of each extra Middle (Middle 2, 3, ...).
  const extraMiddle = act === 'Middle' && /\d/.test(label) && !/Middle 1$/.test(label);
  const bonus = (playerRule('edgeAtActStart')[act] || 0) + (extraMiddle ? playerRule('extraMiddleEdge') || 0 : 0);
  let edgeNote = '';
  if (bonus) {
    const short = [], full = [];
    TABLE.players.forEach(pl => { for (let i = 0; i < bonus; i++) if (atEdgeLimit(pl)) full.push(pl); else if (!gainEdge(pl)) short.push(pl); });
    edgeNote = `<p>Everyone takes <b>${storyPts(bonus)}</b> as the act begins.${short.length ? ` The Story Points pile ran out, so ${[...new Set(short)].map(who).join(', ')} got less.` : ''}${full.length ? ` ${[...new Set(full)].map(who).join(', ')} ${new Set(full).size > 1 ? 'are' : 'is'} at the Story Points limit of ${SIM_RULES.maxEdgeHeld}.` : ''}</p>`;
  }
  const actions = rowActions(situation);
  const rows = [0, 1, 2].map(i => ({
    index: i, approach: SIM_RULES.freeApproach ? null : situation.approaches[i], risk: situation.risks[i], tokens: [],
    action: actions[i] || (SIM_RULES.freeApproach ? 'act' : `act with ${situation.approaches[i]}`),
  }));
  const board = { minus: [], rows }; // Minus dice in the shared box: −1 to every roll
  if (SIM_RULES.takeSpotlight) fillSuccessStacks(target); // a stack of `target` on every row
  if (TABLE.sceneRow) returnSceneDie(TABLE.sceneRow);    // the last situation's Scene die, back on the banner
  let escalations = 0;
  let lost = false;

  yield {
    title: `${label}: ${situation.name.replace(/^(Beginning|Middle|Ending|Act [IV]+):\s*/, '')}`,
    html: `${newPlace}<p>Difficulty <b>${difficulty}</b>. Get <b>${target}</b> successes on one row to defeat it.</p>${edgeNote}
      <p>Rows: ${rows.map(r => `${rowTag(r)} (risks ${r.risk} ${riskName(r.risk)})`).join(' · ')}</p>
      <p class="sim-quote">${narrationFor(situation.description.split('\n').map(l => l.replace(/^\s*[ABC]\)\s*/, '– ').replace(APPROACH_AND_RISK, '')).join('\n'))}</p>`,
  };

  for (let round = 1; round <= SIM_RULES.maxRounds; round++) {
    rows.forEach(r => { r.main = null; r.helpers = []; r.invoke = null; r.stake = []; r.hits = []; r.troubleEdge = []; });
    if (SIM_RULES.freeApproach) rows.forEach(r => { r.approach = null; dropApproachDie(r); });
    if (TABLE.sceneRow) returnSceneDie(TABLE.sceneRow); // last round's Scene die goes back to the banner, free again
    board.over = false; // set once a row completes the situation (afterWin 'safe')
    board.clearer = null; // the pawn in the Clear seat this round
    board.held = false;   // whether they've already held the line against a failure
    TABLE.players.forEach(pl => { pl.roundGain = 0; });
    board.obstacle = null;
    board.storyCompel = false; // the Storyteller's compel this round (compelOnly)
    TABLE.storyteller = null;
    if (SIM_RULES.obstacle) yield* placeObstacle(rows, board);
    const order = [...TABLE.players].sort((a, b) => a.initToken.initiative - b.initToken.initiative);
    yield {
      title: `Round ${round}: place your bets`,
      html: `<p>In initiative order: ${order.map(who).join(', ')}.</p>
        <p>Board: ${rows.map(r => `${rowTag(r)} ${r.tokens.length}/${target}`).join(' · ')}${board.minus.length ? ` · Minus box: <b>${minusList(board)}</b>` : ''}${board.obstacle ? ` · Obstacle: <b>➖${board.obstacle.approach}</b> on ${rowTag(rows[board.obstacle.row])}` : ''}</p>`,
    };

    for (const [k, pl] of order.entries()) {
      if (pl.human) yield* humanBet(pl, rows, board, difficulty);
      else yield bet(pl, rows, board, difficulty, k === order.length - 1);
    }
    yield* troublePhase(rows, order, board, difficulty, target);

    // ---- The spin ----
    const { card, reshuffled } = drawFate();
    const fateOf = approach => (card.find(c => same(c.approach, approach)) || { value: 0 }).value;
    yield {
      title: 'The Fate card is turned',
      html: `${reshuffled ? '<p>The draw pile was empty, so the discards were shuffled back in.</p>' : ''}
        <p class="sim-fate">${card.map(c => `${c.approach} ${signed(c.value)}`).join(' · ')}</p>
        <p>${rows.filter(r => r.main).map(r => `${rowTag(r)} gets <b>${signed(fateOf(r.approach))}</b>`).join(' · ') || 'Nobody bet this round.'}</p>`,
    };

    // ---- Resolve each row ----
    let escalatedThisSpin = false;
    let firstWon = null;
    const rollOrder = SIM_RULES.rowOrder === 'initiative'
      ? rows.filter(r => r.main).sort((a, b) => a.main.initToken.initiative - b.main.initToken.initiative)
      : rows;
    for (const row of rollOrder) {
      if (!row.main) continue;
      // Each roll goes step by step: 1) who's rolling; 2) the cards that count come out under the
      // Board and every bonus is listed; 3) the human player spends Story Points / resources;
      // 4) the result; 5) tokens move, and the cards and pawns go back.
      yield rollIntro(row);
      const shown = showUsedCards(row); // the cards behind this roll, lined up under the Board
      yield rollBonuses(row, fateOf(row.approach), difficulty, board);
      // The human player on this row decides their Edge, and (as a failing Main) whether to burn
      // their Asset, before the roll is settled.
      row.plan = null;
      if ([row.main, ...row.helpers].some(p => p.human)) {
        row.plan = yield* humanEdgePlan(row, fateOf(row.approach), difficulty, board);
        // Succeed at a cost: you choose how many points of the row's resource to spend (+1 each), up
        // to all you have, whenever the roll would miss.
        if (row.plan && row.plan.pushChosen !== undefined) { row.plan.push = row.plan.pushChosen; row.plan.margin += row.plan.push; }
        const most = row.main.human && row.plan && row.plan.pushChosen === undefined && row.plan.margin < 1 ? pushMax(row) : 0;
        if (most) {
          const have = row.main.res[row.risk];
          const outcome = m => (m >= 1 ? `a success by ${m}` : m <= -SIM_RULES.failBy ? 'still a failure' : 'a close call (nothing happens)');
          row.plan.push = yield ask('Succeed at a cost?',
            `<p>The roll ${row.plan.margin === 0 ? 'ties the difficulty' : `misses by ${-row.plan.margin}`}. You can succeed at a cost: lower your ${row.risk} ${riskName(row.risk)} die (now ${have}) by as many points as you like, <b>+1 each</b>. Spent down to 0, the die leaves your sheet.</p>`,
            [{ label: 'Leave it', hint: `${outcome(row.plan.margin)} · keep the resource`, value: 0 },
              ...Array.from({ length: most }, (_, i) => i + 1).map(k => ({ label: `Spend ${k}: ${riskName(row.risk)} ${have} → ${have - k}`, hint: outcome(row.plan.margin + k) + (have - k === 0 ? ' · uses it up' : ''), value: k }))]);
          row.plan.margin += row.plan.push;
        }
        const boon = row.main.zones.boon.occupant;
        const carried = row.main.zones.bane && row.main.zones.bane.occupant;
        // Pick your loss (failPickLoss): lose 1 of the row's resource, or take a Liability.
        if (row.main.human && !board.over && row.plan && row.plan.margin <= -SIM_RULES.failBy && SIM_RULES.failPickLoss && !SIM_RULES.failLiabilityOnly && SIM_RULES.banes && TABLE.bane.deck.length && !(SIM_RULES.failPickLossNoBane && carried)) {
          row.plan.pickBane = yield ask('What does it cost you?',
            `<p>The roll misses by ${-row.plan.margin}: a failure. The situation escalates either way. Choose what it costs you, and say how: lose 1 ${riskName(row.risk)} (you have ${row.main.res[row.risk]}), or take a Liability.</p>`,
            [{ label: `Lose 1 ${riskName(row.risk)}`, hint: row.main.res[row.risk] <= 1 ? 'that takes you to 0: you lose your next turn' : `down to ${row.main.res[row.risk] - 1}`, value: false },
             { label: 'Take a Liability', hint: 'drawn at random', value: true }]);
        }
        // With pick-your-loss, the Asset only matters for shaking off a Liability you carry.
        if (row.main.human && !board.over && row.plan && row.plan.margin <= -SIM_RULES.failBy && SIM_RULES.boonShield && boon && (!SIM_RULES.failPickLoss || carried)) {
          row.plan.burn = yield ask('Burn your Asset?',
            `<p>The roll misses by ${-row.plan.margin}: a failure. You can discard your Asset, <b>${esc(boon.card.text)}</b>, to shrug it off. You still lose ${lossWords(row)}, but you draw no Liability${carried ? ` and you shake off ${baneName(carried)}` : ''}.</p>`,
            [{ label: 'Burn it', hint: carried ? 'no Liability, and heal' : 'no Liability', value: true }, { label: 'Keep it', hint: 'take the Liability', value: false }]);
        }
      }
      // The result first: spotlight tokens it moves wait for the wrap-up step.
      const moves = [];
      const realGlide = glide;
      glide = (p, x, y) => moves.push([p, x, y]);
      let step;
      try { step = resolveRow(row, fateOf(row.approach), difficulty, target, board); } finally { glide = realGlide; }
      if (step.failed) {
        if (SIM_RULES.oneEscalationPerSpin && escalatedThisSpin) {
          step.html += '<p>The situation already escalated on this Fate card, so no new Escalation.</p>';
        } else if (board.minus.length < SIM_RULES.maxEscalations) { // room in the Minus box
          escalations++;
          escalatedThisSpin = true;
          const pick = yield* chooseEscalation(row.main, situation, board);
          step.html += escalate(situation, escalations, board, pick);
        } else if (board.clearer && !board.held) { // the Clear seat holds the line, once
          board.held = true;
          escalations++;
          escalatedThisSpin = true;
          const pick = yield* chooseEscalation(row.main, situation, board);
          step.html += escalate(situation, escalations, board, pick)
            + `<p><b>${who(board.clearer)} is holding the line:</b> the situation survives this failure, and they'll remove a Minus die at the end of the round.</p>`;
        } else {
          lost = true;
          step.html += '<p><b>Both Minus dice are already out: this failure loses the situation.</b></p>';
        }
      }
      // The first row to complete the situation (with afterWin 'safe', the danger passes for the rest).
      if (!firstWon && row.tokens.length >= target) {
        firstWon = row;
        if (SIM_RULES.afterWin === 'safe' && rollOrder.some(r => r.main && rollOrder.indexOf(r) > rollOrder.indexOf(row))) {
          board.over = true;
          step.html += `<p><b>${rowTag(row)} completes the situation!</b> The danger has passed: the rows still to roll still roll for spotlight, but a miss costs nothing${SIM_RULES.shareActWin ? '. Any of them that finish too share the win' : ''}.</p>`;
        } else if (SIM_RULES.shareActWin && rollOrder.some(r => r.main && rollOrder.indexOf(r) > rollOrder.indexOf(row))) {
          step.html += `<p><b>${rowTag(row)} completes the situation!</b> The act ends with this round: the rows still to roll still roll as usual, and any of them that finish too share the win.</p>`;
        }
      }
      // The pawns, approach die and cards stay put while the result shows, so the roll can be checked.
      yield step;
      // Wrap-up: the tokens move, and the row's pawns (and initiative token) go back to the wheel,
      // so you can see who still has to go.
      moves.forEach(([p, x, y]) => glide(p, x, y));
      [row.main, ...row.helpers].forEach(p => glide(p.pawn, p.pawnHome.x, p.pawnHome.y));
      if (SIM_RULES.freeApproach) dropApproachDie(row);
      if (row.main.initHome) { row.main.initToken.el.classList.remove('on-board'); glide(row.main.initToken, row.main.initHome.x, row.main.initHome.y); }
      returnUsedCards(shown);
      yield rollWrapUp(row, moves);
      if (TABLE.pendingSwap) { // the human player drew a second Asset or Liability
        const sw = TABLE.pendingSwap;
        TABLE.pendingSwap = null;
        const old = (sw.kind === 'Asset' ? sw.pl.zones.boon : sw.pl.zones.bane).occupant;
        const takeNew = yield ask(`Which ${sw.kind} do you keep?`, `<p>You can only hold one ${sw.kind}.</p>`,
          [{ label: `Keep ${old.card.text}`, hint: old.card.approaches.join(''), value: false }, { label: `Take ${sw.card.text}`, hint: sw.card.approaches.join(''), value: true }]);
        yield applySwap(sw, takeNew);
      }
    }

    // ---- The Clear seat: one Minus die comes off now that every row has rolled ----
    if (board.clearer) {
      const clearer = board.clearer;
      TABLE.firstNext = SIM_RULES.clearGoesFirst ? clearer : null; // the clearer bets first next round
      // A human clearer picks the die (when there's a real choice).
      let die = null;
      const faces = [...new Set(board.minus.map(d => d.faces[d.value - 1]))];
      if (clearer.human && faces.length > 1) {
        const k = yield ask('Which Minus die?', '<p>You held the line this round. Pick the Minus die to remove; you take 1 Story Point for it.</p>',
          board.minus.map((d, k) => ({ label: `Remove ➖${d.faces[d.value - 1]}`, hint: d.fresh ? 'went in this round' : `−1 to ${d.faces[d.value - 1]} rolls`, value: k })));
        die = board.minus[k];
      }
      glide(clearer.pawn, clearer.pawnHome.x, clearer.pawnHome.y);
      yield { title: `${clearer.letter} clears a Minus die`, html: `<p>${clearDie(clearer, rows, board, die)}</p>` };
      board.clearer = null;
    }

    // ---- Did it end? ----
    const won = firstWon || rows.find(r => r.tokens.length >= target);
    if (won) {
      const hero = won.main;
      // Everyone who finished a row this round shares the win (SIM_RULES.shareActWin).
      const finishers = SIM_RULES.shareActWin ? rollOrder.filter(r => r.main && r.tokens.length >= target) : [won];
      entry.result = { row: won.index, name: hero.info.name, color: hero.color, letter: hero.letter, action: won.action,
        winners: finishers.map(r => ({ row: r.index, name: r.main.info.name, color: r.main.color, letter: r.main.letter })) };
      showAct(TABLE.history.length - 1);
      // The Spotlight Shift: whoever on the winning row had the least scored spotlight (before
      // this win) takes the act-win bonus; ties go to the Main.
      const low = Math.min(...[hero, ...won.helpers].map(p => p.score));
      const star = SIM_RULES.spotlightShift && hero.score !== low ? won.helpers.find(h => h.score === low) : hero;
      const reached = won.tokens.length; // before the board is scored (and cleared)
      // The Underdog Bonus (SIM_RULES.underdogBonus): a finisher who wasn't leading in scored spotlight
      // going into this act's scoring banks double.
      const before = new Map(TABLE.players.map(pl => [pl, pl.score]));
      const lead = Math.max(...before.values());
      const scored = scoreBoard(rows);
      // Bonus for finishing it, straight into Scored spotlight: the hero, and their helpers.
      const share = playerRule('actWinBonus')[act] || { main: 0, helper: 0 };
      const award = (pl, n) => {
        let got = 0;
        for (let i = 0; i < n; i++) { const t = spotSupply(pl).pop(); if (t) { bankToken(pl, t); got++; } }
        return got;
      };
      const underdog = pl => SIM_RULES.underdogBonus && before.get(pl) < lead;
      const winBonus = pl => share.main * (underdog(pl) ? 2 : 1);
      const dogNote = pl => (underdog(pl) ? ' — doubled, the <b>Underdog Bonus</b>: they weren’t leading' : '');
      const bonus = award(star, winBonus(star));
      const starDog = dogNote(star);
      const helperBonus = [hero, ...won.helpers].filter(p => p !== star).map(h => [h, award(h, share.helper)]).filter(([, n]) => n);
      // The other rows that finished this round: each Main banks the full bonus too.
      const others = finishers.filter(r => r !== won).map(r => [r, dogNote(r.main), award(r.main, winBonus(r.main))]);
      yield {
        title: 'Situation defeated!',
        html: `<p>${rowTag(won)} reached ${reached}/${target}. Every spotlight token on the board is scored:</p>
          <p>${scored}</p><p>Totals: ${TABLE.players.map(pl => `${who(pl)} ${pl.score}`).join(' · ')}</p>
          ${bonus ? (star === hero
            ? `<p>${who(hero)} finished it, and banks a <b>${bonus}-spotlight bonus</b> for winning ${act}${starDog}${helperBonus.length ? `; ${helperBonus.map(([h, n]) => `${who(h)} banks ${n} for helping`).join(', ')}` : ''}.</p>`
            : `<p><b>${who(star)} steals the spotlight!</b> They had the least spotlight on the winning row, so they bank the <b>${bonus}-spotlight bonus</b> for ${act}${helperBonus.length ? `; ${helperBonus.map(([h, n]) => `${who(h)} banks ${n}`).join(', ')}` : ''}.</p>`) : ''}
          ${others.map(([r, dog, n]) => `<p>${who(r.main)} finished ${rowTag(r)} this round too${n ? ` and banks a <b>${n}-spotlight bonus</b>${dog}` : ''}.</p>`).join('')}
          <p>The Situation card gets a ★ stamp for ${finishers.map(r => `${who(r.main)} on ${rowLabel(r)}`).join(' and ')}.</p>`,
      };
      yield endSituation(rows, board);
      return;
    }
    if (lost) {
      entry.result = { lost: true };
      showAct(TABLE.history.length - 1);
      const { back, note } = clearBoard(rows);
      yield { title: 'Situation lost', html: `<p>The situation slips out of the heroes’ hands. ${back} spotlight token${back === 1 ? '' : 's'} on the board go back to their owners, unscored.${note}</p>` };
      yield endSituation(rows, board);
      return;
    }
    board.minus.forEach(d => { d.fresh = false; d.el.classList.remove('fresh'); }); // they count from now on
    yield endRound(round, rows);
  }

  entry.result = { lost: true };
  showAct(TABLE.history.length - 1);
  const { back, note } = clearBoard(rows);
  yield { title: 'Out of time', html: `<p>${SIM_RULES.maxRounds} rounds without a result: the situation is lost. ${back} tokens go back unscored.${note}</p>` };
  yield endSituation(rows, board);
}

// The A/B/C choices from the Situation text, ready to drop into a sentence:
// symbols filled in, the trailing approach + (risk) removed, and "you" → "they".
function rowActions(situation) {
  const actions = ['', '', ''];
  const seen = new Set(['villain', 'ally']); // names only; titles were given in the intro
  const words = narrationWords();
  situation.description.split('\n').forEach(line => {
    const m = line.match(/^\s*([ABC])\)\s*(.+)$/);
    if (!m) return;
    const text = m[2]
      .replace(/\s*\p{Extended_Pictographic}️?\s*\(\s*\p{Extended_Pictographic}️?\s*\)\s*$/u, '')
      .replace(/\byourself\b/gi, 'themselves')
      .replace(/\byour\b/gi, 'their')
      .replace(/\byou(['’])(re|ve|ll|d)\b/gi, 'they$1$2')
      .replace(/\byou\b(?=\s*([.,;!?]|$))/gi, 'them') // "before anyone sees you"
      .replace(/\byou\b/gi, 'they')
      .trim();
    actions['ABC'.indexOf(m[1])] = narrate(text, words, seen);
  });
  return actions;
}

function narrationFor(text) {
  return narrate(text, narrationWords(), new Set()).replace(/\n/g, '<br>');
}

// ---------------------------------------------------------------------------
// Betting: the actions a player can take, shared by the bots and the human player
// ---------------------------------------------------------------------------

// A question for the human player: the panel shows `options` ({ label, hint, value }) as
// buttons, and the game gets the chosen value back from `yield`.
const ask = (title, html, options) => ({ title, html, ask: options });

// Losing a turn (a resource at 0), or coming back from one. Returns { step } if the player sits
// this round out, else { recovered } (the "back in the game" note, if any).
// Buy back a resource (SIM_RULES.recoverCost): Story Points for 1 point of a resource, up to its start.
const recoverCap = (pl, res) => (SIM_RULES.recoverMax === 'start' ? pl.resStart[res] : SIM_RULES.recoverMax);
const canRecover = (pl, res) => SIM_RULES.recoverCost > 0 && pl.edge.length >= SIM_RULES.recoverCost && pl.res[res] < recoverCap(pl, res);
function recoverResource(pl, res) {
  for (let i = 0; i < SIM_RULES.recoverCost; i++) spendEdge(pl);
  const was = pl.res[res];
  setResource(pl, res, was + 1);
  return `<p>${who(pl)} spends ${storyPts(SIM_RULES.recoverCost)} to recover their ${res} ${riskName(res)} (${was} → ${was + 1}${was === 0 ? ': the die is back on their sheet' : ''}).</p>`;
}
// A bot buys back the resources this situation's rows risk, lowest first, keeping 1 Story Point in hand.
function botRecover(pl, rows) {
  let html = '';
  const wanted = [...new Set(rows.map(r => r.risk))];
  for (let n = 0; n < 4; n++) {
    const res = wanted.filter(r => canRecover(pl, r) && pl.edge.length >= SIM_RULES.recoverCost + 1).sort((a, b) => pl.res[a] - pl.res[b])[0];
    if (!res) break;
    html += recoverResource(pl, res);
  }
  return html;
}

// Between acts (SIM_RULES.actEndHeal): each player puts some resource points back wherever they
// like, up to SIM_RULES.healMax (or their starting values); a used-up die comes back. You choose
// for each point; bots put theirs on their lowest resources.
function* healBetweenActs(players) {
  const cap = (pl, r) => SIM_RULES.healMax || pl.resStart[r];
  const notes = [];
  for (const pl of players) {
    const got = [];
    for (let n = 0; n < playerRule('actEndHeal'); n++) {
      const open = Object.keys(pl.res).filter(r => pl.res[r] < cap(pl, r));
      if (!open.length) break;
      const res = pl.human
        ? yield ask(`Catch your breath (${n + 1} of ${playerRule('actEndHeal')})`,
          `<p>Between acts you get back ${playerRule('actEndHeal')} resource point${playerRule('actEndHeal') === 1 ? '' : 's'}: put each one wherever you like (up to ${SIM_RULES.healMax || 'its starting value'}).</p>`,
          open.map(r => ({ label: `${r} ${riskName(r)}`, hint: `${pl.res[r]} → ${pl.res[r] + 1}${pl.res[r] === 0 ? ' (back on your sheet)' : ''}`, value: r })))
        : open.sort((a, b) => pl.res[a] - pl.res[b])[0];
      setResource(pl, res, pl.res[res] + 1);
      got.push(res);
    }
    if (got.length) notes.push(`${who(pl)} ${got.join(' ')}`);
  }
  yield { title: 'Catching your breath', html: `<p>Between acts everyone gets back ${playerRule('actEndHeal')} resource point${playerRule('actEndHeal') === 1 ? '' : 's'}, wherever they like.</p><p>${notes.join(' · ') || 'Nobody needs to.'}</p>` };
}

function betPrelude(pl) {
  if (pl.out && pl.out.skip) {
    pl.out.skip = false;
    pulse(pl.pawn);
    return {
      step: {
        title: `${pl.letter} loses their turn`,
        html: `<p>${who(pl)} ran out of ${pl.out.res} and loses this turn (their initiative token shows OUT). At the end of the round they flip it back; next turn they’re back with 1 ${pl.out.res}.</p>`,
      },
    };
  }
  let recovered = '';
  if (pl.out) {
    setResource(pl, pl.out.res, 1);
    recovered = `<p>${who(pl)} is back in the game with 1 ${pl.out.res}.</p>`;
    pl.out = null;
  }
  return { recovered };
}

// Give up the bet to clear a Minus die. Old rule ('now'): off at once. Clear seat ('end'): the
// pawn sits in the seat and the die comes off at the end of the round.
function takeClearSeat(pl, rows, board, recovered) {
  if (SIM_RULES.clearTiming !== 'end') {
    return { title: `${pl.letter} clears a Minus die`, html: `${recovered}<p>${who(pl)} gives up their bet this round: ${clearDie(pl, rows, board)}</p>` };
  }
  board.clearer = pl;
  glide(pl.pawn, TABLE.clearSeat.x - pl.pawn.w / 2, TABLE.clearSeat.y - pl.pawn.h / 2);
  return {
    title: `${pl.letter} takes the Clear seat`,
    html: `${recovered}<p>${who(pl)} gives up their bet to hold the line. This round’s rolls still feel the Minus dice, but a failure can’t lose the situation, and at the end of the round they remove one die (and take 1 Story Point${SIM_RULES.clearSpotlight ? ` and ${SIM_RULES.clearSpotlight} spotlight` : ''}${SIM_RULES.clearGoesFirst ? ', and bet first next round' : ''}).</p>`,
  };
}

function patchUp(pl, bane, recovered) {
  dropBane(pl, bane);
  return {
    title: `${pl.letter} patches themselves up`,
    html: `${recovered}<p>${who(pl)} gives up their bet this round to deal with their Liability ${baneName(bane)}: back into the deck.</p>`,
  };
}

function shakeOffBane(pl, bane) {
  for (let i = 0; i < SIM_RULES.baneRemoveEdge; i++) spendEdge(pl);
  dropBane(pl, bane);
  return `<p>${who(pl)} spends ${storyPts(SIM_RULES.baneRemoveEdge)} to shake off their Liability ${baneName(bane)}: back into the deck.</p>`;
}

// The Edge die (the Scene die), claimed for a row (SIM_RULES.sceneClaim): into the row's Edge box,
// and back to the Board's banner once everyone has gone (at the start of the next round).
function claimSceneDie(row) {
  row.sceneDie = true;
  TABLE.sceneRow = row;
  if (TABLE.sceneDie) {
    TABLE.sceneDie.el.classList.add('in-box');
    const c = cellSpot(row, COL.edge >= 0 ? COL.edge : COL.main, TABLE.sceneDie.w, TABLE.sceneDie.h); // in the row's Edge box
    glide(TABLE.sceneDie, c.x, c.y);
  }
}
function returnSceneDie(row) {
  if (!row.sceneDie) return;
  row.sceneDie = false;
  if (TABLE.sceneRow === row) TABLE.sceneRow = null;
  if (TABLE.sceneDie && TABLE.sceneDieAt) { TABLE.sceneDie.el.classList.remove('in-box'); glide(TABLE.sceneDie, TABLE.sceneDieAt.x, TABLE.sceneDieAt.y); }
}

// The Main player's own approach die (freeApproach): turned to the approach they go in with and
// moved from their portrait into their box on the Board, then back home after the roll.
const PAWN_RAISE = -4; // a pawn in a round spot sits a little high, so its base is near the middle
function setApproachDie(row) {
  const idx = APPROACHES.findIndex(a => same(a, row.approach));
  const die = row.main.approachDie;
  if (idx < 0 || !die) return;
  setDieValue(die, idx + 1);
  const c = cellSpot(row, COL.approach, die.w, die.h); // in the row's Approach box
  glide(die, c.x, c.y);
  row.approachDie = die;
}
function dropApproachDie(row) {
  const die = row.approachDie;
  row.approachDie = null;
  const pl = die && TABLE.players.find(p => p.approachDie === die);
  if (pl) glide(die, pl.approachDieHome.x, pl.approachDieHome.y);
}

// Main on `row`. `stake` is a number, or a function of the roll's parts (the bots' choice).
// `approach` is the one they act with (freeApproach); otherwise it's the row's.
function betMain(pl, row, board, difficulty, recovered, stake, approach = null) {
  row.main = pl;
  if (SIM_RULES.freeApproach) { row.approach = approach; setApproachDie(row); }
  // What the Storyteller (and the playtest stats) see: how often each approach has been used.
  pl.approachUses = pl.approachUses || {};
  pl.approachUses[row.approach] = (pl.approachUses[row.approach] || 0) + 1;
  const c = cellSpot(row, COL.main, pl.pawn.w, pl.pawn.h, 0, PAWN_RAISE);
  glide(pl.pawn, c.x, c.y);
  if (SIM_RULES.rowOrder === 'initiative') { // rolls in this order: the token rides along, small, in the box's corner
    pl.initToken.el.classList.add('on-board');
    const t = cellSpot(row, COL.main, pl.initToken.w, pl.initToken.h, 30, 24); // at the pawn's base, bottom right
    glide(pl.initToken, t.x, t.y);
  }
  // The first Main of the round going in with the Scene's approach takes the Scene die.
  if (SIM_RULES.sceneBy === 'approach' && SIM_RULES.sceneClaim && TABLE.scene && !TABLE.sceneRow && same(row.approach, TABLE.scene.approach)) {
    claimSceneDie(row);
  }
  const parts = [...bonusParts(pl, row.approach, row), ...riskPart(row, row.approach)];
  const minus = minusFor(board, row.approach);
  if (minus) parts.push([`Minus ➖${row.approach} ×${minus}`, -minus]);
  { const ob = obstacleFor(board, row, row.approach, pl); if (ob) parts.push([`Obstacle ➖${row.approach}`, -ob]); }

  // Invoke a matching element line, if one is still free.
  const line = freeLine(row.approach);
  row.invoke = null;
  if (line) {
    setLineUsed(line.piece, line.i, true);
    pulse(line.piece);
    row.invoke = line;
    parts.push([`Invoke “${line.text}”`, 1]);
  }

  // Stake spotlight tokens.
  let n = typeof stake === 'function' ? stake(parts) : stake;
  const fromScored = SIM_RULES.stakeFrom === 'scored';
  const source = fromScored ? pl.scored : spotSupply(pl);
  n = Math.max(0, Math.min(n, SIM_RULES.maxStake, source.length));
  row.stake = [];
  row.stakeFromScored = fromScored;
  for (let i = 0; i < n; i++) {
    const token = source.pop();
    if (fromScored) pl.score--;
    token.home = token.home || { x: token.x, y: token.y };
    token.el.classList.add('staked');
    const spot = cellSpot(row, COL.main, token.w, token.h, 0, 26 - i * 5); // a stack under the pawn's base
    glide(token, spot.x, spot.y);
    row.stake.push(token);
  }
  if (row.stake.length) raise(pl.pawn); // the pawn stands on top of its stake

  let html = `${recovered}<p>${who(pl)} decides to <i>${row.action}</i> (${rowTag(row)} as <b>Main</b>${SIM_RULES.freeApproach ? `, going in ${row.approach}` : ''}).</p>`;
  if (row.sceneDie) html += `<p>They’re the first this round to go in ${row.approach}, the Edge die’s approach: they take the Edge die (${sceneMod()}).</p>`;
  if (line) html += `<p>They invoke <b>“${esc(line.text)}”</b> from the ${esc(line.from)} card (${row.approach} +1). Nobody else can use that line this situation.</p>`;
  html += '<p>' + (parts.length ? parts.map(([l, v]) => `${esc(l)} ${signed(v)}`).join(', ') : 'No card bonuses for this approach');
  html += ` → <b>${signed(total(parts))}</b> before the spin. If it fails, they take ${failWords(row)}.</p>`;
  if (n) html += `<p>They <b>stake ${n}</b> of their scored spotlight: ${SIM_RULES.stakeNeedsMargin ? `beat the difficulty by ${n}+` : 'succeed'} and they bank ${n * (1 + SIM_RULES.stakePayout)}; anything less and the stake is gone.</p>`;
  else if (SIM_RULES.maxStake) html += `<p>${pl.scored.length || pl.score ? 'They stake nothing.' : 'Nothing scored yet, so nothing to stake.'}</p>`;
  return { title: `${pl.letter} bets`, html };
}

function betHelp(pl, row, recovered) {
  row.helpers.push(pl);
  const c = cellSpot(row, COL.help, pl.pawn.w, pl.pawn.h, (row.helpers.length - 1) * 26 - 13, PAWN_RAISE);
  glide(pl.pawn, c.x, c.y);
  const rel = relFor(pl, row.approach);
  return {
    title: `${pl.letter} helps`,
    html: `${recovered}<p>${who(pl)} helps ${who(row.main)} <i>${row.action}</i> (${rowTag(row)} as <b>Help</b>).</p>
      <p>Their Relationship “${esc(rel.text)}” has ${row.approach}: +1 to the bet, and a share of the spotlight if it pays off. ${SIM_RULES.failLiabilityOnly ? '' : `They’re also on the hook for ${lossWords(row)} if it fails.`}</p>`,
  };
}

function passTurn(pl, recovered, why = 'has nothing useful to bet on and sits this round out') {
  pulse(pl.pawn);
  return { title: `${pl.letter} passes`, html: `${recovered}<p>${who(pl)} ${why}.</p>` };
}

// A bot's bet.
function bet(pl, rows, board, difficulty, isLast = false) {
  const pre = betPrelude(pl);
  if (pre.step) return pre.step;
  let recovered = pre.recovered + (SIM_RULES.recoverCost ? botRecover(pl, rows) : '');

  const free = rows.filter(r => !r.main);
  // Each free row with each approach it could be played with (just its own without freeApproach).
  // The value is the roll's bonuses, less half a point for each extra resource a failure would
  // cost, and a point more if it could knock them out.
  const options = free.flatMap(r => (SIM_RULES.freeApproach ? APPROACHES : [r.approach]).map(approach => ({ row: r, approach })));
  const rollScore = o => total(bonusParts(pl, o.approach)) + riskMod(o.row, o.approach) - minusFor(board, o.approach) - obstacleFor(board, o.row, o.approach, pl) + (freeLine(o.approach) ? 1 : 0);
  const value = o => {
    const cost = riskCost(o.row.risk, o.approach);
    return rollScore(o) - (cost - 1) * (SIM_RULES.narrowCost ? 1 : 0.5) - (cost && pl.res[o.row.risk] <= cost ? 1 : 0);
  };
  const scored = options.map(o => ({ ...o, v: value(o) + Math.random() * 0.01 })); // break ties at random
  const pick = scored.length ? scored.reduce((a, b) => (b.v > a.v ? b : a)) : null;
  const best = pick && pick.row;
  const score = () => (pick ? Math.round(pick.v) : 0);
  const helpable = rows.filter(r => r.main && relFor(pl, r.approach));

  const seatRule = SIM_RULES.clearTiming === 'end';
  const seatFree = board.minus.length > 0 && !(seatRule && board.clearer);
  const noGoodBet = (!best || score(best) <= 0) && !helpable.length;
  // Both Minus dice out: clear one if there's nothing better to do. With the seat, the last
  // player to bet also takes it if nobody is holding the line yet.
  if (seatFree && board.minus.length >= SIM_RULES.maxEscalations && (noGoodBet || (seatRule && isLast))) return takeClearSeat(pl, rows, board, recovered);

  // ✖️ A Liability that hits the row they'd bet on: spend Edge to shake it off if they can spare
  // it, or, if it hits most of this situation's rows, give up the bet to patch themselves up.
  const bane = SIM_RULES.banes && pl.zones.bane && pl.zones.bane.occupant;
  if (bane && best && has(bane.card.approaches, pick.approach)) {
    if (pl.edge.length >= SIM_RULES.baneRemoveEdge + 2) recovered += shakeOffBane(pl, bane);
    else if (baneBite(bane, rows) >= 2) return patchUp(pl, bane, recovered);
  }

  // The Spotlight Shift: a player behind the Main of a row that's close to finishing would
  // rather help it, and take the act-win bonus if it wins.
  const target = TABLE.target ?? actTarget(SIM_RULES.acts[0]);
  const stealRow = SIM_RULES.spotlightShift
    ? helpable.find(r => target - r.tokens.length <= 2 && pl.score < r.main.score) : null;

  if (!stealRow && best && (score(best) >= 0 || !helpable.length)) {
    // Stake spotlight tokens: more the better the odds, one more when behind.
    return betMain(pl, best, board, difficulty, recovered, parts => {
      const odds = total(parts) - difficulty;
      const leader = Math.max(...TABLE.players.map(p => p.score));
      // Stake when it pays on average: the Fate card is -2..+2, so a success needs Fate >= 1 - odds.
      const pWin = Math.min(1, Math.max(0, (odds + 2) / 5));
      const worth = pWin * SIM_RULES.stakePayout - (1 - pWin); // average gain per token staked
      let stake = SIM_RULES.stakeNeedsMargin ? Math.max(0, odds) : worth <= 0 ? 0 : pWin >= 0.6 ? 2 : 1;
      if (pl.score <= leader - 3) stake++;
      if (SIM_RULES.stakeOverride) stake = SIM_RULES.stakeOverride(pl, stake); // for balance experiments
      return stake;
    }, pick.approach);
  }

  if (stealRow || helpable.length) {
    return betHelp(pl, stealRow || helpable.reduce((a, b) => (b.tokens.length > a.tokens.length ? b : a)), recovered);
  }

  if (seatFree) return takeClearSeat(pl, rows, board, recovered);
  return passTurn(pl, recovered);
}

// The human player's bet: buttons in the panel.
function* humanBet(pl, rows, board, difficulty) {
  const pre = betPrelude(pl);
  if (pre.step) { yield pre.step; return; }
  let recovered = pre.recovered;
  const seatRule = SIM_RULES.clearTiming === 'end';
  for (;;) {
    const free = rows.filter(r => !r.main);
    const helpable = rows.filter(r => r.main && relFor(pl, r.approach));
    const seatFree = board.minus.length > 0 && !(seatRule && board.clearer);
    const bane = SIM_RULES.banes && pl.zones.bane && pl.zones.bane.occupant;
    const cards = r => total(bonusParts(pl, r.approach)) - minusFor(board, r.approach);
    const opts = [
      ...free.map(r => ({
        label: `Main ${rowTag(r)}`,
        hint: SIM_RULES.freeApproach
          ? `${r.action} · risks ${riskName(r.risk)}: ${RISKS[r.risk] ? (SIM_RULES.riskModifier ? `${RISKS[r.risk].good} +1, ${RISKS[r.risk].bad} −1` : `${RISKS[r.risk].good} costs nothing, ${RISKS[r.risk].bad} costs 2`) : ''}`
          : `${r.action} · your cards ${signed(cards(r))} · risks ${r.risk}${has(pl.info.trouble.approaches, r.approach) ? ' · matches your Trouble' : ''}${bane && has(bane.card.approaches, r.approach) ? ' · matches your Liability' : ''}`,
        value: ['main', r.index],
      })),
      ...helpable.map(r => ({ label: `Help ${rowTag(r)}`, hint: `back up ${r.main.letter}: +1 to their roll, 1 token if it works · risks ${r.risk}`, value: ['help', r.index] })),
      ...(seatFree ? [{ label: 'Clear box', hint: 'hold the line, and remove a Minus die at the end of the round (+1 Story Point)', value: ['clear'] }] : []),
      ...(bane && pl.edge.length >= SIM_RULES.baneRemoveEdge ? [{ label: `Shake off your Liability (${storyPts(SIM_RULES.baneRemoveEdge)})`, hint: `discard ${bane.card.text}, then bet`, value: ['shake'] }] : []),
      ...(bane ? [{ label: 'Patch yourself up', hint: `give up your bet to discard ${bane.card.text}`, value: ['patch'] }] : []),
      ...Object.keys(pl.res).filter(r => canRecover(pl, r)).map(r => ({ label: `Recover ${r} ${riskName(r)} (${storyPts(SIM_RULES.recoverCost)})`, hint: `${pl.res[r]} → ${pl.res[r] + 1}, then bet`, value: ['recover', r] })),
      { label: 'Pass', hint: 'sit this round out', value: ['pass'] },
    ];
    const status = `<p>You have <b>${pl.edge.length}</b> Story Points and <b>${pl.score}</b> scored spotlight${bane ? `, and you carry the Liability ${baneName(bane)}` : ''}. Difficulty <b>${difficulty}</b>.</p>`;
    const [what, i] = yield ask(`Your bet, ${pl.info.name}`, `${recovered}${status}<p>Where does your pawn go?</p>`, opts);
    const row = rows[i];
    if (what === 'shake') { recovered += shakeOffBane(pl, bane); continue; }
    if (what === 'recover') { recovered += recoverResource(pl, i); continue; }
    if (what === 'main') {
      let approach = null;
      if (SIM_RULES.freeApproach) {
        const score = a => total(bonusParts(pl, a)) + riskMod(row, a) - minusFor(board, a) - obstacleFor(board, row, a, pl);
        // Where the bonus comes from: your cards, the Situation's ✓ / ✗, the Scene die, Minus dice, the Obstacle.
        const scoreWords = a => {
          const parts = bonusParts(pl, a), scene = total(parts.filter(([l]) => /^Edge die/.test(l)));
          const bits = [[`your cards`, total(parts) - scene], [`Situation ${riskMod(row, a) > 0 ? '✓' : '✗'}`, riskMod(row, a)], ['Edge die', scene],
            ['Minus', -minusFor(board, a)], ['Obstacle', -obstacleFor(board, row, a, pl)]].filter(([, v]) => v);
          return bits.length ? `${signed(score(a))}: ${bits.map(([l, v]) => `${l} ${signed(v)}`).join(' · ')}` : 'no bonus';
        };
        approach = yield ask('Which approach?', `<p>How do you <i>${row.action}</i>? ${rowTag(row)} risks <b>${riskName(row.risk)}</b>: the approach you pick sets what a failure costs.</p>`,
          APPROACHES.map(a => ({
            label: a,
            hint: `${scoreWords(a)}${SIM_RULES.failLiabilityOnly ? '' : ` · a failure costs ${lossWords(row, a)}`}${has(pl.info.trouble.approaches, a) ? ' · matches your Trouble' : ''}${bane && has(bane.card.approaches, a) ? ' · matches your Liability' : ''}`,
            value: a,
          })));
      }
      const max = Math.min(SIM_RULES.maxStake, SIM_RULES.stakeFrom === 'scored' ? pl.scored.length : spotSupply(pl).length);
      let stake = 0;
      if (max > 0) {
        stake = yield ask('Stake spotlight?', `<p>You may stake up to ${max} of your scored spotlight on ${rowTag(row)}. If the roll succeeds you get it back plus ${SIM_RULES.stakePayout}× on top; anything less and it’s lost.</p>`,
          Array.from({ length: max + 1 }, (_, s) => ({ label: s ? `Stake ${s}` : 'No stake', hint: s ? `a success banks ${s * (1 + SIM_RULES.stakePayout)}` : 'play it safe', value: s })));
      }
      yield betMain(pl, row, board, difficulty, recovered, stake, approach);
    } else if (what === 'help') yield betHelp(pl, row, recovered);
    else if (what === 'clear') yield takeClearSeat(pl, rows, board, recovered);
    else if (what === 'patch') yield patchUp(pl, bane, recovered);
    else yield passTurn(pl, recovered, 'sits this round out');
    return;
  }
}

// ---------------------------------------------------------------------------
// Rolling
// ---------------------------------------------------------------------------

// The effort parts of a row's roll before any Edge: cards, help, Minus dice, invoked lines,
// Trouble / Liability hits and the Fate number.
// Step 1 of a roll: who's rolling, and how.
function rollIntro(row) {
  const m = row.main;
  return {
    title: `${m.info.name} rolls`,
    html: `<p>${who(m)} goes ${row.approach} to <i>${row.action}</i>${row.helpers.length ? `, with help from ${row.helpers.map(who).join(' and ')}` : ''}.</p>`,
  };
}

// Step 2: every bonus and penalty, one per line, and where that leaves the roll (before any Story
// Points or resource points are spent).
function rollBonuses(row, fate, difficulty, board) {
  const parts = rowParts(row, fate, board);
  const sum = total(parts), m = sum - difficulty;
  const outcome = m > 0 ? `a success by ${m}` : m <= -SIM_RULES.failBy ? `a failure (misses by ${-m})` : m === 0 ? 'a tie: nothing happens' : `a near miss (by ${-m}): nothing happens`;
  return {
    title: `What counts for ${row.main.info.name}`,
    html: `<ul class="roll-parts">${parts.map(([l, v]) => `<li><span>${esc(l)}</span><b>${signed(v)}</b></li>`).join('')}</ul>
      <p>Total <b>${sum}</b> vs difficulty ${difficulty}: right now that’s <b>${outcome}</b>.</p>`,
  };
}

// Step 5: the spotlight tokens the roll earned move, and the cards and pawns go back.
function rollWrapUp(row, moves) {
  const byPlayer = {};
  moves.forEach(([p]) => { if (p.player) byPlayer[p.player] = (byPlayer[p.player] || 0) + 1; });
  const took = Object.entries(byPlayer).map(([letter, n]) => `${who(TABLE.players.find(pl => pl.letter === letter))} takes ${n} spotlight token${n === 1 ? '' : 's'}`);
  return {
    title: `${row.main.info.name}’s roll is done`,
    html: `<p>${took.length ? `${took.join(', ')}. ` : ''}The cards go back, and the pawns return to the Relationship board.</p>`,
  };
}

function rowParts(row, fate, board) {
  const parts = [...bonusParts(row.main, row.approach, row), ...riskPart(row, row.approach)];
  if (row.helpers.length) parts.push([`Help ×${row.helpers.length}`, row.helpers.length]);
  const minus = minusFor(board, row.approach);
  if (minus) parts.push([`Minus ➖${row.approach} ×${minus}`, -minus]);
  { const ob = obstacleFor(board, row, row.approach, row.main); if (ob) parts.push([`Obstacle ➖${row.approach}`, -ob]); }
  if (row.invoke) parts.push([`Invoke “${row.invoke.text}”`, 1]);
  (row.hits || []).forEach(h => parts.push([h, -1])); // invoked or compelled Trouble / Liability
  parts.push([`Fate ${row.approach}`, fate]);
  return parts;
}

// How much Edge bots on a row spend after seeing the card, given the margin so far (`before`)
// and `room` left under the per-roll cap. 'push' bots spend whatever turns a miss into a
// success; failing that (or 'careful' bots), just enough to dodge a failure, or 1 to turn a tie
// into a success. Payers in order (the Main pays first). Returns [[player, n], ...].
function botEdgePlan(row, before, payers, room) {
  const can = Math.min(payers.reduce((k, p) => k + p.edge.length, 0), room);
  const aim = Math.max(1, SIM_RULES.stakeNeedsMargin ? (row.stake || []).length : 1); // succeed, and clear any stake
  const toSucceed = before < aim ? aim - before : 0;
  const toSurvive = before <= -SIM_RULES.failBy ? -SIM_RULES.failBy + 1 - before : 0;
  let want = 0;
  if (SIM_RULES.edgePolicy === 'push' && toSucceed && toSucceed <= can) want = toSucceed;
  else if (toSurvive && toSurvive <= can) want = toSurvive;
  else if (before === 0 && can >= 1) want = 1;
  const plan = [];
  for (const p of payers) {
    const k = Math.min(want, p.edge.length);
    if (k) { plan.push([p, k]); want -= k; }
  }
  return plan;
}

// The human player on a row (as Main, or a helper who may spend Edge) decides how much Edge to
// spend, seeing the card. Returns { spend: [[player, n], ...], margin }, or null.
function* humanEdgePlan(row, fate, difficulty, board) {
  const human = [row.main, ...row.helpers].find(p => p.human);
  if (!human || !(human === row.main || SIM_RULES.helperEdge)) return null;
  const parts = rowParts(row, fate, board);
  const before = total(parts) - difficulty;
  const bots = [row.main, ...(SIM_RULES.helperEdge ? row.helpers : [])].filter(p => !p.human);
  const cap = edgeCap();
  const plan = human === row.main ? [] : botEdgePlan(row, before, bots, cap); // a bot Main decides first
  const used = plan.reduce((k, [, n]) => k + n, 0);
  const max = Math.min(human.edge.length, cap - used);
  const outcome = m => (m > 0 ? `a success by ${m}` : m <= -SIM_RULES.failBy ? 'a failure' : 'a close call (nothing happens)');
  let k = 0;
  // The Main player picks Story Points and resource points together (+1 each), up to all they have.
  const resMost = human === row.main ? pushMax(row) : 0;
  if (human === row.main && (max > 0 || resMost > 0)) {
    const sum = parts.map(([l, v]) => `${esc(l)} ${signed(v)}`).join(' · ');
    const pick = yield {
      title: `Push the roll on ${rowLabel(row)}?`,
      html: `<p>${sum} = ${before + difficulty} vs difficulty ${difficulty}: right now that’s <b>${outcome(before)}</b>.</p><p>Spend Story Points and / or succeed at a cost with your ${row.risk} ${riskName(row.risk)}: <b>+1 each</b>. A resource spent down to 0 leaves your sheet.</p>`,
      spend: { base: before, sp: max, res: resMost, have: human.res[row.risk], resLabel: `${row.risk} ${riskName(row.risk)}`, failBy: SIM_RULES.failBy },
    };
    k = pick.sp;
    if (k) plan.push([human, k]);
    return { spend: plan, margin: before + k, pushChosen: pick.res };
  }
  if (max > 0) {
    const sum = parts.map(([l, v]) => `${esc(l)} ${signed(v)}`).join(' · ');
    k = yield ask(`Spend Story Points on ${rowLabel(row)}?`,
      `<p>${sum} = ${before + difficulty} vs difficulty ${difficulty}${used ? `, and ${who(row.main)} spends ${storyPts(used)}` : ''}: right now that’s <b>${outcome(before + used)}</b>.</p><p>You have ${human.edge.length} banked Story Points (at most ${cap} per roll in all).</p>`,
      Array.from({ length: max + 1 }, (_, i) => ({ label: i ? `Spend ${storyPts(i)}` : 'Spend none', hint: outcome(before + used + i), value: i })));
  }
  if (k) plan.push([human, k]);
  if (human === row.main) plan.push(...botEdgePlan(row, before + k, bots, cap - k)); // bot helpers top up
  return { spend: plan, margin: before + plan.reduce((n, [, x]) => n + x, 0) };
}

// The human player chooses between their Asset or Liability and the one they just drew.
function applySwap({ kind, pl, card }, takeNew) {
  const name = c => `<b>${esc(c.text)}</b> (${kind === 'Asset' ? '✔️' : '✖️'}${c.approaches.join('')})`;
  const zone = kind === 'Asset' ? pl.zones.boon : pl.zones.bane;
  const deck = kind === 'Asset' ? TABLE.boonDeck : TABLE.bane.deck;
  const old = zone.occupant;
  if (!takeNew) {
    deck.push(card);
    pulse(old);
    return { title: `You keep your ${kind}`, html: `<p>${who(pl)} keeps ${name(old.card)}; ${name(card)} goes back in the deck.</p>` };
  }
  if (kind === 'Liability') returnBane(old);
  else { leaveZone(old); [...old.children].forEach(removePiece); removePiece(old); deck.push(old.card); }
  if (kind === 'Asset') placeBoon(pl, card);
  else {
    const piece = placePcCard(card, zone.x, zone.y - 60, false);
    snapTo(piece, zone);
    raise(piece);
  }
  return { title: `You take the new ${kind}`, html: `<p>${who(pl)} takes ${name(card)}, and ${name(old.card)} goes back in the deck.</p>` };
}

function resolveRow(row, fate, difficulty, target, board) {
  const main = row.main;
  const parts = rowParts(row, fate, board);
  const before = total(parts) - difficulty;
  // Edge after seeing the card, at most SIM_RULES.maxEdgePerBet per roll: the human player's
  // plan (row.plan), or the bots' (helpers chip in with SIM_RULES.helperEdge; the Main pays first).
  const payers = [main, ...(SIM_RULES.helperEdge ? row.helpers : [])];
  const plan = row.plan && row.plan.spend ? row.plan.spend : botEdgePlan(row, before, payers, edgeCap());
  let spent = 0;
  const paid = [];
  for (const [p, n] of plan) {
    let k = 0;
    while (k < n && spent < edgeCap() && spendEdge(p)) { k++; spent++; }
    if (k) paid.push([p, k]);
  }
  if (spent) parts.push([`Story Points ×${spent}`, spent]);

  // Succeed at a cost (SIM_RULES.pushResource): lower the row's resource die, +1 per point.
  let pushNote = '';
  const missBy = total(parts) - difficulty;
  // The human player chose how much (row.plan.push); a bot spends just enough to succeed.
  const pushN = main.human ? (row.plan && row.plan.push) || 0 : pushPoints(row, missBy) && botWantsPush(row, missBy, board) ? pushPoints(row, missBy) : 0;
  if (pushN) {
    const have = main.res[row.risk];
    setResource(main, row.risk, have - pushN);
    parts.push([`At a cost: ${row.risk} ${riskName(row.risk)}`, pushN]);
    pushNote = `<p>${who(main)} pays a cost: their ${row.risk} ${riskName(row.risk)} goes from ${have} to ${have - pushN} for +${pushN}${have - pushN === 0 ? ' (used up: the die leaves their sheet)' : ''}.</p>`;
  }

  // Now the roll is settled, the Edge waiting on the Trouble / Liability card goes to its owner.
  let troubleNote = '';
  if (row.troubleEdge && row.troubleEdge.length) {
    const n = row.troubleEdge.length;
    const kept = row.troubleEdge.filter(t => giveEdge(main, t)).length;
    row.troubleEdge = [];
    troubleNote = `<p>The roll is over, so the ${storyPts(n)} waiting on ${who(main)}’s card${n > 1 ? 's go' : ' goes'} into their bank${kept < n ? `; ${n - kept} back to the pile (Story Points limit ${SIM_RULES.maxEdgeHeld})` : ''}.</p>`;
  }

  const effort = total(parts);
  const margin = effort - difficulty;
  const sum = `${parts.map(([l, v]) => `${esc(l)} ${signed(v)}`).join(' · ')} = <b>${effort}</b> vs difficulty ${difficulty}`;
  const attempt = `<p>${who(main)} tries to <i>${row.action}</i>${row.helpers.length ? `, with help from ${row.helpers.map(who).join(' and ')}` : ''}.</p>`
    + (spent ? `<p>Seeing the card, ${paid.map(([p, k], i) => `${who(p)} ${i ? 'adds' : 'spends'} ${k} banked Story Point${k === 1 ? '' : 's'}`).join(' and ')} (+${spent}).</p>` : '') + pushNote + troubleNote;
  const team = [main, ...row.helpers];

  // The stake: doubled into Scored spotlight on a success, lost on a failure, else returned.
  const stake = row.stake || [];
  let stakeNote = '';
  if (stake.length) {
    const paysOff = margin > 0 && (!SIM_RULES.stakeNeedsMargin || margin >= stake.length);
    if (paysOff) {
      let extra = 0;
      stake.forEach(t => bankToken(main, t));
      for (let i = 0; i < stake.length * SIM_RULES.stakePayout; i++) {
        const t = spotSupply(main).pop();
        if (t) { bankToken(main, t); extra++; }
      }
      main.roundGain = (main.roundGain || 0) + extra;
      stakeNote = `<p>The stake pays off: ${who(main)} banks ${stake.length + extra} spotlight straight into their Scored row.</p>`;
    } else if (SIM_RULES.stakeLostOn === 'miss' || margin <= -SIM_RULES.failBy) {
      stake.forEach(loseToken);
      stakeNote = `<p>${who(main)} loses their stake of ${stake.length} for good.</p>`;
    } else {
      stake.forEach(t => {
        if (row.stakeFromScored) bankToken(main, t);
        else if (SIM_RULES.takeSpotlight) returnToPool(t);
        else { glide(t, t.home.x, t.home.y); main.supply.push(t); }
      });
      stakeNote = `<p>The stake of ${stake.length} goes back to ${who(main)}.</p>`;
    }
    row.stake = [];
  }

  if (margin > 0) {
    // At most SIM_RULES.maxTokensPerRoll tokens per success, and (overflowAtRowLimit) no more
    // than the row still needs to win; any margin above that becomes Edge.
    const room = Math.max(0, target - row.tokens.length);
    const cap = Math.min(SIM_RULES.maxTokensPerRoll || Infinity, SIM_RULES.overflowAtRowLimit ? room : Infinity);
    let placed = 0;
    for (let i = 0; i < Math.min(margin, cap); i++) placed += placeToken(main, row) ? 1 : 0;
    let overflow = 0;
    if (margin > cap && SIM_RULES.overflowToEdge) for (let i = cap; i < margin; i++) overflow += gainEdge(main) ? 1 : 0;
    const boonNote = (SIM_RULES.boonsEarned || SIM_RULES.boonUpgrades) && margin >= SIM_RULES.boonMargin ? giveBoon(main, board.rows || []) : '';
    const helped = row.helpers.map(h => {
      let n = 0;
      let e = 0;
      for (let i = 0; i < SIM_RULES.helperShare; i++) {
        if (SIM_RULES.overflowAtRowLimit && row.tokens.length >= target) e += gainEdge(h) ? 1 : 0; // row full: Edge instead
        else n += placeToken(h, row, true) ? 1 : 0;
      }
      return [n ? `${who(h)} ${SIM_RULES.takeSpotlight ? 'takes' : 'adds'} ${n}` : '', e ? `${who(h)} takes ${storyPts(e)} (the row is full)` : ''].filter(Boolean).join(' and ');
    }).filter(Boolean);
    // A narrow success (SIM_RULES.narrowCost) still costs the row's resource, as a failure would.
    let narrowNote = '';
    if (SIM_RULES.narrowCost && margin < (SIM_RULES.narrowMargin || 2)) {
      const cost = riskCost(row.risk, row.approach);
      if (cost) {
        team.forEach(pl => setResource(pl, row.risk, pl.res[row.risk] - cost));
        narrowNote = `<p>Only just: ${team.map(who).join(' and ')} ${team.length > 1 ? 'each lose' : 'loses'} ${cost} ${row.risk} ${riskName(row.risk)}.</p>`
          + team.filter(pl => pl.out && pl.out.skip).map(pl => `<p>${who(pl)} is out of ${riskName(row.risk)}: they’ll lose their next turn.</p>`).join('');
      } else narrowNote = `<p>Only just, but going in ${row.approach} guarded their ${riskName(row.risk)}.</p>`;
    }
    return {
      title: `${rowLabel(row)}: success`,
      html: `${attempt}<p>${sum}. <b>Beats it by ${margin}.</b></p>
        <p>${who(main)} ${SIM_RULES.takeSpotlight ? 'takes' : 'places'} ${placed} spotlight token${placed === 1 ? '' : 's'}${SIM_RULES.takeSpotlight ? ' from the row’s stack' : ''}${overflow ? ` (${SIM_RULES.overflowAtRowLimit && placed >= room ? 'all the row can take' : 'the most for one roll'}) and takes the ${overflow} left over as Story Points` : ''}${helped.length ? `; ${helped.join(', ')}` : ''}. That row is at ${row.tokens.length}/${target}.</p>${narrowNote}${boonNote}${stakeNote}`,
    };
  }

  if (margin <= -SIM_RULES.failBy && board.over) {
    return {
      title: `${rowLabel(row)}: a miss (the danger has passed)`,
      html: `${attempt}<p>${sum}. Misses by ${-margin}, but the situation is already won: the danger has passed, so it costs nothing.</p>${stakeNote}`,
    };
  }

  if (margin <= -SIM_RULES.failBy) {
    // Asset shield: discard the Asset to keep the resource and skip the Liability. Bots burn it when the
    // failure would knock them out, or when the Asset fits none of this situation's rows.
    // 'heal' version: you still lose the resource, but draw no Liability and discard the one you carry.
    // Bots heal when their Liability hurts this situation, or block when the Asset fits none of its rows.
    const boonPiece = main.zones.boon.occupant;
    const healMode = SIM_RULES.boonShield === 'heal';
    const carried = main.zones.bane && main.zones.bane.occupant;
    const boonFits = boonPiece && (board.rows || []).some(r => has(boonPiece.card.approaches, r.approach));
    const shield = main.human ? !!(SIM_RULES.boonShield && boonPiece && row.plan && row.plan.burn) : !!(SIM_RULES.boonShield && boonPiece && (healMode
      ? (carried ? baneBite(carried, board.rows || []) >= 1 : !boonFits)
      : (main.res[row.risk] <= 1 || !boonFits)));
    let shieldText = '';
    if (shield && SIM_RULES.stackCards) {
      // Several Assets: burn one (an extra one first) to avoid the new Liability; nothing else.
      const card = main.moreBoons.length ? main.moreBoons.pop() : null;
      if (!card) { leaveZone(boonPiece); [...boonPiece.children].forEach(removePiece); removePiece(boonPiece); }
      if (TABLE.boonDeck) TABLE.boonDeck.push(card || boonPiece.card);
      updateSceneBoard();
      renderStacks(main);
      shieldText = `${who(main)} discards their Asset, <b>${esc((card || boonPiece.card).text)}</b>, to shrug it off: no new Liability. `;
    } else if (shield) {
      leaveZone(boonPiece);
      [...boonPiece.children].forEach(removePiece);
      removePiece(boonPiece);
      if (TABLE.boonDeck) TABLE.boonDeck.push(boonPiece.card);
      updateSceneBoard(); // the Scene die may no longer favour them
      if (healMode && carried) returnBane(carried);
      shieldText = healMode
        ? `${who(main)} discards their Asset, <b>${esc(boonPiece.card.text)}</b>, to shrug it off: no new Liability${carried ? `, and they shake off ${baneName(carried)}` : ''}. `
        : `${who(main)} discards their Asset, <b>${esc(boonPiece.card.text)}</b>, to shrug it off: they keep their ${row.risk} and draw no Liability. `;
    }
    // Pick your loss (failPickLoss): the Main player loses the resource OR takes a Liability. Bots
    // keep a resource that would drop to 0 and take the Liability; otherwise they lose the resource.
    const banesOn = SIM_RULES.banes && TABLE.bane && TABLE.bane.deck.length;
    // With failPickLossNoBane, the choice is only open to someone who doesn't already have a Liability.
    const mayPick = !SIM_RULES.failPickLossNoBane || !(main.zones.bane && main.zones.bane.occupant);
    const picksBane = main.human && row.plan && 'pickBane' in row.plan ? row.plan.pickBane : main.res[row.risk] <= 1;
    const mainTakesBane = !shield && (SIM_RULES.failLiabilityOnly || !SIM_RULES.failPickLoss || (banesOn && mayPick && picksBane));
    const losers = SIM_RULES.failLiabilityOnly ? [] : (shield && !healMode) || (SIM_RULES.failPickLoss && mainTakesBane && banesOn) ? row.helpers : team;
    const cost = riskCost(row.risk, row.approach);
    if (cost) losers.forEach(pl => setResource(pl, row.risk, pl.res[row.risk] - cost));
    // Edge for failing: the Main player takes failEdgeMain, plus failEdgePerMinus for each Minus
    // die already out (desperation); helpers take 1.
    const mainEdge = (SIM_RULES.failEdgeMain ?? 1) + (playerRule('failEdgePerMinus') || 0) * board.minus.length;
    let got = 0;
    for (let i = 0; i < mainEdge; i++) got += gainEdge(main) ? 1 : 0;
    const helpersEdged = SIM_RULES.failEdgeHelpers === false ? [] : row.helpers.filter(gainEdge);
    const baneNote = SIM_RULES.banes && mainTakesBane ? giveBane(main, board.rows || []) : ''; // only the Main player
    const guarded = SIM_RULES.freeApproach && !cost ? `Going in ${row.approach} guarded their ${riskName(row.risk)}: nobody loses any. ` : '';
    const lossText = shieldText + (guarded || (losers.length ? `${losers.map(who).join(' and ')} ${losers.length > 1 ? 'each lose' : 'loses'} ${cost} ${row.risk} ${riskName(row.risk)}${cost > 1 ? ` (${row.approach} squanders it)` : ''}. ` : shield ? '' : `${who(main)} keeps their ${row.risk} and takes a Liability instead. `));
    const edgeText = [got ? `${who(main)} takes ${storyPts(got)}${board.minus.length && playerRule('failEdgePerMinus') ? ' (desperation: the Minus box is filling up)' : ''}` : '', ...helpersEdged.map(h => `${who(h)} takes 1 Story Point`)].filter(Boolean).join(', ');
    return {
      failed: true,
      title: `${rowLabel(row)}: failure`,
      html: `${attempt}<p>${sum}. <b>Misses by ${-margin}: a failure.</b></p>
        <p>${lossText}${edgeText}${edgeText ? '.' : ''}</p>
        ${team.filter(pl => pl.out && pl.out.skip).map(pl => `<p>${who(pl)} is out of ${riskName(row.risk)}: they’ll lose their next turn.</p>`).join('')}${baneNote}${stakeNote}`,
    };
  }

  // A near miss (SIM_RULES.closeMissBane, test): missing by less than failBy still leaves a
  // mark on the Main player, a Liability, though it's no failure (no escalation, nothing lost).
  const closeBane = SIM_RULES.closeMissBane && SIM_RULES.banes && margin < 0 && !board.over ? giveBane(main, board.rows || []) : '';
  // A minor failure (SIM_RULES.minorFailure, test): missing by less than failBy costs the row's
  // resource (by the approach) and draws the Main player a Liability, but adds no Tension die and
  // gives no Edge. Only a full failure (miss by failBy+) escalates the situation.
  if (SIM_RULES.minorFailure && margin < 0 && !board.over) {
    const cost = riskCost(row.risk, row.approach);
    if (cost) team.forEach(pl => setResource(pl, row.risk, pl.res[row.risk] - cost));
    const lossText = cost ? `${team.map(who).join(' and ')} ${team.length > 1 ? 'each lose' : 'loses'} ${cost} ${row.risk} ${riskName(row.risk)}.` : `Going in ${row.approach} guarded their ${riskName(row.risk)}.`;
    const baneNote = SIM_RULES.banes && SIM_RULES.minorFailureBane ? giveBane(main, board.rows || []) : '';
    return {
      title: `${rowLabel(row)}: minor failure`,
      html: `${attempt}<p>${sum}. <b>Misses by ${-margin}: a minor failure.</b> No progress, and no escalation, but it leaves a mark.</p>
        <p>${lossText}</p>${team.filter(pl => pl.out && pl.out.skip).map(pl => `<p>${who(pl)} is out of ${riskName(row.risk)}: they’ll lose their next turn.</p>`).join('')}${baneNote}${stakeNote}`,
    };
  }
  return {
    title: `${rowLabel(row)}: close`,
    html: `${attempt}<p>${sum}. ${margin === 0 ? 'Ties the difficulty' : `Misses by ${-margin}`}: no progress${closeBane ? '' : ', but nothing lost'}.</p>${closeBane}${stakeNote}`,
  };
}

// ---------------------------------------------------------------------------
// ➖ Troubles: invoke or compel
// ---------------------------------------------------------------------------

const EDGE_WORTH = 0.7; // bots: one Edge in hand, valued in spotlight

// Success at a cost: how many points of the row's resource the Main player may push (+1 each)
// on a roll that would miss, never taking the die below 1 (0 = no push). With pushToSucceed,
// exactly the points that turn the roll into a success (a tie needs 1, a miss by 1 needs 2), or
// none if that's more than they can spare; otherwise 1 point.
// The most a Main player could spend on succeeding at a cost: down to 0 (pushToZero), else to 1.
const pushMax = row => (SIM_RULES.pushResource ? Math.min(SIM_RULES.maxPushPerRoll || Infinity, Math.max(0, row.main.res[row.risk] - (SIM_RULES.pushToZero ? 0 : 1))) : 0);
function pushPoints(row, margin) {
  if (!SIM_RULES.pushResource || margin >= 1) return 0;
  const spare = pushMax(row);
  const need = SIM_RULES.pushToSucceed ? 1 - margin : 1;
  return need <= spare ? need : 0;
}
// Bots push to succeed whenever they can (only a point when the danger has passed); with the
// old 1-point push, when it changes the outcome enough.
function botWantsPush(row, margin, board) {
  if (SIM_RULES.pushToSucceed) return !board.over || pushPoints(row, margin) === 1;
  if (board.over) return margin === 0; // the danger has passed: only for the spotlight
  if (margin === 0 || margin <= -SIM_RULES.failBy) return true;
  return riskCost(row.risk, row.approach) >= 2;
}

// A bot's guess at what a Main player's roll is worth, averaged over the Fate card (-2..+2),
// with `delta` added to the roll and `edge` Edge in hand to spend the way resolveRow does.
function rollValue(row, delta, edge, board, difficulty, target) {
  const parts = [...bonusParts(row.main, row.approach, row), ...riskPart(row, row.approach)];
  const base = total(parts) + row.helpers.length - minusFor(board, row.approach) - obstacleFor(board, row, row.approach, row.main) + (row.invoke ? 1 : 0) - (row.hits || []).length + delta - difficulty;
  const can = Math.min(edge, edgeCap());
  const stake = (row.stake || []).length;
  let sum = 0;
  for (let fate = -2; fate <= 2; fate++) {
    let m = base + fate;
    const spend = m < 1 && 1 - m <= can ? 1 - m : m <= -SIM_RULES.failBy && -SIM_RULES.failBy + 1 - m <= can ? -SIM_RULES.failBy + 1 - m : 0;
    m += spend;
    let v = m > 0 ? m + stake * SIM_RULES.stakePayout + (row.tokens.length + m >= target ? 3 : 0)
      : m <= -SIM_RULES.failBy ? -3 - stake : -stake;
    sum += v - spend * EDGE_WORTH;
  }
  return sum / 5;
}

// Would this player pay Edge to compel the Main player on `row`? Only a rival who is ahead of
// them (or about to finish the situation), who isn't on that row, and who won't lose their own
// tokens if it fails and that loses the situation.
function wantsCompel(pl, row, rows, board, harm, target, free = false) {
  if (pl === row.main || row.helpers.includes(pl) || (!free && pl.edge.length < SIM_RULES.troubleEdge)) return false;
  const onBoard = p => rows.reduce((n, r) => n + r.tokens.filter(t => t.player === p.letter).length, 0);
  const finishing = row.tokens.length + 2 >= target;
  const threat = finishing || row.main.score + onBoard(row.main) >= pl.score + onBoard(pl);
  const risky = board.minus.length >= SIM_RULES.maxEscalations && onBoard(pl) > 0;
  // A paid compel costs them 1 Edge and hands the target 1; a free one (a Liability) only hands it over.
  return threat && !risky && harm >= (free ? 1 : 2) * SIM_RULES.troubleEdge * EDGE_WORTH;
}

// After the bets, before the Fate card: each Main player whose row shows an approach on their
// ➖ Trouble or ✖️ Liability may invoke that card (-1, Edge from the pile). If they don't, another
// player may compel it: for a Trouble the compeller pays the Edge, for a Liability it's free (the
// pile pays). The Main player can refuse by paying 1 Edge to the pile (a refused Trouble compel
// also sends the compeller's Edge there). The Edge waits on the card until the roll is over.
// Each card counts once per roll, so a roll can take both.
function* troublePhase(rows, order, board, difficulty, target) {
  if (!SIM_RULES.troubleInvoke) return;
  for (const pl of order) {
    const row = rows.find(r => r.main === pl);
    if (!row) continue;
    const cards = [{ kind: 'Trouble', sign: '➖', piece: pl.zones.trouble.occupant }];
    banesOf(pl).forEach(piece => cards.push({ kind: 'Liability', sign: '✖️', piece }));
    for (const c of cards) {
      // A match: the roll's approach is on the card, or (compelRiskMatch) the row risks the
      // resource shown on the card (Troubles show one).
      const byRisk = SIM_RULES.compelRiskMatch && c.piece.card.resource && same(c.piece.card.resource, row.risk);
      if (has(c.piece.card.approaches, row.approach) || byRisk) yield* invokeOrCompel(pl, row, c, order, rows, board, difficulty, target);
    }
  }
}

function* invokeOrCompel(pl, row, { kind, sign, piece }, order, rows, board, difficulty, target) {
  const bane = kind === 'Liability';
  const scene = !bane && !!(TABLE.scene && has(piece.card.approaches, TABLE.scene.approach));
  const extra = scene ? SIM_RULES.sceneTroubleEdge : 0;
  const reward = SIM_RULES.troubleEdge + extra;
  const worth = Math.min(reward, edgeRoom(pl) + 1) * EDGE_WORTH; // past the Edge limit it's wasted (+1: they'll often spend one)
  const fromPile = n => { let got = 0; for (let i = 0; i < n; i++) { const t = TABLE.edge.supply.pop(); if (t) { parkEdge(row, t, piece); got++; } } return got; };
  const sceneNote = scene ? ` The Edge die shows ${TABLE.scene.approach} too: ${extra} more Story Point${extra === 1 ? '' : 's'} from the pile.` : '';
  const viaRisk = !has(piece.card.approaches, row.approach); // it matched on the row's risk instead
  const what = `${kind} “${esc(piece.card.text.replace(/\.\.\.|…/g, '').trim())}” (${viaRisk ? `${row.risk}, the row’s risk` : `${sign}${row.approach}`})`;
  const now = rollValue(row, 0, pl.edge.length, board, difficulty, target);
  const hit = rollValue(row, -1, pl.edge.length, board, difficulty, target);
  pulse(piece);

  // With compelOnly a card can't be invoked by its owner: only the others bring it up.
  const free = bane || SIM_RULES.compelOnly; // the pile pays the Edge, not the compeller
  const invoke = SIM_RULES.compelOnly ? false : pl.human
    ? yield ask(`Invoke your ${kind}?`,
      `<p>${rowTag(row)} matches your ${what}. Invoke it: <b>−1</b> on this roll, and ${storyPts(reward)} from the pile (yours once the roll is over). If you don\u2019t, the others may compel it${bane ? ' (for free)' : ''}.</p>`,
      [{ label: 'Invoke it', hint: `−1 now, +${storyPts(reward)} after the roll`, value: true }, { label: 'Not now', hint: 'keep your roll clean', value: false }])
    : hit + worth >= now;
  if (invoke) {
    row.hits.push(`${sign} ${kind} (invoked)`);
    const got = fromPile(reward);
    yield {
      title: `${pl.letter} invokes their ${kind}`,
      html: `<p>${who(pl)} brings their ${what} into it: <b>−1</b> on this roll.</p>
        <p>${storyPts(got)} from the pile ${got === 1 ? 'goes' : 'go'} on the card, theirs once the roll is over.${sceneNote}</p>`,
    };
    return;
  }

  // A refused compel costs the Main player 1 Edge (and a Trouble's compeller 1 too), so bots
  // only compel when they expect it to stick.
  let refuses = !pl.human && pl.edge.length > 0 && rollValue(row, 0, pl.edge.length - 1, board, difficulty, target) > hit + worth;
  // In initiative order (the Storyteller first, with compelOnly), the human player is asked;
  // bots compel when it's worth it. The Storyteller compels once a round whenever it hurts the roll.
  let by = null;
  const story = SIM_RULES.compelOnly && TABLE.storyteller && !board.storyCompel ? TABLE.storyteller : null;
  // With compelByStoryteller only the Storyteller may compel (once a round, so `story` is null after).
  const storyOnly = SIM_RULES.compelByStoryteller && SIM_RULES.obstacle;
  const askers = storyOnly ? (story ? [story] : []) : story ? [story, ...order.filter(p => p !== story)] : order;
  for (const p of askers) {
    if (p === pl || row.helpers.includes(p) || (!free && p.edge.length < SIM_RULES.troubleEdge)) continue;
    const asStory = p === story;
    if (p.human) {
      const yes = yield ask(`Compel ${pl.letter}\u2019s ${kind}?`,
        `<p>${asStory ? 'You’re the Storyteller: watching for this is part of your job. ' : ''}${who(pl)} bets on ${rowTag(row)}, which matches their ${what}. Compel it, and say how it gets in the way: they take <b>−1</b> on this roll${free ? '; it costs you nothing (the pile pays them 1 Story Point)' : ', and you pay them 1 of your Story Points'}. They may refuse by paying 1 Story Point to the pile${free ? '' : ' (and then your Story Points goes to the pile too)'}.</p>`,
        [{ label: 'Compel', hint: free ? 'free' : 'costs you 1 Story Point', value: true }, { label: 'Leave it', value: false }]);
      if (yes) { by = p; break; }
    } else if ((asStory ? SIM_RULES.storytellerAlwaysCompels || now - hit > 0 : wantsCompel(p, row, rows, board, now - hit, target, free)) && (!refuses || SIM_RULES.compelIntoRefusal)) { by = p; break; }
  }
  if (by && by === story) board.storyCompel = true;
  if (!by) return;
  if (pl.human && pl.edge.length > 0) {
    refuses = yield ask(`${by.letter} compels your ${kind}`,
      `<p>${who(by)} compels your ${what}: <b>−1</b> on this roll, and you take the Story Points once the roll is over. Or refuse, by paying 1 Story Point to the pile.</p>`,
      [{ label: 'Accept', hint: '−1 now, +Story Points after the roll', value: false }, { label: 'Refuse', hint: 'pay 1 Story Point to the pile', value: true }]);
  }
  if (refuses) {
    if (!free) spendEdge(by);
    spendEdge(pl);
    yield {
      title: `${pl.letter} refuses a compel`,
      html: `<p>${who(by)} tries to compel ${who(pl)}’s ${what}.</p>
        <p>${who(pl)} refuses, and pays 1 Story Point to the pile to keep their roll clean.${free ? '' : ` ${who(by)}’s Story Point goes to the pile too.`}</p>`,
    };
    return;
  }
  row.hits.push(`${sign} ${kind} (compelled)`);
  let paid;
  if (free) paid = `The ${storyPts(fromPile(reward))} comes from the pile: compelling is free.`;
  else {
    for (let i = 0; i < SIM_RULES.troubleEdge; i++) parkEdge(row, by.edge.pop(), piece);
    const got = fromPile(extra);
    paid = `${who(by)} pays ${SIM_RULES.troubleEdge} of their own Story Points onto the card.${scene ? ` The Edge die shows ${TABLE.scene.approach} too: ${got} more Story Points from the pile.` : ''}`;
  }
  yield {
    title: `${by.letter} compels ${pl.letter}`,
    html: `<p>${who(by)}${by === story ? ', the Storyteller,' : ''} compels ${who(pl)}’s ${what}, and says how it gets in the way. ${paid}</p>
      <p>${who(pl)} accepts: <b>−1</b> on this roll, and the Story Points are theirs once the roll is over.</p>`,
  };
}

// ---------------------------------------------------------------------------
// ✖️ Liabilities
// ---------------------------------------------------------------------------

const baneName = piece => `<b>${esc(piece.card.text)}</b> (✖️${piece.card.approaches.join('')})`;
const baneBite = (piece, rows) => rows.filter(r => has(piece.card.approaches, r.approach)).length;

// Back into the (off-table) Liability deck: the card leaves the table.
function returnBane(piece) {
  leaveZone(piece);
  removePiece(piece);
  TABLE.bane.deck.push(piece.card);
}

// A Main player who fails draws a Liability at random (and explains how it happened). Only one at a
// time: with one already, they keep whichever they prefer (bots: the one fewer of this
// situation's rows use) and the other goes back in the deck.
function giveBane(pl, rows) {
  const deck = TABLE.bane && TABLE.bane.deck;
  if (!deck || !deck.length || !pl.zones.bane) return '';
  const card = deck.splice(randInt(deck.length), 1)[0];
  const name = baneName({ card });
  const old = pl.zones.bane.occupant;
  if (old && SIM_RULES.stackCards && SIM_RULES.stackMax && banesOf(pl).length >= SIM_RULES.stackMax) {
    // At the limit: keep the less harmful of the new one and the extra one held (bots).
    const i = pl.moreBanes.length - 1, held = pl.moreBanes[i];
    if (baneBite({ card }, rows) < baneBite({ card: held }, rows)) { pl.moreBanes[i] = card; deck.push(held); renderStacks(pl); pulse(old); return `<p>${who(pl)} draws the Liability ${name} and lets go of ${baneName({ card: held })} (at most ${SIM_RULES.stackMax}). How did that happen?</p>`; }
    deck.push(card); pulse(old);
    return `<p>${who(pl)} draws the Liability ${name}, but keeps the ones they have (at most ${SIM_RULES.stackMax}): it goes back in the deck.</p>`;
  }
  if (old && SIM_RULES.stackCards) {
    pl.moreBanes.push(card);
    renderStacks(pl);
    pulse(old);
    return `<p>${who(pl)} draws the Liability ${name}: they now carry ${banesOf(pl).length}. How did that happen?</p>`;
  }
  if (old && pl.human) { // the human player chooses: see applySwap
    TABLE.pendingSwap = { kind: 'Liability', pl, card };
    return `<p>${who(pl)} draws the Liability ${name}. How did that happen? Keep it, or the one you have, ${baneName(old)}?</p>`;
  }
  if (old && baneBite(old, rows) <= baneBite({ card }, rows)) {
    deck.push(card);
    pulse(old);
    return `<p>${who(pl)} draws the Liability ${name}, but keeps the one they have, ${baneName(old)}. The new one goes back in the deck.</p>`;
  }
  if (old) returnBane(old);
  const zone = pl.zones.bane;
  const piece = placePcCard(card, zone.x, zone.y - 60, false);
  snapTo(piece, zone); // slides in and turns face up
  raise(piece);
  return `<p>${who(pl)} draws the Liability ${name}${old ? `, replacing ${baneName(old)}` : ''}. How did that happen?</p>`;
}

// ---------------------------------------------------------------------------
// ✔️ Earned Assets (SIM_RULES.boonsEarned)
// ---------------------------------------------------------------------------

// A Main player who succeeds by SIM_RULES.boonMargin or more draws an Asset at random. With one
// already, they keep whichever they prefer (bots: the one more of this situation's rows use).
function giveBoon(pl, rows) {
  const deck = TABLE.boonDeck;
  if (!deck || !deck.length) return '';
  const card = deck.splice(randInt(deck.length), 1)[0];
  const fit = c => rows.filter(r => has(c.approaches, r.approach)).length;
  const name = c => `<b>${esc(c.text)}</b> (✔️${c.approaches.join('')})`;
  const zone = pl.zones.boon, old = zone.occupant;
  if (old && SIM_RULES.stackCards && SIM_RULES.stackMax && boonsOf(pl).length >= SIM_RULES.stackMax) {
    // At the limit: keep the better of the new one and the extra one held (bots).
    const i = pl.moreBoons.length - 1, held = pl.moreBoons[i];
    if (fit(card) > fit(held)) { pl.moreBoons[i] = card; deck.push(held); renderStacks(pl); pulse(old); return `<p>${who(pl)} earns the Asset ${name(card)}, swapping out ${name(held)} (at most ${SIM_RULES.stackMax}).</p>`; }
    deck.push(card); pulse(old);
    return `<p>${who(pl)} draws the Asset ${name(card)}, but keeps the ones they have (at most ${SIM_RULES.stackMax}).</p>`;
  }
  if (old && SIM_RULES.stackCards) {
    pl.moreBoons.push(card);
    renderStacks(pl);
    pulse(old);
    return `<p>${who(pl)} earns the Asset ${name(card)}: they now hold ${boonsOf(pl).length}.</p>`;
  }
  if (old && pl.human) { // the human player chooses: see applySwap
    TABLE.pendingSwap = { kind: 'Asset', pl, card };
    return `<p>${who(pl)} draws the Asset ${name(card)}: keep it, or the one you have, ${name(old.card)}?</p>`;
  }
  if (old && fit(old.card) >= fit(card)) {
    deck.push(card);
    pulse(old);
    return `<p>${who(pl)} draws the Asset ${name(card)}, but keeps the one they have, ${name(old.card)}.</p>`;
  }
  if (old) {
    leaveZone(old);
    [...old.children].forEach(removePiece);
    removePiece(old);
    deck.push(old.card);
  }
  placeBoon(pl, card);
  return `<p>${who(pl)} earns the Asset ${name(card)}${old ? `, swapping out ${name(old.card)}` : ''}.</p>`;
}

// An Asset drawn mid-game slides into the slot.
function placeBoon(pl, card) {
  const zone = pl.zones.boon;
  const piece = placePcCard(card, zone.x, zone.y - 60, false);
  snapTo(piece, zone); // slides in and turns face up
  raise(piece);
  updateSceneBoard(); // the Scene die may favour them now
  return piece;
}

// The next Escalation: read it out and put its Minus die in the shared Minus box.
// `pick`: the Escalation the failing player chose (escalationChoice); otherwise in order, and
// after a cleared die a later escalation repeats the card's last one.
function escalate(situation, n, board, pick = null) {
  const i = pick ?? Math.min(n, situation.escalations.length) - 1;
  const text = situation.escalations[i] || '';
  const m = noVS(text).match(/➖\s*(\S+)\s*$/);
  const idx = Math.max(0, APPROACHES.findIndex(a => same(a, m ? m[1] : '')));
  const spot = TABLE.minusAt(board.minus.length, DIE_SIZE);
  const die = createDie({ className: 'die-minus', faces: APPROACHES, value: idx + 1, size: DIE_SIZE, x: spot.x, y: spot.y });
  die.fresh = !!SIM_RULES.minusNextRound;
  die.el.classList.toggle('fresh', die.fresh);
  pulse(die);
  board.minus.push(die);
  return `<p class="sim-quote"><b>Escalation${pick !== null ? ` (${who(board.chooser)}’s choice)` : ` ${n}`}:</b> ${narrationFor(text)}</p>
    <p>A ➖${APPROACHES[idx]} die goes in the Minus box: <b>−1 to every roll using ${APPROACHES[idx]}</b>, on any row${die.fresh ? ', from the next round on' : ''}.</p>`;
}

// The failing Main player picks the Escalation (SIM_RULES.escalationChoice): you, with buttons;
// a bot, the one whose Tension die hits the most of the others' Concept / Asset approaches and the
// fewest of its own. Returns the Escalation's index, or null (they happen in order).
const escalationApproach = text => { const m = noVS(text || '').match(/➖\s*(\S+)\s*$/); return m ? m[1] : ''; };
function* chooseEscalation(main, situation, board) {
  if (!SIM_RULES.escalationChoice) return null;
  board.chooser = main;
  const options = situation.escalations.map((text, i) => ({ i, text, approach: escalationApproach(text) })).filter(o => o.text);
  if (main.human) {
    return yield ask('Which Escalation?', `<p>You failed, so you choose how things get worse. Its Tension die is <b>−1 to every roll using its approach</b>${SIM_RULES.minusNextRound ? ', from the next round on' : ''}. You can pick the same one again.</p>`,
      options.map(o => ({ label: narrationFor(o.text.replace(/\s*➖\s*\S+\s*$/, '')), hint: `Tension die ➖${o.approach}${board.minus.some(d => same(d.faces[d.value - 1], o.approach)) ? ' (another one: it gets really bad)' : ''}`, value: o.i })));
  }
  const fits = (pl, a) => has(pl.info.concept.approaches, a) || (boonOf(pl) && has(boonOf(pl).approaches, a));
  const harm = o => TABLE.players.reduce((n, pl) => n + (fits(pl, o.approach) ? (pl === main ? -2 : 1) : 0), 0) + Math.random() * 0.1;
  return options.reduce((a, b) => (harm(b) > harm(a) ? b : a)).i;
}

function scoreBoard(rows) {
  const gained = new Map();
  rows.forEach(row => row.tokens.forEach(token => {
    const pl = TABLE.players.find(p => p.letter === token.player);
    bankToken(pl, token);
    gained.set(pl, (gained.get(pl) || 0) + 1);
  }));
  rows.forEach(row => { row.tokens = []; });
  if (SIM_RULES.takeSpotlight) clearSuccessStacks(); // what's left on the rows goes back to the pool
  return [...gained].map(([pl, n]) => `${who(pl)} +${n}`).join(' · ') || 'nothing';
}

// A lost situation: tokens on the board go back to their owners unscored, except helpers'
// safe tokens, which score anyway. Returns how many went back, and the story of what scored.
function clearBoard(rows) {
  let n = 0;
  const saved = new Map();
  rows.forEach(row => row.tokens.forEach(token => {
    const pl = TABLE.players.find(p => p.letter === token.player);
    if (token.help) {
      bankToken(pl, token);
      saved.set(pl, (saved.get(pl) || 0) + 1);
      return;
    }
    if (SIM_RULES.takeSpotlight) { // This scene's tokens go back to the pool, unscored
      pl.scene.splice(pl.scene.indexOf(token), 1);
      returnToPool(token);
    } else {
      glide(token, token.home.x, token.home.y);
      pl.supply.push(token);
    }
    n++;
  }));
  rows.forEach(row => { row.tokens = []; });
  if (SIM_RULES.takeSpotlight) clearSuccessStacks();
  const safe = [...saved].map(([pl, k]) => `${who(pl)} ${k}`).join(', ');
  return { back: n, note: safe ? ` Helpers\u2019 tokens are safe and score anyway: ${safe}.` : '' };
}

// Kingdomino-style initiative: whoever placed the fewest spotlight tokens this round picks
// first next round. Ties go to whoever has less spotlight overall (scored plus on the
// board), then to whoever went earlier this round.
function reorderInitiative(rows) {
  const order = [...TABLE.players].sort((a, b) => a.initToken.initiative - b.initToken.initiative);
  const onBoard = pl => rows.reduce((n, r) => n + r.tokens.filter(t => t.player === pl.letter).length, 0);
  const overall = pl => pl.score + onBoard(pl);
  const standing = SIM_RULES.initiativeBy === 'standing';
  const next = [...order].sort((a, b) => standing
    ? overall(a) - overall(b) || a.edge.length - b.edge.length || order.indexOf(a) - order.indexOf(b)
    : (a.roundGain || 0) - (b.roundGain || 0) || overall(a) - overall(b) || order.indexOf(a) - order.indexOf(b));
  // Whoever cleared a Minus die this round bets first next round (SIM_RULES.clearGoesFirst).
  const first = TABLE.firstNext;
  TABLE.firstNext = null;
  if (first && next.includes(first)) { next.splice(next.indexOf(first), 1); next.unshift(first); }
  next.forEach((pl, i) => {
    setInitiative(pl.initToken, i + 1);
    pulse(pl.initToken);
  });
  const gains = standing
    ? order.map(pl => `${who(pl)} ${overall(pl)} (${storyPts(pl.edge.length)})`).join(' · ')
    : order.map(pl => `${who(pl)} ${pl.roundGain || 0}`).join(' · ');
  return `<p>${standing ? 'Spotlight on the table (Scored + on the Board)' : 'Spotlight placed this round'}: ${gains}.</p>
    ${first ? `<p>${who(first)} cleared a Minus die, so they bet first.</p>` : ''}<p>Lowest picks first, so the next order is: ${next.map((pl, i) => `<b>${i + 1}</b> ${who(pl)}`).join(', ')}.</p>`;
}

// Players who sat this round out flip their initiative token back over.
function flipBackOut() {
  TABLE.players.filter(pl => pl.out && !pl.out.skip).forEach(pl => setOut(pl.initToken, false));
}

function endRound(round, rows) {
  flipBackOut();
  const initiative = reorderInitiative(rows);
  returnPawns();
  return {
    title: `End of round ${round}`,
    html: `<p>Pawns go back to the Relationship board.</p>${initiative}`,
  };
}

function endSituation(rows, board) {
  flipBackOut();
  board.minus.forEach(removePiece);
  board.minus = [];
  // Liabilities clear at the end of an act (unless the rule says they stay until removed).
  const healed = SIM_RULES.baneClearAtActEnd === false ? [] : TABLE.players.filter(pl => pl.zones.bane && pl.zones.bane.occupant);
  healed.forEach(pl => returnBane(pl.zones.bane.occupant));
  const initiative = reorderInitiative(rows);
  returnPawns();
  return {
    title: 'Clearing the board',
    html: `<p>Minus dice are removed and pawns go home.${healed.length ? ` ${healed.map(who).join(', ')} shake${healed.length > 1 ? '' : 's'} off their Liability${healed.length > 1 ? 's' : ''}: back into the deck.` : ''} Spotlight so far: ${TABLE.players.map(pl => `${who(pl)} ${pl.score}`).join(' · ')}.</p>${initiative}`,
  };
}

// ---------------------------------------------------------------------------
// Panel
// ---------------------------------------------------------------------------

const simPanel = document.getElementById('sim-panel');
const simTitle = simPanel.querySelector('.sim-title');
const simText = simPanel.querySelector('.sim-text');
const simLog = simPanel.querySelector('.sim-log');
const simStepBtn = document.getElementById('sim-step');
const simChoices = el('div', 'sim-choices');
simText.after(simChoices);
const simAutoBtn = document.getElementById('sim-auto');

simPanel.querySelector('.sim-rules ol').innerHTML = RULES_TEXT.filter(Boolean).map(r => `<li>${r}</li>`).join('');

// ---- Read aloud: a 🔊 button on each boxed bit of story (the Situation, an Escalation) ----
// Uses the browser's speech; symbols (approach and risk icons, ➖ dice) are left out.
function addSpeakButtons(root) {
  root.querySelectorAll('.sim-quote').forEach(q => {
    if (q.querySelector('.sim-speak')) return;
    q.prepend(el('button', 'sim-speak', '🔊 Read aloud'));
  });
}
function speakableText(node) {
  const copy = node.cloneNode(true);
  copy.querySelectorAll('.sim-speak').forEach(b => b.remove());
  copy.querySelectorAll('br').forEach(b => b.replaceWith('\n'));
  return copy.textContent
    .replace(/[\p{Extended_Pictographic}➖️]/gu, '') // emoji and the ➖ of a Minus die
    .replace(/\(\s*\)/g, '')                                  // what's left of "(⌛)"
    .replace(/^\s*(?:[ABC]\)|–)\s*/gm, '')                    // no "A)" or dash: each choice is its own sentence
    .split('\n').map(line => line.replace(/\s+/g, ' ').trim()).filter(Boolean)
    .map(line => (/[.:!?]$/.test(line) ? line : `${line}.`)) // a pause at the end of each line
    .join(' ')
    .replace(/\s+([.,:!?’])/g, '$1');
}
let speaking = null;
function stopSpeaking() {
  if (window.speechSynthesis) speechSynthesis.cancel();
  if (speaking) speaking.textContent = '🔊 Read aloud';
  speaking = null;
}
simPanel.addEventListener('click', e => {
  const btn = e.target.closest('.sim-speak');
  if (!btn) return;
  if (!window.speechSynthesis) { btn.textContent = 'No speech in this browser'; return; }
  if (speaking === btn) { stopSpeaking(); return; }
  stopSpeaking();
  const say = new SpeechSynthesisUtterance(speakableText(btn.closest('.sim-quote')));
  const voice = speechSynthesis.getVoices().find(v => /^en/i.test(v.lang));
  if (voice) say.voice = voice;
  say.rate = 0.95;
  say.onend = say.onerror = () => { if (speaking === btn) stopSpeaking(); };
  speaking = btn;
  btn.textContent = '■ Stop';
  speechSynthesis.speak(say);
});

function startSim(fresh) {
  stopAuto();
  if (fresh || !tableReady() || TABLE.simUsed) {
    deal('deal');
    fitView();
  }
  sim = { gen: simGame(), steps: 0 };
  simLog.innerHTML = '';
  simTitle.textContent = 'Ready';
  simText.innerHTML = '<p>Press <b>Step</b> to play the game one move at a time. Each step explains who did what, and the pieces move on the table.</p>';
  simStepBtn.disabled = false;
  simChoices.innerHTML = '';
}

// `choice`: the human player's answer to the question on screen.
function simStep(choice) {
  if (!sim) startSim(false);
  if (sim.asking && choice === undefined) return; // waiting for you to choose
  const { value, done } = sim.gen.next(choice);
  if (done) {
    simStepBtn.disabled = true;
    simChoices.innerHTML = '';
    stopAuto();
    return;
  }
  // The previous step moves into the log (with what you chose, if it was a question).
  if (sim.steps > 0) {
    const chose = sim.chosen ? `<p class="sim-chose">You chose: <b>${sim.chosen}</b></p>` : '';
    const li = el('li', null, `<div class="sim-log-title">${esc(simTitle.textContent)}</div>${simText.innerHTML}${chose}`);
    simLog.prepend(li);
  }
  sim.steps++;
  sim.chosen = null;
  simTitle.textContent = value.title;
  simText.innerHTML = value.html;
  addSpeakButtons(simText);
  sim.asking = !!value.ask;
  simChoices.innerHTML = '';
  simStepBtn.disabled = sim.asking;
  if (value.spend) { sim.asking = true; simStepBtn.disabled = true; stopAuto(); renderSpendPicker(value.spend); return; }
  if (sim.asking) {
    stopAuto();
    value.ask.forEach(o => {
      const b = el('button', 'sim-choice', `<span>${o.label}</span>${o.hint ? `<small>${o.hint}</small>` : ''}`);
      b.type = 'button';
      b.addEventListener('click', () => { sim.chosen = o.label; simStep(o.value); });
      simChoices.appendChild(b);
    });
  }
}

// Two counters (Story Points, the row's resource), − / + each, the outcome so far, and Confirm.
function renderSpendPicker({ base, sp, res, have, resLabel, failBy }) {
  const pick = { sp: 0, res: 0 };
  const outcome = m => (m > 0 ? `a success by ${m}` : m <= -failBy ? 'a failure' : 'a close call (nothing happens)');
  const box = el('div', 'spend-picker');
  const line = (key, label, max, note) => {
    const row = el('div', 'spend-row', `<span class="spend-label">${label}</span><button type="button" class="spend-btn" data-d="-1">−</button><b class="spend-n">0</b><button type="button" class="spend-btn" data-d="1">+</button><small class="spend-note"></small>`);
    const n = row.querySelector('.spend-n'), small = row.querySelector('.spend-note');
    const draw = () => { n.textContent = pick[key]; small.textContent = note(pick[key]); };
    row.querySelectorAll('.spend-btn').forEach(b => b.addEventListener('click', () => { pick[key] = Math.max(0, Math.min(max, pick[key] + +b.dataset.d)); draw(); update(); }));
    draw();
    return row;
  };
  const result = el('div', 'spend-result');
  const confirm = el('button', 'sim-choice spend-confirm', '<span>Confirm</span>');
  confirm.type = 'button';
  const update = () => { result.innerHTML = `Total <b>+${pick.sp + pick.res}</b>: ${outcome(base + pick.sp + pick.res)}`; };
  if (sp > 0) box.appendChild(line('sp', 'Story Points', sp, k => `of ${sp}`));
  if (res > 0) box.appendChild(line('res', resLabel, res, k => `die ${have} → ${have - k}${have - k === 0 ? ' (used up)' : ''}`));
  box.append(result, confirm);
  update();
  confirm.addEventListener('click', () => {
    sim.chosen = [pick.sp ? storyPts(pick.sp) : '', pick.res ? `${pick.res} ${resLabel}` : ''].filter(Boolean).join(' and ') || 'nothing';
    simStep({ ...pick });
  });
  simChoices.appendChild(box);
}

function stopAuto() {
  if (sim && sim.auto) clearInterval(sim.auto);
  if (sim) sim.auto = null;
  simAutoBtn.textContent = 'Auto ⏵';
}

document.getElementById('sim-btn').addEventListener('click', () => {
  simPanel.hidden = false;
  startSim(false);
  fitView();
});
document.getElementById('sim-close').addEventListener('click', () => {
  stopAuto();
  simPanel.hidden = true;
  fitView();
});
document.getElementById('sim-restart').addEventListener('click', () => startSim(true));
simStepBtn.addEventListener('click', () => simStep());
simAutoBtn.addEventListener('click', () => {
  if (!sim) startSim(false);
  if (sim.auto) { stopAuto(); return; }
  simAutoBtn.textContent = 'Pause ⏸';
  sim.auto = setInterval(() => {
    simStep();
    if (sim && sim.asking) stopAuto();
    if (simStepBtn.disabled) stopAuto();
  }, 1500);
});

// A deal or theme change outside the simulator ends the game in progress; the next Step
// starts a new one on whatever is on the table (dealing first if slots are empty).
function abandonSim() {
  stopAuto();
  sim = null;
  simLog.innerHTML = '';
  simTitle.textContent = 'The table changed';
  simText.innerHTML = '<p>Press <b>Step</b> to start a new simulated game with the cards on the table.</p>';
  simStepBtn.disabled = false;
  simChoices.innerHTML = '';
}
['reset-btn', 'new-game-btn'].forEach(id => document.getElementById(id).addEventListener('click', abandonSim));
document.getElementById('theme-select').addEventListener('change', abandonSim);
document.getElementById('players-select').addEventListener('change', abandonSim);
