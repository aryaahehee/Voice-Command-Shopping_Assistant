/**
 * NLP utility helpers shared across services.
 */

/** Normalise an item name: lowercase, trim, remove plural 's' for common words */
export function normaliseItemName(name: string): string {
  const lower = name.toLowerCase().trim().replace(/\s+/g, " ");

  // Common irregular plurals
  const irregulars: Record<string, string> = {
    tomatoes: "tomato",
    potatoes: "potato",
    children: "child",
    leaves: "leaf",
    loaves: "loaf",
    knives: "knife",
    shelves: "shelf",
    lives: "life",
  };
  if (irregulars[lower]) return irregulars[lower];

  // Simple suffix rules
  if (lower.endsWith("ies") && lower.length > 4) {
    return lower.slice(0, -3) + "y"; // berries → berry
  }
  if (lower.endsWith("es") && lower.length > 4 && !lower.endsWith("ses")) {
    return lower.slice(0, -2); // peaches → peach (approx)
  }
  if (lower.endsWith("s") && lower.length > 3 && !lower.endsWith("ss")) {
    return lower.slice(0, -1); // apples → apple
  }
  return lower;
}

/** Capitalise the first letter of each word */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Extract a number from a phrase including word-numbers */
export function extractNumber(phrase: string): number | undefined {
  const wordMap: Record<string, number> = {
    a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, dozen: 12, half: 0.5, quarter: 0.25,
  };
  const lower = phrase.toLowerCase().trim();
  if (wordMap[lower] !== undefined) return wordMap[lower];
  const numeric = parseFloat(lower);
  return isNaN(numeric) ? undefined : numeric;
}
