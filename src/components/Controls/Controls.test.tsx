import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Controls } from "./Controls";
import type { Translations } from "../../i18n/translations";

const mockT: Translations = {
  appTagline: "Read faster, one word at a time.",
  appDescription: "Focus on the highlighted letter.",
  idlePlaceholder: "Press play to start reading",
  clickToResume: "Click to resume",
  clickToPause: "Click to pause",
  changeText: "Change text ↓",
  hideTextPanel: "Hide text panel ↑",
  textareaPlaceholder: "Paste your own text here…",
  useDemoText: "Use demo text",
  switchToLight: "Switch to light mode",
  switchToDark: "Switch to dark mode",
  wpmLabel: "WPM",
  wpmTooltip: "Words per minute",
  keyboardHint: "Space · R · ← / →",
};

const defaultProps = {
  wpm: 300,
  onWpmChange: vi.fn(),
  t: mockT,
};

describe("Controls", () => {
  it("renders all 5 WPM preset buttons", () => {
    render(<Controls {...defaultProps} />);
    for (const preset of [100, 200, 300, 500, 750]) {
      expect(
        screen.getByRole("radio", { name: `${preset} words per minute` }),
      ).toBeInTheDocument();
    }
  });

  it("marks the active preset with aria-checked=true", () => {
    render(<Controls {...defaultProps} wpm={300} />);
    expect(
      screen.getByRole("radio", { name: "300 words per minute" }),
    ).toHaveAttribute("aria-checked", "true");
    expect(
      screen.getByRole("radio", { name: "200 words per minute" }),
    ).toHaveAttribute("aria-checked", "false");
  });

  it("fires onWpmChange with the preset value when a preset is clicked", async () => {
    const onWpmChange = vi.fn();
    render(<Controls {...defaultProps} onWpmChange={onWpmChange} />);
    await userEvent.click(
      screen.getByRole("radio", { name: "500 words per minute" }),
    );
    expect(onWpmChange).toHaveBeenCalledWith(500);
  });
});
