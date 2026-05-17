import type { ReaderStatus } from "../../hooks/useSpeedReader";

interface ControlsProps {
  status: ReaderStatus;
  wpm: number;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onWpmChange: (wpm: number) => void;
}

const WPM_MIN = 100;
const WPM_MAX = 1000;
const WPM_STEP = 50;

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
}: ControlsProps) {
  const isPlaying = status === "playing";
  const isFinished = status === "finished";

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* WPM control */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onWpmChange(wpm - WPM_STEP)}
          disabled={wpm <= WPM_MIN}
          aria-label="Decrease speed by 50 WPM"
          className="w-8 h-8 rounded flex items-center justify-center
                     text-[--color-text-primary] bg-[--color-surface]
                     border border-[--color-border]
                     hover:border-[--color-accent] disabled:opacity-30
                     disabled:cursor-not-allowed transition-colors"
        >
          −
        </button>

        <div className="flex flex-col items-center min-w-[6rem]">
          <input
            type="range"
            min={WPM_MIN}
            max={WPM_MAX}
            step={WPM_STEP}
            value={wpm}
            onChange={(e) => onWpmChange(Number(e.target.value))}
            aria-label="Reading speed in words per minute"
            className="w-32 accent-[--color-accent]"
          />
          <span
            className="text-sm text-[--color-text-muted] mt-1"
            aria-live="polite"
          >
            {wpm} <span className="text-xs">WPM</span>
          </span>
        </div>

        <button
          onClick={() => onWpmChange(wpm + WPM_STEP)}
          disabled={wpm >= WPM_MAX}
          aria-label="Increase speed by 50 WPM"
          className="w-8 h-8 rounded flex items-center justify-center
                     text-[--color-text-primary] bg-[--color-surface]
                     border border-[--color-border]
                     hover:border-[--color-accent] disabled:opacity-30
                     disabled:cursor-not-allowed transition-colors"
        >
          +
        </button>
      </div>

      {/* Play / Pause / Restart */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRestart}
          aria-label="Restart reading from the beginning (R)"
          className="px-4 py-2 rounded border border-[--color-border]
                     text-[--color-text-muted] hover:text-[--color-text-primary]
                     hover:border-[--color-accent] transition-colors text-sm"
        >
          ↺ Restart
        </button>

        <button
          onClick={isPlaying ? onPause : onPlay}
          disabled={isFinished}
          aria-label={
            isPlaying ? "Pause reading (Space)" : "Play reading (Space)"
          }
          className="px-6 py-2 rounded bg-[--color-accent] text-white font-medium
                     hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-opacity text-sm"
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-[--color-text-muted] select-none">
        Space · R · ← / →
      </p>
    </div>
  );
}
