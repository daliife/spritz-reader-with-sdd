import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpeedReader } from "./SpeedReader";
import type { Translations } from "../../i18n/translations";

const mockT: Translations = {
  appTagline: "Read faster, one word at a time.",
  appDescription: "Focus on the highlighted letter.",
  idlePlaceholder: "Click to play",
  clickToResume: "Click to resume",
  clickToPause: "Click to pause",
  finishedMessage: "Finished — press restart to read again",
  play: "▶ Play",
  pause: "⏸ Pause",
  restart: "↺ Restart",
  changeText: "Change text ↓",
  hideTextPanel: "Hide text panel ↑",
  textareaPlaceholder: "Paste your own text here…",
  useDemoText: "Use demo text",
  switchToLight: "Switch to light mode",
  switchToDark: "Switch to dark mode",
  keyboardHint: "Space · R · ← / →",
};

describe("SpeedReader", () => {
  it("shows placeholder text in idle state", () => {
    render(
      <SpeedReader word="" status="idle" t={mockT} onTogglePlay={vi.fn()} />,
    );
    expect(screen.getByText(/click to play/i)).toBeInTheDocument();
  });

  it("shows completion message in finished state", () => {
    render(
      <SpeedReader
        word="done"
        status="finished"
        t={mockT}
        onTogglePlay={vi.fn()}
      />,
    );
    expect(screen.getByText(/finished/i)).toBeInTheDocument();
  });

  it("renders the word when playing", () => {
    render(
      <SpeedReader
        word="Your"
        status="playing"
        t={mockT}
        onTogglePlay={vi.fn()}
      />,
    );
    // "Your" → left='Y', pivot='o', right='ur'
    expect(screen.getByText("Y")).toBeInTheDocument();
    expect(screen.getByText("o")).toBeInTheDocument();
    expect(screen.getByText("ur")).toBeInTheDocument();
  });

  it("renders the word when paused", () => {
    render(
      <SpeedReader
        word="reading"
        status="paused"
        t={mockT}
        onTogglePlay={vi.fn()}
      />,
    );
    // "reading" → left='re', pivot='a', right='ding'
    expect(screen.getByText("re")).toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("ding")).toBeInTheDocument();
  });

  it("has the aria-label set to the current word", () => {
    render(
      <SpeedReader
        word="hello"
        status="playing"
        t={mockT}
        onTogglePlay={vi.fn()}
      />,
    );
    expect(screen.getByLabelText("hello")).toBeInTheDocument();
  });
});
