// Space Opera card set (Star Wars / Battlestar Galactica / Dune inspired).
// Same shape as data.js; approaches, resources, players and attribute icons are shared.
// Hand-written. To move it into the spreadsheet later, mirror these lists in a new tab.

window.SPACE_OPERA_DATA = (() => {
  const base = window.GAME_DATA;
  const [, ...locationLineIcons] = base.locations.icons;

  return {
    approaches: base.approaches,
    resources: base.resources,
    players: base.players,

    concepts: [
      'A Disgraced Starfighter Ace…',
      'A Smuggler with a Fast Ship…',
      'A Desert-born Prophet…',
      'A Rogue Imperial Officer…',
      'A Cyborg Bounty Hunter…',
      'A Noble Heir in Exile…',
      'A Wandering Mystic Knight…',
      'A Junkyard Mechanic…',
      'A Hunted Clone…',
      'A Rebel Spy…',
      'A Spice-addled Navigator…',
      'A Fleet Chaplain…',
    ],
    troubles: [
      '...with a price on their head',
      '...haunted by a destroyed homeworld',
      '...with forbidden psychic visions',
      '...with a debt to a crime lord',
      '...who may be a sleeper agent',
      '...with a failing cybernetic heart',
      '...sworn to a dying order',
      '...addicted to the spice',
      '...caught in a blood feud between houses',
      '...with a ship that’s falling apart',
      '...wanted for desertion',
      '...with a prophecy they don’t believe',
    ],
    firstNames: ['Kael', 'Zara', 'Orrin', 'Talia', 'Jax', 'Mira', 'Dax', 'Senna', 'Rook', 'Ilya', 'Vex', 'Nyra'],
    lastNames: ['Vantor', 'Solenne', 'Krell', 'Draven', 'Okonkwo', 'Starling', 'Harrow', 'Castellan', 'Venn', 'Moreau', 'Tarkesh', 'Ashgrove'],
    boons: [
      'Plasma Blade', 'Holo-map', 'Stillsuit', 'Blaster Pistol', 'Astromech Droid', 'Grappling Line',
      'Med-kit', 'Encrypted Datapad', 'Personal Shield', 'Smuggling Compartment', 'Signet Ring', 'Hand Scanner',
    ],
    boonStates: [
      'Salvaged...', 'Ancestral...', 'Prototype...', 'Battle-scarred...', 'Black-market...', 'Military-issue...',
      'Jury-rigged...', 'Gilded...', 'Stolen...', 'Sand-scoured...', 'Freshly printed...', 'Cursed...',
    ],
    // Liabilities: what a failed roll does to the Main player, drawn at random (see noir-banes.js).
    banes: [
      { text: 'Broken Leg', approaches: ['⚡'] },
      { text: 'Blaster Burn', approaches: ['💪'] },
      { text: 'Out of Power Cells', approaches: ['💪'] },
      { text: 'Fried Comms', approaches: ['📢'] },
      { text: 'Bounty on Your Head', approaches: ['🕶️'] },
      { text: 'Branded a Traitor', approaches: ['🕶️'] },
      { text: 'Lost Hope', approaches: ['📢'] },
      { text: 'Haunted by Visions', approaches: ['🐢'] },
      { text: 'Spice Withdrawal', approaches: ['🧠'] },
      { text: 'Concussion', approaches: ['🐢'] },
      { text: 'Hyperdrive Down', approaches: ['⚡'] },
      { text: 'The Countdown Is Running', approaches: ['🧠'] },
    ],
    relationships: [
      'Former wingmates...', 'Survivors of the same massacre...', 'Rival pilots...', 'Master and apprentice...',
      'Co-owners of a ship...', 'Members of rival houses...', 'Escaped prisoners together...', 'Old smuggling partners...',
      'Sworn blood-siblings...', 'Ex-lovers on opposite sides...', 'Bound by a life debt...', 'Fellow refugees...',
    ],
    placeAdjectives: [
      'Derelict', 'Orbital', 'Sand-buried', 'Frozen', 'Zero-G', 'Bombed-out', 'Imperial',
      'Overgrown', 'Quarantined', 'Neon-lit', 'Storm-wracked', 'Ancient',
    ],

    // Lines: material, where it's from, what it's for, its flaw
    macguffins: {
      icons: base.macguffins.icons,
      cards: [
        { name: 'Star Chart', lines: ['Crystal lattice', 'A dead navigator’s mind', 'Find the lost colony', 'Centuries out of date'] },
        { name: 'Spice Cache', lines: ['Glittering orange dust', 'A sandworm’s trail', 'Buy a planet’s loyalty', 'Highly unstable'] },
        { name: 'Reactor Core', lines: ['Shielded fusion cell', 'A scrapped dreadnought', 'Power the last jump', 'Leaking radiation'] },
        { name: 'Royal Seal', lines: ['Meteoric iron', 'The emperor’s vault', 'Claim the throne', 'Easily forged'] },
        { name: 'Ancient Relic', lines: ['Unknown alloy', 'A precursor temple', 'Awaken the old powers', 'It whispers'] },
        { name: 'Launch Codes', lines: ['Encrypted data spike', 'An admiral’s quarters', 'Fire the planet-killer', 'Expire at the next jump'] },
        { name: 'Droid Memory', lines: ['Battered memory core', 'A crashed scout droid', 'Prove the betrayal', 'Partially wiped'] },
        { name: 'Prisoner', lines: ['A living hostage', 'A detention barge', 'Trade for a ceasefire', 'Doesn’t want rescuing'] },
        { name: 'Bounty Puck', lines: ['Pulsing tracker', 'A hunters’ guild hall', 'Collect the reward', 'Also tracks its holder'] },
        { name: 'Genome Key', lines: ['Sealed vial of blood', 'A royal bloodline', 'Open the gene vault', 'Spoils without cold storage'] },
        { name: 'Fleet Manifest', lines: ['Paper printout', 'The flagship’s archive', 'Expose the infiltrators', 'Names have been altered'] },
        { name: 'Stolen Starfighter', lines: ['Sleek alloy hull', 'A rival’s private hangar', 'Escape the blockade', 'Hidden tracking beacon'] },
      ],
    },

    // Lines: climb, cover, pit, crossing, obstacle, hidden entry, slick, hazard, enemies
    locations: {
      icons: ['🪐', ...locationLineIcons],
      cards: [
        { name: 'Spaceport', lines: ['Cargo crane gantry', 'Stacked fuel drums', 'Open landing pit', 'Boarding ramp', 'Parked freighter', 'Maintenance hatch', 'Spilled coolant', 'Engine exhaust blast', 'Port security droids'] },
        { name: 'Desert Outpost', lines: ['Wind-carved spire', 'Half-buried wreckage', 'Sinking sand pit', 'Rope bridge over a canyon', 'Dune ridge', 'Hidden cave mouth', 'Loose sliding sand', 'Approaching sandstorm', 'Desert raiders'] },
        { name: 'Warship Hangar', lines: ['Docking clamp scaffold', 'Fighter on the deck', 'Open launch tube', 'Retracting catwalk', 'Ordnance carts', 'Air vent shaft', 'Hydraulic fluid slick', 'Airlock about to cycle', 'Marine boarding squad'] },
        { name: 'Mining Colony', lines: ['Ore elevator shaft', 'Rock-crusher housings', 'Open strip-mine pit', 'Conveyor belt span', 'Hauler drone traffic', 'Old survey tunnel', 'Ore slurry runoff', 'Decompression alarm', 'Company enforcers'] },
        { name: 'Jungle Temple', lines: ['Vine-choked ziggurat', 'Fallen stone idols', 'Sinkhole into the ruins', 'Rope bridge over a gorge', 'Thorn thickets', 'Hidden glyph door', 'Mossy temple steps', 'Drifting spore clouds', 'Temple guardians'] },
        { name: 'Casino Station', lines: ['Holo-sign gantry', 'Card tables and slots', 'Maintenance well', 'Glass skywalk', 'Crowd of high rollers', 'Croupier’s service lift', 'Spilled synth-wine', 'Faulty gravity plating', 'House security'] },
      ],
    },

    // Lines: fear, goal, secret, connection
    villains: {
      icons: base.villains.icons,
      cards: [
        { name: 'Grand Admiral', lines: ['Being made obsolete', 'Crush the rebellion forever', 'Was once a rebel', 'The fleet’s officer corps'] },
        { name: 'Scheming Baron', lines: ['Losing the spice monopoly', 'Seize the throne', 'Is secretly dying', 'A rival noble house'] },
        { name: 'Machine Infiltrator', lines: ['Being exposed as artificial', 'Replace the fleet’s leaders', 'Doubts its own programming', 'Sleeper cells in the crew'] },
      ],
    },
    allies: {
      icons: base.allies.icons,
      cards: [
        { name: 'The Old Mystic', lines: ['Their order’s extinction', 'Train one last student', 'Once fell to the dark', 'The hero’s lost parent'] },
        { name: 'The Fleet Commander', lines: ['Losing the last of humanity', 'Get the fleet to safety', 'Lied about a promised homeworld', 'The hero’s commanding officer'] },
        { name: 'The Desert Guide', lines: ['Outsiders ruining the desert', 'Free their people', 'Their tribe calls them messiah', 'A debt to the hero’s family'] },
      ],
    },

    situations: [
      {
        name: 'Beginning: Blockade run',
        key: '👿🔗',
        description: 'Imperial pickets close around 🏠 as you try to slip 🛠️ past 👿’s fleet, crewed by 👿🔗. Do you try to:\nA) slip past the pickets without being identified 🕶️ (ℹ️)\nB) get through before the net closes ⚡ (⌛)\nC) make it out with the ship still in flying shape 🧠 (📦)',
        escalations: ['A tractor beam locks on and the hull starts to buckle ➖🧠', 'Fighters scramble from the nearest cruiser ➖⚡'],
        approaches: ['🕶️', '⚡', '🧠'],
        risks: ['ℹ️', '⌛', '📦'],
      },
      {
        name: 'Middle: Sandstorm ambush',
        key: '🧱',
        description: 'Crossing the dunes toward 🏠 with 😇, raiders burst from behind the 🧱. Do you try to:\nA) send the raiders running for good 💪 (🔥)\nB) win the raiders over to your side 📢 (⭐)\nC) get 😇 through without a scratch 🐢 (📏)',
        escalations: ['The storm hits and you lose sight of 😇 ➖🐢', 'Something enormous moves beneath the sand, and the raiders rally ➖💪'],
        approaches: ['💪', '📢', '🐢'],
        risks: ['🔥', '⭐', '📏'],
      },
      {
        name: 'Middle: Traitor aboard',
        key: '😇🔒',
        description: 'Docked at 🏠, you learn someone aboard is feeding 👿 your position. 😇 knows something that could unmask them: 😇🔒. Do you try to:\nA) find the traitor before the next jump ⚡ (⌛)\nB) feed 👿 a false position 🕶️ (ℹ️)\nC) keep the crew from turning on each other 📢 (⭐)',
        escalations: ['The traitor sabotages the jump drive, and the clock is ticking ➖⚡', 'The crew starts accusing each other ➖📢'],
        approaches: ['⚡', '🕶️', '📢'],
        risks: ['⌛', 'ℹ️', '⭐'],
      },
      {
        name: 'Ending: Throne room duel',
        key: '🕳️',
        description: 'In the heart of 🏠, 👿 holds 🛠️ out over the 🕳️. Do you try to:\nA) catch 🛠️ before it falls 🐢 (📏)\nB) break 👿’s hold on 🏠 for good 💪 (🔥)\nC) turn 👿’s guards against them 🧠 (📦)',
        escalations: ['Guards pour in through the 🚪 ➖💪', 'The station begins tearing itself apart ➖🐢'],
        approaches: ['🐢', '💪', '🧠'],
        risks: ['📏', '🔥', '📦'],
      },
    ],
  };
})();
