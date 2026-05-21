# Spritz Reader — Technical Plan

> References: `spritz-reader.spec.md`

## 1. Technology Stack

| Layer           | Choice                          | Rationale                                               |
| --------------- | ------------------------------- | ------------------------------------------------------- |
| Framework       | React 19                        | Component model ideal for reactive word-by-word display |
| Build tool      | Vite 6                          | Fast HMR, native ESM, first-class TypeScript            |
| Language        | TypeScript 5                    | Type safety for ORP algorithm and state machine         |
| Styling         | Tailwind CSS v4                 | Utility-first, dark mode via `class`, zero runtime      |
| Testing         | Vitest + @testing-library/react | Fast, co-located with Vite config                       |
| Package manager | pnpm                            | Security, speed, strict node_modules                    |

## 2. Project Structure

```
spritz-reader-with-sdd/
├── specs/
│   ├── spritz-reader.spec.md
│   ├── spritz-reader.plan.md
│   └── spritz-reader.tasks.md
├── public/
│   ├── favicon.svg                  # Custom SVG favicon
│   └── og-image.svg                 # Open Graph image (1200×630)
├── src/
│   ├── components/
│   │   ├── SpeedReader/
│   │   │   ├── SpeedReader.tsx
│   │   │   └── SpeedReader.test.tsx
│   │   ├── Controls/
│   │   │   ├── Controls.tsx
│   │   │   └── Controls.test.tsx
│   │   ├── TextInput/
│   │   │   └── TextInput.tsx
│   │   ├── ThemeToggle/
│   │   │   └── ThemeToggle.tsx
│   │   └── LanguageSelector/
│   │       └── LanguageSelector.tsx
│   ├── hooks/
│   │   ├── useSpeedReader.ts
│   │   ├── useSpeedReader.test.ts
│   │   ├── useTheme.ts
│   │   └── useLanguage.ts
│   ├── i18n/
│   │   └── translations.ts
│   ├── utils/
│   │   ├── orp.ts
│   │   ├── orp.test.ts
│   │   ├── textParser.ts
│   │   └── textParser.test.ts
│   ├── data/
│   │   └── demoText.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── package.json
```

## 3. ORP Algorithm

The ORP (Optimal Recognition Point) is the specific letter index (0-based) within a word that should be aligned with the eye's focal point.

### Formula (standard Spritz table)

| Word length | ORP index |
| ----------- | --------- |
| 1           | 0         |
| 2 – 5       | 1         |
| 6 – 9       | 2         |
| 10 – 13     | 3         |
| 14+         | 4         |

### Word split

Given a word and its ORP index, the display splits it into three segments:

```
left  = word.slice(0, orpIndex)          // before ORP (muted/white)
pivot = word[orpIndex]                   // ORP character (blue accent)
right = word.slice(orpIndex + 1)         // after ORP (muted/white)
```

### Implementation: `src/utils/orp.ts`

```typescript
export function getOrpIndex(word: string): number;
export function splitWordAtOrp(word: string): {
  left: string;
  pivot: string;
  right: string;
};
```

## 4. Text Parser

### Implementation: `src/utils/textParser.ts`

```typescript
export function parseText(raw: string): string[];
```

- Split on whitespace (`/\s+/`).
- Filter out empty strings.
- Preserve punctuation attached to words (e.g., `"Hello,"` is one token — ORP applied to the word as-is).
- Minimum output: 1 word when input is non-empty.

## 5. State Machine — `useSpeedReader`

### States

```
idle ──play──▶ playing ──pause──▶ paused
               playing ──finish──▶ finished
paused  ──play──▶ playing
finished ──restart──▶ idle
any ──restart──▶ idle
```

### State shape

```typescript
type ReaderStatus = "idle" | "playing" | "paused" | "finished";

interface ReaderState {
  words: string[]; // parsed word array
  currentIndex: number; // 0-based current word pointer
  wpm: number; // 100–1000
  status: ReaderStatus;
}
```

### Hook API

```typescript
function useSpeedReader(
  text: string,
  initialWpm?: number,
): {
  words: string[];
  currentIndex: number;
  currentWord: string;
  wpm: number;
  status: ReaderStatus;
  play: () => void;
  pause: () => void;
  restart: () => void;
  setWpm: (wpm: number) => void;
};
```

### Timer logic

