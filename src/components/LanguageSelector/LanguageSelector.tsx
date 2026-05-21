import type { Language } from "../../hooks/useLanguage";

interface LanguageSelectorProps {
  language: Language;
  onChange: (lang: Language) => void;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ca", label: "CA" },
  { code: "es", label: "ES" },
];

/**
 * Language selector — ref: spritz-reader.plan.md §7, spec US-09
 * Segmented pill control — one button per locale.
 */
export function LanguageSelector({
  language,
  onChange,
}: LanguageSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Select language"
      className="flex h-9 items-center bg-(--color-surface) border border-(--color-border) rounded-full p-0.5 gap-0.5"
    >
      {LANGUAGES.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => onChange(code)}
          aria-label={`${label} language`}
          aria-pressed={language === code}
          className={[
            "px-3 py-2 text-xs font-semibold rounded-full transition-colors",
            language === code
              ? "bg-(--color-accent) text-white shadow-sm"
              : "text-(--color-text-muted) hover:text-(--color-text-primary)",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
