// Film Noir situations. Replaces the `situations` list exported from the spreadsheet:
// the first four are the spreadsheet's (blanks filled in, approaches and risks kept),
// the rest are new. Copy them back into the situations tab when convenient.
//
// Symbols are filled in from the dealt cards when read aloud:
//   🏠 location   👿 villain   😇 ally   🛠️ MacGuffin
//   👿🔗 / 😇🔗 connection, 👻 fear, 🚩 goal, 🔒 secret
//   🛠️💎 material, 🛠️📍 where it's from, 🛠️✨ what it's for, 🛠️❌ its flaw
//   location features: 🪜 climb 🧱 cover 🕳️ pit 🌉 crossing 🪨 obstacle 🚪 hidden way in
//                      💦 slick ⚠️ hazard 💀 enemies
// Each choice is a goal and a danger, never a method: the Main player picks the approach.
// It ends with the approach that guards its risk (only read when rows have a fixed approach)
// and (the resource at risk); each escalation ends with the Minus die it adds (➖ + approach).
// That die is always the approach guarding one of the situation's three risks (a different one
// for each escalation), and its text says how that danger got worse.
//
// Every description names the Location (🏠), so each scene happens somewhere.
// `key` is the one Element line the situation is built around. It appears in the description,
// never in the A/B/C choices (the choices name no Element lines at all), and it must come from
// a card the description names: a location feature (🌉, 🧱…) needs 🏠, a line like 👿🔒 needs 👿.
// Its approach goes on the Scene die: +1 for characters whose Concept or Asset shows it.

