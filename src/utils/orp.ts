/**
 * ORP (Optimal Recognition Point) utilities — ref: spritz-reader.plan.md §3
 *
 * ORP index table (0-based):
 *   length 1      → index 0
 *   length 2–5    → index 1
 *   length 6–9    → index 2
 *   length 10–13  → index 3
 *   length 14+    → index 4
 */

export function getOrpIndex(word: string): number {
  const len = word.length;
  if (len <= 1) return 0;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  if (len <= 13) return 3;
  return 4;
}

export interface WordParts {
  left: string;
  pivot: string;
  right: string;
}

export function splitWordAtOrp(word: string): WordParts {
  if (word.length === 0) return { left: "", pivot: "", right: "" };
  const idx = getOrpIndex(word);
  return {
    left: word.slice(0, idx),
    pivot: word[idx],
    right: word.slice(idx + 1),
  };
}
