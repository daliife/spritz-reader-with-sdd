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
        "relative flex items-center justify-center w-full h-44 md:h-64 overflow-hidden bg-(--color-surface)",
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
                e.stopPropagation(); // prevent global Space handler double-firing
                onTogglePlay();
              }
            }
          : undefined
      }
    >
      {/* Vertical focal guide */}
      <div
        className={[
          "absolute top-0 bottom-0 w-0.5 bg-(--color-accent) transition-opacity duration-300",
          status === "playing"
            ? "opacity-100"
            : status === "paused"
              ? "opacity-50"
              : "opacity-20",
        ].join(" ")}
        aria-hidden="true"
      />

      {status === "idle" && (
        <div className="flex flex-col items-center gap-3 select-none">
          {/* Pulsing play icon */}
          <div
            className="relative flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-(--color-accent) flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 md:w-7 md:h-7"
                fill="white"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <span className="text-sm font-semibold text-(--color-accent) tracking-wide">
            {t.idlePlaceholder}
          </span>
        </div>
      )}

      {/* Paused hint — bottom-right corner */}
      {status === "paused" && (
        <div
          className="absolute bottom-3 right-3 pointer-events-none"
          aria-hidden="true"
        >
          <span className="flex items-center gap-1 text-xs text-(--color-text-muted)">
            <svg
              viewBox="0 0 24 24"
              width="10"
              height="10"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            {t.clickToResume}
          </span>
        </div>
      )}

      {/* Playing hint — always visible, bottom-right corner */}
      {status === "playing" && (
        <div
          className="absolute bottom-3 right-3 pointer-events-none"
          aria-hidden="true"
        >
          <span className="flex items-center gap-1 text-xs text-(--color-text-muted)">
            <svg
              viewBox="0 0 24 24"
              width="10"
              height="10"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
            {t.clickToPause}
          </span>
        </div>
      )}

      {(status === "playing" ||
        status === "paused" ||
        status === "finished") && (
        <span
          className="absolute top-1/2 font-mono text-6xl md:text-8xl font-bold select-none whitespace-nowrap"
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
