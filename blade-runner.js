// Blade Runner card set: characters, places, things and scenes from the films.
// Same shape as data.js; approaches, resources, players and attribute icons are shared.
// Hand-written. To move it into the spreadsheet later, mirror these lists in a new tab.
//
// Situation text uses the shared icons as blanks: 🏠 the Location, 👿 the Villain, 😇 the Ally,
// 🛠️ the Object, and a pair for one of their lines (👿🔗 the Villain's Connection). Each choice ends
// with its approach and, in brackets, the resource it risks (the approach guards that resource).

window.BLADE_RUNNER_DATA = (() => {
  const base = window.GAME_DATA;
  const [, ...locationLineIcons] = base.locations.icons;

  return {
    approaches: base.approaches,
    resources: base.resources,
    players: base.players,

    concepts: [
      'A Burned-Out Blade Runner…',
      'A Replicant on the Run…',
      'A Street Vendor Who Hears Everything…',
      'A Genetic Designer…',
      'An Off-World Colony Recruiter…',
      'A Memory Maker…',
      'A Rookie Spinner Cop…',
      'A Nightclub Snake Dancer…',
      'A Corporate Fixer…',
      'A Synthetic Animal Breeder…',
      'A Black-Market Surgeon…',
      'A Rooftop Squatter…',
    ],
    troubles: [
      '...who might be a replicant',
      '...with only four years to live',
      '...whose memories were implanted',
      '...who owes the corporation everything',
      '...who retired the wrong person once',
      '...haunted by a dream of a unicorn',
      '...who drinks to forget',
      '...hunted by a rival blade runner',
      '...with no papers in the city',
      '...who fell in love with a replicant',
      '...still loyal to a dead creator',
      '...who failed the empathy test',
    ],
    // Names on the backs of the Concept and Trouble cards: first names, then family names.
    firstNames: ['Rhea', 'Dax', 'Mika', 'Kaz', 'Sela', 'Ivo', 'Juno', 'Tycho', 'Lena', 'Rook', 'Nova', 'Vera'],
    lastNames: ['Kurosawa', 'Okonkwo', 'Mendez', 'Halvorsen', 'Ishikawa', 'Petrov', 'Lindgren', 'Moreau', 'Abara', 'Novak', 'Reyes', 'Takeda'],
    // Assets: things that give an edge.
    boons: [
      'Heavy Blaster', 'Spinner', 'Empathy Test Kit', 'Photo Enhancer', 'Trench Coat', 'Fake Papers',
      'Origami Figure', 'Snake Scale', 'Light-Up Umbrella', 'Bottle of Whisky', 'Memory Chip', 'Hacking Rig',
    ],
    boonStates: [
      'Rain-soaked...', 'Police-issue...', 'Stolen...', 'Custom...', 'Second-hand...', 'Off-world...',
      'Glitching...', 'Black-market...', 'Corporate...', 'Antique...', 'Neon-lit...', 'Prototype...',
    ],
    // Liabilities: what a failed roll does to the Main player, drawn at random (one approach each,
    // each approach on two cards).
    banes: [
      { text: 'Broken Fingers', approaches: ['⚡'] },
      { text: 'Spinner Grounded', approaches: ['⚡'] },
      { text: 'Gunshot Wound', approaches: ['💪'] },
      { text: 'Out of Charges', approaches: ['💪'] },
      { text: 'Badge Suspended', approaches: ['📢'] },
      { text: 'Wanted Poster', approaches: ['📢'] },
      { text: 'Tracking Implant', approaches: ['🕶️'] },
      { text: 'Face on Every Screen', approaches: ['🕶️'] },
      { text: 'Memory Glitch', approaches: ['🐢'] },
      { text: 'Shaking Hands', approaches: ['🐢'] },
      { text: 'Corrupted Files', approaches: ['🧠'] },
      { text: 'Acid Rain Sickness', approaches: ['🧠'] },
    ],
    relationships: [
      'Partners on the force...', 'Made by the same designer...', 'Share the same implanted memory...', 'Escaped an off-world colony together...',
      'Hunter and hunted...', 'Neighbours in a crumbling tower...', 'Owe each other a life...', 'Former lovers...',
      'Rivals for the same promotion...', 'Saved each other in the rain...', 'Both on the corporation’s payroll...', 'Regulars at the same noodle bar...',
    ],
    placeAdjectives: [
      'Rain-soaked', 'Neon-lit', 'Abandoned', 'Corporate', 'Smog-choked', 'Flooded',
      'Crumbling', 'Overcrowded', 'Radioactive', 'Off-limits', 'Glittering', 'Burned-out',
    ],

    // Lines: material, where it's from, what it's for, its flaw
    macguffins: {
      icons: base.macguffins.icons,
      cards: [
        { name: 'Replicant Serial Number', lines: ['Microscopic stamp', 'A snake scale', 'Trace who made it', 'Leads back to the corporation'] },
        { name: 'Incept Date Files', lines: ['Data drive', 'The corporation’s archives', 'Learn how long you have left', 'Guarded by its makers'] },
        { name: 'The Miracle Child', lines: ['A living person', 'A hidden orphanage', 'Prove replicants can be born', 'Everyone wants to find them'] },
        { name: 'Memory Sphere', lines: ['Glass orb', 'A memory maker’s studio', 'Tell real memories from fake', 'Some memories hurt to see'] },
        { name: 'Old Photograph', lines: ['Printed photo', 'A replicant’s apartment', 'Enhance it to find a clue', 'Might be a fake'] },
        { name: 'Bone Box', lines: ['Remains in a sealed case', 'Buried under a dead tree', 'Prove what happened', 'Must stay secret'] },
        { name: 'Origami Unicorn', lines: ['Folded foil', 'A detective’s pocket', 'Show what someone knows', 'A warning, or a threat'] },
        { name: 'Off-World Ticket', lines: ['Holographic pass', 'The colony ships', 'Leave Earth forever', 'Only good for one'] },
        { name: 'Wooden Horse', lines: ['Carved toy', 'A burned-out orphanage', 'Prove a memory is real', 'Too precious to give up'] },
        { name: 'Eye Scanner Data', lines: ['Retinal scans', 'A genetic designer’s lab', 'Identify any replicant', 'The data is incomplete'] },
        { name: 'Prototype Model', lines: ['A sleeping replicant', 'A sealed vault', 'Make a new generation', 'Wakes up angry'] },
        { name: 'Synthetic Owl', lines: ['Living machine', 'The corporation’s penthouse', 'A gift that buys loyalty', 'Worth more than a life'] },
      ],
    },

    // Lines: climb, cover, pit, crossing, obstacle, hidden entry, slick, hazard, enemies
    locations: {
      icons: ['🌃', ...locationLineIcons],
      cards: [
        { name: 'Street Market', lines: ['Fire escape', 'Noodle bar stalls', 'Open sewer grate', 'Crowded footbridge', 'Stalled traffic', 'Back door of a noodle shop', 'Rain-slick pavement', 'Spinner landing nearby', 'Street gangs'] },
        { name: 'Corporate Pyramid', lines: ['Glass elevator', 'Marble columns', 'Atrium drop', 'Sky bridge', 'Security gates', 'Maintenance shaft', 'Polished floors', 'Blinding sunset glare', 'Corporate security'] },
        { name: 'Abandoned Apartment Block', lines: ['Iron staircase', 'Mannequins and toys', 'Collapsed floor', 'Broken balcony', 'Piles of junk', 'Hole in the wall', 'Dripping water', 'Rotting ceiling', 'A replicant in the dark'] },
        { name: 'Snake Pit Nightclub', lines: ['Stage scaffolding', 'Dancing crowd', 'Orchestra pit', 'Bar along the balcony', 'Bouncers at the door', 'Dressing room exit', 'Spilled drinks', 'Strobe lights', 'The owner’s thugs'] },
        { name: 'Wasteland Junkyard', lines: ['Mountains of scrap', 'Rusted hulls', 'Pit of molten metal', 'Cable bridge', 'Crashed spinner', 'Tunnel under the scrap', 'Oily mud', 'Scavengers’ traps', 'Scavenger gangs'] },
        { name: 'Sea Wall', lines: ['Wall ladders', 'Concrete pylons', 'Crashing surf below', 'Top of the wall', 'Floodgates', 'Drain outlet', 'Spray-soaked concrete', 'Giant waves', 'Corporate enforcers'] },
      ],
    },

    // Lines: fear, goal, secret, connection
    villains: {
      icons: base.villains.icons,
      cards: [
        { name: 'The Corporate Genius', lines: ['Their creations failing', 'Build an army of new replicants', 'Can’t create life on their own', 'A deadly replicant enforcer'] },
        { name: 'The Replicant Leader', lines: ['Their time running out', 'Make their maker give them more life', 'Will save a life when it matters', 'A loyal band of escaped replicants'] },
        { name: 'The Police Chief', lines: ['A scandal going public', 'Keep order at any cost', 'Covering up a replicant birth', 'Every blade runner in the city'] },
      ],
    },
    allies: {
      icons: base.allies.icons,
      cards: [
        { name: 'The Old Blade Runner', lines: ['Being found by the corporation', 'Protect a child they never met', 'Fathered a replicant’s child', 'A dog in an abandoned casino'] },
        { name: 'Memory Maker', lines: ['The outside world', 'Give others a happy memory', 'Their own memories are real', 'A sealed, sterile dome'] },
        { name: 'The Hologram', lines: ['Being switched off', 'Be someone real for you', 'Was sold to a million others', 'Every advertising screen in the city'] },
      ],
    },

    situations: [
      {
        name: 'Beginning: The empathy test',
        key: '😇🔒',
        description: 'In a dim office at 🏠, you have to give 😇 the empathy test. 😇 is hiding something: 😇🔒.\nA) I ask the questions slowly and watch their eyes 🐢 (📏)\nB) I catch the lie before they reach for a gun ⚡ (⌛)\nC) I read the results without tipping them off 🕶️ (ℹ️)',
        escalations: ['They pull a gun under the table ➖⚡', 'Your hands start shaking ➖🐢'],
        approaches: ['🐢', '⚡', '🕶️'],
        risks: ['📏', '⌛', 'ℹ️'],
      },
      {
        name: 'Beginning: Noodle bar stakeout',
        key: '🚪',
        description: 'Rain hammers 🏠. A contact says 🛠️ changes hands tonight, through the 🚪, and 👿’s people are already watching.\nA) I blend in and wait for the handoff 🕶️ (ℹ️)\nB) I bargain with the vendor who knows who’s selling 🧠 (📦)\nC) I flash my badge and take charge 📢 (⭐)',
        escalations: ['Someone spots your badge ➖🕶️', 'The vendor’s price goes up ➖🧠'],
        approaches: ['🕶️', '🧠', '📢'],
        risks: ['ℹ️', '📦', '⭐'],
      },
      {
        name: 'Middle: Enhance',
        key: '🛠️📍',
        description: 'Back at 🏠, you run 🛠️ through the photo enhancer. The trail leads to where it came from: 🛠️📍.\nA) I zoom in on every corner until I find the clue 🧠 (📦)\nB) I get there before 👿 does ⚡ (⌛)\nC) I keep the find off the police records 🕶️ (ℹ️)',
        escalations: ['The file corrupts as you watch ➖🧠', '👿 gets a copy too ➖⚡'],
        approaches: ['🧠', '⚡', '🕶️'],
        risks: ['📦', '⌛', 'ℹ️'],
      },
      {
        name: 'Middle: Across the rooftops',
        key: '🪜',
        description: 'The replicant bolts from 🏠, and you follow them up the 🪜 into the rain.\nA) I leap the gap between the rooftops ⚡ (⌛)\nB) I keep my nerve when they turn and wait for me 🐢 (📏)\nC) I take them down hand to hand 💪 (🔥)',
        escalations: ['Your grip slips on the wet ledge ➖⚡', 'They break your fingers ➖💪'],
        approaches: ['⚡', '🐢', '💪'],
        risks: ['⌛', '📏', '🔥'],
      },
      {
        name: 'Middle: The snake dancer',
        key: '💀',
        description: 'The snake dancer at 🏠 knows where 😇 is hiding, but the 💀 are watching her every move.\nA) I pose as a union official and get backstage 📢 (⭐)\nB) I slip through the crowd unnoticed 🕶️ (ℹ️)\nC) I stay cool when the dancer turns on me 🐢 (📏)',
        escalations: ['She runs out through the crowd ➖🕶️', 'The bouncers recognise you ➖📢'],
        approaches: ['📢', '🕶️', '🐢'],
        risks: ['⭐', 'ℹ️', '📏'],
      },
      {
        name: 'Ending: Meet your maker',
        key: '👿🔒',
        description: 'At the top of 🏠, 👿 waits behind locked doors. You know 👿’s secret: 👿🔒.\nA) I talk my way into the penthouse 📢 (⭐)\nB) I make 👿 answer for what was done 💪 (🔥)\nC) I find the guards’ blind spot 🕶️ (ℹ️)',
        escalations: ['Security locks the building down ➖🕶️', '👿 calls for help ➖📢'],
        approaches: ['📢', '💪', '🕶️'],
        risks: ['⭐', '🔥', 'ℹ️'],
      },
      {
        name: 'Ending: Tears in rain',
        key: '😇🚩',
        description: 'On the roof of 🏠, in the pouring rain, it all comes down to you and 😇. All 😇 ever wanted was to 😇🚩.\nA) I hold on as the roof gives way 💪 (🔥)\nB) I reach 😇 before their time runs out ⚡ (⌛)\nC) I let go of my anger and listen 🐢 (📏)',
        escalations: ['The roof crumbles under your feet ➖💪', 'Their time is almost out ➖⚡'],
        approaches: ['💪', '⚡', '🐢'],
        risks: ['🔥', '⌛', '📏'],
      },
      {
        name: 'Beginning: The crime scene',
        key: '🛠️💎',
        description: 'A body lies in the rain outside 🏠, and beside it, 🛠️: 🛠️💎. Someone wants this kept quiet.\nA) I bag the evidence before the cops trample it 🧠 (📦)\nB) I question the vendor who saw it all 📢 (⭐)\nC) I slip away before the press arrives 🕶️ (ℹ️)',
        escalations: ['The rain washes the clues away ➖🧠', 'A reporter snaps your picture ➖🕶️'],
        approaches: ['🧠', '📢', '🕶️'],
        risks: ['📦', '⭐', 'ℹ️'],
      },
      {
        name: 'Beginning: A ticket off-world',
        key: '😇🔗',
        description: 'An ad blimp drifts over 🏠, selling a new life off-world. 😇 says 😇🔗 can get you a ticket, if you do them a favour first.\nA) I take the job without asking questions ⚡ (⌛)\nB) I find out who the favour really helps 🕶️ (ℹ️)\nC) I haggle for a better price 🧠 (📦)',
        escalations: ['The job turns out to be a hit ➖⚡', 'The ticket price doubles ➖🧠'],
        approaches: ['⚡', '🕶️', '🧠'],
        risks: ['⌛', 'ℹ️', '📦'],
      },
      {
        name: 'Middle: The memory test',
        key: '😇👻',
        description: '😇 needs to know if their memories are real, and the only machine that can tell is in 🏠. What 😇 fears most: 😇👻.\nA) I run the test gently, one memory at a time 🐢 (📏)\nB) I break into the lab after hours 💪 (🔥)\nC) I trick the technician into helping 📢 (⭐)',
        escalations: ['😇 panics and runs ➖🐢', 'Security catches you in the lab ➖💪'],
        approaches: ['🐢', '💪', '📢'],
        risks: ['📏', '🔥', '⭐'],
      },
      {
        name: 'Middle: The spinner chase',
        key: '🌉',
        description: '👿’s people grab 😇 and take off in a spinner over 🏠. You follow, weaving under the 🌉.\nA) I fly faster than any cop would dare ⚡ (⌛)\nB) I hold steady and wait for my shot 🐢 (📏)\nC) I call in a favour to block their route 📢 (⭐)',
        escalations: ['A police spinner joins the chase ➖📢', 'Your engine starts to smoke ➖⚡'],
        approaches: ['⚡', '🐢', '📢'],
        risks: ['⌛', '📏', '⭐'],
      },
      {
        name: 'Middle: The scrap yard',
        key: '🛠️📍',
        description: 'The trail of 🛠️ leads out of the city, back to where it came from: 🛠️📍. 👿’s scavengers got there first.\nA) I dig through the wreckage for what they missed 🧠 (📦)\nB) I fight off the scavengers 💪 (🔥)\nC) I watch from cover to see who they report to 🕶️ (ℹ️)',
        escalations: ['The scavengers call for backup ➖💪', 'The wreck collapses on the find ➖🧠'],
        approaches: ['🧠', '💪', '🕶️'],
        risks: ['📦', '🔥', 'ℹ️'],
      },
      {
        name: 'Ending: The last retirement',
        key: '👿👻',
        description: 'At 🏠, you finally corner 👿, and what 👿 fears most is coming true: 👿👻.\nA) I give 👿 one chance to surrender 🐢 (📏)\nB) I end this before anyone else gets hurt 💪 (🔥)\nC) I show the whole city what 👿 has done 📢 (⭐)',
        escalations: ['👿 takes 😇 hostage ➖🐢', 'The building catches fire ➖💪'],
        approaches: ['🐢', '💪', '📢'],
        risks: ['📏', '🔥', '⭐'],
      },
      {
        name: 'Ending: The escape north',
        key: '🚪',
        description: 'The city is closing in. Your only way out of 🏠 is the 🚪, and 😇 is coming with you.\nA) I lead everyone out before the doors seal ⚡ (⌛)\nB) I wipe our trail from every camera 🕶️ (ℹ️)\nC) I trade 🛠️ for safe passage 🧠 (📦)',
        escalations: ['The doors start to seal ➖⚡', 'A police drone spots you ➖🕶️'],
        approaches: ['⚡', '🕶️', '🧠'],
        risks: ['⌛', 'ℹ️', '📦'],
      },
    ],
  };
})();
