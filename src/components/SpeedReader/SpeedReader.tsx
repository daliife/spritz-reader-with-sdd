import { splitWordAtOrp } from "../../utils/orp";
import type { ReaderStatus } from "../../hooks/useSpeedReader";
import type { Translations } from "../../i18n/translations";

interface SpeedReaderProps {
  word: string;
  status: ReaderStatus;
  t: Translations;
  onTogglePlay: () => void;
}

/**
 * SpeedReader display — ref: spritz-reader.plan.md §7, spec US-01
 * Renders a word split into left / ORP pivot (accent) / right.
 * A vertical focal guide line marks the ORP position.
 */
export function SpeedReader({
  word,
  status,
  t,
  onTogglePlay,
}: SpeedReaderProps) {
  const { left, pivot, right } = splitWordAtOrp(word);
  const isInteractive = status !== "finished";

  return (
    <div
      className={[
        "relative flex items-center justify-center w-full h-44 overflow-hidden bg-(--color-surface)",
        isInteractive ? "cursor-pointer select-none" : "",
      ].join(" ")}
      role={isInteractive ? "button" : "region"}
      aria-label={
        isInteractive
          ? status === "playing"
            ? "Pause"
            : "Play"
          : "Speed reader display"
      }
      aria-live="off"
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? onTogglePlay : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                onTogglePlay();
              }
            }
          : undefined
      }
    >
      {/* Vertical focal guide */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-(--color-accent) opacity-40"
        aria-hidden="true"
      />

      {status === "idle" && (
        <span className="text-(--color-text-muted) text-base select-none">
          {t.idlePlaceholder}
        </span>
      )}

      {status === "finished" && (
        <span className="text-(--color-text-muted) text-base select-none">
          {t.finishedMessage}
        </span>
      )}

      {(status === "playing" || status === "paused") && (
        <span
          className="absolute top-1/2 font-mono text-6xl font-bold select-none whitespace-nowrap"
          style={{
            left: "50%",
            transform: `translate(calc(-${left.length}ch - 0.5ch), -50%)`,
          }}
          aria-label={word}
        >
          <span className="text-(--color-text-primary)">{left}</span>
          <span className="text-(--color-accent)">{pivot}</span>
          <span className="text-(--color-text-primary)">{right}</span>
        </span>
      )}
    </div>
  );
}
