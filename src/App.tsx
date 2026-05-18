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
        case "ArrowLeft":
          e.preventDefault();
          setWpm(wpm - 50);
          break;
        case "ArrowRight":
          e.preventDefault();
          setWpm(wpm + 50);
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [status, play, pause, restart, setWpm, wpm]);

  return (
    <div className="min-h-screen flex flex-col bg-(--color-bg) text-(--color-text-primary) transition-colors duration-200">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-(--color-border)">
        <h1 className="text-sm font-semibold tracking-widest uppercase opacity-60">
          Spritz Reader
        </h1>
        <div className="flex items-center gap-2">
          <LanguageSelector
            language={language}
            onChange={handleLanguageChange}
          />
          <ThemeToggle theme={theme} onToggle={toggleTheme} t={t} />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl flex flex-col gap-8">
          {/* Reader display */}
          <div className="rounded-xl overflow-hidden border border-(--color-border) bg-(--color-surface)">
            <SpeedReader
              word={currentWord}
              status={status}
              t={t}
              onTogglePlay={status === "playing" ? pause : play}
            />
          </div>

          {/* Controls */}
          <Controls
            status={status}
            wpm={wpm}
            onPlay={play}
            onPause={pause}
            onWpmChange={setWpm}
            t={t}
          />

          {/* Text input */}
          <TextInput
            value={text}
            isDemo={isUsingDemo}
            onChange={handleTextChange}
            onUseDemo={handleUseDemo}
            onRestart={restart}
            t={t}
          />
        </div>
      </main>
    </div>
  );
}
