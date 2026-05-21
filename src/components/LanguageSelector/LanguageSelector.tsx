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
 * Renders a native <select> dropdown so the browser handles the picker UI.
 */
export function LanguageSelector({
  language,
  onChange,
}: LanguageSelectorProps) {
  return (
    <select
      value={language}
      onChange={(e) => onChange(e.target.value as Language)}
      aria-label="Select language"
      className="h-9 text-xs font-medium rounded-md border border-(--color-border)
                 bg-(--color-surface) text-(--color-text-muted)
                 px-2 cursor-pointer transition-colors
                 hover:border-(--color-accent) hover:text-(--color-text-primary)
                 focus:outline-none focus:border-(--color-accent)"
    >
      {LANGUAGES.map(({ code, label }) => (
        <option key={code} value={code}>
          {label}
        </option>
      ))}
    </select>
  );
}
