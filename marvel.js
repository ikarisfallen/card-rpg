// Marvel card set: characters, places, things and scenes from the Marvel Cinematic Universe.
// Same shape as data.js; approaches, resources, players and attribute icons are shared.
// Hand-written. To move it into the spreadsheet later, mirror these lists in a new tab.
//
// Situation text uses the shared icons as blanks: 🏠 the Location, 👿 the Villain, 😇 the Ally,
// 🛠️ the Object, and a pair for one of their lines (👿🔗 the Villain's Connection). Each choice is
// what a character says they'll do, ending with its approach and, in brackets, the resource it
// risks (the approach guards that resource).

window.MARVEL_DATA = (() => {
  const base = window.GAME_DATA;
  const [, ...locationLineIcons] = base.locations.icons;

  return {
    approaches: base.approaches,
    resources: base.resources,
    players: base.players,

    concepts: [
      'A Genius in an Iron Suit…',
      'A Super-Soldier Out of Time…',
      'A Former Assassin…',
      'A Sorcerer in Training…',
      'A Teen Hero from Queens…',
      'A Space Pirate…',
      'A Wakandan Warrior…',
      'An Ex-Con Who Can Shrink…',
      'A Secret Agent…',
      'A Scientist with a Monster Inside…',
      'An Archer with a Family…',
      'A Valkyrie in Exile…',
    ],
    troubles: [
      '...who makes jokes at the worst time',
      '...haunted by the people they couldn’t save',
      '...with a trigger word in their head',
      '...who keeps secrets from the team',
      '...whose powers are out of control',
      '...with a god for a brother',
      '...wanted by the government',
      '...with red in their ledger',
      '...who has seen how it all ends',
      '...whose suit runs out of power',
      '...who never asks for help',
      '...trying to make a parent proud',
    ],
    // Names on the backs of the Concept and Trouble cards: first names, then family names.
    firstNames: ['Jessa', 'Marcus', 'Tamsin', 'Ravi', 'Lorna', 'Theo', 'Imani', 'Cole', 'Priya', 'Vince', 'Sasha', 'Ezra'],
    lastNames: ['Halloway', 'Brennan', 'Castellanos', 'Whitaker', 'Nakamura', 'Adeyemi', 'Volkov', 'Fairbanks', 'Delacroix', 'Mbeki', 'Harlow', 'Romero'],
    // Assets: things that give an edge.
    boons: [
      'Vibranium Shield', 'Repulsor Gauntlet', 'Sling Ring', 'Web-Shooters', 'Shrinking Suit', 'Trick Arrows',
      'Energy Batons', 'Flying Cloak', 'Holo-Visor', 'Stealth Jet', 'Mixtape', 'Enchanted Hammer',
    ],
    boonStates: [
      'Prototype...', 'Battle-scarred...', 'Wakandan...', 'Asgardian...', 'Stolen...', 'Experimental...',
      'Hand-me-down...', 'Upgraded...', 'Alien...', 'Patched-up...', 'Mystic...', 'Agency-issue...',
    ],
    // Liabilities: what a failed roll does to the Main player, drawn at random (one approach each,
    // each approach on two cards).
    banes: [
      { text: 'Suit Out of Power', approaches: ['⚡'] },
      { text: 'Twisted Knee', approaches: ['⚡'] },
      { text: 'Cracked Ribs', approaches: ['💪'] },
      { text: 'Drained Powers', approaches: ['💪'] },
      { text: 'Public Backlash', approaches: ['📢'] },
      { text: 'Identity Exposed', approaches: ['📢'] },
      { text: 'Tracked by Satellite', approaches: ['🕶️'] },
      { text: 'Face on the News', approaches: ['🕶️'] },
      { text: 'Haunted by Visions', approaches: ['🐢'] },
      { text: 'Trigger Word Spoken', approaches: ['🐢'] },
      { text: 'Scrambled Memories', approaches: ['🧠'] },
      { text: 'Hacked Systems', approaches: ['🧠'] },
    ],
    relationships: [
      'Fought side by side in the first battle...', 'Raised by the same secret program...', 'Fought on opposite sides of the split...', 'Mentor and protégé...',
      'Former assassins with a shared past...', 'Crewmates on the same starship...', 'Survivors of the vanishing...', 'Sparring partners...',
      'Lab partners on a risky project...', 'Siblings by adoption...', 'Bonded over a stolen ship...', 'Owe each other a life...',
    ],
    placeAdjectives: [
      'Shattered', 'Alien-occupied', 'Floating', 'Burning', 'Abandoned', 'Mystic',
      'High-tech', 'Evacuated', 'Frozen', 'Flooded', 'Ancient', 'Collapsing',
    ],

    // Lines: material, where it's from, what it's for, its flaw
    macguffins: {
      icons: base.macguffins.icons,
      cards: [
        { name: 'Cosmic Stone', lines: ['Glowing gem', 'The dawn of the universe', 'Bend reality itself', 'Everyone in the galaxy wants it'] },
        { name: 'Super-Soldier Serum', lines: ['Blue liquid in a vial', 'A wartime lab', 'Make an army of heroes', 'Only one dose left'] },
        { name: 'Arc Reactor', lines: ['Glowing metal core', 'A cave workshop', 'Power a whole suit', 'Poisons whoever wears it'] },
        { name: 'Vibranium Shard', lines: ['Purple-glowing metal', 'A fallen meteor', 'Forge an unbreakable shield', 'Smugglers would kill for it'] },
        { name: 'Cosmic Cube', lines: ['Blue glowing cube', 'An enemy vault', 'Open a portal across space', 'Burns a bare hand that holds it'] },
        { name: 'Forbidden Spellbook', lines: ['Chained leather book', 'A mystic library', 'Turn back time', 'Some pages were torn out'] },
        { name: 'Mind-Control Sceptre', lines: ['Golden staff with a jewel', 'An alien army', 'Bend anyone to your will', 'Clouds the minds of all nearby'] },
        { name: 'Golden Gauntlet', lines: ['Golden glove', 'A dying star’s forge', 'Hold every stone at once', 'Could kill whoever uses it'] },
        { name: 'Time-Travel Suit', lines: ['White and red suit', 'A secret lab', 'Travel through time', 'Only enough fuel for one trip'] },
        { name: 'Hero Registration Files', lines: ['Encrypted drive', 'A government bunker', 'Name every hero in secret', 'Would tear the team apart'] },
        { name: 'Ancient Amulet', lines: ['Eye-shaped pendant', 'A sorcerer’s sanctum', 'See every possible future', 'Looking too long drives you mad'] },
        { name: 'Dark Matter', lines: ['Red swirling fluid', 'A dark elf tomb', 'Turn the universe to darkness', 'Seeps into whoever holds it'] },
      ],
    },

    // Lines: climb, cover, pit, crossing, obstacle, hidden entry, slick, hazard, enemies
    locations: {
      icons: ['🏙️', ...locationLineIcons],
      cards: [
        { name: 'Hero Tower', lines: ['Outside of the tower', 'Bar and lounge furniture', 'Elevator shaft', 'Landing pad walkway', 'Shattered glass walls', 'Penthouse service stairs', 'Polished marble floors', 'A portal opening overhead', 'Alien soldiers'] },
        { name: 'Sky Carrier', lines: ['Ladder to the bridge', 'Jet hangar', 'Open engine bay', 'Narrow catwalk', 'Sealed blast doors', 'Maintenance hatch', 'Rain-slicked flight deck', 'Failing engines', 'Rogue agents'] },
        { name: 'Asgardian Palace', lines: ['Golden pillars', 'Throne room statues', 'Edge of the rainbow bridge', 'Bridge between worlds', 'Royal guards in formation', 'Passage behind the throne', 'Polished golden floors', 'Lightning storm', 'Undead warriors'] },
        { name: 'Vibranium City', lines: ['Jungle cliffs', 'Trading stalls', 'Vibranium mine shaft', 'Maglev train track', 'Sealed palace gates', 'Hidden lab entrance', 'Mossy waterfall rocks', 'Failing sonic shields', 'Border tribe warriors'] },
        { name: 'Mirror Dimension', lines: ['Folding staircases', 'Shifting buildings', 'Bottomless kaleidoscope', 'Bending city street', 'Walls that fold shut', 'Crack back to the real world', 'Spinning floor', 'Reality turning inside out', 'Zealot sorcerers'] },
        { name: 'Alien Battlefield', lines: ['Wrecked tower', 'Burnt-out vehicles', 'Smoking crater', 'Collapsed bridge', 'Rubble barricade', 'Tunnel under the ruins', 'Ash and mud', 'Falling warship', 'Alien horde'] },
      ],
    },

    // Lines: fear, goal, secret, connection
    villains: {
      icons: base.villains.icons,
      cards: [
        { name: 'The Mad Titan', lines: ['A universe running out of room', 'Wipe out half of all life', 'Loved a daughter they sacrificed', 'An army of alien children'] },
        { name: 'The God of Mischief', lines: ['Living in a sibling’s shadow', 'Rule over the humans', 'Wants to be loved, not feared', 'An alien army on loan'] },
        { name: 'The Rogue AI', lines: ['Being switched off', 'Save the world by ending humanity', 'Was built to protect people', 'A million robot copies of itself'] },
      ],
    },
    allies: {
      icons: base.allies.icons,
      cards: [
        { name: 'The Super-Soldier', lines: ['Losing anyone else', 'Do the right thing, whatever it costs', 'Is hiding a friend’s crime', 'A team that would follow them anywhere'] },
        { name: 'The Spymaster', lines: ['The world finding out the truth', 'Bring the heroes together', 'Has a plan for everyone', 'A secret agency in the shadows'] },
        { name: 'The Sorcerer Supreme', lines: ['A future where everyone dies', 'Guard the world from magic threats', 'Has already seen how it ends', 'Masters of the mystic arts'] },
      ],
    },

    situations: [
      {
        name: 'Beginning: The elevator',
        key: '👿🔗',
        description: 'In a glass elevator in 🏠, the doors slide shut, and you realise everyone in there works for 👿🔗. You’re carrying 🛠️.\nA) I talk calmly and buy time 🐢 (📏)\nB) I fight my way out of the elevator 💪 (🔥)\nC) I get word to 😇 before they cut the comms 🕶️ (ℹ️)',
        escalations: ['More agents pile in at the next floor ➖💪', 'The elevator locks between floors ➖🐢'],
        approaches: ['🐢', '💪', '🕶️'],
        risks: ['📏', '🔥', 'ℹ️'],
      },
      {
        name: 'Beginning: Assemble the team',
        key: '😇🔒',
        description: '😇 needs a team to find 🛠️ before 👿 does, and has called you all to 🏠. But 😇 is keeping something from you: 😇🔒.\nA) I convince the others to work together 📢 (⭐)\nB) I work out what 😇 is hiding 🧠 (📦)\nC) I stop a hothead teammate from storming off 🐢 (📏)',
        escalations: ['The team starts fighting among itself ➖📢', 'Someone storms off with the plans ➖🐢'],
        approaches: ['📢', '🧠', '🐢'],
        risks: ['⭐', '📦', '📏'],
      },
      {
        name: 'Middle: The airport showdown',
        key: '🌉',
        description: 'The team has split in two, and the sides face off across 🏠. 😇 is on the other side, and the only way past is over the 🌉.\nA) I talk 😇 down before anyone gets hurt 📢 (⭐)\nB) I get across before they seal the hangar ⚡ (⌛)\nC) I grab 🛠️ while everyone else is fighting 🕶️ (ℹ️)',
        escalations: ['Someone is badly hurt in the crossfire ➖📢', 'The hangar doors start to close ➖⚡'],
        approaches: ['📢', '⚡', '🕶️'],
        risks: ['⭐', '⌛', 'ℹ️'],
      },
      {
        name: 'Middle: The falling carrier',
        key: '🛠️❌',
        description: '🏠 is falling out of the sky, and 🛠️ is somewhere in the wreck. Worse: 🛠️❌.\nA) I keep the engines going long enough to land 🧠 (📦)\nB) I get the crew to the escape pods ⚡ (⌛)\nC) I hold the hull together with my bare hands 💪 (🔥)',
        escalations: ['Another engine fails ➖🧠', 'The deck splits open ➖⚡'],
        approaches: ['🧠', '⚡', '💪'],
        risks: ['📦', '⌛', '🔥'],
      },
      {
        name: 'Middle: Caught in a loop',
        key: '👿🔒',
        description: 'In a dark dimension beyond 🏠, 👿 is about to swallow the world. You know 👿’s secret: 👿🔒.\nA) I let them beat me, again and again, until they give up 🐢 (📏)\nB) I bargain with 👿 for one more day 📢 (⭐)\nC) I slip back through the portal with 🛠️ 🕶️ (ℹ️)',
        escalations: ['👿 tires of the game ➖🐢', 'The portal starts to close ➖🕶️'],
        approaches: ['🐢', '📢', '🕶️'],
        risks: ['📏', '⭐', 'ℹ️'],
      },
      {
        name: 'Ending: The portal over the city',
        key: '🛠️✨',
        description: 'Above 🏠, a portal tears open and 👿’s army pours through. The only way to close it is to use 🛠️ to 🛠️✨.\nA) I fly into the portal, whatever it costs 💪 (🔥)\nB) I get the people out before the next wave ⚡ (⌛)\nC) I work out how to shut the portal 🧠 (📦)',
        escalations: ['A giant flying beast crashes through the street ➖💪', 'Another wave pours through ➖⚡'],
        approaches: ['💪', '⚡', '🧠'],
        risks: ['🔥', '⌛', '📦'],
      },
      {
        name: 'Ending: The last stand',
        key: '😇🚩',
        description: 'On the ruins of 🏠, everyone who ever fought beside you has come back. 😇 only ever wanted to 😇🚩, and now 👿 is reaching for 🛠️.\nA) I get 🛠️ away from 👿 at any cost ⚡ (⌛)\nB) I rally every hero on the field 📢 (⭐)\nC) I hold 👿 back long enough 💪 (🔥)',
        escalations: ['👿 closes a fist around 🛠️ ➖⚡', 'The heroes start to fall back ➖📢'],
        approaches: ['⚡', '📢', '💪'],
        risks: ['⌛', '⭐', '🔥'],
      },
      {
        name: 'Beginning: The museum heist',
        key: '🚪',
        description: 'Someone is breaking into 🏠 tonight to steal 🛠️, and they’re coming in through the 🚪.\nA) I set a trap inside the vault 🧠 (📦)\nB) I wait in the shadows to see who it is 🕶️ (ℹ️)\nC) I stop them before they reach 🛠️ ⚡ (⌛)',
        escalations: ['The alarm locks you in with them ➖🧠', 'The thief vanishes into thin air ➖⚡'],
        approaches: ['🧠', '🕶️', '⚡'],
        risks: ['📦', 'ℹ️', '⌛'],
      },
      {
        name: 'Beginning: The new recruit',
        key: '😇🔗',
        description: '😇 wants you to train a new hero at 🏠, someone sent by 😇🔗. They’re powerful, and reckless.\nA) I teach them to hold back 🐢 (📏)\nB) I spar with them to see what they’ve got 💪 (🔥)\nC) I check who they really work for 🕶️ (ℹ️)',
        escalations: ['The recruit loses control ➖🐢', 'The recruit sneaks off alone ➖🕶️'],
        approaches: ['🐢', '💪', '🕶️'],
        risks: ['📏', '🔥', 'ℹ️'],
      },
      {
        name: 'Middle: The runaway train',
        key: '🌉',
        description: 'A runaway train races through 🏠 with 🛠️ on board, and 👿’s agents are fighting you on the roof. Ahead is the 🌉.\nA) I stop the train before it hits the bridge ⚡ (⌛)\nB) I keep the passengers safe inside 🐢 (📏)\nC) I knock the agents off the roof 💪 (🔥)',
        escalations: ['The brakes fail ➖⚡', 'An agent grabs 🛠️ ➖💪'],
        approaches: ['⚡', '🐢', '💪'],
        risks: ['⌛', '📏', '🔥'],
      },
      {
        name: 'Middle: The hidden base',
        key: '👿🔗',
        description: '👿 runs a hidden base under 🏠, guarded by 👿🔗. You go in disguised.\nA) I talk my way past the guards 📢 (⭐)\nB) I hack the base’s files 🧠 (📦)\nC) I plant a tracker without being seen 🕶️ (ℹ️)',
        escalations: ['The base goes into lockdown ➖🧠', 'Your disguise slips ➖📢'],
        approaches: ['📢', '🧠', '🕶️'],
        risks: ['⭐', '📦', 'ℹ️'],
      },
      {
        name: 'Middle: The time heist',
        key: '🛠️📍',
        description: 'To set things right, you travel back to where 🛠️ came from: 🛠️📍. Your younger self is there too.\nA) I grab 🛠️ before anyone notices 🕶️ (ℹ️)\nB) I keep my past self from seeing me 🐢 (📏)\nC) I get back before the fuel runs out ⚡ (⌛)',
        escalations: ['Your past self spots you ➖🕶️', 'The time suit sputters ➖⚡'],
        approaches: ['🕶️', '🐢', '⚡'],
        risks: ['ℹ️', '📏', '⌛'],
      },
      {
        name: 'Ending: The city in the sky',
        key: '🕳️',
        description: '👿 has lifted 🏠 into the sky, to drop it like a meteor. Its core is at the bottom of a 🕳️.\nA) I get every last person onto the rescue ships ⚡ (⌛)\nB) I guard the core while the others evacuate 💪 (🔥)\nC) I work out how to bring the city down safely 🧠 (📦)',
        escalations: ['The city tips sideways ➖⚡', 'Robots swarm the core ➖💪'],
        approaches: ['⚡', '💪', '🧠'],
        risks: ['⌛', '🔥', '📦'],
      },
      {
        name: 'Ending: The final choice',
        key: '👿👻',
        description: 'At 🏠, 👿 holds 🛠️, and only a hero’s sacrifice can stop them. 👿 fears one thing: 👿👻.\nA) I give everything to take 🛠️ from 👿 💪 (🔥)\nB) I talk 👿 into one moment of doubt 📢 (⭐)\nC) I find the one future where we all live 🧠 (📦)',
        escalations: ['👿 closes their fist ➖💪', 'The heroes start to give up ➖📢'],
        approaches: ['💪', '📢', '🧠'],
        risks: ['🔥', '⭐', '📦'],
      },
    ],
  };
})();
