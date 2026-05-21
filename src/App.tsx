import { useEffect, useState } from "react";
import { SpeedReader } from "./components/SpeedReader/SpeedReader";
import { Controls } from "./components/Controls/Controls";
import { TextInput } from "./components/TextInput/TextInput";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import { LanguageSelector } from "./components/LanguageSelector/LanguageSelector";
import { useSpeedReader } from "./hooks/useSpeedReader";
import { useTheme } from "./hooks/useTheme";
import { useLanguage } from "./hooks/useLanguage";
import type { Language } from "./hooks/useLanguage";
import { translations } from "./i18n/translations";
import { DEMO_TEXTS } from "./data/demoText";

/**
 * Root component — ref: spritz-reader.plan.md §5 (Assembly), spec US-08, US-09
 */
export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  // Track whether the reader is showing the built-in demo text.
  // If so, language changes will automatically switch to the demo text in the new language.
  const [isUsingDemo, setIsUsingDemo] = useState(true);
  const [text, setText] = useState(() => DEMO_TEXTS[language]);

  const t = translations[language];

  const { currentWord, wpm, status, play, pause, restart, setWpm } =
    useSpeedReader(text);

  // When language changes: if showing demo, swap to new language's demo paragraph
  function handleLanguageChange(lang: Language) {
    setLanguage(lang);
    if (isUsingDemo) {
      setText(DEMO_TEXTS[lang]);
    }
  }

  function handleTextChange(newText: string) {
    setText(newText);
    setIsUsingDemo(false);
  }

  function handleUseDemo() {
    setText(DEMO_TEXTS[language]);
    setIsUsingDemo(true);
  }

  // Keyboard shortcuts — ref: spec US-08
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLInputElement
      )
        return;

      // Don't override native button/select behaviour for Space and arrows
      if (
        e.target instanceof HTMLButtonElement &&
        (e.key === " " || e.key === "ArrowLeft" || e.key === "ArrowRight")
      )
        return;

      const wpmPresets = [100, 200, 300, 500, 750];
      switch (e.key) {
        case " ":
          e.preventDefault();
          status === "playing" ? pause() : play();
          break;
        case "r":
        case "R":
          e.preventDefault();
          restart();
          break;
        case "ArrowLeft": {
          e.preventDefault();
          const idx = wpmPresets.indexOf(wpm);
          if (idx > 0) setWpm(wpmPresets[idx - 1]);
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          const idx = wpmPresets.indexOf(wpm);
          if (idx !== -1 && idx < wpmPresets.length - 1)
            setWpm(wpmPresets[idx + 1]);
          break;
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [status, play, pause, restart, setWpm, wpm]);

  return (
    <div className="min-h-dvh flex flex-col bg-(--color-bg) text-(--color-text-primary) transition-colors duration-200">
      {/* Ambient accent glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed w-96 h-96 rounded-full bg-(--color-accent) opacity-10 blur-3xl animate-float"
        style={{ top: "-6rem", right: "-5rem" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed w-72 h-72 rounded-full bg-(--color-accent) opacity-[0.07] blur-3xl animate-float"
        style={{ bottom: "-4rem", left: "-4rem", animationDelay: "-5s" }}
      />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-(--color-border) animate-fade-in">
        <div className="flex items-center gap-2.5">
          {/* Logo */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-(--color-accent) shrink-0">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              {/* Left temple arm */}
              <line
                x1="1.5"
                y1="9"
                x2="0"
                y2="7.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Left lens */}
              <circle cx="5" cy="9" r="3.5" stroke="white" strokeWidth="1.5" />
              {/* Nose bridge */}
              <path
                d="M8.5 9 Q9 7 9.5 9"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Right lens */}
              <circle cx="13" cy="9" r="3.5" stroke="white" strokeWidth="1.5" />
              {/* Right temple arm */}
              <line
                x1="16.5"
                y1="9"
                x2="18"
                y2="7.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="text-base font-bold tracking-tight">Spritz Reader</h1>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector
            language={language}
            onChange={handleLanguageChange}
          />
          <ThemeToggle theme={theme} onToggle={toggleTheme} t={t} />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-xl md:max-w-2xl flex flex-col gap-10 md:gap-14">
          {/* Intro */}
          <div className="text-center animate-fade-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight">
              <span className="block">{t.appTagline}</span>
              <span className="block text-(--color-accent)">
                {t.appTaglineEmphasis}
              </span>
            </h2>
            <p className="mt-3 text-base md:text-lg text-(--color-text-muted) leading-relaxed">
              {t.appDescription}
            </p>
          </div>

          {/* Reader display */}
          <div className="relative group">
            {/* Glow halo — breathes in/out on idle hover */}
            {status === "idle" && (
              <div
                className="absolute -inset-3 rounded-3xl bg-(--color-accent) blur-xl opacity-0 group-hover:animate-glow-loop pointer-events-none"
                aria-hidden="true"
              />
            )}
            <div
              className={[
                "rounded-2xl overflow-hidden border transition-colors duration-300 animate-fade-up [box-shadow:var(--shadow-card)]",
                status === "playing"
                  ? "border-(--color-accent)"
                  : status === "paused"
                    ? "border-(--color-accent)/60"
                    : "border-(--color-border)",
              ].join(" ")}
              style={{ animationDelay: "80ms" }}
            >
              <SpeedReader
                word={currentWord}
                status={status}
                t={t}
                onTogglePlay={status === "playing" ? pause : play}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
            <Controls wpm={wpm} onWpmChange={setWpm} t={t} />
          </div>

          {/* Text input */}
          <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
            <TextInput
              value={text}
              isDemo={isUsingDemo}
              onChange={handleTextChange}
              onUseDemo={handleUseDemo}
              t={t}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
