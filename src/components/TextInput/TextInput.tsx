import { useState } from "react";
import type { Translations } from "../../i18n/translations";

interface TextInputProps {
  value: string;
  isDemo: boolean;
  onChange: (text: string) => void;
  onUseDemo: () => void;
  t: Translations;
}

/**
 * Text input panel — ref: spritz-reader.plan.md §7, spec US-05, US-06
 */
export function TextInput({
  value,
  isDemo,
  onChange,
  onUseDemo,
  t,
}: TextInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls="text-input-panel"
        className="flex items-center gap-1.5 text-sm text-(--color-text-muted) hover:text-(--color-text-primary) transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
        {isOpen ? t.hideTextPanel : t.changeText}
      </button>

      {isOpen && (
        <div
          id="text-input-panel"
          className="mt-3 rounded-xl border border-(--color-border) bg-(--color-surface) p-3 flex flex-col gap-3"
        >
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            placeholder={t.textareaPlaceholder}
            aria-label={t.textareaPlaceholder}
            className="w-full rounded-lg border border-(--color-border) bg-(--color-bg)
                       text-(--color-text-primary) text-sm font-mono p-3 resize-y
                       placeholder:text-(--color-text-muted)
                       focus:border-(--color-accent) outline-none transition-colors"
          />
          <div className="flex justify-end">
            <button
              onClick={onUseDemo}
              disabled={isDemo}
              aria-label={t.useDemoText}
              className="text-xs px-3 py-1.5 rounded-full border border-(--color-border)
                         text-(--color-text-muted) hover:text-(--color-accent) hover:border-(--color-accent)
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {t.useDemoText}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
