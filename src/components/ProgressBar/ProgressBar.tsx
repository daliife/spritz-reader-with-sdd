interface ProgressBarProps {
  current: number;
  total: number;
}

/**
 * Progress bar — ref: spritz-reader.plan.md §7, spec US-04
 */
export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round(((current + 1) / total) * 100) : 0;
  const display = total > 0 ? current + 1 : 0;

  return (
    <div className="w-full flex flex-col gap-1">
      <div
        className="w-full h-1 rounded-full bg-[--color-border] overflow-hidden"
        role="progressbar"
        aria-valuenow={display}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Reading progress"
      >
        <div
          className="h-full bg-[--color-accent] transition-all duration-150"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-[--color-text-muted] text-right select-none">
        Word {display} of {total}
      </p>
    </div>
  );
}
