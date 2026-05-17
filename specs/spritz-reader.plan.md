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
│   ├── spritz-reader.spec.md        # Business spec (source of truth #1)
│   ├── spritz-reader.plan.md        # This file (source of truth #2)
│   └── spritz-reader.tasks.md       # Task checklist (source of truth #3)
├── src/
│   ├── assets/                      # Static assets (favicon, etc.)
│   ├── components/
│   │   ├── SpeedReader/
│   │   │   ├── SpeedReader.tsx      # ORP word display + focal line
│   │   │   └── SpeedReader.test.tsx # Unit tests
│   │   ├── Controls/
│   │   │   ├── Controls.tsx         # Play/Pause, WPM, Restart
│   │   │   └── Controls.test.tsx
│   │   ├── ProgressBar/
│   │   │   └── ProgressBar.tsx      # Progress fill + word counter
│   │   ├── TextInput/
│   │   │   └── TextInput.tsx        # Custom text textarea + demo toggle
│   │   ├── ThemeToggle/
│   │   │   └── ThemeToggle.tsx      # Light/dark icon button
│   │   └── LanguageSelector/
│   │       └── LanguageSelector.tsx # EN / CA / ES language dropdown
│   ├── hooks/
│   │   ├── useSpeedReader.ts        # Core state machine
│   │   ├── useSpeedReader.test.ts   # Hook unit tests
│   │   ├── useTheme.ts              # Theme toggle + localStorage
│   │   └── useLanguage.ts           # Language selection + localStorage
│   ├── i18n/
│   │   └── translations.ts          # All UI strings keyed by Language
│   ├── utils/
│   │   ├── orp.ts                   # ORP index calculation
│   │   ├── orp.test.ts              # ORP unit tests
│   │   ├── textParser.ts            # Raw text → string[]
│   │   └── textParser.test.ts       # Parser unit tests
│   ├── data/
│   │   └── demoText.ts              # Demo paragraph per language (EN / CA / ES)
│   ├── App.tsx                      # Root component, layout
│   ├── main.tsx                     # React entry point
│   └── index.css                    # Tailwind base import + custom CSS
├── index.html
├── vite.config.ts
├── tailwind.config.ts               # (if needed; TW v4 uses CSS config)
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
  theme: 'light' | 'dark'
  toggle: () => void
}
```

- Reads initial value from `localStorage.getItem('theme')`.
- Defaults to `'dark'` if no value stored.
- On change: updates `localStorage` and toggles the `dark` class on `document.documentElement`.

## 6.5. Language — `useLanguage`

```typescript
export type Language = 'en' | 'ca' | 'es'

function useLanguage(): {
  language: Language
  setLanguage: (lang: Language) => void
}
```

- Reads initial value from `localStorage.getItem('spritz-language')`.
- Defaults to `'en'` if no value stored.
- On change: persists to `localStorage`.
- Does **not** manipulate the DOM (language is passed as data, not a DOM attribute).

## 6.6. Translations — `src/i18n/translations.ts`

```typescript
export interface Translations {
  // SpeedReader
  idlePlaceholder: string
  finishedMessage: string
  // Controls
  play: string
  pause: string
  restart: string
  // ProgressBar
  wordOf: (current: number, total: number) => string
  // TextInput
  changeText: string
  hideTextPanel: string
  textareaPlaceholder: string
  useDemoText: string
  // ThemeToggle
  switchToLight: string
  switchToDark: string
  // Keyboard hint
  keyboardHint: string
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
  word: string        // current word to display
  status: ReaderStatus
  t: Translations
}
```

- Renders left/pivot/right spans.
- The container has a centered vertical line (`::before` pseudo-element or a `<div>`) at the ORP pivot column.
- When `status === 'idle'` shows a placeholder message.
- When `status === 'finished'` shows a completion message.

### `Controls`

```typescript
interface ControlsProps {
  status: ReaderStatus
  wpm: number
  onPlay: () => void
  onPause: () => void
  onRestart: () => void
  onWpmChange: (wpm: number) => void
  t: Translations
}
```

### `ProgressBar`

```typescript
interface ProgressBarProps {
  current: number   // 0-based index
  total: number
  t: Translations
}
```

### `TextInput`

```typescript
interface TextInputProps {
  value: string
  onChange: (text: string) => void
  onUseDemo: () => void
  t: Translations
}
```

### `ThemeToggle`

```typescript
interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
  t: Translations
}
```

### `LanguageSelector`

```typescript
interface LanguageSelectorProps {
  language: Language
  onChange: (lang: Language) => void
}
```

- Renders a native `<select>` dropdown with options for EN, CA, ES.
- The browser handles the picker UI; no custom dropdown implementation needed.
- The `<select>` is styled to match the header aesthetic (border, muted text, accent on hover/focus).

## 8. Tailwind Dark Mode Strategy

- `darkMode: 'class'` (Tailwind v4: set in CSS with `@custom-variant dark (&:where(.dark, .dark *))` or equivalent).
- `useTheme` adds/removes `class="dark"` on `<html>`.
- All components use `dark:` Tailwind variants for color inversions.
- Default = dark; light mode is the opt-in variant.

## 9. Key Design Tokens

| Token        | Dark value  | Light value |
| ------------ | ----------- | ----------- |
| Background   | `#09090B`   | `#FAFAFA`   |
| Surface      | `#111113`   | `#FFFFFF`   |
| Text primary | `#FAFAFA`   | `#09090B`   |
| Text muted   | `#52525B`   | `#78716C`   |
| ORP accent   | `#F59E0B`   | `#D97706`   |
| Border       | `#27272A`   | `#E4E4E7`   |

## 10. Demo Text

Located in `src/data/demoText.ts`. Exports a `DEMO_TEXTS` record with one paragraph per language. Each paragraph showcases a variety of word lengths (1–15+ characters) to demonstrate the ORP algorithm.

```typescript
import type { Language } from '../hooks/useLanguage'
export const DEMO_TEXTS: Record<Language, string> = { en: '...', ca: '...', es: '...' }
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
