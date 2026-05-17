# Spritz Reader — Implementation Tasks

> References: `spritz-reader.spec.md` · `spritz-reader.plan.md`
> Legend: `[ ]` pending · `[x]` done · `[-]` skipped

---

## Phase 1 — SDD Documents

- [x] **T-01** Create `specs/spritz-reader.spec.md` (business requirements, user stories, acceptance criteria)
- [x] **T-02** Create `specs/spritz-reader.plan.md` (technical architecture, component API, ORP algorithm, state machine)
- [x] **T-03** Create `specs/spritz-reader.tasks.md` (this file)

---

## Phase 2 — Project Setup

- [x] **T-04** Run `pnpm create vite@latest` inside workspace root with React + TypeScript template _(scaffolded manually)_
- [x] **T-05** Install runtime deps: _(none — pure client-side)_
- [x] **T-06** Install dev deps: `vitest`, `@vitest/coverage-v8`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `tailwindcss`, `@tailwindcss/vite`
- [x] **T-07** Configure `vite.config.ts`: import from `vitest/config` + `@tailwindcss/vite` plugin + Vitest config (`environment: 'jsdom'`, `setupFiles`, `globals: true`)
- [x] **T-08** Create `src/index.css`: `@import "tailwindcss"` + custom `@theme` tokens (bg, surface, text, ORP accent, border)
- [x] **T-09** Add `"test": "vitest"` and `"test:coverage": "vitest --coverage"` scripts to `package.json`
- [x] **T-10** Verify `pnpm build` succeeds with no TypeScript errors

---

## Phase 3 — Core Utilities

- [x] **T-11** Implement `src/utils/orp.ts`
  - `getOrpIndex(word: string): number` — standard Spritz length table
  - `splitWordAtOrp(word: string): { left: string; pivot: string; right: string }`
- [x] **T-12** Implement `src/utils/textParser.ts`
  - `parseText(raw: string): string[]` — split on whitespace, filter empty
- [x] **T-13** Create `src/data/demoText.ts` — multilingual EN/CA/ES paragraph export

---

## Phase 4 — Core Logic (Hooks)

- [x] **T-14** Implement `src/hooks/useTheme.ts`
  - Read/write `localStorage` key `'theme'`
  - Toggle `dark` class on `document.documentElement`
  - Default: `'dark'`
- [x] **T-15** Implement `src/hooks/useSpeedReader.ts`
  - State: `words`, `currentIndex`, `wpm`, `status` (`idle | playing | paused | finished`)
  - Actions: `play`, `pause`, `restart`, `setWpm`
  - Timer: `setInterval` at `Math.round(60_000 / wpm)` ms; cleared on pause/finish/restart
  - WPM change during playback: clear + restart interval immediately
  - Text change: auto-restart
  - Note: uses `indexRef` (plain mutable ref) updated synchronously in interval callback — avoids React batching issue in tests

---

## Phase 5 — UI Components

- [x] **T-16** Implement `src/components/SpeedReader/SpeedReader.tsx`
  - Render three `<span>` segments: left (muted), pivot (ORP accent color), right (muted)
  - Monospaced font container
  - Vertical focal guide line aligned to ORP column
  - Idle state: show placeholder text
  - Finished state: show completion message
- [x] **T-17** Implement `src/components/Controls/Controls.tsx`
  - Play/Pause button (icon + label, ref: US-02)
  - WPM display with `−` / `+` buttons (step 50, min 100, max 1000, ref: US-03)
  - Restart button (ref: US-02)
  - All buttons have `aria-label`
- [x] **T-18** Implement `src/components/ProgressBar/ProgressBar.tsx`
  - Filled bar: `width = (current / total) * 100%`
  - Text counter: `"Word N of M"` (ref: US-04)
- [x] **T-19** Implement `src/components/TextInput/TextInput.tsx`
  - `<textarea>` for custom text (ref: US-05)
  - "Use demo text" button resets to demo paragraph (ref: US-06)
  - Text change calls `onChange` which triggers `restart` in hook
- [x] **T-20** Implement `src/components/ThemeToggle/ThemeToggle.tsx`
  - Icon button: sun (light) / moon (dark) (ref: US-07)
  - `aria-label` with current mode

---

## Phase 6 — Assembly

- [x] **T-21** Implement `src/App.tsx`
  - Compose all components with `useSpeedReader` + `useTheme`
  - Layout: header (ThemeToggle + title), main (SpeedReader, Controls, ProgressBar, TextInput)
  - `useEffect` keyboard shortcuts: Space, R, ←, → (ref: US-08)
  - Apply Tailwind dark-mode class strategy to root element

---

## Phase 7 — Unit Tests

- [x] **T-22** Write `src/utils/orp.test.ts`
  - `getOrpIndex`: all length buckets (1, 2–5, 6–9, 10–13, 14+)
  - `splitWordAtOrp`: correct left/pivot/right for sample words
- [x] **T-23** Write `src/utils/textParser.test.ts`
  - Empty string → `[]`
  - Whitespace-only → `[]`
  - Single word → `['word']`
  - Punctuation → preserved in token
  - Multi-line → flattened
- [x] **T-24** Write `src/hooks/useSpeedReader.test.ts`
  - Initial state is `idle`
  - `play` → `playing`
  - `pause` → `paused`
  - `restart` → `idle`, `currentIndex` = 0
  - Reaching last word → `finished`
  - `setWpm` updates `wpm` value; clamps to min/max
  - Text change → auto-restart
- [x] **T-25** Write `src/components/SpeedReader/SpeedReader.test.tsx`
  - Idle state renders placeholder
  - Finished state renders completion message
  - Splits word correctly into left/pivot/right spans
- [x] **T-26** Write `src/components/Controls/Controls.test.tsx`
  - Play button fires `onPlay` callback
  - Pause button fires `onPause` callback
  - Restart button fires `onRestart` callback
  - `+` / `−` WPM buttons fire `onWpmChange` with correct values

---

## Phase 8 — Polish

- [ ] **T-27** Verify responsive layout at 375px, 768px, 1280px viewport widths
- [ ] **T-28** Add keyboard shortcut legend to the UI (tooltip or footer note, ref: US-08) _(hint already in Controls component)_
- [ ] **T-29** Verify all interactive elements have visible focus rings (accessibility)
- [x] **T-30** Run `pnpm vitest run` — all 49 tests pass ✓
- [x] **T-31** Run `pnpm build` — production build succeeds with no TypeScript errors ✓
- [x] **T-32** Update this file: mark all completed tasks with `[x]`
