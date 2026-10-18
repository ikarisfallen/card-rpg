'use strict';

// The game's rule values, shared by the table (the Board shows them) and the gameplay
// simulator. Loaded before deal.js and sim.js.

const SIM_RULES = {
  acts: ['Beginning', 'Middle', 'Ending'],
  difficulty: { 'Beginning': 1, 'Middle': 2, 'Ending': 3 },
  failBy: 2,          // missing the difficulty by this much or more is a failure
  maxEscalations: 2,  // the failure after the last Escalation loses the situation
  helperShare: 1,     // spotlight tokens each helper places when the Main player succeeds
  maxTokensPerRoll: 0,   // a success places at most this many spotlight tokens (0 = no cap)...
  overflowToEdge: true,  // ...and each point of margin above it is 1 Edge from the pile instead
  // Failing (the Main player): Edge taken = failEdgeMain + failEdgePerMinus per Minus die already
  // out; helpers always take 1. failPickLoss: lose the resource OR take a Bane, not both.
  failEdgeMain: 1,
  failEdgePerMinus: 0,   // desperation (removed 2026-10-18): +1 Edge per Minus die already out
  failPickLoss: false,
  failPickLossNoBane: true, // ...but only while you don't already have a Bane (else: lose the resource)
  overflowAtRowLimit: true,  // a row takes only the tokens it needs to win; the rest of the margin is Edge
  endEdgePerSpotlight: 2, // at the end of the game, this many leftover Edge buy 1 spotlight (0 = off)
  helpTokensSafe: false, // true: helpers' tokens score even if the situation is lost (tried; felt passive)
  // The Spotlight Shift: the act-win bonus goes to the lowest-scoring player on the winning row
  // (Main or helper; ties go to the Main), and the Main takes the helper's share instead.
  spotlightShift: false, // removed 2026-10-18
  helperEdge: false,   // removed 2026-10-18: helpers may spend their banked Edge on the roll too
  maxRounds: 12,      // a situation not finished by then is lost
  oneEscalationPerSpin: false,
  // Initiative: 'standing' = lowest spotlight on the table (Scored + tokens on the Board) picks
  // first, ties to fewer Edge, then the earlier player; 'roundGain' = fewest tokens placed this round.
  initiativeBy: 'standing',
  rowOrder: 'initiative', // rows roll in their Main's initiative order ('abc': A, B, C)
  afterWin: 'safe',       // once a row completes the situation, the other rows still roll but a miss costs nothing
  minusNextRound: true, // a new Minus die only counts from the next round (all rows roll against the same box) // true: several failures on one Fate card only escalate once
  maxEdgePerBet: 2,   // Edge a Main player may spend on one roll
  maxEdgeHeld: 0,     // the most Edge one player may hold (0 = no limit)
  clearSpotlight: 0,  // spotlight banked for clearing a Minus die, as well as 1 Edge (the Clear seat's
                      // "holding the line" is reward enough: with 1, clearers ended ~1.4 above average)
  // 'end': clearing is a seat on the Board (one pawn). The die comes off at the end of the
  // round, so that round's rolls still feel it, but while someone holds the seat one failure
  // can't lose the situation ("holding the line"). 'now': the old rule, cleared at once.
  clearTiming: 'end',
  clearGoesFirst: true,  // whoever clears a Minus die bets first next round (as well as 1 Edge)
  // ✖️ Banes: a Main player who fails draws one at random (two approaches each). Like a
  // Trouble it can be invoked or compelled, but compelling it is free (the pile pays). One at a
  // time; removed by giving up a bet or spending baneRemoveEdge Edge.
  banes: true,
  baneRemoveEdge: 2,
  baneClearAtActEnd: false,
  // Earned Boons (test): nobody starts with a Boon; a Main player who succeeds by boonMargin or
  // more draws one at random, and with one already keeps whichever they prefer.
  boonsEarned: false,
  // Boon upgrades: everyone starts with a Boon; succeeding by boonMargin+ draws one from the
  // undealt Boons, and you keep whichever you prefer.
  boonUpgrades: true,
  boonMargin: 2,
  // Boon shield (test): a Main player who fails may discard their Boon to keep the resource and
  // skip the Bane (the Escalation, Edge and any lost stake still happen).
  boonShield: 'heal', // 'heal': still lose the resource, but no new Bane and the carried one is discarded; true: keep the resource too  // true: Banes clear at the end of each act; false: a Bane stays until removed
  edgeAtActStart: { 'Beginning': 1, 'Middle': 2, 'Ending': 3 }, // Edge every player takes as the act begins
  maxStake: 0,        // spotlight tokens a Main player may stake on their bet (stakes removed 2026-10-18: 0)
  stakeLostOn: 'miss', // 'miss': lost unless the bet succeeds; 'failure': only lost on a failure
  stakeNeedsMargin: false, // true: a stake of N only pays off if the bet beats the difficulty by N or more
  stakePayout: 2,     // a successful stake comes back plus this many times the stake
  // Spotlight banked for finishing an act's situation: by the Main player on the winning row,
  // and by each player helping on that row.
  actWinBonus: {
    'Beginning': { main: 2, helper: 0 }, // helpers' share removed 2026-10-18
    'Middle': { main: 3, helper: 0 },
    'Ending': { main: 4, helper: 0 },
  },
  stakeFrom: 'scored',    // 'scored': stake spotlight you've already won; 'supply': stake unplayed tokens
  edgePolicy: 'push', // bots: 'push' spends to turn a miss into a success; 'careful' only dodges failures
  // How the Scene die counts. 'approach' (2026-10-18): only on a roll made with its approach
  // (every bonus comes from the one approach you chose). 'character': the old rule, on any roll
  // by a character whose Concept or Boon shows it.
  sceneBy: 'approach',
  // Claiming the Scene die (with sceneBy 'approach'): each round, the first Main player to go in
  // with its approach takes the die into their Main box for the +1; nobody else gets it that
  // round. It goes back once everyone has gone.
  sceneClaim: true,
  sceneModifier: 1,   // the Scene die: added to every roll using the approach of the Situation's key line
                      // (+1 = a bonus, -1 = a penalty, 0 = off)
  // ➖ Troubles. true: no automatic -1; a Main player whose row shows one of their Trouble's
  // approaches may invoke it (or another player may compel it) for -1 on the roll and Edge.
  // false: the old rule, -1 on every roll with a Trouble approach.
  troubleInvoke: true,
  troubleEdge: 1,      // Edge for taking the -1: from the pile if invoked, from the compeller if compelled
  sceneTroubleEdge: 1, // extra Edge from the pile when the Scene die shows a Trouble approach too
  // A refused compel: the Main player pays 1 Edge to the pile, and so does the compeller.
  compelIntoRefusal: false, // bots: true = compel even when they expect a refusal
  // Cost vs. Approaches. true: rows have no set approach; the Main player picks one, and it sets
  // what a failure costs: 0 of the row's resource with the approach that guards it, 2 with the
  // one that squanders it, 1 otherwise (see RISKS in deal.js). false: each row has a fixed
  // approach and a failure costs 1.
  freeApproach: true,
  // Narrow successes (test): beating the difficulty by less than narrowMargin still costs the
  // row's resource, by the approach (0 / 1 / 2), as in "Risks" on The Walking Mind.
  narrowCost: false,
  closeMissBane: false, // test: missing by less than failBy draws a Bane (but isn't a failure)
  // Minor failures (ON 2026-10-17): missing by less than failBy (by 1) costs the row's resource,
  // by the approach (0 / 1 / 2), but draws no Bane, gives no Edge and adds no Tension die.
  minorFailure: true,
  // Succeed at a cost (called "pushing" in the code): after the Fate card, a Main player whose roll would miss may lower
  // their die for the row's resource (never below 1) for +1 per point.
  pushResource: true, // ON 2026-10-18
  // Escalations (2026-10-18): the Main player who failed picks which of the Situation's two
  // Escalations happens (the same one again is fine: that trouble got REALLY bad). false: they
  // happen in order.
  escalationChoice: true,
  pushToSucceed: true, // ...as many points as it takes to succeed (+1 each), only if that reaches a success
  // The Fate deck: 'balanced' (24 cards, each −2 −1 0 0 +1 +2) or 'random' (the old 30 cards).
  fateDeck: 'balanced',
  minorFailureBane: false, // ...and also draws the Main player a Bane
  narrowMargin: 2,
  // Taking spotlight. true: neutral spotlight tokens; each situation starts with a stack (the
  // target) in every row's Successes box, and scoring takes tokens from it into your "This
  // scene" spot. The first row emptied completes the situation: everyone's This scene tokens
  // are then scored; if it's lost they go back to the pool. Bonuses and stake payouts come from
  // the pool. false: each player places their own coloured tokens on the rows.
  takeSpotlight: true,
};

