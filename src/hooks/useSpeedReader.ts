import { useCallback, useEffect, useRef, useState } from "react";
import { parseText } from "../utils/textParser";

/**
 * Speed reader state machine — ref: spritz-reader.plan.md §5
 *
 * States: idle → playing ↔ paused → finished
 *         any state → idle  (via restart)
 */

export type ReaderStatus = "idle" | "playing" | "paused" | "finished";

export interface UseSpeedReaderReturn {
  words: string[];
  currentIndex: number;
  currentWord: string;
  wpm: number;
  status: ReaderStatus;
  play: () => void;
  pause: () => void;
  restart: () => void;
  setWpm: (wpm: number) => void;
}

const WPM_MIN = 100;
const WPM_MAX = 1000;

export function useSpeedReader(
  text: string,
  initialWpm = 300,
): UseSpeedReaderReturn {
  const [words, setWords] = useState<string[]>(() => parseText(text));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wpm, setWpmState] = useState(initialWpm);
  const [status, setStatus] = useState<ReaderStatus>("idle");

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // indexRef is the authoritative tracker updated synchronously INSIDE the
  // interval callback — NOT synced from state — so consecutive ticks within
  // the same React act() batch always see the latest value.
  const indexRef = useRef(0);
  // These refs are synced from state on every render (safe to read in callbacks)
  const wordsRef = useRef(words);
  const statusRef = useRef(status);

  wordsRef.current = words;
  statusRef.current = status;

  // Re-parse and restart when source text changes
  useEffect(() => {
    const parsed = parseText(text);
    setWords(parsed);
    wordsRef.current = parsed;
    indexRef.current = 0;
    setCurrentIndex(0);
    setStatus("idle");
    clearInterval(intervalRef.current ?? undefined);
    intervalRef.current = null;
  }, [text]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback(
    (wpmValue: number) => {
      stopInterval();
      const delay = Math.round(60_000 / wpmValue);
      intervalRef.current = setInterval(() => {
        const nextIndex = indexRef.current + 1;
        if (nextIndex >= wordsRef.current.length) {
          indexRef.current = wordsRef.current.length - 1;
          setCurrentIndex(wordsRef.current.length - 1);
          setStatus("finished");
          stopInterval();
        } else {
          indexRef.current = nextIndex;
          setCurrentIndex(nextIndex);
        }
      }, delay);
    },
    [stopInterval],
  );

  const play = useCallback(() => {
    if (statusRef.current === "finished") return;
    setStatus("playing");
    startInterval(wpm);
  }, [startInterval, wpm]);

  const pause = useCallback(() => {
    setStatus("paused");
    stopInterval();
  }, [stopInterval]);

  const restart = useCallback(() => {
    stopInterval();
    indexRef.current = 0;
    setCurrentIndex(0);
    setStatus("idle");
  }, [stopInterval]);

  const setWpm = useCallback(
    (newWpm: number) => {
      const clamped = Math.min(WPM_MAX, Math.max(WPM_MIN, newWpm));
      setWpmState(clamped);
      // If currently playing, restart the interval at the new speed immediately
      if (statusRef.current === "playing") {
        startInterval(clamped);
      }
    },
    [startInterval],
  );

  // Cleanup on unmount
  useEffect(() => () => stopInterval(), [stopInterval]);

  const currentWord = words[currentIndex] ?? "";

  return {
    words,
    currentIndex,
    currentWord,
    wpm,
    status,
    play,
    pause,
    restart,
    setWpm,
  };
}
