export function generate(n: number) {
  const total = n * --n + 1;
  const inputs = emojis.slice(0, total);
  return createCards(inputs, n);
}

// `inputs` is an array of (prime * (prime + 1) + 1) values.
// eg. a list of images (['file1.png', 'img2.png'...])
function createCards(inputs: string[], prime: number) {
  let cards: string[][] = [];

  // Split inputs into multi-dim array of length prime.
  while (inputs.length) cards.push(inputs.splice(0, prime));

  // `last` is the `angle` for horizontal (ie. the original) rows.
  let last = cards.pop()![0]!;
  cards.map((i) => i.push(last));

  // The last row of pictures is used to match sets of cards which have the same angle.
  let angles = cards[cards.length - 1];

  // The `angle` is the amount we move to the right on each row to create a set.
  // Cards with the same angle will not overlap, so they are given the corresponding card from the last row.
  for (let angle = 0; angle < prime; angle++) {
    for (let start = 0; start < prime; start++) {
      let row: string[] = [];
      for (let col = 0; col < prime; col++) {
        let inc = (col * angle + start) % prime;
        row.push(cards[col]![inc]!);
      }
      cards.push([...row, angles![angle]!]);
    }
  }

  return cards;
}

const emojis = [
  "🦵",
  "🦾",
  "🍕",
  "🚟",
  "👑",
  "🚧",
  "🔐",
  "🌗",
  "🐒",
  "📻",
  "🔴",
  "🌖",
  "💖",
  "🧝",
  "⛺",
  "📉",
  "🧂",
  "🦟",
  "🎏",
  "🗼",
  "🕕",
  "🙅",
  "🤸",
  "🚝",
  "🧜",
  "🍁",
  "🚊",
  "🔦",
  "🐁",
  "🧲",
  "🧃",
  "💕",
  "👏",
  "🌀",
  "🎄",
  "🔶",
  "🧼",
  "🦑",
  "🍠",
  "👎",
  "🌁",
  "🍀",
  "🚬",
  "👭",
  "🍏",
  "😾",
  "👅",
  "📯",
  "👗",
  "👰",
  "🚥",
  "🙆",
  "🐅",
  "🥚",
  "💚",
  "📮",
  "🎦",
];
