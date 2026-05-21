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
- [x] **T-13** Create `src/data/demoText.ts` — ~~multilingual EN/CA/ES paragraph export~~ **updated in T-33**

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
  - Five WPM preset buttons: 100 / 200 / 300 / 500 / 750 (ref: US-03); active preset highlighted
  - Restart button (ref: US-02)
  - All buttons have `aria-label`
- [-] **T-18** ~~Implement `src/components/ProgressBar/ProgressBar.tsx`~~ _(removed — see T-46)_
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
  - All 5 WPM preset buttons render with `role="radio"`; clicking one fires `onWpmChange` with that value
  - Active preset has `aria-checked="true"` (radiogroup pattern)

---

## Phase 8 — Polish

- [ ] **T-27** Verify responsive layout at 375px, 768px, 1280px viewport widths
- [ ] **T-28** Add keyboard shortcut legend to the UI (tooltip or footer note, ref: US-08) _(hint already in Controls component)_
- [ ] **T-29** Verify all interactive elements have visible focus rings (accessibility)
- [x] **T-30** Run `pnpm vitest run` — all 47 tests pass ✓
- [x] **T-31** Run `pnpm build` — production build succeeds with no TypeScript errors ✓
- [x] **T-32** Update this file: mark all completed tasks with `[x]`

---

## Phase 9 — i18n: Language Selector (ref: spec US-09, US-06)

- [x] **T-33** Update `src/data/demoText.ts` — replace single `DEMO_TEXT` with `DEMO_TEXTS: Record<Language, string>` (one paragraph per language)
- [x] **T-34** Create `src/i18n/translations.ts` — `Translations` interface + `translations` record for EN / CA / ES
- [x] **T-35** Create `src/hooks/useLanguage.ts` — language state (`'en' | 'ca' | 'es'`), `localStorage` persistence under `'spritz-language'`, default `'en'`
- [x] **T-36** Create `src/components/LanguageSelector/LanguageSelector.tsx` — native `<select>` dropdown for EN / CA / ES
- [x] **T-37** Update `src/components/SpeedReader/SpeedReader.tsx` — add `t: Translations` prop; use `t.idlePlaceholder` and `t.finishedMessage`
- [x] **T-38** Update `src/components/Controls/Controls.tsx` — add `t: Translations` prop; use `t.play`, `t.pause`, `t.restart`, `t.keyboardHint`
- [-] **T-39** ~~Update `src/components/ProgressBar/ProgressBar.tsx`~~ _(removed — see T-46)_
- [x] **T-40** Update `src/components/TextInput/TextInput.tsx` — add `t: Translations` prop; use `t.changeText`, `t.hideTextPanel`, `t.textareaPlaceholder`, `t.useDemoText`
- [x] **T-41** Update `src/components/ThemeToggle/ThemeToggle.tsx` — add `t: Translations` prop; use `t.switchToLight`, `t.switchToDark`
- [x] **T-42** Update `src/App.tsx` — add `useLanguage`; compute `t = translations[language]`; add `LanguageSelector` to header; when language changes and demo is active, switch demo text; track `isUsingDemo` flag
- [x] **T-43** Update unit tests that assert hard-coded English strings — pass a mock `t` prop with expected strings
- [x] **T-44** Run `pnpm vitest run` — all tests pass
- [x] **T-45** Run `pnpm build` — no TypeScript errors

---

## Phase 10 — Refinements

- [x] **T-46** Remove `ProgressBar` component (spec US-04 removed) — delete `src/components/ProgressBar/`, remove import and JSX from `App.tsx`, remove `wordOf` from `Translations` interface and all language objects
- [x] **T-47** Fix dark/light mode: Tailwind v4 requires `(--color-*)` parenthesis syntax (not `[--color-*]`) for CSS variable references; updated all 44 occurrences across all TSX files
- [x] **T-48** Change ORP accent colour from amber to blue (`#4A6CF7` light / `#6481F8` dark); update button text to `text-white` for contrast
- [x] **T-49** Fix ORP pivot centering: word positioned with `transform: translateX(calc(-N ch - 0.5ch))` so pivot letter is always at the horizontal midpoint regardless of word length
- [x] **T-50** Replace emoji theme toggle icons (☀️/🌙) with inline SVG (Feather Icons style, `strokeWidth="2"`, `currentColor`)
- [x] **T-51** Add FOUC prevention: inline `<script>` in `index.html` applies `.dark` class synchronously before React mounts; `body` gets `background-color: var(--color-bg)`
- [x] **T-52** Expand demo texts from 1 paragraph to 3 paragraphs per language for a longer reading session
- [x] **T-53** Set Vite dev server port to 3000 (`server: { port: 3000 }` in `vite.config.ts`)
- [x] **T-54** Make SpeedReader card clickable for play/pause (ref: spec US-02) — add `onTogglePlay: () => void` prop to `SpeedReader`; container is `cursor-pointer` when not finished; `App.tsx` passes handler that calls `play()` or `pause()` based on current status
- [x] **T-55** Redesign control layout (ref: spec US-02, US-05) — update `idlePlaceholder` text to "Click to play" variants; remove Restart from `Controls`; add `onRestart` prop to `TextInput` with button always visible in header row alongside panel toggle; update `App.tsx`, tests, and component APIs accordingly _(superseded by T-66)_

---

## Phase 11 — UI Polish & Accessibility

