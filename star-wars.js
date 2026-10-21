// Star Wars card set: characters, places, things and scenes from the films.
// Same shape as data.js; approaches, resources, players and attribute icons are shared.
// Hand-written. To move it into the spreadsheet later, mirror these lists in a new tab.
//
// Situation text uses the shared icons as blanks: 🏠 the Location, 👿 the Villain, 😇 the Ally,
// 🛠️ the Object, and a pair for one of their lines (👿🔗 the Villain's Connection). Each choice ends
// with its approach and, in brackets, the resource it risks (the approach guards that resource).

window.STAR_WARS_DATA = (() => {
  const base = window.GAME_DATA;
  const [, ...locationLineIcons] = base.locations.icons;

  return {
    approaches: base.approaches,
    resources: base.resources,
    players: base.players,

    concepts: [
      'A Reckless Rebel Pilot…',
      'A Smuggler with a Fast Ship…',
      'A Jedi in Hiding…',
      'A Defecting Stormtrooper…',
      'A Mandalorian Hunter…',
      'A Senator in Exile…',
      'A Moisture Farmer’s Kid…',
      'A Scavenger from the Junkyard Worlds…',
      'A Rebel Spy…',
      'A Wookiee Mechanic…',
      'A Former Imperial Officer…',
      'A Clone Trooper Veteran…',
    ],
    troubles: [
      '...with a price on their head from the Hutts',
      '...haunted by a homeworld the Empire destroyed',
      '...hearing the call of the dark side',
      '...owing a crime lord a fortune',
      '...with an Imperial tracking chip inside',
      '...whose parent serves the Empire',
      '...sworn to an order that no longer exists',
      '...who always shoots first',
      '...with a ship that breaks down when it matters',
      '...wanted for desertion',
      '...who has a bad feeling about this',
      '...with a debt to a crime syndicate',
    ],
    // Names on the backs of the Concept and Trouble cards: first names, then family names.
    firstNames: ['Kaelo', 'Brisa', 'Tavian', 'Jyra', 'Dex', 'Nalen', 'Oria', 'Rhen', 'Zev', 'Talo', 'Mirel', 'Kesh'],
    lastNames: ['Vashto', 'Korrin', 'Starsong', 'Tarlo', 'Ondrak', 'Rennick', 'Shan', 'Dreyl', 'Moroff', 'Tessik', 'Vane', 'Reetal'],
    // Assets: things that give an edge.
    boons: [
      'Lightsaber', 'Blaster Pistol', 'Astromech Droid', 'Bowcaster', 'Thermal Detonator', 'Jetpack',
      'Macrobinoculars', 'Comlink', 'Smuggling Compartment', 'Imperial Code Cylinder', 'Grappling Hook', 'Medpac',
    ],
    boonStates: [
      'Salvaged...', 'Family...', 'Prototype...', 'Battle-scarred...', 'Black-market...', 'Imperial-issue...',
      'Jury-rigged...', 'Mandalorian...', 'Stolen...', 'Sand-scoured...', 'Brand-new...', 'Jedi...',
    ],
    // Liabilities: what a failed roll does to the Main player, drawn at random (one approach each,
    // each approach on two cards).
    banes: [
      { text: 'Broken Leg', approaches: ['⚡'] },
      { text: 'Hyperdrive Down', approaches: ['⚡'] },
      { text: 'Blaster Burn', approaches: ['💪'] },
      { text: 'Out of Power Packs', approaches: ['💪'] },
      { text: 'Jammed Comlink', approaches: ['📢'] },
      { text: 'Lost Hope', approaches: ['📢'] },
      { text: 'Bounty on Your Head', approaches: ['🕶️'] },
      { text: 'Wanted by the Empire', approaches: ['🕶️'] },
      { text: 'Troubling Visions', approaches: ['🐢'] },
      { text: 'Concussion', approaches: ['🐢'] },
      { text: 'Hibernation Sickness', approaches: ['🧠'] },
      { text: 'Tracker on Your Ship', approaches: ['🧠'] },
    ],
    relationships: [
      'Wingmates in the same squadron...', 'Survivors of the Purge...', 'Rival podracers...', 'Master and Padawan...',
      'Co-owners of a freighter...', 'Clones from the same batch...', 'Escaped the spice mines together...', 'Old smuggling partners...',
      'Saved each other on an ice planet...', 'In love across enemy lines...', 'Bound by a life debt...', 'Grew up on the same moisture farm...',
    ],
    placeAdjectives: [
      'Derelict', 'Orbital', 'Sand-buried', 'Frozen', 'Imperial', 'Hutt-owned',
      'Overgrown', 'Bombed-out', 'Abandoned', 'Neon-lit', 'Storm-wracked', 'Ancient Jedi',
    ],

    // Lines: material, where it's from, what it's for, its flaw
    macguffins: {
      icons: base.macguffins.icons,
      cards: [
        { name: 'Battle Station Plans', lines: ['Data tape', 'An Imperial archive', 'Find the station’s weakness', 'Every Imperial is hunting it'] },
        { name: 'Kyber Crystal', lines: ['Glowing crystal', 'Sacred caves', 'Power a lightsaber', 'Sings to the dark side'] },
        { name: 'Holocron', lines: ['Pyramid of glass', 'A ruined Jedi temple', 'Unlock lost teachings', 'Only opens to the Force'] },
        { name: 'Frozen Friend', lines: ['A block of carbonite', 'A crime lord’s wall', 'Bring them home alive', 'Too heavy to carry far'] },
        { name: 'Map Fragment', lines: ['Memory chip', 'A droid’s data bank', 'Find the last Jedi', 'Half the map is missing'] },
        { name: 'Shuttle Clearance Code', lines: ['Encrypted transmission', 'A stolen Imperial shuttle', 'Get past the shield', 'It’s an older code'] },
        { name: 'Coaxium', lines: ['Unrefined hyperfuel', 'The spice mines', 'Buy your way off-world', 'Explodes if it warms up'] },
        { name: 'Prisoner', lines: ['A living captive', 'A detention block', 'Trade for safe passage', 'Doesn’t trust you'] },
        { name: 'A Fallen Jedi’s Saber', lines: ['Old hilt', 'A Jedi’s last stand', 'Prove who you are', 'Calls to its owner’s killer'] },
        { name: 'Bounty Puck', lines: ['Tracking fob', 'The bounty hunters’ guild', 'Collect the reward', 'Also tracks whoever holds it'] },
        { name: 'Sith Wayfinder', lines: ['Dark pyramid', 'A Sith vault', 'Find the hidden fleet', 'Whispers to its holder'] },
        { name: 'Rebel Base Coordinates', lines: ['Droid memory core', 'A captured courier', 'Lead the fleet to safety', 'The Empire is listening'] },
      ],
    },

    // Lines: climb, cover, pit, crossing, obstacle, hidden entry, slick, hazard, enemies
    locations: {
      icons: ['🪐', ...locationLineIcons],
      cards: [
        { name: 'Desert Spaceport', lines: ['Docking bay gantry', 'Stacked cargo crates', 'Open landing pit', 'Boarding ramp', 'Herd of banthas in the street', 'Back door of the cantina', 'Spilled engine grease', 'Blaster fight in the cantina', 'Stormtrooper patrol'] },
        { name: 'Battle Station', lines: ['Maintenance scaffold', 'Crates in the hangar bay', 'Bottomless shaft', 'Retracted bridge over a chasm', 'Blast doors sealing shut', 'Ventilation duct', 'Polished hangar floor', 'Tractor beam generator', 'Stormtroopers'] },
        { name: 'Ice Base', lines: ['Ice cliff', 'Snow trench', 'Hidden crevasse', 'Frozen ice bridge', 'Snowdrifts', 'Ice cave tunnel', 'Sheet ice', 'Walkers on the horizon', 'Snowtroopers'] },
        { name: 'Forest Moon', lines: ['Giant tree trunk', 'Fallen logs', 'Hunting pit trap', 'Rope walkway between trees', 'Dense undergrowth', 'Bunker back door', 'Mossy roots', 'Speeder bikes at full speed', 'Scout troopers'] },
        { name: 'Cloud City', lines: ['Gantry over the core', 'Carbon-freezing machinery', 'Reactor shaft', 'Narrow catwalk', 'Sliding doors', 'Service corridor', 'Rain-slicked landing platform', 'Carbon-freeze chamber', 'City guards'] },
        { name: 'Crime Lord’s Palace', lines: ['Throne room pillars', 'Musicians’ stage', 'Monster pit', 'Trapdoor bridge', 'Guards blocking the hall', 'Kitchen tunnel', 'Spilled drinks', 'Sail barge over the sand pit', 'The crime lord’s thugs'] },
      ],
    },

    // Lines: fear, goal, secret, connection
    villains: {
      icons: base.villains.icons,
      cards: [
        { name: 'Dark Lord of the Sith', lines: ['Their master’s displeasure', 'Crush the rebellion', 'There is still good in them', 'The Imperial fleet'] },
        { name: 'Grand Moff', lines: ['Losing control of the systems', 'Rule through fear of a superweapon', 'Doubts the Emperor’s plan', 'The battle station’s command'] },
        { name: 'Hutt Crime Lord', lines: ['Losing face', 'Collect every debt owed', 'Owes the Empire a favour', 'Bounty hunters on the payroll'] },
      ],
    },
    allies: {
      icons: base.allies.icons,
      cards: [
        { name: 'The Old Jedi Master', lines: ['The dark side rising again', 'Train one last student', 'Failed a student long ago', 'The hero’s lost parent'] },
        { name: 'The Rebel General', lines: ['Losing the last of the fleet', 'Strike the decisive blow', 'Sent good pilots to die', 'The Rebel Alliance'] },
        { name: 'The Scoundrel Captain', lines: ['Owing more than they can pay', 'Get paid and get out', 'Cares more than they admit', 'A Wookiee co-pilot'] },
      ],
    },

    situations: [
      {
        name: 'Beginning: Boarded in orbit',
        key: '👿🔗',
        description: 'Above 🏠, 👿’s troopers blast through the doors of your ship, sent by 👿🔗. 🛠️ must not fall into their hands. Do you try to:\nA) hide 🛠️ where they won’t think to look 🕶️ (ℹ️)\nB) get to the escape pods before the troopers ⚡ (⌛)\nC) hold the corridor long enough for the others 💪 (🔥)',
        escalations: ['More troopers pour in through the breach ➖💪', 'A tractor beam drags the ship into a Star Destroyer’s hangar ➖⚡'],
        approaches: ['🕶️', '⚡', '💪'],
        risks: ['ℹ️', '⌛', '🔥'],
      },
      {
        name: 'Beginning: The cantina deal',
        key: '🧱',
        description: 'In a smoky cantina at 🏠, you need a ship to get 🛠️ off-world, and 😇 might be the way out. But 👿’s spies are watching from behind the 🧱. Do you try to:\nA) strike a deal with 😇 you can actually afford 🧠 (📦)\nB) slip away before the spies make you 🕶️ (ℹ️)\nC) stare down the thug who picks a fight with you 📢 (⭐)',
        escalations: ['A blaster goes off and the whole cantina erupts ➖📢', 'Stormtroopers start checking papers at the door ➖🕶️'],
        approaches: ['🧠', '🕶️', '📢'],
        risks: ['📦', 'ℹ️', '⭐'],
      },
      {
        name: 'Middle: The trash compactor',
        key: '🕳️',
        description: 'Running from 👿’s troopers deep inside 🏠, you dive down a garbage chute and land in a trash compactor. Then the walls start to move. Do you try to:\nA) brace the walls with whatever is floating in the muck 💪 (🔥)\nB) get 😇 on the comlink to shut it down 📢 (⭐)\nC) find a way out before something in the water finds you 🐢 (📏)',
        escalations: ['Something in the muck drags someone under ➖🐢', 'The walls speed up ➖💪'],
        approaches: ['💪', '📢', '🐢'],
        risks: ['🔥', '⭐', '📏'],
      },
      {
        name: 'Middle: The asteroid field',
        key: '🛠️❌',
        description: '👿’s fighters are on your tail near 🏠, and you’re still carrying 🛠️. The only way out is straight into the asteroid field. Do you try to:\nA) fly through faster than they dare to follow ⚡ (⌛)\nB) hide inside a giant asteroid until they pass 🕶️ (ℹ️)\nC) keep the ship in one piece until the hyperdrive is fixed 🐢 (📏)',
        escalations: ['The cave you hid in starts to move: it’s alive ➖🕶️', 'An asteroid clips the hull ➖🐢'],
        approaches: ['⚡', '🕶️', '🐢'],
        risks: ['⌛', 'ℹ️', '📏'],
      },
      {
        name: 'Middle: The detention block',
        key: '😇🔒',
        description: '😇 is locked in a detention block at 🏠, and 👿 means to make an example of them. You’re disguised as troopers, and 😇 knows something 👿 must never learn: 😇🔒. Do you try to:\nA) bluff your way past the officer on duty 📢 (⭐)\nB) blast your way in and out again 💪 (🔥)\nC) find another way out of the cell block 🧠 (📦)',
        escalations: ['The alarm goes up across the whole station ➖📢', 'A squad of troopers cuts off the way back ➖🧠'],
        approaches: ['📢', '💪', '🧠'],
        risks: ['⭐', '🔥', '📦'],
      },
      {
        name: 'Ending: The trench run',
        key: '🛠️✨',
        description: 'The only way to stop 👿 is to hit the weak spot of 🏠, the one 🛠️ revealed. Fighters scream down the trench behind you. Do you try to:\nA) stay on target down the trench, whatever comes 🐢 (📏)\nB) draw 👿’s escort away from the others 📢 (⭐)\nC) take the shot before the superweapon fires ⚡ (⌛)',
        escalations: ['Another wingmate goes down ➖🐢', 'The superweapon is charging ➖⚡'],
        approaches: ['🐢', '📢', '⚡'],
        risks: ['📏', '⭐', '⌛'],
      },
      {
        name: 'Ending: Duel above the shaft',
        key: '🕳️',
        description: 'On a narrow gantry high over the 🕳️ of 🏠, 👿 offers you a choice: join them, or lose everything, 😇 included. Do you try to:\nA) refuse and fight on, whatever it costs 💪 (🔥)\nB) reach 😇 before 👿 can hurt them ⚡ (⌛)\nC) find the good in 👿 and turn them 🐢 (📏)',
        escalations: ['The gantry gives way beneath you ➖⚡', 'For a moment, the dark side has you ➖🐢'],
        approaches: ['💪', '⚡', '🐢'],
        risks: ['🔥', '⌛', '📏'],
      },
    ],
  };
})();
