import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSpeedReader } from "./useSpeedReader";

// Freeze fake timers to control setInterval
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const TEXT = "one two three four five";

describe("useSpeedReader", () => {
  it("starts in idle state", () => {
    const { result } = renderHook(() => useSpeedReader(TEXT));
    expect(result.current.status).toBe("idle");
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.words).toHaveLength(5);
  });

  it("transitions to playing on play()", () => {
    const { result } = renderHook(() => useSpeedReader(TEXT));
    act(() => result.current.play());
    expect(result.current.status).toBe("playing");
  });

  it("transitions to paused on pause()", () => {
    const { result } = renderHook(() => useSpeedReader(TEXT));
    act(() => result.current.play());
    act(() => result.current.pause());
    expect(result.current.status).toBe("paused");
  });

  it("advances words while playing", () => {
    const { result } = renderHook(() => useSpeedReader(TEXT, 300));
    act(() => result.current.play());
    // 300 WPM → 200ms per word; advance 2 words
    act(() => vi.advanceTimersByTime(400));
    expect(result.current.currentIndex).toBeGreaterThan(0);
  });

  it("transitions to finished after last word", () => {
    const { result } = renderHook(() => useSpeedReader(TEXT, 600));
    act(() => result.current.play());
    // 600 WPM → 100ms per word; 5 words × 100ms = 500ms
    act(() => vi.advanceTimersByTime(600));
    expect(result.current.status).toBe("finished");
  });

  it("resets to idle on restart()", () => {
    const { result } = renderHook(() => useSpeedReader(TEXT, 600));
    act(() => result.current.play());
    act(() => vi.advanceTimersByTime(300));
    act(() => result.current.restart());
    expect(result.current.status).toBe("idle");
    expect(result.current.currentIndex).toBe(0);
  });

  it("updates wpm via setWpm()", () => {
    const { result } = renderHook(() => useSpeedReader(TEXT));
    act(() => result.current.setWpm(500));
    expect(result.current.wpm).toBe(500);
  });

  it("clamps wpm to minimum (100)", () => {
    const { result } = renderHook(() => useSpeedReader(TEXT));
    act(() => result.current.setWpm(50));
    expect(result.current.wpm).toBe(100);
  });

  it("clamps wpm to maximum (1000)", () => {
    const { result } = renderHook(() => useSpeedReader(TEXT));
    act(() => result.current.setWpm(9999));
    expect(result.current.wpm).toBe(1000);
  });

  it("restarts automatically when text changes", () => {
    let text = TEXT;
    const { result, rerender } = renderHook(() => useSpeedReader(text, 600));
    act(() => result.current.play());
    act(() => vi.advanceTimersByTime(300));
    // Change text
    text = "new text here";
    rerender();
    expect(result.current.status).toBe("idle");
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.words).toHaveLength(3);
  });
});