// Settings that change with the number of players. Anything not listed for a player count
// falls back to SIM_RULES above. `target` is the successes on one row that win a situation.
// Stacks grow each act (players / +1 / +2, but 2 / 3 / 3 for two players), with extra Ending Edge
// to match: retuned 2026-10-17 with minor failures (sim: 13.3 / 11.8 / 9.9 rounds; acts won
// 100/93/43%, 99/91/~45%, 100/94/56%; Banes and lost turns back near the old levels).
// Earlier: tuned so each count plays about the same (Acts won ~98% / ~90% / ~50%, ~8.5 rounds). Ending
// Edge was cut by 2 at every count once the Scene die and invoked Troubles made it ~65-70%:
//   2 players: fewer Edge (only 2 bets per spin means fewer failures to recover from)
//   3 players: more Edge (nobody is left over to help, so bets lack the helper's +1), and a
//              smaller Middle bonus (with no helper sharing the row, one Middle win was
//              deciding too many games)
const PLAYER_COUNT_RULES = {
  // 2 players: a tougher finale (difficulty 4) softened by 2 Edge, since there was no Edge left to cut.
  2: {
    target: { 'Beginning': 2, 'Middle': 3, 'Ending': 3 },
    difficulty: { 'Beginning': 1, 'Middle': 2, 'Ending': 4 },
    edgeAtActStart: { 'Beginning': 0, 'Middle': 0, 'Ending': 4 },
  },
  3: {
    target: { 'Beginning': 3, 'Middle': 4, 'Ending': 5 },
    edgeAtActStart: { 'Beginning': 2, 'Middle': 1, 'Ending': 3 },
    actWinBonus: { 'Beginning': { main: 2, helper: 0 }, 'Middle': { main: 2, helper: 0 }, 'Ending': { main: 4, helper: 0 } },
  },
  4: { target: { 'Beginning': 4, 'Middle': 5, 'Ending': 6 }, edgeAtActStart: { 'Beginning': 1, 'Middle': 0, 'Ending': 1 } },
};

