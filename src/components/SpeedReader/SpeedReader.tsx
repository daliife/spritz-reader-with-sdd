import { splitWordAtOrp } from "../../utils/orp";
import type { ReaderStatus } from "../../hooks/useSpeedReader";

interface SpeedReaderProps {
  word: string;
  status: ReaderStatus;
}

/**
 * SpeedReader display — ref: spritz-reader.plan.md §7, spec US-01
 * Renders a word split into left / ORP pivot (accent) / right.
 * A vertical focal guide line marks the ORP position.
 */
export function SpeedReader({ word, status }: SpeedReaderProps) {
  const { left, pivot, right } = splitWordAtOrp(word);

  return (
    <div
      className="relative flex items-center justify-center w-full h-40 overflow-hidden
                 bg-[--color-surface] dark:bg-[--color-surface]
                 light:bg-[--color-surface-light]"
      role="region"
      aria-label="Speed reader display"
      aria-live="off"
    >
      {/* Vertical focal guide line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-[--color-accent] opacity-40"
        aria-hidden="true"
      />

      {status === "idle" && (
        <span className="text-[--color-text-muted] text-lg select-none">
          Press play to start reading
        </span>
      )}

      {status === "finished" && (
        <span className="text-[--color-text-muted] text-lg select-none">
          Finished — press restart to read again
        </span>
      )}

      {(status === "playing" || status === "paused") && (
        <span
          className="font-mono text-5xl md:text-6xl font-bold tracking-wide select-none"
          aria-label={word}
        >
          <span className="text-[--color-text-primary]">{left}</span>
          <span className="text-[--color-accent]">{pivot}</span>
          <span className="text-[--color-text-primary]">{right}</span>
        </span>
      )}
    </div>
  );
}