- Interval = `Math.round(60_000 / wpm)` milliseconds.
- `setInterval` is created on `play`, cleared on `pause` / `finish` / `restart`.
- When `wpm` changes during playback, clear existing interval and create new one immediately.
- When text changes, call `restart` automatically.

## 6. Theme — `useTheme`

```typescript
function useTheme(): {
  theme: "light" | "dark";
  toggle: () => void;
};
```

- Reads initial value from `localStorage.getItem('theme')`.
- Defaults to `'dark'` if no value stored.
- On change: updates `localStorage` and toggles the `dark` class on `document.documentElement`.

## 6.5. Language — `useLanguage`

```typescript
export type Language = "en" | "ca" | "es";

function useLanguage(): {
  language: Language;
  setLanguage: (lang: Language) => void;
};
```

- Reads initial value from `localStorage.getItem('spritz-language')`.
- Defaults to `'en'` if no value stored.
- On change: persists to `localStorage`.
- Does **not** manipulate the DOM (language is passed as data, not a DOM attribute).

## 6.6. Translations — `src/i18n/translations.ts`

```typescript
export interface Translations {
  // App intro
  appTagline: string;
  appTaglineEmphasis: string;
  appDescription: string;
  // SpeedReader display
  idlePlaceholder: string;
  clickToResume: string;
  clickToPause: string;
  // TextInput
  changeText: string;
  hideTextPanel: string;
  textareaPlaceholder: string;
  useDemoText: string;
  // ThemeToggle
  switchToLight: string;
  switchToDark: string;
  // Controls
  wpmLabel: string;      // "WPM" (EN) / "PPM" (CA/ES)
  wpmTooltip: string;    // "Words per minute" etc.
  // Keyboard hint
  keyboardHint: string;
}

export const translations: Record<Language, Translations> = { en: {...}, ca: {...}, es: {...} }
```

All UI strings come exclusively from this object. Components receive a `t: Translations` prop from `App.tsx`; no component imports translations directly.

## 7. Component API

> All components that display user-facing text receive a `t: Translations` prop.
> This is the only source of UI strings; components never hard-code text.

### `SpeedReader`

```typescript
interface SpeedReaderProps {
  word: string; // current word to display
  status: ReaderStatus;
  t: Translations;
  onTogglePlay: () => void; // called when card is clicked (idle/playing/paused only)
}
```

- Renders left/pivot/right spans.
- The container has a centered vertical line at the ORP pivot column.
- When `status === 'idle'` or `'paused'` the card is `cursor-pointer` and shows a hover overlay; clicking calls `onTogglePlay`.
- When `status === 'playing'` the card is `cursor-pointer`; clicking calls `onTogglePlay` to pause.
- When `status === 'finished'` the card is not interactive; the last word remains displayed.

### `Controls`

```typescript
interface ControlsProps {
  wpm: number;
  onWpmChange: (wpm: number) => void;
  t: Translations;
}
```

- Renders WPM preset buttons (100 / 200 / 300 / 500 / 750) as a `radiogroup` with roving tabindex.

### `TextInput`

```typescript
interface TextInputProps {
  value: string;
  isDemo: boolean;
  onChange: (text: string) => void;
  onUseDemo: () => void;
  t: Translations;
}
```

- Header row shows only the panel toggle ("Change text" / "Hide panel").
- Restart is in `Controls`, not here.

### `ThemeToggle`

```typescript
interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
  t: Translations;
}
```

### `LanguageSelector`

```typescript
interface LanguageSelectorProps {
  language: Language;
  onChange: (lang: Language) => void;
}
```

- Renders a segmented pill group (three `<button>` elements inside a `role="group"`) for EN / CA / ES.
- Active language is highlighted with accent background + white text.

## 8. Tailwind Dark Mode Strategy

- `darkMode: 'class'` (Tailwind v4: set in CSS with `@custom-variant dark (&:where(.dark, .dark *))` or equivalent).
- `useTheme` adds/removes `class="dark"` on `<html>`.
- All components use CSS custom properties (`var(--color-*)`) for all colours; no hard-coded hex values in components.
- CSS variables are defined in `:root` (light) and `.dark` (dark) selectors in `index.css`.
- Tailwind arbitrary values use the `(--color-*)` parenthesis syntax (generates `var(--color-*)`).

## 9. Key Design Tokens

