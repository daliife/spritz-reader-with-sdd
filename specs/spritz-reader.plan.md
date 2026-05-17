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
│   │   └── ThemeToggle/
│   │       └── ThemeToggle.tsx      # Light/dark icon button
│   ├── hooks/
│   │   ├── useSpeedReader.ts        # Core state machine
│   │   ├── useSpeedReader.test.ts   # Hook unit tests
│   │   └── useTheme.ts              # Theme toggle + localStorage
│   ├── utils/
│   │   ├── orp.ts                   # ORP index calculation
│   │   ├── orp.test.ts              # ORP unit tests
│   │   ├── textParser.ts            # Raw text → string[]
│   │   └── textParser.test.ts       # Parser unit tests
│   ├── data/
│   │   └── demoText.ts              # Multilingual demo paragraph
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
  theme: "light" | "dark";
  toggle: () => void;
};
```

- Reads initial value from `localStorage.getItem('theme')`.
- Defaults to `'dark'` if no value stored.
- On change: updates `localStorage` and toggles the `dark` class on `document.documentElement`.

## 7. Component API

### `SpeedReader`

```typescript
interface SpeedReaderProps {
  word: string; // current word to display
  status: ReaderStatus;
}
```

- Renders left/pivot/right spans.
- The container has a centered vertical line (`::before` pseudo-element or a `<div>`) at the ORP pivot column.
- When `status === 'idle'` shows a placeholder message.
- When `status === 'finished'` shows a completion message.

### `Controls`

```typescript
interface ControlsProps {
  status: ReaderStatus;
  wpm: number;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onWpmChange: (wpm: number) => void;
}
```

### `ProgressBar`

```typescript
interface ProgressBarProps {
  current: number; // 0-based index
  total: number;
}
```

### `TextInput`

```typescript
interface TextInputProps {
  value: string;
  onChange: (text: string) => void;
  onUseDemo: () => void;
}
```

### `ThemeToggle`

```typescript
interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
}
```

## 8. Tailwind Dark Mode Strategy

- `darkMode: 'class'` (Tailwind v4: set in CSS with `@custom-variant dark (&:where(.dark, .dark *))` or equivalent).
- `useTheme` adds/removes `class="dark"` on `<html>`.
- All components use `dark:` Tailwind variants for color inversions.
- Default = dark; light mode is the opt-in variant.

## 9. Key Design Tokens (Tailwind custom theme)

| Token        | Dark value | Light value |
| ------------ | ---------- | ----------- |
| Background   | `#0D0F12`  | `#F5F5F5`   |
| Surface      | `#161A20`  | `#FFFFFF`   |
| Text primary | `#F0F0F0`  | `#1A1A1A`   |
| Text muted   | `#6B7280`  | `#6B7280`   |
| ORP accent   | `#5B8DEF`  | `#3B6FD4`   |
| Border       | `#2D3139`  | `#E0E0E0`   |

## 10. Demo Text

Located in `src/data/demoText.ts`. A single paragraph mixing English, Catalan, and Spanish that showcases a variety of word lengths (1–15+ characters) to demonstrate the ORP algorithm visually.

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
