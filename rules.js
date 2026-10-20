'use strict';

// The game's rule values, shared by the table (the Board shows them) and the gameplay
// simulator. Loaded before deal.js and sim.js.

const SIM_RULES = {
  acts: ['Beginning', 'Middle', 'Ending'],
  difficulty: { 'Beginning': 1, 'Middle': 3, 'Ending': 3 }, // 2026-10-19: aiming at acts won ~90-100% / 70-80% / 50-70% (see LENGTH_BASE)
  failBy: 2,          // missing the difficulty by this much or more is a failure
  maxEscalations: 2,  // the failure after the last Escalation loses the situation
  helperShare: 1,     // spotlight tokens each helper places when the Main player succeeds
  maxTokensPerRoll: 1,   // a success takes at most this many spotlight tokens (0 = no cap); 1 since 2026-10-19...
  overflowToEdge: false, // ...true: each point of margin above it is 1 Story Point from the pile instead
  // Failing (the Main player): Edge taken = failEdgeMain + failEdgePerMinus per Minus die already
  // out; helpers always take 1. failPickLoss: lose the resource OR take a Liability, not both.
  failEdgeMain: 0,      // was 1 until 2026-10-18: a failure gives no Story Point
  failEdgeHelpers: false, // ...nor to the helpers (was 1 each)
  failEdgePerMinus: 0,   // desperation (removed 2026-10-18): +1 Edge per Minus die already out
  failPickLoss: true,   // ON 2026-10-18: the failing Main player chooses: lose the resource, or take a Liability
  // ON 2026-10-18: a failure only gives the Main player a Liability (plus the Escalation); nobody
  // loses resources, which are only spent to succeed at a cost.
  failLiabilityOnly: true,
  resourceStart: 3, // each resource die's starting value (+1 Concept, -1 Trouble); spent down to 0
  // Succeed at a cost may spend a resource down to 0 (its die leaves the sheet: used up); there's no
  // lost turn for running out (2026-10-18). false: never below 1, and 0 loses your next turn.
  pushToZero: true,
  loseTurnAtZero: false,
  failPickLossNoBane: true, // the choice only while you don't already have a Liability (else: lose the resource)
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
  // Every row that completes the situation this round shares the win (2026-10-19): the act ends at
  // the end of the round and each finishing Main banks the full act-win bonus. false: the first only.
  shareActWin: true,
  actWinBonusAs: 'storyPoints', // ON 2026-10-20: the act-win bonus is Story Points instead of spotlight ('spotlight')
  shareActBonus: false, // 2026-10-20: everyone who finishes keeps their spotlight, but only the first to finish is the winner (stamp, bonus)
  // The Underdog Bonus (2026-10-20): a finisher who wasn't leading in scored spotlight going into the act's scoring banks double the act-win bonus.
  underdogBonus: true,
  afterWin: 'none',       // 'safe': once a row completes the situation, misses on the rows still to roll cost nothing (dropped 2026-10-20: the situation is still on until the round ends)
  minusNextRound: true, // a new Minus die only counts from the next round (all rows roll against the same box) // true: several failures on one Fate card only escalate once
  maxEdgePerBet: 2,   // Story Points a Main player may spend on one roll (0 = no limit); 2 since 2026-10-19
  maxPushPerRoll: 2,  // resource points they may spend on one roll, succeeding at a cost (0 = no limit)
  // Buy back resources (test 2026-10-19): on your turn, before betting, spend this many Story Points
  // to recover 1 point of a resource (never above its starting value; a used-up die returns). 0 = off.
  // ON 2026-10-19 (replacing buy-back): each player heals this many resource points at the end of
  // every act but the last, lowest resources first, up to healMax (6: a die's top). 0 = off.
  actEndHeal: 2,
  healMax: 6,
  recoverCost: 0,     // buy-back (Story Points for resource points): off since 2026-10-19
  recoverMax: 'start', // how high buying back can take a die: 'start' (its starting value) or a number (6 = a die's top)
  extraMiddleEdge: 1, // in games with more than one Middle: Story Points for everyone at the start of Middle 2, 3, ...
  maxEdgeHeld: 0,     // the most Edge one player may hold (0 = no limit)
  clearSpotlight: 0,  // spotlight banked for clearing a Minus die, as well as 1 Edge (the Clear seat's
                      // "holding the line" is reward enough: with 1, clearers ended ~1.4 above average)
  // 'end': clearing is a seat on the Board (one pawn). The die comes off at the end of the
  // round, so that round's rolls still feel it, but while someone holds the seat one failure
  // can't lose the situation ("holding the line"). 'now': the old rule, cleared at once.
  clearTiming: 'end',
  clearGoesFirst: true,  // whoever clears a Minus die bets first next round (as well as 1 Edge)
  // ✖️ Liabilities: a Main player who fails draws one at random (two approaches each). Like a
  // Trouble it can be invoked or compelled, but compelling it is free (the pile pays). One at a
  // time; removed by giving up a bet or spending baneRemoveEdge Edge.
  banes: true,
  baneRemoveEdge: 2,
  baneClearAtActEnd: false,
  // Test (2026-10-19): players keep every Asset and Liability they draw instead of swapping (the
  // extra ones wait behind the slot's card). Each Asset showing the approach is +1; each Liability
  // can be compelled. Burning an Asset avoids the new Liability (no longer shakes one off).
  stackCards: true, // ON 2026-10-19, with stackMax 2
  charApproaches: 1, // approaches on each Concept and Trouble card (1 since 2026-10-19; was 2)
  stackMax: 2, // with stackCards: the most of each a player may hold (0 = no limit); a new one past it swaps
  // Earned Assets (test): nobody starts with an Asset; a Main player who succeeds by boonMargin or
  // more draws one at random, and with one already keeps whichever they prefer.
  boonsEarned: false,
  // Asset upgrades: everyone starts with an Asset; succeeding by boonMargin+ draws one from the
  // undealt Assets, and you keep whichever you prefer.
  boonUpgrades: true,
  boonMargin: 2,
  // Asset shield (test): a Main player who fails may discard their Asset to keep the resource and
  // skip the Liability (the Escalation, Edge and any lost stake still happen).
  boonShield: 'heal', // 'heal': still lose the resource, but no new Liability and the carried one is discarded; true: keep the resource too  // true: Liabilities clear at the end of each act; false: a Liability stays until removed
  edgeAtActStart: { 'Beginning': 0, 'Middle': 0, 'Ending': 0 }, // Story Points every player takes as an act begins (none since 2026-10-18)
  maxStake: 0,        // spotlight tokens a Main player may stake on their bet (stakes removed 2026-10-18: 0)
  stakeLostOn: 'miss', // 'miss': lost unless the bet succeeds; 'failure': only lost on a failure
  stakeNeedsMargin: false, // true: a stake of N only pays off if the bet beats the difficulty by N or more
  stakePayout: 2,     // a successful stake comes back plus this many times the stake
  // The bonus for finishing an act's situation first (Story Points, actWinBonusAs), for the Main
  // player on the winning row and each player helping on that row. 2026-10-20: 1 / 2 / 4 Story
  // Points (sim, with the stacks in LENGTH_BASE: 2p 100 / 75 / 60, 3p 100 / 75-78 / 63-78, 4p 100 / 77 / 53).
  actWinBonus: {
    'Beginning': { main: 1, helper: 0 }, // helpers' share removed 2026-10-18
    'Middle': { main: 2, helper: 0 },
    'Ending': { main: 4, helper: 0 },
  },
  stakeFrom: 'scored',    // 'scored': stake spotlight you've already won; 'supply': stake unplayed tokens
  edgePolicy: 'push', // bots: 'push' spends to turn a miss into a success; 'careful' only dodges failures
  // How the Scene die counts. 'approach' (2026-10-18): only on a roll made with its approach
  // (every bonus comes from the one approach you chose). 'character': the old rule, on any roll
  // by a character whose Concept or Asset shows it.
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
  // Compels only (2026-10-18, so the table watches each other's Troubles and Liabilities): you
  // can't invoke your own; when your roll's approach matches one, any other player may compel it
  // for free (the pile pays the Edge), and the Storyteller compels one each round as part of
  // their job. You take -1 and the Edge, or refuse by paying 1 Edge to the pile.
  compelOnly: true,
  // ...true (2026-10-18): only the Storyteller compels, once per round (the others don't).
  compelByStoryteller: true,
  // A Trouble also matches a roll whose row risks the resource shown on the Trouble (ON
  // 2026-10-18: your approach alone no longer keeps you clear of it).
  compelRiskMatch: true,
  // Bots: the Storyteller compels every match it gets (a human probably would), not only when
  // the -1 could change the roll.
  storytellerAlwaysCompels: true, // ON 2026-10-18
  // Cost vs. Approaches. true: rows have no set approach; the Main player picks one, and it sets
  // what a failure costs: 0 of the row's resource with the approach that guards it, 2 with the
  // one that squanders it, 1 otherwise (see RISKS in deal.js). false: each row has a fixed
  // approach and a failure costs 1.
  freeApproach: true,
  // Narrow successes (test): beating the difficulty by less than narrowMargin still costs the
  // row's resource, by the approach (0 / 1 / 2), as in "Risks" on The Walking Mind.
  narrowCost: false,
  closeMissBane: false, // test: missing by less than failBy draws a Liability (but isn't a failure)
  // Minor failures (ON 2026-10-17): missing by less than failBy (by 1) costs the row's resource,
  // by the approach (0 / 1 / 2), but draws no Liability, gives no Edge and adds no Tension die.
  minorFailure: false, // off 2026-10-18 (succeed at a cost stays): a miss by 1 costs nothing
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
  minorFailureBane: false, // ...and also draws the Main player a Liability
  narrowMargin: 2,
  // Taking spotlight. true: neutral spotlight tokens; each situation starts with a stack (the
  // target) in every row's Successes box, and scoring takes tokens from it into your "This
  // scene" spot. The first row emptied completes the situation: everyone's This scene tokens
  // are then scored; if it's lost they go back to the pool. Bonuses and stake payouts come from
  // the pool. false: each player places their own coloured tokens on the rows.
  takeSpotlight: true,
  // Risks as bonuses (2026-10-18): on a row, the approach that guards its resource (✓) is +1 on
  // the roll and the one that squanders it (✗) is -1, and any failure costs 1 of the resource.
  // false: the ✓ / ✗ only change what a failure costs (0 / 2).
  riskModifier: true,
  // The Obstacle (2026-10-18, against spamming one approach): each round one player is the
  // Storyteller (the seat passes clockwise every round). Before anyone bets, they set the
  // Obstacle die to an approach and put it in one row's Obstacle box: going into that row with
  // that approach is −1. The Storyteller still bets as usual.
  obstacle: true,
  // ...true: instead of −1, the Obstacle cancels the bonuses for its approach on its row (Concept,
  // Asset, the Scene die), so it only hurts characters leaning on that approach.
  obstacleCancels: true,
};

