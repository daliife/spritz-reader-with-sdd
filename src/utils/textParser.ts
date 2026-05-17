/**
 * Text parser — ref: spritz-reader.plan.md §4
 *
 * Splits a raw string into an array of word tokens.
 * Punctuation attached to a word is preserved as part of the token.
 */

export function parseText(raw: string): string[] {
  return raw.split(/\s+/).filter((w) => w.length > 0);
}
