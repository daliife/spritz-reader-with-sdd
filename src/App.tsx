import { useEffect, useState } from "react";
import { SpeedReader } from "./components/SpeedReader/SpeedReader";
import { Controls } from "./components/Controls/Controls";
import { ProgressBar } from "./components/ProgressBar/ProgressBar";
import { TextInput } from "./components/TextInput/TextInput";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import { useSpeedReader } from "./hooks/useSpeedReader";
import { useTheme } from "./hooks/useTheme";
import { DEMO_TEXT } from "./data/demoText";

/**
 * Root component — ref: spritz-reader.plan.md §5 (Assembly), spec US-08 (keyboard shortcuts)
 */
export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [text, setText] = useState(DEMO_TEXT);

  const {
    words,
    currentIndex,
    currentWord,
    wpm,
    status,
    play,
    pause,
    restart,
    setWpm,
  } = useSpeedReader(text);

  // Keyboard shortcuts — ref: spec US-08
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore shortcuts when user is typing in a textarea/input
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

  function handleUseDemo() {
    setText(DEMO_TEXT);
  }

  return (
    <div
      className={`min-h-screen flex flex-col
                  ${theme === "dark" ? "bg-[#0d0f12] text-[#f0f0f0]" : "bg-[#f5f5f5] text-[#1a1a1a]"}`}
    >
      {/* Header */}
      <header
        className={`flex items-center justify-between px-6 py-4 border-b
                    ${theme === "dark" ? "border-[#2d3139]" : "border-[#e0e0e0]"}`}
      >
        <h1 className="text-sm font-semibold tracking-widest uppercase opacity-60">
          Spritz Reader
        </h1>
        <ThemeToggle theme={theme} onToggle={toggleTheme} />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl flex flex-col gap-8">
          {/* Reader display */}
          <div
            className={`rounded-xl overflow-hidden border
                        ${theme === "dark" ? "border-[#2d3139] bg-[#161a20]" : "border-[#e0e0e0] bg-white"}`}
          >
            <SpeedReader word={currentWord} status={status} />
          </div>

          {/* Progress */}
          <ProgressBar current={currentIndex} total={words.length} />

          {/* Controls */}
          <Controls
            status={status}
            wpm={wpm}
            onPlay={play}
            onPause={pause}
            onRestart={restart}
            onWpmChange={setWpm}
          />

          {/* Text input */}
          <TextInput
            value={text}
            onChange={setText}
            onUseDemo={handleUseDemo}
          />
        </div>
      </main>
    </div>
  );
}
