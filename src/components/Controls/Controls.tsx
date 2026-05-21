import type { ReaderStatus } from "../../hooks/useSpeedReader";
import type { Translations } from "../../i18n/translations";

interface ControlsProps {
  status: ReaderStatus;
  wpm: number;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onWpmChange: (wpm: number) => void;
  t: Translations;
}

const WPM_PRESETS = [100, 200, 300, 500, 750] as const;
type WpmPreset = (typeof WPM_PRESETS)[number];

function handleWpmGroupKeyDown(
  e: React.KeyboardEvent<HTMLDivElement>,
  wpm: number,
  onWpmChange: (wpm: number) => void,
) {
  const idx = WPM_PRESETS.indexOf(wpm as WpmPreset);
  const safeIdx = idx >= 0 ? idx : 0;
  let nextIdx: number | null = null;

  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    nextIdx = Math.min(safeIdx + 1, WPM_PRESETS.length - 1);
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    nextIdx = Math.max(safeIdx - 1, 0);
  } else if (e.key === "Home") {
    nextIdx = 0;
  } else if (e.key === "End") {
    nextIdx = WPM_PRESETS.length - 1;
  }

  if (nextIdx !== null) {
    e.preventDefault();
    e.stopPropagation(); // prevent global ArrowLeft/Right handler
    onWpmChange(WPM_PRESETS[nextIdx]);
    const buttons = e.currentTarget.querySelectorAll<HTMLButtonElement>(
      '[role="radio"]',
    );
    buttons[nextIdx]?.focus();
  }
}

/**
 * Playback controls — ref: spritz-reader.plan.md §7, spec US-02, US-03
 */
export function Controls({
  status,
  wpm,
  onPlay,
  onPause,
  onRestart,
  onWpmChange,
  t,
}: ControlsProps) {
  const isPlaying = status === "playing";
  const isFinished = status === "finished";

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* WPM presets — radiogroup with roving tabindex */}
      <div
        className="flex items-center gap-2"
        role="radiogroup"
        aria-labelledby="wpm-group-label"
        onKeyDown={(e) => handleWpmGroupKeyDown(e, wpm, onWpmChange)}
      >
        {WPM_PRESETS.map((preset) => {
          const isActive = wpm === preset;
          return (
            <button
              key={preset}
              role="radio"
              onClick={() => onWpmChange(preset)}
              aria-label={`${preset} words per minute`}
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              className={[
                "px-3 py-1.5 rounded-md text-sm font-medium tabular-nums transition-colors",
                isActive
                  ? "bg-(--color-accent) text-white"
                  : "border border-(--color-border) text-(--color-text-muted) hover:text-(--color-text-primary) hover:border-(--color-accent)",
              ].join(" ")}
            >
              {preset}
            </button>
          );
        })}
        <span
          id="wpm-group-label"
          className="text-xs font-bold text-(--color-accent) ml-2 select-none tracking-wider"
        >
          WPM
        </span>
      </div>

      {/* Play / Pause + Restart */}
      <div className="flex items-center gap-3">
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isFinished}
          aria-label={isPlaying ? `${t.pause} (Space)` : `${t.play} (Space)`}
          className="px-10 py-3 rounded-full bg-(--color-accent) text-white
                     font-bold text-base tracking-wide
                     hover:brightness-110 active:scale-[0.97]
                     disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all duration-150"
        >
          {isPlaying ? t.pause : t.play}
        </button>
        <button
          onClick={onRestart}
          aria-label={`${t.restart} (R)`}
          className="px-6 py-3 rounded-full border border-(--color-border)
                     text-(--color-text-muted) text-sm font-medium
                     hover:border-(--color-accent) hover:text-(--color-text-primary)
                     transition-colors"
        >
          {t.restart}
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-(--color-text-muted) select-none tracking-wide">
        {t.keyboardHint}
      </p>
    </div>
  );
}
