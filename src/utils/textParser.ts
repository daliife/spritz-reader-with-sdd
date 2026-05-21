/**
 * Text parser — ref: spritz-reader.plan.md §4
 *
 * Splits a raw string into an array of word tokens.
 * Punctuation attached to a word is preserved as part of the token.
 */

export function parseText(raw: string): string[] {
  return raw
    .split(/\s+/)
    .flatMap((w) => w.split(/[-\u2013\u2014]+/))
    .filter((w) => w.length > 0);
}
