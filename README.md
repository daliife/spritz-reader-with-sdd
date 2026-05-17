# Spritz Reader

A minimalist web app that demonstrates the **Spritz speed-reading technique**: words are displayed one at a time, each aligned at its **Optimal Recognition Point (ORP)** — the specific letter the eye focuses on for fastest recognition.

Built with **React 19 + Vite 6 + TypeScript + Tailwind CSS v4**, following the **Spec-Driven Development (SDD)** methodology.

---

## Features

- One-word-at-a-time display with ORP letter highlighted in accent blue
- Adjustable reading speed: **100 – 1000 WPM** (step 50)
- Play / Pause / Restart controls
- Progress bar with word counter
- Custom text input + built-in multilingual demo paragraph (EN / CA / ES)
- Light and dark mode (persisted in `localStorage`, dark by default)
- Keyboard shortcuts: `Space` play/pause · `R` restart · `← →` adjust WPM

---

## SDD — Spec-Driven Development

This project follows the 3-step SDD methodology. The three files in `specs/` are the **source of truth** and were written before any code:

| File                                                           | Purpose                                                             |
| -------------------------------------------------------------- | ------------------------------------------------------------------- |
| [`specs/spritz-reader.spec.md`](specs/spritz-reader.spec.md)   | Business requirements, user stories, acceptance criteria            |
| [`specs/spritz-reader.plan.md`](specs/spritz-reader.plan.md)   | Technical architecture, component API, ORP algorithm, state machine |
| [`specs/spritz-reader.tasks.md`](specs/spritz-reader.tasks.md) | Implementation task checklist (updated as work progresses)          |

> Any change to the app should start with an update to the relevant spec file.

---

## Tech Stack

| Layer           | Choice                                       |
| --------------- | -------------------------------------------- |
| Framework       | React 19                                     |
| Build tool      | Vite 6                                       |
| Language        | TypeScript 5                                 |
| Styling         | Tailwind CSS v4 (dark mode via `class`)      |
| Testing         | Vitest + Testing Library                     |
| Package manager | **pnpm** (required — do not use npm or yarn) |

---

## Project Structure

```
spritz-reader-with-sdd/
├── specs/                        # SDD source of truth
│   ├── spritz-reader.spec.md
│   ├── spritz-reader.plan.md
│   └── spritz-reader.tasks.md
├── src/
│   ├── components/
│   │   ├── SpeedReader/          # ORP word display
│   │   ├── Controls/             # Play/Pause/WPM controls
│   │   ├── ProgressBar/          # Reading progress
│   │   ├── TextInput/            # Custom text + demo toggle
│   │   └── ThemeToggle/          # Light/dark switch
│   ├── hooks/
│   │   ├── useSpeedReader.ts     # Core state machine
│   │   └── useTheme.ts           # Theme toggle + persistence
│   ├── utils/
│   │   ├── orp.ts                # ORP index algorithm
│   │   └── textParser.ts         # Raw text → word array
│   ├── data/
│   │   └── demoText.ts           # Built-in demo paragraph
│   └── App.tsx                   # Root layout + keyboard shortcuts
├── vite.config.ts
├── tsconfig.app.json
└── package.json
```

---

## Getting Started

```bash
# Install dependencies (pnpm required)
pnpm install

# Start dev server
pnpm dev

# Run unit tests
pnpm test

# Production build
pnpm build

# Preview production build
pnpm preview

# Test coverage report
pnpm test:coverage
```

---

## ORP Algorithm

The Optimal Recognition Point index (0-based) is determined by word length:

| Word length | ORP index |
| ----------- | --------- |
| 1           | 0         |
| 2 – 5       | 1         |
| 6 – 9       | 2         |
| 10 – 13     | 3         |
| 14+         | 4         |

The word is then split into three spans: `left · pivot (accent) · right`.

---

## Testing

49 unit tests across utilities, hooks, and components:

```bash
pnpm test        # watch mode
pnpm vitest run  # single run
```

---

## License

MIT
