import { describe, it, expect } from "vitest";
import { parseText } from "./textParser";

describe("parseText", () => {
  it("returns an empty array for an empty string", () => {
    expect(parseText("")).toEqual([]);
  });

  it("returns an empty array for whitespace-only input", () => {
    expect(parseText("   ")).toEqual([]);
    expect(parseText("\n\t\r")).toEqual([]);
  });

  it("returns a single-element array for one word", () => {
    expect(parseText("hello")).toEqual(["hello"]);
  });

  it("splits a simple sentence into words", () => {
    expect(parseText("hello world")).toEqual(["hello", "world"]);
  });

  it("preserves punctuation attached to words", () => {
    expect(parseText("Hello, world!")).toEqual(["Hello,", "world!"]);
  });

  it("handles multiple consecutive spaces", () => {
    expect(parseText("one   two")).toEqual(["one", "two"]);
  });

  it("handles newlines and tabs as separators", () => {
    expect(parseText("one\ntwo\tthree")).toEqual(["one", "two", "three"]);
  });

  it("handles a realistic multi-line paragraph", () => {
    const text = "Speed reading\nis a fascinating\nskill.";
    expect(parseText(text)).toEqual([
      "Speed",
      "reading",
      "is",
      "a",
      "fascinating",
      "skill.",
    ]);
  });

  it("handles numbers as tokens", () => {
    expect(parseText("100 words per minute")).toEqual([
      "100",
      "words",
      "per",
      "minute",
    ]);
  });

  it("splits hyphenated words into separate tokens", () => {
    expect(parseText("well-known fact")).toEqual(["well", "known", "fact"]);
    expect(parseText("words-per-minute")).toEqual(["words", "per", "minute"]);
  });

  it("filters out standalone dashes (em-dash, en-dash, hyphen)", () => {
    expect(parseText("one — two")).toEqual(["one", "two"]);
    expect(parseText("one \u2013 two")).toEqual(["one", "two"]);
    expect(parseText("one - two")).toEqual(["one", "two"]);
  });

  it("splits words joined by em-dash without spaces", () => {
    expect(parseText("before\u2014after")).toEqual(["before", "after"]);
  });
});
