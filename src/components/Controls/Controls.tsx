import type { Translations } from "../../i18n/translations";

interface ControlsProps {
  wpm: number;
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
    const buttons =
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons[nextIdx]?.focus();
  }
}

/**
 * Playback controls — ref: spritz-reader.plan.md §7, spec US-02, US-03
 */
export function Controls({ wpm, onWpmChange, t }: ControlsProps) {
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {/* WPM presets — radiogroup with roving tabindex */}
      <div
        className="flex items-center gap-2 md:gap-3"
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
              aria-label={`${preset} ${t.wpmTooltip.toLowerCase()}`}
              aria-checked={isActive}
              tabIndex={isActive ? 0 : -1}
              className={[
                "px-3 py-1.5 md:px-4 md:py-2 rounded-md text-sm md:text-base font-medium tabular-nums transition-colors",
                isActive
                  ? "bg-(--color-accent) text-white"
                  : "border border-(--color-border) text-(--color-text-muted) hover:text-(--color-text-primary) hover:border-(--color-accent)",
              ].join(" ")}
            >
              {preset}
            </button>
          );
        })}
        <div className="flex items-center gap-1 ml-2">
          <span
            id="wpm-group-label"
            className="text-xs font-bold text-(--color-accent) select-none tracking-wider"
          >
            {t.wpmLabel}
          </span>
          {/* Info icon with tooltip */}
          <span className="group relative inline-flex items-center">
            <svg
              viewBox="0 0 24 24"
              width="13"
              height="13"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-(--color-text-muted) cursor-default"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md text-xs bg-(--color-surface) border border-(--color-border) text-(--color-text-muted) whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none shadow-sm z-10">
              {t.wpmTooltip}
            </span>
          </span>
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs md:text-sm text-(--color-text-muted) select-none tracking-wide">
        {t.keyboardHint}
      </p>
    </div>
  );
}
