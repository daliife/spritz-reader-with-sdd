import type { Translations } from '../../i18n/translations'

type Theme = 'light' | 'dark'

interface ThemeToggleProps {
  theme: Theme
  onToggle: () => void
  t: Translations
}

/**
 * Theme toggle button — ref: spritz-reader.plan.md §7, spec US-07
 */
export function ThemeToggle({ theme, onToggle, t }: ThemeToggleProps) {
  const isDark = theme === 'dark'
  const label = isDark ? t.switchToLight : t.switchToDark

  return (
    <button
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="w-9 h-9 rounded flex items-center justify-center text-lg
                 text-(--color-text-muted) hover:text-(--color-text-primary)
                 border border-(--color-border) hover:border-(--color-accent)
                 transition-colors"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
