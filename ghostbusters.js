// Ghostbusters card set: characters, places, things and scenes from the films.
// Same shape as data.js; approaches, resources, players and attribute icons are shared.
// Hand-written. To move it into the spreadsheet later, mirror these lists in a new tab.
//
// Situation text uses the shared icons as blanks: 🏠 the Location, 👿 the Villain, 😇 the Ally,
// 🛠️ the Object, and a pair for one of their lines (👿🔗 the Villain's Connection). Each choice ends
// with its approach and, in brackets, the resource it risks (the approach guards that resource).

window.GHOSTBUSTERS_DATA = (() => {
  const base = window.GAME_DATA;
  const [, ...locationLineIcons] = base.locations.icons;

  return {
    approaches: base.approaches,
    resources: base.resources,
    players: base.players,

    concepts: [
      'A Parapsychologist on Probation…',
      'A Wisecracking Ghost Hunter…',
      'A Nervous Accountant Next Door…',
      'An Engineer with Unlicensed Gear…',
      'A Cellist with a Haunted Apartment…',
      'A Late-Night Radio Psychic…',
      'A Former Firefighter…',
      'A Museum Curator…',
      'A Containment Unit Technician…',
      'A Skeptical City Inspector…',
      'A Teenage Ghost Nerd…',
      'A Ghost-Hunting Receptionist…',
    ],
    troubles: [
      '...who crossed the streams once',
      '...with a ghost that follows them home',
      '...who owes the city a fortune in fines',
      '...who gets slimed every single time',
      '...whose date is possessed by a demon',
      '...hunted by a hotel ghost with a grudge',
      '...who believes every crackpot theory',
      '...with gear that might explode',
      '...possessed on nights with a full moon',
      '...wanted by the Environmental Protection Agency',
      '...who never reads the instructions',
      '...terrified of the dark',
    ],
    // Names on the backs of the Concept and Trouble cards: first names, then family names.
    firstNames: ['Marty', 'Rosa', 'Benny', 'Lou', 'Gloria', 'Stan', 'Trish', 'Murray', 'Debbie', 'Sal', 'Nina', 'Walt'],
    lastNames: ['Kowalski', 'Feingold', 'Russo', 'Delgado', 'Pickett', 'Mahoney', 'Brodsky', 'Castellano', 'Whitlock', 'Okafor', 'Barnaby', 'Tully'],
    // Assets: things that give an edge.
    boons: [
      'Proton Pack', 'Ghost Trap', 'PKE Meter', 'Ecto Goggles', 'Slime Blower', 'Old Ambulance',
      'Spirit Guidebook', 'Thermos of Coffee', 'Walkie-Talkie', 'Flight Suit', 'Jar of Mood Slime', 'Ghost Bait',
    ],
    boonStates: [
      'Unlicensed...', 'Overheating...', 'Slime-covered...', 'Prototype...', 'Second-hand...', 'Duct-taped...',
      'Glowing...', 'Haunted...', 'Borrowed...', 'Government-issue...', 'Antique...', 'Brand-new...',
    ],
    // Liabilities: what a failed roll does to the Main player, drawn at random (one approach each,
    // each approach on two cards).
    banes: [
      { text: 'Slimed', approaches: ['⚡'] },
      { text: 'Tangled in Cables', approaches: ['⚡'] },
      { text: 'Pack Overheated', approaches: ['💪'] },
      { text: 'Sprained Back', approaches: ['💪'] },
      { text: 'Laughed at on the News', approaches: ['📢'] },
      { text: 'Lawsuit Pending', approaches: ['📢'] },
      { text: 'Glowing with Ectoplasm', approaches: ['🕶️'] },
      { text: 'Followed by a Poltergeist', approaches: ['🕶️'] },
      { text: 'Possessed for a Moment', approaches: ['🐢'] },
      { text: 'Jumpy After That Scare', approaches: ['🐢'] },
      { text: 'Lost the Manual', approaches: ['🧠'] },
      { text: 'Haunted Nightmares', approaches: ['🧠'] },
    ],
    relationships: [
      'Partners in the ghost business...', 'Roommates in a haunted walk-up...', 'Thrown out of the same university...', 'Exorcised the same apartment...',
      'Rival paranormal investigators...', 'Slimed together on day one...', 'Old firehouse buddies...', 'Co-hosts of a late-night psychic show...',
      'Survivors of the library haunting...', 'Neighbours sharing a slimy wall...', 'Ex-partners still splitting the gear...', 'Owe each other a sandwich...',
    ],
    placeAdjectives: [
      'Haunted', 'Slime-coated', 'Condemned', 'Possessed', 'Abandoned', 'Glowing',
      'Frozen-over', 'Rent-controlled', 'Ancient', 'Flooded', 'Boarded-up', 'Cursed',
    ],

    // Lines: material, where it's from, what it's for, its flaw
    macguffins: {
      icons: base.macguffins.icons,
      cards: [
        { name: 'Idol of the Destroyer', lines: ['Carved stone', 'A rooftop temple', 'Open the gate between worlds', 'Calls its master home'] },
        { name: 'Ectoplasm Sample', lines: ['Glowing pink slime', 'The sewers under the city', 'Prove ghosts are real', 'Reacts to bad moods'] },
        { name: 'Haunted Painting', lines: ['Oil on canvas', 'A museum basement', 'Trap a tyrant’s spirit', 'Its eyes follow you'] },
        { name: 'Spellbook', lines: ['Crumbling leather', 'A library’s locked stacks', 'Banish a demon', 'Some pages are missing'] },
        { name: 'Containment Grid Key', lines: ['Steel key', 'The firehouse basement', 'Shut down the grid', 'Turn it and every ghost gets out'] },
        { name: 'Full Ghost Trap', lines: ['Smoking metal box', 'Last night’s job', 'Get paid by the client', 'Rattles when you shake it'] },
        { name: 'Cursed Baby Carriage', lines: ['Antique wicker', 'A thrift store', 'Lure the ghost out', 'Rolls away on its own'] },
        { name: 'Business License', lines: ['Stamped paper', 'City Hall', 'Keep the business open', 'Expired last week'] },
        { name: 'Spirit Map of the City', lines: ['Blueprint roll', 'An architect’s secret cult', 'Find the haunting’s focal point', 'The building on it is falling down'] },
        { name: 'Possessed Toy', lines: ['Tin robot', 'A kid’s bedroom', 'Hold a trapped spirit', 'Talks at night'] },
        { name: 'Mayor’s Signature', lines: ['Ink on an order', 'The mayor’s office', 'Authorise a citywide bust', 'The mayor wants re-electing'] },
        { name: 'Ancient Clay Tablet', lines: ['Cracked clay', 'A dig in the desert', 'Read the ritual backward', 'Cracks more each night'] },
      ],
    },

    // Lines: climb, cover, pit, crossing, obstacle, hidden entry, slick, hazard, enemies
    locations: {
      icons: ['🏚️', ...locationLineIcons],
      cards: [
        { name: 'Old Firehouse', lines: ['Brass fire pole', 'Ambulance in the garage', 'Containment unit pit', 'Catwalk over the garage', 'Stacks of busted gear', 'Basement coal chute', 'Slime on the stairs', 'Overloaded containment grid', 'Escaped ghosts'] },
        { name: 'Grand Hotel', lines: ['Grand staircase', 'Room service carts', 'Laundry chute', 'Ballroom balcony', 'Banquet tables', 'Service elevator', 'Polished ballroom floor', 'Chandelier coming loose', 'A hungry green ghost'] },
        { name: 'Public Library', lines: ['Rolling ladders', 'Tall stacks of books', 'Basement archive', 'Reading room mezzanine', 'Toppled card catalogue', 'Hidden stairwell', 'Ectoplasm on the marble', 'Books flying off shelves', 'The librarian’s ghost'] },
        { name: 'Haunted Museum', lines: ['Dinosaur skeleton', 'Display cases', 'Excavation pit', 'Rope barrier walkway', 'Crates of artifacts', 'Restoration studio door', 'Waxed gallery floor', 'A painting that comes alive', 'Possessed statues'] },
        { name: 'Rooftop Temple', lines: ['Spiral stair to the roof', 'Stone dog statues', 'Crack in the roof', 'Narrow ledge', 'Locked temple doors', 'Service door on the roof', 'Rain-slick steps', 'Lightning strikes', 'Demon dogs'] },
        { name: 'Subway Tunnels', lines: ['Maintenance ladder', 'Abandoned subway car', 'Flooded platform', 'Third rail crossing', 'Collapsed tunnel', 'Sealed-off station', 'River of slime', 'Oncoming ghost train', 'Phantom commuters'] },
      ],
    },

    // Lines: fear, goal, secret, connection
    villains: {
      icons: base.villains.icons,
      cards: [
        { name: 'The Destroyer God', lines: ['Being stopped before the gate opens', 'Remake the world', 'Must take the shape mortals choose', 'Two demon dogs'] },
        { name: 'Painted Tyrant', lines: ['Being trapped on canvas forever', 'Be reborn in a child’s body', 'Weakened by the city’s good mood', 'A curator under its spell'] },
        { name: 'The City Inspector', lines: ['Being proven wrong', 'Shut the ghost business down', 'Their own building is haunted', 'The mayor’s office'] },
      ],
    },
    allies: {
      icons: base.allies.icons,
      cards: [
        { name: 'Receptionist', lines: ['The business going bust', 'Keep everyone paid and fed', 'Sees ghosts too, and hides it', 'Every phone line in the city'] },
        { name: 'Gadget Genius', lines: ['Crossing the streams', 'Prove their theories right', 'Tested the gear on themself', 'A cranky university lab'] },
        { name: 'Possessed Neighbour', lines: ['Being possessed again', 'Get their life back', 'Remembers what the demon wanted', 'A building full of nosy tenants'] },
      ],
    },

    situations: [
      {
        name: 'Beginning: The first call',
        key: '😇🔒',
        description: 'The phone rings at the firehouse: 😇 has something in their place at 🏠, and it’s not mice. 😇 is hiding something about it: 😇🔒. Do you try to:\nA) trap the ghost before it wrecks the place 💪 (🔥)\nB) calm 😇 down and find out what really happened 🐢 (📏)\nC) creep up on it with the PKE meter 🕶️ (ℹ️)',
        escalations: ['The ghost slimes everyone in the room ➖💪', 'The neighbours call the police ➖🐢'],
        approaches: ['💪', '🐢', '🕶️'],
        risks: ['🔥', '📏', 'ℹ️'],
      },
      {
        name: 'Beginning: The hotel ballroom',
        key: '🧱',
        description: 'A green ghost is eating everything in the ballroom of 🏠, and the manager wants it gone before the big dinner. It’s hiding behind the 🧱. Do you try to:\nA) catch it fast, before the guests arrive ⚡ (⌛)\nB) convince the manager the damage is worth the fee 📢 (⭐)\nC) work out a plan that doesn’t wreck the room 🧠 (📦)',
        escalations: ['The chandelier comes down ➖⚡', 'The guests start screaming to the press ➖📢'],
        approaches: ['⚡', '📢', '🧠'],
        risks: ['⌛', '⭐', '📦'],
      },
      {
        name: 'Middle: Don’t cross the streams',
        key: '🛠️❌',
        description: 'At 🏠, the ghost is wrapped round 🛠️, and the only shot means crossing the streams. Worse: 🛠️❌. Do you try to:\nA) hold your beam steady while the others aim 🐢 (📏)\nB) take the shot no one else would dare 💪 (🔥)\nC) figure out the angle that won’t end all life as we know it 🧠 (📦)',
        escalations: ['The streams spark dangerously close ➖🐢', 'The ghost splits in two ➖💪'],
        approaches: ['🐢', '💪', '🧠'],
        risks: ['📏', '🔥', '📦'],
      },
      {
        name: 'Middle: Shut down by the city',
        key: '👿🔗',
        description: '👿 has sent 👿🔗 to switch off the containment grid at 🏠, and every trapped ghost is about to get out. Do you try to:\nA) talk them out of pulling the plug 📢 (⭐)\nB) get to the grid before they flip the switch ⚡ (⌛)\nC) keep the press from finding out 🕶️ (ℹ️)',
        escalations: ['The grid blows and ghosts pour into the city ➖⚡', 'The reporters are already outside ➖🕶️'],
        approaches: ['📢', '⚡', '🕶️'],
        risks: ['⭐', '⌛', 'ℹ️'],
      },
      {
        name: 'Middle: Slime under the city',
        key: '🕳️',
        description: 'A river of slime runs under 🏠, feeding something big. To find where it goes, you have to climb down into the 🕳️. Do you try to:\nA) follow it quietly to its source 🕶️ (ℹ️)\nB) stay calm while the slime feeds on your fear 🐢 (📏)\nC) take a sample and get out before it rises 🧠 (📦)',
        escalations: ['The slime rises and turns nasty ➖🐢', 'Something in the slime notices you ➖🕶️'],
        approaches: ['🕶️', '🐢', '🧠'],
        risks: ['ℹ️', '📏', '📦'],
      },
      {
        name: 'Ending: Choose the destroyer',
        key: '👿🚩',
        description: 'On the roof of 🏠, the gate is open, and 👿 has come through to 👿🚩. Whatever you think of next is the shape it will take. Do you try to:\nA) clear your mind and think of nothing at all 🐢 (📏)\nB) blast it back through the gate with everything you’ve got 💪 (🔥)\nC) dive for 🛠️ before the gate opens wider ⚡ (⌛)',
        escalations: ['A giant figure stomps across the city ➖🐢', 'The roof starts to crumble ➖⚡'],
        approaches: ['🐢', '💪', '⚡'],
        risks: ['📏', '🔥', '⌛'],
      },
      {
        name: 'Ending: Good vibrations',
        key: '💀',
        description: '👿 has wrapped 🏠 in a shell of slime, and the 💀 are pouring out into the streets. Only the whole city’s good mood can break the shell. Do you try to:\nA) get the crowd singing 📢 (⭐)\nB) fight through the 💀 before the shell hardens 💪 (🔥)\nC) work out where the shell is weakest 🧠 (📦)',
        escalations: ['The crowd turns ugly and the slime grows ➖📢', 'The shell closes behind you ➖💪'],
        approaches: ['📢', '💪', '🧠'],
        risks: ['⭐', '🔥', '📦'],
      },
    ],
  };
})();
