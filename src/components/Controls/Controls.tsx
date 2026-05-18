import type { ReaderStatus } from "../../hooks/useSpeedReader";
import type { Translations } from "../../i18n/translations";

interface ControlsProps {
  status: ReaderStatus;
  wpm: number;
  onPlay: () => void;
  onPause: () => void;
  onWpmChange: (wpm: number) => void;
  t: Translations;
}

const WPM_PRESETS = [150, 250, 350, 500, 750] as const;

/**
 * Playback controls — ref: spritz-reader.plan.md §7, spec US-02, US-03
 */
export function Controls({
  status,
  wpm,
  onPlay,
  onPause,
  onWpmChange,
  t,
}: ControlsProps) {
  const isPlaying = status === "playing";
  const isFinished = status === "finished";

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* WPM presets */}
      <div
        className="flex items-center gap-2"
        role="group"
        aria-label="Reading speed presets"
      >
        {WPM_PRESETS.map((preset) => {
          const isActive = wpm === preset;
          return (
            <button
              key={preset}
              onClick={() => onWpmChange(preset)}
              aria-label={`${preset} words per minute`}
              aria-pressed={isActive}
              className={[
                "px-3 py-1.5 rounded-md text-xs font-medium tabular-nums transition-colors",
                isActive
                  ? "bg-(--color-accent) text-white"
                  : "border border-(--color-border) text-(--color-text-muted) hover:text-(--color-text-primary) hover:border-(--color-accent)",
              ].join(" ")}
            >
              {preset}
            </button>
          );
        })}
        <span className="text-xs text-(--color-text-muted) ml-1 select-none">
          WPM
        </span>
      </div>

      {/* Play / Pause */}
      <div className="flex items-center gap-5">
        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isFinished}
          aria-label={isPlaying ? `${t.pause} (Space)` : `${t.play} (Space)`}
          className="px-9 py-2.5 rounded-full bg-(--color-accent) text-white
                     font-semibold text-sm tracking-wide
                     hover:brightness-110 active:scale-[0.97]
                     disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all duration-150"
        >
          {isPlaying ? t.pause : t.play}
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-(--color-text-muted) select-none tracking-wide">
        {t.keyboardHint}
      </p>
    </div>
  );
}
