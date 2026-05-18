import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Controls } from "./Controls";
import type { Translations } from "../../i18n/translations";

const mockT: Translations = {
  idlePlaceholder: "Press play to start reading",
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

const defaultProps = {
  status: "idle" as const,
  wpm: 350,
  onPlay: vi.fn(),
  onPause: vi.fn(),
  onRestart: vi.fn(),
  onWpmChange: vi.fn(),
  t: mockT,
};

describe("Controls", () => {
  it("renders the Play button when not playing", () => {
    render(<Controls {...defaultProps} />);
    expect(screen.getByRole("button", { name: /play/i })).toBeInTheDocument();
  });

  it("renders the Pause button when playing", () => {
    render(<Controls {...defaultProps} status="playing" />);
    expect(screen.getByRole("button", { name: /pause/i })).toBeInTheDocument();
  });

  it("fires onPlay when Play is clicked", async () => {
    const onPlay = vi.fn();
    render(<Controls {...defaultProps} onPlay={onPlay} />);
    await userEvent.click(screen.getByRole("button", { name: /play/i }));
    expect(onPlay).toHaveBeenCalledOnce();
  });

  it("fires onPause when Pause is clicked", async () => {
    const onPause = vi.fn();
    render(<Controls {...defaultProps} status="playing" onPause={onPause} />);
    await userEvent.click(screen.getByRole("button", { name: /pause/i }));
    expect(onPause).toHaveBeenCalledOnce();
  });

  it("fires onRestart when Restart is clicked", async () => {
    const onRestart = vi.fn();
    render(<Controls {...defaultProps} onRestart={onRestart} />);
    await userEvent.click(screen.getByRole("button", { name: /restart/i }));
    expect(onRestart).toHaveBeenCalledOnce();
  });

  it("renders all 5 WPM preset buttons", () => {
    render(<Controls {...defaultProps} />);
    for (const preset of [150, 250, 350, 500, 750]) {
      expect(
        screen.getByRole("button", { name: `${preset} words per minute` }),
      ).toBeInTheDocument();
    }
  });

  it("marks the active preset with aria-pressed=true", () => {
    render(<Controls {...defaultProps} wpm={350} />);
    expect(
      screen.getByRole("button", { name: "350 words per minute" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "250 words per minute" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("fires onWpmChange with the preset value when a preset is clicked", async () => {
    const onWpmChange = vi.fn();
    render(<Controls {...defaultProps} onWpmChange={onWpmChange} />);
    await userEvent.click(
      screen.getByRole("button", { name: "500 words per minute" }),
    );
    expect(onWpmChange).toHaveBeenCalledWith(500);
  });

  it("disables Play button when finished", () => {
    render(<Controls {...defaultProps} status="finished" />);
    expect(screen.getByRole("button", { name: /play/i })).toBeDisabled();
  });
});