// ---- Game length (the two pickers by the Players menu) ----
// How many Middle acts (0-3) between the Beginning and the Ending, and how much the spotlight
// stacks grow each act (+0, +1 or +2): a Middle's stacks are `extra` bigger than the
// Beginning's, the Ending's `extra` x endingSteps bigger (2 players grow more gently). The
// Ending's starting Edge grows with them. 1 Middle and +1 is the tuned game (2026-10-17).
const GAME_LENGTH = { middles: 1, extra: 1 };
const LENGTH_BASE = {
  // Ending stacks retuned 2026-10-18 (sim, Ending ~47 / 46 / 54% won): 2 players 2/3/2, 3 players
  // 3/4/4, 4 players 4/5/5 at +1 (the Ending grows with the Middles, not twice as fast).
  2: { stack: 2, endingSteps: 0, endingEdge: 2, edgePerExtra: 2 },
  3: { stack: 3, endingSteps: 1, endingEdge: 1, edgePerExtra: 2 },
  4: { stack: 4, endingSteps: 1, endingEdge: 1, edgePerExtra: 0 },
};
function setGameLength(middles, extra) {
  GAME_LENGTH.middles = middles;
  GAME_LENGTH.extra = extra;
  SIM_RULES.acts = ['Beginning', ...Array(middles).fill('Middle'), 'Ending'];
  for (const [n, b] of Object.entries(LENGTH_BASE)) {
    const r = PLAYER_COUNT_RULES[n];
    r.target = { Beginning: b.stack, Middle: b.stack + extra, Ending: b.stack + extra * b.endingSteps };
    r.edgeAtActStart = { ...r.edgeAtActStart, Ending: b.endingEdge + b.edgePerExtra * extra };
  }
}
setGameLength(GAME_LENGTH.middles, GAME_LENGTH.extra);
// The name an act goes by: "Middle 2" when there's more than one Middle.
function actLabel(i, acts = SIM_RULES.acts) {
  if (acts[i] !== 'Middle' || acts.filter(a => a === 'Middle').length < 2) return acts[i];
  return `Middle ${acts.slice(0, i + 1).filter(a => a === 'Middle').length}`;
}

// Successes one row needs to win the situation in `act`: `target` is a number, or one per act
// (e.g. { 'Beginning': 2, 'Middle': 3, 'Ending': 3 }) so the stacks can grow as the story does.
function actTarget(act, n = TABLE.players.length) {
  const t = playerRule('target', n);
  return typeof t === 'object' ? (t[act] ?? Object.values(t).pop()) : t;
}

function playerRule(name, n = TABLE.players.length) {
  const forCount = PLAYER_COUNT_RULES[n] || {};
  if (name in forCount) return forCount[name];
  return name === 'target' ? n : SIM_RULES[name];
}
