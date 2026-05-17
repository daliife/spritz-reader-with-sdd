import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Controls } from "./Controls";

const defaultProps = {
  status: "idle" as const,
  wpm: 300,
  onPlay: vi.fn(),
  onPause: vi.fn(),
  onRestart: vi.fn(),
  onWpmChange: vi.fn(),
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

  it("fires onWpmChange with wpm+50 when + is clicked", async () => {
    const onWpmChange = vi.fn();
    render(<Controls {...defaultProps} wpm={300} onWpmChange={onWpmChange} />);
    await userEvent.click(
      screen.getByRole("button", { name: /increase speed/i }),
    );
    expect(onWpmChange).toHaveBeenCalledWith(350);
  });

  it("fires onWpmChange with wpm-50 when − is clicked", async () => {
    const onWpmChange = vi.fn();
    render(<Controls {...defaultProps} wpm={300} onWpmChange={onWpmChange} />);
    await userEvent.click(
      screen.getByRole("button", { name: /decrease speed/i }),
    );
    expect(onWpmChange).toHaveBeenCalledWith(250);
  });

  it("disables − button at minimum WPM", () => {
    render(<Controls {...defaultProps} wpm={100} />);
    expect(
      screen.getByRole("button", { name: /decrease speed/i }),
    ).toBeDisabled();
  });

  it("disables + button at maximum WPM", () => {
    render(<Controls {...defaultProps} wpm={1000} />);
    expect(
      screen.getByRole("button", { name: /increase speed/i }),
    ).toBeDisabled();
  });

  it("disables Play button when finished", () => {
    render(<Controls {...defaultProps} status="finished" />);
    expect(screen.getByRole("button", { name: /play/i })).toBeDisabled();
  });
});
