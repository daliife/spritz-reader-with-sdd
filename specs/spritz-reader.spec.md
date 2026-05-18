# Spritz Reader — Business Specification

## 1. Overview

A web application that demonstrates the **Spritz speed-reading technique**: words from a text are displayed one at a time at a configurable rate (WPM), each word visually anchored at its **Optimal Recognition Point (ORP)** — the specific letter the human eye should focus on for fastest recognition. The goal is to show users they can read faster than they think without losing comprehension.

## 2. Goals

- Demonstrate the Spritz reading method interactively in a browser.
- Allow users to experience different reading speeds (WPM) in real time.
- Support both a curated demo text and custom user-provided text.
- Provide a clean, distraction-free UI with light and dark modes.
- Support English, Catalan, and Spanish — both the interface and the demo text adapt to the selected language.

## 3. Non-Goals

- No user accounts, authentication, or data persistence beyond theme and language preference.
- No text-to-speech, audio, or server-side processing.
- No font size controls in this version.
- No E2E test suite in this version.

## 4. User Stories

### US-01 — Speed Reader Display

> As a visitor, I want to see one word at a time displayed at the center of the screen, with one letter highlighted in a distinct color, so that I can focus my eyes and read at the configured speed.

**Acceptance Criteria:**

- [ ] Each word is split into three parts: characters before ORP, the ORP character, characters after ORP.
- [ ] The ORP character is rendered in a distinct accent color (blue).
- [ ] A vertical focal guide line is drawn at the ORP position, aligned so the pivot letter is always centered at the same fixed point.
- [ ] The pivot letter is always positioned at the horizontal center of the display, regardless of word length (using ch-based offset in a monospaced font).
- [ ] The word changes automatically at the configured WPM rate during playback.
- [ ] The display font is monospaced so that ORP alignment is stable.

### US-02 — Playback Controls

> As a user, I want play, pause, and restart controls so I can manage my reading session at will.

**Acceptance Criteria:**

- [ ] A Play/Pause button toggles playback. When paused, the current word stays on screen.
- [ ] Clicking anywhere on the reader display card also toggles play/pause (idle → play, playing → pause, paused → play). Has no effect when finished.
- [ ] A Restart button resets the reader to the first word.
- [ ] Playback state is clearly communicated via the button label/icon.
- [ ] When the last word is reached, playback stops automatically and the finished state is shown.

### US-03 — WPM Speed Control

> As a user, I want to adjust reading speed from 100 to 1000 WPM so I can find my comfortable pace.

**Acceptance Criteria:**

- [ ] Five preset speed buttons are shown: **150 / 250 / 350 / 500 / 750 WPM**.
- [ ] The active preset is visually highlighted (accent color).
- [ ] Changing speed during playback takes effect immediately without restarting.
- [ ] Keyboard arrows (← / →) also adjust WPM in steps of 50 within the 100–1000 range.

### US-04 — ~~Progress Indicator~~ _(removed)_

> Removed in favour of a cleaner, distraction-free interface. The progress bar and word counter have been eliminated.

### US-05 — Custom Text Input

> As a user, I want to paste my own text so I can speed-read content I choose.

**Acceptance Criteria:**

- [ ] A textarea is available for the user to input custom text.
- [ ] A toggle/button switches between demo text and custom text.
- [ ] When custom text is empty, the app falls back to demo text.
- [ ] Changing text resets the reader to the first word.

### US-06 — Demo Text

> As a visitor, I want a preloaded demo paragraph in the selected language so I can try the reader immediately without typing.

**Acceptance Criteria:**

- [ ] The app loads with a demo paragraph by default (English on first visit).
- [ ] Each supported language (EN / CA / ES) has its own dedicated demo paragraph.
- [ ] When the user changes the interface language while the demo text is active, the demo paragraph switches to the new language automatically.
- [ ] If the user has entered custom text, a language change does not overwrite it.

### US-07 — Light / Dark Mode

> As a user, I want to toggle between light and dark mode so I can read comfortably in any environment.

**Acceptance Criteria:**

- [ ] A toggle button switches between light and dark themes.
- [ ] The selected theme is persisted in `localStorage` and restored on next visit.
- [ ] Dark mode is the default.

### US-08 — Keyboard Shortcuts

> As a power user, I want keyboard shortcuts so I can control the reader without using the mouse.

**Acceptance Criteria:**

- [ ] `Space` — play / pause.
- [ ] `R` — restart.
- [ ] `←` arrow — decrease WPM by 50.
- [ ] `→` arrow — increase WPM by 50.
- [ ] Shortcuts are documented in the UI (e.g., tooltip or small legend).

### US-09 — Language Selector

> As a user, I want to switch the interface language between English, Catalan, and Spanish so that the UI and demo text are shown in my preferred language.

**Acceptance Criteria:**

- [ ] A language selector dropdown is displayed in the header, next to the theme toggle.
- [ ] Supported languages: **EN** (English), **CA** (Catalan), **ES** (Spanish).
- [ ] Selecting a language updates all UI strings (button labels, placeholders, messages) immediately.
- [ ] The selected language is persisted in `localStorage` under the key `'spritz-language'` and restored on next visit.
- [ ] The default language on first visit is English (`'en'`).
- [ ] If the reader is showing the demo text when the language changes, the demo text is replaced with the equivalent paragraph in the new language and playback restarts.

## 5. Design Requirements

- **Style**: Minimalist; dark background by default (near-black `#09090B`), high-contrast white text.
- **ORP accent color**: Blue (`#6481F8` dark / `#4A6CF7` light).
- **Typography**: Monospaced font for the word display (`JetBrains Mono`, `Courier New` fallback). Each character is exactly `1ch` wide, enabling precise pivot centering.
- **Layout**: Centered single-column; max-width constrained (~900px) for comfortable reading.
- **Responsive**: Functional on mobile (≥ 375px wide).
- **Accessibility**: All interactive controls must have ARIA labels; focus styles must be visible.

## 6. Constraints

- **Package manager**: `pnpm` exclusively — no `npm` or `yarn`.
- **Deployment**: Static site — no backend, no API calls.
- **Framework**: React 19 + Vite 6 + TypeScript.
- **Styling**: Tailwind CSS v4 (`dark:` variant via `class` on `<html>`).
- **Testing**: Vitest unit tests for utilities and hooks.
