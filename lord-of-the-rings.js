// Lord of the Rings card set: characters, places, things and scenes from the books and films.
// Same shape as data.js; approaches, resources, players and attribute icons are shared.
// Hand-written. To move it into the spreadsheet later, mirror these lists in a new tab.
//
// Situation text uses the shared icons as blanks: 🏠 the Location, 👿 the Villain, 😇 the Ally,
// 🛠️ the Object, and a pair for one of their lines (👿🔗 the Villain's Connection). Each choice ends
// with its approach and, in brackets, the resource it risks (the approach guards that resource).

window.LOTR_DATA = (() => {
  const base = window.GAME_DATA;
  const [, ...locationLineIcons] = base.locations.icons;

  return {
    approaches: base.approaches,
    resources: base.resources,
    players: base.players,

    concepts: [
      'A Hobbit Far from the Shire…',
      'A Ranger of the North…',
      'A Dwarf of the Lonely Mountain…',
      'An Elf of the Woodland Realm…',
      'A Rider of the Mark…',
      'A Soldier of the White City…',
      'A Wizard’s Apprentice…',
      'A Bree-land Innkeeper…',
      'A Healer of the Old Ways…',
      'A Shieldmaiden of the Plains…',
      'A Burglar for Hire…',
      'A Wanderer of the Old Forest…',
    ],
    troubles: [
      '...who once held the Ring and still wants it',
      '...with a Morgul wound that never heals',
      '...hunted by the Black Riders',
      '...whose people are fading from the world',
      '...who swore an oath and broke it',
      '...who never trusts an Elf',
      '...who listens to the White Wizard’s voice',
      '...exiled from their own hall',
      '...afraid of the dark under the mountain',
      '...who can’t resist an adventure',
      '...carrying a broken heirloom sword',
      '...cursed by a barrow-wight',
    ],
    // Names on the backs of the Concept and Trouble cards: first names, then family names.
    firstNames: ['Bramwen', 'Haldor', 'Elessil', 'Tobin', 'Nimriel', 'Borlach', 'Merisa', 'Thandor', 'Lilwen', 'Aerion', 'Gimrik', 'Rosalind'],
    lastNames: ['Brandyhill', 'Stonefist', 'Silverleaf', 'Oakenhelm', 'Thistlewood', 'Ironfoot', 'Starbrook', 'Goodbarrel', 'Ashdown', 'Mossbottom', 'Windrider', 'Deepdelver'],
    // Assets: things that give an edge.
    boons: [
      'Elven Cloak', 'Sword', 'Mithril Shirt', 'Lembas Bread', 'Lantern', 'Longbow',
      'Elven Rope', 'Pipe-weed', 'Old Map', 'War Horn', 'Walking Staff', 'Swift Horse',
    ],
    boonStates: [
      'Elven...', 'Dwarf-forged...', 'Ancient...', 'Borrowed...', 'Heirloom...', 'Battered...',
      'Gifted...', 'Westernesse...', 'Hobbit-sized...', 'Glowing...', 'Dragon-hoard...', 'Rohirric...',
    ],
    // Liabilities: what a failed roll does to the Main player, drawn at random (one approach each,
    // each approach on two cards).
    banes: [
      { text: 'Twisted Ankle', approaches: ['⚡'] },
      { text: 'Lost Pony', approaches: ['⚡'] },
      { text: 'Orc-arrow Wound', approaches: ['💪'] },
      { text: 'Broken Blade', approaches: ['💪'] },
      { text: 'Shaken Courage', approaches: ['📢'] },
      { text: 'A Bad Name in Bree', approaches: ['📢'] },
      { text: 'The Eye Upon You', approaches: ['🕶️'] },
      { text: 'Spotted by Crebain', approaches: ['🕶️'] },
      { text: 'Morgul Chill', approaches: ['🐢'] },
      { text: 'Whispers of the Ring', approaches: ['🐢'] },
      { text: 'Lost in the Dark', approaches: ['🧠'] },
      { text: 'Spoiled Provisions', approaches: ['🧠'] },
    ],
    relationships: [
      'Sworn to the same quest...', 'Cousins from the Shire...', 'Shield-brothers on the wall...', 'Elf and Dwarf, unlikely friends...',
      'Master and loyal gardener...', 'Survivors of the same orc raid...', 'Raised in the same Elven house...', 'Bound by an oath to a dying king...',
      'Rivals for the same heart...', 'Saved each other in the Mines...', 'Old travelling companions...', 'Opponents in a riddle game...',
    ],
    placeAdjectives: [
      'Ruined', 'Haunted', 'Elven', 'Dwarven', 'Orc-held', 'Mist-shrouded',
      'Burning', 'Forgotten', 'Snowbound', 'Flooded', 'Ancient', 'Shadowed',
    ],

    // Lines: material, where it's from, what it's for, its flaw
    macguffins: {
      icons: base.macguffins.icons,
      cards: [
        { name: 'The One Ring', lines: ['Plain gold band', 'The fires of the mountain', 'Unmake the Dark Lord', 'Corrupts whoever carries it'] },
        { name: 'Seeing-Stone', lines: ['Dark crystal globe', 'A fallen tower', 'See what the Enemy plans', 'The Enemy looks back'] },
        { name: 'Shards of the Broken Sword', lines: ['Broken steel', 'The Last Alliance', 'Reforge a king’s blade', 'Useless until it’s reforged'] },
        { name: 'The Heart of the Mountain', lines: ['Glowing white gem', 'A dragon’s hoard', 'Claim the mountain throne', 'Drives Dwarves to greed'] },
        { name: 'Map with Moon-Letters', lines: ['Old parchment', 'A lost Dwarf king', 'Find the secret door', 'Only readable under the right moon'] },
        { name: 'Star-Glass', lines: ['Crystal phial', 'An Elf queen’s gift', 'Light in dark places', 'Draws every eye in the dark'] },
        { name: 'Elven Ring', lines: ['Band of mithril', 'The Elven-smiths', 'Keep a fading realm alive', 'Bound to the One Ring'] },
        { name: 'Horn of the Steward', lines: ['Cloven horn', 'The White City', 'Call for help from afar', 'Its call brings enemies too'] },
        { name: 'Kingsfoil', lines: ['A healing herb', 'The wild lands', 'Heal a deadly wound', 'Only a king’s hands can use it'] },
        { name: 'Captured Halfling', lines: ['A living captive', 'An orc war-band', 'Trade for safe passage', 'Knows far too much'] },
        { name: 'Dwarven Key', lines: ['Iron key', 'A lost Dwarf king', 'Open the hidden door', 'The door must still be found'] },
        { name: 'The King’s Banner', lines: ['Embroidered standard', 'The halls of a king', 'Rally the armies of Men', 'Marks you for every archer'] },
      ],
    },

    // Lines: climb, cover, pit, crossing, obstacle, hidden entry, slick, hazard, enemies
    locations: {
      icons: ['🏰', ...locationLineIcons],
      cards: [
        { name: 'Dwarven Mines', lines: ['Crumbling stair', 'Pillars of the great hall', 'Chasm in the deep', 'Narrow stone bridge', 'Collapsed tunnel', 'Secret door in the rock', 'Ancient well', 'Drums in the deep', 'Goblins'] },
        { name: 'Elven Refuge', lines: ['Silver tree-flet', 'Carved archways', 'Rushing river gorge', 'Ford of the river', 'Enchanted mist', 'Hidden valley path', 'Mossy stepping stones', 'The river in flood', 'Black Riders at the ford'] },
        { name: 'Fortress in the Gorge', lines: ['Siege ladders on the wall', 'Battlements', 'Culvert under the wall', 'The causeway', 'Barred gate', 'Caves behind the keep', 'Rain-soaked stones', 'Blast at the wall', 'An army of Uruks'] },
        { name: 'Haunted Marshes', lines: ['Rotting tree', 'Tall reeds', 'Sucking bog', 'Stepping stones', 'Fog banks', 'Hidden path through the reeds', 'Slick mud', 'Lights of the dead in the water', 'Things beneath the water'] },
        { name: 'Spider’s Lair', lines: ['Web-strung cliff', 'Webbed cocoons', 'Pit in the tunnel floor', 'Strand bridge over a gap', 'Wall of web', 'Crack into the tower', 'Slimy rock', 'Poisoned sting', 'Giant spiders'] },
        { name: 'The Fiery Mountain', lines: ['Ash-covered slope', 'Jagged rocks', 'Crack of the fire', 'Narrow ledge path', 'Lava flow', 'Side door into the mountain', 'Loose cinders', 'Eruption', 'Orc patrols'] },
      ],
    },

    // Lines: fear, goal, secret, connection
    villains: {
      icons: base.villains.icons,
      cards: [
        { name: 'The Dark Lord', lines: ['Losing the Ring forever', 'Cover all the lands in darkness', 'Their life is bound to the Ring', 'Nine wraiths on black horses'] },
        { name: 'The Fallen Wizard', lines: ['Being exposed as a traitor', 'Seize the Ring for themself', 'Envies the Grey Wizard', 'An army bred in the pits'] },
        { name: 'The Wraith-Lord', lines: ['A prophecy about who can kill them', 'Ride down the Ring-bearer', 'Once a king of Men', 'Fell beasts of the air'] },
      ],
    },
    allies: {
      icons: base.allies.icons,
      cards: [
        { name: 'The Grey Wizard', lines: ['The Ring falling to the Enemy', 'Guide the free peoples', 'Bears a ring of fire', 'The Great Eagles'] },
        { name: 'The Ranger King', lines: ['The weakness in their bloodline', 'Claim the throne of the White City', 'Loves an Elf who must stay behind', 'The Dead who broke their oath'] },
        { name: 'The Elf Lady', lines: ['Fading from the world', 'Protect the hidden realm', 'Was tempted by the Ring', 'A mirror that shows what may be'] },
      ],
    },

    situations: [
      {
        name: 'Beginning: Riders on the road',
        key: '👿🔗',
        description: 'On the road to 🏠, hooves thunder behind you: 👿 has sent 👿🔗 to take 🛠️ from you.\nA) I hide under the roots by the road until they pass 🕶️ (ℹ️)\nB) I run for the ferry before they catch me ⚡ (⌛)\nC) I stand and face them with fire and steel 💪 (🔥)',
        escalations: ['A rider sniffs the air right above your hiding place ➖🕶️', 'The ferry is on the far bank ➖⚡'],
        approaches: ['🕶️', '⚡', '💪'],
        risks: ['ℹ️', '⌛', '🔥'],
      },
      {
        name: 'Beginning: The council',
        key: '😇🔒',
        description: 'At 🏠, 😇 has called a council over 🛠️, and everyone there has a claim on it. 😇 is keeping something back: 😇🔒.\nA) I convince the council I should carry 🛠️ 📢 (⭐)\nB) I work out what 😇 isn’t telling them 🧠 (📦)\nC) I keep the peace before swords are drawn 🐢 (📏)',
        escalations: ['A Dwarf swings an axe at 🛠️ ➖🐢', 'Someone storms out, swearing to take 🛠️ by force ➖📢'],
        approaches: ['📢', '🧠', '🐢'],
        risks: ['⭐', '📦', '📏'],
      },
      {
        name: 'Middle: Drums in the deep',
        key: '🕳️',
        description: 'Deep under 🏠, the drums begin. 👿’s goblins pour out of the dark, and something worse is waking below the 🕳️.\nA) I hold the chamber door while the others run 💪 (🔥)\nB) I race for the bridge before it’s cut off ⚡ (⌛)\nC) I find the way out through the dark from memory 🧠 (📦)',
        escalations: ['A shadow of flame rises from the pit ➖⚡', 'The goblins break the door ➖💪'],
        approaches: ['💪', '⚡', '🧠'],
        risks: ['🔥', '⌛', '📦'],
      },
      {
        name: 'Middle: The spider’s tunnel',
        key: '🛠️❌',
        description: 'The only way into 🏠 is a tunnel that reeks of something old and hungry, and 🛠️ is getting harder to carry: 🛠️❌.\nA) I creep through without waking what lives there 🕶️ (ℹ️)\nB) I hold up a light and walk on, steady 🐢 (📏)\nC) I cut through the webs before they close behind me 💪 (🔥)',
        escalations: ['Someone is stung and wrapped in silk ➖🕶️', 'The light gutters out ➖🐢'],
        approaches: ['🕶️', '🐢', '💪'],
        risks: ['ℹ️', '📏', '🔥'],
      },
      {
        name: 'Middle: Siege at the gorge',
        key: '🧱',
        description: 'Night falls on 🏠, and 👿’s army fills the valley below. You have the 🧱 and not much else, and 😇 hasn’t come back.\nA) I rally the frightened defenders on the wall 📢 (⭐)\nB) I keep the gate shut however hard they hit it 🐢 (📏)\nC) I slip through the enemy lines to bring help 🕶️ (ℹ️)',
        escalations: ['A blast breaches the wall ➖🐢', 'The defenders lose heart and fall back ➖📢'],
        approaches: ['📢', '🐢', '🕶️'],
        risks: ['⭐', '📏', 'ℹ️'],
      },
      {
        name: 'Ending: The mountain of fire',
        key: '🛠️✨',
        description: '🛠️ must reach the fire at the heart of 🏠: it’s the only way to 🛠️✨. 👿’s great eye is searching for you.\nA) I keep climbing, step after step, whatever it costs 🐢 (📏)\nB) I draw 👿’s eye away with a show of force at the gates 📢 (⭐)\nC) I sneak past the patrols on the road up 🕶️ (ℹ️)',
        escalations: ['The burden grows too heavy to bear ➖🐢', 'The eye turns toward the mountain ➖🕶️'],
        approaches: ['🐢', '📢', '🕶️'],
        risks: ['📏', '⭐', 'ℹ️'],
      },
      {
        name: 'Ending: The last stand at the gate',
        key: '💀',
        description: 'Before the black gates of 🏠, the last army of the free peoples faces 👿’s endless host. 😇 is with you, and so is 🛠️.\nA) I charge into the 💀 to buy the others time 💪 (🔥)\nB) I get round their flank before the trap closes ⚡ (⌛)\nC) I bargain with 👿’s herald for one more hour 🧠 (📦)',
        escalations: ['The great host surges forward ➖💪', 'Winged shadows fill the sky ➖⚡'],
        approaches: ['💪', '⚡', '🧠'],
        risks: ['🔥', '⌛', '📦'],
      },
    ],
  };
})();
