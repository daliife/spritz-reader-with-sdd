import { useState } from 'react'
import type { Translations } from '../../i18n/translations'

interface TextInputProps {
  value: string
  isDemo: boolean
  onChange: (text: string) => void
  onUseDemo: () => void
  t: Translations
}

/**
 * Text input panel — ref: spritz-reader.plan.md §7, spec US-05, US-06
 */
export function TextInput({ value, isDemo, onChange, onUseDemo, t }: TextInputProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls="text-input-panel"
        className="text-sm text-(--color-text-muted) hover:text-(--color-text-primary)
                   underline underline-offset-2 transition-colors"
      >
        {isOpen ? t.hideTextPanel : t.changeText}
      </button>

      {isOpen && (
        <div id="text-input-panel" className="mt-3 flex flex-col gap-2">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            placeholder={t.textareaPlaceholder}
            aria-label={t.textareaPlaceholder}
            className="w-full rounded border border-(--color-border) bg-(--color-surface)
                       text-(--color-text-primary) text-sm p-3 resize-y
                       placeholder:text-(--color-text-muted)
                       focus:border-(--color-accent) outline-none transition-colors"
          />
          <div className="flex justify-end">
            <button
              onClick={onUseDemo}
              disabled={isDemo}
              aria-label={t.useDemoText}
              className="text-xs text-(--color-text-muted) hover:text-(--color-accent)
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {t.useDemoText}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