| Token        | Dark value                                                 | Light value |
| ------------ | ---------------------------------------------------------- | ----------- |
| Background   | `#0c0d18`                                                  | `#f0f2ff`   |
| Surface      | `#131421`                                                  | `#f7f8ff`   |
| Text primary | `#fafafa`                                                  | `#09090b`   |
| Text muted   | `#a1a1aa`                                                  | `#78716c`   |
| ORP accent   | `#6481f8`                                                  | `#4a6cf7`   |
| Border       | `#3f3f46`                                                  | `#e4e4e7`   |
| Shadow card  | `color-mix(in srgb, var(--color-accent) 18%, transparent)` | same        |

### Typography hierarchy

| Level | Element                         | Size                                          |
| ----- | ------------------------------- | --------------------------------------------- |
| 1     | ORP word (playing)              | `text-6xl md:text-8xl font-bold mono`         |
| 2     | App tagline `h2`                | `text-3xl sm:text-4xl md:text-5xl font-black` |
| 3     | Tagline emphasis span           | `text-(--color-accent) block`                 |
| 4     | WPM preset chips                | `text-sm md:text-base`                        |
| 5     | Description `p`                 | `text-base md:text-lg`                        |
| 6     | Keyboard hint, secondary labels | `text-xs`                                     |

### Accent usage

The accent color appears on: logo background, focal guide line (state-dependent opacity: 20 % idle / 50 % paused / 100 % playing), active WPM chip, WPM group label, `wpmTooltip` info icon, focus rings, ambient background glow blobs, panel hover glow halo.

## 10. Demo Text

Located in `src/data/demoText.ts`. Exports a `DEMO_TEXTS` record with one paragraph per language. Each paragraph showcases a variety of word lengths (1–15+ characters) to demonstrate the ORP algorithm.

```typescript
import type { Language } from "../hooks/useLanguage";
export const DEMO_TEXTS: Record<Language, string> = {
  en: "...",
  ca: "...",
  es: "...",
};
```

`App.tsx` selects the active demo text as `DEMO_TEXTS[language]`.

## 11. Keyboard Shortcuts

Handled in `App.tsx` via `useEffect` + `document.addEventListener('keydown', ...)`.

| Key          | Action              |
| ------------ | ------------------- |
| `Space`      | Play / Pause        |
| `R` / `r`    | Restart             |
| `ArrowLeft`  | WPM − 50 (min 100)  |
| `ArrowRight` | WPM + 50 (max 1000) |

## 12. Animation System

All keyframes are defined in `src/index.css` and registered as Tailwind `--animate-*` tokens in `@theme`.

| Token                 | Keyframe                               | Usage                                 |
| --------------------- | -------------------------------------- | ------------------------------------- |
| `--animate-fade-up`   | `fade-up` 0.55 s ease-out              | Content section entrances (staggered) |
| `--animate-fade-in`   | `fade-in` 0.4 s ease-out               | Header entrance                       |
| `--animate-float`     | `float` 10 s ease-in-out infinite      | Ambient background glow blobs         |
| `--animate-zen-pulse` | `zen-pulse` 2.8 s ease-out infinite    | (available; no active usage)          |
| `--animate-glow-loop` | `glow-loop` 2.4 s ease-in-out infinite | Panel hover glow halo in idle state   |

All animations respect `@media (prefers-reduced-motion: reduce)` — durations are collapsed to `0.01ms` and iteration counts to `1`.

## 12. Testing Strategy

| File                     | What is tested                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `orp.test.ts`            | `getOrpIndex` for each length bucket; `splitWordAtOrp` correctness                                   |
| `textParser.test.ts`     | Empty input, whitespace-only, single word, punctuation, multi-line                                   |
| `useSpeedReader.test.ts` | State transitions: play→playing, pause→paused, restart→idle, finish→finished; WPM change during play |
| `SpeedReader.test.tsx`   | Correct rendering of left/pivot/right; idle/finished messages                                        |
| `Controls.test.tsx`      | Buttons render; callbacks fire on click                                                              |

## 13. Build & Run Commands

```bash
pnpm install          # install dependencies
pnpm dev              # start Vite dev server
pnpm build            # production build to dist/
pnpm preview          # preview production build
pnpm test             # run Vitest unit tests
pnpm test --coverage  # test coverage report
```
