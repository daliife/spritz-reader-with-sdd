import { useState } from "react";
import { DEMO_TEXT } from "../../data/demoText";

interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
  onUseDemo: () => void;
}

/**
 * Text input panel — ref: spritz-reader.plan.md §7, spec US-05, US-06
 */
export function TextInput({ value, onChange, onUseDemo }: TextInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDemo = value === DEMO_TEXT;

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls="text-input-panel"
        className="text-sm text-[--color-text-muted] hover:text-[--color-text-primary]
                   underline underline-offset-2 transition-colors"
      >
        {isOpen ? "Hide text panel ↑" : "Change text ↓"}
      </button>

      {isOpen && (
        <div id="text-input-panel" className="mt-3 flex flex-col gap-2">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={5}
            placeholder="Paste your own text here…"
            aria-label="Custom reading text"
            className="w-full rounded border border-[--color-border] bg-[--color-surface]
                       text-[--color-text-primary] text-sm p-3 resize-y
                       placeholder:text-[--color-text-muted]
                       focus:border-[--color-accent] outline-none transition-colors"
          />
          <div className="flex justify-end">
            <button
              onClick={onUseDemo}
              disabled={isDemo}
              aria-label="Reset to built-in demo text"
              className="text-xs text-[--color-text-muted] hover:text-[--color-accent]
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Use demo text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
