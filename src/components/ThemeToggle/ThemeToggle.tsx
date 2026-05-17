type Theme = "light" | "dark";

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

/**
 * Theme toggle button — ref: spritz-reader.plan.md §7, spec US-07
 */
export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === "dark";

  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 rounded flex items-center justify-center text-lg
                 text-[--color-text-muted] hover:text-[--color-text-primary]
                 border border-[--color-border] hover:border-[--color-accent]
                 transition-colors"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
