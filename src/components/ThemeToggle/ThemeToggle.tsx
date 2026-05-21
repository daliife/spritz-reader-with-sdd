import type { Translations } from "../../i18n/translations";

type Theme = "light" | "dark";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
  t: Translations;
}

/**
 * Theme toggle button — ref: spritz-reader.plan.md §7, spec US-07
 */
export function ThemeToggle({ theme, onToggle, t }: ThemeToggleProps) {
  const isDark = theme === "dark";
  const label = isDark ? t.switchToLight : t.switchToDark;

  return (
    <button
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="w-9 h-9 rounded-full flex items-center justify-center
                 bg-(--color-surface) border border-(--color-border)
                 text-(--color-text-muted) hover:text-(--color-accent) hover:border-(--color-accent)
                 transition-colors"
    >
      {isDark ? (
        // Sun — shown in dark mode to switch to light
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="22" />
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
          <line x1="2" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="22" y2="12" />
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        // Moon — shown in light mode to switch to dark
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