- [x] **T-56** Fix dark mode WCAG contrast — `--color-text-muted` dark `#52525B` → `#A1A1AA` (~8:1 contrast ratio); `--color-border` dark `#27272A` → `#3F3F46`; update `plan.md §9` tokens accordingly
- [x] **T-57** Header: align `LanguageSelector` height to `h-9` (36 px) to match `ThemeToggle`; add inline SVG logo inside accent-coloured rounded square; make app name `text-base font-bold` (was `text-sm opacity-60 uppercase`)
- [x] **T-58** Minimalist layout redesign — add `appTagline` and `appDescription` keys to `Translations` (all three languages); add intro section above the reader display (`h2` + subtitle); narrow container from `max-w-2xl` to `max-w-xl`; increase vertical spacing
- [x] **T-59** WPM radiogroup keyboard fix (ref: spec US-03, US-08) — convert WPM preset group to `role="radiogroup"` with roving tabindex (`tabIndex={0}` for active, `-1` for others); add `handleWpmGroupKeyDown` handling `←`, `→`, `↑`, `↓`, `Home`, `End` with `stopPropagation()` so the global ±50 handler is not triggered simultaneously
- [x] **T-60** Global keyboard guard — skip `Space`, `ArrowLeft`, `ArrowRight` in the document-level handler when `e.target instanceof HTMLButtonElement` to prevent double-firing with native button behaviour
- [x] **T-61** SpeedReader `stopPropagation` — add `e.stopPropagation()` inside the component's `onKeyDown` handler so Space/Enter do not also trigger the global play/pause handler
- [x] **T-62** Fix Tailwind lint — replace `w-[2px]` with `w-0.5` in `SpeedReader.tsx`
- [x] **T-63** Update all test `mockT` objects to include the new `appTagline` and `appDescription` fields; update WPM preset queries from `role="button"` / `aria-pressed` to `role="radio"` / `aria-checked`
- [x] **T-64** Run `pnpm vitest run` — all 47 tests pass ✓ _(48 after T-66 adds restart callback test)_
- [x] **T-65** Redesign WPM presets for progressive UX — change from `150/250/350/500/750` to `100/200/300/500/750`; update default WPM from 350 to 200 (average reading speed as baseline); update `Controls.tsx`, `useSpeedReader.ts` default, `Controls.test.tsx` assertions, and all three spec files
- [x] **T-66** Move Restart into `Controls` alongside Play/Pause (ref: spec US-02) — add `onRestart` prop to `Controls`; render Restart as a secondary outline pill next to Play/Pause; remove `onRestart` from `TextInput`; simplify `TextInput` header to a single toggle button; update `App.tsx`, `Controls.test.tsx` (add restart callback test), and all three spec files
- [x] **T-67** Exaggerate typography hierarchy and extend accent colour usage — tagline `text-2xl font-bold` → `text-4xl font-black tracking-tighter`; description `text-sm` → `text-xs`; WPM group label changed from muted to `text-(--color-accent) font-bold`; Play button `text-sm px-9 py-2.5` → `text-base font-bold px-10 py-3`; Restart height aligned `py-3 px-6`; focal guide opacity `0.4` → `0.6`; update `plan.md §9` typography hierarchy and accent usage tables
- [x] **T-68** Add entrance animations, ambient accent glows, and focal guide pulse
- [x] **T-69** Improve idle / paused / playing state discoverability
- [x] **T-70** Replace header logo with a glasses icon
- [x] **T-71** Typography readability pass
- [x] **T-72** Reader card hover affordance — add `hover:border-(--color-accent) transition-colors duration-200` to the reader card wrapper in `App.tsx`; update `spec.md US-02`
- [x] **T-73** Playing pause hint — move from centred bottom to bottom-right corner, add pause icon + `clickToPause` translated text; add string to translations + update mock in tests
- [x] **T-74** Zen play pulse — replace `animate-ping` (1s aggressive) with custom `animate-zen-pulse` (2.8s ease-out); add `@keyframes zen-pulse` + `--animate-zen-pulse` token to `index.css`
- [x] **T-76** Hover coherence — idle ripple `animate-zen-pulse` (always-on) → `group-hover:animate-zen-pulse` (hover-triggered); reader card border `duration-200` → `duration-300` to match hint reveal timing
- [x] **T-75** Remove Play/Pause/Restart buttons; add 3 s auto-reset to idle after finishing (hook `useEffect`); strip `play`/`pause`/`restart` from translations; update spec US-02 to reflect panel-only interaction + custom-text preservation — description `text-xs max-w-xs` → `text-sm max-w-sm`; tagline `text-4xl` → `text-3xl sm:text-4xl` (responsive); WPM preset chips `text-xs` → `text-sm`; update `plan.md §9` typography hierarchy table (reading glasses SVG: two lens circles, nose bridge arc, temple arms; white strokes on accent background) — update `App.tsx` inline SVG — idle: replace muted text with pulsing accent play circle (ping ripple) + accent-coloured label; paused: add `▶ Click to resume` hint at card bottom; playing: add hover-only `⏸` badge at card bottom; add `clickToResume` key to `Translations` interface + all 3 languages; update `SpeedReader.test.tsx` and `Controls.test.tsx` mockT; update `spec.md US-01`, `spec.md US-02`, `plan.md §6.6` — add `@keyframes` (fade-up, fade-in, float, guide-pulse) + `--animate-*` tokens in `@theme` to `index.css`; add reduced-motion media query; add two fixed blurred blob decorations in `App.tsx`; stagger `animate-fade-up` (80 ms steps) on each content section; `animate-fade-in` on header; conditionally add `animate-guide-pulse` to SpeedReader focal guide while playing; update `spec.md §5`, `plan.md §9 accent usage`, `plan.md §12`