window.GAME_DATA.situations = [
  // ---- From the spreadsheet ----
  {
    name: 'Ending: Disguise reveal',
    key: '😇🚩',
    description: 'As you arrive at 🏠, it is revealed that 👿 is actually 😇 in disguise. They needed 😇🚩 from 👿🔗, and the only way to get it was by pretending to be 👿. Just as this is revealed, the police arrive to arrest 👿. Do you try to:\nA) convince the cops that 😇 is on the right side of the law 📢 (⭐)\nB) get 😇 out of 🏠 before the cuffs come out ⚡ (⌛)\nC) keep the cops off 😇 without anyone getting shot 🐢 (📏)',
    escalations: [
      'One of the cops gets antsy and fires. 😇 is hit, losing blood fast, and needs a hospital ➖🐢',
      'Word reaches 👿🔗, and their muscle is already on the way through the 🚪 ➖⚡',
    ],
    approaches: ['📢', '⚡', '🐢'],
    risks: ['⭐', '⌛', '📏'],
  },
  {
    name: 'Middle: Bridge cross chase',
    key: '🌉',
    description: 'You spot 👿 in 🏠 and chase after them. To follow them, you must get over a 🌉. Do you try to:\nA) get across before 👿 reaches the far side ⚡ (⌛)\nB) get across without bringing the whole thing down 🐢 (📏)\nC) get across without losing your gear to the drop 🧠 (📦)',
    escalations: [
      'The 🌉 groans and starts to give way under your weight ➖🐢',
      '👿 reaches the far side and opens fire from behind the 🧱 ➖⚡',
    ],
    approaches: ['⚡', '🐢', '🧠'],
    risks: ['⌛', '📏', '📦'],
  },
  {
    name: 'Beginning: Shakedown at the office',
    key: '🛠️📍',
    description: '👿’s goons corner you at 🏠, looking for 🛠️. They already know it came from 🛠️📍, and they aren’t leaving empty-handed. Do you try to:\nA) send the goons away and make sure they don’t come back 💪 (🔥)\nB) convince them 🛠️ is somewhere else 🕶️ (ℹ️)\nC) keep them from tearing the place apart 🐢 (📏)',
    escalations: [
      'One of the goons pulls a switchblade ➖💪',
      'Someone hears the racket and calls the cops ➖🕶️',
    ],
    approaches: ['💪', '🕶️', '🐢'],
    risks: ['🔥', 'ℹ️', '📏'],
  },
  {
    name: 'Middle: Meeting at midnight',
    key: '👿🔗',
    description: '😇 tips you off: 👿 will be at 🏠 tonight, meeting with 👿🔗. Do you try to:\nA) find out who 👿 is meeting without being spotted 🕶️ (ℹ️)\nB) learn what they’re planning 💪 (🔥)\nC) leave 👿 knowing someone is onto them 📢 (⭐)',
    escalations: [
      'The talking stops, and every eye turns your way ➖🕶️',
      '👿 slips out through the 🚪 before you can pin them down ➖💪',
    ],
    approaches: ['🕶️', '💪', '📢'],
    risks: ['ℹ️', '🔥', '⭐'],
  },

  // ---- New ----
  {
    name: 'Beginning: The client',
    key: '🛠️📍',
    description: '😇 slides into the seat across from you at 🏠 with a story about 🛠️. It came from 🛠️📍, and now everybody wants it. Then a call comes through for you, and it’s 👿. Do you try to:\nA) figure out what 😇 isn’t telling you ⚡ (⌛)\nB) make 👿 believe you already have 🛠️ 🕶️ (ℹ️)\nC) trace where 👿 is calling from 🧠 (📦)',
    escalations: [
      'The line goes dead, and a car starts idling outside: someone is coming ➖⚡',
      '😇 finally comes clean: 😇🔒. And 👿 knows they told you ➖🕶️',
    ],
    approaches: ['⚡', '🕶️', '🧠'],
    risks: ['⌛', 'ℹ️', '📦'],
  },
  {
    name: 'Beginning: Body in the rain',
    key: '🕳️',
    description: 'A body turns up near the 🕳️ at 🏠, clutching a clue to 🛠️. The cops are five minutes out. Do you try to:\nA) find out who the victim was 🧠 (📦)\nB) find whatever the killer missed 💪 (🔥)\nC) get away with the clue without the cops placing you at the scene 🕶️ (ℹ️)',
    escalations: [
      'Sirens. The cops arrive early, flashlights sweeping the scene ➖🕶️',
      'The 💀 get there first ➖💪',
    ],
    approaches: ['🧠', '💪', '🕶️'],
    risks: ['📦', '🔥', 'ℹ️'],
  },
  {
    name: 'Beginning: Tailing a suspect',
    key: '🧱',
    description: 'You tail 👿 through the rain to 🏠. They meet someone behind the 🧱 and hand over a thick envelope. Do you try to:\nA) stay on 👿 all the way to wherever they’re going ⚡ (⌛)\nB) find out who the stranger is 🧠 (📦)\nC) get a look inside the envelope without making a scene 🐢 (📏)',
    escalations: [
      '👿 spots their tail and bolts ➖⚡',
      'A black sedan pulls up, the doors swing open, and they’re carrying ➖🐢',
    ],
    approaches: ['⚡', '🧠', '🐢'],
    risks: ['⌛', '📦', '📏'],
  },
  {
    name: 'Middle: The interrogation',
    key: '👿🔒',
    description: 'You’ve cornered one of 👿’s people in a back room at 🏠. They know where 🛠️ is, and they know 👿’s secret: 👿🔒. But they’re more afraid of 👿 than of you. Do you try to:\nA) get the location of 🛠️ out of them 💪 (🔥)\nB) make them more afraid of you than of 👿 📢 (⭐)\nC) keep them alive and talking 🐢 (📏)',
    escalations: [
      'Their lawyer shows up, waving a writ ➖📢',
      'Someone is listening at the door, and they clam up for good ➖💪',
    ],
    approaches: ['💪', '📢', '🐢'],
    risks: ['🔥', '⭐', '📏'],
  },
  {
    name: 'Middle: Over the rooftops',
    key: '🪜',
    description: '👿 bolts up the 🪜 at 🏠 with 🛠️ under one arm. Do you try to:\nA) catch 👿 before they reach the street ⚡ (⌛)\nB) get 🛠️ back in one piece 🐢 (📏)\nC) leave 👿 with nowhere left to run 💪 (🔥)',
    escalations: [
      'Your foot slips on the 💦 ➖⚡',
      '👿 kicks the 🪨 down onto you ➖🐢',
    ],
    approaches: ['⚡', '🐢', '💪'],
    risks: ['⌛', '📏', '🔥'],
  },
  {
    name: 'Middle: The double-cross',
    key: '🛠️❌',
    description: 'Back at 🏠, you get a good look at the 🛠️ you risked everything for. It has a problem: 🛠️❌. 😇 swears they didn’t know. Do you try to:\nA) find out who swapped 🛠️ 🕶️ (ℹ️)\nB) keep 😇 on your side 🧠 (📦)\nC) keep 👿 believing the deal is still on 📢 (⭐)',
    escalations: [
      '😇 slips away into the night ➖🕶️',
      '👿 finds out you’re holding a dud, and starts telling everyone ➖📢',
    ],
    approaches: ['🕶️', '🧠', '📢'],
    risks: ['ℹ️', '📦', '⭐'],
  },
  {
    name: 'Ending: The showdown',
    key: '⚠️',
    description: 'It all ends at 🏠. 👿 has 😇 at gunpoint beside the ⚠️ and wants 🛠️ in exchange. Do you try to:\nA) get 😇 away from the gun with nobody hurt 🐢 (📏)\nB) keep 🛠️ out of 👿’s hands for good 💪 (🔥)\nC) make sure everyone at 🏠 sees what 👿 really is 📢 (⭐)',
    escalations: [
      'The ⚠️ gets worse by the second, and anyone could get hurt ➖🐢',
      'The 💀 close in from the shadows ➖💪',
    ],
    approaches: ['🐢', '💪', '📢'],
    risks: ['📏', '🔥', '⭐'],
  },
  {
    name: 'Ending: Last train out',
    key: '🚪',
    description: '👿 is getting out of town tonight with 🛠️, and 😇 is going with them, whether they like it or not. You reach 🏠 as the whistle blows; the only way aboard unseen is the 🚪. Do you try to:\nA) get aboard before the train pulls out ⚡ (⌛)\nB) find 😇 before 👿 knows you’re aboard 🕶️ (ℹ️)\nC) turn 👿’s own people against them 🧠 (📦)',
    escalations: [
      'The doors slam shut, and you’re running out of time ➖⚡',
      '👿 plays their ace: 👿🔗 was in on it all along ➖🧠',
    ],
    approaches: ['⚡', '🕶️', '🧠'],
    risks: ['⌛', 'ℹ️', '📦'],
  },
];
