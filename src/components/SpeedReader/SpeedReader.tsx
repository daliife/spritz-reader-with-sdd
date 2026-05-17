import { splitWordAtOrp } from "../../utils/orp";
import type { ReaderStatus } from "../../hooks/useSpeedReader";
import type { Translations } from '../../i18n/translations'

interface SpeedReaderProps {
  word: string
  status: ReaderStatus
  t: Translations
}

/**
 * SpeedReader display — ref: spritz-reader.plan.md §7, spec US-01
 * Renders a word split into left / ORP pivot (accent) / right.
 * A vertical focal guide line marks the ORP position.
 */
export function SpeedReader({ word, status, t }: SpeedReaderProps) {
  const { left, pivot, right } = splitWordAtOrp(word);

  return (
    <div
      className="relative flex items-center justify-center w-full h-44 overflow-hidden bg-(--color-surface)"
      role="region"
      aria-label="Speed reader display"
      aria-live="off"
    >
      {/* Vertical focal guide */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-(--color-accent) opacity-40"
        aria-hidden="true"
      />

      {status === 'idle' && (
        <span className="text-(--color-text-muted) text-base select-none">
          {t.idlePlaceholder}
        </span>
      )}

      {status === 'finished' && (
        <span className="text-(--color-text-muted) text-base select-none">
          {t.finishedMessage}
        </span>
      )}

      {(status === 'playing' || status === 'paused') && (
        <span
          className="font-mono text-6xl font-bold tracking-wide select-none"
          aria-label={word}
        >
          <span className="text-(--color-text-primary)">{left}</span>
          <span className="text-(--color-accent)">{pivot}</span>
          <span className="text-(--color-text-primary)">{right}</span>
        </span>
      )}
    </div>
  )
}