// Settings that change with the number of players. Anything not listed for a player count
// falls back to SIM_RULES above. `target` is the successes on one row that win a situation.
// Stacks grow each act (players / +1 / +2, but 2 / 3 / 3 for two players), with extra Ending Edge
// to match: retuned 2026-10-17 with minor failures (sim: 13.3 / 11.8 / 9.9 rounds; acts won
// 100/93/43%, 99/91/~45%, 100/94/56%; Liabilities and lost turns back near the old levels).
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
    difficulty: { 'Beginning': 1, 'Middle': 3, 'Ending': 3 },
    extraMiddleEdge: 3, // long games: 3 Story Points at Middle 2, 3, ... (1 wasn't enough at 2 players)
    actEndHeal: 1, // test 2026-10-19: heal 1 point between acts at 2 players (2 made Acts II-III too easy)
    edgeAtActStart: { 'Beginning': 0, 'Middle': 0, 'Ending': 0 }, // no Story Points at act start (2026-10-18)
    // In the Ending a Main player may spend up to 3 Edge on a roll, not 2 (2026-10-18, for the
    // Obstacle: two players start the Ending with plenty of Edge the 2-per-roll limit kept unused).
  },
  3: {
    target: { 'Beginning': 3, 'Middle': 4, 'Ending': 5 },
    edgeAtActStart: { 'Beginning': 0, 'Middle': 0, 'Ending': 0 }, // no Story Points at act start (2026-10-18)
  },
  4: { target: { 'Beginning': 4, 'Middle': 5, 'Ending': 6 }, edgeAtActStart: { 'Beginning': 0, 'Middle': 0, 'Ending': 0 } }, // no Story Points at act start (2026-10-18)
};

