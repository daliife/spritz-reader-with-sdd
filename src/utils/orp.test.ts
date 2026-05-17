import { describe, it, expect } from "vitest";
import { getOrpIndex, splitWordAtOrp } from "./orp";

describe("getOrpIndex", () => {
  it("returns 0 for a 1-character word", () => {
    expect(getOrpIndex("I")).toBe(0);
  });

  it("returns 1 for 2-character words", () => {
    expect(getOrpIndex("is")).toBe(1);
  });

  it("returns 1 for 5-character words", () => {
    expect(getOrpIndex("hello")).toBe(1);
  });

  it("returns 2 for 6-character words", () => {
    expect(getOrpIndex("spritz")).toBe(2);
  });

  it("returns 2 for 9-character words", () => {
    expect(getOrpIndex("beautiful")).toBe(2);
  });

  it("returns 3 for 10-character words", () => {
    expect(getOrpIndex("abcdefghij")).toBe(3);
  });

  it("returns 3 for 13-character words", () => {
    expect(getOrpIndex("extraordinary")).toBe(3);
  });

  it("returns 4 for 14-character words", () => {
    expect(getOrpIndex("extraordinarily")).toBe(4);
  });

  it("returns 4 for very long words", () => {
    expect(getOrpIndex("internationalization")).toBe(4);
  });
});

describe("splitWordAtOrp", () => {
  it("returns empty parts for an empty string", () => {
    expect(splitWordAtOrp("")).toEqual({ left: "", pivot: "", right: "" });
  });

  it("correctly splits a 1-character word", () => {
    expect(splitWordAtOrp("I")).toEqual({ left: "", pivot: "I", right: "" });
  });

  it("correctly splits a 4-character word (ORP = 1)", () => {
    // "Your" → left='Y', pivot='o', right='ur'
    expect(splitWordAtOrp("Your")).toEqual({
      left: "Y",
      pivot: "o",
      right: "ur",
    });
  });

  it("correctly splits an 8-character word (ORP = 2)", () => {
    // "reading" (7 chars) → ORP = 2 → left='re', pivot='a', right='ding'
    expect(splitWordAtOrp("reading")).toEqual({
      left: "re",
      pivot: "a",
      right: "ding",
    });
  });

  it("correctly splits a 12-character word (ORP = 3)", () => {
    // "spectacularly" (13 chars) → ORP = 3 → left='spe', pivot='c', right='tacularly'
    expect(splitWordAtOrp("spectacularly")).toEqual({
      left: "spe",
      pivot: "c",
      right: "tacularly",
    });
  });

  it("correctly splits a 15-character word (ORP = 4)", () => {
    // "extraordinarily" (15 chars) → ORP = 4 → left='extr', pivot='a', right='ordinarily'
    expect(splitWordAtOrp("extraordinarily")).toEqual({
      left: "extr",
      pivot: "a",
      right: "ordinarily",
    });
  });
});