// Story Points (called Edge in the code): "1 Story Point", "2 Story Points".
const storyPts = n => `${n} Story Point${n === 1 ? '' : 's'}`;

// ---- Game length (the two pickers by the Players menu) ----
// How many Middle acts (0-3) between the Beginning and the Ending, and how much the spotlight
// stacks grow each act (+0, +1 or +2): a Middle's stacks are `extra` bigger than the
// Beginning's, the Ending's `extra` x endingSteps bigger (2 players grow more gently). The
// Ending's starting Edge grows with them. 1 Middle and +1 is the tuned game (2026-10-17).
const GAME_LENGTH = { middles: 1, extra: 1 };
const LENGTH_BASE = {
  // 2026-10-19: each success takes 1 token (maxTokensPerRoll 1), so the stacks count successful rolls
  // and can rise act to act. With difficulty 1 / 3 / 3 the stacks below aim at acts won about
  // 90-100% / 70-80% / 50-70%. With 2 Story Points + 2 resource points per roll, buy-back and up to
  // 2 Assets / 2 Liabilities (2026-10-19 sim): 2p 100 / 78 / 71, 3p 100 / 64 / 69, 4p 100 / 81 / 68.
  // One approach per Concept / Trouble (2026-10-19): Middle one smaller everywhere, Ending one smaller
  // at 2 and 4 players; sim ~ 2p 100 / 68 / 60, 3p 100 / 79 / 48, 4p 100 / 67 / 73.
  // Stacks: Beginning = stack, Middle = stack + extra + middleStack, Ending = stack + extra *
  // endingSteps + endingStack (extra is 1: the game is always three acts).
  // endingEdge / edgePerExtra: Story Points at the Ending's start (all 0: no act-start Story Points).
  2: { stack: 2, endingSteps: 2, endingEdge: 0, edgePerExtra: 0, middleStack: 0, endingStack: 0 },  // 2 / 3 / 4
  3: { stack: 2, endingSteps: 1, endingEdge: 0, edgePerExtra: 0, middleStack: -1 },  // 2 / 2 / 3
  4: { stack: 3, endingSteps: 2, endingEdge: 0, edgePerExtra: 0, middleStack: -1, endingStack: 0 },  // 3 / 3 / 5
};
function setGameLength(middles, extra) {
  GAME_LENGTH.middles = middles;
  GAME_LENGTH.extra = extra;
  SIM_RULES.acts = ['Beginning', ...Array(middles).fill('Middle'), 'Ending'];
  for (const [n, b] of Object.entries(LENGTH_BASE)) {
    const r = PLAYER_COUNT_RULES[n];
    r.target = { Beginning: b.stack, Middle: b.stack + extra + (b.middleStack || 0), Ending: Math.max(1, b.stack + extra * b.endingSteps + (b.endingStack || 0)) };
    r.edgeAtActStart = { ...r.edgeAtActStart, Ending: Math.max(0, b.endingEdge + b.edgePerExtra * extra) };
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
